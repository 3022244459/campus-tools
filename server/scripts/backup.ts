import {loadServerEnv} from '../loadEnv.ts';
import fs from 'node:fs';
import path from 'node:path';
import {DatabaseSync} from 'node:sqlite';
import {getSqliteDatabaseFile} from '../sqlite.ts';

loadServerEnv();

const dataStore = (process.env.DATA_STORE ?? 'json').toLowerCase();
const backupDir = path.resolve(process.env.BACKUP_DIR || path.join('server', 'backups'));
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

fs.mkdirSync(backupDir, {recursive: true});

if (dataStore === 'sqlite') {
  backupSqlite();
} else if (dataStore === 'json') {
  backupJson();
} else {
  throw new Error(`Unsupported DATA_STORE value for backup: ${dataStore}`);
}

function backupSqlite(): void {
  const sourceFile = getSqliteDatabaseFile();
  if (!fs.existsSync(sourceFile)) {
    throw new Error(`SQLite database not found at ${sourceFile}. Run npm.cmd run db:seed first.`);
  }

  const backupFile = path.join(backupDir, `campus-sqlite-${timestamp}.sqlite`);
  const database = new DatabaseSync(sourceFile);
  try {
    database.exec(`VACUUM INTO ${toSqliteStringLiteral(backupFile)}`);
  } finally {
    database.close();
  }

  writeManifest({
    type: 'sqlite',
    source: sourceFile,
    artifact: backupFile,
  });
  console.log(`SQLite backup created: ${backupFile}`);
}

function backupJson(): void {
  const sourceFile = path.resolve(process.cwd(), 'server', 'data', 'db.json');
  if (!fs.existsSync(sourceFile)) {
    throw new Error(`JSON database file not found at ${sourceFile}.`);
  }

  const backupFile = path.join(backupDir, `campus-json-${timestamp}.json`);
  fs.copyFileSync(sourceFile, backupFile);
  writeManifest({
    type: 'json',
    source: sourceFile,
    artifact: backupFile,
  });
  console.log(`JSON backup created: ${backupFile}`);
}

function writeManifest(entry: {type: string; source: string; artifact: string}): void {
  const manifestFile = path.join(backupDir, `campus-backup-${timestamp}.manifest.json`);
  fs.writeFileSync(
    manifestFile,
    `${JSON.stringify(
      {
        createdAt: new Date().toISOString(),
        dataStore: entry.type,
        source: entry.source,
        artifact: entry.artifact,
      },
      null,
      2,
    )}\n`,
    'utf8',
  );
  console.log(`Backup manifest created: ${manifestFile}`);
}

function toSqliteStringLiteral(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}
