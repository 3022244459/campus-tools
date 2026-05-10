import {createSession, findUserByCredentials, findUserByToken, removeExpiredSessions, removeSession} from '../services.ts';
import type {Identity, PublicUser, SessionRecord, UserRecord} from '../types.ts';
import {createRecordId, nowIso, toPublicUser, verifyPassword} from '../utils.ts';
import {databaseRepository} from './databaseRepository.ts';

interface LoginResult {
  session: SessionRecord;
  user: PublicUser;
}

export interface AuthRepository {
  loginWithPassword: (identity: Identity, username: string, password: string) => LoginResult | null;
  findUserByToken: (token: string) => PublicUser | null;
  endSession: (token: string, actor?: PublicUser | null) => void;
}

export const authRepository: AuthRepository = {
  loginWithPassword(identity, username, password) {
    const db = databaseRepository.getSnapshot();
    const user = findUserByCredentials(db, identity, username);
    if (!user || !verifyPassword(user, password)) {
      return null;
    }

    let createdSession: SessionRecord | null = null;
    databaseRepository.update((draft) => {
      createdSession = createSession(draft, user.id);
      appendAuthAuditLog(draft.users, draft.auditLogs, user.id, 'auth.login');
    });

    return {
      session: createdSession!,
      user: toPublicUser(user),
    };
  },

  findUserByToken(token) {
    const now = nowIso();
    const db = databaseRepository.getSnapshot();
    const hasExpiredSessions = db.sessions.some((session) => session.expiresAt <= now);
    if (!hasExpiredSessions) {
      return findUserByToken(db, token, now);
    }

    let user: PublicUser | null = null;
    databaseRepository.update((draft) => {
      removeExpiredSessions(draft, now);
      user = findUserByToken(draft, token, now);
    });
    return user;
  },

  endSession(token, actor) {
    databaseRepository.update((draft) => {
      removeSession(draft, token);
      if (actor) {
        appendAuthAuditLog(draft.users, draft.auditLogs, actor.id, 'auth.logout');
      }
    });
  },
};

function appendAuthAuditLog(
  users: UserRecord[],
  auditLogs: Array<{id: string; type: string; actorId?: string; detail: string; createdAt: string}>,
  actorId: string,
  type: 'auth.login' | 'auth.logout',
): void {
  const user = users.find((item) => item.id === actorId);
  const username = user?.username ?? 'unknown';
  auditLogs.unshift({
    id: createRecordId('audit'),
    type,
    actorId,
    detail: `${username} ${type === 'auth.login' ? '登录成功' : '退出登录'}`,
    createdAt: new Date().toISOString(),
  });
}
