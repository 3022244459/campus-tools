import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const requiredPaths = [
  '.gitignore',
  '.env.example',
  '.env.pilot.example',
  'README.md',
  'start-windows.bat',
  'build-android.bat',
  'build-android-release.bat',
  'scripts/check-java.mjs',
  'vite.config.ts',
  'capacitor.config.ts',
  '.github/workflows/ci.yml',
  'docs/database.md',
  'docs/android-release.md',
  'docs/ci-cd.md',
  'docs/operations-checklist.md',
  'docs/pilot-readiness-audit.md',
  'docs/pilot-runbook.md',
  'server/app.ts',
  'server/alerting.ts',
  'server/config.ts',
  'server/db.ts',
  'server/loadEnv.ts',
  'server/readiness.ts',
  'server/sqlite.ts',
  'server/sqliteNormalized.ts',
  'server/scripts/migrate.ts',
  'server/scripts/seed.ts',
  'server/scripts/backup.ts',
  'server/scripts/restore.ts',
  'server/migrations/001_app_state.sql',
  'server/migrations/002_core_workflows.sql',
  'server/migrations/003_teacher_workflows.sql',
  'server/migrations/004_wallet_courier.sql',
  'server/repositories/authRepository.ts',
  'server/repositories/campusRepository.ts',
  'server/repositories/teacherRepository.ts',
  'server/repositories/adminRepository.ts',
  'server/tests/run.ts',
  'src/lib/routes.ts',
  'src/lib/useScreenRouting.ts',
  'src/lib/useShellData.ts',
  'src/components/AppScreenRenderer.tsx',
  'src/components/AdminDashboardScreen.tsx',
];

const requiredScripts = [
  'db:migrate',
  'db:seed',
  'db:backup',
  'db:restore',
  'check',
  'build',
  'build:android',
  'build:android:release',
  'start:api',
];

const gateCommands = [
  ['run', 'db:migrate'],
  ['run', 'db:seed'],
  ['run', 'check'],
  ['run', 'build'],
  ['run', 'build:android'],
];

const generatedArtifactDirs = [
  'dist',
  'android/app/src/main/assets/public',
];

const generatedTextExtensions = new Set([
  '.css',
  '.html',
  '.js',
  '.json',
  '.map',
  '.svg',
  '.txt',
  '.webmanifest',
]);

const forbiddenGeneratedArtifactTerms = [
  'campus123',
  'student001',
  'teacher001',
  'admin001',
  'demoCredentials',
  'mockData',
  'mock-student',
  'mock-teacher',
];

const requiredGitIgnorePatterns = [
  '!.env.pilot.example',
  'server/data/*.sqlite',
  'server/data/*.sqlite-shm',
  'server/data/*.sqlite-wal',
  'server/backups/*',
  '!server/backups/.gitkeep',
  'server/logs/*',
  '!server/logs/.gitkeep',
];

const requiredAndroidGitIgnorePatterns = [
  '/.idea/',
  '*.jks',
  '*.keystore',
];

main();

function main(): void {
  console.log('Verifying pilot readiness artifacts...');
  verifyRequiredPaths();
  verifyPackageScripts();
  verifyWindowsScripts();
  verifyBackupRestoreScripts();
  verifyNoFrontendSecretInjection();
  verifyPilotEnvTemplate();
  verifyGitIgnoreRules();
  runGates();
  verifyGeneratedArtifacts();
  console.log('Pilot readiness verification passed.');
}

function verifyRequiredPaths(): void {
  const missing = requiredPaths.filter((item) => !fs.existsSync(path.resolve(process.cwd(), item)));
  if (missing.length > 0) {
    throw new Error(`Missing required artifacts:\n${missing.map((item) => `- ${item}`).join('\n')}`);
  }
}

function verifyPackageScripts(): void {
  const packageJson = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8')) as {
    scripts?: Record<string, string>;
  };
  const missing = requiredScripts.filter((script) => !packageJson.scripts?.[script]);
  if (missing.length > 0) {
    throw new Error(`Missing package scripts: ${missing.join(', ')}`);
  }

  if (!packageJson.scripts?.['build:android:release']?.includes('node scripts/check-java.mjs 17')) {
    throw new Error('build:android:release must preflight Java 17+ before running Gradle.');
  }
}

function verifyWindowsScripts(): void {
  const readme = fs.readFileSync(path.resolve(process.cwd(), 'README.md'), 'utf8');
  const startScript = fs.readFileSync(path.resolve(process.cwd(), 'start-windows.bat'), 'utf8');
  const androidDebugScript = fs.readFileSync(path.resolve(process.cwd(), 'build-android.bat'), 'utf8');
  const androidReleaseScript = fs.readFileSync(path.resolve(process.cwd(), 'build-android-release.bat'), 'utf8');
  const androidBuildGradle = fs.readFileSync(path.resolve(process.cwd(), 'android/app/build.gradle'), 'utf8');

  const errors: string[] = [];
  if (!startScript.includes('npm.cmd install')) {
    errors.push('start-windows.bat must install dependencies with npm.cmd install');
  }
  if (/\bnpm (install|run)\b/.test(readme) || /\bnpx cap\b/.test(readme)) {
    errors.push('README.md command examples must use npm.cmd/npx.cmd for Windows-first usage');
  }
  if (!androidReleaseScript.includes('SIGNING_MISSING') || !androidReleaseScript.includes('ANDROID_KEYSTORE_PATH does not exist')) {
    errors.push('build-android-release.bat must fail on incomplete or missing Android signing material');
  }
  if (!androidDebugScript.includes('scripts\\check-java.mjs 17') || !androidDebugScript.includes('JAVA_HOME')) {
    errors.push('build-android.bat must preflight Java 17+ before running Gradle');
  }
  if (!androidReleaseScript.includes('scripts\\check-java.mjs 17') || !androidReleaseScript.includes('JAVA_HOME')) {
    errors.push('build-android-release.bat must preflight Java 17+ before running Gradle');
  }
  if (!androidBuildGradle.includes('Incomplete Android release signing env vars') || !androidBuildGradle.includes('ANDROID_KEYSTORE_PATH does not exist')) {
    errors.push('android/app/build.gradle must fail on incomplete or missing Android signing material');
  }

  for (const [fileName, content] of [
    ['start-windows.bat', startScript],
    ['build-android.bat', androidDebugScript],
    ['build-android-release.bat', androidReleaseScript],
  ] as const) {
    if (content.includes('npm run ') || content.includes('call npm ')) {
      errors.push(`${fileName} must use npm.cmd in Windows batch commands`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Windows helper scripts are not using npm.cmd consistently:\n${errors.map((item) => `- ${item}`).join('\n')}`);
  }
}

function verifyBackupRestoreScripts(): void {
  const restoreScript = fs.readFileSync(path.resolve(process.cwd(), 'server/scripts/restore.ts'), 'utf8');
  const backupScript = fs.readFileSync(path.resolve(process.cwd(), 'server/scripts/backup.ts'), 'utf8');
  const errors: string[] = [];

  if (!backupScript.includes('VACUUM INTO')) {
    errors.push('server/scripts/backup.ts must use SQLite VACUUM INTO for consistent SQLite backups');
  }
  if (!restoreScript.includes('VACUUM INTO') || !restoreScript.includes('removeSqliteSidecars')) {
    errors.push('server/scripts/restore.ts must create a consistent pre-restore SQLite backup and clean SQLite sidecar files');
  }
  for (const sidecar of ['-wal', '-shm', '-journal']) {
    if (!restoreScript.includes(sidecar)) {
      errors.push(`server/scripts/restore.ts must remove SQLite ${sidecar} sidecar files before restore`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Backup/restore scripts are not pilot-safe:\n${errors.map((item) => `- ${item}`).join('\n')}`);
  }
}

function verifyNoFrontendSecretInjection(): void {
  const viteConfig = fs.readFileSync(path.resolve(process.cwd(), 'vite.config.ts'), 'utf8');
  if (viteConfig.includes('GEMINI_API_KEY') || viteConfig.includes('process.env.GEMINI')) {
    throw new Error('vite.config.ts must not inject secret values into the frontend bundle.');
  }

  if (!viteConfig.includes("entries: ['index.html']") || !viteConfig.includes('android/app/src/main/assets/public')) {
    throw new Error('vite.config.ts must keep generated Android web assets out of dev dependency scanning.');
  }
}

function verifyPilotEnvTemplate(): void {
  const env = parseEnvFile(path.resolve(process.cwd(), '.env.pilot.example'));
  const appEnv = env.APP_ENV?.toLowerCase();
  const dataStore = env.DATA_STORE?.toLowerCase();
  const corsOrigins = parseCsv(env.CORS_ORIGINS, []);
  const mockFallback = env.VITE_ENABLE_MOCK_FALLBACK?.toLowerCase();
  const showDemoCredentials = env.VITE_SHOW_DEMO_CREDENTIALS?.toLowerCase();
  const apiBaseUrl = env.VITE_API_BASE_URL ?? '';
  const trustProxy = env.TRUST_PROXY?.toLowerCase();
  const requestBodyLimit = env.REQUEST_BODY_LIMIT?.toLowerCase();
  const rateLimitWindowMs = Number(env.RATE_LIMIT_WINDOW_MS ?? 0);
  const rateLimitMaxRequests = Number(env.RATE_LIMIT_MAX_REQUESTS ?? 0);
  const sessionTtlHours = Number(env.SESSION_TTL_HOURS ?? 0);
  const logMaxBytes = Number(env.LOG_MAX_BYTES ?? 0);
  const alertMinStatusCode = Number(env.ALERT_MIN_STATUS_CODE ?? 500);

  const errors: string[] = [];
  if (appEnv !== 'pilot') {
    errors.push('APP_ENV must be "pilot"');
  }
  if (dataStore !== 'sqlite') {
    errors.push('DATA_STORE must be sqlite until PostgreSQL support is implemented');
  }
  if (corsOrigins.includes('*')) {
    errors.push('CORS_ORIGINS must not contain "*"');
  }
  if (!corsOrigins.some((origin) => origin.startsWith('https://'))) {
    errors.push('CORS_ORIGINS must include an HTTPS origin');
  }
  if (!corsOrigins.includes('capacitor://localhost')) {
    errors.push('CORS_ORIGINS must include capacitor://localhost');
  }
  if (!trustProxy || ['false', '0', 'off', 'no'].includes(trustProxy)) {
    errors.push('TRUST_PROXY must be enabled for the pilot reverse proxy');
  }
  if (!requestBodyLimit?.match(/^[1-9]\d*(b|kb|mb)$/)) {
    errors.push('REQUEST_BODY_LIMIT must use a compact size such as 100kb');
  }
  if (!Number.isInteger(rateLimitWindowMs) || rateLimitWindowMs < 1000) {
    errors.push('RATE_LIMIT_WINDOW_MS must be an integer >= 1000');
  }
  if (!Number.isInteger(rateLimitMaxRequests) || rateLimitMaxRequests < 1 || rateLimitMaxRequests > 10_000) {
    errors.push('RATE_LIMIT_MAX_REQUESTS must be an integer between 1 and 10000');
  }
  if (!Number.isInteger(sessionTtlHours) || sessionTtlHours < 1 || sessionTtlHours > 720) {
    errors.push('SESSION_TTL_HOURS must be an integer between 1 and 720');
  }
  if (!Number.isInteger(logMaxBytes) || logMaxBytes < 100_000) {
    errors.push('LOG_MAX_BYTES must be an integer >= 100000');
  }
  if (!Number.isInteger(alertMinStatusCode) || alertMinStatusCode < 400 || alertMinStatusCode > 599) {
    errors.push('ALERT_MIN_STATUS_CODE must be an HTTP error status code between 400 and 599');
  }
  if (mockFallback !== 'false') {
    errors.push('VITE_ENABLE_MOCK_FALLBACK must be "false"');
  }
  if (showDemoCredentials !== 'false') {
    errors.push('VITE_SHOW_DEMO_CREDENTIALS must be "false"');
  }
  if (!apiBaseUrl.startsWith('https://')) {
    errors.push('VITE_API_BASE_URL must be an HTTPS API URL');
  }

  if (errors.length > 0) {
    throw new Error(`.env.pilot.example is not pilot-safe:\n${errors.map((item) => `- ${item}`).join('\n')}`);
  }
}

function runGates(): void {
  const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  for (const args of gateCommands) {
    console.log(`Running ${npmCommand} ${args.join(' ')}...`);
    const result = spawnSync(npmCommand, args, {
      cwd: process.cwd(),
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });

    if (result.status !== 0) {
      const reason = result.error ? `: ${result.error.message}` : '';
      throw new Error(`${npmCommand} ${args.join(' ')} failed with status ${result.status ?? 'unknown'}${reason}.`);
    }
  }
}

function verifyGeneratedArtifacts(): void {
  const findings: string[] = [];

  for (const directory of generatedArtifactDirs) {
    const absoluteDirectory = path.resolve(process.cwd(), directory);
    if (!fs.existsSync(absoluteDirectory)) {
      throw new Error(`Missing generated artifact directory: ${directory}`);
    }

    for (const filePath of listGeneratedFiles(absoluteDirectory)) {
      const relativePath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
      const fileName = path.basename(filePath);
      const lowerFileName = fileName.toLowerCase();

      if (lowerFileName.includes('mockdata')) {
        findings.push(`${relativePath}: generated mockData chunk must not be present in pilot artifacts`);
      }

      if (!generatedTextExtensions.has(path.extname(filePath).toLowerCase())) {
        continue;
      }

      const content = fs.readFileSync(filePath, 'utf8');
      for (const term of forbiddenGeneratedArtifactTerms) {
        if (content.includes(term)) {
          findings.push(`${relativePath}: contains forbidden generated artifact term "${term}"`);
        }
      }
    }
  }

  if (findings.length > 0) {
    throw new Error(`Generated pilot artifacts contain demo/mock material:\n${findings.map((item) => `- ${item}`).join('\n')}`);
  }
}

function listGeneratedFiles(directory: string): string[] {
  const entries = fs.readdirSync(directory, {withFileTypes: true});
  const files: string[] = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...listGeneratedFiles(entryPath));
    } else if (entry.isFile()) {
      files.push(entryPath);
    }
  }

  return files;
}

function verifyGitIgnoreRules(): void {
  const configuredPatterns = readGitIgnorePatterns('.gitignore');
  const androidConfiguredPatterns = readGitIgnorePatterns('android/.gitignore');
  const missing = [
    ...requiredGitIgnorePatterns.filter((pattern) => !configuredPatterns.has(pattern)),
    ...requiredAndroidGitIgnorePatterns
      .filter((pattern) => !androidConfiguredPatterns.has(pattern))
      .map((pattern) => `android/.gitignore:${pattern}`),
  ];

  if (missing.length > 0) {
    throw new Error(`.gitignore files must protect templates, generated data, logs, backups, and Android signing material:\n${missing.map((item) => `- ${item}`).join('\n')}`);
  }
}

function readGitIgnorePatterns(filePath: string): Set<string> {
  const gitignore = fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf8');
  return new Set(
    gitignore
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#')),
  );
}

function parseEnvFile(filePath: string): Record<string, string> {
  const result: Record<string, string> = {};
  const content = fs.readFileSync(filePath, 'utf8');

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const separatorIndex = line.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();
    result[key] = rawValue.replace(/^['"]|['"]$/g, '').trim();
  }

  return result;
}

function parseCsv(value: string | undefined, fallback: string[]): string[] {
  if (!value) {
    return fallback;
  }

  const items = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  return items.length > 0 ? items : fallback;
}
