import React from 'react';
import {Bike, Clock3, Package, ReceiptText, Sparkles} from 'lucide-react';
import {fetchUserActivity} from '../lib/api';
import {emptyUserActivityData} from '../lib/emptyData';
import {useRemoteData} from '../lib/useRemoteData';
import type {AuthSession, UserActivityData, UserTakeoutHistoryItem} from '../lib/types';

interface MyTakeoutOrdersScreenProps {
  session: AuthSession;
}

export const MyTakeoutOrdersScreen: React.FC<MyTakeoutOrdersScreenProps> = ({session}) => {
  const {data, loading, error, source} = useRemoteData<UserActivityData>(
    session,
    emptyUserActivityData,
    fetchUserActivity,
  );

  const items = data.takeoutOrders;
  const openCount = items.filter((item) => item.status === 'open').length;
  const activeCount = items.filter((item) => item.status === 'claimed').length;
  const completedCount = items.filter((item) => item.status === 'completed').length;

  return (
    <div className="space-y-6 pt-4 pb-20">
      <section className="relative overflow-hidden rounded-3xl bg-secondary-fixed-dim p-6 shadow-sm">
        <div className="relative z-10 max-w-[70%] space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold text-on-secondary-fixed">
            <ReceiptText className="h-4 w-4" />
            我的代取订单
          </div>
          <h2 className="text-3xl font-black leading-tight text-on-secondary-fixed">自己的单子，一页看清状态</h2>
          <p className="text-sm text-on-secondary-fixed/80">
            这里展示你发布和参与过的代取记录，方便汇报时直接查看完整流程。
          </p>
        </div>
        <div className="absolute -right-5 -bottom-5 opacity-20">
          <Bike className="h-36 w-36 text-on-secondary-fixed" />
        </div>
      </section>

      <StatusNote loading={loading} error={error} source={source} />

      <section className="grid grid-cols-3 gap-4">
        <StatCard label="待接单" value={String(openCount)} tone="primary" />
        <StatCard label="进行中" value={String(activeCount)} tone="secondary" />
        <StatCard label="已完成" value={String(completedCount)} tone="neutral" />
      </section>

      <section className="space-y-4">
        {items.map((item) => (
          <TakeoutCard key={item.id} item={item} />
        ))}
        {!items.length ? (
          <EmptyCard icon={<Package className="h-6 w-6" />} text="当前还没有代取订单记录，发布后会立即同步到这里。" />
        ) : null}
      </section>
    </div>
  );
};

const TakeoutCard: React.FC<{item: UserTakeoutHistoryItem}> = ({item}) => (
  <article className="rounded-3xl bg-surface-container-lowest p-5 shadow-sm border border-outline-variant/10 space-y-4">
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/8 px-3 py-1 text-[11px] font-bold text-primary">
          <Clock3 className="h-3.5 w-3.5" />
          {item.time}
        </div>
        <h3 className="text-lg font-black text-on-surface">{item.title}</h3>
        <p className="text-sm text-on-surface-variant">{item.destination}</p>
      </div>
      <div className="text-right">
        <p className="text-2xl font-black text-primary">{item.reward}</p>
        <StatusBadge status={item.status} />
      </div>
    </div>
    <div className="flex flex-wrap gap-2">
      {item.tags.map((tag) => (
        <span key={tag} className="rounded-full bg-surface-container px-3 py-1 text-[11px] font-bold text-on-surface-variant">
          {tag}
        </span>
      ))}
    </div>
    {item.note ? (
      <div className="flex items-center gap-2 rounded-2xl bg-primary/5 px-4 py-3 text-sm text-primary">
        <Sparkles className="h-4 w-4 shrink-0" />
        {item.note}
      </div>
    ) : null}
  </article>
);

const StatusBadge: React.FC<{status: UserTakeoutHistoryItem['status']}> = ({status}) => {
  const config = status === 'open'
    ? {label: '待接单', className: 'bg-primary-container/20 text-primary'}
    : status === 'claimed'
      ? {label: '进行中', className: 'bg-secondary-container/30 text-secondary'}
      : {label: '已完成', className: 'bg-surface-container-high text-on-surface-variant'};

  return <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${config.className}`}>{config.label}</span>;
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
    return <p className="text-xs font-medium text-primary">正在同步我的代取订单...</p>;
  }
  if (error) {
    return <p className="text-xs font-medium text-red-600">{error}</p>;
  }
  return null;
};

const EmptyCard: React.FC<{icon: React.ReactNode; text: string}> = ({icon, text}) => (
  <div className="rounded-3xl bg-surface-container-lowest p-6 shadow-sm border border-dashed border-outline-variant/30 text-center text-sm text-on-surface-variant space-y-3">
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">{icon}</div>
    <p>{text}</p>
  </div>
);
