import {
  buildCompareQuotes,
  buildHomeBootstrap,
  getLostFoundData,
  getNavigationData,
  getRepairData,
  getServiceCenterData,
  getTakeoutData,
  getUserActivityData,
  submitLostFoundItem,
  submitRepairRequest,
  submitTakeoutOrder,
} from '../services.ts';
import type {
  CompareQuoteResponse,
  CourierAccountRecord,
  DatabaseShape,
  HomeBootstrap,
  LostFoundRecord,
  NavigationRecord,
  PublicUser,
  RepairRecord,
  ServiceCenterRecord,
  TakeoutRecord,
  UtilityAccountRecord,
  UserActivityRecord,
  WalletAccountRecord,
  WalletTransactionRecord,
} from '../types.ts';
import type {CompareInput, LostFoundSubmitInput, RepairSubmitInput, TakeoutSubmitInput, UtilityReminderInput, WalletDebitInput, WalletRechargeInput} from '../validation.ts';
import {ValidationError} from '../validation.ts';
import {createRecordId} from '../utils.ts';
import {databaseRepository} from './databaseRepository.ts';

export interface CampusRepository {
  getHomeBootstrap: (user: PublicUser) => HomeBootstrap;
  getNavigation: (user: PublicUser) => NavigationRecord;
  getServiceCenter: (user: PublicUser) => ServiceCenterRecord;
  getTakeout: (user: PublicUser) => TakeoutRecord;
  submitTakeout: (user: PublicUser, input: TakeoutSubmitInput) => TakeoutRecord;
  getRepair: (user: PublicUser) => RepairRecord;
  submitRepair: (user: PublicUser, input: RepairSubmitInput) => RepairRecord;
  getLostFound: (user: PublicUser) => LostFoundRecord;
  submitLostFound: (user: PublicUser, input: LostFoundSubmitInput) => LostFoundRecord;
  getUserActivity: (user: PublicUser) => UserActivityRecord | null;
  getCourier: (user: PublicUser) => CourierAccountRecord | undefined;
  getWallet: (user: PublicUser) => WalletAccountRecord | undefined;
  rechargeWallet: (user: PublicUser, input: WalletRechargeInput) => WalletAccountRecord;
  withdrawWallet: (user: PublicUser, input: WalletDebitInput) => WalletAccountRecord;
  payWallet: (user: PublicUser, input: WalletDebitInput) => WalletAccountRecord;
  getUtilities: (user: PublicUser) => UtilityAccountRecord;
  rechargeWater: (user: PublicUser, input: WalletRechargeInput) => UtilityAccountRecord;
  payElectricity: (user: PublicUser, input: WalletRechargeInput) => UtilityAccountRecord;
  setElectricityReminder: (user: PublicUser, input: UtilityReminderInput) => UtilityAccountRecord;
  quoteCourier: (user: PublicUser, input: CompareInput) => CompareQuoteResponse;
}

export const campusRepository: CampusRepository = {
  getHomeBootstrap(user) {
    return buildHomeBootstrap(user, databaseRepository.getSnapshot());
  },

  getNavigation(user) {
    return getNavigationData(databaseRepository.getSnapshot(), user.identity);
  },

  getServiceCenter(user) {
    return getServiceCenterData(databaseRepository.getSnapshot(), user.identity);
  },

  getTakeout(user) {
    return getTakeoutData(databaseRepository.getSnapshot(), user.identity);
  },

  submitTakeout(user, input) {
    const db = databaseRepository.update((draft) => {
      submitTakeoutOrder(draft, user.id, user.identity, input);
      appendAuditLog(draft, 'student.takeout.submit', user, `${user.username} 发布代取订单 ${input.title}`);
    });

    return db.takeoutByIdentity[user.identity];
  },

  getRepair(user) {
    return getRepairData(databaseRepository.getSnapshot(), user.identity);
  },

  submitRepair(user, input) {
    const db = databaseRepository.update((draft) => {
      submitRepairRequest(draft, user.id, user.identity, input);
      appendAuditLog(draft, 'student.repair.submit', user, `${user.username} 提交报修 ${input.typeId} ${input.location}`);
    });

    return db.repairByIdentity[user.identity];
  },

  getLostFound(user) {
    return getLostFoundData(databaseRepository.getSnapshot(), user.identity);
  },

  submitLostFound(user, input) {
    const db = databaseRepository.update((draft) => {
      submitLostFoundItem(draft, user.id, user.identity, input);
      appendAuditLog(draft, `student.lost-found.${input.type}`, user, `${user.username} 发布失物招领 ${input.title}`);
    });

    return db.lostFoundByIdentity[user.identity];
  },

  getUserActivity(user) {
    return getUserActivityData(databaseRepository.getSnapshot(), user.id);
  },

  getCourier(user) {
    return databaseRepository.getSnapshot().courierAccounts[user.id];
  },

  getWallet(user) {
    return databaseRepository.getSnapshot().walletAccounts[user.id];
  },

  rechargeWallet(user, input) {
    const db = databaseRepository.update((draft) => {
      adjustWalletBalance(draft, user, {
        amount: input.amount,
        title: '校园卡充值',
        auditType: 'wallet.recharge',
        auditVerb: '充值',
        iconKey: 'plus',
        tone: 'green',
        positive: true,
      });
    });

    return db.walletAccounts[user.id];
  },

  withdrawWallet(user, input) {
    const db = databaseRepository.update((draft) => {
      adjustWalletBalance(draft, user, {
        amount: input.amount,
        title: '余额提现',
        auditType: 'wallet.withdraw',
        auditVerb: '提现',
        iconKey: 'shopping',
        tone: 'purple',
        positive: false,
      });
    });

    return db.walletAccounts[user.id];
  },

  payWallet(user, input) {
    const db = databaseRepository.update((draft) => {
      adjustWalletBalance(draft, user, {
        amount: input.amount,
        title: '付款码消费',
        auditType: 'wallet.pay',
        auditVerb: '付款',
        iconKey: 'shopping',
        tone: 'purple',
        positive: false,
      });
    });

    return db.walletAccounts[user.id];
  },

  getUtilities(user) {
    return getUtilityAccount(databaseRepository.getSnapshot(), user);
  },

  rechargeWater(user, input) {
    const db = databaseRepository.update((draft) => {
      const account = getUtilityAccount(draft, user);
      account.waterBalance = Number((account.waterBalance + input.amount).toFixed(2));
      account.waterTransactions = [
        {
          id: createRecordId('water'),
          title: '热水充值',
          time: '刚刚',
          amount: `+${input.amount.toFixed(2)}`,
        },
        ...account.waterTransactions,
      ].slice(0, 20);
      appendAuditLog(draft, 'utility.water.recharge', user, `${user.username} 热水充值 ${input.amount.toFixed(2)} 元`);
    });

    return db.utilityAccounts[user.id];
  },

  payElectricity(user, input) {
    const db = databaseRepository.update((draft) => {
      const account = getUtilityAccount(draft, user);
      account.electricityKwh = Number((account.electricityKwh + input.amount).toFixed(2));
      account.electricityTransactions = [
        {
          id: createRecordId('electricity'),
          title: '电费缴纳',
          time: '刚刚',
          amount: `+${input.amount.toFixed(2)} 度`,
        },
        ...account.electricityTransactions,
      ].slice(0, 20);
      appendAuditLog(draft, 'utility.electricity.pay', user, `${user.username} 电费缴纳 ${input.amount.toFixed(2)} 度`);
    });

    return db.utilityAccounts[user.id];
  },

  setElectricityReminder(user, input) {
    const db = databaseRepository.update((draft) => {
      const account = getUtilityAccount(draft, user);
      account.reminderEnabled = input.enabled;
      appendAuditLog(draft, 'utility.electricity.reminder', user, `${user.username} ${input.enabled ? '开启' : '关闭'}低电量提醒`);
    });

    return db.utilityAccounts[user.id];
  },

  quoteCourier(user, input) {
    const result = buildCompareQuotes(databaseRepository.getSnapshot(), input.weight, input.destination);
    databaseRepository.update((draft) => {
      appendAuditLog(draft, 'courier.compare', user, `${user.username} 查询快递比价 ${input.destination} ${input.weight}kg`);
    });
    return result;
  },
};

function formatYuan(value: number): string {
  return `¥${value.toFixed(2)}`;
}

function getWalletAccount(db: DatabaseShape, user: PublicUser): WalletAccountRecord {
  db.walletAccounts[user.id] ??= {
    totalBalance: 0,
    dailyChange: 0,
    walletBalanceLabel: '¥0.00',
    transactions: [],
  };

  return db.walletAccounts[user.id];
}

function getUtilityAccount(db: DatabaseShape, user: PublicUser): UtilityAccountRecord {
  db.utilityAccounts ??= {};
  db.utilityAccounts[user.id] ??= {
    waterBalance: user.identity === 'teacher' ? 68 : 42.5,
    electricityKwh: user.identity === 'teacher' ? 58 : 36.5,
    reminderEnabled: true,
    waterTransactions: [
      {id: createRecordId('water'), title: '1号宿舍楼 302室', time: '昨天 19:45', amount: '-2.80'},
    ],
    electricityTransactions: [
      {id: createRecordId('electricity'), title: '电费缴纳', time: '上月 08:30', amount: '+30.00 度'},
    ],
  };

  return db.utilityAccounts[user.id];
}

function adjustWalletBalance(
  db: DatabaseShape,
  user: PublicUser,
  options: {
    amount: number;
    title: string;
    auditType: string;
    auditVerb: string;
    iconKey: WalletTransactionRecord['iconKey'];
    tone: WalletTransactionRecord['tone'];
    positive: boolean;
  },
): void {
  const account = getWalletAccount(db, user);
  const signedAmount = options.positive ? options.amount : -options.amount;
  const nextBalance = Number((account.totalBalance + signedAmount).toFixed(2));

  if (nextBalance < 0) {
    throw new ValidationError('余额不足。');
  }

  const transaction: WalletTransactionRecord = {
    id: createRecordId('txn'),
    title: options.title,
    time: '刚刚',
    amount: `${options.positive ? '+' : '-'}${options.amount.toFixed(2)}`,
    iconKey: options.iconKey,
    tone: options.tone,
    positive: options.positive,
  };

  account.totalBalance = nextBalance;
  account.dailyChange = Number((account.dailyChange + signedAmount).toFixed(2));
  account.walletBalanceLabel = formatYuan(nextBalance);
  account.transactions = [transaction, ...account.transactions].slice(0, 20);

  appendAuditLog(db, options.auditType, user, `${user.username} ${options.auditVerb} ${options.amount.toFixed(2)} 元`);
}

function appendAuditLog(db: DatabaseShape, type: string, actor: PublicUser, detail: string): void {
  db.auditLogs.unshift({
    id: createRecordId('audit'),
    type,
    actorId: actor.id,
    detail,
    createdAt: new Date().toISOString(),
  });
}
