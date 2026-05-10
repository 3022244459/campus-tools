import {loadServerEnv} from './loadEnv.ts';
import {createApp} from './app.ts';

loadServerEnv();

const port = Number(process.env.API_PORT ?? 8787);
const app = createApp();
const shutdownTimeoutMs = 10_000;

const server = app.listen(port, () => {
  console.log(`campus-tools-api listening on http://127.0.0.1:${port}`);
});

let isShuttingDown = false;

function shutdown(signal: NodeJS.Signals): void {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.log(`Received ${signal}. Closing campus-tools-api...`);

  const forceExitTimer = setTimeout(() => {
    console.error(`Forced shutdown after ${shutdownTimeoutMs}ms.`);
    process.exit(1);
  }, shutdownTimeoutMs);
  forceExitTimer.unref();

  server.close((error) => {
    clearTimeout(forceExitTimer);
    if (error) {
      console.error('Failed to close campus-tools-api cleanly.', error);
      process.exit(1);
    }

    console.log('campus-tools-api stopped.');
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
