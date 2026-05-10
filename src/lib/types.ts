export type Identity = 'student' | 'teacher';
export type UserRole = Identity | 'admin';
export type DataSource = 'api' | 'mock';

export interface UserStats {
  orders: number;
  repairs: number;
  posts: number;
}

export interface SessionUser {
  id: string;
  identity: Identity;
  role: UserRole;
  username: string;
  name: string;
  campus: string;
  organization: string;
  gradeLabel: string;
  verified: boolean;
  avatarUrl: string;
  stats: UserStats;
}

export interface AuthSession {
  token: string;
  expiresAt: string;
  user: SessionUser;
  source: DataSource;
}

export interface HomeBootstrap {
  appName: string;
  campusName: string;
  announcement: {
    label: string;
    message: string;
    publishedAt: string;
  };
  banner: {
    title: string;
    description: string;
  };
}

export interface CourierPackage {
  id: string;
  title: string;
  code: string;
  location: string;
  tag: string;
  tagTone: 'secondary' | 'neutral' | 'error';
  icon: string;
  etaDays: number;
}

export interface CourierData {
  stationName: string;
  pendingCount: number;
  historyCount: number;
  noteTitle: string;
  noteMessage: string;
  packages: CourierPackage[];
}

export interface WalletTransaction {
  id: string;
  title: string;
  time: string;
  amount: string;
  iconKey: 'utensils' | 'washing' | 'plus' | 'shopping';
  tone: 'orange' | 'sky' | 'green' | 'purple';
  positive?: boolean;
}

export interface WalletData {
  totalBalance: number;
  dailyChange: number;
  walletBalanceLabel: string;
  transactions: WalletTransaction[];
}

export interface UtilityTransaction {
  id: string;
  title: string;
  time: string;
  amount: string;
}

export interface UtilityData {
  waterBalance: number;
  electricityKwh: number;
  reminderEnabled: boolean;
  waterTransactions: UtilityTransaction[];
  electricityTransactions: UtilityTransaction[];
}

export interface CompareQuote {
  company: string;
  title: string;
  time: string;
  price: string;
  tag: string;
  tagTone: 'error' | 'secondary' | 'neutral' | 'success';
  logoTone: 'dark' | 'brand-zto' | 'brand-yto' | 'green';
}

export interface CompareResult {
  destination: string;
  weight: number;
  subsidy: number;
  quotes: CompareQuote[];
}

export interface CompareFormState {
  weight: string;
  destination: string;
}

export interface TakeoutOrder {
  id: string;
  title: string;
  destination: string;
  reward: string;
  tags: string[];
  icon: 'beef' | 'pizza' | 'utensils';
}

export interface TakeoutSubmitPayload {
  title: string;
  destination: string;
  reward: string;
  tags: string[];
  icon: TakeoutOrder['icon'];
}

export interface TakeoutData {
  heroTitle: string;
  heroDescription: string;
  nearbyOrders: number;
  orders: TakeoutOrder[];
  tip: string;
}

export interface RepairType {
  id: string;
  label: string;
  icon: 'lightbulb' | 'droplets' | 'zap';
  active?: boolean;
}

export interface RepairRequest {
  id: string;
  title: string;
  location: string;
  status: 'pending' | 'scheduled' | 'done';
  time: string;
}

export interface RepairSubmitPayload {
  typeId: string;
  location: string;
  description: string;
  imageCount: number;
}

export interface RepairData {
  heroTitle: string;
  heroDescription: string;
  quickActions: Array<{
    id: string;
    title: string;
    icon: 'wrench' | 'chart';
  }>;
  repairTypes: RepairType[];
  defaultLocation: string;
  defaultDescription: string;
  noticeTitle: string;
  notices: string[];
  recentRequests: RepairRequest[];
}

export interface LostFoundItem {
  id: string;
  title: string;
  location: string;
  time: string;
  type: 'lost' | 'found';
  image: string;
  description?: string;
  featured?: boolean;
}

export interface LostFoundSubmitPayload {
  title: string;
  location: string;
  description: string;
  type: LostFoundItem['type'];
}

export interface LostFoundData {
  heroTitle: string;
  heroDescription: string;
  foundCount: number;
  latestItems: LostFoundItem[];
}

export interface UserTakeoutHistoryItem extends TakeoutOrder {
  status: 'open' | 'claimed' | 'completed';
  time: string;
  note?: string;
}

export interface UserRepairHistoryItem extends RepairRequest {
  description?: string;
}

export interface UserPostHistoryItem extends LostFoundItem {
  contactHint?: string;
}

export interface UserActivityData {
  takeoutOrders: UserTakeoutHistoryItem[];
  repairRequests: UserRepairHistoryItem[];
  lostFoundPosts: UserPostHistoryItem[];
}

export interface NavigationPin {
  id: string;
  label: string;
  type: 'academic' | 'canteen' | 'location';
  positionClass: string;
}

export interface NavigationRoute {
  id: string;
  title: string;
  description: string;
  icon: 'footprints' | 'book' | 'zap';
  accent: 'secondary' | 'primary';
}

export interface NavigationData {
  heroTitle: string;
  heroDescription: string;
  mapTitle: string;
  pins: NavigationPin[];
  routes: NavigationRoute[];
  spotlightTitle: string;
  spotlightDescription: string;
}

export interface ServiceInfoCard {
  id: string;
  title: string;
  description: string;
  accent: 'primary' | 'tertiary' | 'neutral';
}

export interface ServiceCenterData {
  heroLabel: string;
  heroTitle: string;
  heroCaption: string;
  infoCards: ServiceInfoCard[];
  assistantMessage: string;
}

export interface TeacherApproval {
  id: string;
  badge: string;
  title: string;
  description: string;
  primaryAction: string;
  secondaryAction: string;
  tone: 'primary' | 'secondary';
  icon: 'file' | 'music';
}

export interface TeacherTool {
  id: string;
  title: string;
  description: string;
  icon: 'calendar' | 'book' | 'schedule' | 'package';
  route?: string;
}

export interface TeacherOfficeData {
  greeting: string;
  headline: string;
  approvals: TeacherApproval[];
  weeklyHours: number;
  completedHours: number;
  visits: number;
  documents: number;
  efficiencyText: string;
  tools: TeacherTool[];
  bannerTitle: string;
  bannerDescription: string;
}

export interface SalaryItem {
  label: string;
  value: string;
  color: 'primary' | 'secondary' | 'primaryFixed' | 'secondaryFixed';
}

export interface DeductionItem {
  label: string;
  value: string;
}

export interface SalaryTrend {
  label: string;
  value: number;
  active?: boolean;
}

export interface TeacherSalaryData {
  monthLabel: string;
  netSalary: string;
  grossSalary: string;
  totalDeductions: string;
  salaryItems: SalaryItem[];
  deductionItems: DeductionItem[];
  tax: string;
  trend: SalaryTrend[];
  complaintTitle: string;
  complaintDescription: string;
}

export interface CampusCardTransaction {
  id: string;
  title: string;
  time: string;
  amount: string;
  balance: string;
  icon: 'utensils' | 'parking' | 'wallet' | 'shopping';
  tone: 'secondary' | 'primary' | 'green' | 'tertiary';
  positive?: boolean;
}

export interface TeacherCampusCardData {
  cardTitle: string;
  balance: string;
  ownerName: string;
  maskedId: string;
  notification: string;
  transactions: CampusCardTransaction[];
}

export interface MeetingCalendarDay {
  day: string;
  date: string;
  active?: boolean;
}

export interface MeetingRoom {
  id: string;
  title: string;
  location: string;
  status: 'available' | 'busy';
  image: string;
  capacity: string;
  equipment: string[];
}

export interface TeacherMeetingData {
  heroTitle: string;
  heroDescription: string;
  availableCount: number;
  activeSlot: string;
  monthLabel: string;
  calendarDays: MeetingCalendarDay[];
  rooms: MeetingRoom[];
  noticeTitle: string;
  noticeDescription: string;
}

export interface LeaveApplication {
  id: string;
  studentName: string;
  className: string;
  leaveType: '事假' | '病假';
  startTime: string;
  endTime: string;
  reason: string;
  avatarText: string;
}

export interface TeacherLeaveData {
  heroTitle: string;
  heroDescription: string;
  pendingCount: number;
  applications: LeaveApplication[];
}

export interface StudentAffairApplication {
  id: string;
  title: string;
  applicant: string;
  category: string;
  quote?: string;
  detail?: string;
  meta?: string[];
  icon: 'award' | 'megaphone';
}

export interface TeacherStudentAffairsData {
  portalLabel: string;
  heroTitle: string;
  heroGreeting: string;
  stats: {
    pending: number;
    approved: number;
    rejected: number;
  };
  applications: StudentAffairApplication[];
}

export interface StudyRoomItem {
  id: string;
  title: string;
  capacity: string;
  equipment: string;
  status: 'available' | 'occupied' | 'maintenance';
}

export interface TeacherStudyRoomData {
  heroTitle: string;
  heroDescription: string;
  stats: {
    todayBookings: number;
    activeRooms: number;
  };
  rooms: StudyRoomItem[];
  primaryAction: string;
  secondaryAction: string;
  tip: string;
}

export interface TeacherDocumentData {
  heroTitle: string;
  heroDescription: string;
  activeDeliveries: number;
  activeOrder: {
    title: string;
    orderCode: string;
    urgency: string;
    pickupLabel: string;
    destinationLabel: string;
    progress: number;
    etaText: string;
  };
  form: {
    pickupPlaceholder: string;
    destinationPlaceholder: string;
    urgencyOptions: string[];
    remarksPlaceholder: string;
  };
  tips: string[];
}

export type ReviewDecision = 'approve' | 'reject';

export interface TeacherDocumentSubmitPayload {
  pickupLocation: string;
  destinationLocation: string;
  urgency: '普通' | '加急' | '定时';
  remarks: string;
}

export interface AdminOverview {
  stats: {
    users: number;
    students: number;
    teachers: number;
    admins: number;
    activeSessions: number;
    takeoutOrders: number;
    repairRequests: number;
    lostFoundItems: number;
    pendingApprovals: number;
    announcements: number;
  };
  announcements: Array<{
    id: string;
    audience: 'all' | Identity;
    label: string;
    message: string;
    publishedAt: string;
  }>;
  recentAuditLogs: Array<{
    id: string;
    type: string;
    actorId?: string;
    detail: string;
    createdAt: string;
  }>;
}

export interface AdminMetrics {
  startedAt: string;
  uptimeSeconds: number;
  totalRequests: number;
  inFlightRequests: number;
  statusCounts: Record<string, number>;
  methodCounts: Record<string, number>;
  topPaths: Array<{path: string; count: number}>;
  averageLatencyMs: number;
  p95LatencyMs: number;
  recentFailures: Array<{
    timestamp: string;
    method: string;
    path: string;
    statusCode: number;
    durationMs: number;
  }>;
  alerts: {
    enabled: boolean;
    minStatusCode: number;
    sentCount: number;
    failedCount: number;
    lastAttemptAt?: string;
    lastSuccessAt?: string;
    lastError?: string;
  };
}

export interface AdminUserDirectory {
  total: number;
  items: Array<{
    id: string;
    identity: Identity;
    role: UserRole;
    username: string;
    name: string;
    campus: string;
    organization: string;
    gradeLabel: string;
    verified: boolean;
    stats: {
      orders: number;
      repairs: number;
      posts: number;
    };
    activeSessionCount: number;
    lastSessionAt?: string;
    sessionExpiresAt?: string;
  }>;
}

export interface AnnouncementSubmitPayload {
  audience: 'all' | Identity;
  label: string;
  message: string;
}
