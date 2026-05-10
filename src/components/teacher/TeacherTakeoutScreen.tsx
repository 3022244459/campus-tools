import React from 'react';
import {Bike, ChevronRight, Coffee, Headset, History, MapPin, Utensils} from 'lucide-react';
import {fetchTakeout, submitTakeout} from '../../lib/api';
import {emptyTakeoutData} from '../../lib/emptyData';
import {useRemoteData} from '../../lib/useRemoteData';
import type {AuthSession, TakeoutData, TakeoutOrder} from '../../lib/types';

interface TeacherTakeoutScreenProps {
  session: AuthSession;
}

export const TeacherTakeoutScreen: React.FC<TeacherTakeoutScreenProps> = ({session}) => {
  const {data, loading, error, source} = useRemoteData<TakeoutData>(
    session,
    emptyTakeoutData,
    fetchTakeout,
  );
  const [viewData, setViewData] = React.useState<TakeoutData>(data);
  const [message, setMessage] = React.useState('');
  const [formOpen, setFormOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [title, setTitle] = React.useState('教工食堂午餐代取');
  const [destination, setDestination] = React.useState('送到 卫津路校区 行政楼 302');
  const [reward, setReward] = React.useState('6');
  const [tags, setTags] = React.useState('工作餐, 20分钟内');

  React.useEffect(() => {
    setViewData(data);
  }, [data]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const result = await submitTakeout(session, {
        title,
        destination,
        reward,
        tags: tags.split(/[,，]/).map((item) => item.trim()).filter(Boolean).slice(0, 3),
        icon: 'utensils',
      }, viewData);
      setViewData(result.data);
      setFormOpen(false);
      setMessage('外卖代取已发布，学生端待接单列表可见，学生抢单送达后会自动结算赏金。');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '外卖代取发布失败，请稍后重试。');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8 pt-4 pb-20">
      <section className="relative overflow-hidden bg-secondary-fixed-dim rounded-xl p-8 shadow-lg min-h-[220px]">
        <div className="relative z-10 space-y-4 max-w-[60%]">
          <h2 className="text-3xl font-extrabold text-on-secondary-fixed leading-tight whitespace-pre-line">
            {viewData.heroTitle.replace(' ', '\n')}
          </h2>
          <p className="text-on-secondary-fixed/80 text-sm font-medium">{viewData.heroDescription}</p>
          <div className="flex gap-3 pt-2">
            <button
              className="bg-primary-fixed text-on-primary-fixed px-6 py-3 rounded-full font-bold text-sm shadow-md active:scale-95 transition-transform"
              type="button"
              onClick={() => setFormOpen((current) => !current)}
            >
              立即下单
            </button>
            <button
              className="bg-surface-container-lowest/30 backdrop-blur-md text-on-secondary-fixed border border-on-secondary-fixed/10 px-6 py-3 rounded-full font-bold text-sm active:scale-95 transition-transform"
              type="button"
              onClick={() => setMessage('已打开最近 7 天代取历史。')}
            >
              代取历史
            </button>
          </div>
        </div>
        <div className="absolute -right-4 -bottom-4 w-48 h-48 opacity-90 transition-transform hover:scale-110 duration-500">
          <img
            src="./images/remote-42-6ce3af324f.png"
            alt="Delivery Shiba"
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      <StatusNote loading={loading} error={error} source={source} />
      {message ? (
        <section className="rounded-lg bg-primary-container/15 px-4 py-3 text-sm font-bold text-primary">
          {message}
        </section>
      ) : null}

      {formOpen ? (
        <section className="rounded-xl bg-surface-container-lowest p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-on-surface">填写外卖代取信息</h3>
            <span className="rounded-full bg-primary-container/15 px-3 py-1 text-xs font-bold text-primary">学生可接单</span>
          </div>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <input className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="外卖内容" />
            <input className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary" value={destination} onChange={(event) => setDestination(event.target.value)} placeholder="送达地点" />
            <div className="grid grid-cols-3 gap-3">
              <input className="rounded-xl bg-surface-container-low px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary" value={reward} onChange={(event) => setReward(event.target.value)} inputMode="decimal" placeholder="赏金" />
              <input className="col-span-2 rounded-xl bg-surface-container-low px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary" value={tags} onChange={(event) => setTags(event.target.value)} placeholder="标签" />
            </div>
            <button className="w-full rounded-xl bg-primary-fixed py-4 text-sm font-black text-on-primary-fixed active:scale-95 disabled:opacity-60" type="submit" disabled={submitting}>
              {submitting ? '发布中...' : '发布到学生端'}
            </button>
          </form>
        </section>
      ) : null}

      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="text-2xl font-bold text-on-surface">实时代取地图</h3>
          <button
            className="text-primary font-bold text-sm cursor-pointer active:scale-95"
            type="button"
            onClick={() => setMessage(`附近共有 ${viewData.nearbyOrders} 单可查看。`)}
          >
            附近 {viewData.nearbyOrders} 单
          </button>
        </div>
        <div className="relative w-full h-64 rounded-lg overflow-hidden bg-surface-container shadow-inner border-4 border-white">
          <img
            src="./images/remote-43-c1583d2c9e.png"
            alt="Campus Map"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-1/4 left-1/3 bg-white p-2 rounded-full shadow-lg border-2 border-primary-fixed animate-bounce">
            <Utensils className="w-5 h-5 text-primary-fixed fill-primary-fixed" />
          </div>
          <div className="absolute bottom-1/3 right-1/4 bg-white p-2 rounded-full shadow-lg border-2 border-secondary">
            <Coffee className="w-5 h-5 text-secondary fill-secondary" />
          </div>
          <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-lg p-4 flex items-center justify-between border border-white/40 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
                <Bike className="w-6 h-6 text-on-secondary-container" />
              </div>
              <div>
                <p className="text-xs text-on-surface-variant font-bold">推荐跑腿员</p>
                <p className="text-sm font-bold">距离您 450 米</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-primary-fixed" />
          </div>
        </div>
      </section>

      <section className="space-y-4 pb-10">
        <h3 className="text-2xl font-bold text-on-surface">外卖动态</h3>
        <div className="grid grid-cols-2 gap-4">
          {viewData.orders.map((order, index) => (
            <OrderCard key={order.id} order={order} featured={index === 0} />
          ))}
          <button
            className="bg-white rounded-lg p-5 shadow-sm active:scale-95 transition-transform cursor-pointer text-left"
            type="button"
            onClick={() => setMessage('常点套餐已加入订单。')}
          >
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3">
              <History className="w-6 h-6 text-primary-fixed" />
            </div>
            <p className="font-bold">常点套餐</p>
            <p className="text-[10px] text-on-surface-variant">一键下单更快捷</p>
          </button>
          <button
            className="bg-white rounded-lg p-5 shadow-sm active:scale-95 transition-transform cursor-pointer text-left"
            type="button"
            onClick={() => setMessage('客服会话已打开。')}
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <Headset className="w-6 h-6 text-secondary" />
            </div>
            <p className="font-bold">联系客服</p>
            <p className="text-[10px] text-on-surface-variant">遇到问题点这里</p>
          </button>
        </div>
      </section>
    </div>
  );
};

const OrderCard: React.FC<{order: TakeoutOrder; featured?: boolean}> = ({order, featured}) => {
  if (featured) {
    return (
      <div className="col-span-2 bg-surface-container-low rounded-lg p-6 flex flex-col justify-between h-48 relative overflow-hidden group">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">进行中</span>
            <span className="text-on-surface-variant text-xs">{order.tags[1] ?? '预计 30 分钟送达'}</span>
          </div>
          <h4 className="text-xl font-bold">{order.title}</h4>
          <p className="text-on-surface-variant text-sm mt-1">{order.destination}</p>
          <div className="flex items-center gap-2 mt-3 text-xs text-primary font-bold">
            <MapPin className="w-4 h-4" />
            {order.tags[0] ?? '校内取餐'}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-surface-container-highest rounded-full h-2">
            <div className="bg-primary-fixed h-full w-2/3 rounded-full" />
          </div>
          <span className="text-xs font-bold text-primary">{order.reward}</span>
        </div>
        <Utensils className="absolute -right-4 top-1/2 -translate-y-1/2 w-32 h-32 text-on-surface opacity-5 group-hover:scale-110 transition-transform" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-5 shadow-sm">
      <p className="font-bold">{order.title}</p>
      <p className="text-[10px] text-on-surface-variant mt-2">{order.destination}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {order.tags.map((tag) => (
          <span key={tag} className="px-2 py-1 rounded-full bg-surface-container-low text-[10px] font-bold text-on-surface-variant">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

const StatusNote: React.FC<{loading: boolean; error: string; source: 'api' | 'mock'}> = ({loading, error}) => {
  if (loading) {
    return <p className="text-xs font-medium text-primary">正在同步教师代取数据...</p>;
  }
  if (error) {
    return <p className="text-xs font-medium text-red-600">{error}</p>;
  }
  return null;
};
