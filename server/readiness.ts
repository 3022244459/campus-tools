import type {ServerConfig} from './config.ts';
import {loadDb} from './db.ts';
import type {DatabaseShape, UserRecord} from './types.ts';
import {getUserRole} from './utils.ts';

type ReadinessStatus = 'ready' | 'not_ready';
type ReadinessCheckStatus = 'ok' | 'fail';

export interface ReadinessCheck {
  name: string;
  status: ReadinessCheckStatus;
  detail: string;
}

export interface ReadinessSnapshot {
  status: ReadinessStatus;
  service: 'campus-tools-api';
  timestamp: string;
  appEnv: string;
  dataStore: string;
  checks: ReadinessCheck[];
}

export function getReadinessSnapshot(config: ServerConfig, env: NodeJS.ProcessEnv = process.env): ReadinessSnapshot {
  const checks: ReadinessCheck[] = [];
  const dataStore = (env.DATA_STORE ?? 'json').toLowerCase();

  try {
    const db = loadDb();
    checks.push(ok('database.load', 'Configured datastore can be loaded.'));
    collectSeedChecks(db, checks);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown datastore error.';
    checks.push(fail('database.load', message));
  }

  return {
    status: checks.every((check) => check.status === 'ok') ? 'ready' : 'not_ready',
    service: 'campus-tools-api',
    timestamp: new Date().toISOString(),
    appEnv: config.appEnv,
    dataStore,
    checks,
  };
}

function collectSeedChecks(db: DatabaseShape, checks: ReadinessCheck[]): void {
  checks.push(check('seed.users.student', hasRole(db.users, 'student'), 'At least one student account is available.'));
  checks.push(check('seed.users.teacher', hasRole(db.users, 'teacher'), 'At least one teacher account is available.'));
  checks.push(check('seed.users.admin', hasRole(db.users, 'admin'), 'At least one admin account is available.'));
  checks.push(check('seed.announcements', db.announcements.length > 0, 'At least one announcement is available.'));
  checks.push(check('seed.courier', Object.keys(db.courierAccounts).length > 0, 'Courier accounts are available.'));
  checks.push(check('seed.wallet', Object.keys(db.walletAccounts).length > 0, 'Wallet accounts are available.'));
  checks.push(check('seed.compare', db.compareCarriers.length > 0, 'Courier compare carriers are available.'));
  checks.push(check('seed.teacherOffice', Object.keys(db.teacherOfficeByUserId).length > 0, 'Teacher office data is available.'));
}

function hasRole(users: UserRecord[], role: 'student' | 'teacher' | 'admin'): boolean {
  return users.some((user) => getUserRole(user) === role);
}

function check(name: string, condition: boolean, detail: string): ReadinessCheck {
  return condition ? ok(name, detail) : fail(name, detail);
}

function ok(name: string, detail: string): ReadinessCheck {
  return {name, status: 'ok', detail};
}

function fail(name: string, detail: string): ReadinessCheck {
  return {name, status: 'fail', detail};
}
