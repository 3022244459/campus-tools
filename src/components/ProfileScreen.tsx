import React from 'react';
import {Bell, CalendarClock, CreditCard, FileText, LogOut, Package, Settings, ShieldCheck, Wrench} from 'lucide-react';
import type {CourierData, SessionUser, WalletData} from '../lib/types';

interface ProfileProps {
  onNavigate: (screen: string) => void;
  onLogout: () => void;
  user: SessionUser;
  wallet: WalletData;
  courier: CourierData;
  source: 'api' | 'mock';
  expiresAt: string;
  dataNotice?: string;
}

export const ProfileScreen: React.FC<ProfileProps> = ({
  onNavigate,
  onLogout,
  user,
  wallet,
  courier,
  source,
  expiresAt,
  dataNotice,
}) => {
  const sessionText = '登录正常';

  return (
    <div className="space-y-8 pt-4 pb-16">
      <section className="flex items-center gap-6">
        <div className="relative h-24 w-24 rounded-full border-4 border-primary-container p-1">
          <img
            src={user.avatarUrl}
            alt="Avatar"
            className="h-full w-full rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-primary-container p-1.5 text-white">
            <Settings className="h-4 w-4" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-black text-on-surface">{user.name}</h2>
          <p className="text-sm font-medium text-on-surface-variant">{user.organization}</p>
          <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-secondary-container/30 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-secondary">
            <ShieldCheck className="h-3 w-3" />
            {user.verified ? '已实名认证' : '未实名认证'}
          </div>
        </div>
      </section>

      {dataNotice ? (
        <section className="rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 text-xs font-medium text-primary">
          {dataNotice}
        </section>
      ) : null}

      <section className="grid grid-cols-3 gap-4">
        <StatCard label="我的代取订单" value={String(user.stats.orders)} onClick={() => onNavigate('my-orders')} />
        <StatCard label="我的报修" value={String(user.stats.repairs)} onClick={() => onNavigate('my-repairs')} />
        <StatCard label="我的发布" value={String(user.stats.posts)} onClick={() => onNavigate('my-posts')} />
      </section>

      <section className="grid grid-cols-2 gap-4">
        <InfoCard
          title="会话状态"
          value={sessionText}
          caption="账号状态正常"
        />
        <InfoCard title="会话到期" value={formatExpiresAt(expiresAt)} caption="登录态已本地持久化" />
      </section>

      <section className="rounded-3xl bg-surface-container-low overflow-hidden divide-y divide-outline-variant/10">
        <MenuItem
          icon={<Package className="h-5 w-5" />}
          label="我的代取订单"
          subLabel={`${user.stats.orders} 条记录`}
          onClick={() => onNavigate('my-orders')}
        />
        <MenuItem
          icon={<Wrench className="h-5 w-5" />}
          label="我的报修"
          subLabel={`${user.stats.repairs} 条记录`}
          onClick={() => onNavigate('my-repairs')}
        />
        <MenuItem
          icon={<FileText className="h-5 w-5" />}
          label="我的发布"
          subLabel={`${user.stats.posts} 条记录`}
          onClick={() => onNavigate('my-posts')}
        />
        <MenuItem
          icon={<CreditCard className="h-5 w-5" />}
          label="我的钱包"
          subLabel={`余额: ${wallet.walletBalanceLabel}`}
          onClick={() => onNavigate('wallet')}
        />
        <MenuItem
          icon={<Bell className="h-5 w-5" />}
          label="我的包裹"
          subLabel={`${courier.pendingCount} 件待取`}
          onClick={() => onNavigate('courier')}
        />
        <MenuItem
          icon={<CalendarClock className="h-5 w-5" />}
          label="通用设置"
          subLabel={user.campus}
        />
      </section>

      <button
        onClick={onLogout}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-surface-container-highest py-4 font-bold text-error transition-transform active:scale-95"
        type="button"
      >
        <LogOut className="h-5 w-5" />
        退出登录
      </button>
    </div>
  );
};

const StatCard: React.FC<{label: string; value: string; onClick: () => void}> = ({label, value, onClick}) => (
  <button
    type="button"
    onClick={onClick}
    className="flex flex-col items-center gap-1 rounded-2xl bg-surface-container-lowest p-4 text-center shadow-sm transition-transform active:scale-95"
  >
    <span className="text-2xl font-black text-primary">{value}</span>
    <span className="text-[10px] font-bold uppercase text-on-surface-variant">{label}</span>
  </button>
);

const InfoCard: React.FC<{title: string; value: string; caption: string}> = ({title, value, caption}) => (
  <div className="rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-4 shadow-sm">
    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">{title}</p>
    <p className="mt-2 text-lg font-black text-on-surface">{value}</p>
    <p className="mt-1 text-[11px] text-on-surface-variant">{caption}</p>
  </div>
);

const MenuItem: React.FC<{icon: React.ReactNode; label: string; subLabel?: string; onClick?: () => void}> = ({icon, label, subLabel, onClick}) => (
  <button
    className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-surface-container-high"
    onClick={onClick}
    type="button"
  >
    <div className="flex items-center gap-4">
      <div className="text-primary">{icon}</div>
      <span className="font-bold text-on-surface">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {subLabel ? <span className="text-xs font-medium text-on-surface-variant">{subLabel}</span> : null}
      <span className="text-outline-variant">›</span>
    </div>
  </button>
);

function formatExpiresAt(expiresAt: string) {
  const parsed = new Date(expiresAt);
  if (Number.isNaN(parsed.getTime())) {
    return '未知';
  }

  return `${parsed.getMonth() + 1}/${parsed.getDate()} ${parsed.getHours().toString().padStart(2, '0')}:${parsed.getMinutes().toString().padStart(2, '0')}`;
}
