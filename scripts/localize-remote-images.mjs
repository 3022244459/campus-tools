import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import http from 'node:http';
import https from 'node:https';
import net from 'node:net';
import tls from 'node:tls';

const projectRoot = process.cwd();
const srcDir = path.join(projectRoot, 'src');
const publicImagesDir = path.join(projectRoot, 'public', 'images');

const extsByContentType = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/gif', '.gif'],
  ['image/svg+xml', '.svg'],
  ['image/avif', '.avif'],
]);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function walk(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walk(fullPath));
      continue;
    }

    if (entry.isFile() && /\.(tsx|ts|css|html)$/.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

function getExtension(url, contentType) {
  const pathname = new URL(url).pathname;
  const pathnameExt = path.extname(pathname);
  if (pathnameExt) return pathnameExt;
  return extsByContentType.get(contentType ?? '') ?? '.bin';
}

function isRetryableStatus(status) {
  return status === 408 || status === 429 || (status >= 500 && status <= 599);
}

function getProxyUrl() {
  return (
    process.env.IMAGE_PROXY ??
    process.env.HTTPS_PROXY ??
    process.env.https_proxy ??
    process.env.HTTP_PROXY ??
    process.env.http_proxy ??
    process.env.ALL_PROXY ??
    process.env.all_proxy ??
    ''
  );
}

function isRetryableError(error) {
  const code = error?.code;
  return (
    code === 'ECONNRESET' ||
    code === 'ETIMEDOUT' ||
    code === 'EAI_AGAIN'
  );
}

const httpsProxyAgents = new Map();

class HttpsProxyAgent extends https.Agent {
  constructor({ proxyUrl, timeoutMs }) {
    super({ keepAlive: true });
    this.proxyUrl = proxyUrl;
    this.timeoutMs = timeoutMs;
  }

  createConnection(options, callback) {
    const destinationHost = options.host ?? options.hostname ?? options.servername;
    const destinationPort = Number(options.port || 443);

    connectHttpProxyTunnel({
      proxyUrl: this.proxyUrl,
      destinationHost,
      destinationPort,
      timeoutMs: this.timeoutMs,
    })
      .then((socket) => {
        const tlsSocket = tls.connect({
          socket,
          servername: destinationHost,
        });

        tlsSocket.once('secureConnect', () => callback(null, tlsSocket));
        tlsSocket.once('error', (error) => callback(error));
      })
      .catch((error) => callback(error));
  }
}

function getHttpsProxyAgent(proxyUrl, timeoutMs) {
  const key = `${proxyUrl}@@${timeoutMs}`;
  const existing = httpsProxyAgents.get(key);
  if (existing) return existing;
  const agent = new HttpsProxyAgent({ proxyUrl, timeoutMs });
  httpsProxyAgents.set(key, agent);
  return agent;
}

async function connectHttpProxyTunnel({ proxyUrl, destinationHost, destinationPort, timeoutMs }) {
  const proxy = new URL(proxyUrl);
  const proxyHost = proxy.hostname;
  const proxyPort = Number(proxy.port || 80);

  return new Promise((resolve, reject) => {
    const socket = net.connect({ host: proxyHost, port: proxyPort });

    const onError = (error) => {
      socket.destroy();
      reject(error);
    };

    socket.setTimeout(timeoutMs, () => {
      const error = new Error('timeout');
      error.code = 'ETIMEDOUT';
      onError(error);
    });

    socket.once('error', onError);
    socket.once('connect', () => {
      const auth =
        proxy.username || proxy.password
          ? `Proxy-Authorization: Basic ${Buffer.from(
              `${decodeURIComponent(proxy.username)}:${decodeURIComponent(proxy.password)}`,
            ).toString('base64')}\r\n`
          : '';

      const connectRequest =
        `CONNECT ${destinationHost}:${destinationPort} HTTP/1.1\r\n` +
        `Host: ${destinationHost}:${destinationPort}\r\n` +
        `Proxy-Connection: keep-alive\r\n` +
        auth +
        `\r\n`;

      socket.write(connectRequest);

      let buffer = Buffer.alloc(0);
      const onData = (chunk) => {
        buffer = Buffer.concat([buffer, chunk]);
        const headerEnd = buffer.indexOf('\r\n\r\n');
        if (headerEnd === -1) return;
        socket.off('data', onData);

        const headerText = buffer.slice(0, headerEnd).toString('utf8');
        const firstLine = headerText.split('\r\n')[0] ?? '';
        const match = firstLine.match(/^HTTP\/\d+\.\d+\s+(\d+)/i);
        const statusCode = match ? Number(match[1]) : 0;

        if (statusCode !== 200) {
          const error = new Error(`Proxy CONNECT failed (${statusCode || 'unknown'})`);
          error.code = 'PROXY_CONNECT_FAILED';
          socket.destroy(error);
          reject(error);
          return;
        }

        const remainder = buffer.slice(headerEnd + 4);
        if (remainder.length > 0) socket.unshift(remainder);
        resolve(socket);
      };

      socket.on('data', onData);
    });
  });
}

async function requestBuffer(url, { headers, timeoutMs, maxRedirects, proxyUrl }) {
  const urlObject = new URL(url);

  return new Promise((resolve, reject) => {
    const isHttps = urlObject.protocol === 'https:';
    const shouldProxy = Boolean(proxyUrl);

    if (shouldProxy && !/^https?:$/i.test(new URL(proxyUrl).protocol)) {
      const error = new Error(`Unsupported proxy protocol: ${new URL(proxyUrl).protocol}`);
      error.code = 'UNSUPPORTED_PROXY_PROTOCOL';
      reject(error);
      return;
    }

    const onResponse = (response) => {
      const statusCode = response.statusCode ?? 0;
      const location = response.headers.location;

      if (
        (statusCode === 301 ||
          statusCode === 302 ||
          statusCode === 303 ||
          statusCode === 307 ||
          statusCode === 308) &&
        location &&
        maxRedirects > 0
      ) {
        response.resume();
        const redirectUrl = new URL(location, urlObject).toString();
        requestBuffer(redirectUrl, {
          headers,
          timeoutMs,
          maxRedirects: maxRedirects - 1,
          proxyUrl,
        })
          .then(resolve)
          .catch(reject);
        return;
      }

      const contentType = String(response.headers['content-type'] ?? '').split(';')[0];
      const chunks = [];

      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve({ statusCode, buffer: Buffer.concat(chunks), contentType }));
      response.on('error', reject);
    };

    const onRequestError = (error) => reject(error);

    if (!shouldProxy) {
      const client = isHttps ? https : http;
      const request = client.request(
        urlObject,
        {
          method: 'GET',
          headers,
        },
        onResponse,
      );

      request.on('error', onRequestError);
      request.setTimeout(timeoutMs, () => {
        const error = new Error('timeout');
        error.code = 'ETIMEDOUT';
        request.destroy(error);
      });
      request.end();
      return;
    }

    if (!isHttps) {
      const proxy = new URL(proxyUrl);
      const request = http.request(
        {
          host: proxy.hostname,
          port: Number(proxy.port || 80),
          method: 'GET',
          path: urlObject.toString(),
          headers: {
            ...headers,
            Host: urlObject.host,
          },
        },
        onResponse,
      );

      request.on('error', onRequestError);
      request.setTimeout(timeoutMs, () => {
        const error = new Error('timeout');
        error.code = 'ETIMEDOUT';
        request.destroy(error);
      });
      request.end();
      return;
    }

    const request = https.request(
      {
        host: urlObject.hostname,
        port: Number(urlObject.port || 443),
        method: 'GET',
        path: `${urlObject.pathname}${urlObject.search}`,
        headers: {
          ...headers,
          Host: urlObject.host,
        },
        agent: getHttpsProxyAgent(proxyUrl, timeoutMs),
      },
      onResponse,
    );

    request.on('error', onRequestError);
    request.setTimeout(timeoutMs, () => {
      const error = new Error('timeout');
      error.code = 'ETIMEDOUT';
      request.destroy(error);
    });
    request.end();
  });
}

async function download(url) {
  let lastError = null;
  const proxyUrl = getProxyUrl();
  const headers = {
    Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    'User-Agent': 'Mozilla/5.0',
    Referer: 'https://ai.studio/',
  };

  for (let attempt = 0; attempt <= 3; attempt += 1) {
    try {
      const { statusCode, buffer, contentType } = await requestBuffer(url, {
        headers,
        timeoutMs: 60_000,
        maxRedirects: 5,
        proxyUrl,
      });

      if (statusCode >= 200 && statusCode <= 299) {
        return { buffer, contentType };
      }

      if (isRetryableStatus(statusCode) && attempt < 3) {
        await sleep(250 * 2 ** attempt);
        continue;
      }

      const error = new Error(`HTTP ${statusCode}`);
      error.code = `HTTP_${statusCode}`;
      throw error;
    } catch (error) {
      lastError = error;
      if (!isRetryableError(error) || attempt >= 3) {
        throw error;
      }
      await sleep(250 * 2 ** attempt);
    }
  }

  throw lastError ?? new Error('download failed');
}

async function main() {
  fs.mkdirSync(publicImagesDir, { recursive: true });

  const files = walk(srcDir);
  const urls = new Map();
  const urlRegex = /https:\/\/lh3\.googleusercontent\.com\/[A-Za-z0-9_\-./?=&%]+/g;

  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    const matches = text.match(urlRegex) ?? [];
    for (const match of matches) {
      urls.set(match, null);
    }
  }

  console.log(`Found ${urls.size} unique remote images.`);

  let index = 1;
  const failures = [];
  for (const url of urls.keys()) {
    const nameSeed = crypto.createHash('sha1').update(url).digest('hex').slice(0, 10);
    const baseName = `remote-${String(index).padStart(2, '0')}-${nameSeed}`;
    try {
      console.log(`Downloading ${baseName}`);
      const { buffer, contentType } = await download(url);
      const ext = getExtension(url, contentType);
      const filename = `${baseName}${ext}`;
      const outputPath = path.join(publicImagesDir, filename);
      const publicPath = `./images/${filename}`;

      fs.writeFileSync(outputPath, buffer);
      urls.set(url, publicPath);
      index += 1;
    } catch (error) {
      failures.push({ url, message: error?.message ?? String(error) });
      console.warn(`Failed: ${url} (${error?.message ?? error})`);
    }
  }

  for (const file of files) {
    let text = fs.readFileSync(file, 'utf8');
    let changed = false;

    for (const [url, localPath] of urls.entries()) {
      if (!localPath || !text.includes(url)) continue;
      text = text.split(url).join(localPath);
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(file, text);
      console.log(`Updated ${path.relative(projectRoot, file)}`);
    }
  }

  if (failures.length > 0) {
    console.warn(`Failed to download ${failures.length} images.`);
  }
  console.log('Done.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
