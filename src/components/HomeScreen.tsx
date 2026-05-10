import React from 'react';
import {
  ArrowRight,
  BadgePercent,
  Bell,
  Briefcase,
  ChevronRight,
  Compass,
  CreditCard,
  Droplets,
  Package,
  QrCode,
  SearchCheck,
  ShieldCheck,
  Truck,
  Users,
  Utensils,
  Wrench,
  Zap,
} from 'lucide-react';
import type {CourierData, HomeBootstrap, SessionUser, WalletData} from '../lib/types';

interface HomeProps {
  onNavigate: (screen: string) => void;
  bootstrap: HomeBootstrap;
  user: SessionUser;
  wallet: WalletData;
  courier: CourierData;
  dataNotice?: string;
}

export const HomeScreen: React.FC<HomeProps> = ({onNavigate, bootstrap, user, wallet, courier, dataNotice}) => {
  return (
    <div className="space-y-6 pt-4 pb-16">
      <section className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-container flex items-center justify-center">
            <img
              src="./images/remote-12-d769ee83a1.png"
              alt="App Icon"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-primary font-black text-2xl tracking-tight leading-tight">{bootstrap.appName}</span>
            <div className="flex items-center gap-1">
              <span className="text-on-surface-variant text-[10px] font-medium">{bootstrap.campusName}</span>
              <ChevronRight className="w-3 h-3 text-primary rotate-90" />
            </div>
          </div>
        </div>
        <button
          className="w-10 h-10 rounded-full flex items-center justify-center text-primary active:scale-95 transition-transform"
          type="button"
          onClick={() => window.alert('付款码已打开，可用于食堂、超市和浴室消费。')}
        >
          <QrCode className="w-6 h-6" />
        </button>
      </section>

      <section className="bg-surface-container-lowest rounded-lg p-5 shadow-sm border border-outline-variant/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Welcome Back</p>
            <h2 className="mt-2 text-2xl font-black text-on-surface">{user.name}</h2>
            <p className="mt-1 text-sm text-on-surface-variant">{user.organization}</p>
          </div>
          <div className="inline-flex items-center gap-1 bg-secondary-container/30 text-secondary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3" />
            {user.verified ? '已认证' : '未认证'}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-5">
          <MetricCard label="我的订单" value={String(user.stats.orders)} tone="primary" onClick={() => onNavigate('my-orders')} />
          <MetricCard label="我的报修" value={String(user.stats.repairs)} tone="secondary" onClick={() => onNavigate('my-repairs')} />
          <MetricCard label="我的发布" value={String(user.stats.posts)} tone="neutral" onClick={() => onNavigate('my-posts')} />
        </div>
      </section>

      <section className="bg-secondary-fixed-dim/30 rounded-lg p-4 flex items-center justify-between relative overflow-hidden">
        <div className="flex items-center gap-3 relative z-10">
          <div className="bg-primary-container p-2 rounded-full flex items-center justify-center">
            <Bell className="w-4 h-4 text-white fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-primary tracking-wider">{bootstrap.announcement.label}</span>
            <span className="text-sm text-on-surface-variant">{bootstrap.announcement.message}</span>
          </div>
        </div>
        <button
          className="text-xs font-bold text-secondary-dim bg-white/50 px-3 py-1 rounded-full border-none relative z-10"
          type="button"
          onClick={() => window.alert(`${bootstrap.announcement.label}：${bootstrap.announcement.message}`)}
        >
          更多
        </button>
      </section>

      {dataNotice ? (
        <section className="rounded-lg border border-primary/10 bg-primary/5 px-4 py-3 text-xs font-medium text-primary">
          {dataNotice}
        </section>
      ) : null}

      <section className="grid grid-cols-3 gap-4">
        <SummaryCard
          icon={<Package className="w-5 h-5" />}
          title="待取快递"
          value={`${courier.pendingCount} 件`}
          caption={courier.stationName}
          accent="primary"
          onClick={() => onNavigate('courier')}
        />
        <SummaryCard
          icon={<CreditCard className="w-5 h-5" />}
          title="钱包余额"
          value={wallet.walletBalanceLabel}
          caption={`今日变动 ${wallet.dailyChange > 0 ? '+' : ''}${wallet.dailyChange.toFixed(1)}`}
          accent="secondary"
          onClick={() => onNavigate('wallet')}
        />
        <SummaryCard
          icon={<Users className="w-5 h-5" />}
          title="历史包裹"
          value={`${courier.historyCount}`}
          caption="查看取件记录"
          accent="neutral"
          onClick={() => onNavigate('courier')}
        />
      </section>

      <section className="grid grid-cols-4 gap-y-6 gap-x-4">
        <FunctionItem icon={<Package className="w-6 h-6" />} label="取快递" onClick={() => onNavigate('courier')} />
        <FunctionItem icon={<Truck className="w-6 h-6" />} label="外卖代取" onClick={() => onNavigate('takeout')} />
        <FunctionItem icon={<Wrench className="w-6 h-6" />} label="校园报修" onClick={() => onNavigate('repair')} />
        <FunctionItem icon={<SearchCheck className="w-6 h-6" />} label="失物招领" onClick={() => onNavigate('lost-found')} />
        <FunctionItem icon={<Users className="w-6 h-6" />} label="社团资讯" onClick={() => onNavigate('clubs')} />
        <FunctionItem icon={<Compass className="w-6 h-6" />} label="校园导航" onClick={() => onNavigate('map')} />
        <FunctionItem icon={<Droplets className="w-6 h-6" />} label="热水充值" onClick={() => onNavigate('water')} />
        <FunctionItem icon={<Zap className="w-6 h-6" />} label="电费查询" onClick={() => onNavigate('electricity')} />
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h2 className="text-2xl font-headline font-bold text-on-surface tracking-tight">校园生活服务</h2>
          <button
            className="text-on-surface-variant text-xs font-semibold pb-1 flex items-center gap-1 active:scale-95 transition-transform"
            type="button"
            onClick={() => onNavigate('services')}
          >
            更多服务 <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ServiceCard
            icon={<CreditCard className="w-5 h-5" />}
            title="校园卡充值"
            desc={`余额 ${wallet.walletBalanceLabel}，流水 ${wallet.transactions.length} 条`}
            bgColor="bg-surface-container-low"
            iconColor="bg-primary-container"
            onClick={() => onNavigate('wallet')}
          />
          <ServiceCard
            icon={<BadgePercent className="w-5 h-5" />}
            title="快递比价"
            desc="常用路线价格快速比较"
            bgColor="bg-secondary-container"
            iconColor="bg-secondary"
            onClick={() => onNavigate('courier-compare')}
          />
          <ServiceCard
            icon={<Utensils className="w-5 h-5" />}
            title="食堂优惠"
            desc="北洋园校区专属折扣"
            bgColor="bg-surface-container-highest"
            iconColor="bg-primary-container/80"
            onClick={() => onNavigate('canteen')}
          />
          <ServiceCard
            icon={<Briefcase className="w-5 h-5" />}
            title="兼职信息"
            desc="勤工俭学岗位速递"
            bgColor="bg-tertiary-container"
            iconColor="bg-tertiary"
            onClick={() => onNavigate('jobs')}
          />
        </div>
      </section>

      <section className="bg-primary p-6 rounded-lg text-on-primary flex items-center justify-between relative overflow-hidden mt-2">
        <div className="flex flex-col gap-1 relative z-10">
          <h3 className="text-xl font-headline font-extrabold italic uppercase tracking-tighter">{bootstrap.banner.title}</h3>
          <p className="text-xs opacity-90 max-w-[180px]">{bootstrap.banner.description}</p>
        </div>
        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center relative z-10 overflow-hidden border-4 border-white/10">
          <img
            src="./images/remote-13-c052b93e86.png"
            alt="Tower Logo"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full" />
      </section>
    </div>
  );
};

const MetricCard: React.FC<{
  label: string;
  value: string;
  tone: 'primary' | 'secondary' | 'neutral';
  onClick: () => void;
}> = ({label, value, tone, onClick}) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-xl px-4 py-3 text-left transition-transform active:scale-95 ${
    tone === 'primary'
      ? 'bg-primary-container/15'
      : tone === 'secondary'
        ? 'bg-secondary-container/30'
        : 'bg-surface-container-low'
  }`}
  >
    <p className="text-lg font-black text-on-surface">{value}</p>
    <p className="text-[10px] font-bold text-on-surface-variant mt-1">{label}</p>
  </button>
);

const SummaryCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
  caption: string;
  accent: 'primary' | 'secondary' | 'neutral';
  onClick: () => void;
}> = ({icon, title, value, caption, accent, onClick}) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-2xl p-4 text-left shadow-sm border transition-transform active:scale-95 ${
    accent === 'primary'
      ? 'bg-surface-container-lowest border-primary/10'
      : accent === 'secondary'
        ? 'bg-secondary-container/20 border-secondary/10'
        : 'bg-surface-container-low border-outline-variant/10'
  }`}
  >
    <div className="flex items-center gap-2 text-primary">
      {icon}
      <span className="text-[11px] font-bold text-on-surface-variant">{title}</span>
    </div>
    <p className="mt-3 text-xl font-black text-on-surface">{value}</p>
    <p className="mt-1 text-[10px] text-on-surface-variant">{caption}</p>
  </button>
);

const FunctionItem: React.FC<{icon: React.ReactNode; label: string; onClick: () => void}> = ({icon, label, onClick}) => (
  <button className="flex flex-col items-center gap-2 group cursor-pointer" onClick={onClick} type="button">
    <div className="w-14 h-14 bg-surface-container-highest rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200 text-primary">
      {icon}
    </div>
    <span className="text-[12px] font-semibold text-on-surface">{label}</span>
  </button>
);

const ServiceCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  desc: string;
  bgColor: string;
  iconColor: string;
  onClick: () => void;
}> = ({icon, title, desc, bgColor, iconColor, onClick}) => (
  <button className={`${bgColor} rounded-lg p-5 flex flex-col gap-4 relative overflow-hidden group cursor-pointer text-left`} onClick={onClick} type="button">
    <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-black/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
    <div className={`w-10 h-10 ${iconColor} rounded-full flex items-center justify-center text-white`}>
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-base font-bold text-on-surface">{title}</span>
      <span className="text-[10px] text-on-surface-variant">{desc}</span>
    </div>
  </button>
);
