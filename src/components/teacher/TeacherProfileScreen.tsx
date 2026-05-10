import React from 'react';
import {Calendar, ChevronRight, CreditCard, FileText, LogOut, Package, Settings, ShieldCheck, Users, Verified, Wrench} from 'lucide-react';
import type {CourierData, DataSource, SessionUser, WalletData} from '../../lib/types';

interface TeacherProfileProps {
  onNavigate: (screen: string) => void;
  user: SessionUser;
  wallet: WalletData;
  courier: CourierData;
  source: DataSource;
  expiresAt: string;
  dataNotice?: string;
  onLogout: () => void;
}

export const TeacherProfileScreen: React.FC<TeacherProfileProps> = ({
  onNavigate,
  user,
  wallet,
  courier,
  source,
  expiresAt,
  dataNotice,
  onLogout,
}) => {
  return (
    <div className="space-y-8 pt-4 pb-20">
      <section className="relative mb-8 pt-10">
        <div className="absolute -top-4 -right-2 z-10 h-32 w-32">
          <img
            src="./images/remote-38-6074718af5.png"
            alt="Steady Panda Mascot"
            className="h-full w-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative overflow-hidden rounded-3xl border border-outline-variant/5 bg-surface-container-lowest p-8 shadow-lg">
          <div className="relative z-20 flex flex-col gap-1">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-secondary px-3 py-1 text-[10px] font-bold tracking-wider text-on-secondary">OFFICIAL</span>
              <div className="flex items-center gap-1 text-sm font-bold text-primary">
                <Verified className="h-4 w-4 fill-primary/20" />
                <span>{user.verified ? '已认证' : '未认证'}</span>
              </div>
            </div>
            <h2 className="font-headline text-4xl font-extrabold leading-tight tracking-tight text-on-surface">
              {user.name}
              <span className="ml-2 text-lg font-medium text-on-surface-variant">{user.gradeLabel}</span>
            </h2>
            <p className="text-lg text-on-surface-variant">账号: {user.username}</p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-3xl border border-outline-variant/5 bg-surface-container-low p-4">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">所属部门</p>
              <p className="font-bold text-on-surface">{user.organization}</p>
            </div>
            <div className="rounded-3xl border border-secondary-container/20 bg-secondary-container/30 p-4">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">所在校区</p>
              <p className="font-bold text-on-surface">{user.campus}</p>
            </div>
          </div>
        </div>
      </section>

      {dataNotice ? (
        <section className="rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 text-xs font-medium text-primary">
          {dataNotice}
        </section>
      ) : null}

      <section className="mb-8 grid grid-cols-2 gap-4">
        <StatCard icon={<Calendar className="h-8 w-8 opacity-80" />} value={String(user.stats.repairs + user.stats.orders)} label="本周待办" tone="primary" />
        <StatCard icon={<Users className="h-8 w-8 opacity-80" />} value={String(user.stats.orders + user.stats.posts + 52)} label="服务覆盖" tone="secondary" />
      </section>

      <section className="grid grid-cols-2 gap-4">
        <InfoCard title="会话状态" value={source === 'api' ? '登录会话' : '备用登录会话'} caption="应用重启后自动恢复" />
        <InfoCard title="会话到期" value={formatExpiresAt(expiresAt)} caption="401 时自动清理并返回登录页" />
      </section>

      <div className="space-y-3">
        <h3 className="px-2 text-sm font-bold uppercase tracking-widest text-on-surface-variant">个人记录</h3>
        <ProfileMenuItem icon={<Package className="h-6 w-6 text-primary" />} label="我的代取订单" subLabel={`${user.stats.orders} 条记录`} onClick={() => onNavigate('my-orders')} />
        <ProfileMenuItem icon={<Wrench className="h-6 w-6 text-secondary" />} label="我的报修" subLabel={`${user.stats.repairs} 条记录`} onClick={() => onNavigate('my-repairs')} />
        <ProfileMenuItem icon={<FileText className="h-6 w-6 text-tertiary" />} label="我的发布" subLabel={`${user.stats.posts} 条记录`} onClick={() => onNavigate('my-posts')} />
      </div>

      <div className="space-y-3">
        <h3 className="px-2 text-sm font-bold uppercase tracking-widest text-on-surface-variant">账户设置</h3>
        <ProfileMenuItem icon={<CreditCard className="h-6 w-6 text-primary" />} label="校园卡与余额" subLabel={wallet.walletBalanceLabel} onClick={() => onNavigate('teacher-campus-card')} />
        <ProfileMenuItem icon={<Package className="h-6 w-6 text-secondary" />} label="快递与包裹" subLabel={`${courier.pendingCount} 件待处理`} onClick={() => onNavigate('courier')} />
        <ProfileMenuItem icon={<ShieldCheck className="h-6 w-6 text-tertiary" />} label="账号与安全" subLabel={user.verified ? '已实名验证' : '待实名验证'} />
        <ProfileMenuItem icon={<Settings className="h-6 w-6 text-primary" />} label="系统通用设置" subLabel="通知、隐私与偏好" />
      </div>

      <button
        className="mt-12 flex w-full items-center justify-center gap-2 rounded-2xl border border-error/10 bg-surface-container-highest/50 py-5 font-bold text-error shadow-sm transition-all active:scale-95 hover:bg-error-container hover:text-on-error"
        onClick={onLogout}
        type="button"
      >
        <LogOut className="h-5 w-5" />
        退出登录
      </button>
    </div>
  );
};

const StatCard: React.FC<{icon: React.ReactNode; value: string; label: string; tone: 'primary' | 'secondary'}> = ({icon, value, label, tone}) => (
  <div className={`${tone === 'primary' ? 'bg-primary-container text-on-primary-container' : 'bg-secondary-container text-on-secondary-container'} aspect-square rounded-3xl p-6 shadow-md flex flex-col justify-between`}>
    {icon}
    <div>
      <p className="text-4xl font-black">{value}</p>
      <p className="text-sm font-bold opacity-80">{label}</p>
    </div>
  </div>
);

const InfoCard: React.FC<{title: string; value: string; caption: string}> = ({title, value, caption}) => (
  <div className="rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-4 shadow-sm">
    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">{title}</p>
    <p className="mt-2 text-lg font-black text-on-surface">{value}</p>
    <p className="mt-1 text-[11px] text-on-surface-variant">{caption}</p>
  </div>
);

const ProfileMenuItem: React.FC<{icon: React.ReactNode; label: string; subLabel: string; onClick?: () => void}> = ({icon, label, subLabel, onClick}) => (
  <button
    className="flex w-full items-center justify-between rounded-3xl border border-outline-variant/5 bg-surface-container-low p-5 text-left transition-colors active:scale-95 hover:bg-surface-container-highest"
    type="button"
    onClick={onClick}
  >
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-lowest shadow-sm">
        {icon}
      </div>
      <span className="font-bold text-on-surface">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-on-surface-variant">{subLabel}</span>
      <ChevronRight className="h-5 w-5 text-on-surface-variant" />
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
