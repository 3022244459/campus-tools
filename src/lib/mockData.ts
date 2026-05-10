import type {
  AuthSession,
  CompareFormState,
  CompareResult,
  CourierData,
  HomeBootstrap,
  Identity,
  LostFoundData,
  LostFoundSubmitPayload,
  NavigationData,
  UserActivityData,
  RepairData,
  RepairSubmitPayload,
  ServiceCenterData,
  SessionUser,
  TakeoutData,
  TakeoutSubmitPayload,
  ReviewDecision,
  TeacherCampusCardData,
  TeacherDocumentData,
  TeacherDocumentSubmitPayload,
  TeacherLeaveData,
  TeacherMeetingData,
  TeacherOfficeData,
  TeacherSalaryData,
  TeacherStudyRoomData,
  TeacherStudentAffairsData,
  WalletData,
} from './types';

const studentUser: SessionUser = {
  id: 'stu-001',
  identity: 'student',
  role: 'student',
  username: 'student001',
  name: '张小宝',
  campus: '天津大学北洋园校区',
  organization: '计算机学院 · 2024级',
  gradeLabel: '2024级本科生',
  verified: true,
  avatarUrl: './images/remote-21-b20d58e37d.png',
  stats: {orders: 12, repairs: 2, posts: 5},
};

const teacherUser: SessionUser = {
  id: 'tea-001',
  identity: 'teacher',
  role: 'teacher',
  username: 'teacher001',
  name: '李老师',
  campus: '天津大学卫津路校区',
  organization: '教务处 · 专任教师',
  gradeLabel: '教师账号',
  verified: true,
  avatarUrl: './images/remote-21-b20d58e37d.png',
  stats: {orders: 8, repairs: 1, posts: 3},
};

const studentHome: HomeBootstrap = {
  appName: '校园宝',
  campusName: '天津大学北洋园校区',
  announcement: {
    label: '校园公告',
    message: '欢迎使用天津大学校园服务平台，北洋园校区与卫津路校区今日服务运行正常。',
    publishedAt: '2026-04-15T09:00:00.000Z',
  },
  banner: {
    title: '校园联接',
    description: '加入 2,000+ 名学生，每日在校园生态里互动交流。',
  },
};

const teacherHome: HomeBootstrap = {
  appName: '校园宝',
  campusName: '天津大学卫津路校区',
  announcement: {
    label: '教师公告',
    message: '卫津路校区教务协调会安排已更新，请老师及时查看办公通知。',
    publishedAt: '2026-04-15T09:30:00.000Z',
  },
  banner: {
    title: '教师服务中枢',
    description: '会议、审批、文档与校园卡事项集中处理。',
  },
};

const studentCourier: CourierData = {
  stationName: '北洋园校区驿站',
  pendingCount: 3,
  historyCount: 18,
  noteTitle: '温馨提示',
  noteMessage: '驿站营业时间为 8:00 - 21:00。超过 72 小时未取件的包裹会触发提醒。',
  packages: [
    {id: 'pkg-001', title: '天猫超市包裹', code: '2-4-3012', location: '1号货架 A区', tag: '今日到站', tagTone: 'secondary', icon: './images/remote-08-da7557d24e.png', etaDays: 0},
    {id: 'pkg-002', title: '顺丰速运', code: '5-1-1088', location: '5号货架 C区', tag: '待取 2 天', tagTone: 'neutral', icon: './images/remote-09-046b88fbc2.png', etaDays: 2},
    {id: 'pkg-003', title: '拼多多包裹', code: '1-2-0045', location: '大件区', tag: '待取 3 天', tagTone: 'neutral', icon: './images/remote-10-f909a49b37.png', etaDays: 3},
  ],
};

const teacherCourier: CourierData = {
  stationName: '卫津路校区教师快递专柜',
  pendingCount: 1,
  historyCount: 6,
  noteTitle: '办公提醒',
  noteMessage: '教师快递可在办公楼一层服务点领取，也支持代取登记。',
  packages: [
    {id: 'pkg-101', title: '教学资料包', code: 'T-7-1102', location: '办公楼服务点', tag: '优先领取', tagTone: 'secondary', icon: './images/remote-08-da7557d24e.png', etaDays: 0},
  ],
};

const studentWallet: WalletData = {
  totalBalance: 88.5,
  dailyChange: 12.4,
  walletBalanceLabel: '¥88.50',
  transactions: [
    {id: 'txn-001', title: '二食堂 - 兰州拉面', time: '今天 12:30', amount: '-15.00', iconKey: 'utensils', tone: 'orange'},
    {id: 'txn-002', title: '5号楼 - 自助洗衣', time: '今天 09:15', amount: '-4.00', iconKey: 'washing', tone: 'sky'},
    {id: 'txn-003', title: '银行卡充值', time: '昨天 18:20', amount: '+50.00', iconKey: 'plus', tone: 'green', positive: true},
    {id: 'txn-004', title: '校园超市 - 文具购买', time: '昨天 14:05', amount: '-22.50', iconKey: 'shopping', tone: 'purple'},
  ],
};

const teacherWallet: WalletData = {
  totalBalance: 260.2,
  dailyChange: 5.6,
  walletBalanceLabel: '¥260.20',
  transactions: [
    {id: 'txn-101', title: '教工食堂 - 工作餐', time: '今天 12:10', amount: '-18.00', iconKey: 'utensils', tone: 'orange'},
    {id: 'txn-102', title: '校园卡充值', time: '昨天 08:45', amount: '+200.00', iconKey: 'plus', tone: 'green', positive: true},
  ],
};

const compareQuotesByIdentity: Record<Identity, CompareResult> = {
  student: {
    destination: '天津南开区',
    weight: 1,
    subsidy: 1,
    quotes: [
      {company: '邮政', title: '中国邮政', time: '4-5', price: '6.5', tag: '偏远直达', tagTone: 'success', logoTone: 'green'},
      {company: '圆通', title: '圆通速递', time: '3-4', price: '8.0', tag: '常规路线', tagTone: 'neutral', logoTone: 'brand-yto'},
      {company: '中通', title: '中通快递', time: '3-4', price: '8.5', tag: '学生专享', tagTone: 'secondary', logoTone: 'brand-zto'},
      {company: '顺丰', title: '顺丰标快', time: '1-2', price: '12.0', tag: '时效首选', tagTone: 'error', logoTone: 'dark'},
    ],
  },
  teacher: {
    destination: '天津津南区',
    weight: 1,
    subsidy: 0.5,
    quotes: [
      {company: '邮政', title: '中国邮政', time: '4-5', price: '7.2', tag: '偏远直达', tagTone: 'success', logoTone: 'green'},
      {company: '圆通', title: '圆通速递', time: '3-4', price: '8.3', tag: '常规路线', tagTone: 'neutral', logoTone: 'brand-yto'},
      {company: '中通', title: '中通快递', time: '3-4', price: '8.9', tag: '办公寄件', tagTone: 'secondary', logoTone: 'brand-zto'},
      {company: '顺丰', title: '顺丰标快', time: '1-2', price: '12.2', tag: '时效首选', tagTone: 'error', logoTone: 'dark'},
    ],
  },
};

const takeoutByIdentity: Record<Identity, TakeoutData> = {
  student: {
    heroTitle: '全校代取 极速送达',
    heroDescription: '校内同学接单，安全又快捷。',
    nearbyOrders: 12,
    orders: [
      {id: 'takeout-1', title: '一号食堂代取', destination: '送到 12 号宿舍楼 A 区', reward: '¥5.0', tags: ['汉堡套餐', '30分钟内'], icon: 'beef'},
      {id: 'takeout-2', title: '奶茶代取', destination: '送到 图书馆南门', reward: '¥3.5', tags: ['少冰', '25分钟内'], icon: 'pizza'},
    ],
    tip: '取餐时请核对订单号，确保外卖包装完好。遇到问题请及时联系发布者或平台客服。',
  },
  teacher: {
    heroTitle: '校内代取 稳妥送达',
    heroDescription: '教师端也可查看代取服务，适合办公楼午餐代拿。',
    nearbyOrders: 4,
    orders: [
      {id: 'takeout-t1', title: '教工食堂午餐代取', destination: '送到 行政楼 3 楼教研室', reward: '¥4.0', tags: ['工作餐', '20分钟内'], icon: 'utensils'},
    ],
    tip: '教师端可用于查看校内代取服务，后续可按教师与学生流程分别管理。',
  },
};

const repairByIdentity: Record<Identity, RepairData> = {
  student: {
    heroTitle: '校园报修',
    heroDescription: '哪里坏了修哪里，北洋园小助手时刻在线。',
    quickActions: [
      {id: 'repair-submit', title: '在线报修', icon: 'wrench'},
      {id: 'repair-progress', title: '进度查询', icon: 'chart'},
    ],
    repairTypes: [
      {id: 'repair-light', label: '照明', icon: 'lightbulb', active: true},
      {id: 'repair-water', label: '给排水', icon: 'droplets'},
      {id: 'repair-electric', label: '电力', icon: 'zap'},
    ],
    defaultLocation: '例如：北洋园校区 3 号宿舍楼 204',
    defaultDescription: '例如：寝室灯管闪烁，开灯后 10 分钟自动熄灭。',
    noticeTitle: '报修须知',
    notices: ['紧急维修请拨打：0710-123456', '日常报修将在 24 小时内响应'],
    recentRequests: [
      {id: 'repair-r1', title: '照明报修', location: '3 号宿舍楼 204', status: 'scheduled', time: '今天 09:20'},
      {id: 'repair-r2', title: '给排水报修', location: '卫津路校区 6 号楼洗衣房', status: 'pending', time: '昨天 21:10'},
    ],
  },
  teacher: {
    heroTitle: '办公报修',
    heroDescription: '办公楼照明、网络与设备故障均可在此提交。',
    quickActions: [
      {id: 'repair-submit', title: '在线报修', icon: 'wrench'},
      {id: 'repair-progress', title: '进度查询', icon: 'chart'},
    ],
    repairTypes: [
      {id: 'repair-light', label: '照明', icon: 'lightbulb', active: true},
      {id: 'repair-water', label: '给排水', icon: 'droplets'},
      {id: 'repair-electric', label: '电力', icon: 'zap'},
    ],
    defaultLocation: '例如：行政楼 302 办公室',
    defaultDescription: '例如：投影仪 HDMI 连接异常，无法切换信号源。',
    noticeTitle: '报修须知',
    notices: ['教学相关故障会优先派单', '大型设备报修请补充设备编号'],
    recentRequests: [
      {id: 'repair-t1', title: '电力报修', location: '行政楼 302', status: 'pending', time: '今天 11:40'},
    ],
  },
};

const lostFoundByIdentity: Record<Identity, LostFoundData> = {
  student: {
    heroTitle: '别担心，校园宝帮你找',
    heroDescription: '每天有超过 100 件物品回到主人身边。',
    foundCount: 102,
    latestItems: [
      {id: 'lost-1', title: '蓝牙耳机 (左耳)', location: '西区图书馆 2F', time: '2 小时前', type: 'found', image: './images/remote-16-d9a6224c65.png'},
      {id: 'lost-2', title: '宿舍钥匙 + 挂件', location: '北食堂门口', time: '5 小时前', type: 'lost', image: './images/remote-17-6a0cb9b443.png'},
      {id: 'lost-3', title: '黑色小米充电宝', location: '中心体育场', time: '昨天 18:20', type: 'found', image: './images/remote-18-252d9d8fd2.png', description: '在操场台阶上捡到的，充入电量还有一半左右。', featured: true},
    ],
  },
  teacher: {
    heroTitle: '别担心，校园宝帮你找',
    heroDescription: '教师也可查看校园失物信息，便于办公物品认领。',
    foundCount: 36,
    latestItems: [
      {id: 'lost-t1', title: '黑色保温杯', location: '行政楼会议室', time: '1 小时前', type: 'found', image: './images/remote-16-d9a6224c65.png'},
      {id: 'lost-t2', title: '校园卡挂绳', location: '教工食堂门口', time: '今天 09:20', type: 'lost', image: './images/remote-17-6a0cb9b443.png'},
    ],
  },
};

const userActivityByUserId: Record<string, UserActivityData> = {
  'stu-001': {
    takeoutOrders: [
      {
        id: 'my-takeout-001',
        title: '南区奶茶代取',
        destination: '送到 12 号宿舍楼 A 区',
        reward: '楼4.5',
        tags: ['少冰', '尽快'],
        icon: 'pizza',
        status: 'open',
        time: '今天 12:40',
        note: '已发布，等待同学接单',
      },
      {
        id: 'my-takeout-002',
        title: '一食堂午饭代取',
        destination: '送到 图书馆南门',
        reward: '楼5.0',
        tags: ['盖饭', '已接单'],
        icon: 'utensils',
        status: 'claimed',
        time: '昨天 11:55',
        note: '跑腿同学已确认',
      },
      {
        id: 'my-takeout-003',
        title: '便利店早餐代取',
        destination: '送到 3 号宿舍楼',
        reward: '楼3.0',
        tags: ['面包', '完成'],
        icon: 'beef',
        status: 'completed',
        time: '04-12 08:10',
        note: '订单已完成',
      },
    ],
    repairRequests: [
      {
        id: 'my-repair-001',
        title: '照明报修',
        location: '3 号宿舍楼 204',
        status: 'scheduled',
        time: '今天 09:20',
        description: '宿舍灯管闪烁，晚间照明不稳定。',
      },
      {
        id: 'my-repair-002',
        title: '给排水报修',
        location: '卫津路校区 6 号楼洗衣房',
        status: 'pending',
        time: '昨天 21:10',
        description: '洗衣房地漏返水，地面积水明显。',
      },
      {
        id: 'my-repair-003',
        title: '电力报修',
        location: '公共自习室 A-106',
        status: 'done',
        time: '04-11 16:00',
        description: '插座面板松动，已完成更换。',
      },
    ],
    lostFoundPosts: [
      {
        id: 'my-post-001',
        title: '黑色雨伞',
        location: '图书馆一楼',
        time: '今天 10:15',
        type: 'lost',
        image: './images/remote-17-6a0cb9b443.png',
        description: '伞柄上有白色贴纸，请看到的同学联系我。',
        contactHint: '已同步到失物招领广场',
      },
      {
        id: 'my-post-002',
        title: '校园卡挂绳',
        location: '北食堂门口',
        time: '昨天 18:40',
        type: 'found',
        image: './images/remote-16-d9a6224c65.png',
        description: '挂绳为蓝白配色，卡套为空。',
        contactHint: '已有 1 位同学留言认领',
      },
    ],
  },
  'tea-001': {
    takeoutOrders: [
      {
        id: 'tea-takeout-001',
        title: '教工食堂午餐代取',
        destination: '送到 行政楼 3 楼教研室',
        reward: '楼4.0',
        tags: ['工作餐', '进行中'],
        icon: 'utensils',
        status: 'claimed',
        time: '今天 11:35',
        note: '已由校园跑腿接单',
      },
      {
        id: 'tea-takeout-002',
        title: '咖啡代取',
        destination: '送到 办公楼 B201',
        reward: '楼3.5',
        tags: ['热美式', '完成'],
        icon: 'pizza',
        status: 'completed',
        time: '04-13 14:20',
        note: '已准时送达',
      },
    ],
    repairRequests: [
      {
        id: 'tea-repair-001',
        title: '电力报修',
        location: '行政楼 302',
        status: 'pending',
        time: '今天 11:40',
        description: '投影设备供电异常，会议前需要处理。',
      },
    ],
    lostFoundPosts: [
      {
        id: 'tea-post-001',
        title: '黑色保温杯',
        location: '行政楼会议室',
        time: '今天 09:20',
        type: 'found',
        image: './images/remote-16-d9a6224c65.png',
        description: '杯身贴有学院标签，请失主联系办公室。',
        contactHint: '已转发到教师服务群',
      },
      {
        id: 'tea-post-002',
        title: '档案袋',
        location: '教工食堂门口',
        time: '昨天 17:05',
        type: 'lost',
        image: './images/remote-17-6a0cb9b443.png',
        description: '蓝色档案袋，内含会议资料。',
        contactHint: '等待后勤值班室反馈',
      },
    ],
  },
};

const navigationByIdentity: Record<Identity, NavigationData> = {
  student: {
    heroTitle: 'campus navigation',
    heroDescription: 'Find your way with campus live pins and recommended routes.',
    mapTitle: '北洋园校区全景图',
    pins: [
      {id: 'pin-academic', label: '教学楼', type: 'academic', positionClass: 'top-1/4 left-1/3'},
      {id: 'pin-canteen', label: '食堂', type: 'canteen', positionClass: 'bottom-1/3 right-1/4'},
      {id: 'pin-me', label: '你在这里', type: 'location', positionClass: 'top-1/2 right-1/2'},
    ],
    routes: [
      {id: 'route-run', title: '最美晨跑线', description: '绕人工湖 1.2km', icon: 'footprints', accent: 'secondary'},
      {id: 'route-library', title: '图书馆捷径', description: '避开人流 5min', icon: 'book', accent: 'primary'},
    ],
    spotlightTitle: '快到宿舍',
    spotlightDescription: '最短直线距离路线已为你高亮。',
  },
  teacher: {
    heroTitle: 'campus navigation',
    heroDescription: 'Teacher mode highlights office buildings, canteens and meeting rooms.',
    mapTitle: '北洋园校区全景图',
    pins: [
      {id: 'pin-office', label: '办公楼', type: 'academic', positionClass: 'top-1/4 left-1/3'},
      {id: 'pin-canteen', label: '教工食堂', type: 'canteen', positionClass: 'bottom-1/3 right-1/4'},
      {id: 'pin-me', label: '你在这里', type: 'location', positionClass: 'top-1/2 right-1/2'},
    ],
    routes: [
      {id: 'route-office', title: '办公楼快捷线', description: '避开主干道人流 4min', icon: 'book', accent: 'primary'},
      {id: 'route-canteen', title: '午休就餐线', description: '教工食堂直达路线', icon: 'footprints', accent: 'secondary'},
    ],
    spotlightTitle: '会议室直达',
    spotlightDescription: '从当前位置到行政楼会议室的推荐路径已生成。',
  },
};

const serviceCenterByIdentity: Record<Identity, ServiceCenterData> = {
  student: {
    heroLabel: '校园头条',
    heroTitle: '北洋园校区智慧服务全面升级，快来体验吧',
    heroCaption: '查看最新公告',
    infoCards: [
      {id: 'compare', title: '比价中心', description: '校内快递价格一手掌握', accent: 'primary'},
      {id: 'classroom', title: '空闲教室', description: '晚自习与讨论室空位实时看', accent: 'tertiary'},
      {id: 'shuttle', title: '校车时间', description: '北洋园到卫津路校区最新班次', accent: 'neutral'},
    ],
    assistantMessage: '嗨，我是小宝，今天北洋园校区天气晴朗，记得按时喝水哦。',
  },
  teacher: {
    heroLabel: '办公快讯',
    heroTitle: '教师办公服务已接入校园服务平台，审批与数据页面可联调查看',
    heroCaption: '查看最新公告',
    infoCards: [
      {id: 'salary', title: '工资查询', description: '查看实发、应发和扣款明细', accent: 'primary'},
      {id: 'campus-card', title: '校园卡', description: '余额、流水与公告统一查看', accent: 'tertiary'},
      {id: 'office', title: '办公中心', description: '审批、统计和常用工具集中入口', accent: 'neutral'},
    ],
    assistantMessage: '当前教师端已优先读取校园服务，网络繁忙时会回退到校园数据。',
  },
};

const teacherOffice: TeacherOfficeData = {
  greeting: '你好，李老师',
  headline: '高效办公，开启活力一天',
  approvals: [
    {id: 'approval-1', badge: '请假申请', title: '高二(3)班 张同学', description: '病假审批，预计 3 天', primaryAction: '立即同意', secondaryAction: '详情', tone: 'primary', icon: 'file'},
    {id: 'approval-2', badge: '学生活动', title: '校园歌手大赛', description: '物料申请，话筒与音响', primaryAction: '通过', secondaryAction: '驳回', tone: 'secondary', icon: 'music'},
  ],
  weeklyHours: 24,
  completedHours: 18,
  visits: 12,
  documents: 5,
  efficiencyText: '效率超过了 88% 的老师，继续保持。',
  tools: [
    {id: 'tool-meeting', title: '会议室预约', description: '实时查看空闲', icon: 'calendar', route: 'teacher-meeting'},
    {id: 'tool-study-room', title: '自习室申请', description: '学生课后辅导', icon: 'book', route: 'teacher-study-room'},
    {id: 'tool-schedule', title: '我的课表', description: '查看全天安排', icon: 'schedule'},
    {id: 'tool-supplies', title: '耗材领用', description: '办公用品申领', icon: 'package'},
  ],
  bannerTitle: '教工之家新活动',
  bannerDescription: '周五下午“趣味羽毛球赛”开启报名，快来运动吧。',
};

const teacherSalary: TeacherSalaryData = {
  monthLabel: '2026年04月 实发工资',
  netSalary: '¥12,450.00',
  grossSalary: '¥15,800.00',
  totalDeductions: '¥3,350.00',
  salaryItems: [
    {label: '基本工资', value: '¥8,500.00', color: 'primary'},
    {label: '岗位津贴', value: '¥3,200.00', color: 'secondary'},
    {label: '课时费 (48课时)', value: '¥2,400.00', color: 'primaryFixed'},
    {label: '绩效奖金', value: '¥1,700.00', color: 'secondaryFixed'},
  ],
  deductionItems: [
    {label: '养老保险', value: '¥680.00'},
    {label: '医疗保险', value: '¥170.00'},
    {label: '失业保险', value: '¥25.00'},
    {label: '住房公积金', value: '¥1,200.00'},
  ],
  tax: '¥1,275.00',
  trend: [
    {label: '11月', value: 60},
    {label: '12月', value: 65},
    {label: '01月', value: 75},
    {label: '02月', value: 82},
    {label: '03月', value: 88},
    {label: '04月', value: 100, active: true},
  ],
  complaintTitle: '工资异议申诉',
  complaintDescription: '如果您对工资条有任何疑问，请联系财务部。',
};

const teacherCampusCard: TeacherCampusCardData = {
  cardTitle: '教师电子卡',
  balance: '¥864.50',
  ownerName: '王晓云 教授',
  maskedId: '**** 8829',
  notification: '北洋园校区 B 区停车场于周五进行路面维护，请老师们移步 A 区停放。',
  transactions: [
    {id: 'card-1', title: '第一教工食堂', time: '今天 12:15 · 午餐', amount: '-18.50', balance: '864.50', icon: 'utensils', tone: 'secondary'},
    {id: 'card-2', title: '北洋园校区停车场', time: '昨天 18:30 · 停车费', amount: '-5.00', balance: '883.00', icon: 'parking', tone: 'primary'},
    {id: 'card-3', title: '系统充值', time: '04月14日 09:00 · 银行卡转入', amount: '+500.00', balance: '888.00', icon: 'wallet', tone: 'green', positive: true},
    {id: 'card-4', title: '校园超市 (便利店)', time: '04月13日 16:45 · 零售', amount: '-32.40', balance: '388.00', icon: 'shopping', tone: 'tertiary'},
  ],
};

const teacherMeeting: TeacherMeetingData = {
  heroTitle: '会议室预约',
  heroDescription: '今天有 5 个会议室空闲，快来预约吧。',
  availableCount: 5,
  activeSlot: '14:30 - 15:30 暂无预约',
  monthLabel: '2026年04月',
  calendarDays: [
    {day: '周一', date: '20', active: true},
    {day: '周二', date: '21'},
    {day: '周三', date: '22'},
    {day: '周四', date: '23'},
    {day: '周五', date: '24'},
    {day: '周六', date: '25'},
  ],
  rooms: [
    {id: 'meeting-1', title: '北洋园厅 (大)', location: '教学楼 A 栋 302', status: 'available', image: './images/remote-31-ee1c0f3924.png', capacity: '50人', equipment: ['投影仪', '5G']},
    {id: 'meeting-2', title: '博学室 (中)', location: '图书馆 4 楼 415', status: 'busy', image: './images/remote-32-d0a64482f5.png', capacity: '12人', equipment: ['智能电视']},
  ],
  noticeTitle: '预约须知',
  noticeDescription: '请至少提前 1 小时提交预约申请，离开时请关闭电源。',
};

const teacherLeave: TeacherLeaveData = {
  heroTitle: '请假审批',
  heroDescription: '高效处理学生请假申请，维护校园出勤秩序。',
  pendingCount: 3,
  applications: [
    {id: 'leave-1', studentName: '王小明', className: '计算机 2101 班', leaveType: '事假', startTime: '05-20 08:00', endTime: '05-22 18:00', reason: '因家里有急事需要回家处理，特此请假 3 天，望老师批准。', avatarText: '王'},
    {id: 'leave-2', studentName: '李华', className: '外语 2203 班', leaveType: '病假', startTime: '05-21 14:00', endTime: '05-21 18:00', reason: '感冒发烧，需要去校医院输液。', avatarText: '李'},
  ],
};

const teacherStudentAffairs: TeacherStudentAffairsData = {
  portalLabel: '教师工作台',
  heroTitle: '学生事务中心',
  heroGreeting: '早上好，大象教授',
  stats: {
    pending: 12,
    approved: 85,
    rejected: 4,
  },
  applications: [
    {id: 'affair-1', title: '国家励志奖学金', applicant: '张晓华 (计算机系)', category: '奖学金类', quote: '在校期间表现优异，专业排名前 3%，积极参与社会实践活动。', icon: 'award'},
    {id: 'affair-2', title: '校园吉他社公演许可', applicant: '李沐风 (艺术学院)', category: '活动许可', detail: '活动申请，舞台与音响器材需协调。', meta: ['11月15日', '北洋园广场'], icon: 'megaphone'},
  ],
};

const teacherStudyRoom: TeacherStudyRoomData = {
  heroTitle: '研讨室管理',
  heroDescription: '为学术交流提供安静空间，轻松管理实验室与研讨室。',
  stats: {
    todayBookings: 12,
    activeRooms: 5,
  },
  rooms: [
    {id: 'study-201', title: '研讨室 201', capacity: '8 人', equipment: '智慧屏', status: 'available'},
    {id: 'study-405', title: '实验室 405', capacity: '20 人', equipment: '示波器', status: 'occupied'},
    {id: 'study-102', title: '研讨室 102', capacity: '6 人', equipment: '维护中', status: 'maintenance'},
  ],
  primaryAction: '排课管理',
  secondaryAction: '预约审核',
  tip: '点击房间可查看详细使用记录和未来预约计划；如需紧急锁定房间，请前往排课管理进行操作。',
};

const teacherDocument: TeacherDocumentData = {
  heroTitle: '猫头鹰小使者 为您效劳',
  heroDescription: '校园文件代送，准时安全送达。',
  activeDeliveries: 1,
  activeOrder: {
    title: '期末考卷分发',
    orderCode: 'WL20230824',
    urgency: '加急',
    pickupLabel: '行政楼',
    destinationLabel: '教学楼 F',
    progress: 66,
    etaText: '预计 10 分钟后送达',
  },
  form: {
    pickupPlaceholder: '例如：行政楼 302',
    destinationPlaceholder: '例如：图书馆 办公区',
    urgencyOptions: ['普通', '加急', '定时'],
    remarksPlaceholder: '请告知文件类型或特殊要求...',
  },
  tips: ['全程轨迹跟踪', '隐私文件保护'],
};

export const demoCredentials: Record<Identity, {username: string; password: string}> = {
  student: {username: 'student001', password: 'campus123'},
  teacher: {username: 'teacher001', password: 'campus123'},
};

export const defaultCompareForm: CompareFormState = {
  weight: '1',
  destination: '天津南开区',
};

export function getMockSession(identity: Identity): AuthSession {
  return {
    token: `mock-${identity}`,
    expiresAt: '2099-12-31T23:59:59.000Z',
    user: identity === 'teacher' ? teacherUser : studentUser,
    source: 'mock',
  };
}

export function getMockHome(identity: Identity): HomeBootstrap {
  return identity === 'teacher' ? teacherHome : studentHome;
}

export function getMockCourier(identity: Identity): CourierData {
  return identity === 'teacher' ? teacherCourier : studentCourier;
}

export function getMockWallet(identity: Identity): WalletData {
  return identity === 'teacher' ? teacherWallet : studentWallet;
}

export function getMockCompare(identity: Identity): CompareResult {
  return compareQuotesByIdentity[identity];
}

export function getMockTakeout(identity: Identity): TakeoutData {
  return takeoutByIdentity[identity];
}

export function getMockRepair(identity: Identity): RepairData {
  return repairByIdentity[identity];
}

export function getMockLostFound(identity: Identity): LostFoundData {
  return lostFoundByIdentity[identity];
}

export function getMockUserActivity(userId: string): UserActivityData {
  return userActivityByUserId[userId] ?? {
    takeoutOrders: [],
    repairRequests: [],
    lostFoundPosts: [],
  };
}

export function getMockNavigation(identity: Identity): NavigationData {
  return navigationByIdentity[identity];
}

export function getMockServiceCenter(identity: Identity): ServiceCenterData {
  return serviceCenterByIdentity[identity];
}

export function getMockTeacherOffice(): TeacherOfficeData {
  return teacherOffice;
}

export function getMockTeacherSalary(): TeacherSalaryData {
  return teacherSalary;
}

export function getMockTeacherCampusCard(): TeacherCampusCardData {
  return teacherCampusCard;
}

export function getMockTeacherMeeting(): TeacherMeetingData {
  return teacherMeeting;
}

export function getMockTeacherLeave(): TeacherLeaveData {
  return teacherLeave;
}

export function getMockTeacherStudentAffairs(): TeacherStudentAffairsData {
  return teacherStudentAffairs;
}

export function getMockTeacherStudyRoom(): TeacherStudyRoomData {
  return teacherStudyRoom;
}

export function getMockTeacherDocument(): TeacherDocumentData {
  return teacherDocument;
}

export function submitMockTakeoutOrder(
  currentData: TakeoutData,
  payload: TakeoutSubmitPayload,
): TakeoutData {
  return {
    ...currentData,
    nearbyOrders: currentData.nearbyOrders + 1,
    orders: [
      {
        id: `mock-takeout-${Date.now()}`,
        title: payload.title,
        destination: payload.destination,
        reward: normalizeReward(payload.reward),
        tags: payload.tags,
        icon: payload.icon,
      },
      ...currentData.orders,
    ].slice(0, 8),
  };
}

export function submitMockRepairRequest(
  currentData: RepairData,
  payload: RepairSubmitPayload,
): RepairData {
  const repairType = currentData.repairTypes.find((item) => item.id === payload.typeId);
  const status: RepairData['recentRequests'][number]['status'] = payload.imageCount > 0 ? 'scheduled' : 'pending';
  return {
    ...currentData,
    recentRequests: [
      {
        id: `mock-repair-${Date.now()}`,
        title: repairType ? `${repairType.label}报修` : '新的报修申请',
        location: payload.location,
        status,
        time: '刚刚',
      },
      ...(currentData.recentRequests ?? []),
    ].slice(0, 6),
  };
}

export function submitMockLostFoundItem(
  currentData: LostFoundData,
  payload: LostFoundSubmitPayload,
): LostFoundData {
  return {
    ...currentData,
    foundCount: currentData.foundCount + (payload.type === 'found' ? 1 : 0),
    latestItems: [
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
      },
      ...currentData.latestItems,
    ].slice(0, 8),
  };
}

export function submitMockTeacherDocument(
  currentData: TeacherDocumentData,
  payload: TeacherDocumentSubmitPayload,
): TeacherDocumentData {
  return {
    ...currentData,
    activeDeliveries: currentData.activeDeliveries + 1,
    activeOrder: {
      title: payload.remarks || '新文件代送申请',
      orderCode: `MOCK${Date.now().toString().slice(-6)}`,
      urgency: payload.urgency,
      pickupLabel: payload.pickupLocation,
      destinationLabel: payload.destinationLocation,
      progress: 15,
      etaText: payload.urgency === '加急' ? '已提交，预计 10 分钟内接单' : '已提交，预计 20 分钟内接单',
    },
  };
}

export function reviewMockTeacherLeave(
  currentData: TeacherLeaveData,
  applicationId: string,
): TeacherLeaveData {
  return {
    ...currentData,
    pendingCount: Math.max(0, currentData.pendingCount - 1),
    applications: currentData.applications.filter((item) => item.id !== applicationId),
  };
}

export function reviewMockTeacherStudentAffairs(
  currentData: TeacherStudentAffairsData,
  applicationId: string,
  decision: ReviewDecision,
): TeacherStudentAffairsData {
  return {
    ...currentData,
    stats: {
      pending: Math.max(0, currentData.stats.pending - 1),
      approved: currentData.stats.approved + (decision === 'approve' ? 1 : 0),
      rejected: currentData.stats.rejected + (decision === 'reject' ? 1 : 0),
    },
    applications: currentData.applications.filter((item) => item.id !== applicationId),
  };
}

function normalizeReward(reward: string) {
  const numericValue = Number(reward.replace('¥', ''));
  const finalValue = Number.isFinite(numericValue) ? numericValue : 0;
  return `¥${finalValue.toFixed(1)}`;
}
