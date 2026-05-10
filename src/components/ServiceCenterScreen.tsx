import React from 'react';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Clock,
  Compass,
  CreditCard,
  Droplets,
  Package,
  School,
  Search,
  SearchCheck,
  ShoppingBag,
  Truck,
  Users,
  Wallet,
  Wrench,
  Zap,
} from 'lucide-react';
import {fetchServiceCenter} from '../lib/api';
import {emptyServiceCenterData} from '../lib/emptyData';
import {useRemoteData} from '../lib/useRemoteData';
import type {AuthSession, ServiceCenterData} from '../lib/types';

interface ServiceCenterProps {
  onNavigate: (screen: string) => void;
  session: AuthSession;
}

export const ServiceCenterScreen: React.FC<ServiceCenterProps> = ({onNavigate, session}) => {
  const {data, loading, error, source} = useRemoteData<ServiceCenterData>(session, emptyServiceCenterData, fetchServiceCenter);
  const [query, setQuery] = React.useState('');

  return (
    <div className="space-y-8 pt-4">
      <section className="relative">
        <div className="flex items-center bg-surface-container-low rounded-xl px-4 py-3 gap-3">
          <Search className="w-5 h-5 text-outline" />
          <input
            className="bg-transparent border-none focus:ring-0 text-on-surface placeholder-on-surface-variant w-full font-medium"
            placeholder="搜索校内服务..."
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </section>

      <StatusNote loading={loading} error={error} source={source} />

      <section className="relative bg-secondary-fixed-dim rounded-lg p-6 overflow-hidden min-h-[160px] flex flex-col justify-between shadow-sm">
        <div className="absolute right-[-10%] top-[-10%] opacity-20 pointer-events-none">
          <School className="w-32 h-32 text-on-secondary-container" />
        </div>
        <div className="relative z-10">
          <span className="bg-primary text-on-primary px-3 py-1 rounded-full text-xs font-bold mb-3 inline-block">{data.heroLabel}</span>
          <h2 className="text-on-secondary-container text-xl font-bold leading-tight">{data.heroTitle}</h2>
        </div>
        <div className="flex items-center gap-2 mt-4 relative z-10">
          <div className="w-2 h-2 rounded-full bg-primary-container"></div>
          <p className="text-on-secondary-container text-sm font-medium">{data.heroCaption}</p>
        </div>
        <img
          src="./images/remote-23-39efd26e11.png"
          alt="Campus View"
          className="absolute right-4 bottom-4 w-24 h-24 object-cover rounded-lg opacity-80 mix-blend-multiply"
          referrerPolicy="no-referrer"
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h3 className="text-on-surface font-bold text-xl">生活服务</h3>
          <span className="text-on-surface-variant text-xs uppercase tracking-wider">Daily Life</span>
        </div>
        <div className="grid grid-cols-4 gap-y-6">
          <ServiceIcon icon={<Package className="w-7 h-7" />} label="快递服务" onClick={() => onNavigate('courier')} />
          <ServiceIcon icon={<Truck className="w-7 h-7" />} label="美食外卖" onClick={() => onNavigate('canteen')} />
          <ServiceIcon icon={<Wrench className="w-7 h-7" />} label="报修中心" onClick={() => onNavigate('repair')} />
          <ServiceIcon icon={<SearchCheck className="w-7 h-7" />} label="失物招领" onClick={() => onNavigate('lost-found')} />
          <ServiceIcon icon={<Users className="w-7 h-7" />} label="校园社团" onClick={() => onNavigate('clubs')} />
          <ServiceIcon icon={<Compass className="w-7 h-7" />} label="校园导航" onClick={() => onNavigate('map')} />
          <ServiceIcon icon={<ShoppingBag className="w-7 h-7" />} label="食堂惠购" onClick={() => onNavigate('canteen')} />
          <ServiceIcon icon={<Briefcase className="w-7 h-7" />} label="校园兼职" onClick={() => onNavigate('jobs')} />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h3 className="text-on-surface font-bold text-xl">生活缴费</h3>
          <span className="text-on-surface-variant text-xs uppercase tracking-wider">Utilities</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container-low rounded-lg p-5 flex flex-col gap-4 relative overflow-hidden cursor-pointer" onClick={() => onNavigate('water')}>
            <div className="flex flex-col">
              <span className="text-primary-container font-bold text-lg">水费缴纳</span>
              <span className="text-on-surface-variant text-xs">宿舍饮水与洗浴</span>
            </div>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary-container shadow-sm self-start">
              <Droplets className="w-6 h-6 fill-primary-container" />
            </div>
            <Droplets className="absolute -right-4 -bottom-4 w-24 h-24 text-primary-container/10 rotate-12" />
          </div>
          <div className="space-y-4">
            <div className="bg-surface-container-highest rounded-lg p-4 flex items-center justify-between group cursor-pointer" onClick={() => onNavigate('electricity')}>
              <div className="flex flex-col">
                <span className="text-on-background font-bold">电费充值</span>
                <span className="text-[10px] text-on-surface-variant">Electricity</span>
              </div>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary-container shadow-sm">
                <Zap className="w-5 h-5 fill-primary-container" />
              </div>
            </div>
            <div className="bg-secondary-container rounded-lg p-4 flex items-center justify-between group cursor-pointer" onClick={() => onNavigate('wallet')}>
              <div className="flex flex-col">
                <span className="text-on-secondary-container font-bold">校园卡</span>
                <span className="text-[10px] text-on-secondary-container/60">Card Recharge</span>
              </div>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-secondary shadow-sm">
                <CreditCard className="w-5 h-5 fill-secondary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h3 className="text-on-surface font-bold text-xl">校园资讯</h3>
          <span className="text-on-surface-variant text-xs uppercase tracking-wider">Campus Info</span>
        </div>
        <div className="grid grid-cols-12 grid-rows-2 gap-4 h-64">
          <div className="col-span-7 row-span-2 bg-surface-container rounded-lg p-5 flex flex-col justify-between relative overflow-hidden cursor-pointer" onClick={() => onNavigate('courier-compare')}>
            <div>
              <h4 className="text-primary font-bold text-lg">{data.infoCards[0]?.title ?? '比价中心'}</h4>
              <p className="text-on-surface-variant text-xs mt-1">{data.infoCards[0]?.description ?? '校内快递价格一手掌握'}</p>
            </div>
            <div className="flex items-center gap-2 bg-white/50 backdrop-blur rounded-full px-3 py-1 w-fit">
              <span className="text-[10px] font-bold text-primary">立即查看</span>
              <ArrowRight className="w-3 h-3 text-primary" />
            </div>
            <Wallet className="absolute right-2 bottom-2 w-32 h-32 text-primary/10" />
          </div>
          <button
            className="col-span-5 row-span-1 bg-tertiary-container rounded-lg p-4 flex items-center gap-3 text-left active:scale-95 transition-transform"
            type="button"
            onClick={() => window.alert('空闲教室：第 26 教学楼 B206、B312 当前可用。')}
          >
            <div className="w-10 h-10 bg-white/40 rounded-full flex items-center justify-center text-tertiary">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-on-tertiary-container font-bold text-sm">{data.infoCards[1]?.title ?? '空闲教室'}</span>
          </button>
          <button
            className="col-span-5 row-span-1 bg-surface-container-highest rounded-lg p-4 flex items-center gap-3 text-left active:scale-95 transition-transform"
            type="button"
            onClick={() => window.alert('校车时间：北洋园校区 18:30 发车，卫津路校区 19:10 返回。')}
          >
            <div className="w-10 h-10 bg-white/40 rounded-full flex items-center justify-center text-primary">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-on-primary-fixed-variant font-bold text-sm">{data.infoCards[2]?.title ?? '校车时间'}</span>
          </button>
        </div>
      </section>

      <section className="flex bg-surface-container-lowest rounded-lg p-6 items-center gap-6 border-outline-variant/15 border-2">
        <div className="flex-shrink-0 relative">
          <div className="w-16 h-16 rounded-full bg-secondary-fixed flex items-center justify-center overflow-hidden">
            <img src="./images/remote-24-9adc354462.png" alt="Koala" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="absolute -top-2 -right-2 bg-error-container text-white text-[10px] px-2 py-0.5 rounded-full font-bold">New!</div>
        </div>
        <div>
          <p className="text-on-surface font-medium leading-snug">{data.assistantMessage}</p>
          <button
            className="text-primary font-bold text-sm mt-2 flex items-center gap-1"
            type="button"
            onClick={() => window.alert('今日贴士：北洋园校区图书馆 4 楼自习座位较充足。')}
          >
            获取今日校园贴士
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};

const ServiceIcon: React.FC<{icon: React.ReactNode; label: string; onClick: () => void}> = ({icon, label, onClick}) => (
  <button className="flex flex-col items-center gap-2 group cursor-pointer" onClick={onClick} type="button">
    <div className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center text-primary transition-transform group-active:scale-90 shadow-sm">
      {icon}
    </div>
    <span className="text-on-surface text-xs font-medium">{label}</span>
  </button>
);

const StatusNote: React.FC<{loading: boolean; error: string; source: 'api' | 'mock'}> = ({loading, error}) => {
  if (loading) {
    return <p className="text-xs font-medium text-primary">正在同步服务中心数据...</p>;
  }
  if (error) {
    return <p className="text-xs font-medium text-red-600">{error}</p>;
  }
  return null;
};
