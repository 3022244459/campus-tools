import React from 'react';
import {BadgeAlert, ClipboardList, ShieldCheck, Wrench} from 'lucide-react';
import {fetchUserActivity} from '../lib/api';
import {emptyUserActivityData} from '../lib/emptyData';
import {useRemoteData} from '../lib/useRemoteData';
import type {AuthSession, UserActivityData, UserRepairHistoryItem} from '../lib/types';

interface MyRepairRequestsScreenProps {
  session: AuthSession;
}

export const MyRepairRequestsScreen: React.FC<MyRepairRequestsScreenProps> = ({session}) => {
  const {data, loading, error, source} = useRemoteData<UserActivityData>(
    session,
    emptyUserActivityData,
    fetchUserActivity,
  );

  const items = data.repairRequests;
  const pendingCount = items.filter((item) => item.status === 'pending').length;
  const scheduledCount = items.filter((item) => item.status === 'scheduled').length;
  const doneCount = items.filter((item) => item.status === 'done').length;

  return (
    <div className="space-y-6 pt-4 pb-20">
      <section className="relative overflow-hidden rounded-3xl bg-primary-container/20 p-6 shadow-sm">
        <div className="relative z-10 max-w-[70%] space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1 text-[11px] font-bold text-primary">
            <ClipboardList className="h-4 w-4" />
            我的报修
          </div>
          <h2 className="text-3xl font-black leading-tight text-on-surface">报修进度不再分散</h2>
          <p className="text-sm text-on-surface-variant">
            宿舍、教室、办公场地的个人报修会统一落在这里，方便查看“提交后即同步”的完整闭环。
          </p>
        </div>
        <div className="absolute -right-5 -bottom-5 opacity-20">
          <Wrench className="h-36 w-36 text-primary" />
        </div>
      </section>

      <StatusNote loading={loading} error={error} source={source} />

      <section className="grid grid-cols-3 gap-4">
        <StatCard label="待受理" value={String(pendingCount)} tone="neutral" />
        <StatCard label="已排期" value={String(scheduledCount)} tone="secondary" />
        <StatCard label="已完成" value={String(doneCount)} tone="primary" />
      </section>

      <section className="space-y-4">
        {items.map((item) => (
          <RepairCard key={item.id} item={item} />
        ))}
        {!items.length ? (
          <EmptyCard text="当前没有报修记录，提交报修后会在这里出现。" />
        ) : null}
      </section>
    </div>
  );
};

const RepairCard: React.FC<{item: UserRepairHistoryItem}> = ({item}) => (
  <article className="rounded-3xl bg-surface-container-lowest p-5 shadow-sm border border-outline-variant/10 space-y-4">
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-1">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-on-surface-variant">{item.time}</p>
        <h3 className="text-lg font-black text-on-surface">{item.title}</h3>
        <p className="text-sm text-on-surface-variant">{item.location}</p>
      </div>
      <RepairStatusBadge status={item.status} />
    </div>
    {item.description ? (
      <div className="rounded-2xl bg-surface-container p-4 text-sm leading-6 text-on-surface-variant">
        {item.description}
      </div>
    ) : null}
  </article>
);

const RepairStatusBadge: React.FC<{status: UserRepairHistoryItem['status']}> = ({status}) => {
  const config = status === 'pending'
    ? {label: '待受理', className: 'bg-surface-container-high text-on-surface-variant', icon: <BadgeAlert className="h-4 w-4" />}
    : status === 'scheduled'
      ? {label: '已排期', className: 'bg-secondary-container/30 text-secondary', icon: <ClipboardList className="h-4 w-4" />}
      : {label: '已完成', className: 'bg-primary-container/20 text-primary', icon: <ShieldCheck className="h-4 w-4" />};

  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold ${config.className}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

const StatCard: React.FC<{label: string; value: string; tone: 'primary' | 'secondary' | 'neutral'}> = ({label, value, tone}) => (
  <div className={`rounded-3xl p-4 shadow-sm border border-outline-variant/10 ${
    tone === 'primary'
      ? 'bg-primary/5'
      : tone === 'secondary'
        ? 'bg-secondary/10'
        : 'bg-surface-container-lowest'
  }`}
  >
    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">{label}</p>
    <p className="mt-3 text-3xl font-black text-on-surface">{value}</p>
  </div>
);

const StatusNote: React.FC<{loading: boolean; error: string; source: 'api' | 'mock'}> = ({loading, error}) => {
  if (loading) {
    return <p className="text-xs font-medium text-primary">正在同步我的报修记录...</p>;
  }
  if (error) {
    return <p className="text-xs font-medium text-red-600">{error}</p>;
  }
  return null;
};

const EmptyCard: React.FC<{text: string}> = ({text}) => (
  <div className="rounded-3xl bg-surface-container-lowest p-6 shadow-sm border border-dashed border-outline-variant/30 text-center text-sm text-on-surface-variant">
    {text}
  </div>
);
