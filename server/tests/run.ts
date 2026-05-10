import assert from 'node:assert/strict';
import fs from 'node:fs';
import type {AddressInfo} from 'node:net';
import os from 'node:os';
import path from 'node:path';
import {DatabaseSync} from 'node:sqlite';
import {createApp} from '../app.ts';
import {getServerConfig} from '../config.ts';
import {loadDb} from '../db.ts';
import {writeLog} from '../logger.ts';
import {loadServerEnv} from '../loadEnv.ts';
import {loadSqliteDb, migrateSqliteDb, resetSqliteConnectionForTests, saveSqliteDb, seedSqliteDb} from '../sqlite.ts';
import {
  buildAdminOverview,
  buildCompareQuotes,
  createSession,
  findUserByCredentials,
  findUserByToken,
  getUserActivityData,
  publishAnnouncement,
  removeExpiredSessions,
  reviewTeacherLeave,
  reviewTeacherStudentAffair,
  submitLostFoundItem,
  submitRepairRequest,
  submitTakeoutOrder,
  submitTeacherDocument,
} from '../services.ts';
import {
  parseAdminUserSessionRevokeInput,
  parseAdminUsersQuery,
  parseAnnouncementSubmitInput,
  parseAuditLogQuery,
  parseCompareInput,
  parseLoginInput,
  parseLostFoundSubmitInput,
  parseRepairSubmitInput,
  parseReviewInput,
  parseTakeoutSubmitInput,
  parseTeacherDocumentSubmitInput,
} from '../validators/index.ts';
import {createRecordId, createShortCode, hashPassword, hashToken, verifyPassword, verifyToken} from '../utils.ts';

async function run() {
  const loginResult = parseLoginInput({
    identity: 'student',
    username: 'student001',
    password: 'campus123',
  });
  assert.equal(loginResult.identity, 'student');
  assert.equal(loginResult.username, 'student001');

  assert.throws(() => {
    parseCompareInput({
      destination: '襄阳',
      weight: 0,
    });
  });

  const hash = hashPassword('campus123', 'demo-student-salt');
  assert.equal(hash.startsWith('pbkdf2_sha256$120000$'), true);
  assert.equal(hash, hashPassword('campus123', 'demo-student-salt'));
  assert.equal(verifyPassword(loadDb().users[0]!, 'campus123'), true);
  const tokenHash = hashToken('test-session-token');
  assert.equal(tokenHash.startsWith('sha256$'), true);
  assert.equal(verifyToken(tokenHash, 'test-session-token'), true);
  assert.equal(verifyToken(tokenHash, 'wrong-session-token'), false);
  const generatedIds = new Set(Array.from({length: 50}, () => createRecordId('audit')));
  assert.equal(generatedIds.size, 50);
  assert.equal([...generatedIds].every((id) => id.startsWith('audit-')), true);
  assert.match(createShortCode('WL'), /^WL[A-Z0-9]{8}$/);

  const envFixtureDir = fs.mkdtempSync(path.join(os.tmpdir(), 'campus-env-'));
  try {
    fs.writeFileSync(path.join(envFixtureDir, '.env'), 'API_PORT=7000\nDATA_STORE=json\nCORS_ORIGINS=http://example.test\n');
    fs.writeFileSync(path.join(envFixtureDir, '.env.local'), 'API_PORT=8789\nDATA_STORE=sqlite\n');
    const envFixture: Record<string, string | undefined> = {API_PORT: '9999'};
    loadServerEnv(envFixtureDir, envFixture);
    assert.equal(envFixture.API_PORT, '9999');
    assert.equal(envFixture.DATA_STORE, 'sqlite');
    assert.equal(envFixture.CORS_ORIGINS, 'http://example.test');
  } finally {
    fs.rmSync(envFixtureDir, {recursive: true, force: true});
  }

  assert.throws(() => {
    getServerConfig({
      APP_ENV: 'production',
      CORS_ORIGINS: '*',
      DATA_STORE: 'json',
      VITE_ENABLE_MOCK_FALLBACK: 'true',
    });
  });
  assert.equal(getServerConfig({}).sessionTtlHours, 168);
  assert.equal(getServerConfig({SESSION_TTL_HOURS: '12'}).sessionTtlHours, 12);
  assert.throws(() => getServerConfig({SESSION_TTL_HOURS: '0'}));
  assert.throws(() => getServerConfig({SESSION_TTL_HOURS: '721'}));
  assert.throws(() => {
    getServerConfig({
      APP_ENV: 'pilot',
      CORS_ORIGINS: 'https://campus.example.edu,capacitor://localhost',
      TRUST_PROXY: 'loopback',
      REQUEST_BODY_LIMIT: '100kb',
      DATA_STORE: 'sqlite',
      VITE_ENABLE_MOCK_FALLBACK: 'false',
      LOG_MAX_BYTES: '500000',
    });
  });
  const validPilotEnv = {
    APP_ENV: 'pilot',
    CORS_ORIGINS: 'https://campus.example.edu,capacitor://localhost',
    TRUST_PROXY: 'loopback',
    REQUEST_BODY_LIMIT: '100kb',
    SESSION_TTL_HOURS: '168',
    DATA_STORE: 'sqlite',
    VITE_ENABLE_MOCK_FALLBACK: 'false',
    RATE_LIMIT_WINDOW_MS: '60000',
    RATE_LIMIT_MAX_REQUESTS: '120',
    LOG_MAX_BYTES: '500000',
  } as const;
  const productionConfig = getServerConfig(validPilotEnv);
  assert.equal(productionConfig.appEnv, 'pilot');
  assert.equal(productionConfig.trustProxy, 'loopback');
  assert.equal(productionConfig.requestBodyLimit, '100kb');
  assert.equal(productionConfig.sessionTtlHours, 168);
  assert.equal(productionConfig.logMaxBytes, 500_000);
  assert.throws(() => getServerConfig({...validPilotEnv, RATE_LIMIT_WINDOW_MS: 'fast'}));
  assert.throws(() => getServerConfig({...validPilotEnv, RATE_LIMIT_MAX_REQUESTS: '10001'}));
  assert.throws(() => getServerConfig({...validPilotEnv, LOG_MAX_BYTES: 'large'}));
  assert.throws(() => getServerConfig({...validPilotEnv, ALERT_MIN_STATUS_CODE: '399'}));
  assert.equal(getServerConfig({TRUST_PROXY: '1'}).trustProxy, 1);
  assert.equal(getServerConfig({TRUST_PROXY: 'true'}).trustProxy, true);
  assert.throws(() => {
    getServerConfig({
      APP_ENV: 'pilot',
      CORS_ORIGINS: 'https://campus.example.edu,capacitor://localhost',
      TRUST_PROXY: 'loopback',
      REQUEST_BODY_LIMIT: '100kb',
      SESSION_TTL_HOURS: '168',
      DATA_STORE: 'postgres',
      VITE_ENABLE_MOCK_FALLBACK: 'false',
      LOG_MAX_BYTES: '500000',
    });
  });
  const alertConfig = getServerConfig({
    APP_ENV: 'pilot',
    CORS_ORIGINS: 'https://campus.example.edu,capacitor://localhost',
    TRUST_PROXY: 'loopback',
    REQUEST_BODY_LIMIT: '100kb',
    SESSION_TTL_HOURS: '168',
    DATA_STORE: 'sqlite',
    VITE_ENABLE_MOCK_FALLBACK: 'false',
    ALERT_WEBHOOK_URL: 'https://alerts.example.edu/webhook',
    ALERT_MIN_STATUS_CODE: '503',
    LOG_MAX_BYTES: '500000',
  });
  assert.equal(alertConfig.alertWebhookUrl, 'https://alerts.example.edu/webhook');
  assert.equal(alertConfig.alertMinStatusCode, 503);
  assert.throws(() => {
    getServerConfig({
      APP_ENV: 'pilot',
      CORS_ORIGINS: 'https://campus.example.edu',
      TRUST_PROXY: 'loopback',
      REQUEST_BODY_LIMIT: '100kb',
      SESSION_TTL_HOURS: '168',
      DATA_STORE: 'sqlite',
      VITE_ENABLE_MOCK_FALLBACK: 'false',
      ALERT_WEBHOOK_URL: 'http://alerts.example.edu/webhook',
      LOG_MAX_BYTES: '500000',
    });
  });
  assert.throws(() => {
    getServerConfig({
      APP_ENV: 'pilot',
      CORS_ORIGINS: 'https://campus.example.edu',
      TRUST_PROXY: 'loopback',
      REQUEST_BODY_LIMIT: '100kb',
      SESSION_TTL_HOURS: '168',
      DATA_STORE: 'sqlite',
      VITE_ENABLE_MOCK_FALLBACK: 'false',
      VITE_SHOW_DEMO_CREDENTIALS: 'true',
      LOG_MAX_BYTES: '500000',
    });
  });
  assert.throws(() => {
    getServerConfig({
      APP_ENV: 'pilot',
      CORS_ORIGINS: 'https://campus.example.edu',
      REQUEST_BODY_LIMIT: '100kb',
      SESSION_TTL_HOURS: '168',
      DATA_STORE: 'sqlite',
      VITE_ENABLE_MOCK_FALLBACK: 'false',
      LOG_MAX_BYTES: '500000',
    });
  });
  assert.throws(() => {
    getServerConfig({
      APP_ENV: 'pilot',
      CORS_ORIGINS: 'https://campus.example.edu',
      TRUST_PROXY: 'loopback',
      SESSION_TTL_HOURS: '168',
      DATA_STORE: 'sqlite',
      VITE_ENABLE_MOCK_FALLBACK: 'false',
      LOG_MAX_BYTES: '500000',
    });
  });
  assert.throws(() => {
    getServerConfig({
      APP_ENV: 'pilot',
      CORS_ORIGINS: 'https://campus.example.edu',
      TRUST_PROXY: 'loopback',
      REQUEST_BODY_LIMIT: '10gb',
      SESSION_TTL_HOURS: '168',
      DATA_STORE: 'sqlite',
      VITE_ENABLE_MOCK_FALLBACK: 'false',
      LOG_MAX_BYTES: '500000',
    });
  });
  assert.throws(() => {
    getServerConfig({
      APP_ENV: 'pilot',
      CORS_ORIGINS: 'https://campus.example.edu',
      TRUST_PROXY: 'loopback',
      REQUEST_BODY_LIMIT: '100kb',
      SESSION_TTL_HOURS: '168',
      DATA_STORE: 'sqlite',
      VITE_ENABLE_MOCK_FALLBACK: 'false',
      LOG_MAX_BYTES: '10',
    });
  });

  const admin = findUserByCredentials(loadDb(), 'teacher', 'admin001');
  assert.equal(admin?.role, 'admin');
  assert.equal(verifyPassword(admin!, 'campus123'), true);

  const sessionTtlDraft = structuredClone(loadDb());
  const oneHourSession = createSession(sessionTtlDraft, 'stu-001', 1);
  assert.equal(oneHourSession.token.length, 48);
  assert.equal(sessionTtlDraft.sessions[0]?.token.startsWith('sha256$'), true);
  assert.equal(sessionTtlDraft.sessions[0]?.token === oneHourSession.token, false);
  assert.equal(findUserByToken(sessionTtlDraft, oneHourSession.token)?.id, 'stu-001');
  assert.equal(Date.parse(oneHourSession.expiresAt) - Date.parse(oneHourSession.createdAt), 60 * 60 * 1000);

  const sessionCleanupDraft = structuredClone(loadDb());
  sessionCleanupDraft.sessions.push(
    {
      token: 'expired-session-token',
      userId: 'stu-001',
      createdAt: '2026-01-01T00:00:00.000Z',
      expiresAt: '2026-01-01T00:00:00.000Z',
    },
    {
      token: 'active-session-token',
      userId: 'tea-001',
      createdAt: '2026-01-01T00:00:00.000Z',
      expiresAt: '2099-01-01T00:00:00.000Z',
    },
  );
  assert.equal(removeExpiredSessions(sessionCleanupDraft, '2026-05-09T00:00:00.000Z'), 1);
  assert.equal(sessionCleanupDraft.sessions.some((session) => session.token === 'expired-session-token'), false);
  assert.equal(sessionCleanupDraft.sessions.some((session) => session.token === 'active-session-token'), true);

  const logFixtureDir = fs.mkdtempSync(path.join(os.tmpdir(), 'campus-log-'));
  try {
    const logFile = path.join(logFixtureDir, 'server.log');
    writeLog('first log line', {filePath: logFile, maxBytes: 24});
    writeLog('second log line that rotates', {filePath: logFile, maxBytes: 24});
    assert.equal(fs.existsSync(`${logFile}.1`), true);
    assert.equal(fs.readFileSync(`${logFile}.1`, 'utf8').includes('first log line'), true);
    assert.equal(fs.readFileSync(logFile, 'utf8').includes('second log line'), true);
  } finally {
    fs.rmSync(logFixtureDir, {recursive: true, force: true});
  }

  const compareResult = buildCompareQuotes(loadDb(), 1.5, '襄阳樊城区');
  assert.equal(compareResult.quotes.length > 0, true);
  assert.equal(Number(compareResult.quotes[0].price) <= Number(compareResult.quotes[1].price), true);

  const documentInput = parseTeacherDocumentSubmitInput({
    pickupLocation: '行政楼 302',
    destinationLocation: '教学楼 4F',
    urgency: '加急',
    remarks: '期末考卷',
  });
  assert.equal(documentInput.urgency, '加急');

  const reviewInput = parseReviewInput({
    applicationId: 'leave-1',
    decision: 'approve',
  });
  assert.equal(reviewInput.decision, 'approve');

  const repairInput = parseRepairSubmitInput({
    typeId: 'repair-light',
    location: '3 号宿舍楼 204',
    description: '宿舍灯管频闪，晚间无法正常使用。',
    imageCount: 1,
  });
  assert.equal(repairInput.typeId, 'repair-light');

  const lostFoundInput = parseLostFoundSubmitInput({
    title: '黑色雨伞',
    location: '图书馆一楼',
    description: '伞柄上有白色贴纸，希望看到的同学联系我。',
    type: 'lost',
  });
  assert.equal(lostFoundInput.type, 'lost');

  const takeoutInput = parseTakeoutSubmitInput({
    title: '奶茶代取',
    destination: '图书馆南门',
    reward: '4.5',
    tags: ['少冰', '尽快'],
    icon: 'pizza',
  });
  assert.equal(takeoutInput.icon, 'pizza');

  const announcementInput = parseAnnouncementSubmitInput({
    audience: 'all',
    label: '试点公告',
    message: '管理员公告发布链路测试。',
  });
  assert.equal(announcementInput.audience, 'all');
  const auditQuery = parseAuditLogQuery({type: 'auth.login', actorId: 'adm-001', limit: '5'});
  assert.deepEqual(auditQuery, {type: 'auth.login', actorId: 'adm-001', limit: 5});
  assert.throws(() => parseAuditLogQuery({limit: '201'}));
  const adminUsersQuery = parseAdminUsersQuery({role: 'admin', q: 'admin', limit: '10'});
  assert.deepEqual(adminUsersQuery, {role: 'admin', q: 'admin', limit: 10});
  assert.throws(() => parseAdminUsersQuery({identity: 'admin'}));
  assert.deepEqual(parseAdminUserSessionRevokeInput({userId: 'stu-001'}), {userId: 'stu-001'});
  assert.throws(() => parseAdminUserSessionRevokeInput({userId: 'x'}));

  const initialActivity = getUserActivityData(loadDb(), 'stu-001');
  assert.equal(initialActivity?.takeoutOrders.length === 3, true);
  assert.equal(initialActivity?.repairRequests.length === 3, true);
  assert.equal(initialActivity?.lostFoundPosts.length === 2, true);

  const draft = structuredClone(loadDb());
  const nextDocument = submitTeacherDocument(draft, 'tea-001', documentInput);
  assert.equal(nextDocument?.activeOrder.pickupLabel, '行政楼 302');
  assert.equal((nextDocument?.activeDeliveries ?? 0) >= 2, true);

  const nextRepair = submitRepairRequest(draft, 'stu-001', 'student', repairInput);
  assert.equal(nextRepair.recentRequests[0]?.location, '3 号宿舍楼 204');
  assert.equal(nextRepair.recentRequests[0]?.status, 'scheduled');
  assert.equal(draft.userActivityByUserId['stu-001'].repairRequests[0]?.description, '宿舍灯管频闪，晚间无法正常使用。');

  const nextLostFound = submitLostFoundItem(draft, 'stu-001', 'student', lostFoundInput);
  assert.equal(nextLostFound.latestItems[0]?.title, '黑色雨伞');
  assert.equal(nextLostFound.latestItems[0]?.type, 'lost');
  assert.equal(draft.userActivityByUserId['stu-001'].lostFoundPosts[0]?.contactHint, '可在个人中心继续跟进处理状态');

  const nextTakeout = submitTakeoutOrder(draft, 'stu-001', 'student', takeoutInput);
  assert.equal(nextTakeout.orders[0]?.title, '奶茶代取');
  assert.equal(nextTakeout.orders[0]?.reward, '楼4.5');
  assert.equal(draft.userActivityByUserId['stu-001'].takeoutOrders[0]?.status, 'open');

  const nextLeave = reviewTeacherLeave(draft, 'tea-001', reviewInput);
  assert.equal(nextLeave?.applications.some((item) => item.id === 'leave-1'), false);

  const nextAffair = reviewTeacherStudentAffair(draft, 'tea-001', {
    applicationId: 'affair-1',
    decision: 'reject',
  });
  assert.equal(nextAffair?.applications.some((item) => item.id === 'affair-1'), false);
  assert.equal((nextAffair?.stats.rejected ?? 0) > 4, true);

  const overviewBefore = buildAdminOverview(draft);
  assert.equal(overviewBefore.stats.admins >= 1, true);
  const announcement = publishAnnouncement(draft, 'adm-001', announcementInput);
  assert.equal(announcement.label, '试点公告');
  const overviewAfter = buildAdminOverview(draft);
  assert.equal(overviewAfter.announcements[0]?.id, announcement.id);
  assert.equal(overviewAfter.stats.announcements, overviewBefore.stats.announcements + 1);

  const sqliteTestFile = path.resolve(process.cwd(), 'server', 'data', `test-${Date.now()}.sqlite`);
  try {
    migrateSqliteDb(sqliteTestFile);
    seedSqliteDb(sqliteTestFile, {force: true});
    const sqliteDb = loadSqliteDb(sqliteTestFile);
    assert.equal(sqliteDb.users.some((user) => user.username === 'admin001'), true);

    const sqliteDraft = structuredClone(sqliteDb);
    sqliteDraft.sessions.push({
      token: 'sqlite-test-token',
      userId: 'adm-001',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
    });
    saveSqliteDb(sqliteDraft, sqliteTestFile);
    resetSqliteConnectionForTests();
    const reloadedSqliteDb = loadSqliteDb(sqliteTestFile);
    assert.equal(reloadedSqliteDb.sessions.some((session) => session.token === 'sqlite-test-token'), true);
    assert.equal((reloadedSqliteDb.userActivityByUserId['stu-001']?.takeoutOrders.length ?? 0) > 0, true);
    assert.equal((reloadedSqliteDb.userActivityByUserId['stu-001']?.repairRequests.length ?? 0) > 0, true);
    assert.equal((reloadedSqliteDb.userActivityByUserId['stu-001']?.lostFoundPosts.length ?? 0) > 0, true);
    assert.equal((reloadedSqliteDb.teacherDocumentByUserId['tea-001']?.activeOrder.orderCode.length ?? 0) > 0, true);
    assert.equal((reloadedSqliteDb.teacherLeaveByUserId['tea-001']?.applications.length ?? 0) > 0, true);
    assert.equal((reloadedSqliteDb.teacherStudentAffairsByUserId['tea-001']?.applications.length ?? 0) > 0, true);
    assert.equal((reloadedSqliteDb.courierAccounts['stu-001']?.packages.length ?? 0) > 0, true);
    assert.equal((reloadedSqliteDb.walletAccounts['stu-001']?.transactions.length ?? 0) > 0, true);
    assert.equal(reloadedSqliteDb.compareCarriers.length > 0, true);

    const invalidSqliteDraft = structuredClone(reloadedSqliteDb);
    invalidSqliteDraft.sessions.push({
      token: 'invalid-fk-token',
      userId: 'missing-user',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
    });
    assert.throws(() => saveSqliteDb(invalidSqliteDraft, sqliteTestFile));
    resetSqliteConnectionForTests();
    const afterRejectedSqliteDb = loadSqliteDb(sqliteTestFile);
    assert.equal(afterRejectedSqliteDb.sessions.some((session) => session.token === 'invalid-fk-token'), false);
    assert.equal(afterRejectedSqliteDb.sessions.some((session) => session.token === 'sqlite-test-token'), true);
    resetSqliteConnectionForTests();
    assert.equal(readSqliteCount(sqliteTestFile, 'users') >= 3, true);
    assert.equal(readSqliteCount(sqliteTestFile, 'sessions', 'token = ?', 'sqlite-test-token'), 1);
    assert.equal(readSqliteCount(sqliteTestFile, 'announcements') > 0, true);
    assert.equal(readSqliteCount(sqliteTestFile, 'takeout_orders') > 0, true);
    assert.equal(readSqliteCount(sqliteTestFile, 'repair_requests') > 0, true);
    assert.equal(readSqliteCount(sqliteTestFile, 'lost_found_items') > 0, true);
    assert.equal(readSqliteCount(sqliteTestFile, 'teacher_document_orders') > 0, true);
    assert.equal(readSqliteCount(sqliteTestFile, 'teacher_leave_applications') > 0, true);
    assert.equal(readSqliteCount(sqliteTestFile, 'teacher_student_affair_applications') > 0, true);
    assert.equal(readSqliteCount(sqliteTestFile, 'courier_accounts') > 0, true);
    assert.equal(readSqliteCount(sqliteTestFile, 'courier_packages') > 0, true);
    assert.equal(readSqliteCount(sqliteTestFile, 'wallet_accounts') > 0, true);
    assert.equal(readSqliteCount(sqliteTestFile, 'wallet_transactions') > 0, true);
    assert.equal(readSqliteCount(sqliteTestFile, 'compare_carriers') > 0, true);
  } finally {
    resetSqliteConnectionForTests();
    fs.rmSync(sqliteTestFile, {force: true});
  }

  await runHttpSmokeTest();

  console.log('server tests passed');
}

async function runHttpSmokeTest() {
  const previousDataStore = process.env.DATA_STORE;
  const previousSqliteFile = process.env.SQLITE_DB_FILE;
  const sqliteTestFile = path.resolve(process.cwd(), 'server', 'data', `http-test-${Date.now()}.sqlite`);
  let server: ReturnType<ReturnType<typeof createApp>['listen']> | null = null;

  try {
    process.env.DATA_STORE = 'sqlite';
    process.env.SQLITE_DB_FILE = sqliteTestFile;
    resetSqliteConnectionForTests();
    seedSqliteDb(sqliteTestFile, {force: true});
    const initialAnnouncementRows = readSqliteCount(sqliteTestFile, 'announcements');
    const initialTakeoutRows = readSqliteCount(sqliteTestFile, 'takeout_orders');
    const initialRepairRows = readSqliteCount(sqliteTestFile, 'repair_requests');
    const initialLostFoundRows = readSqliteCount(sqliteTestFile, 'lost_found_items');
    const initialTeacherLeaveRows = readSqliteCount(sqliteTestFile, 'teacher_leave_applications');
    const initialTeacherAffairRows = readSqliteCount(sqliteTestFile, 'teacher_student_affair_applications');
    const teacherDocumentRemarks = 'Integration document delivery';

    const app = createApp({
      appEnv: 'test',
      corsOrigins: ['http://localhost:3000'],
      trustProxy: false,
      requestBodyLimit: '100kb',
      sessionTtlHours: 168,
      rateLimitWindowMs: 60_000,
      rateLimitMaxRequests: 100,
      logMaxBytes: 5_000_000,
      alertMinStatusCode: 500,
    });
    server = app.listen(0);
    await new Promise<void>((resolve) => server!.once('listening', resolve));

    const address = server.address() as AddressInfo;
    const baseUrl = `http://127.0.0.1:${address.port}/api`;

    const readinessResponse = await fetch(`${baseUrl}/health/ready`);
    assert.equal(readinessResponse.status, 200);
    assert.equal(readinessResponse.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(readinessResponse.headers.get('x-frame-options'), 'DENY');
    assert.equal(readinessResponse.headers.get('referrer-policy'), 'no-referrer');
    assert.equal(readinessResponse.headers.get('cross-origin-resource-policy'), 'same-origin');
    assert.equal(readinessResponse.headers.get('permissions-policy')?.includes('camera=()'), true);
    const readiness = await readinessResponse.json() as {
      status: string;
      dataStore: string;
      checks: Array<{name: string; status: string}>;
    };
    assert.equal(readiness.status, 'ready');
    assert.equal(readiness.dataStore, 'sqlite');
    assert.equal(readiness.checks.every((check) => check.status === 'ok'), true);
    assert.equal(readiness.checks.some((check) => check.name === 'seed.users.admin'), true);

    const oversizedBodyResponse = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({identity: 'student', username: 'student001', password: 'x'.repeat(120_000)}),
    });
    assert.equal(oversizedBodyResponse.status, 413);

    const loginResponse = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({identity: 'teacher', username: 'admin001', password: 'campus123'}),
    });
    assert.equal(loginResponse.status, 200);

    const loginPayload = await loginResponse.json() as {
      token: string;
      user: {role: string};
    };
    assert.equal(loginPayload.user.role, 'admin');
    assert.equal(readSqliteCount(sqliteTestFile, 'sessions', 'token = ?', loginPayload.token), 0);
    assert.equal(readSqliteCount(sqliteTestFile, 'sessions', 'token LIKE ?', 'sha256$%') >= 1, true);

    const overviewResponse = await fetch(`${baseUrl}/admin/overview`, {
      headers: {Authorization: `Bearer ${loginPayload.token}`},
    });
    assert.equal(overviewResponse.status, 200);
    const overview = await overviewResponse.json() as {stats: {admins: number}};
    assert.equal(overview.stats.admins >= 1, true);

    const metricsResponse = await fetch(`${baseUrl}/admin/metrics`, {
      headers: {Authorization: `Bearer ${loginPayload.token}`},
    });
    assert.equal(metricsResponse.status, 200);
    const metrics = await metricsResponse.json() as {
      totalRequests: number;
      statusCounts: Record<string, number>;
      topPaths: Array<{path: string; count: number}>;
      alerts: {enabled: boolean; minStatusCode: number};
    };
    assert.equal(metrics.totalRequests >= 1, true);
    assert.equal(Array.isArray(metrics.topPaths), true);
    assert.equal(metrics.alerts.enabled, false);
    assert.equal(metrics.alerts.minStatusCode, 500);

    const auditLogResponse = await fetch(`${baseUrl}/admin/audit-logs?limit=5`, {
      headers: {Authorization: `Bearer ${loginPayload.token}`},
    });
    assert.equal(auditLogResponse.status, 200);
    const auditLogPayload = await auditLogResponse.json() as {
      items: Array<{type: string; actorId?: string; detail: string; createdAt: string}>;
    };
    assert.equal(Array.isArray(auditLogPayload.items), true);
    assert.equal(auditLogPayload.items.length <= 5, true);

    const authAuditLogResponse = await fetch(`${baseUrl}/admin/audit-logs?type=auth.login&limit=10`, {
      headers: {Authorization: `Bearer ${loginPayload.token}`},
    });
    assert.equal(authAuditLogResponse.status, 200);
    const authAuditLogPayload = await authAuditLogResponse.json() as {
      items: Array<{type: string; actorId?: string}>;
    };
    assert.equal(authAuditLogPayload.items.some((item) => item.type === 'auth.login' && item.actorId === 'adm-001'), true);

    const adminUsersResponse = await fetch(`${baseUrl}/admin/users?role=admin&limit=10`, {
      headers: {Authorization: `Bearer ${loginPayload.token}`},
    });
    assert.equal(adminUsersResponse.status, 200);
    const adminUsersPayload = await adminUsersResponse.json() as {
      total: number;
      items: Array<{
        username: string;
        role: string;
        activeSessionCount: number;
        passwordHash?: string;
        salt?: string;
        token?: string;
      }>;
    };
    assert.equal(adminUsersPayload.total >= 1, true);
    assert.equal(adminUsersPayload.items.some((item) => item.username === 'admin001' && item.role === 'admin'), true);
    assert.equal(adminUsersPayload.items.some((item) => 'passwordHash' in item || 'salt' in item || 'token' in item), false);

    const selfRevokeResponse = await fetch(`${baseUrl}/admin/users/adm-001/revoke-sessions`, {
      method: 'POST',
      headers: {Authorization: `Bearer ${loginPayload.token}`},
    });
    assert.equal(selfRevokeResponse.status, 400);

    const announcementResponse = await fetch(`${baseUrl}/admin/announcements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${loginPayload.token}`,
      },
      body: JSON.stringify({
        audience: 'teacher',
        label: '集成测试',
        message: '管理员路由发布公告集成测试。',
      }),
    });
    assert.equal(announcementResponse.status, 201);
    assert.equal((await fetch(`${baseUrl}/home/bootstrap`, {
      headers: {Authorization: `Bearer ${loginPayload.token}`},
    })).status, 403);

    const studentLoginResponse = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({identity: 'student', username: 'student001', password: 'campus123'}),
    });
    assert.equal(studentLoginResponse.status, 200);
    const studentLoginPayload = await studentLoginResponse.json() as {token: string};
    const studentHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${studentLoginPayload.token}`,
    };

    assert.equal((await fetch(`${baseUrl}/admin/metrics`, {headers: studentHeaders})).status, 403);
    assert.equal((await fetch(`${baseUrl}/admin/audit-logs`, {headers: studentHeaders})).status, 403);
    assert.equal((await fetch(`${baseUrl}/admin/users`, {headers: studentHeaders})).status, 403);
    assert.equal((await fetch(`${baseUrl}/home/bootstrap`, {headers: studentHeaders})).status, 200);
    assert.equal((await fetch(`${baseUrl}/courier`, {headers: studentHeaders})).status, 200);
    assert.equal((await fetch(`${baseUrl}/wallet`, {headers: studentHeaders})).status, 200);
    assert.equal((await fetch(`${baseUrl}/takeout`, {headers: studentHeaders})).status, 200);
    assert.equal((await fetch(`${baseUrl}/takeout/submit`, {
      method: 'POST',
      headers: studentHeaders,
      body: JSON.stringify({
        title: '测试代取',
        destination: '图书馆南门',
        reward: '4.5',
        tags: ['尽快'],
        icon: 'pizza',
      }),
    })).status, 200);
    assert.equal((await fetch(`${baseUrl}/repair/submit`, {
      method: 'POST',
      headers: studentHeaders,
      body: JSON.stringify({
        typeId: 'repair-light',
        location: '3号宿舍204',
        description: '灯管闪烁需要维修',
        imageCount: 0,
      }),
    })).status, 200);
    assert.equal((await fetch(`${baseUrl}/lost-found/submit`, {
      method: 'POST',
      headers: studentHeaders,
      body: JSON.stringify({
        title: '黑色雨伞',
        location: '图书馆一楼',
        description: '伞柄有白色贴纸',
        type: 'lost',
      }),
    })).status, 200);
    assert.equal((await fetch(`${baseUrl}/courier-compare/quote`, {
      method: 'POST',
      headers: studentHeaders,
      body: JSON.stringify({destination: '襄阳樊城', weight: 1.5}),
    })).status, 200);
    assert.equal((await fetch(`${baseUrl}/me/activity`, {headers: studentHeaders})).status, 200);

    const revokeStudentSessionsResponse = await fetch(`${baseUrl}/admin/users/stu-001/revoke-sessions`, {
      method: 'POST',
      headers: {Authorization: `Bearer ${loginPayload.token}`},
    });
    assert.equal(revokeStudentSessionsResponse.status, 200);
    const revokeStudentSessionsPayload = await revokeStudentSessionsResponse.json() as {
      userId: string;
      username: string;
      revokedCount: number;
    };
    assert.equal(revokeStudentSessionsPayload.userId, 'stu-001');
    assert.equal(revokeStudentSessionsPayload.username, 'student001');
    assert.equal(revokeStudentSessionsPayload.revokedCount >= 1, true);
    assert.equal((await fetch(`${baseUrl}/home/bootstrap`, {headers: studentHeaders})).status, 401);

    const logoutResponse = await fetch(`${baseUrl}/auth/logout`, {
      method: 'POST',
      headers: {Authorization: `Bearer ${loginPayload.token}`},
    });
    assert.equal(logoutResponse.status, 204);

    const teacherLoginResponse = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({identity: 'teacher', username: 'teacher001', password: 'campus123'}),
    });
    assert.equal(teacherLoginResponse.status, 200);
    const teacherLoginPayload = await teacherLoginResponse.json() as {token: string};
    const teacherHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${teacherLoginPayload.token}`,
    };

    assert.equal((await fetch(`${baseUrl}/teacher/office`, {headers: teacherHeaders})).status, 200);
    assert.equal((await fetch(`${baseUrl}/teacher/meeting`, {headers: teacherHeaders})).status, 200);
    assert.equal((await fetch(`${baseUrl}/teacher/document/submit`, {
      method: 'POST',
      headers: teacherHeaders,
      body: JSON.stringify({
        pickupLocation: '行政楼302',
        destinationLocation: '教学楼4F',
        urgency: '加急',
        remarks: teacherDocumentRemarks,
      }),
    })).status, 200);
    assert.equal((await fetch(`${baseUrl}/teacher/leave/review`, {
      method: 'POST',
      headers: teacherHeaders,
      body: JSON.stringify({applicationId: 'leave-1', decision: 'approve'}),
    })).status, 200);
    assert.equal((await fetch(`${baseUrl}/teacher/student-affairs/review`, {
      method: 'POST',
      headers: teacherHeaders,
      body: JSON.stringify({applicationId: 'affair-1', decision: 'reject'}),
    })).status, 200);
    assert.equal((await fetch(`${baseUrl}/teacher/study-room`, {headers: teacherHeaders})).status, 200);
    assert.equal((await fetch(`${baseUrl}/teacher/salary`, {headers: teacherHeaders})).status, 200);
    assert.equal((await fetch(`${baseUrl}/teacher/campus-card`, {headers: teacherHeaders})).status, 200);

    resetSqliteConnectionForTests();
    assert.equal(readSqliteCount(sqliteTestFile, 'announcements') > initialAnnouncementRows, true);
    assert.equal(readSqliteCount(sqliteTestFile, 'takeout_orders') > initialTakeoutRows, true);
    assert.equal(readSqliteCount(sqliteTestFile, 'repair_requests') > initialRepairRows, true);
    assert.equal(readSqliteCount(sqliteTestFile, 'lost_found_items') > initialLostFoundRows, true);
    assert.equal(readSqliteCount(sqliteTestFile, 'teacher_document_orders', 'title = ?', teacherDocumentRemarks), 1);
    assert.equal(readSqliteCount(sqliteTestFile, 'teacher_leave_applications') < initialTeacherLeaveRows, true);
    assert.equal(readSqliteCount(sqliteTestFile, 'teacher_student_affair_applications') < initialTeacherAffairRows, true);
    assert.equal(readSqliteCount(sqliteTestFile, 'audit_logs', 'type = ?', 'student.takeout.submit') >= 1, true);
    assert.equal(readSqliteCount(sqliteTestFile, 'audit_logs', 'type = ?', 'teacher.document.submit') >= 1, true);
    assert.equal(readSqliteCount(sqliteTestFile, 'audit_logs', 'type = ?', 'admin.sessions.revoke') >= 1, true);
  } finally {
    await new Promise<void>((resolve, reject) => {
      if (!server) {
        resolve();
        return;
      }

      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
    resetSqliteConnectionForTests();
    fs.rmSync(sqliteTestFile, {force: true});

    if (previousDataStore === undefined) {
      delete process.env.DATA_STORE;
    } else {
      process.env.DATA_STORE = previousDataStore;
    }

    if (previousSqliteFile === undefined) {
      delete process.env.SQLITE_DB_FILE;
    } else {
      process.env.SQLITE_DB_FILE = previousSqliteFile;
    }
  }
}

function readSqliteCount(databaseFile: string, tableName: string, whereClause?: string, value?: string): number {
  const database = new DatabaseSync(databaseFile);
  try {
    const row = whereClause
      ? database.prepare(`SELECT COUNT(*) AS count FROM ${tableName} WHERE ${whereClause}`).get(value)
      : database.prepare(`SELECT COUNT(*) AS count FROM ${tableName}`).get();
    return (row as {count: number}).count;
  } finally {
    database.close();
  }
}

run().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
