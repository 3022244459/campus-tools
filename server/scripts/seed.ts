import {loadServerEnv} from '../loadEnv.ts';
import {getSqliteDatabaseFile, seedSqliteDb} from '../sqlite.ts';

loadServerEnv();

const databaseFile = getSqliteDatabaseFile();
const force = process.argv.includes('--force');
seedSqliteDb(databaseFile, {force});
console.log(`SQLite seed ${force ? 'reloaded' : 'ready'}: ${databaseFile}`);
