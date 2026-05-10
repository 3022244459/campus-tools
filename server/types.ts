export type Identity = 'student' | 'teacher';
export type UserRole = Identity | 'admin';
export type AnnouncementAudience = Identity | 'all';

export interface UserStats {
  orders: number;
  repairs: number;
  posts: number;
}

export interface UserRecord {
  id: string;
  identity: Identity;
  role?: UserRole;
  username: string;
  salt: string;
  passwordHash: string;
  name: string;
  campus: string;
  organization: string;
  gradeLabel: string;
  verified: boolean;
  avatarUrl: string;
  stats: UserStats;
}

export interface SessionRecord {
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
}

export interface AnnouncementRecord {
  id: string;
  audience: AnnouncementAudience;
  label: string;
  message: string;
  publishedAt: string;
}

export interface CourierPackageRecord {
  id: string;
  title: string;
  code: string;
  location: string;
  tag: string;
  tagTone: string;
  icon: string;
  etaDays: number;
}

export interface CourierAccountRecord {
  stationName: string;
  pendingCount: number;
  historyCount: number;
  noteTitle: string;
  noteMessage: string;
  packages: CourierPackageRecord[];
}

export interface WalletTransactionRecord {
  id: string;
  title: string;
  time: string;
  amount: string;
  iconKey: 'utensils' | 'washing' | 'plus' | 'shopping';
  tone: 'orange' | 'sky' | 'green' | 'purple';
  positive?: boolean;
}

export interface WalletAccountRecord {
  totalBalance: number;
  dailyChange: number;
  walletBalanceLabel: string;
  transactions: WalletTransactionRecord[];
}

export interface UtilityTransactionRecord {
  id: string;
  title: string;
  time: string;
  amount: string;
}

export interface UtilityAccountRecord {
  waterBalance: number;
  electricityKwh: number;
  reminderEnabled: boolean;
  waterTransactions: UtilityTransactionRecord[];
  electricityTransactions: UtilityTransactionRecord[];
}

export interface CompareCarrierRecord {
  id: string;
  company: string;
  title: string;
  basePrice: number;
  pricePerKg: number;
  etaDays: string;
  tag: string;
  tagTone: string;
  logoTone: string;
}

export interface TakeoutOrderRecord {
  id: string;
  title: string;
  destination: string;
  reward: string;
  tags: string[];
  icon: 'beef' | 'pizza' | 'utensils';
}

export interface TakeoutSubmitRecord {
  title: string;
  destination: string;
  reward: string;
  tags: string[];
  icon: TakeoutOrderRecord['icon'];
}

export interface TakeoutRecord {
  heroTitle: string;
  heroDescription: string;
  nearbyOrders: number;
  orders: TakeoutOrderRecord[];
  tip: string;
}

export interface RepairTypeRecord {
  id: string;
  label: string;
  icon: 'lightbulb' | 'droplets' | 'zap';
  active?: boolean;
}

export interface RepairRequestRecord {
  id: string;
  title: string;
  location: string;
  status: 'pending' | 'scheduled' | 'done';
  time: string;
}

export interface RepairSubmitRecord {
  typeId: string;
  location: string;
  description: string;
  imageCount: number;
}

export interface RepairRecord {
  heroTitle: string;
  heroDescription: string;
  quickActions: Array<{
    id: string;
    title: string;
    icon: 'wrench' | 'chart';
  }>;
  repairTypes: RepairTypeRecord[];
  defaultLocation: string;
  defaultDescription: string;
  noticeTitle: string;
  notices: string[];
  recentRequests: RepairRequestRecord[];
}

export interface LostFoundItemRecord {
  id: string;
  title: string;
  location: string;
  time: string;
  type: 'lost' | 'found';
  image: string;
  description?: string;
  featured?: boolean;
}

export interface LostFoundSubmitRecord {
  title: string;
  location: string;
  description: string;
  type: LostFoundItemRecord['type'];
}

export interface LostFoundRecord {
  heroTitle: string;
  heroDescription: string;
  foundCount: number;
  latestItems: LostFoundItemRecord[];
}

export interface UserTakeoutHistoryItemRecord extends TakeoutOrderRecord {
  status: 'open' | 'claimed' | 'completed';
  time: string;
  note?: string;
}

export interface UserRepairHistoryItemRecord extends RepairRequestRecord {
  description?: string;
}

export interface UserPostHistoryItemRecord extends LostFoundItemRecord {
  contactHint?: string;
}

export interface UserActivityRecord {
  takeoutOrders: UserTakeoutHistoryItemRecord[];
  repairRequests: UserRepairHistoryItemRecord[];
  lostFoundPosts: UserPostHistoryItemRecord[];
}

export interface NavigationPinRecord {
  id: string;
  label: string;
  type: 'academic' | 'canteen' | 'location';
  positionClass: string;
}

export interface NavigationRouteRecord {
  id: string;
  title: string;
  description: string;
  icon: 'footprints' | 'book' | 'zap';
  accent: 'secondary' | 'primary';
}

export interface NavigationRecord {
  heroTitle: string;
  heroDescription: string;
  mapTitle: string;
  pins: NavigationPinRecord[];
  routes: NavigationRouteRecord[];
  spotlightTitle: string;
  spotlightDescription: string;
}

export interface ServiceInfoCardRecord {
  id: string;
  title: string;
  description: string;
  accent: 'primary' | 'tertiary' | 'neutral';
}

export interface ServiceCenterRecord {
  heroLabel: string;
  heroTitle: string;
  heroCaption: string;
  infoCards: ServiceInfoCardRecord[];
  assistantMessage: string;
}

export interface TeacherApprovalRecord {
  id: string;
  badge: string;
  title: string;
  description: string;
  primaryAction: string;
  secondaryAction: string;
  tone: 'primary' | 'secondary';
  icon: 'file' | 'music';
}

export interface TeacherToolRecord {
  id: string;
  title: string;
  description: string;
  icon: 'calendar' | 'book' | 'schedule' | 'package';
  route?: string;
}

export interface TeacherOfficeRecord {
  greeting: string;
  headline: string;
  approvals: TeacherApprovalRecord[];
  weeklyHours: number;
  completedHours: number;
  visits: number;
  documents: number;
  efficiencyText: string;
  tools: TeacherToolRecord[];
  bannerTitle: string;
  bannerDescription: string;
}

export interface SalaryItemRecord {
  label: string;
  value: string;
  color: 'primary' | 'secondary' | 'primaryFixed' | 'secondaryFixed';
}

export interface DeductionItemRecord {
  label: string;
  value: string;
}

export interface SalaryTrendRecord {
  label: string;
  value: number;
  active?: boolean;
}

export interface TeacherSalaryRecord {
  monthLabel: string;
  netSalary: string;
  grossSalary: string;
  totalDeductions: string;
  salaryItems: SalaryItemRecord[];
  deductionItems: DeductionItemRecord[];
  tax: string;
  trend: SalaryTrendRecord[];
  complaintTitle: string;
  complaintDescription: string;
}

export interface CampusCardTransactionRecord {
  id: string;
  title: string;
  time: string;
  amount: string;
  balance: string;
  icon: 'utensils' | 'parking' | 'wallet' | 'shopping';
  tone: 'secondary' | 'primary' | 'green' | 'tertiary';
  positive?: boolean;
}

export interface TeacherCampusCardRecord {
  cardTitle: string;
  balance: string;
  ownerName: string;
  maskedId: string;
  notification: string;
  transactions: CampusCardTransactionRecord[];
}

export interface MeetingCalendarDayRecord {
  day: string;
  date: string;
  active?: boolean;
}

export interface MeetingRoomRecord {
  id: string;
  title: string;
  location: string;
  status: 'available' | 'busy';
  image: string;
  capacity: string;
  equipment: string[];
}

export interface TeacherMeetingRecord {
  heroTitle: string;
  heroDescription: string;
  availableCount: number;
  activeSlot: string;
  monthLabel: string;
  calendarDays: MeetingCalendarDayRecord[];
  rooms: MeetingRoomRecord[];
  noticeTitle: string;
  noticeDescription: string;
}

export interface LeaveApplicationRecord {
  id: string;
  studentName: string;
  className: string;
  leaveType: '事假' | '病假';
  startTime: string;
  endTime: string;
  reason: string;
  avatarText: string;
}

export interface TeacherLeaveRecord {
  heroTitle: string;
  heroDescription: string;
  pendingCount: number;
  applications: LeaveApplicationRecord[];
}

export interface StudentAffairApplicationRecord {
  id: string;
  title: string;
  applicant: string;
  category: string;
  quote?: string;
  detail?: string;
  meta?: string[];
  icon: 'award' | 'megaphone';
}

export interface TeacherStudentAffairsRecord {
  portalLabel: string;
  heroTitle: string;
  heroGreeting: string;
  stats: {
    pending: number;
    approved: number;
    rejected: number;
  };
  applications: StudentAffairApplicationRecord[];
}

export interface StudyRoomItemRecord {
  id: string;
  title: string;
  capacity: string;
  equipment: string;
  status: 'available' | 'occupied' | 'maintenance';
}

export interface TeacherStudyRoomRecord {
  heroTitle: string;
  heroDescription: string;
  stats: {
    todayBookings: number;
    activeRooms: number;
  };
  rooms: StudyRoomItemRecord[];
  primaryAction: string;
  secondaryAction: string;
  tip: string;
}

export interface TeacherDocumentRecord {
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

export interface DocumentDeliveryTaskRecord {
  id: string;
  teacherName: string;
  title: string;
  pickupLabel: string;
  destinationLabel: string;
  urgency: string;
  reward: string;
  etaText: string;
  status: 'open' | 'claimed' | 'picked' | 'delivered';
}

export interface DocumentDeliveryRecord {
  tasks: DocumentDeliveryTaskRecord[];
}

export interface AuditLogRecord {
  id: string;
  type: string;
  actorId?: string;
  detail: string;
  createdAt: string;
}

export interface DatabaseShape {
  users: UserRecord[];
  sessions: SessionRecord[];
  announcements: AnnouncementRecord[];
  courierAccounts: Record<string, CourierAccountRecord>;
  walletAccounts: Record<string, WalletAccountRecord>;
  utilityAccounts: Record<string, UtilityAccountRecord>;
  compareCarriers: CompareCarrierRecord[];
  takeoutByIdentity: Record<Identity, TakeoutRecord>;
  repairByIdentity: Record<Identity, RepairRecord>;
  lostFoundByIdentity: Record<Identity, LostFoundRecord>;
  userActivityByUserId: Record<string, UserActivityRecord>;
  navigationByIdentity: Record<Identity, NavigationRecord>;
  serviceCenterByIdentity: Record<Identity, ServiceCenterRecord>;
  teacherOfficeByUserId: Record<string, TeacherOfficeRecord>;
  teacherSalaryByUserId: Record<string, TeacherSalaryRecord>;
  teacherCampusCardByUserId: Record<string, TeacherCampusCardRecord>;
  teacherMeetingByUserId: Record<string, TeacherMeetingRecord>;
  teacherLeaveByUserId: Record<string, TeacherLeaveRecord>;
  teacherStudentAffairsByUserId: Record<string, TeacherStudentAffairsRecord>;
  teacherStudyRoomByUserId: Record<string, TeacherStudyRoomRecord>;
  teacherDocumentByUserId: Record<string, TeacherDocumentRecord>;
  auditLogs: AuditLogRecord[];
}

export interface PublicUser {
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

export interface AdminUserSummary {
  id: string;
  identity: Identity;
  role: UserRole;
  username: string;
  name: string;
  campus: string;
  organization: string;
  gradeLabel: string;
  verified: boolean;
  stats: UserStats;
  activeSessionCount: number;
  lastSessionAt?: string;
  sessionExpiresAt?: string;
}

export interface AdminUserDirectory {
  total: number;
  items: AdminUserSummary[];
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

export interface CompareQuoteResponse {
  destination: string;
  weight: number;
  subsidy: number;
  quotes: Array<{
    company: string;
    title: string;
    time: string;
    price: string;
    tag: string;
    tagTone: string;
    logoTone: string;
  }>;
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
  announcements: AnnouncementRecord[];
  recentAuditLogs: AuditLogRecord[];
}
