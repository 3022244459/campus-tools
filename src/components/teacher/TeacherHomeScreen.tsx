import React from 'react';
import {
  Award,
  Banknote,
  Bell,
  BookOpen,
  Building,
  Calendar,
  CheckSquare,
  ChevronRight,
  CreditCard,
  FileText,
  Megaphone,
  Package,
  Pizza,
  School,
  Truck,
  UserCircle2,
  Wrench,
} from 'lucide-react';
import type {CourierData, SessionUser, WalletData} from '../../lib/types';

interface TeacherHomeProps {
  onNavigate: (screen: string) => void;
  announcementLabel: string;
  announcementMessage: string;
  user: SessionUser;
  wallet: WalletData;
  courier: CourierData;
  dataNotice?: string;
}

export const TeacherHomeScreen: React.FC<TeacherHomeProps> = ({
  onNavigate,
  announcementLabel,
  announcementMessage,
  user,
  wallet,
  courier,
  dataNotice,
}) => {
  return (
    <div className="space-y-6 pt-4 pb-10">
      <section className="bg-surface-container-lowest rounded-lg p-5 shadow-sm border border-outline-variant/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Teacher Mode</p>
            <h2 className="mt-2 text-2xl font-black text-on-surface">{user.name}</h2>
            <p className="mt-1 text-sm text-on-surface-variant">{user.organization}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary-container/15 flex items-center justify-center text-primary">
            <UserCircle2 className="w-7 h-7" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-5">
          <MetricCard label="订单处理" value={String(user.stats.orders)} onClick={() => onNavigate('teacher-takeout')} />
          <MetricCard label="报修关联" value={String(user.stats.repairs)} onClick={() => onNavigate('teacher-repair')} />
          <MetricCard label="内容发布" value={String(user.stats.posts)} onClick={() => onNavigate('teacher-message')} />
        </div>
      </section>

      <section className="bg-surface-container-lowest rounded-lg p-4 flex items-center gap-3 shadow-sm">
        <div className="bg-primary-container/10 px-3 py-1 rounded-full flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-primary fill-primary" />
          <span className="text-primary font-bold text-xs">{announcementLabel}</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-on-surface-variant text-sm truncate">{announcementMessage}</p>
        </div>
        <button
          className="text-on-surface-variant/60 text-xs flex items-center font-medium"
          type="button"
          onClick={() => window.alert(`${announcementLabel}：${announcementMessage}`)}
        >
          更多
          <ChevronRight className="w-4 h-4" />
        </button>
      </section>

      {dataNotice ? (
        <section className="rounded-lg border border-primary/10 bg-primary/5 px-4 py-3 text-xs font-medium text-primary">
          {dataNotice}
        </section>
      ) : null}

      <section className="grid grid-cols-3 gap-4">
        <SummaryCard icon={<Package className="w-5 h-5" />} title="待取快递" value={`${courier.pendingCount} 件`} caption={courier.stationName} onClick={() => onNavigate('teacher-courier')} />
        <SummaryCard icon={<CreditCard className="w-5 h-5" />} title="钱包余额" value={wallet.walletBalanceLabel} caption={`流水 ${wallet.transactions.length} 条`} onClick={() => onNavigate('teacher-campus-card')} />
        <SummaryCard icon={<Banknote className="w-5 h-5" />} title="今日变化" value={`${wallet.dailyChange > 0 ? '+' : ''}${wallet.dailyChange.toFixed(1)}`} caption="校园账户动态" onClick={() => onNavigate('teacher-campus-card')} />
      </section>

      <section className="grid grid-cols-4 gap-4">
        <MenuIcon icon={<Truck className="w-7 h-7" />} label="快递代取" bgColor="bg-secondary-fixed" iconColor="text-on-secondary-fixed" onClick={() => onNavigate('teacher-courier')} />
        <MenuIcon icon={<Pizza className="w-7 h-7" />} label="外卖代取" bgColor="bg-primary-fixed" iconColor="text-white" onClick={() => onNavigate('teacher-takeout')} />
        <MenuIcon icon={<FileText className="w-7 h-7" />} label="文件代送" bgColor="bg-tertiary-fixed" iconColor="text-on-tertiary-fixed" onClick={() => onNavigate('teacher-document')} />
        <MenuIcon icon={<School className="w-7 h-7" />} label="学生事务" bgColor="bg-surface-container-highest" iconColor="text-on-primary-container" onClick={() => onNavigate('teacher-student-affairs')} />
        <MenuIcon icon={<Wrench className="w-7 h-7" />} label="校园报修" bgColor="bg-surface-container-high" iconColor="text-on-surface-variant" onClick={() => onNavigate('teacher-repair')} />
        <MenuIcon icon={<Calendar className="w-7 h-7" />} label="会议预约" bgColor="bg-secondary-fixed-dim" iconColor="text-on-secondary-fixed" onClick={() => onNavigate('teacher-meeting')} />
        <MenuIcon icon={<BookOpen className="w-7 h-7" />} label="自习室管理" bgColor="bg-tertiary-container" iconColor="text-on-tertiary-container" onClick={() => onNavigate('teacher-study-room')} />
        <MenuIcon icon={<CheckSquare className="w-7 h-7" />} label="请假审批" bgColor="bg-primary-container/20" iconColor="text-primary" onClick={() => onNavigate('teacher-leave')} />
      </section>

      <section>
        <div className="flex justify-between items-end mb-4">
          <h2 className="font-headline font-bold text-2xl text-on-surface">教师服务</h2>
          <span className="text-on-surface-variant text-xs opacity-60">Professional Portal</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ServiceCard icon={<Building className="w-6 h-6 fill-on-secondary-container" />} title="教务入口" desc="教学管理与课程安排" bgColor="bg-secondary-container" onClick={() => onNavigate('teacher-office')} />
          <ServiceCard icon={<Banknote className="w-6 h-6 fill-primary" />} title="工资查询" desc={`当前钱包 ${wallet.walletBalanceLabel}`} bgColor="bg-primary-container/20" onClick={() => onNavigate('teacher-salary')} />
          <ServiceCard icon={<CreditCard className="w-6 h-6 fill-on-tertiary-container" />} title="校园卡" desc="充值查询与账户管理" bgColor="bg-tertiary-container" onClick={() => onNavigate('teacher-campus-card')} />
          <ServiceCard icon={<Bell className="w-6 h-6 fill-on-secondary-fixed" />} title="办公通知" desc={`待处理快递 ${courier.pendingCount} 件`} bgColor="bg-secondary-fixed-dim" onClick={() => onNavigate('teacher-message')} />
        </div>
      </section>

      <section className="bg-secondary-fixed-dim rounded-lg p-6 relative overflow-hidden min-h-[140px] flex items-center shadow-sm">
        <div className="z-10 max-w-[60%]">
          <h4 className="font-headline font-extrabold text-2xl text-on-secondary-fixed leading-tight">
            教师服务升级
            <br />
            今日工作台
          </h4>
          <p className="text-on-secondary-fixed-variant text-xs mt-2">
            公告、钱包、快递和审批事项都可以在这里快速处理。
          </p>
        </div>
        <div className="absolute -right-4 -bottom-4 w-36 h-36 opacity-30">
          <Award className="w-full h-full text-on-secondary-fixed" />
        </div>
      </section>
    </div>
  );
};

const MetricCard: React.FC<{label: string; value: string; onClick: () => void}> = ({label, value, onClick}) => (
  <button className="bg-surface-container-low rounded-xl px-4 py-3 text-left active:scale-95 transition-transform" type="button" onClick={onClick}>
    <p className="text-lg font-black text-on-surface">{value}</p>
    <p className="text-[10px] font-bold text-on-surface-variant mt-1">{label}</p>
  </button>
);

const SummaryCard: React.FC<{icon: React.ReactNode; title: string; value: string; caption: string; onClick: () => void}> = ({icon, title, value, caption, onClick}) => (
  <button className="rounded-2xl p-4 text-left shadow-sm border bg-surface-container-lowest border-outline-variant/10 active:scale-95 transition-transform" type="button" onClick={onClick}>
    <div className="flex items-center gap-2 text-primary">
      {icon}
      <span className="text-[11px] font-bold text-on-surface-variant">{title}</span>
    </div>
    <p className="mt-3 text-xl font-black text-on-surface">{value}</p>
    <p className="mt-1 text-[10px] text-on-surface-variant">{caption}</p>
  </button>
);

const MenuIcon: React.FC<{
  icon: React.ReactNode;
  label: string;
  bgColor: string;
  iconColor: string;
  onClick: () => void;
}> = ({icon, label, bgColor, iconColor, onClick}) => (
  <button className="flex flex-col items-center gap-2 group cursor-pointer" onClick={onClick} type="button">
    <div className={`w-16 h-16 rounded-lg ${bgColor} flex items-center justify-center active:scale-90 transition-transform shadow-sm`}>
      <div className={iconColor}>{icon}</div>
    </div>
    <span className="text-xs font-medium text-on-surface">{label}</span>
  </button>
);

const ServiceCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  desc: string;
  bgColor: string;
  onClick: () => void;
}> = ({icon, title, desc, bgColor, onClick}) => (
  <button
    className="bg-surface-container-lowest p-5 rounded-lg flex flex-col gap-4 border border-outline-variant/10 shadow-sm relative overflow-hidden group cursor-pointer text-left"
    onClick={onClick}
    type="button"
  >
    <div className={`absolute -top-4 -right-4 w-16 h-16 ${bgColor}/10 rounded-full group-hover:scale-150 transition-transform duration-500`} />
    <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center`}>
      {icon}
    </div>
    <div>
      <h3 className="font-bold text-on-surface">{title}</h3>
      <p className="text-[10px] text-on-surface-variant mt-1">{desc}</p>
    </div>
  </button>
);
