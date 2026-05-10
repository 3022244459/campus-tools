import crypto from 'node:crypto';
import type {PublicUser, UserRecord, UserRole} from './types.ts';

const passwordHashAlgorithm = 'pbkdf2_sha256';
const passwordHashIterations = 120_000;
const tokenHashAlgorithm = 'sha256';

export function hashPassword(password: string, salt: string): string {
  const hash = crypto.pbkdf2Sync(password, salt, passwordHashIterations, 32, 'sha256').toString('hex');
  return `${passwordHashAlgorithm}$${passwordHashIterations}$${hash}`;
}

export function verifyPassword(user: UserRecord, password: string): boolean {
  if (user.passwordHash.startsWith(`${passwordHashAlgorithm}$`)) {
    return verifyPbkdf2Password(user.passwordHash, user.salt, password);
  }

  return timingSafeEqual(
    crypto.createHash('sha256').update(`${user.salt}:${password}`).digest('hex'),
    user.passwordHash,
  );
}

export function createToken(): string {
  return crypto.randomBytes(24).toString('hex');
}

export function createRecordId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${crypto.randomBytes(4).toString('hex')}`;
}

export function createShortCode(prefix: string): string {
  const timestampPart = Date.now().toString(36).slice(-4).toUpperCase();
  const randomPart = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `${prefix}${timestampPart}${randomPart}`;
}

export function hashToken(token: string): string {
  return `${tokenHashAlgorithm}$${sha256Hex(token)}`;
}

export function verifyToken(storedToken: string, candidateToken: string): boolean {
  if (storedToken.startsWith(`${tokenHashAlgorithm}$`)) {
    const [, expectedHash] = storedToken.split('$');
    return Boolean(expectedHash) && timingSafeEqual(sha256Hex(candidateToken), expectedHash);
  }

  return timingSafeEqual(sha256Hex(candidateToken), sha256Hex(storedToken));
}

export function toPublicUser(user: UserRecord): PublicUser {
  const {passwordHash, salt, ...publicUser} = user;
  return {
    ...publicUser,
    role: getUserRole(user),
  };
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function getUserRole(user: Pick<UserRecord, 'identity' | 'role'>): UserRole {
  return user.role ?? user.identity;
}

function verifyPbkdf2Password(storedValue: string, salt: string, password: string): boolean {
  const [, iterationsValue, expectedHash] = storedValue.split('$');
  const iterations = Number(iterationsValue);

  if (!Number.isInteger(iterations) || iterations <= 0 || !expectedHash) {
    return false;
  }

  const actualHash = crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha256').toString('hex');
  return timingSafeEqual(actualHash, expectedHash);
}

function sha256Hex(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function timingSafeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left, 'hex');
  const rightBuffer = Buffer.from(right, 'hex');

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}
