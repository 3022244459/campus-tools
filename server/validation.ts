import type {AnnouncementAudience, Identity, UserRole} from './types.ts';

export class ValidationError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export interface LoginInput {
  identity: Identity;
  username: string;
  password: string;
}

export interface AnnouncementSubmitInput {
  audience: AnnouncementAudience;
  label: string;
  message: string;
}

export interface AuditLogQueryInput {
  type?: string;
  actorId?: string;
  limit: number;
}

export interface AdminUsersQueryInput {
  identity?: Identity;
  role?: UserRole;
  q?: string;
  limit: number;
}

export interface AdminUserSessionRevokeInput {
  userId: string;
}

export interface CompareInput {
  destination: string;
  weight: number;
}

export interface TeacherDocumentSubmitInput {
  pickupLocation: string;
  destinationLocation: string;
  urgency: '普通' | '加急' | '定时';
  remarks: string;
}

export interface ReviewInput {
  applicationId: string;
  decision: 'approve' | 'reject';
}

export interface RepairSubmitInput {
  typeId: string;
  location: string;
  description: string;
  imageCount: number;
}

export interface LostFoundSubmitInput {
  title: string;
  location: string;
  description: string;
  type: 'lost' | 'found';
}

export interface TakeoutSubmitInput {
  title: string;
  destination: string;
  reward: string;
  tags: string[];
  icon: 'beef' | 'pizza' | 'utensils';
}

export interface WalletRechargeInput {
  amount: number;
}

export interface WalletDebitInput {
  amount: number;
}

export interface UtilityReminderInput {
  enabled: boolean;
}

export function parseLoginInput(body: unknown): LoginInput {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('请求体不能为空。');
  }

  const payload = body as Record<string, unknown>;
  const identity = payload.identity;
  const username = typeof payload.username === 'string' ? payload.username.trim() : '';
  const password = typeof payload.password === 'string' ? payload.password.trim() : '';

  if (identity !== 'student' && identity !== 'teacher') {
    throw new ValidationError('身份必须为 student 或 teacher。');
  }

  if (username.length < 4) {
    throw new ValidationError('账号长度至少为 4 位。');
  }

  if (password.length < 6) {
    throw new ValidationError('密码长度至少为 6 位。');
  }

  return {identity, username, password};
}

export function parseAnnouncementSubmitInput(body: unknown): AnnouncementSubmitInput {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('Request body cannot be empty.');
  }

  const payload = body as Record<string, unknown>;
  const audience = payload.audience;
  const label = typeof payload.label === 'string' ? payload.label.trim() : '';
  const message = typeof payload.message === 'string' ? payload.message.trim() : '';

  if (audience !== 'all' && audience !== 'student' && audience !== 'teacher') {
    throw new ValidationError('Announcement audience must be all, student, or teacher.');
  }

  if (label.length < 2 || label.length > 24) {
    throw new ValidationError('Announcement label must be 2-24 characters.');
  }

  if (message.length < 5 || message.length > 240) {
    throw new ValidationError('Announcement message must be 5-240 characters.');
  }

  return {audience, label, message};
}

export function parseAuditLogQuery(query: unknown): AuditLogQueryInput {
  if (!query || typeof query !== 'object') {
    return {limit: 50};
  }

  const payload = query as Record<string, unknown>;
  const type = readOptionalQueryString(payload.type, 'type');
  const actorId = readOptionalQueryString(payload.actorId, 'actorId');
  const limit = readQueryLimit(payload.limit);

  return {
    ...(type ? {type} : {}),
    ...(actorId ? {actorId} : {}),
    limit,
  };
}

export function parseAdminUsersQuery(query: unknown): AdminUsersQueryInput {
  if (!query || typeof query !== 'object') {
    return {limit: 50};
  }

  const payload = query as Record<string, unknown>;
  const identity = readOptionalQueryString(payload.identity, 'identity');
  const role = readOptionalQueryString(payload.role, 'role');
  const q = readOptionalQueryString(payload.q, 'q');
  const limit = readQueryLimit(payload.limit);

  if (identity && identity !== 'student' && identity !== 'teacher') {
    throw new ValidationError('identity must be student or teacher.');
  }

  if (role && role !== 'student' && role !== 'teacher' && role !== 'admin') {
    throw new ValidationError('role must be student, teacher, or admin.');
  }

  const parsedIdentity = identity as Identity | undefined;
  const parsedRole = role as UserRole | undefined;

  return {
    ...(parsedIdentity ? {identity: parsedIdentity} : {}),
    ...(parsedRole ? {role: parsedRole} : {}),
    ...(q ? {q} : {}),
    limit,
  };
}

export function parseAdminUserSessionRevokeInput(params: unknown): AdminUserSessionRevokeInput {
  if (!params || typeof params !== 'object') {
    throw new ValidationError('User id is required.');
  }

  const payload = params as Record<string, unknown>;
  const userId = typeof payload.userId === 'string' ? payload.userId.trim() : '';

  if (userId.length < 3 || userId.length > 80) {
    throw new ValidationError('User id must be 3-80 characters.');
  }

  return {userId};
}

export function parseCompareInput(body: unknown): CompareInput {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('请求体不能为空。');
  }

  const payload = body as Record<string, unknown>;
  const destination = typeof payload.destination === 'string' ? payload.destination.trim() : '';
  const weightValue = payload.weight;
  const weight = typeof weightValue === 'number' ? weightValue : Number(weightValue);

  if (destination.length < 2) {
    throw new ValidationError('请输入至少 2 个字的目的地。');
  }

  if (!Number.isFinite(weight) || weight <= 0 || weight > 50) {
    throw new ValidationError('包裹重量必须在 0 到 50kg 之间。');
  }

  return {
    destination,
    weight: Number(weight.toFixed(1)),
  };
}

export function parseTeacherDocumentSubmitInput(body: unknown): TeacherDocumentSubmitInput {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('请求体不能为空。');
  }

  const payload = body as Record<string, unknown>;
  const pickupLocation = typeof payload.pickupLocation === 'string' ? payload.pickupLocation.trim() : '';
  const destinationLocation = typeof payload.destinationLocation === 'string' ? payload.destinationLocation.trim() : '';
  const urgency = payload.urgency;
  const remarks = typeof payload.remarks === 'string' ? payload.remarks.trim() : '';

  if (pickupLocation.length < 2) {
    throw new ValidationError('取件地点至少需要 2 个字。');
  }

  if (destinationLocation.length < 2) {
    throw new ValidationError('送达地点至少需要 2 个字。');
  }

  if (urgency !== '普通' && urgency !== '加急' && urgency !== '定时') {
    throw new ValidationError('紧急程度必须为普通、加急或定时。');
  }

  if (remarks.length > 120) {
    throw new ValidationError('备注信息不能超过 120 个字。');
  }

  return {pickupLocation, destinationLocation, urgency, remarks};
}

export function parseReviewInput(body: unknown): ReviewInput {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('请求体不能为空。');
  }

  const payload = body as Record<string, unknown>;
  const applicationId = typeof payload.applicationId === 'string' ? payload.applicationId.trim() : '';
  const decision = payload.decision;

  if (applicationId.length < 3) {
    throw new ValidationError('申请单 ID 不合法。');
  }

  if (decision !== 'approve' && decision !== 'reject') {
    throw new ValidationError('审批动作必须为 approve 或 reject。');
  }

  return {applicationId, decision};
}

export function parseRepairSubmitInput(body: unknown): RepairSubmitInput {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('请求体不能为空。');
  }

  const payload = body as Record<string, unknown>;
  const typeId = typeof payload.typeId === 'string' ? payload.typeId.trim() : '';
  const location = typeof payload.location === 'string' ? payload.location.trim() : '';
  const description = typeof payload.description === 'string' ? payload.description.trim() : '';
  const imageCount = typeof payload.imageCount === 'number' ? payload.imageCount : Number(payload.imageCount);

  if (typeId.length < 3) {
    throw new ValidationError('请选择报修类型。');
  }

  if (location.length < 2) {
    throw new ValidationError('报修地点至少需要 2 个字。');
  }

  if (description.length < 5) {
    throw new ValidationError('问题描述至少需要 5 个字。');
  }

  if (description.length > 200) {
    throw new ValidationError('问题描述不能超过 200 个字。');
  }

  if (!Number.isInteger(imageCount) || imageCount < 0 || imageCount > 3) {
    throw new ValidationError('图片数量必须在 0 到 3 之间。');
  }

  return {typeId, location, description, imageCount};
}

export function parseLostFoundSubmitInput(body: unknown): LostFoundSubmitInput {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('请求体不能为空。');
  }

  const payload = body as Record<string, unknown>;
  const title = typeof payload.title === 'string' ? payload.title.trim() : '';
  const location = typeof payload.location === 'string' ? payload.location.trim() : '';
  const description = typeof payload.description === 'string' ? payload.description.trim() : '';
  const type = payload.type;

  if (title.length < 2) {
    throw new ValidationError('物品标题至少需要 2 个字。');
  }

  if (location.length < 2) {
    throw new ValidationError('地点至少需要 2 个字。');
  }

  if (description.length < 5) {
    throw new ValidationError('补充描述至少需要 5 个字。');
  }

  if (description.length > 200) {
    throw new ValidationError('补充描述不能超过 200 个字。');
  }

  if (type !== 'lost' && type !== 'found') {
    throw new ValidationError('发布类型必须为 lost 或 found。');
  }

  return {title, location, description, type};
}

export function parseTakeoutSubmitInput(body: unknown): TakeoutSubmitInput {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('请求体不能为空。');
  }

  const payload = body as Record<string, unknown>;
  const title = typeof payload.title === 'string' ? payload.title.trim() : '';
  const destination = typeof payload.destination === 'string' ? payload.destination.trim() : '';
  const reward = typeof payload.reward === 'string' ? payload.reward.trim() : '';
  const tags = Array.isArray(payload.tags)
    ? payload.tags.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean)
    : [];
  const icon = payload.icon;

  if (title.length < 2) {
    throw new ValidationError('订单标题至少需要 2 个字。');
  }

  if (destination.length < 2) {
    throw new ValidationError('送达地点至少需要 2 个字。');
  }

  if (!/^¥?\d+(\.\d{1,2})?$/.test(reward)) {
    throw new ValidationError('赏金格式不正确，请输入类似 4 或 4.5 的金额。');
  }

  if (!tags.length || tags.length > 3) {
    throw new ValidationError('请填写 1 到 3 个标签。');
  }

  if (icon !== 'beef' && icon !== 'pizza' && icon !== 'utensils') {
    throw new ValidationError('订单图标必须为 beef、pizza 或 utensils。');
  }

  return {title, destination, reward, tags, icon};
}

export function parseWalletRechargeInput(body: unknown): WalletRechargeInput {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('请求体不能为空。');
  }

  const payload = body as Record<string, unknown>;
  const amountValue = payload.amount;
  const amount = typeof amountValue === 'number' ? amountValue : Number(amountValue);

  if (!Number.isFinite(amount) || amount <= 0 || amount > 5000) {
    throw new ValidationError('充值金额必须大于 0 且不超过 5000 元。');
  }

  return {amount: Number(amount.toFixed(2))};
}

export function parseWalletDebitInput(body: unknown): WalletDebitInput {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('请求体不能为空。');
  }

  const payload = body as Record<string, unknown>;
  const amountValue = payload.amount;
  const amount = typeof amountValue === 'number' ? amountValue : Number(amountValue);

  if (!Number.isFinite(amount) || amount <= 0 || amount > 5000) {
    throw new ValidationError('金额必须大于 0 且不超过 5000 元。');
  }

  return {amount: Number(amount.toFixed(2))};
}

export function parseUtilityReminderInput(body: unknown): UtilityReminderInput {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('请求体不能为空。');
  }

  const payload = body as Record<string, unknown>;
  if (typeof payload.enabled !== 'boolean') {
    throw new ValidationError('提醒状态必须为布尔值。');
  }

  return {enabled: payload.enabled};
}

function readOptionalQueryString(value: unknown, label: string): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== 'string') {
    throw new ValidationError(`${label} must be a string query parameter.`);
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  if (trimmed.length > 80) {
    throw new ValidationError(`${label} cannot exceed 80 characters.`);
  }

  return trimmed;
}

function readQueryLimit(value: unknown): number {
  if (value === undefined || value === '') {
    return 50;
  }

  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new ValidationError('limit must be a number query parameter.');
  }

  const limit = Number(value);
  if (!Number.isInteger(limit) || limit < 1 || limit > 200) {
    throw new ValidationError('limit must be an integer between 1 and 200.');
  }

  return limit;
}
