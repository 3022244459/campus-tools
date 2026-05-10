import type {
  AdminOverview,
  AnnouncementRecord,
  CompareQuoteResponse,
  DatabaseShape,
  HomeBootstrap,
  Identity,
  LostFoundItemRecord,
  LostFoundRecord,
  NavigationRecord,
  PublicUser,
  RepairRecord,
  ServiceCenterRecord,
  SessionRecord,
  TakeoutOrderRecord,
  TakeoutRecord,
  TeacherCampusCardRecord,
  TeacherDocumentRecord,
  TeacherLeaveRecord,
  TeacherMeetingRecord,
  TeacherOfficeRecord,
  TeacherSalaryRecord,
  TeacherStudyRoomRecord,
  TeacherStudentAffairsRecord,
  UserActivityRecord,
  UserPostHistoryItemRecord,
  UserRecord,
  UserRepairHistoryItemRecord,
  UserTakeoutHistoryItemRecord,
} from './types.ts';
import {getServerConfig} from './config.ts';
import {
  createRecordId,
  createShortCode,
  createToken,
  getUserRole,
  hashToken,
  nowIso,
  toPublicUser,
  verifyToken,
} from './utils.ts';
import type {
  AnnouncementSubmitInput,
  LostFoundSubmitInput,
  RepairSubmitInput,
  ReviewInput,
  TakeoutSubmitInput,
  TeacherDocumentSubmitInput,
} from './validation.ts';

export function findUserByCredentials(
  db: DatabaseShape,
  identity: UserRecord['identity'],
  username: string,
): UserRecord | undefined {
  return db.users.find((user) => user.identity === identity && user.username === username);
}

export function createSession(
  db: DatabaseShape,
  userId: string,
  sessionTtlHours = getServerConfig().sessionTtlHours,
): SessionRecord {
  const createdAtMs = Date.now();
  const createdAt = new Date(createdAtMs).toISOString();
  const expiresAt = new Date(createdAtMs + sessionTtlHours * 60 * 60 * 1000).toISOString();
  const token = createToken();
  const session: SessionRecord = {
    token: hashToken(token),
    userId,
    createdAt,
    expiresAt,
  };

  removeExpiredSessions(db, createdAt);
  db.sessions = db.sessions.filter((item) => item.userId !== userId);
  db.sessions.push(session);
  return {...session, token};
}

export function removeExpiredSessions(db: DatabaseShape, now = nowIso()): number {
  const beforeCount = db.sessions.length;
  db.sessions = db.sessions.filter((session) => session.expiresAt > now);
  return beforeCount - db.sessions.length;
}

export function removeSession(db: DatabaseShape, token: string): void {
  db.sessions = db.sessions.filter((session) => !verifyToken(session.token, token));
}

export function findUserByToken(db: DatabaseShape, token: string, now = nowIso()): PublicUser | null {
  const session = db.sessions.find((item) => item.expiresAt > now && verifyToken(item.token, token));
  if (!session) {
    return null;
  }

  const user = db.users.find((item) => item.id === session.userId);
  return user ? toPublicUser(user) : null;
}

export function buildHomeBootstrap(user: PublicUser, db: DatabaseShape): HomeBootstrap {
  const announcement =
    db.announcements.find((item) => item.audience === user.identity) ??
    db.announcements.find((item) => item.audience === 'all');

  return {
    appName: '校园宝',
    campusName: user.campus,
    announcement: {
      label: announcement?.label ?? '校园公告',
      message: announcement?.message ?? '暂无公告',
      publishedAt: announcement?.publishedAt ?? nowIso(),
    },
    banner: user.identity === 'teacher'
      ? {
          title: '教师服务中枢',
          description: '会议、审批、文档和校园卡能力已经接入本地校园服务平台。',
        }
      : {
          title: '校园联接',
          description: '当前展示会优先读取校园服务，网络繁忙时回退到校园数据。',
        },
  };
}

export function buildAdminOverview(db: DatabaseShape): AdminOverview {
  const now = nowIso();
  const students = db.users.filter((user) => getUserRole(user) === 'student').length;
  const teachers = db.users.filter((user) => getUserRole(user) === 'teacher').length;
  const admins = db.users.filter((user) => getUserRole(user) === 'admin').length;

  return {
    stats: {
      users: db.users.length,
      students,
      teachers,
      admins,
      activeSessions: db.sessions.filter((session) => session.expiresAt > now).length,
      takeoutOrders: countValues(db.takeoutByIdentity, (item) => item.orders.length),
      repairRequests: countValues(db.repairByIdentity, (item) => item.recentRequests.length),
      lostFoundItems: countValues(db.lostFoundByIdentity, (item) => item.latestItems.length),
      pendingApprovals: countValues(db.teacherLeaveByUserId, (item) => item.pendingCount) +
        countValues(db.teacherStudentAffairsByUserId, (item) => item.stats.pending),
      announcements: db.announcements.length,
    },
    announcements: [...db.announcements]
      .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt))
      .slice(0, 8),
    recentAuditLogs: db.auditLogs.slice(0, 12),
  };
}

export function publishAnnouncement(
  db: DatabaseShape,
  actorId: string,
  input: AnnouncementSubmitInput,
): AnnouncementRecord {
  const announcement: AnnouncementRecord = {
    id: createRecordId('ann'),
    audience: input.audience,
    label: input.label,
    message: input.message,
    publishedAt: nowIso(),
  };

  db.announcements.unshift(announcement);
  db.auditLogs.unshift({
    id: createRecordId('audit'),
    type: 'admin.announcement.publish',
    actorId,
    detail: `Published announcement ${announcement.id} for ${announcement.audience}`,
    createdAt: announcement.publishedAt,
  });

  return announcement;
}

export function buildCompareQuotes(
  db: DatabaseShape,
  weight: number,
  destination: string,
): CompareQuoteResponse {
  const subsidy = destination.includes('天津') ? 1 : 0.5;

  const quotes = db.compareCarriers
    .map((carrier) => {
      const rawPrice = carrier.basePrice + carrier.pricePerKg * weight - subsidy;
      const finalPrice = Math.max(rawPrice, 5.5);

      return {
        company: carrier.company,
        title: carrier.title,
        time: carrier.etaDays,
        price: finalPrice.toFixed(1),
        tag: carrier.tag,
        tagTone: carrier.tagTone,
        logoTone: carrier.logoTone,
      };
    })
    .sort((left, right) => Number(left.price) - Number(right.price));

  return {
    destination,
    weight,
    subsidy,
    quotes,
  };
}

export function getNavigationData(db: DatabaseShape, identity: Identity): NavigationRecord {
  return db.navigationByIdentity[identity];
}

export function getServiceCenterData(db: DatabaseShape, identity: Identity): ServiceCenterRecord {
  return db.serviceCenterByIdentity[identity];
}

export function getTakeoutData(db: DatabaseShape, identity: Identity): TakeoutRecord {
  return db.takeoutByIdentity[identity];
}

export function getRepairData(db: DatabaseShape, identity: Identity): RepairRecord {
  return db.repairByIdentity[identity];
}

export function getLostFoundData(db: DatabaseShape, identity: Identity): LostFoundRecord {
  return db.lostFoundByIdentity[identity];
}

export function getUserActivityData(db: DatabaseShape, userId: string): UserActivityRecord | null {
  return db.userActivityByUserId[userId] ?? null;
}

export function getTeacherOfficeData(db: DatabaseShape, userId: string): TeacherOfficeRecord | null {
  return db.teacherOfficeByUserId[userId] ?? null;
}

export function getTeacherSalaryData(db: DatabaseShape, userId: string): TeacherSalaryRecord | null {
  return db.teacherSalaryByUserId[userId] ?? null;
}

export function getTeacherCampusCardData(db: DatabaseShape, userId: string): TeacherCampusCardRecord | null {
  return db.teacherCampusCardByUserId[userId] ?? null;
}

export function getTeacherMeetingData(db: DatabaseShape, userId: string): TeacherMeetingRecord | null {
  return db.teacherMeetingByUserId[userId] ?? null;
}

export function getTeacherLeaveData(db: DatabaseShape, userId: string): TeacherLeaveRecord | null {
  return db.teacherLeaveByUserId[userId] ?? null;
}

export function getTeacherStudentAffairsData(db: DatabaseShape, userId: string): TeacherStudentAffairsRecord | null {
  return db.teacherStudentAffairsByUserId[userId] ?? null;
}

export function getTeacherStudyRoomData(db: DatabaseShape, userId: string): TeacherStudyRoomRecord | null {
  return db.teacherStudyRoomByUserId[userId] ?? null;
}

export function getTeacherDocumentData(db: DatabaseShape, userId: string): TeacherDocumentRecord | null {
  return db.teacherDocumentByUserId[userId] ?? null;
}

export function submitTakeoutOrder(
  db: DatabaseShape,
  userId: string,
  identity: Identity,
  input: TakeoutSubmitInput,
): TakeoutRecord {
  const record = db.takeoutByIdentity[identity];
  const publicRecord = identity === 'teacher' ? db.takeoutByIdentity.student : record;
  const activityRecord = getOrCreateUserActivityRecord(db, userId);
  const nextOrder: TakeoutOrderRecord = {
    id: createRecordId('takeout'),
    title: input.title,
    destination: input.destination,
    reward: normalizeReward(input.reward),
    tags: input.tags,
    icon: input.icon,
  };

  publicRecord.orders = [nextOrder, ...publicRecord.orders].slice(0, 8);
  publicRecord.nearbyOrders += 1;

  if (record !== publicRecord) {
    record.orders = [nextOrder, ...record.orders].slice(0, 8);
    record.nearbyOrders += 1;
  }

  const activityItem: UserTakeoutHistoryItemRecord = {
    ...nextOrder,
    status: 'open',
    time: '刚刚',
    note: '已同步到我的代取订单',
  };
  activityRecord.takeoutOrders = [activityItem, ...activityRecord.takeoutOrders].slice(0, 8);

  incrementUserStat(db, userId, 'orders');
  return record;
}

export function submitRepairRequest(
  db: DatabaseShape,
  userId: string,
  identity: Identity,
  input: RepairSubmitInput,
): RepairRecord {
  const record = db.repairByIdentity[identity];
  const activityRecord = getOrCreateUserActivityRecord(db, userId);
  const repairType = record.repairTypes.find((item) => item.id === input.typeId);
  const title = repairType ? `${repairType.label}报修` : '新的报修申请';
  const status: RepairRecord['recentRequests'][number]['status'] = input.imageCount > 0 ? 'scheduled' : 'pending';
  const activityItem: UserRepairHistoryItemRecord = {
    id: createRecordId('repair'),
    title,
    location: input.location,
    status,
    time: '刚刚',
    description: input.description,
  };

  record.recentRequests = [
    {
      id: activityItem.id,
      title: activityItem.title,
      location: activityItem.location,
      status: activityItem.status,
      time: activityItem.time,
    },
    ...(record.recentRequests ?? []),
  ].slice(0, 6);
  activityRecord.repairRequests = [activityItem, ...activityRecord.repairRequests].slice(0, 8);

  incrementUserStat(db, userId, 'repairs');
  return record;
}

export function submitLostFoundItem(
  db: DatabaseShape,
  userId: string,
  identity: Identity,
  input: LostFoundSubmitInput,
): LostFoundRecord {
  const record = db.lostFoundByIdentity[identity];
  const activityRecord = getOrCreateUserActivityRecord(db, userId);
  const nextItem: LostFoundItemRecord = {
    id: createRecordId(input.type),
    title: input.title,
    location: input.location,
    time: '刚刚',
    type: input.type,
    image: input.type === 'found'
      ? './images/remote-16-d9a6224c65.png'
      : './images/remote-17-6a0cb9b443.png',
    description: input.description,
  };

  record.latestItems = [nextItem, ...record.latestItems].slice(0, 8);
  if (input.type === 'found') {
    record.foundCount += 1;
  }

  const activityItem: UserPostHistoryItemRecord = {
    ...nextItem,
    contactHint: '可在个人中心继续跟进处理状态',
  };
  activityRecord.lostFoundPosts = [activityItem, ...activityRecord.lostFoundPosts].slice(0, 8);

  incrementUserStat(db, userId, 'posts');
  return record;
}

export function submitTeacherDocument(
  db: DatabaseShape,
  userId: string,
  input: TeacherDocumentSubmitInput,
): TeacherDocumentRecord | null {
  const record = db.teacherDocumentByUserId[userId];
  if (!record) {
    return null;
  }

  record.activeDeliveries += 1;
  record.activeOrder = {
    title: input.remarks || '新文件代送申请',
    orderCode: createShortCode('WL'),
    urgency: input.urgency,
    pickupLabel: input.pickupLocation,
    destinationLabel: input.destinationLocation,
    progress: 15,
    etaText: input.urgency === '加急'
      ? '已提交，预计 10 分钟内接单'
      : '已提交，预计 20 分钟内接单',
  };

  return record;
}

export function reviewTeacherLeave(
  db: DatabaseShape,
  userId: string,
  input: ReviewInput,
): TeacherLeaveRecord | null {
  const record = db.teacherLeaveByUserId[userId];
  if (!record) {
    return null;
  }

  const nextApplications = record.applications.filter((item) => item.id !== input.applicationId);
  if (nextApplications.length === record.applications.length) {
    return null;
  }

  record.applications = nextApplications;
  record.pendingCount = Math.max(0, record.pendingCount - 1);
  return record;
}

export function reviewTeacherStudentAffair(
  db: DatabaseShape,
  userId: string,
  input: ReviewInput,
): TeacherStudentAffairsRecord | null {
  const record = db.teacherStudentAffairsByUserId[userId];
  if (!record) {
    return null;
  }

  const nextApplications = record.applications.filter((item) => item.id !== input.applicationId);
  if (nextApplications.length === record.applications.length) {
    return null;
  }

  record.applications = nextApplications;
  record.stats.pending = Math.max(0, record.stats.pending - 1);
  if (input.decision === 'approve') {
    record.stats.approved += 1;
  } else {
    record.stats.rejected += 1;
  }

  return record;
}

function incrementUserStat(
  db: DatabaseShape,
  userId: string,
  key: keyof DatabaseShape['users'][number]['stats'],
) {
  const user = db.users.find((item) => item.id === userId);
  if (!user) {
    return;
  }

  user.stats[key] += 1;
}

function getOrCreateUserActivityRecord(db: DatabaseShape, userId: string): UserActivityRecord {
  const existingRecord = db.userActivityByUserId[userId];
  if (existingRecord) {
    return existingRecord;
  }

  const createdRecord: UserActivityRecord = {
    takeoutOrders: [],
    repairRequests: [],
    lostFoundPosts: [],
  };
  db.userActivityByUserId[userId] = createdRecord;
  return createdRecord;
}

function normalizeReward(reward: string) {
  const numericValue = Number(reward.replace('¥', ''));
  const finalValue = Number.isFinite(numericValue) ? numericValue : 0;
  return `¥${finalValue.toFixed(1)}`;
}

function countValues<T>(record: Record<string, T>, mapper: (item: T) => number): number {
  return Object.values(record).reduce((total, item) => total + mapper(item), 0);
}
