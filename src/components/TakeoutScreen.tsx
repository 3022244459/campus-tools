import React from 'react';
import { 
  Search, 
  Utensils, 
  Pizza, 
  Beef, 
  Info, 
  Navigation,
  ChevronRight
} from 'lucide-react';

export const TakeoutScreen: React.FC = () => {
  return (
    <div className="space-y-6 pt-4">
      {/* Hero Section */}
      <section className="relative bg-secondary-fixed-dim overflow-hidden rounded-lg p-6 flex flex-col justify-between min-h-[200px] shadow-sm">
        <div className="relative z-20 max-w-[60%]">
          <h2 className="font-headline text-3xl font-extrabold text-on-secondary-fixed leading-tight">全校代取<br/>极速达</h2>
          <p className="font-body text-sm mt-2 text-on-secondary-fixed-variant opacity-80">校内同学接单，安全又快捷</p>
          <div className="mt-4 flex gap-2">
            <button className="bg-primary-fixed text-on-primary-fixed px-5 py-2 rounded-full font-bold text-sm hover:scale-95 transition-transform">发布代取</button>
            <button className="bg-surface-container-lowest text-secondary px-5 py-2 rounded-full font-bold text-sm hover:scale-95 transition-transform">我要求职</button>
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

      {/* Search & Filter */}
      <section className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        <div className="flex-shrink-0 bg-surface-container-highest px-6 py-3 rounded-full flex items-center gap-2 border-2 border-transparent focus-within:border-primary transition-all">
          <Search className="w-4 h-4 text-primary" />
          <input className="bg-transparent border-none focus:ring-0 p-0 text-sm font-medium w-32 placeholder:text-on-surface-variant/50" placeholder="搜索目的地..." type="text"/>
        </div>
        <div className="flex-shrink-0 bg-primary-container text-white px-6 py-3 rounded-full font-bold text-sm flex items-center gap-1">
          <span>全部订单</span>
        </div>
        <div className="flex-shrink-0 bg-surface-container-low text-on-surface-variant px-6 py-3 rounded-full font-medium text-sm flex items-center gap-1">
          <span>距离最近</span>
        </div>
      </section>

      {/* Map Preview */}
      <section className="h-48 rounded-lg overflow-hidden relative shadow-sm">
        <img 
          src="./images/remote-26-40086edf85.png" 
          alt="Campus Map" 
          className="w-full h-full object-cover grayscale-[0.5] brightness-[1.1]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-primary/10"></div>
        <div className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 bg-surface-container-lowest/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold shadow-sm">
          附近有 12 个订单
        </div>
      </section>

      {/* Order List */}
      <section>
        <div className="flex justify-between items-end mb-4">
          <h3 className="font-headline text-2xl font-black text-on-surface">待接订单</h3>
          <span className="text-primary text-xs font-bold bg-primary-container/10 px-2 py-1 rounded-md">查看全部</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 bg-surface-container-lowest p-5 rounded-lg shadow-sm flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-secondary-container rounded-full flex items-center justify-center text-secondary">
                  <Beef className="w-6 h-6 fill-secondary" />
                </div>
                <div>
                  <h4 className="font-bold text-on-surface">一号食堂代取</h4>
                  <p className="text-xs text-on-surface-variant font-medium">送到 12号宿舍楼 A区</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-primary">¥5.0</span>
                <p className="text-[10px] text-on-surface-variant">赏金</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="bg-surface-container px-3 py-1 rounded-full text-[10px] font-bold text-on-surface-variant">汉堡套餐</span>
              <span className="bg-surface-container px-3 py-1 rounded-full text-[10px] font-bold text-on-surface-variant">30分钟内</span>
            </div>
            <button className="w-full bg-primary-fixed text-on-primary-fixed py-3 rounded-full font-black text-sm mt-1 hover:scale-[0.98] transition-transform">立即抢单</button>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="bg-surface-container-highest/40 p-4 rounded-lg border-l-4 border-primary-fixed">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-primary-fixed" />
          <div>
            <p className="text-xs font-bold text-on-surface">温馨提示</p>
            <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">取餐时请核对订单号，确保外卖包装完好。遇到问题请及时联系发布者或平台客服。</p>
          </div>
        </div>
      </section>
    </div>
  );
};
