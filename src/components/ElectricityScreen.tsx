import React from 'react';
import { 
  Zap, 
  BarChart3, 
  Wallet, 
  BellRing, 
  History, 
  ChevronRight,
  Lightbulb
} from 'lucide-react';

export const ElectricityScreen: React.FC = () => {
  return (
    <div className="space-y-8 pt-4">
      {/* Hero Section */}
      <section className="relative">
        <div className="bg-primary-container rounded-lg p-8 shadow-lg overflow-hidden relative">
          <div className="absolute -right-4 -top-8 w-40 h-40 transform rotate-12">
            <img 
              src="./images/remote-11-4fa958baef.png" 
              alt="Electric Mascot" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="relative z-10">
            <p className="font-headline font-bold text-on-primary-container/70 text-sm tracking-wider uppercase">Dormitory 402</p>
            <h2 className="font-headline font-extrabold text-white text-5xl mt-2 tracking-tight">36.50 <span className="text-xl">度</span></h2>
            <p className="text-white/90 font-medium mt-1">当前剩余电量</p>
            <div className="mt-8">
              <button className="bg-on-background text-white px-8 py-3 rounded-xl font-bold text-sm transition-transform active:scale-95">
                立即缴费
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Chart */}
      <section className="grid grid-cols-2 gap-4">
        <div className="col-span-2 bg-surface-container-lowest rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h3 className="font-headline font-bold text-on-surface text-xl">用电趋势</h3>
              <p className="text-on-surface-variant text-xs">最近 7 天用电情况 (kWh)</p>
            </div>
            <div className="flex items-center gap-1 text-primary font-bold">
              <span className="text-xs">详情</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
          
          <div className="flex items-end justify-between h-32 gap-2 px-2">
            {[40, 65, 50, 85, 45, 90, 70].map((h, i) => (
              <div 
                key={i} 
                className={`w-full rounded-t-lg transition-all hover:bg-primary-container ${i === 6 ? 'bg-primary-container' : 'bg-secondary-fixed-dim'}`}
                style={{ height: `${h}%` }}
              ></div>
            ))}
          </div>
          <div className="flex justify-between mt-2 px-1">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
              <span key={d} className={`text-[10px] font-bold ${i === 6 ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>{d}</span>
            ))}
          </div>
        </div>

        <div className="bg-secondary-container rounded-lg p-5 flex flex-col justify-between">
          <Zap className="w-8 h-8 text-on-secondary-container mb-4 fill-on-secondary-container" />
          <div>
            <p className="text-on-secondary-container/80 text-xs font-bold">今日已用</p>
            <h4 className="text-on-secondary-container font-headline font-extrabold text-2xl">4.2 <span className="text-sm">度</span></h4>
          </div>
        </div>

        <div className="bg-surface-container-high rounded-lg p-5 flex flex-col justify-between border-2 border-transparent hover:border-primary/20 transition-all">
          <Wallet className="w-8 h-8 text-primary mb-4 fill-primary" />
          <div>
            <p className="text-on-surface-variant text-xs font-bold">上月电费</p>
            <h4 className="text-on-surface font-headline font-extrabold text-2xl">¥128.0</h4>
          </div>
        </div>
      </section>

      {/* Settings */}
      <section className="space-y-4">
        <h3 className="font-headline font-bold text-on-surface text-lg px-2">功能设置</h3>
        <div className="bg-surface-container-low rounded-lg divide-y divide-outline-variant/10">
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-error-container/20 rounded-full flex items-center justify-center">
                <BellRing className="w-5 h-5 text-error fill-error" />
              </div>
              <div>
                <p className="font-bold text-on-surface">低电量提醒</p>
                <p className="text-xs text-on-surface-variant">低于 5 度时自动通知</p>
              </div>
            </div>
            <div className="w-12 h-6 bg-primary-container rounded-full relative p-1 cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-secondary-container/30 rounded-full flex items-center justify-center">
                <History className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="font-bold text-on-surface">缴费记录</p>
                <p className="text-xs text-on-surface-variant">查看近半年的充值详情</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-on-surface-variant" />
          </div>
        </div>
      </section>

      {/* Tip */}
      <section className="bg-secondary-fixed-dim/40 rounded-lg p-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-5 h-5 text-secondary fill-secondary" />
            <span className="font-bold text-secondary text-sm">省电小贴士</span>
          </div>
          <p className="text-on-secondary-container text-sm leading-relaxed">
            晚上 11 点后关闭宿舍大灯和显示器，每月可节省约 <span className="font-extrabold">12.5%</span> 的电费哦！
          </p>
        </div>
        <Lightbulb className="absolute right-0 bottom-0 w-32 h-32 opacity-20 transform translate-x-4 translate-y-4" />
      </section>
    </div>
  );
};
