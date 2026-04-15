import React from 'react';
import { 
  Droplets, 
  Zap, 
  History, 
  ChevronRight, 
  Calendar,
  Bath,
  Edit2,
  ArrowRight
} from 'lucide-react';

export const WaterRechargeScreen: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 pt-4">
      {/* Hero Section */}
      <section className="relative">
        <div className="bg-secondary-container rounded-lg p-8 overflow-hidden relative min-h-[220px] flex flex-col justify-end">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary-fixed-dim opacity-30 rounded-full"></div>
          <div className="absolute top-12 right-12 w-8 h-8 bg-white opacity-20 rounded-full"></div>
          
          <div className="absolute right-0 bottom-0 w-48 h-48 translate-x-4 translate-y-4">
            <img 
              src="./images/remote-45-43d9591fec.png" 
              alt="Otter Mascot" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="relative z-10">
            <p className="text-on-secondary-container font-semibold text-sm opacity-80 mb-1">当前热水余额 (元)</p>
            <h2 className="text-on-secondary-container font-headline font-extrabold text-5xl tracking-tight">42.50</h2>
          </div>
        </div>
        <div className="absolute -bottom-3 left-12 w-10 h-10 bg-secondary-fixed shadow-lg rounded-full flex items-center justify-center border-4 border-background">
          <Droplets className="w-5 h-5 text-on-secondary-fixed fill-on-secondary-fixed" />
        </div>
      </section>

      {/* Quick Top-up */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="font-headline font-bold text-2xl text-on-surface">快速充值</h3>
            <p className="text-on-surface-variant text-sm">选择充值金额，即刻享受热水</p>
          </div>
          <Zap className="w-8 h-8 text-primary-fixed fill-primary-fixed" />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {[10, 20, 50, 100, 200].map((amount) => (
            <button 
              key={amount}
              className={`py-6 rounded-lg flex flex-col items-center justify-center transition-all active:scale-95 ${
                amount === 20 ? 'bg-primary-container shadow-lg shadow-primary-container/20' : 'bg-surface-container-highest border-2 border-transparent hover:border-primary'
              }`}
            >
              <span className={`text-xs mb-1 font-bold ${amount === 20 ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>¥</span>
              <span className={`font-headline font-bold text-2xl ${amount === 20 ? 'text-on-primary-container' : 'text-on-surface'}`}>{amount}</span>
            </button>
          ))}
          <button className="bg-surface-container-low border-2 border-dashed border-outline-variant py-6 rounded-lg flex flex-col items-center justify-center active:scale-95">
            <Edit2 className="w-5 h-5 text-on-surface-variant mb-1" />
            <span className="text-on-surface-variant font-bold text-xs">自定义</span>
          </button>
        </div>

        <button className="w-full mt-8 bg-primary text-white font-headline font-bold py-5 rounded-xl text-lg flex items-center justify-center gap-2 shadow-xl shadow-primary/10 hover:bg-primary-dim transition-colors active:scale-[0.98]">
          立即充值
          <ArrowRight className="w-5 h-5" />
        </button>
      </section>

      {/* Usage History */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-headline font-bold text-2xl text-on-surface">用水记录</h3>
          <button className="text-primary font-bold text-sm flex items-center gap-1">
            查看全部
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container-low p-5 rounded-lg flex flex-col gap-3 relative overflow-hidden group">
            <div className="absolute -right-2 -top-2 w-12 h-12 bg-secondary-container/20 rounded-full group-hover:scale-150 transition-transform"></div>
            <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center">
              <Calendar className="w-5 h-5 text-on-secondary-fixed" />
            </div>
            <div>
              <p className="text-on-surface-variant text-xs font-semibold">昨日消耗</p>
              <p className="text-on-surface font-headline font-bold text-xl">¥ 3.50</p>
            </div>
          </div>
          
          <div className="bg-surface-container-low p-5 rounded-lg flex flex-col gap-3 relative overflow-hidden group">
            <div className="absolute -right-2 -top-2 w-12 h-12 bg-primary-container/20 rounded-full group-hover:scale-150 transition-transform"></div>
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
              <History className="w-5 h-5 text-on-primary-fixed" />
            </div>
            <div>
              <p className="text-on-surface-variant text-xs font-semibold">平均每日</p>
              <p className="text-on-surface font-headline font-bold text-xl">¥ 4.20</p>
            </div>
          </div>

          <div className="col-span-2 bg-surface-container-lowest p-5 rounded-lg flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-primary">
                <Bath className="w-6 h-6" />
              </div>
              <div>
                <p className="text-on-surface font-bold">1号宿舍楼 302室</p>
                <p className="text-on-surface-variant text-xs">2023-10-24 19:45</p>
              </div>
            </div>
            <p className="text-on-surface font-headline font-bold text-lg">- ¥ 2.80</p>
          </div>
        </div>
      </section>
    </div>
  );
};
