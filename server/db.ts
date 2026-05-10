import fs from 'node:fs';
import path from 'node:path';
import {loadSqliteDb, saveSqliteDb} from './sqlite.ts';
import type {DatabaseShape} from './types.ts';

const dataDir = path.resolve(process.cwd(), 'server', 'data');
const databaseFile = path.join(dataDir, 'db.json');

let databaseCache: DatabaseShape | null = null;

function ensureDatabaseFile(): void {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, {recursive: true});
  }

  if (!fs.existsSync(databaseFile)) {
    throw new Error(`Missing database seed file at ${databaseFile}`);
  }
}

export function loadDb(): DatabaseShape {
  if (isSqliteStore()) {
    return loadSqliteDb();
  }

  ensureDatabaseFile();

  if (!databaseCache) {
    const file = fs.readFileSync(databaseFile, 'utf8');
    databaseCache = JSON.parse(file) as DatabaseShape;
  }

  return databaseCache;
}

export function saveDb(nextDb: DatabaseShape): void {
  if (isSqliteStore()) {
    saveSqliteDb(nextDb);
    return;
  }

  ensureDatabaseFile();
  databaseCache = nextDb;
  fs.writeFileSync(databaseFile, `${JSON.stringify(nextDb, null, 2)}\n`, 'utf8');
}

export function updateDb(mutator: (db: DatabaseShape) => void): DatabaseShape {
  const db = loadDb();
  mutator(db);
  saveDb(db);
  return db;
}

function isSqliteStore(): boolean {
  return getDataStore() === 'sqlite';
}

function getDataStore(): 'json' | 'sqlite' {
  const dataStore = (process.env.DATA_STORE ?? 'json').toLowerCase();
  if (dataStore === 'json' || dataStore === 'sqlite') {
    return dataStore;
  }

  throw new Error(`Unsupported DATA_STORE value: ${dataStore}`);
}
