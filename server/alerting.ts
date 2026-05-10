import type {ServerConfig} from './config.ts';

export interface AlertEvent {
  timestamp: string;
  method: string;
  path: string;
  statusCode: number;
  durationMs: number;
}

export interface AlertDeliverySnapshot {
  enabled: boolean;
  minStatusCode: number;
  sentCount: number;
  failedCount: number;
  lastAttemptAt?: string;
  lastSuccessAt?: string;
  lastError?: string;
}

const alertState: Omit<AlertDeliverySnapshot, 'enabled' | 'minStatusCode'> = {
  sentCount: 0,
  failedCount: 0,
};

export function sendFailureAlert(config: ServerConfig, event: AlertEvent): void {
  if (!config.alertWebhookUrl || event.statusCode < config.alertMinStatusCode) {
    return;
  }

  const attemptedAt = new Date().toISOString();
  alertState.lastAttemptAt = attemptedAt;

  void fetch(config.alertWebhookUrl, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      service: 'campus-tools-api',
      appEnv: config.appEnv,
      ...event,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Alert webhook returned ${response.status}.`);
      }

      alertState.sentCount += 1;
      alertState.lastSuccessAt = new Date().toISOString();
      delete alertState.lastError;
    })
    .catch((error: unknown) => {
      alertState.failedCount += 1;
      alertState.lastError = error instanceof Error ? error.message : 'Alert webhook delivery failed.';
    });
}

export function getAlertDeliverySnapshot(config?: ServerConfig): AlertDeliverySnapshot {
  return {
    enabled: Boolean(config?.alertWebhookUrl),
    minStatusCode: config?.alertMinStatusCode ?? 500,
    ...alertState,
  };
}
