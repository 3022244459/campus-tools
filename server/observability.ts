import type {NextFunction, Request, Response} from 'express';
import {getAlertDeliverySnapshot, sendFailureAlert, type AlertDeliverySnapshot, type AlertEvent} from './alerting.ts';
import type {ServerConfig} from './config.ts';
import {writeLog} from './logger.ts';

interface RecentFailure {
  timestamp: string;
  method: string;
  path: string;
  statusCode: number;
  durationMs: number;
}

interface MetricsState {
  startedAt: string;
  totalRequests: number;
  inFlightRequests: number;
  statusCounts: Record<string, number>;
  methodCounts: Record<string, number>;
  pathCounts: Record<string, number>;
  durationsMs: number[];
  recentFailures: RecentFailure[];
}

export interface RequestMetricsSnapshot {
  startedAt: string;
  uptimeSeconds: number;
  totalRequests: number;
  inFlightRequests: number;
  statusCounts: Record<string, number>;
  methodCounts: Record<string, number>;
  topPaths: Array<{path: string; count: number}>;
  averageLatencyMs: number;
  p95LatencyMs: number;
  recentFailures: RecentFailure[];
  alerts: AlertDeliverySnapshot;
}

const maxDurations = 500;
const maxRecentFailures = 20;
const maxTrackedPaths = 100;

const metrics: MetricsState = {
  startedAt: new Date().toISOString(),
  totalRequests: 0,
  inFlightRequests: 0,
  statusCounts: {},
  methodCounts: {},
  pathCounts: {},
  durationsMs: [],
  recentFailures: [],
};

let activeConfig: ServerConfig | undefined;

export function createObservabilityMiddleware(config: ServerConfig) {
  activeConfig = config;

  return function observabilityMiddleware(req: Request, res: Response, next: NextFunction) {
    const startedAt = Date.now();
    metrics.inFlightRequests += 1;

    res.on('finish', () => {
      const durationMs = Date.now() - startedAt;
      const path = sanitizePath(req.path);
      const method = req.method.toUpperCase();
      const statusFamily = `${Math.floor(res.statusCode / 100)}xx`;

      metrics.inFlightRequests = Math.max(0, metrics.inFlightRequests - 1);
      metrics.totalRequests += 1;
      increment(metrics.statusCounts, statusFamily);
      increment(metrics.methodCounts, method);
      increment(metrics.pathCounts, path);
      trimObject(metrics.pathCounts, maxTrackedPaths);
      metrics.durationsMs.push(durationMs);
      if (metrics.durationsMs.length > maxDurations) {
        metrics.durationsMs.shift();
      }

      if (res.statusCode >= 400) {
        const failure: AlertEvent = {
          timestamp: new Date().toISOString(),
          method,
          path,
          statusCode: res.statusCode,
          durationMs,
        };

        metrics.recentFailures.unshift(failure);
        metrics.recentFailures = metrics.recentFailures.slice(0, maxRecentFailures);
        sendFailureAlert(config, failure);
      }

      writeLog(`${new Date().toISOString()} ${method} ${path} ${res.statusCode} ${durationMs}ms`, {
        maxBytes: config.logMaxBytes,
      });
    });

    next();
  };
}

export function getRequestMetricsSnapshot(): RequestMetricsSnapshot {
  const durations = [...metrics.durationsMs];
  const totalLatency = durations.reduce((total, value) => total + value, 0);
  const averageLatencyMs = durations.length > 0 ? Math.round(totalLatency / durations.length) : 0;

  return {
    startedAt: metrics.startedAt,
    uptimeSeconds: Math.floor((Date.now() - Date.parse(metrics.startedAt)) / 1000),
    totalRequests: metrics.totalRequests,
    inFlightRequests: metrics.inFlightRequests,
    statusCounts: {...metrics.statusCounts},
    methodCounts: {...metrics.methodCounts},
    topPaths: Object.entries(metrics.pathCounts)
      .map(([path, count]) => ({path, count}))
      .sort((left, right) => right.count - left.count)
      .slice(0, 10),
    averageLatencyMs,
    p95LatencyMs: percentile(durations, 95),
    recentFailures: [...metrics.recentFailures],
    alerts: getAlertDeliverySnapshot(activeConfig),
  };
}

function increment(record: Record<string, number>, key: string): void {
  record[key] = (record[key] ?? 0) + 1;
}

function trimObject(record: Record<string, number>, maxEntries: number): void {
  const entries = Object.entries(record);
  if (entries.length <= maxEntries) {
    return;
  }

  const keep = new Set(
    entries
      .sort((left, right) => right[1] - left[1])
      .slice(0, maxEntries)
      .map(([key]) => key),
  );

  for (const key of Object.keys(record)) {
    if (!keep.has(key)) {
      delete record[key];
    }
  }
}

function percentile(values: number[], percentileValue: number): number {
  if (values.length === 0) {
    return 0;
  }

  const sorted = [...values].sort((left, right) => left - right);
  const index = Math.max(0, Math.ceil((percentileValue / 100) * sorted.length) - 1);
  return sorted[index] ?? 0;
}

function sanitizePath(path: string): string {
  return path.split('?')[0] || '/';
}
