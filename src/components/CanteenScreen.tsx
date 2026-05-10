import React from 'react';
import { 
  Soup, 
  IceCream, 
  Beef, 
  Croissant, 
  Navigation, 
  Map as MapIcon,
  ChevronRight
} from 'lucide-react';
import {IntegrationPendingNote} from './IntegrationPendingNote';

export const CanteenScreen: React.FC = () => {
  const [message, setMessage] = React.useState('');

  return (
    <div className="space-y-8 pt-4">
      <IntegrationPendingNote />

      {/* Hero Section */}
      <section className="relative bg-secondary-fixed-dim rounded-lg p-6 overflow-hidden flex items-center justify-between">
        <div className="relative z-10 space-y-2">
          <h2 className="text-4xl font-black text-on-secondary-fixed leading-tight">今日大口<br/><span className="text-white">吃肉优惠</span></h2>
          <p className="text-on-secondary-fixed opacity-80 font-medium">猪小厨为您精选好价</p>
          <div className="mt-4 inline-flex items-center bg-white/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
            <Beef className="w-4 h-4 text-on-secondary-fixed mr-2" />
            <span className="text-sm font-bold text-on-secondary-fixed">全场 6.8 折起</span>
          </div>
        </div>
        <div className="absolute -right-4 -bottom-6 w-48 h-48 drop-shadow-xl transform rotate-[-5deg]">
          <img 
            src="./images/remote-01-a0ffcf9007.png" 
            alt="Pig Chef Mascot" 
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      {message ? (
        <section className="rounded-lg bg-primary-container/15 px-4 py-3 text-sm font-bold text-primary">
          {message}
        </section>
      ) : null}

      {/* Specials */}
      <section className="space-y-4">
        <div className="flex items-end justify-between px-2">
          <h3 className="text-2xl font-extrabold tracking-tight">爆款推荐</h3>
          <span className="text-sm font-bold text-primary">查看更多</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button
            className="bg-surface-container-highest rounded-lg p-4 space-y-3 flex flex-col justify-between min-h-[160px] text-left active:scale-95 transition-transform"
            type="button"
            onClick={() => setMessage('招牌红烧牛肉面已加入今日午餐清单。')}
          >
            <div className="flex justify-between items-start">
              <Soup className="w-8 h-8 text-primary fill-primary" />
              <span className="bg-primary text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase">Top 1</span>
            </div>
            <div>
              <p className="text-sm font-bold opacity-60">一食堂 · 面档</p>
              <h4 className="text-lg font-black leading-tight">招牌红烧牛肉面</h4>
            </div>
            <p className="text-primary font-black text-xl">¥ 8.5 <span className="text-xs line-through opacity-40 font-normal ml-1">¥ 12</span></p>
          </button>
          <button
            className="bg-secondary-container rounded-lg p-4 space-y-3 flex flex-col justify-between min-h-[160px] text-left active:scale-95 transition-transform"
            type="button"
            onClick={() => setMessage('手作抹茶大福已加入今日午餐清单。')}
          >
            <div className="flex justify-between items-start">
              <IceCream className="w-8 h-8 text-secondary fill-secondary" />
              <span className="bg-secondary text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase">New</span>
            </div>
            <div>
              <p className="text-sm font-bold opacity-60">二食堂 · 甜品</p>
              <h4 className="text-lg font-black leading-tight">手作抹茶大福</h4>
            </div>
            <p className="text-secondary font-black text-xl">¥ 3.0 <span className="text-xs line-through opacity-40 font-normal ml-1">¥ 6</span></p>
          </button>
        </div>
      </section>

      {/* Canteen List */}
      <section className="space-y-6">
        <h3 className="text-2xl font-extrabold tracking-tight px-2">食堂折扣速递</h3>
        <CanteenCard 
          title="第一食堂 (兰园店)" 
          dist="300m" 
          status="营业中" 
          discount="7.5折" 
          items={["香辣鸡腿堡", "鸡块套餐"]} 
          icon={<Beef className="w-6 h-6 text-primary fill-primary" />}
          onAction={() => setMessage('已为你规划前往第一食堂兰园店的路线。')}
        />
        <CanteenCard 
          title="第二食堂 (梅园店)" 
          dist="850m" 
          status="爆满" 
          discount="8.0折" 
          items={["全麦吐司", "热牛奶"]} 
          icon={<Croissant className="w-6 h-6 text-secondary fill-secondary" />}
          isSecondary
          onAction={() => setMessage('已为你规划前往第二食堂梅园店的路线。')}
        />

        {/* Map Shortcut */}
        <button
          className="w-full h-32 rounded-lg bg-surface-container overflow-hidden relative border border-white/50 group cursor-pointer text-left"
          type="button"
          onClick={() => setMessage('美食地图已打开：北洋园校区 4 个食堂、2 个咖啡点营业中。')}
        >
          <img 
            src="./images/remote-02-5d43c73c54.png" 
            alt="Campus Map" 
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <span className="bg-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 transform active:scale-95 transition-all">
              <MapIcon className="w-5 h-5 text-primary" />
              <span className="font-bold text-on-surface">查看校内美食地图</span>
            </span>
          </div>
        </button>
      </section>
    </div>
  );
};

const CanteenCard: React.FC<{
  title: string;
  dist: string;
  status: string;
  discount: string;
  items: string[];
  icon: React.ReactNode;
  isSecondary?: boolean;
  onAction: () => void;
}> = ({ title, dist, status, discount, items, icon, isSecondary, onAction }) => (
  <div className="bg-surface-container-lowest rounded-lg p-5 shadow-sm space-y-4">
    <div className="flex justify-between items-start">
      <div className="flex gap-4 items-center">
        <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${isSecondary ? 'bg-secondary-container/30' : 'bg-surface-container'}`}>
          {icon}
        </div>
        <div>
          <h4 className="text-xl font-bold">{title}</h4>
          <p className="text-xs text-on-surface-variant font-medium">距离 {dist} · {status}</p>
        </div>
      </div>
      <div className="bg-error-container/10 text-error-container font-black px-3 py-1 rounded-full text-sm">
        {discount}
      </div>
    </div>
    <div className="bg-surface-container-low rounded-lg p-3 flex justify-between items-center">
      <div className="flex gap-2">
        {items.map(item => (
          <span key={item} className={`bg-white px-2 py-1 rounded text-[10px] font-bold ${isSecondary ? 'text-secondary' : 'text-primary'}`}>{item}</span>
        ))}
      </div>
      <button
        className={`flex items-center font-bold text-sm active:scale-95 ${isSecondary ? 'text-secondary' : 'text-primary'}`}
        type="button"
        onClick={onAction}
      >
        去食堂 <Navigation className="w-4 h-4 ml-1 fill-current" />
      </button>
    </div>
  </div>
);
