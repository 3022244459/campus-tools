import {loadServerEnv} from '../loadEnv.ts';
import fs from 'node:fs';
import path from 'node:path';
import {DatabaseSync} from 'node:sqlite';
import {getSqliteDatabaseFile} from '../sqlite.ts';

loadServerEnv();

const restoreConfirmation = 'overwrite-local-data';
const dataStore = (process.env.DATA_STORE ?? 'json').toLowerCase();
const restoreFile = path.resolve(process.argv[2] || process.env.RESTORE_FILE || '');
const backupDir = path.resolve(process.env.BACKUP_DIR || path.join('server', 'backups'));
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

if (!process.argv[2] && !process.env.RESTORE_FILE) {
  throw new Error('Provide a backup file path: npm.cmd run db:restore -- <backup-file>');
}

if (process.env.RESTORE_CONFIRM !== restoreConfirmation) {
  throw new Error(`Set RESTORE_CONFIRM=${restoreConfirmation} before restoring. Restore overwrites local data.`);
}

if (!fs.existsSync(restoreFile)) {
  throw new Error(`Restore file not found: ${restoreFile}`);
}

fs.mkdirSync(backupDir, {recursive: true});

if (dataStore === 'sqlite') {
  restoreSqlite();
} else if (dataStore === 'json') {
  restoreJson();
} else {
  throw new Error(`Unsupported DATA_STORE value for restore: ${dataStore}`);
}

function restoreSqlite(): void {
  if (!restoreFile.endsWith('.sqlite') && !restoreFile.endsWith('.db')) {
    throw new Error('SQLite restore expects a .sqlite or .db backup file.');
  }

  const targetFile = getSqliteDatabaseFile();
  backupCurrentSqliteFile(targetFile, `pre-restore-sqlite-${timestamp}.sqlite`);
  removeSqliteSidecars(targetFile);
  fs.copyFileSync(restoreFile, targetFile);
  console.log(`SQLite database restored from ${restoreFile} to ${targetFile}`);
}

function restoreJson(): void {
  if (!restoreFile.endsWith('.json')) {
    throw new Error('JSON restore expects a .json backup file.');
  }

  const targetFile = path.resolve(process.cwd(), 'server', 'data', 'db.json');
  backupCurrentFile(targetFile, `pre-restore-json-${timestamp}.json`);
  fs.copyFileSync(restoreFile, targetFile);
  console.log(`JSON database restored from ${restoreFile} to ${targetFile}`);
}

function backupCurrentFile(targetFile: string, backupName: string): void {
  if (!fs.existsSync(targetFile)) {
    return;
  }

  const safetyBackup = path.join(backupDir, backupName);
  fs.copyFileSync(targetFile, safetyBackup);
  console.log(`Current data copied to ${safetyBackup} before restore.`);
}

function backupCurrentSqliteFile(targetFile: string, backupName: string): void {
  if (!fs.existsSync(targetFile)) {
    return;
  }

  const safetyBackup = path.join(backupDir, backupName);
  const database = new DatabaseSync(targetFile);
  try {
    database.exec(`VACUUM INTO ${toSqliteStringLiteral(safetyBackup)}`);
  } finally {
    database.close();
  }

  console.log(`Current SQLite data copied to ${safetyBackup} before restore.`);
}

function removeSqliteSidecars(targetFile: string): void {
  for (const sidecarFile of [`${targetFile}-wal`, `${targetFile}-shm`, `${targetFile}-journal`]) {
    if (fs.existsSync(sidecarFile)) {
      fs.rmSync(sidecarFile, {force: true});
    }
  }
}

function toSqliteStringLiteral(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}
