import fs from 'node:fs';
import path from 'node:path';

const logsDir = path.resolve(process.cwd(), 'server', 'logs');
const logFile = path.join(logsDir, 'server.log');
const defaultMaxLogBytes = 5_000_000;

interface WriteLogOptions {
  filePath?: string;
  maxBytes?: number;
}

function ensureLogDir(filePath: string): void {
  const directory = path.dirname(filePath);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, {recursive: true});
  }
}

export function writeLog(line: string, options: WriteLogOptions = {}): void {
  const targetFile = options.filePath ?? logFile;
  const maxBytes = options.maxBytes ?? defaultMaxLogBytes;
  const nextLine = `${line}\n`;

  ensureLogDir(targetFile);
  rotateLogIfNeeded(targetFile, maxBytes, Buffer.byteLength(nextLine, 'utf8'));
  fs.appendFileSync(targetFile, nextLine, 'utf8');
}

function rotateLogIfNeeded(filePath: string, maxBytes: number, nextBytes: number): void {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const currentSize = fs.statSync(filePath).size;
  if (currentSize + nextBytes <= maxBytes) {
    return;
  }

  const rotatedFile = `${filePath}.1`;
  if (fs.existsSync(rotatedFile)) {
    fs.rmSync(rotatedFile, {force: true});
  }

  fs.renameSync(filePath, rotatedFile);
}
