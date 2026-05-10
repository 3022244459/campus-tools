import {Capacitor} from '@capacitor/core';
import type {
  AdminOverview,
  AdminMetrics,
  AdminUserDirectory,
  AnnouncementSubmitPayload,
  AuthSession,
  CompareResult,
  CourierData,
  DocumentDeliveryData,
  HomeBootstrap,
  Identity,
  LostFoundData,
  LostFoundSubmitPayload,
  NavigationData,
  RepairData,
  RepairSubmitPayload,
  ReviewDecision,
  ServiceCenterData,
  SessionUser,
  TakeoutData,
  TakeoutSubmitPayload,
  TeacherCampusCardData,
  TeacherDocumentData,
  TeacherDocumentSubmitPayload,
  TeacherLeaveData,
  TeacherMeetingData,
  TeacherOfficeData,
  TeacherSalaryData,
  TeacherStudyRoomData,
  TeacherStudentAffairsData,
  UserActivityData,
  UtilityData,
  WalletData,
} from './types';

const apiBase = resolveApiBase();
const mockFallbackBuildEnabled = import.meta.env.DEV ||
  import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true' ||
  import.meta.env.VITE_ENABLE_MOCK_FALLBACK === '1' ||
  import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'yes';
const mockFallbackEnabled = mockFallbackBuildEnabled && resolveMockFallbackEnabled();
type MockDataModule = typeof import('./mockData');
let mockDataPromise: Promise<MockDataModule> | null = null;

export const AUTH_SESSION_EXPIRED_EVENT = 'campus-tools:auth-session-expired';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
  }
}

export type RemoteResult<T> = {data: T; source: 'api' | 'mock'};

function hasAuthorizationHeader(headers: Record<string, string>): boolean {
  return Object.entries(headers).some(([key, value]) => key.toLowerCase() === 'authorization' && value.trim() !== '');
}

function notifySessionExpired(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new CustomEvent(AUTH_SESSION_EXPIRED_EVENT));
}

function loadMockData(): Promise<MockDataModule> {
  if (!mockFallbackBuildEnabled) {
    return Promise.reject(new Error('Mock fallback is disabled for this build.'));
  }

  mockDataPromise ??= import('./mockData');
  return mockDataPromise;
}

async function readErrorPayload(response: Response): Promise<string> {
  const contentType = response.headers.get('content-type') ?? '';

  try {
    if (!contentType.includes('application/json')) {
      const text = await response.text();
      if (text.includes('<!doctype') || text.includes('<html')) {
        return '服务地址返回了页面内容，请检查校园服务是否已启动。';
      }
      return text || '请求失败。';
    }

    const payload = await response.json() as {message?: string};
    return payload.message || '请求失败。';
  } catch {
    return '请求失败。';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((init?.headers ?? {}) as Record<string, string>),
  };

  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    headers: requestHeaders,
  });

  if (!response.ok) {
    const message = await readErrorPayload(response);
    if (response.status === 401 && hasAuthorizationHeader(requestHeaders)) {
      notifySessionExpired();
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function isNetworkError(error: unknown): boolean {
  return error instanceof TypeError;
}

function shouldUseMockFallback(error: unknown): boolean {
  return mockFallbackEnabled && isNetworkError(error);
}

function authHeaders(session: AuthSession) {
  return {
    Authorization: `Bearer ${session.token}`,
  };
}

async function withFallback<T>(
  session: AuthSession,
  path: string,
  fallback: () => T | Promise<T>,
  init?: RequestInit,
): Promise<RemoteResult<T>> {
  if (session.source === 'mock') {
    return {data: await fallback(), source: 'mock'};
  }

  try {
    const data = await request<T>(path, {
      ...init,
      headers: {
        ...(init?.headers ?? {}),
        ...authHeaders(session),
      },
    });
    return {data, source: 'api'};
  } catch (error) {
    if (shouldUseMockFallback(error)) {
      return {data: await fallback(), source: 'mock'};
    }
    throw error;
  }
}

export async function login(identity: Identity, username: string, password: string): Promise<AuthSession> {
  try {
    const result = await request<{token: string; expiresAt: string; user: SessionUser}>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({identity, username, password}),
    });

    return {...result, source: 'api'};
  } catch (error) {
    if (shouldUseMockFallback(error)) {
      const {demoCredentials, getMockSession} = await loadMockData();
      const demo = demoCredentials[identity];
      if (demo.username === username && demo.password === password) {
        return getMockSession(identity);
      }
    }
    throw error;
  }
}

export async function logout(session: AuthSession | null): Promise<void> {
  if (!session || session.source === 'mock') {
    return;
  }

  try {
    await request<void>('/auth/logout', {
      method: 'POST',
      headers: authHeaders(session),
    });
  } catch {
    // Keep client-side logout resilient.
  }
}

export async function fetchCurrentUser(session: AuthSession): Promise<SessionUser> {
  if (session.source === 'mock') {
    return session.user;
  }

  try {
    const result = await request<{user: SessionUser}>('/auth/me', {
      headers: authHeaders(session),
    });
    return result.user;
  } catch (error) {
    if (shouldUseMockFallback(error)) {
      return session.user;
    }
    throw error;
  }
}

export function fetchHome(session: AuthSession): Promise<RemoteResult<HomeBootstrap>> {
  return withFallback(session, '/home/bootstrap', async () => (await loadMockData()).getMockHome(session.user.identity));
}

export async function fetchAdminOverview(session: AuthSession): Promise<AdminOverview> {
  return request<AdminOverview>('/admin/overview', {
    headers: authHeaders(session),
  });
}

export async function fetchAdminMetrics(session: AuthSession): Promise<AdminMetrics> {
  return request<AdminMetrics>('/admin/metrics', {
    headers: authHeaders(session),
  });
}

export async function fetchAdminUsers(
  session: AuthSession,
  params: {role?: string; q?: string; limit?: number} = {},
): Promise<AdminUserDirectory> {
  const searchParams = new URLSearchParams();
  if (params.role) {
    searchParams.set('role', params.role);
  }
  if (params.q) {
    searchParams.set('q', params.q);
  }
  if (params.limit) {
    searchParams.set('limit', String(params.limit));
  }

  const queryString = searchParams.toString();
  return request<AdminUserDirectory>(`/admin/users${queryString ? `?${queryString}` : ''}`, {
    headers: authHeaders(session),
  });
}

export async function revokeAdminUserSessions(
  session: AuthSession,
  userId: string,
): Promise<{userId: string; username: string; revokedCount: number}> {
  return request<{userId: string; username: string; revokedCount: number}>(`/admin/users/${encodeURIComponent(userId)}/revoke-sessions`, {
    method: 'POST',
    headers: authHeaders(session),
  });
}

export async function publishAdminAnnouncement(
  session: AuthSession,
  payload: AnnouncementSubmitPayload,
): Promise<AdminOverview> {
  return request<AdminOverview>('/admin/announcements', {
    method: 'POST',
    headers: authHeaders(session),
    body: JSON.stringify(payload),
  });
}

export function fetchNavigation(session: AuthSession): Promise<RemoteResult<NavigationData>> {
  return withFallback(session, '/navigation', async () => (await loadMockData()).getMockNavigation(session.user.identity));
}

export function fetchServiceCenter(session: AuthSession): Promise<RemoteResult<ServiceCenterData>> {
  return withFallback(session, '/service-center', async () => (await loadMockData()).getMockServiceCenter(session.user.identity));
}

export function fetchCourier(session: AuthSession): Promise<RemoteResult<CourierData>> {
  return withFallback(session, '/courier', async () => (await loadMockData()).getMockCourier(session.user.identity));
}

export function fetchWallet(session: AuthSession): Promise<RemoteResult<WalletData>> {
  return withFallback(session, '/wallet', async () => (await loadMockData()).getMockWallet(session.user.identity));
}

export function fetchUtilities(session: AuthSession): Promise<RemoteResult<UtilityData>> {
  return withFallback(session, '/utilities', () => getFallbackUtilities(session.user.identity));
}

export async function rechargeWater(
  session: AuthSession,
  amount: number,
  currentData: UtilityData,
): Promise<RemoteResult<UtilityData>> {
  return submitUtilityAmount(session, '/utilities/water/recharge', amount, currentData, 'water');
}

export async function payElectricity(
  session: AuthSession,
  amount: number,
  currentData: UtilityData,
): Promise<RemoteResult<UtilityData>> {
  return submitUtilityAmount(session, '/utilities/electricity/pay', amount, currentData, 'electricity');
}

export async function setElectricityReminder(
  session: AuthSession,
  enabled: boolean,
  currentData: UtilityData,
): Promise<RemoteResult<UtilityData>> {
  if (session.source === 'mock') {
    return {data: {...currentData, reminderEnabled: enabled}, source: 'mock'};
  }

  try {
    const data = await request<UtilityData>('/utilities/electricity/reminder', {
      method: 'POST',
      headers: authHeaders(session),
      body: JSON.stringify({enabled}),
    });
    return {data, source: 'api'};
  } catch (error) {
    if (shouldUseMockFallback(error)) {
      return {data: {...currentData, reminderEnabled: enabled}, source: 'mock'};
    }
    throw error;
  }
}

async function submitUtilityAmount(
  session: AuthSession,
  path: string,
  amount: number,
  currentData: UtilityData,
  type: 'water' | 'electricity',
): Promise<RemoteResult<UtilityData>> {
  if (session.source === 'mock') {
    return {data: applyUtilityAmount(currentData, amount, type), source: 'mock'};
  }

  try {
    const data = await request<UtilityData>(path, {
      method: 'POST',
      headers: authHeaders(session),
      body: JSON.stringify({amount}),
    });
    return {data, source: 'api'};
  } catch (error) {
    if (shouldUseMockFallback(error)) {
      return {data: applyUtilityAmount(currentData, amount, type), source: 'mock'};
    }
    throw error;
  }
}

function getFallbackUtilities(identity: Identity): UtilityData {
  return {
    waterBalance: identity === 'teacher' ? 68 : 42.5,
    electricityKwh: identity === 'teacher' ? 58 : 36.5,
    reminderEnabled: true,
    waterTransactions: [
      {id: 'water-fallback-1', title: identity === 'teacher' ? '教师公寓热水' : '1号宿舍楼 302室', time: '昨天 19:45', amount: identity === 'teacher' ? '-3.20' : '-2.80'},
    ],
    electricityTransactions: [
      {id: 'electricity-fallback-1', title: '电费缴纳', time: '上月 08:30', amount: '+30.00 度'},
    ],
  };
}

function applyUtilityAmount(currentData: UtilityData, amount: number, type: 'water' | 'electricity'): UtilityData {
  if (type === 'water') {
    return {
      ...currentData,
      waterBalance: Number((currentData.waterBalance + amount).toFixed(2)),
      waterTransactions: [
        {id: `water-${Date.now()}`, title: '热水充值', time: '刚刚', amount: `+${amount.toFixed(2)}`},
        ...currentData.waterTransactions,
      ].slice(0, 20),
    };
  }

  return {
    ...currentData,
    electricityKwh: Number((currentData.electricityKwh + amount).toFixed(2)),
    electricityTransactions: [
      {id: `electricity-${Date.now()}`, title: '电费缴纳', time: '刚刚', amount: `+${amount.toFixed(2)} 度`},
      ...currentData.electricityTransactions,
    ].slice(0, 20),
  };
}

export async function rechargeWallet(
  session: AuthSession,
  amount: number,
  currentData: WalletData,
): Promise<RemoteResult<WalletData>> {
  if (session.source === 'mock') {
    return {data: applyWalletRecharge(currentData, amount), source: 'mock'};
  }

  try {
    const data = await request<WalletData>('/wallet/recharge', {
      method: 'POST',
      headers: authHeaders(session),
      body: JSON.stringify({amount}),
    });
    return {data, source: 'api'};
  } catch (error) {
    if (shouldUseMockFallback(error)) {
      return {data: applyWalletRecharge(currentData, amount), source: 'mock'};
    }
    throw error;
  }
}

export async function withdrawWallet(
  session: AuthSession,
  amount: number,
  currentData: WalletData,
): Promise<RemoteResult<WalletData>> {
  return submitWalletDebit(session, '/wallet/withdraw', amount, currentData, '余额提现');
}

export async function payWallet(
  session: AuthSession,
  amount: number,
  currentData: WalletData,
): Promise<RemoteResult<WalletData>> {
  return submitWalletDebit(session, '/wallet/pay', amount, currentData, '付款码消费');
}

export async function rewardWallet(
  session: AuthSession,
  amount: number,
  currentData: WalletData,
): Promise<RemoteResult<WalletData>> {
  if (session.source === 'mock') {
    return {data: applyWalletAdjustment(currentData, amount, '代送任务赏金', true), source: 'mock'};
  }

  try {
    const data = await request<WalletData>('/wallet/reward', {
      method: 'POST',
      headers: authHeaders(session),
      body: JSON.stringify({amount}),
    });
    return {data, source: 'api'};
  } catch (error) {
    if (shouldUseMockFallback(error)) {
      return {data: applyWalletAdjustment(currentData, amount, '代送任务赏金', true), source: 'mock'};
    }
    throw error;
  }
}

async function submitWalletDebit(
  session: AuthSession,
  path: string,
  amount: number,
  currentData: WalletData,
  title: string,
): Promise<RemoteResult<WalletData>> {
  if (session.source === 'mock') {
    return {data: applyWalletAdjustment(currentData, amount, title, false), source: 'mock'};
  }

  try {
    const data = await request<WalletData>(path, {
      method: 'POST',
      headers: authHeaders(session),
      body: JSON.stringify({amount}),
    });
    return {data, source: 'api'};
  } catch (error) {
    if (shouldUseMockFallback(error)) {
      return {data: applyWalletAdjustment(currentData, amount, title, false), source: 'mock'};
    }
    throw error;
  }
}

function applyWalletRecharge(currentData: WalletData, amount: number): WalletData {
  return applyWalletAdjustment(currentData, amount, '校园卡充值', true);
}

function applyWalletAdjustment(currentData: WalletData, amount: number, title: string, positive: boolean): WalletData {
  const signedAmount = positive ? amount : -amount;
  const nextBalance = Number((currentData.totalBalance + signedAmount).toFixed(2));
  if (nextBalance < 0) {
    throw new ApiError('余额不足。', 400);
  }
  const transaction: WalletData['transactions'][number] = {
    id: `wallet-${Date.now()}`,
    title,
    time: '刚刚',
    amount: `${positive ? '+' : '-'}${amount.toFixed(2)}`,
    iconKey: positive ? 'plus' : 'shopping',
    tone: positive ? 'green' : 'purple',
    positive,
  };

  return {
    ...currentData,
    totalBalance: nextBalance,
    dailyChange: Number((currentData.dailyChange + signedAmount).toFixed(2)),
    walletBalanceLabel: `¥${nextBalance.toFixed(2)}`,
    transactions: [
      transaction,
      ...currentData.transactions,
    ].slice(0, 20),
  };
}

export function fetchTakeout(session: AuthSession): Promise<RemoteResult<TakeoutData>> {
  return withFallback(session, '/takeout', async () => (await loadMockData()).getMockTakeout(session.user.identity));
}

export function fetchDocumentDelivery(session: AuthSession): Promise<RemoteResult<DocumentDeliveryData>> {
  return withFallback(session, '/document-delivery', () => getFallbackDocumentDelivery());
}

export async function submitTakeout(
  session: AuthSession,
  payload: TakeoutSubmitPayload,
  currentData: TakeoutData,
): Promise<RemoteResult<TakeoutData>> {
  if (session.source === 'mock') {
    const mockData = await loadMockData();
    updateMockActivityTakeout(session, payload, mockData);
    return {data: mockData.submitMockTakeoutOrder(currentData, payload), source: 'mock'};
  }

  try {
    const data = await request<TakeoutData>('/takeout/submit', {
      method: 'POST',
      headers: authHeaders(session),
      body: JSON.stringify(payload),
    });
    return {data, source: 'api'};
  } catch (error) {
    if (shouldUseMockFallback(error)) {
      const mockData = await loadMockData();
      updateMockActivityTakeout(session, payload, mockData);
      return {data: mockData.submitMockTakeoutOrder(currentData, payload), source: 'mock'};
    }
    throw error;
  }
}

export function fetchRepair(session: AuthSession): Promise<RemoteResult<RepairData>> {
  return withFallback(session, '/repair', async () => (await loadMockData()).getMockRepair(session.user.identity));
}

export async function submitRepair(
  session: AuthSession,
  payload: RepairSubmitPayload,
  currentData: RepairData,
): Promise<RemoteResult<RepairData>> {
  if (session.source === 'mock') {
    const mockData = await loadMockData();
    updateMockActivityRepair(session, payload, mockData);
    return {data: mockData.submitMockRepairRequest(currentData, payload), source: 'mock'};
  }

  try {
    const data = await request<RepairData>('/repair/submit', {
      method: 'POST',
      headers: authHeaders(session),
      body: JSON.stringify(payload),
    });
    return {data, source: 'api'};
  } catch (error) {
    if (shouldUseMockFallback(error)) {
      const mockData = await loadMockData();
      updateMockActivityRepair(session, payload, mockData);
      return {data: mockData.submitMockRepairRequest(currentData, payload), source: 'mock'};
    }
    throw error;
  }
}

export function fetchLostFound(session: AuthSession): Promise<RemoteResult<LostFoundData>> {
  return withFallback(session, '/lost-found', async () => (await loadMockData()).getMockLostFound(session.user.identity));
}

export function fetchUserActivity(session: AuthSession): Promise<RemoteResult<UserActivityData>> {
  return withFallback(session, '/me/activity', async () => (await loadMockData()).getMockUserActivity(session.user.id));
}

export async function submitLostFound(
  session: AuthSession,
  payload: LostFoundSubmitPayload,
  currentData: LostFoundData,
): Promise<RemoteResult<LostFoundData>> {
  if (session.source === 'mock') {
    const mockData = await loadMockData();
    updateMockActivityLostFound(session, payload, mockData);
    return {data: mockData.submitMockLostFoundItem(currentData, payload), source: 'mock'};
  }

  try {
    const data = await request<LostFoundData>('/lost-found/submit', {
      method: 'POST',
      headers: authHeaders(session),
      body: JSON.stringify(payload),
    });
    return {data, source: 'api'};
  } catch (error) {
    if (shouldUseMockFallback(error)) {
      const mockData = await loadMockData();
      updateMockActivityLostFound(session, payload, mockData);
      return {data: mockData.submitMockLostFoundItem(currentData, payload), source: 'mock'};
    }
    throw error;
  }
}

export function fetchTeacherOffice(session: AuthSession): Promise<RemoteResult<TeacherOfficeData>> {
  return withFallback(session, '/teacher/office', async () => (await loadMockData()).getMockTeacherOffice());
}

export function fetchTeacherSalary(session: AuthSession): Promise<RemoteResult<TeacherSalaryData>> {
  return withFallback(session, '/teacher/salary', async () => (await loadMockData()).getMockTeacherSalary());
}

export function fetchTeacherCampusCard(session: AuthSession): Promise<RemoteResult<TeacherCampusCardData>> {
  return withFallback(session, '/teacher/campus-card', async () => (await loadMockData()).getMockTeacherCampusCard());
}

export function fetchTeacherMeeting(session: AuthSession): Promise<RemoteResult<TeacherMeetingData>> {
  return withFallback(session, '/teacher/meeting', async () => (await loadMockData()).getMockTeacherMeeting());
}

export function fetchTeacherDocument(session: AuthSession): Promise<RemoteResult<TeacherDocumentData>> {
  return withFallback(session, '/teacher/document', async () => (await loadMockData()).getMockTeacherDocument());
}

export function fetchTeacherLeave(session: AuthSession): Promise<RemoteResult<TeacherLeaveData>> {
  return withFallback(session, '/teacher/leave', async () => (await loadMockData()).getMockTeacherLeave());
}

export function fetchTeacherStudentAffairs(session: AuthSession): Promise<RemoteResult<TeacherStudentAffairsData>> {
  return withFallback(session, '/teacher/student-affairs', async () => (await loadMockData()).getMockTeacherStudentAffairs());
}

export function fetchTeacherStudyRoom(session: AuthSession): Promise<RemoteResult<TeacherStudyRoomData>> {
  return withFallback(session, '/teacher/study-room', async () => (await loadMockData()).getMockTeacherStudyRoom());
}

export async function submitTeacherDocument(
  session: AuthSession,
  payload: TeacherDocumentSubmitPayload,
  currentData: TeacherDocumentData,
): Promise<RemoteResult<TeacherDocumentData>> {
  if (session.source === 'mock') {
    return {data: (await loadMockData()).submitMockTeacherDocument(currentData, payload), source: 'mock'};
  }

  try {
    const data = await request<TeacherDocumentData>('/teacher/document/submit', {
      method: 'POST',
      headers: authHeaders(session),
      body: JSON.stringify(payload),
    });
    return {data, source: 'api'};
  } catch (error) {
    if (shouldUseMockFallback(error)) {
      return {data: (await loadMockData()).submitMockTeacherDocument(currentData, payload), source: 'mock'};
    }
    throw error;
  }
}

export async function reviewTeacherLeaveApplication(
  session: AuthSession,
  applicationId: string,
  decision: ReviewDecision,
  currentData: TeacherLeaveData,
): Promise<RemoteResult<TeacherLeaveData>> {
  if (session.source === 'mock') {
    return {data: (await loadMockData()).reviewMockTeacherLeave(currentData, applicationId), source: 'mock'};
  }

  try {
    const data = await request<TeacherLeaveData>('/teacher/leave/review', {
      method: 'POST',
      headers: authHeaders(session),
      body: JSON.stringify({applicationId, decision}),
    });
    return {data, source: 'api'};
  } catch (error) {
    if (shouldUseMockFallback(error)) {
      return {data: (await loadMockData()).reviewMockTeacherLeave(currentData, applicationId), source: 'mock'};
    }
    throw error;
  }
}

export async function reviewTeacherStudentAffairApplication(
  session: AuthSession,
  applicationId: string,
  decision: ReviewDecision,
  currentData: TeacherStudentAffairsData,
): Promise<RemoteResult<TeacherStudentAffairsData>> {
  if (session.source === 'mock') {
    return {data: (await loadMockData()).reviewMockTeacherStudentAffairs(currentData, applicationId, decision), source: 'mock'};
  }

  try {
    const data = await request<TeacherStudentAffairsData>('/teacher/student-affairs/review', {
      method: 'POST',
      headers: authHeaders(session),
      body: JSON.stringify({applicationId, decision}),
    });
    return {data, source: 'api'};
  } catch (error) {
    if (shouldUseMockFallback(error)) {
      return {data: (await loadMockData()).reviewMockTeacherStudentAffairs(currentData, applicationId, decision), source: 'mock'};
    }
    throw error;
  }
}

export async function fetchCompareQuotes(
  session: AuthSession,
  destination: string = 'Tianjin Nankai District',
  weight: number = 1,
): Promise<RemoteResult<CompareResult>> {
  if (session.source === 'mock') {
    return {data: (await loadMockData()).getMockCompare(session.user.identity), source: 'mock'};
  }

  try {
    const data = await request<CompareResult>('/courier-compare/quote', {
      method: 'POST',
      headers: authHeaders(session),
      body: JSON.stringify({destination, weight}),
    });
    return {data, source: 'api'};
  } catch (error) {
    if (shouldUseMockFallback(error)) {
      return {data: (await loadMockData()).getMockCompare(session.user.identity), source: 'mock'};
    }
    throw error;
  }
}

function updateMockActivityTakeout(session: AuthSession, payload: TakeoutSubmitPayload, mockData: MockDataModule) {
  const activity = mockData.getMockUserActivity(session.user.id);
  const status: UserActivityData['takeoutOrders'][number]['status'] = 'open';
  activity.takeoutOrders = [
    {
      id: `mock-takeout-${Date.now()}`,
      title: payload.title,
      destination: payload.destination,
      reward: normalizeReward(payload.reward),
      tags: payload.tags,
      icon: payload.icon,
      status,
      time: '刚刚',
      note: '已同步到我的代取订单',
    },
    ...activity.takeoutOrders,
  ].slice(0, 8);
  session.user.stats.orders += 1;
}

function updateMockActivityRepair(session: AuthSession, payload: RepairSubmitPayload, mockData: MockDataModule) {
  const repairData = mockData.getMockRepair(session.user.identity);
  const repairType = repairData.repairTypes.find((item) => item.id === payload.typeId);
  const status: UserActivityData['repairRequests'][number]['status'] = payload.imageCount > 0 ? 'scheduled' : 'pending';
  const activity = mockData.getMockUserActivity(session.user.id);
  activity.repairRequests = [
    {
      id: `mock-repair-${Date.now()}`,
      title: repairType ? `${repairType.label}报修` : '新的报修申请',
      location: payload.location,
      status,
      time: '刚刚',
      description: payload.description,
    },
    ...activity.repairRequests,
  ].slice(0, 8);
  session.user.stats.repairs += 1;
}

function updateMockActivityLostFound(session: AuthSession, payload: LostFoundSubmitPayload, mockData: MockDataModule) {
  const activity = mockData.getMockUserActivity(session.user.id);
  activity.lostFoundPosts = [
    {
      id: `mock-${payload.type}-${Date.now()}`,
      title: payload.title,
      location: payload.location,
      time: '刚刚',
      type: payload.type,
      image: payload.type === 'found'
        ? './images/remote-16-d9a6224c65.png'
        : './images/remote-17-6a0cb9b443.png',
      description: payload.description,
      contactHint: '可在个人中心继续跟进处理状态',
    },
    ...activity.lostFoundPosts,
  ].slice(0, 8);
  session.user.stats.posts += 1;
}

function normalizeReward(reward: string) {
  const numericValue = Number(reward.replace('¥', ''));
  const finalValue = Number.isFinite(numericValue) ? numericValue : 0;
  return `¥${finalValue.toFixed(1)}`;
}

function getFallbackDocumentDelivery(): DocumentDeliveryData {
  return {
    tasks: [
      {
        id: 'fallback-document-1',
        teacherName: '李老师',
        title: '学院盖章材料代送',
        pickupLabel: '卫津路校区 行政楼 302',
        destinationLabel: '北洋园校区 第26教学楼 B区',
        urgency: '加急',
        reward: '¥6.00',
        etaText: '预计 20 分钟内送达',
        status: 'open',
      },
    ],
  };
}

function resolveApiBase() {
  const explicitBase = import.meta.env.VITE_API_BASE_URL?.trim();
  if (explicitBase) {
    return explicitBase.replace(/\/$/, '');
  }

  const platform = Capacitor.getPlatform();
  if (platform === 'android') {
    return 'http://10.0.2.2:8787/api';
  }

  if (platform === 'ios') {
    return 'http://127.0.0.1:8787/api';
  }

  return '/api';
}

function resolveMockFallbackEnabled() {
  const explicitValue = import.meta.env.VITE_ENABLE_MOCK_FALLBACK?.trim().toLowerCase();
  if (explicitValue) {
    return explicitValue === 'true' || explicitValue === '1' || explicitValue === 'yes';
  }

  return import.meta.env.DEV;
}
