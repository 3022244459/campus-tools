import {loadServerEnv} from '../loadEnv.ts';
import {getSqliteDatabaseFile, migrateSqliteDb} from '../sqlite.ts';

loadServerEnv();

const databaseFile = getSqliteDatabaseFile();
migrateSqliteDb(databaseFile);
console.log(`SQLite migrations applied: ${databaseFile}`);
