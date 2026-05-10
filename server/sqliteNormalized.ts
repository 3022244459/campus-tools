import type {DatabaseSync} from 'node:sqlite';
import type {
  AnnouncementAudience,
  AuditLogRecord,
  CompareCarrierRecord,
  CourierAccountRecord,
  CourierPackageRecord,
  DatabaseShape,
  Identity,
  LeaveApplicationRecord,
  LostFoundItemRecord,
  RepairRequestRecord,
  SessionRecord,
  StudentAffairApplicationRecord,
  TakeoutOrderRecord,
  UserActivityRecord,
  UserRecord,
  UserRole,
  UserStats,
  WalletAccountRecord,
  WalletTransactionRecord,
} from './types.ts';

type UserRow = {
  id: string;
  identity: Identity;
  role: UserRole;
  username: string;
  salt: string;
  password_hash: string;
  name: string;
  campus: string;
  organization: string;
  grade_label: string;
  verified: number;
  avatar_url: string;
  stats_json: string;
};

type SessionRow = {
  token: string;
  user_id: string;
  created_at: string;
  expires_at: string;
};

type AnnouncementRow = {
  id: string;
  audience: AnnouncementAudience;
  label: string;
  message: string;
  published_at: string;
};

type AuditLogRow = {
  id: string;
  type: string;
  actor_id: string | null;
  detail: string;
  created_at: string;
};

type TakeoutOrderRow = {
  id: string;
  identity: Identity;
  user_id: string | null;
  title: string;
  destination: string;
  reward: string;
  tags_json: string;
  icon: TakeoutOrderRecord['icon'];
  status: 'open' | 'claimed' | 'completed';
  time_label: string;
  note: string | null;
  created_at: string;
};

type RepairRequestRow = {
  id: string;
  identity: Identity;
  user_id: string | null;
  title: string;
  location: string;
  status: RepairRequestRecord['status'];
  time_label: string;
  description: string | null;
  created_at: string;
};

type LostFoundItemRow = {
  id: string;
  identity: Identity;
  user_id: string | null;
  title: string;
  location: string;
  time_label: string;
  type: LostFoundItemRecord['type'];
  image: string;
  description: string | null;
  featured: number;
  contact_hint: string | null;
  created_at: string;
};

type TeacherDocumentOrderRow = {
  order_code: string;
  teacher_user_id: string;
  title: string;
  urgency: string;
  pickup_label: string;
  destination_label: string;
  progress: number;
  eta_text: string;
  created_at: string;
};

type TeacherLeaveApplicationRow = {
  id: string;
  teacher_user_id: string;
  student_name: string;
  class_name: string;
  leave_type: LeaveApplicationRecord['leaveType'];
  start_time: string;
  end_time: string;
  reason: string;
  avatar_text: string;
  created_at: string;
};

type TeacherStudentAffairApplicationRow = {
  id: string;
  teacher_user_id: string;
  title: string;
  applicant: string;
  category: string;
  quote: string | null;
  detail: string | null;
  meta_json: string;
  icon: StudentAffairApplicationRecord['icon'];
  created_at: string;
};

type CourierAccountRow = {
  user_id: string;
  station_name: string;
  pending_count: number;
  history_count: number;
  note_title: string;
  note_message: string;
};

type CourierPackageRow = {
  id: string;
  user_id: string;
  title: string;
  code: string;
  location: string;
  tag: string;
  tag_tone: string;
  icon: string;
  eta_days: number;
  sort_order: number;
};

type WalletAccountRow = {
  user_id: string;
  total_balance: number;
  daily_change: number;
  wallet_balance_label: string;
};

type WalletTransactionRow = {
  id: string;
  user_id: string;
  title: string;
  time_label: string;
  amount: string;
  icon_key: WalletTransactionRecord['iconKey'];
  tone: WalletTransactionRecord['tone'];
  positive: number | null;
  sort_order: number;
};

type CompareCarrierRow = {
  id: string;
  company: string;
  title: string;
  base_price: number;
  price_per_kg: number;
  eta_days: string;
  tag: string;
  tag_tone: string;
  logo_tone: string;
  sort_order: number;
};

const identities: Identity[] = ['student', 'teacher'];

export function hydrateFromNormalizedTables(database: DatabaseSync, baseDb: DatabaseShape): DatabaseShape {
  if (normalizedTablesAreEmpty(database)) {
    syncNormalizedTables(database, baseDb);
  } else {
    if (teacherWorkflowTablesAreEmpty(database)) {
      syncTeacherWorkflowTables(database, baseDb);
    }

    if (walletCourierTablesAreEmpty(database)) {
      syncWalletCourierTables(database, baseDb);
    }
  }

  const nextDb = structuredClone(baseDb);
  hydrateUsers(database, nextDb);
  hydrateSessions(database, nextDb);
  hydrateAnnouncements(database, nextDb);
  hydrateAuditLogs(database, nextDb);
  resetActivityRecords(nextDb);
  hydrateTakeoutOrders(database, nextDb);
  hydrateRepairRequests(database, nextDb);
  hydrateLostFoundItems(database, nextDb);
  hydrateTeacherDocumentOrders(database, nextDb);
  hydrateTeacherLeaveApplications(database, nextDb);
  hydrateTeacherStudentAffairApplications(database, nextDb);
  hydrateCourierAccounts(database, nextDb);
  hydrateWalletAccounts(database, nextDb);
  hydrateCompareCarriers(database, nextDb);
  return nextDb;
}

export function syncNormalizedTables(
  database: DatabaseSync,
  db: DatabaseShape,
  options: {transaction?: boolean} = {},
): void {
  const manageTransaction = options.transaction ?? true;
  if (manageTransaction) {
    database.exec('BEGIN IMMEDIATE');
  }

  try {
    clearNormalizedTables(database);
    syncUsers(database, db);
    syncSessions(database, db);
    syncAnnouncements(database, db);
    syncAuditLogs(database, db);
    syncTakeoutOrders(database, db);
    syncRepairRequests(database, db);
    syncLostFoundItems(database, db);
    syncTeacherDocumentOrders(database, db);
    syncTeacherLeaveApplications(database, db);
    syncTeacherStudentAffairApplications(database, db);
    syncCourierAccounts(database, db);
    syncWalletAccounts(database, db);
    syncCompareCarriers(database, db);
    if (manageTransaction) {
      database.exec('COMMIT');
    }
  } catch (error) {
    if (manageTransaction) {
      database.exec('ROLLBACK');
    }
    throw error;
  }
}

function syncWalletCourierTables(database: DatabaseSync, db: DatabaseShape): void {
  database.exec('BEGIN IMMEDIATE');
  try {
    clearWalletCourierTables(database);
    syncCourierAccounts(database, db);
    syncWalletAccounts(database, db);
    syncCompareCarriers(database, db);
    database.exec('COMMIT');
  } catch (error) {
    database.exec('ROLLBACK');
    throw error;
  }
}

function syncTeacherWorkflowTables(database: DatabaseSync, db: DatabaseShape): void {
  database.exec('BEGIN IMMEDIATE');
  try {
    clearTeacherWorkflowTables(database);
    syncTeacherDocumentOrders(database, db);
    syncTeacherLeaveApplications(database, db);
    syncTeacherStudentAffairApplications(database, db);
    database.exec('COMMIT');
  } catch (error) {
    database.exec('ROLLBACK');
    throw error;
  }
}

function clearNormalizedTables(database: DatabaseSync): void {
  database.prepare('DELETE FROM sessions').run();
  database.prepare('DELETE FROM takeout_orders').run();
  database.prepare('DELETE FROM repair_requests').run();
  database.prepare('DELETE FROM lost_found_items').run();
  clearTeacherWorkflowTables(database);
  clearWalletCourierTables(database);
  database.prepare('DELETE FROM audit_logs').run();
  database.prepare('DELETE FROM announcements').run();
  database.prepare('DELETE FROM users').run();
}

function clearTeacherWorkflowTables(database: DatabaseSync): void {
  database.prepare('DELETE FROM teacher_document_orders').run();
  database.prepare('DELETE FROM teacher_leave_applications').run();
  database.prepare('DELETE FROM teacher_student_affair_applications').run();
}

function clearWalletCourierTables(database: DatabaseSync): void {
  database.prepare('DELETE FROM courier_packages').run();
  database.prepare('DELETE FROM courier_accounts').run();
  database.prepare('DELETE FROM wallet_transactions').run();
  database.prepare('DELETE FROM wallet_accounts').run();
  database.prepare('DELETE FROM compare_carriers').run();
}

function hydrateUsers(database: DatabaseSync, db: DatabaseShape): void {
  const rows = database.prepare('SELECT * FROM users ORDER BY id').all() as UserRow[];
  if (rows.length === 0) {
    return;
  }

  db.users = rows.map((row): UserRecord => {
    const role = row.role === row.identity ? undefined : row.role;
    return {
      id: row.id,
      identity: row.identity,
      role,
      username: row.username,
      salt: row.salt,
      passwordHash: row.password_hash,
      name: row.name,
      campus: row.campus,
      organization: row.organization,
      gradeLabel: row.grade_label,
      verified: row.verified === 1,
      avatarUrl: row.avatar_url,
      stats: parseJson<UserStats>(row.stats_json, {orders: 0, repairs: 0, posts: 0}),
    };
  });
}

function hydrateSessions(database: DatabaseSync, db: DatabaseShape): void {
  const rows = database
    .prepare('SELECT token, user_id, created_at, expires_at FROM sessions ORDER BY created_at DESC')
    .all() as SessionRow[];

  db.sessions = rows.map((row): SessionRecord => ({
    token: row.token,
    userId: row.user_id,
    createdAt: row.created_at,
    expiresAt: row.expires_at,
  }));
}

function hydrateAnnouncements(database: DatabaseSync, db: DatabaseShape): void {
  const rows = database
    .prepare('SELECT id, audience, label, message, published_at FROM announcements ORDER BY published_at DESC')
    .all() as AnnouncementRow[];

  if (rows.length === 0) {
    return;
  }

  db.announcements = rows.map((row) => ({
    id: row.id,
    audience: row.audience,
    label: row.label,
    message: row.message,
    publishedAt: row.published_at,
  }));
}

function hydrateAuditLogs(database: DatabaseSync, db: DatabaseShape): void {
  const rows = database
    .prepare('SELECT id, type, actor_id, detail, created_at FROM audit_logs ORDER BY created_at DESC')
    .all() as AuditLogRow[];

  db.auditLogs = rows.map((row): AuditLogRecord => ({
    id: row.id,
    type: row.type,
    actorId: row.actor_id ?? undefined,
    detail: row.detail,
    createdAt: row.created_at,
  }));
}

function hydrateTakeoutOrders(database: DatabaseSync, db: DatabaseShape): void {
  const rows = database
    .prepare('SELECT * FROM takeout_orders ORDER BY created_at DESC')
    .all() as TakeoutOrderRow[];

  if (rows.length === 0) {
    return;
  }

  for (const identity of identities) {
    db.takeoutByIdentity[identity].orders = rows
      .filter((row) => row.identity === identity)
      .slice(0, 8)
      .map((row): TakeoutOrderRecord => ({
        id: row.id,
        title: row.title,
        destination: row.destination,
        reward: row.reward,
        tags: parseJson<string[]>(row.tags_json, []),
        icon: row.icon,
      }));
  }

  for (const row of rows.filter((item) => item.user_id)) {
    const activity = getOrCreateActivity(db, row.user_id!);
    activity.takeoutOrders.push({
      id: row.id,
      title: row.title,
      destination: row.destination,
      reward: row.reward,
      tags: parseJson<string[]>(row.tags_json, []),
      icon: row.icon,
      status: row.status,
      time: row.time_label,
      note: row.note ?? undefined,
    });
  }
}

function hydrateRepairRequests(database: DatabaseSync, db: DatabaseShape): void {
  const rows = database
    .prepare('SELECT * FROM repair_requests ORDER BY created_at DESC')
    .all() as RepairRequestRow[];

  if (rows.length === 0) {
    return;
  }

  for (const identity of identities) {
    db.repairByIdentity[identity].recentRequests = rows
      .filter((row) => row.identity === identity)
      .slice(0, 6)
      .map((row): RepairRequestRecord => ({
        id: row.id,
        title: row.title,
        location: row.location,
        status: row.status,
        time: row.time_label,
      }));
  }

  for (const row of rows.filter((item) => item.user_id)) {
    const activity = getOrCreateActivity(db, row.user_id!);
    activity.repairRequests.push({
      id: row.id,
      title: row.title,
      location: row.location,
      status: row.status,
      time: row.time_label,
      description: row.description ?? undefined,
    });
  }
}

function hydrateLostFoundItems(database: DatabaseSync, db: DatabaseShape): void {
  const rows = database
    .prepare('SELECT * FROM lost_found_items ORDER BY created_at DESC')
    .all() as LostFoundItemRow[];

  if (rows.length === 0) {
    return;
  }

  for (const identity of identities) {
    db.lostFoundByIdentity[identity].latestItems = rows
      .filter((row) => row.identity === identity)
      .slice(0, 8)
      .map((row): LostFoundItemRecord => ({
        id: row.id,
        title: row.title,
        location: row.location,
        time: row.time_label,
        type: row.type,
        image: row.image,
        description: row.description ?? undefined,
        featured: row.featured === 1 ? true : undefined,
      }));
  }

  for (const row of rows.filter((item) => item.user_id)) {
    const activity = getOrCreateActivity(db, row.user_id!);
    activity.lostFoundPosts.push({
      id: row.id,
      title: row.title,
      location: row.location,
      time: row.time_label,
      type: row.type,
      image: row.image,
      description: row.description ?? undefined,
      featured: row.featured === 1 ? true : undefined,
      contactHint: row.contact_hint ?? undefined,
    });
  }
}

function hydrateTeacherDocumentOrders(database: DatabaseSync, db: DatabaseShape): void {
  const rows = database
    .prepare('SELECT * FROM teacher_document_orders ORDER BY created_at DESC')
    .all() as TeacherDocumentOrderRow[];

  if (rows.length === 0) {
    return;
  }

  const rowsByTeacher = groupBy(rows, (row) => row.teacher_user_id);
  for (const [teacherUserId, teacherRows] of rowsByTeacher) {
    const record = db.teacherDocumentByUserId[teacherUserId];
    const latestOrder = teacherRows[0];
    if (!record || !latestOrder) {
      continue;
    }

    record.activeDeliveries = Math.max(record.activeDeliveries, teacherRows.length);
    record.activeOrder = {
      title: latestOrder.title,
      orderCode: latestOrder.order_code,
      urgency: latestOrder.urgency,
      pickupLabel: latestOrder.pickup_label,
      destinationLabel: latestOrder.destination_label,
      progress: latestOrder.progress,
      etaText: latestOrder.eta_text,
    };
  }
}

function hydrateTeacherLeaveApplications(database: DatabaseSync, db: DatabaseShape): void {
  const rows = database
    .prepare('SELECT * FROM teacher_leave_applications ORDER BY created_at DESC')
    .all() as TeacherLeaveApplicationRow[];

  if (rows.length === 0) {
    return;
  }

  const rowsByTeacher = groupBy(rows, (row) => row.teacher_user_id);
  for (const [teacherUserId, teacherRows] of rowsByTeacher) {
    const record = db.teacherLeaveByUserId[teacherUserId];
    if (!record) {
      continue;
    }

    record.applications = teacherRows.map((row): LeaveApplicationRecord => ({
      id: row.id,
      studentName: row.student_name,
      className: row.class_name,
      leaveType: row.leave_type,
      startTime: row.start_time,
      endTime: row.end_time,
      reason: row.reason,
      avatarText: row.avatar_text,
    }));
    record.pendingCount = record.applications.length;
  }
}

function hydrateTeacherStudentAffairApplications(database: DatabaseSync, db: DatabaseShape): void {
  const rows = database
    .prepare('SELECT * FROM teacher_student_affair_applications ORDER BY created_at DESC')
    .all() as TeacherStudentAffairApplicationRow[];

  if (rows.length === 0) {
    return;
  }

  const rowsByTeacher = groupBy(rows, (row) => row.teacher_user_id);
  for (const [teacherUserId, teacherRows] of rowsByTeacher) {
    const record = db.teacherStudentAffairsByUserId[teacherUserId];
    if (!record) {
      continue;
    }

    record.applications = teacherRows.map((row): StudentAffairApplicationRecord => ({
      id: row.id,
      title: row.title,
      applicant: row.applicant,
      category: row.category,
      quote: row.quote ?? undefined,
      detail: row.detail ?? undefined,
      meta: parseJson<string[]>(row.meta_json, []),
      icon: row.icon,
    }));
    record.stats.pending = record.applications.length;
  }
}

function hydrateCourierAccounts(database: DatabaseSync, db: DatabaseShape): void {
  const accountRows = database
    .prepare('SELECT * FROM courier_accounts ORDER BY user_id')
    .all() as CourierAccountRow[];
  const packageRows = database
    .prepare('SELECT * FROM courier_packages ORDER BY user_id, sort_order ASC')
    .all() as CourierPackageRow[];

  if (accountRows.length === 0) {
    return;
  }

  const packagesByUser = groupBy(packageRows, (row) => row.user_id);
  db.courierAccounts = Object.fromEntries(
    accountRows.map((row): [string, CourierAccountRecord] => [
      row.user_id,
      {
        stationName: row.station_name,
        pendingCount: row.pending_count,
        historyCount: row.history_count,
        noteTitle: row.note_title,
        noteMessage: row.note_message,
        packages: (packagesByUser.get(row.user_id) ?? []).map((packageRow): CourierPackageRecord => ({
          id: packageRow.id,
          title: packageRow.title,
          code: packageRow.code,
          location: packageRow.location,
          tag: packageRow.tag,
          tagTone: packageRow.tag_tone,
          icon: packageRow.icon,
          etaDays: packageRow.eta_days,
        })),
      },
    ]),
  );
}

function hydrateWalletAccounts(database: DatabaseSync, db: DatabaseShape): void {
  const accountRows = database
    .prepare('SELECT * FROM wallet_accounts ORDER BY user_id')
    .all() as WalletAccountRow[];
  const transactionRows = database
    .prepare('SELECT * FROM wallet_transactions ORDER BY user_id, sort_order ASC')
    .all() as WalletTransactionRow[];

  if (accountRows.length === 0) {
    return;
  }

  const transactionsByUser = groupBy(transactionRows, (row) => row.user_id);
  db.walletAccounts = Object.fromEntries(
    accountRows.map((row): [string, WalletAccountRecord] => [
      row.user_id,
      {
        totalBalance: row.total_balance,
        dailyChange: row.daily_change,
        walletBalanceLabel: row.wallet_balance_label,
        transactions: (transactionsByUser.get(row.user_id) ?? []).map((transactionRow): WalletTransactionRecord => ({
          id: transactionRow.id,
          title: transactionRow.title,
          time: transactionRow.time_label,
          amount: transactionRow.amount,
          iconKey: transactionRow.icon_key,
          tone: transactionRow.tone,
          positive: transactionRow.positive === null ? undefined : transactionRow.positive === 1,
        })),
      },
    ]),
  );
}

function hydrateCompareCarriers(database: DatabaseSync, db: DatabaseShape): void {
  const rows = database
    .prepare('SELECT * FROM compare_carriers ORDER BY sort_order ASC')
    .all() as CompareCarrierRow[];

  if (rows.length === 0) {
    return;
  }

  db.compareCarriers = rows.map((row): CompareCarrierRecord => ({
    id: row.id,
    company: row.company,
    title: row.title,
    basePrice: row.base_price,
    pricePerKg: row.price_per_kg,
    etaDays: row.eta_days,
    tag: row.tag,
    tagTone: row.tag_tone,
    logoTone: row.logo_tone,
  }));
}

function syncUsers(database: DatabaseSync, db: DatabaseShape): void {
  database.prepare('DELETE FROM users').run();
  const insertUser = database.prepare(`
    INSERT INTO users (
      id, identity, role, username, salt, password_hash, name, campus, organization,
      grade_label, verified, avatar_url, stats_json, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const updatedAt = new Date().toISOString();
  for (const user of db.users) {
    insertUser.run(
      user.id,
      user.identity,
      user.role ?? user.identity,
      user.username,
      user.salt,
      user.passwordHash,
      user.name,
      user.campus,
      user.organization,
      user.gradeLabel,
      user.verified ? 1 : 0,
      user.avatarUrl,
      JSON.stringify(user.stats),
      updatedAt,
    );
  }
}

function syncSessions(database: DatabaseSync, db: DatabaseShape): void {
  database.prepare('DELETE FROM sessions').run();
  const insertSession = database.prepare(`
    INSERT INTO sessions (token, user_id, created_at, expires_at)
    VALUES (?, ?, ?, ?)
  `);

  for (const session of db.sessions) {
    insertSession.run(session.token, session.userId, session.createdAt, session.expiresAt);
  }
}

function syncAnnouncements(database: DatabaseSync, db: DatabaseShape): void {
  database.prepare('DELETE FROM announcements').run();
  const insertAnnouncement = database.prepare(`
    INSERT INTO announcements (id, audience, label, message, published_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (const announcement of db.announcements) {
    insertAnnouncement.run(
      announcement.id,
      announcement.audience,
      announcement.label,
      announcement.message,
      announcement.publishedAt,
    );
  }
}

function syncAuditLogs(database: DatabaseSync, db: DatabaseShape): void {
  database.prepare('DELETE FROM audit_logs').run();
  const insertAuditLog = database.prepare(`
    INSERT INTO audit_logs (id, type, actor_id, detail, created_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (const auditLog of db.auditLogs) {
    insertAuditLog.run(
      auditLog.id,
      auditLog.type,
      auditLog.actorId ?? null,
      auditLog.detail,
      auditLog.createdAt,
    );
  }
}

function syncTakeoutOrders(database: DatabaseSync, db: DatabaseShape): void {
  database.prepare('DELETE FROM takeout_orders').run();
  const insertOrder = database.prepare(`
    INSERT INTO takeout_orders (
      id, identity, user_id, title, destination, reward, tags_json, icon,
      status, time_label, note, created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const row of collectTakeoutRows(db)) {
    insertOrder.run(
      row.id,
      row.identity,
      row.user_id,
      row.title,
      row.destination,
      row.reward,
      row.tags_json,
      row.icon,
      row.status,
      row.time_label,
      row.note,
      row.created_at,
    );
  }
}

function syncRepairRequests(database: DatabaseSync, db: DatabaseShape): void {
  database.prepare('DELETE FROM repair_requests').run();
  const insertRequest = database.prepare(`
    INSERT INTO repair_requests (
      id, identity, user_id, title, location, status, time_label, description, created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const row of collectRepairRows(db)) {
    insertRequest.run(
      row.id,
      row.identity,
      row.user_id,
      row.title,
      row.location,
      row.status,
      row.time_label,
      row.description,
      row.created_at,
    );
  }
}

function syncLostFoundItems(database: DatabaseSync, db: DatabaseShape): void {
  database.prepare('DELETE FROM lost_found_items').run();
  const insertItem = database.prepare(`
    INSERT INTO lost_found_items (
      id, identity, user_id, title, location, time_label, type, image,
      description, featured, contact_hint, created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const row of collectLostFoundRows(db)) {
    insertItem.run(
      row.id,
      row.identity,
      row.user_id,
      row.title,
      row.location,
      row.time_label,
      row.type,
      row.image,
      row.description,
      row.featured,
      row.contact_hint,
      row.created_at,
    );
  }
}

function syncTeacherDocumentOrders(database: DatabaseSync, db: DatabaseShape): void {
  database.prepare('DELETE FROM teacher_document_orders').run();
  const insertOrder = database.prepare(`
    INSERT INTO teacher_document_orders (
      order_code, teacher_user_id, title, urgency, pickup_label,
      destination_label, progress, eta_text, created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const row of collectTeacherDocumentRows(db)) {
    insertOrder.run(
      row.order_code,
      row.teacher_user_id,
      row.title,
      row.urgency,
      row.pickup_label,
      row.destination_label,
      row.progress,
      row.eta_text,
      row.created_at,
    );
  }
}

function syncTeacherLeaveApplications(database: DatabaseSync, db: DatabaseShape): void {
  database.prepare('DELETE FROM teacher_leave_applications').run();
  const insertApplication = database.prepare(`
    INSERT INTO teacher_leave_applications (
      id, teacher_user_id, student_name, class_name, leave_type,
      start_time, end_time, reason, avatar_text, created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const row of collectTeacherLeaveRows(db)) {
    insertApplication.run(
      row.id,
      row.teacher_user_id,
      row.student_name,
      row.class_name,
      row.leave_type,
      row.start_time,
      row.end_time,
      row.reason,
      row.avatar_text,
      row.created_at,
    );
  }
}

function syncTeacherStudentAffairApplications(database: DatabaseSync, db: DatabaseShape): void {
  database.prepare('DELETE FROM teacher_student_affair_applications').run();
  const insertApplication = database.prepare(`
    INSERT INTO teacher_student_affair_applications (
      id, teacher_user_id, title, applicant, category, quote,
      detail, meta_json, icon, created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const row of collectTeacherStudentAffairRows(db)) {
    insertApplication.run(
      row.id,
      row.teacher_user_id,
      row.title,
      row.applicant,
      row.category,
      row.quote,
      row.detail,
      row.meta_json,
      row.icon,
      row.created_at,
    );
  }
}

function syncCourierAccounts(database: DatabaseSync, db: DatabaseShape): void {
  database.prepare('DELETE FROM courier_packages').run();
  database.prepare('DELETE FROM courier_accounts').run();

  const insertAccount = database.prepare(`
    INSERT INTO courier_accounts (
      user_id, station_name, pending_count, history_count, note_title, note_message, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const insertPackage = database.prepare(`
    INSERT INTO courier_packages (
      id, user_id, title, code, location, tag, tag_tone, icon, eta_days, sort_order
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const updatedAt = new Date().toISOString();

  for (const [userId, account] of Object.entries(db.courierAccounts)) {
    insertAccount.run(
      userId,
      account.stationName,
      account.pendingCount,
      account.historyCount,
      account.noteTitle,
      account.noteMessage,
      updatedAt,
    );

    account.packages.forEach((packageRecord, index) => {
      insertPackage.run(
        packageRecord.id,
        userId,
        packageRecord.title,
        packageRecord.code,
        packageRecord.location,
        packageRecord.tag,
        packageRecord.tagTone,
        packageRecord.icon,
        packageRecord.etaDays,
        index,
      );
    });
  }
}

function syncWalletAccounts(database: DatabaseSync, db: DatabaseShape): void {
  database.prepare('DELETE FROM wallet_transactions').run();
  database.prepare('DELETE FROM wallet_accounts').run();

  const insertAccount = database.prepare(`
    INSERT INTO wallet_accounts (
      user_id, total_balance, daily_change, wallet_balance_label, updated_at
    )
    VALUES (?, ?, ?, ?, ?)
  `);
  const insertTransaction = database.prepare(`
    INSERT INTO wallet_transactions (
      id, user_id, title, time_label, amount, icon_key, tone, positive, sort_order
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const updatedAt = new Date().toISOString();

  for (const [userId, account] of Object.entries(db.walletAccounts)) {
    insertAccount.run(
      userId,
      account.totalBalance,
      account.dailyChange,
      account.walletBalanceLabel,
      updatedAt,
    );

    account.transactions.forEach((transaction, index) => {
      insertTransaction.run(
        transaction.id,
        userId,
        transaction.title,
        transaction.time,
        transaction.amount,
        transaction.iconKey,
        transaction.tone,
        transaction.positive === undefined ? null : transaction.positive ? 1 : 0,
        index,
      );
    });
  }
}

function syncCompareCarriers(database: DatabaseSync, db: DatabaseShape): void {
  database.prepare('DELETE FROM compare_carriers').run();
  const insertCarrier = database.prepare(`
    INSERT INTO compare_carriers (
      id, company, title, base_price, price_per_kg, eta_days, tag, tag_tone, logo_tone, sort_order
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  db.compareCarriers.forEach((carrier, index) => {
    insertCarrier.run(
      carrier.id,
      carrier.company,
      carrier.title,
      carrier.basePrice,
      carrier.pricePerKg,
      carrier.etaDays,
      carrier.tag,
      carrier.tagTone,
      carrier.logoTone,
      index,
    );
  });
}

function collectTakeoutRows(db: DatabaseShape): TakeoutOrderRow[] {
  const rows = new Map<string, TakeoutOrderRow>();

  for (const identity of identities) {
    db.takeoutByIdentity[identity].orders.forEach((order, index) => {
      rows.set(order.id, {
        id: order.id,
        identity,
        user_id: null,
        title: order.title,
        destination: order.destination,
        reward: order.reward,
        tags_json: JSON.stringify(order.tags),
        icon: order.icon,
        status: 'open',
        time_label: 'recent',
        note: null,
        created_at: syntheticCreatedAt(index),
      });
    });
  }

  for (const [userId, activity] of Object.entries(db.userActivityByUserId)) {
    const identity = getUserIdentity(db, userId);
    if (!identity) {
      continue;
    }

    activity.takeoutOrders.forEach((order, index) => {
      const existing = rows.get(order.id);
      rows.set(order.id, {
        id: order.id,
        identity: existing?.identity ?? identity,
        user_id: userId,
        title: order.title,
        destination: order.destination,
        reward: order.reward,
        tags_json: JSON.stringify(order.tags),
        icon: order.icon,
        status: order.status,
        time_label: order.time,
        note: order.note ?? null,
        created_at: existing?.created_at ?? syntheticCreatedAt(index),
      });
    });
  }

  return Array.from(rows.values());
}

function collectRepairRows(db: DatabaseShape): RepairRequestRow[] {
  const rows = new Map<string, RepairRequestRow>();

  for (const identity of identities) {
    db.repairByIdentity[identity].recentRequests.forEach((request, index) => {
      rows.set(request.id, {
        id: request.id,
        identity,
        user_id: null,
        title: request.title,
        location: request.location,
        status: request.status,
        time_label: request.time,
        description: null,
        created_at: syntheticCreatedAt(index),
      });
    });
  }

  for (const [userId, activity] of Object.entries(db.userActivityByUserId)) {
    const identity = getUserIdentity(db, userId);
    if (!identity) {
      continue;
    }

    activity.repairRequests.forEach((request, index) => {
      const existing = rows.get(request.id);
      rows.set(request.id, {
        id: request.id,
        identity: existing?.identity ?? identity,
        user_id: userId,
        title: request.title,
        location: request.location,
        status: request.status,
        time_label: request.time,
        description: request.description ?? existing?.description ?? null,
        created_at: existing?.created_at ?? syntheticCreatedAt(index),
      });
    });
  }

  return Array.from(rows.values());
}

function collectLostFoundRows(db: DatabaseShape): LostFoundItemRow[] {
  const rows = new Map<string, LostFoundItemRow>();

  for (const identity of identities) {
    db.lostFoundByIdentity[identity].latestItems.forEach((item, index) => {
      rows.set(item.id, {
        id: item.id,
        identity,
        user_id: null,
        title: item.title,
        location: item.location,
        time_label: item.time,
        type: item.type,
        image: item.image,
        description: item.description ?? null,
        featured: item.featured ? 1 : 0,
        contact_hint: null,
        created_at: syntheticCreatedAt(index),
      });
    });
  }

  for (const [userId, activity] of Object.entries(db.userActivityByUserId)) {
    const identity = getUserIdentity(db, userId);
    if (!identity) {
      continue;
    }

    activity.lostFoundPosts.forEach((item, index) => {
      const existing = rows.get(item.id);
      rows.set(item.id, {
        id: item.id,
        identity: existing?.identity ?? identity,
        user_id: userId,
        title: item.title,
        location: item.location,
        time_label: item.time,
        type: item.type,
        image: item.image,
        description: item.description ?? existing?.description ?? null,
        featured: item.featured || existing?.featured === 1 ? 1 : 0,
        contact_hint: item.contactHint ?? existing?.contact_hint ?? null,
        created_at: existing?.created_at ?? syntheticCreatedAt(index),
      });
    });
  }

  return Array.from(rows.values());
}

function collectTeacherDocumentRows(db: DatabaseShape): TeacherDocumentOrderRow[] {
  return Object.entries(db.teacherDocumentByUserId).map(([teacherUserId, record], index) => ({
    order_code: record.activeOrder.orderCode,
    teacher_user_id: teacherUserId,
    title: record.activeOrder.title,
    urgency: record.activeOrder.urgency,
    pickup_label: record.activeOrder.pickupLabel,
    destination_label: record.activeOrder.destinationLabel,
    progress: record.activeOrder.progress,
    eta_text: record.activeOrder.etaText,
    created_at: syntheticCreatedAt(index),
  }));
}

function collectTeacherLeaveRows(db: DatabaseShape): TeacherLeaveApplicationRow[] {
  return Object.entries(db.teacherLeaveByUserId).flatMap(([teacherUserId, record]) =>
    record.applications.map((application, index): TeacherLeaveApplicationRow => ({
      id: application.id,
      teacher_user_id: teacherUserId,
      student_name: application.studentName,
      class_name: application.className,
      leave_type: application.leaveType,
      start_time: application.startTime,
      end_time: application.endTime,
      reason: application.reason,
      avatar_text: application.avatarText,
      created_at: syntheticCreatedAt(index),
    })),
  );
}

function collectTeacherStudentAffairRows(db: DatabaseShape): TeacherStudentAffairApplicationRow[] {
  return Object.entries(db.teacherStudentAffairsByUserId).flatMap(([teacherUserId, record]) =>
    record.applications.map((application, index): TeacherStudentAffairApplicationRow => ({
      id: application.id,
      teacher_user_id: teacherUserId,
      title: application.title,
      applicant: application.applicant,
      category: application.category,
      quote: application.quote ?? null,
      detail: application.detail ?? null,
      meta_json: JSON.stringify(application.meta ?? []),
      icon: application.icon,
      created_at: syntheticCreatedAt(index),
    })),
  );
}

function getOrCreateActivity(db: DatabaseShape, userId: string): UserActivityRecord {
  const existing = db.userActivityByUserId[userId];
  if (existing) {
    return existing;
  }

  const created: UserActivityRecord = {
    takeoutOrders: [],
    repairRequests: [],
    lostFoundPosts: [],
  };
  db.userActivityByUserId[userId] = created;
  return created;
}

function resetActivityRecords(db: DatabaseShape): void {
  for (const activity of Object.values(db.userActivityByUserId)) {
    activity.takeoutOrders = [];
    activity.repairRequests = [];
    activity.lostFoundPosts = [];
  }
}

function getUserIdentity(db: DatabaseShape, userId: string): Identity | null {
  return db.users.find((user) => user.id === userId)?.identity ?? null;
}

function normalizedTablesAreEmpty(database: DatabaseSync): boolean {
  return (
    tableCount(database, 'users') === 0 &&
    tableCount(database, 'announcements') === 0 &&
    tableCount(database, 'takeout_orders') === 0 &&
    tableCount(database, 'repair_requests') === 0 &&
    tableCount(database, 'lost_found_items') === 0
  );
}

function teacherWorkflowTablesAreEmpty(database: DatabaseSync): boolean {
  return (
    tableCount(database, 'teacher_document_orders') === 0 &&
    tableCount(database, 'teacher_leave_applications') === 0 &&
    tableCount(database, 'teacher_student_affair_applications') === 0
  );
}

function walletCourierTablesAreEmpty(database: DatabaseSync): boolean {
  return (
    tableCount(database, 'courier_accounts') === 0 &&
    tableCount(database, 'courier_packages') === 0 &&
    tableCount(database, 'wallet_accounts') === 0 &&
    tableCount(database, 'wallet_transactions') === 0 &&
    tableCount(database, 'compare_carriers') === 0
  );
}

function tableCount(database: DatabaseSync, tableName: string): number {
  const row = database.prepare(`SELECT COUNT(*) AS count FROM ${tableName}`).get() as {count: number};
  return row.count;
}

function groupBy<T>(items: T[], getKey: (item: T) => string): Map<string, T[]> {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const key = getKey(item);
    const group = groups.get(key) ?? [];
    group.push(item);
    groups.set(key, group);
  }

  return groups;
}

function parseJson<T>(source: string, fallback: T): T {
  try {
    return JSON.parse(source) as T;
  } catch {
    return fallback;
  }
}

function syntheticCreatedAt(index: number): string {
  return new Date(Date.now() - index * 1000).toISOString();
}
