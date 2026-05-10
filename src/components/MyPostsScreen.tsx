import React from 'react';
import {BadgeInfo, MapPin, Megaphone, Newspaper, SearchCheck} from 'lucide-react';
import {fetchUserActivity} from '../lib/api';
import {emptyUserActivityData} from '../lib/emptyData';
import {useRemoteData} from '../lib/useRemoteData';
import type {AuthSession, UserActivityData, UserPostHistoryItem} from '../lib/types';

interface MyPostsScreenProps {
  session: AuthSession;
}

export const MyPostsScreen: React.FC<MyPostsScreenProps> = ({session}) => {
  const {data, loading, error, source} = useRemoteData<UserActivityData>(
    session,
    emptyUserActivityData,
    fetchUserActivity,
  );

  const items = data.lostFoundPosts;
  const lostCount = items.filter((item) => item.type === 'lost').length;
  const foundCount = items.filter((item) => item.type === 'found').length;

  return (
    <div className="space-y-6 pt-4 pb-20">
      <section className="relative overflow-hidden rounded-3xl bg-tertiary-container p-6 shadow-sm">
        <div className="relative z-10 max-w-[70%] space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/50 px-3 py-1 text-[11px] font-bold text-on-tertiary-container">
            <Megaphone className="h-4 w-4" />
            我的发布
          </div>
          <h2 className="text-3xl font-black leading-tight text-on-tertiary-container">自己发过什么，马上能追踪</h2>
          <p className="text-sm text-on-tertiary-container/80">
            失物招领相关的个人发布会统一聚合在这里，便于发布后回看、跟进和认领反馈。
          </p>
        </div>
        <div className="absolute -right-5 -bottom-5 opacity-20">
          <Newspaper className="h-36 w-36 text-on-tertiary-container" />
        </div>
      </section>

      <StatusNote loading={loading} error={error} source={source} />

      <section className="grid grid-cols-2 gap-4">
        <StatCard label="丢失发布" value={String(lostCount)} />
        <StatCard label="拾到发布" value={String(foundCount)} />
      </section>

      <section className="space-y-4">
        {items.map((item) => (
          <PostCard key={item.id} item={item} />
        ))}
        {!items.length ? (
          <EmptyCard text="当前还没有发布记录，去失物招领页提交后会立即同步到这里。" />
        ) : null}
      </section>
    </div>
  );
};

const PostCard: React.FC<{item: UserPostHistoryItem}> = ({item}) => (
  <article className="rounded-3xl bg-surface-container-lowest p-5 shadow-sm border border-outline-variant/10 space-y-4">
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 rounded-full bg-surface-container px-3 py-1 text-[11px] font-bold text-on-surface-variant">
          <BadgeInfo className="h-3.5 w-3.5" />
          {item.time}
        </div>
        <h3 className="text-lg font-black text-on-surface">{item.title}</h3>
      </div>
      <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${
        item.type === 'lost' ? 'bg-primary-container/20 text-primary' : 'bg-secondary-container/30 text-secondary'
      }`}
      >
        {item.type === 'lost' ? '遗失' : '拾到'}
      </span>
    </div>
    <div className="flex items-center gap-2 text-sm text-on-surface-variant">
      <MapPin className="h-4 w-4 shrink-0" />
      {item.location}
    </div>
    {item.description ? (
      <p className="rounded-2xl bg-surface-container p-4 text-sm leading-6 text-on-surface-variant">{item.description}</p>
    ) : null}
    {item.contactHint ? (
      <div className="flex items-center gap-2 rounded-2xl bg-primary/5 px-4 py-3 text-sm text-primary">
        <SearchCheck className="h-4 w-4 shrink-0" />
        {item.contactHint}
      </div>
    ) : null}
  </article>
);

const StatCard: React.FC<{label: string; value: string}> = ({label, value}) => (
  <div className="rounded-3xl bg-surface-container-lowest p-4 shadow-sm border border-outline-variant/10">
    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">{label}</p>
    <p className="mt-3 text-3xl font-black text-on-surface">{value}</p>
  </div>
);

const StatusNote: React.FC<{loading: boolean; error: string; source: 'api' | 'mock'}> = ({loading, error}) => {
  if (loading) {
    return <p className="text-xs font-medium text-primary">正在同步我的发布记录...</p>;
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
