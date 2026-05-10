import type {AuthSession, CompareFormState, Identity} from './types';

const sessionKey = 'campus-tools.session';
const compareFormKey = 'campus-tools.compare-form';
const identityKey = 'campus-tools.identity';

function hasStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function readStoredSession(): AuthSession | null {
  if (!hasStorage()) {
    return null;
  }

  const raw = window.localStorage.getItem(sessionKey);
  if (!raw) {
    return null;
  }

  try {
    const session = JSON.parse(raw) as AuthSession;
    if (!session?.token || !session?.expiresAt || !session?.user?.identity) {
      window.localStorage.removeItem(sessionKey);
      return null;
    }

    if (new Date(session.expiresAt).getTime() <= Date.now()) {
      window.localStorage.removeItem(sessionKey);
      return null;
    }

    return session;
  } catch {
    window.localStorage.removeItem(sessionKey);
    return null;
  }
}

export function writeStoredSession(session: AuthSession | null): void {
  if (!hasStorage()) {
    return;
  }

  if (!session) {
    window.localStorage.removeItem(sessionKey);
    return;
  }

  window.localStorage.setItem(sessionKey, JSON.stringify(session));
}

export function readStoredIdentity(): Identity | null {
  if (!hasStorage()) {
    return null;
  }

  const raw = window.localStorage.getItem(identityKey);
  return raw === 'student' || raw === 'teacher' ? raw : null;
}

export function writeStoredIdentity(identity: Identity): void {
  if (!hasStorage()) {
    return;
  }

  window.localStorage.setItem(identityKey, identity);
}

export function readStoredCompareForm(): CompareFormState | null {
  if (!hasStorage()) {
    return null;
  }

  const raw = window.localStorage.getItem(compareFormKey);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as CompareFormState;
  } catch {
    return null;
  }
}

export function writeStoredCompareForm(form: CompareFormState): void {
  if (!hasStorage()) {
    return;
  }

  window.localStorage.setItem(compareFormKey, JSON.stringify(form));
}
