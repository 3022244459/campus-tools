export type TrustProxySetting = boolean | number | string;

export interface ServerConfig {
  appEnv: string;
  corsOrigins: string[];
  trustProxy: TrustProxySetting;
  requestBodyLimit: string;
  sessionTtlHours: number;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  logMaxBytes: number;
  alertWebhookUrl?: string;
  alertMinStatusCode: number;
}

const defaultCorsOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'capacitor://localhost',
  'http://localhost',
];

const defaultSessionTtlHours = 168;
const maxSessionTtlHours = 720;

export function getServerConfig(env: NodeJS.ProcessEnv = process.env): ServerConfig {
  const config = {
    appEnv: env.APP_ENV || env.NODE_ENV || 'development',
    corsOrigins: parseCsv(env.CORS_ORIGINS, defaultCorsOrigins),
    trustProxy: parseTrustProxy(env.TRUST_PROXY),
    requestBodyLimit: parseRequestBodyLimit(env.REQUEST_BODY_LIMIT),
    sessionTtlHours: parseSessionTtlHours(env.SESSION_TTL_HOURS),
    rateLimitWindowMs: parsePositiveInteger(env.RATE_LIMIT_WINDOW_MS, 60_000),
    rateLimitMaxRequests: parsePositiveInteger(env.RATE_LIMIT_MAX_REQUESTS, 120),
    logMaxBytes: parsePositiveInteger(env.LOG_MAX_BYTES, 5_000_000),
    alertWebhookUrl: env.ALERT_WEBHOOK_URL?.trim() || undefined,
    alertMinStatusCode: parsePositiveInteger(env.ALERT_MIN_STATUS_CODE, 500),
  };

  validateServerEnvironment(env, config);
  return config;
}

export function validateServerEnvironment(env: NodeJS.ProcessEnv, config: ServerConfig): void {
  if (!isProductionLikeEnvironment(config.appEnv)) {
    return;
  }

  const configuredCors = Boolean(env.CORS_ORIGINS?.trim());
  if (!configuredCors) {
    throw new Error('CORS_ORIGINS must be explicitly set for staging, pilot, or production.');
  }

  if (config.corsOrigins.includes('*')) {
    throw new Error('CORS_ORIGINS cannot contain "*" for staging, pilot, or production.');
  }

  if (!env.TRUST_PROXY?.trim() || config.trustProxy === false) {
    throw new Error('TRUST_PROXY must be explicitly enabled for staging, pilot, or production reverse-proxy deployments.');
  }

  if (!env.REQUEST_BODY_LIMIT?.trim()) {
    throw new Error('REQUEST_BODY_LIMIT must be explicitly set for staging, pilot, or production.');
  }

  if (!isRequestBodyLimit(env.REQUEST_BODY_LIMIT)) {
    throw new Error('REQUEST_BODY_LIMIT must use a compact size such as 64kb, 100kb, or 1mb.');
  }

  if (!env.SESSION_TTL_HOURS?.trim()) {
    throw new Error('SESSION_TTL_HOURS must be explicitly set for staging, pilot, or production.');
  }

  if (env.RATE_LIMIT_WINDOW_MS?.trim() && !isIntegerInRange(env.RATE_LIMIT_WINDOW_MS, 1000, Number.MAX_SAFE_INTEGER)) {
    throw new Error('RATE_LIMIT_WINDOW_MS must be an integer greater than or equal to 1000.');
  }

  if (env.RATE_LIMIT_MAX_REQUESTS?.trim() && !isIntegerInRange(env.RATE_LIMIT_MAX_REQUESTS, 1, 10_000)) {
    throw new Error('RATE_LIMIT_MAX_REQUESTS must be an integer between 1 and 10000.');
  }

  const hasDeployableOrigin = config.corsOrigins.some((origin) =>
    origin.startsWith('https://') || origin === 'capacitor://localhost',
  );
  if (!hasDeployableOrigin) {
    throw new Error('CORS_ORIGINS must include an HTTPS origin or capacitor://localhost for staging, pilot, or production.');
  }

  const mockFallback = env.VITE_ENABLE_MOCK_FALLBACK?.trim().toLowerCase();
  if (mockFallback === 'true' || mockFallback === '1' || mockFallback === 'yes') {
    throw new Error('VITE_ENABLE_MOCK_FALLBACK must be false for staging, pilot, or production.');
  }

  const showDemoCredentials = env.VITE_SHOW_DEMO_CREDENTIALS?.trim().toLowerCase();
  if (showDemoCredentials === 'true' || showDemoCredentials === '1' || showDemoCredentials === 'yes') {
    throw new Error('VITE_SHOW_DEMO_CREDENTIALS must be false for staging, pilot, or production.');
  }

  const dataStore = (env.DATA_STORE ?? 'json').toLowerCase();
  if (dataStore !== 'sqlite') {
    throw new Error('DATA_STORE must be sqlite for staging, pilot, or production until PostgreSQL support is implemented.');
  }

  if (config.rateLimitWindowMs < 1000 || config.rateLimitMaxRequests > 10_000) {
    throw new Error('Rate limit settings are outside the allowed production range.');
  }

  if (env.LOG_MAX_BYTES?.trim() && !isIntegerInRange(env.LOG_MAX_BYTES, 100_000, Number.MAX_SAFE_INTEGER)) {
    throw new Error('LOG_MAX_BYTES must be an integer greater than or equal to 100000.');
  }

  if (config.logMaxBytes < 100_000) {
    throw new Error('LOG_MAX_BYTES must be at least 100000 for staging, pilot, or production.');
  }

  if (config.alertWebhookUrl && !config.alertWebhookUrl.startsWith('https://')) {
    throw new Error('ALERT_WEBHOOK_URL must use HTTPS for staging, pilot, or production.');
  }

  if (env.ALERT_MIN_STATUS_CODE?.trim() && !isIntegerInRange(env.ALERT_MIN_STATUS_CODE, 400, 599)) {
    throw new Error('ALERT_MIN_STATUS_CODE must be an HTTP error status code between 400 and 599.');
  }
}

export function isProductionLikeEnvironment(appEnv: string): boolean {
  return ['production', 'staging', 'pilot'].includes(appEnv.toLowerCase());
}

function parseCsv(value: string | undefined, fallback: string[]): string[] {
  if (!value) {
    return fallback;
  }

  const items = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  return items.length ? items : fallback;
}

function parsePositiveInteger(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function parseTrustProxy(value: string | undefined): TrustProxySetting {
  const normalized = value?.trim();
  if (!normalized) {
    return false;
  }

  const lower = normalized.toLowerCase();
  if (['false', '0', 'off', 'no'].includes(lower)) {
    return false;
  }

  if (['true', 'on', 'yes'].includes(lower)) {
    return true;
  }

  const numericValue = Number(normalized);
  if (Number.isInteger(numericValue) && numericValue >= 0) {
    return numericValue;
  }

  return normalized;
}

function parseRequestBodyLimit(value: string | undefined): string {
  const normalized = value?.trim().toLowerCase();
  return normalized && isRequestBodyLimit(normalized) ? normalized : '100kb';
}

function parseSessionTtlHours(value: string | undefined): number {
  const normalized = value?.trim();
  if (!normalized) {
    return defaultSessionTtlHours;
  }

  const parsed = Number(normalized);
  if (!isIntegerInRange(normalized, 1, maxSessionTtlHours)) {
    throw new Error(`SESSION_TTL_HOURS must be an integer between 1 and ${maxSessionTtlHours}.`);
  }

  return parsed;
}

function isRequestBodyLimit(value: string | undefined): boolean {
  return Boolean(value?.trim().toLowerCase().match(/^[1-9]\d*(b|kb|mb)$/));
}

function isIntegerInRange(value: string | undefined, min: number, max: number): boolean {
  const parsed = Number(value?.trim());
  return Number.isInteger(parsed) && parsed >= min && parsed <= max;
}
