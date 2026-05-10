import {getRequestMetricsSnapshot, type RequestMetricsSnapshot} from '../observability.ts';
import {buildAdminOverview, publishAnnouncement} from '../services.ts';
import type {AdminOverview, AdminUserDirectory, AuditLogRecord, PublicUser, SessionRecord, UserRecord} from '../types.ts';
import type {
  AdminUserSessionRevokeInput,
  AdminUsersQueryInput,
  AnnouncementSubmitInput,
  AuditLogQueryInput,
} from '../validation.ts';
import {createRecordId, getUserRole} from '../utils.ts';
import {databaseRepository} from './databaseRepository.ts';

export interface AdminSessionRevokeResult {
  userId: string;
  username: string;
  revokedCount: number;
}

export interface AdminRepository {
  getOverview: () => AdminOverview;
  getMetrics: () => RequestMetricsSnapshot;
  getAuditLogs: (input: AuditLogQueryInput) => AuditLogRecord[];
  getUsers: (input: AdminUsersQueryInput) => AdminUserDirectory;
  revokeUserSessions: (actor: PublicUser, input: AdminUserSessionRevokeInput) => AdminSessionRevokeResult | null;
  publishAnnouncement: (actor: PublicUser, input: AnnouncementSubmitInput) => AdminOverview;
}

export const adminRepository: AdminRepository = {
  getOverview() {
    return buildAdminOverview(databaseRepository.getSnapshot());
  },

  getMetrics() {
    return getRequestMetricsSnapshot();
  },

  getAuditLogs(input) {
    return [...databaseRepository.getSnapshot().auditLogs]
      .filter((item) => !input.type || item.type === input.type)
      .filter((item) => !input.actorId || item.actorId === input.actorId)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
      .slice(0, input.limit);
  },

  getUsers(input) {
    const db = databaseRepository.getSnapshot();
    const now = new Date().toISOString();
    const query = input.q?.toLowerCase();

    const items = db.users
      .map((user) => buildAdminUserSummary(user, db.sessions, now))
      .filter((user) => !input.identity || user.identity === input.identity)
      .filter((user) => !input.role || user.role === input.role)
      .filter((user) => {
        if (!query) {
          return true;
        }

        return [
          user.username,
          user.name,
          user.campus,
          user.organization,
          user.gradeLabel,
        ].some((value) => value.toLowerCase().includes(query));
      })
      .sort((left, right) =>
        right.activeSessionCount - left.activeSessionCount ||
        roleRank(right.role) - roleRank(left.role) ||
        left.username.localeCompare(right.username),
      );

    return {
      total: items.length,
      items: items.slice(0, input.limit),
    };
  },

  revokeUserSessions(actor, input) {
    let result: AdminSessionRevokeResult | null = null;

    databaseRepository.update((draft) => {
      const target = draft.users.find((user) => user.id === input.userId);
      if (!target) {
        return;
      }

      const beforeCount = draft.sessions.length;
      draft.sessions = draft.sessions.filter((session) => session.userId !== input.userId);
      const revokedCount = beforeCount - draft.sessions.length;
      const timestamp = new Date().toISOString();

      draft.auditLogs.unshift({
        id: createRecordId('audit'),
        type: 'admin.sessions.revoke',
        actorId: actor.id,
        detail: `${actor.username} revoked ${revokedCount} sessions for ${target.username}`,
        createdAt: timestamp,
      });

      result = {
        userId: target.id,
        username: target.username,
        revokedCount,
      };
    });

    return result;
  },

  publishAnnouncement(actor, input) {
    const db = databaseRepository.update((draft) => {
      publishAnnouncement(draft, actor.id, input);
    });

    return buildAdminOverview(db);
  },
};

function buildAdminUserSummary(user: UserRecord, sessions: SessionRecord[], now: string) {
  const userSessions = sessions.filter((session) => session.userId === user.id);
  const activeSessions = userSessions.filter((session) => session.expiresAt > now);
  const latestSession = [...userSessions].sort((left, right) => right.createdAt.localeCompare(left.createdAt))[0];
  const latestActiveSession = [...activeSessions].sort((left, right) => right.expiresAt.localeCompare(left.expiresAt))[0];

  return {
    id: user.id,
    identity: user.identity,
    role: getUserRole(user),
    username: user.username,
    name: user.name,
    campus: user.campus,
    organization: user.organization,
    gradeLabel: user.gradeLabel,
    verified: user.verified,
    stats: {...user.stats},
    activeSessionCount: activeSessions.length,
    ...(latestSession ? {lastSessionAt: latestSession.createdAt} : {}),
    ...(latestActiveSession ? {sessionExpiresAt: latestActiveSession.expiresAt} : {}),
  };
}

function roleRank(role: string): number {
  if (role === 'admin') {
    return 3;
  }

  if (role === 'teacher') {
    return 2;
  }

  return 1;
}
