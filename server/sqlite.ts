import fs from 'node:fs';
import path from 'node:path';
import {DatabaseSync} from 'node:sqlite';
import {hydrateFromNormalizedTables, syncNormalizedTables} from './sqliteNormalized.ts';
import type {DatabaseShape} from './types.ts';

const dataDir = path.resolve(process.cwd(), 'server', 'data');
const migrationsDir = path.resolve(process.cwd(), 'server', 'migrations');
const jsonSeedFile = path.join(dataDir, 'db.json');
const defaultSqliteFile = path.join(dataDir, 'campus.sqlite');

let sqliteConnection: DatabaseSync | null = null;
let sqliteConnectionPath = '';
let sqliteCache: DatabaseShape | null = null;

export function getSqliteDatabaseFile(): string {
  return path.resolve(process.env.SQLITE_DB_FILE || defaultSqliteFile);
}

export function migrateSqliteDb(databaseFile: string = getSqliteDatabaseFile()): void {
  const database = openSqlite(databaseFile);
  database.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL
    );
  `);

  const migrationFiles = fs.existsSync(migrationsDir)
    ? fs.readdirSync(migrationsDir).filter((file) => file.endsWith('.sql')).sort()
    : [];

  for (const migrationFile of migrationFiles) {
    const applied = database
      .prepare('SELECT version FROM schema_migrations WHERE version = ?')
      .get(migrationFile);

    if (applied) {
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationsDir, migrationFile), 'utf8');
    database.exec('BEGIN');
    try {
      database.exec(sql);
      database
        .prepare('INSERT INTO schema_migrations (version, applied_at) VALUES (?, ?)')
        .run(migrationFile, new Date().toISOString());
      database.exec('COMMIT');
    } catch (error) {
      database.exec('ROLLBACK');
      throw error;
    }
  }
}

export function seedSqliteDb(
  databaseFile: string = getSqliteDatabaseFile(),
  options: {force?: boolean} = {},
): DatabaseShape {
  migrateSqliteDb(databaseFile);

  if (!fs.existsSync(jsonSeedFile)) {
    throw new Error(`Missing JSON seed file at ${jsonSeedFile}`);
  }

  const database = openSqlite(databaseFile);
  const existing = database.prepare('SELECT id FROM app_state WHERE id = 1').get();
  if (existing && !options.force) {
    return loadSqliteDb(databaseFile);
  }

  const seed = JSON.parse(fs.readFileSync(jsonSeedFile, 'utf8')) as DatabaseShape;
  saveSqliteDb(seed, databaseFile);
  return seed;
}

export function loadSqliteDb(databaseFile: string = getSqliteDatabaseFile()): DatabaseShape {
  migrateSqliteDb(databaseFile);

  if (!sqliteCache) {
    const database = openSqlite(databaseFile);
    const row = database.prepare('SELECT data_json FROM app_state WHERE id = 1').get() as
      | {data_json: string}
      | undefined;

    if (!row) {
      return seedSqliteDb(databaseFile);
    }

    const baseDb = JSON.parse(row.data_json) as DatabaseShape;
    sqliteCache = hydrateFromNormalizedTables(database, baseDb);
  }

  return sqliteCache;
}

export function saveSqliteDb(nextDb: DatabaseShape, databaseFile: string = getSqliteDatabaseFile()): void {
  migrateSqliteDb(databaseFile);
  const previousCache = sqliteCache;
  const database = openSqlite(databaseFile);
  database.exec('BEGIN IMMEDIATE');
  try {
    database
      .prepare(`
        INSERT INTO app_state (id, data_json, updated_at)
        VALUES (1, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          data_json = excluded.data_json,
          updated_at = excluded.updated_at
      `)
      .run(JSON.stringify(nextDb, null, 2), new Date().toISOString());
    syncNormalizedTables(database, nextDb, {transaction: false});
    database.exec('COMMIT');
    sqliteCache = nextDb;
  } catch (error) {
    database.exec('ROLLBACK');
    sqliteCache = previousCache;
    throw error;
  }
}

export function resetSqliteConnectionForTests(): void {
  sqliteConnection?.close();
  sqliteConnection = null;
  sqliteConnectionPath = '';
  sqliteCache = null;
}

function openSqlite(databaseFile: string): DatabaseSync {
  const resolvedFile = path.resolve(databaseFile);
  if (!fs.existsSync(path.dirname(resolvedFile))) {
    fs.mkdirSync(path.dirname(resolvedFile), {recursive: true});
  }

  if (!sqliteConnection || sqliteConnectionPath !== resolvedFile) {
    sqliteConnection?.close();
    sqliteConnection = new DatabaseSync(resolvedFile);
    configureSqliteConnection(sqliteConnection);
    sqliteConnectionPath = resolvedFile;
  }

  return sqliteConnection;
}

function configureSqliteConnection(database: DatabaseSync): void {
  database.exec(`
    PRAGMA foreign_keys = ON;
    PRAGMA busy_timeout = 5000;
    PRAGMA journal_mode = WAL;
  `);
}
