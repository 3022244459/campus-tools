import React from 'react';
import {Beef, Info, Navigation, Pizza, Search, Utensils} from 'lucide-react';
import {fetchTakeout, submitTakeout} from '../lib/api';
import {emptyTakeoutData} from '../lib/emptyData';
import {useRemoteData} from '../lib/useRemoteData';
import type {AuthSession, TakeoutData, TakeoutOrder} from '../lib/types';

interface TakeoutScreenProps {
  session: AuthSession;
}

export const TakeoutScreen: React.FC<TakeoutScreenProps> = ({session}) => {
  const remote = useRemoteData<TakeoutData>(session, emptyTakeoutData, fetchTakeout);
  const [viewData, setViewData] = React.useState<TakeoutData>(remote.data);
  const [currentSource, setCurrentSource] = React.useState<'api' | 'mock'>(remote.source);
  const [query, setQuery] = React.useState('');
  const [title, setTitle] = React.useState('奶茶代取');
  const [destination, setDestination] = React.useState('送到 图书馆南门');
  const [reward, setReward] = React.useState('4.5');
  const [tags, setTags] = React.useState('少冰, 尽快');
  const [icon, setIcon] = React.useState<TakeoutOrder['icon']>('pizza');
  const [actionError, setActionError] = React.useState('');
  const [actionMessage, setActionMessage] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    setViewData(remote.data);
  }, [remote.data]);

  React.useEffect(() => {
    setCurrentSource(remote.source);
  }, [remote.source]);

  const filteredOrders = React.useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) {
      return viewData.orders;
    }

    return viewData.orders.filter((order) => (
      order.title.toLowerCase().includes(keyword) ||
      order.destination.toLowerCase().includes(keyword) ||
      order.tags.some((tag) => tag.toLowerCase().includes(keyword))
    ));
  }, [query, viewData.orders]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setActionError('');
    setActionMessage('');

    try {
      const parsedTags = tags.split(/[,，]/).map((item) => item.trim()).filter(Boolean).slice(0, 3);
      const result = await submitTakeout(session, {
        title,
        destination,
        reward,
        tags: parsedTags,
        icon,
      }, viewData);
      setViewData(result.data);
      setCurrentSource(result.source);
      setActionMessage('代取订单已发布，列表已更新。');
      setTitle('新的代取订单');
      setDestination('');
      setReward('4');
      setTags('尽快');
    } catch (error) {
      setActionError(error instanceof Error ? error.message : '代取发布失败，请稍后重试。');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 pt-4 pb-20">
      <section className="relative bg-secondary-fixed-dim overflow-hidden rounded-lg p-6 flex flex-col justify-between min-h-[200px] shadow-sm">
        <div className="relative z-20 max-w-[60%]">
          <h2 className="font-headline text-3xl font-extrabold text-on-secondary-fixed leading-tight whitespace-pre-line">
            {viewData.heroTitle.replace(' ', '\n')}
          </h2>
          <p className="font-body text-sm mt-2 text-on-secondary-fixed-variant opacity-80">{viewData.heroDescription}</p>
          <div className="mt-4 flex gap-2">
            <span className="bg-primary-fixed text-on-primary-fixed px-5 py-2 rounded-full font-bold text-sm">
              发布后立即同步
            </span>
            <span className="bg-surface-container-lowest text-secondary px-5 py-2 rounded-full font-bold text-sm">
              校内骑手接单
            </span>
          </div>
        </div>
        <div className="absolute -right-4 -bottom-2 w-48 h-48 z-0">
          <img
            src="./images/remote-25-49085412aa.png"
            alt="Mascot"
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      <StatusNote
        loading={remote.loading}
        error={remote.error || actionError}
        source={currentSource}
        message={actionMessage}
      />

      <section className="bg-surface-container-lowest rounded-lg p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-on-surface">发布代取</h3>
          <span className="text-xs font-bold text-primary bg-primary-container/15 px-3 py-1 rounded-full">
            发布后立即出现在待接单列表
          </span>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <input
              className="bg-surface-container-low rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-primary"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="例如：奶茶代取"
            />
            <input
              className="bg-surface-container-low rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-primary"
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              placeholder="送到哪里"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <input
              className="bg-surface-container-low rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-primary"
              value={reward}
              onChange={(event) => setReward(event.target.value)}
              placeholder="赏金，如 4.5"
            />
            <input
              className="col-span-2 bg-surface-container-low rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-primary"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              placeholder="标签，用逗号分隔"
            />
          </div>
          <div className="flex gap-3">
            {(['beef', 'pizza', 'utensils'] as const).map((item) => (
              <button
                key={item}
                className={`px-4 py-3 rounded-full font-bold text-sm flex items-center gap-2 ${
                  icon === item
                    ? 'bg-primary-container text-white'
                    : 'bg-surface-container-low text-on-surface-variant'
                }`}
                type="button"
                onClick={() => setIcon(item)}
              >
                {renderOrderIcon(item)}
                {item === 'beef' ? '快餐' : item === 'pizza' ? '饮品' : '正餐'}
              </button>
            ))}
          </div>
          <button
            className="w-full bg-primary-fixed text-on-primary-fixed py-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-transform disabled:opacity-70"
            type="submit"
            disabled={submitting}
          >
            {submitting ? '发布中...' : '发布代取'}
          </button>
        </form>
      </section>

      <section className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        <div className="flex-shrink-0 bg-surface-container-highest px-6 py-3 rounded-full flex items-center gap-2 border-2 border-transparent focus-within:border-primary transition-all">
          <Search className="w-4 h-4 text-primary" />
          <input
            className="bg-transparent border-none focus:ring-0 p-0 text-sm font-medium w-32 placeholder:text-on-surface-variant/50"
            placeholder="搜索订单地点..."
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="flex-shrink-0 bg-primary-container text-white px-6 py-3 rounded-full font-bold text-sm flex items-center gap-1">
          <span>全部订单</span>
        </div>
        <div className="flex-shrink-0 bg-surface-container-low text-on-surface-variant px-6 py-3 rounded-full font-medium text-sm flex items-center gap-1">
          <span>{filteredOrders.length} 单可接</span>
        </div>
      </section>

      <section className="h-48 rounded-lg overflow-hidden relative shadow-sm">
        <img
          src="./images/remote-26-40086edf85.png"
          alt="Campus Map"
          className="w-full h-full object-cover grayscale-[0.5] brightness-[1.1]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-primary/10" />
        <div className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 bg-surface-container-lowest/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold shadow-sm flex items-center gap-2">
          <Navigation className="w-3 h-3 text-primary" />
          附近共有 {viewData.nearbyOrders} 单
        </div>
      </section>

      <section>
        <div className="flex justify-between items-end mb-4">
          <h3 className="font-headline text-2xl font-black text-on-surface">待接订单</h3>
          <span className="text-primary text-xs font-bold bg-primary-container/10 px-2 py-1 rounded-md">
            实时同步
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onClaim={() => setActionMessage(`已抢到「${order.title}」，请尽快联系发布者取餐。`)}
            />
          ))}
          {!filteredOrders.length ? (
            <div className="col-span-2 bg-surface-container-lowest p-5 rounded-lg shadow-sm text-sm text-on-surface-variant">
              当前没有匹配的代取订单，稍后再刷新看看。
            </div>
          ) : null}
        </div>
      </section>

      <section className="bg-surface-container-highest/40 p-4 rounded-lg border-l-4 border-primary-fixed">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-primary-fixed" />
          <div>
            <p className="text-xs font-bold text-on-surface">温馨提示</p>
            <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">{viewData.tip}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

const OrderCard: React.FC<{order: TakeoutOrder; onClaim: () => void}> = ({order, onClaim}) => (
  <div className="col-span-2 bg-surface-container-lowest p-5 rounded-lg shadow-sm flex flex-col gap-3">
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-secondary-container rounded-full flex items-center justify-center text-secondary">
          {renderOrderIcon(order.icon)}
        </div>
        <div>
          <h4 className="font-bold text-on-surface">{order.title}</h4>
          <p className="text-xs text-on-surface-variant font-medium">{order.destination}</p>
        </div>
      </div>
      <div className="text-right">
        <span className="text-xl font-black text-primary">{order.reward}</span>
        <p className="text-[10px] text-on-surface-variant">赏金</p>
      </div>
    </div>
    <div className="flex flex-wrap gap-2">
      {order.tags.map((tag) => (
        <span key={tag} className="bg-surface-container px-3 py-1 rounded-full text-[10px] font-bold text-on-surface-variant">
          {tag}
        </span>
      ))}
    </div>
    <button
      className="w-full bg-primary-fixed text-on-primary-fixed py-3 rounded-full font-black text-sm mt-1 hover:scale-[0.98] transition-transform"
      type="button"
      onClick={onClaim}
    >
      立即抢单
    </button>
  </div>
);

function renderOrderIcon(icon: TakeoutOrder['icon']) {
  switch (icon) {
    case 'pizza':
      return <Pizza className="w-6 h-6 fill-secondary" />;
    case 'utensils':
      return <Utensils className="w-6 h-6" />;
    default:
      return <Beef className="w-6 h-6 fill-secondary" />;
  }
}

const StatusNote: React.FC<{loading: boolean; error: string; source: 'api' | 'mock'; message: string}> = ({loading, error, message}) => {
  if (loading) {
    return <p className="text-xs font-medium text-primary">正在同步代取订单数据...</p>;
  }
  if (error) {
    return <p className="text-xs font-medium text-red-600">{error}</p>;
  }
  if (message) {
    return <p className="text-xs font-medium text-green-600">{message}</p>;
  }
  return null;
};
