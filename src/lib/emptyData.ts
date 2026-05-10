import type {
  CompareFormState,
  CompareResult,
  CourierData,
  DocumentDeliveryData,
  HomeBootstrap,
  LostFoundData,
  NavigationData,
  RepairData,
  ServiceCenterData,
  TakeoutData,
  TeacherCampusCardData,
  TeacherDocumentData,
  TeacherLeaveData,
  TeacherMeetingData,
  TeacherOfficeData,
  TeacherSalaryData,
  TeacherStudyRoomData,
  TeacherStudentAffairsData,
  UserActivityData,
  WalletData,
} from './types';

export const emptyHomeBootstrap: HomeBootstrap = {
  appName: 'Campus Pro',
  campusName: '',
  announcement: {
    label: '',
    message: '',
    publishedAt: '',
  },
  banner: {
    title: '',
    description: '',
  },
};

export const emptyCourierData: CourierData = {
  stationName: '',
  pendingCount: 0,
  historyCount: 0,
  noteTitle: '',
  noteMessage: '',
  packages: [],
};

export const emptyWalletData: WalletData = {
  totalBalance: 0,
  dailyChange: 0,
  walletBalanceLabel: '',
  transactions: [],
};

export const emptyCompareForm: CompareFormState = {
  weight: '1',
  destination: '',
};

export const emptyCompareResult: CompareResult = {
  destination: '',
  weight: 1,
  subsidy: 0,
  quotes: [],
};

export const emptyTakeoutData: TakeoutData = {
  heroTitle: '',
  heroDescription: '',
  nearbyOrders: 0,
  orders: [],
  tip: '',
};

export const emptyRepairData: RepairData = {
  heroTitle: '',
  heroDescription: '',
  quickActions: [],
  repairTypes: [],
  defaultLocation: '',
  defaultDescription: '',
  noticeTitle: '',
  notices: [],
  recentRequests: [],
};

export const emptyLostFoundData: LostFoundData = {
  heroTitle: '',
  heroDescription: '',
  foundCount: 0,
  latestItems: [],
};

export const emptyUserActivityData: UserActivityData = {
  takeoutOrders: [],
  repairRequests: [],
  lostFoundPosts: [],
};

export const emptyNavigationData: NavigationData = {
  heroTitle: '',
  heroDescription: '',
  mapTitle: '',
  pins: [],
  routes: [],
  spotlightTitle: '',
  spotlightDescription: '',
};

export const emptyServiceCenterData: ServiceCenterData = {
  heroLabel: '',
  heroTitle: '',
  heroCaption: '',
  infoCards: [],
  assistantMessage: '',
};

export const emptyTeacherOfficeData: TeacherOfficeData = {
  greeting: '',
  headline: '',
  approvals: [],
  weeklyHours: 1,
  completedHours: 0,
  visits: 0,
  documents: 0,
  efficiencyText: '',
  tools: [],
  bannerTitle: '',
  bannerDescription: '',
};

export const emptyTeacherSalaryData: TeacherSalaryData = {
  monthLabel: '',
  netSalary: '',
  grossSalary: '',
  totalDeductions: '',
  salaryItems: [],
  deductionItems: [],
  tax: '',
  trend: [],
  complaintTitle: '',
  complaintDescription: '',
};

export const emptyTeacherCampusCardData: TeacherCampusCardData = {
  cardTitle: '',
  balance: '',
  ownerName: '',
  maskedId: '',
  notification: '',
  transactions: [],
};

export const emptyTeacherMeetingData: TeacherMeetingData = {
  heroTitle: '',
  heroDescription: '',
  availableCount: 0,
  activeSlot: '',
  monthLabel: '',
  calendarDays: [],
  rooms: [],
  noticeTitle: '',
  noticeDescription: '',
};

export const emptyTeacherDocumentData: TeacherDocumentData = {
  heroTitle: '',
  heroDescription: '',
  activeDeliveries: 0,
  activeOrder: {
    title: '',
    orderCode: '',
    urgency: '',
    pickupLabel: '',
    destinationLabel: '',
    progress: 0,
    etaText: '',
  },
  form: {
    pickupPlaceholder: '',
    destinationPlaceholder: '',
    urgencyOptions: [],
    remarksPlaceholder: '',
  },
  tips: [],
};

export const emptyDocumentDeliveryData: DocumentDeliveryData = {
  tasks: [],
};

export const emptyTeacherLeaveData: TeacherLeaveData = {
  heroTitle: '',
  heroDescription: '',
  pendingCount: 0,
  applications: [],
};

export const emptyTeacherStudentAffairsData: TeacherStudentAffairsData = {
  portalLabel: '',
  heroTitle: '',
  heroGreeting: '',
  stats: {
    pending: 0,
    approved: 0,
    rejected: 0,
  },
  applications: [],
};

export const emptyTeacherStudyRoomData: TeacherStudyRoomData = {
  heroTitle: '',
  heroDescription: '',
  stats: {
    todayBookings: 0,
    activeRooms: 0,
  },
  rooms: [],
  primaryAction: '',
  secondaryAction: '',
  tip: '',
};
