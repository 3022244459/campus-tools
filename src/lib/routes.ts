import type {AuthSession, Identity} from './types';

export const screens = [
  'splash',
  'identity',
  'home',
  'map',
  'services',
  'profile',
  'courier',
  'takeout',
  'repair',
  'lost-found',
  'clubs',
  'water',
  'electricity',
  'wallet',
  'courier-compare',
  'document-delivery',
  'canteen',
  'empty-classroom',
  'shuttle',
  'jobs',
  'my-orders',
  'my-repairs',
  'my-posts',
  'teacher-courier',
  'teacher-takeout',
  'teacher-meeting',
  'teacher-document',
  'teacher-student-affairs',
  'teacher-repair',
  'teacher-study-room',
  'teacher-leave',
  'teacher-salary',
  'teacher-campus-card',
  'teacher-message',
  'teacher-office',
  'teacher-profile',
  'admin-dashboard',
] as const;

export type Screen = typeof screens[number];
export type ShellTab = 'home' | 'map' | 'services' | 'profile';

const screenSet = new Set<string>(screens);
const teacherScreens = new Set<Screen>([
  'teacher-courier',
  'teacher-takeout',
  'teacher-meeting',
  'teacher-document',
  'teacher-student-affairs',
  'teacher-repair',
  'teacher-study-room',
  'teacher-leave',
  'teacher-salary',
  'teacher-campus-card',
  'teacher-message',
  'teacher-office',
  'teacher-profile',
]);

const screenPaths: Record<Screen, string> = {
  splash: '/',
  identity: '/login',
  home: '/home',
  map: '/map',
  services: '/services',
  profile: '/profile',
  courier: '/courier',
  takeout: '/takeout',
  repair: '/repair',
  'lost-found': '/lost-found',
  clubs: '/clubs',
  water: '/water',
  electricity: '/electricity',
  wallet: '/wallet',
  'courier-compare': '/courier-compare',
  'document-delivery': '/document-delivery',
  canteen: '/canteen',
  'empty-classroom': '/empty-classroom',
  shuttle: '/shuttle',
  jobs: '/jobs',
  'my-orders': '/me/orders',
  'my-repairs': '/me/repairs',
  'my-posts': '/me/posts',
  'teacher-courier': '/teacher/courier',
  'teacher-takeout': '/teacher/takeout',
  'teacher-meeting': '/teacher/meeting',
  'teacher-document': '/teacher/document',
  'teacher-student-affairs': '/teacher/student-affairs',
  'teacher-repair': '/teacher/repair',
  'teacher-study-room': '/teacher/study-room',
  'teacher-leave': '/teacher/leave',
  'teacher-salary': '/teacher/salary',
  'teacher-campus-card': '/teacher/campus-card',
  'teacher-message': '/teacher/message',
  'teacher-office': '/teacher/office',
  'teacher-profile': '/teacher/profile',
  'admin-dashboard': '/admin',
};

const pathToScreen = new Map(Object.entries(screenPaths).map(([screen, route]) => [route, screen as Screen]));

const titles: Record<Exclude<Screen, 'services'>, string> = {
  splash: '校园宝',
  identity: '登录',
  home: '校园宝',
  map: '校园导航',
  profile: '个人中心',
  courier: '取快递',
  takeout: '外卖代取',
  repair: '校园报修',
  'lost-found': '失物招领',
  clubs: '社团资讯',
  water: '热水充值',
  electricity: '电费查询',
  wallet: '校园钱包',
  'courier-compare': '快递比价',
  'document-delivery': '文件代送',
  canteen: '食堂优惠',
  'empty-classroom': '空闲教室',
  shuttle: '校车时间',
  jobs: '兼职信息',
  'my-orders': '我的代取订单',
  'my-repairs': '我的报修',
  'my-posts': '我的发布',
  'teacher-courier': '快递代取',
  'teacher-takeout': '外卖代取',
  'teacher-meeting': '会议室预约',
  'teacher-document': '文件代送',
  'teacher-student-affairs': '学生事务',
  'teacher-repair': '校园报修',
  'teacher-study-room': '研讨室管理',
  'teacher-leave': '请假审批',
  'teacher-salary': '工资查询',
  'teacher-campus-card': '校园卡',
  'teacher-message': '消息',
  'teacher-office': '办公中心',
  'teacher-profile': '个人中心',
  'admin-dashboard': '校园后台',
};

export function isScreen(value: string): value is Screen {
  return screenSet.has(value);
}

export function getScreenTitle(screen: Screen, identity: Identity | null): string {
  if (screen === 'services') {
    return identity === 'teacher' ? '办公中心' : '服务中心';
  }

  return titles[screen] ?? '校园宝';
}

export function getActiveTab(screen: Screen): ShellTab {
  if (screen === 'map' || screen === 'services') {
    return screen;
  }

  if (screen === 'profile' || screen === 'teacher-profile') {
    return 'profile';
  }

  return 'home';
}

export function getProfileScreen(identity: Identity | null): Screen {
  return identity === 'teacher' ? 'teacher-profile' : 'profile';
}

export function isRootShellScreen(screen: Screen, identity: Identity | null): boolean {
  return screen === 'home' || screen === 'map' || screen === 'services' || screen === getProfileScreen(identity);
}

export function normalizeScreenForIdentity(screen: Screen, identity: Identity | null): Screen {
  if (screen === 'profile' && identity === 'teacher') {
    return 'teacher-profile';
  }

  return screen;
}

export function isScreenAllowedForSession(screen: Screen, session: AuthSession | null): boolean {
  if (screen === 'splash' || screen === 'identity') {
    return true;
  }

  if (!session) {
    return false;
  }

  if (session.user.role === 'admin') {
    return screen === 'admin-dashboard';
  }

  if (screen === 'admin-dashboard') {
    return false;
  }

  return session.user.identity === 'teacher' || !teacherScreens.has(screen);
}

export function getSessionEntryScreen(session: AuthSession | null): Screen {
  if (!session) {
    return 'identity';
  }

  if (session.user.role === 'admin') {
    return 'admin-dashboard';
  }

  const routedScreen = readScreenRoute();
  if (routedScreen && isScreenAllowedForSession(routedScreen, session)) {
    return normalizeScreenForIdentity(routedScreen, session.user.identity);
  }

  return 'home';
}

export function readScreenRoute(): Screen | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawHash = window.location.hash.replace(/^#/, '') || '/';
  const normalizedPath = rawHash.startsWith('/') ? rawHash : `/${rawHash}`;
  return pathToScreen.get(normalizedPath.replace(/\/$/, '') || '/') ?? null;
}

export function writeScreenRoute(screen: Screen, options: {replace?: boolean} = {}): void {
  if (typeof window === 'undefined') {
    return;
  }

  const nextHash = `#${screenPaths[screen]}`;
  if (window.location.hash === nextHash) {
    return;
  }

  if (options.replace) {
    window.history.replaceState(null, '', nextHash);
    return;
  }

  window.history.pushState(null, '', nextHash);
}
