import React from 'react';
import { 
  MapPin, 
  ChevronRight, 
  Bike, 
  Utensils, 
  Coffee, 
  Clock,
  Headset,
  History
} from 'lucide-react';

export const TeacherTakeoutScreen: React.FC = () => {
  return (
    <div className="space-y-8 pt-4 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-secondary-fixed-dim rounded-xl p-8 shadow-lg min-h-[220px]">
        <div className="relative z-10 space-y-4 max-w-[60%]">
          <h2 className="text-3xl font-extrabold text-on-secondary-fixed leading-tight">卧龙校区<br/>外卖代取服务</h2>
          <p className="text-on-secondary-fixed/80 text-sm font-medium">老师您辛苦了！让可爱的柴犬为您跑腿，美味即刻送达办公室。</p>
          <div className="flex gap-3 pt-2">
            <button className="bg-primary-fixed text-on-primary-fixed px-6 py-3 rounded-full font-bold text-sm shadow-md active:scale-95 transition-transform">
              立即下单
            </button>
            <button className="bg-surface-container-lowest/30 backdrop-blur-md text-on-secondary-fixed border border-on-secondary-fixed/10 px-6 py-3 rounded-full font-bold text-sm active:scale-95 transition-transform">
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

      {/* Interactive Map Preview */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="text-2xl font-bold text-on-surface">实时代取地图</h3>
          <span className="text-primary font-bold text-sm cursor-pointer">查看全部点位</span>
        </div>
        <div className="relative w-full h-64 rounded-lg overflow-hidden bg-surface-container shadow-inner border-4 border-white">
          <img 
            src="./images/remote-43-c1583d2c9e.png" 
            alt="Campus Map" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Delivery Points */}
          <div className="absolute top-1/4 left-1/3 bg-white p-2 rounded-full shadow-lg border-2 border-primary-fixed animate-bounce">
            <Utensils className="w-5 h-5 text-primary-fixed fill-primary-fixed" />
          </div>
          <div className="absolute bottom-1/3 right-1/4 bg-white p-2 rounded-full shadow-lg border-2 border-secondary">
            <Coffee className="w-5 h-5 text-secondary fill-secondary" />
          </div>
          {/* Float Card */}
          <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-lg p-4 flex items-center justify-between border border-white/40 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
                <Bike className="w-6 h-6 text-on-secondary-container" />
              </div>
              <div>
                <p className="text-xs text-on-surface-variant font-bold">最近跑腿员</p>
                <p className="text-sm font-bold">距离您 450米</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-primary-fixed" />
          </div>
        </div>
      </section>

      {/* Bento Grid for Active Orders & Actions */}
      <section className="space-y-4 pb-10">
        <h3 className="text-2xl font-bold text-on-surface">外卖动态</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Large Active Order Card */}
          <div className="col-span-2 bg-surface-container-low rounded-lg p-6 flex flex-col justify-between h-48 relative overflow-hidden group">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">进行中</span>
                <span className="text-on-surface-variant text-xs">预计 12:30 送达</span>
              </div>
              <h4 className="text-xl font-bold">教工食堂 A区 - 3号窗</h4>
              <p className="text-on-surface-variant text-sm mt-1">红烧肉套餐 + 冰可乐</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-surface-container-highest rounded-full h-2">
                <div className="bg-primary-fixed h-full w-2/3 rounded-full"></div>
              </div>
              <span className="text-xs font-bold text-primary">已取餐</span>
            </div>
            <Utensils className="absolute -right-4 top-1/2 -translate-y-1/2 w-32 h-32 text-on-surface opacity-5 group-hover:scale-110 transition-transform" />
          </div>
          {/* Small Action Cards */}
          <div className="bg-white rounded-lg p-5 shadow-sm active:scale-95 transition-transform cursor-pointer">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3">
              <History className="w-6 h-6 text-primary-fixed" />
            </div>
            <p className="font-bold">常点套餐</p>
            <p className="text-[10px] text-on-surface-variant">一键下单更快捷</p>
          </div>
          <div className="bg-white rounded-lg p-5 shadow-sm active:scale-95 transition-transform cursor-pointer">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <Headset className="w-6 h-6 text-secondary" />
            </div>
            <p className="font-bold">联系客服</p>
            <p className="text-[10px] text-on-surface-variant">遇到问题点这里</p>
          </div>
        </div>
      </section>
    </div>
  );
};
