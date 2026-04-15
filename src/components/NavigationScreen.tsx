import React from 'react';
import { 
  Search, 
  Map as MapIcon, 
  School, 
  Pizza, 
  MapPin, 
  Navigation,
  Footprints,
  BookOpen,
  Zap,
  ChevronRight
} from 'lucide-react';

export const NavigationScreen: React.FC = () => {
  return (
    <div className="space-y-6 pt-4">
      {/* Hero Section */}
      <section className="relative">
        <div className="bg-secondary-container rounded-lg p-6 flex items-center justify-between overflow-hidden">
          <div className="z-10 max-w-[60%]">
            <h2 className="font-headline font-extrabold text-3xl text-on-secondary-container leading-tight uppercase"> campus<br/>navigation </h2>
            <p className="font-body text-sm text-on-secondary-container mt-2 opacity-80">Find your way with the Wolong Mascot!</p>
          </div>
          <div className="absolute -right-4 -bottom-2 w-40 h-40">
            <img 
              src="./images/remote-19-73f2b0da9b.png" 
              alt="Penguin Mascot" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-primary" />
        </div>
        <input className="w-full bg-surface-container-highest border-none rounded-xl py-4 pl-14 pr-6 font-body font-semibold text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary transition-all" placeholder="搜索目的地" type="text"/>
      </div>

      {/* Map Card */}
      <section className="bg-surface-container-lowest rounded-lg shadow-sm overflow-hidden border-2 border-surface-container">
        <div className="p-4 flex justify-between items-center bg-surface-container-low">
          <span className="font-headline font-bold text-on-surface">卧龙校区全景图</span>
          <MapIcon className="w-5 h-5 text-primary-fixed" />
        </div>
        <div className="relative h-64 w-full bg-[#e7f5ff] overflow-hidden">
          <img 
            src="./images/remote-20-5a7339b422.png" 
            alt="Map" 
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          
          {/* Pins */}
          <div className="absolute top-1/4 left-1/3 flex flex-col items-center">
            <div className="bg-primary text-white p-2 rounded-full shadow-lg scale-90">
              <School className="w-4 h-4 fill-white" />
            </div>
            <span className="text-[10px] font-bold bg-white/90 px-2 py-0.5 rounded-full mt-1">教学楼</span>
          </div>
          <div className="absolute bottom-1/3 right-1/4 flex flex-col items-center">
            <div className="bg-secondary text-white p-2 rounded-full shadow-lg scale-90">
              <Pizza className="w-4 h-4 fill-white" />
            </div>
            <span className="text-[10px] font-bold bg-white/90 px-2 py-0.5 rounded-full mt-1">食堂</span>
          </div>
          <div className="absolute top-1/2 right-1/2 flex flex-col items-center">
            <div className="bg-tertiary text-white p-2 rounded-full shadow-lg scale-110 ring-4 ring-white">
              <MapPin className="w-4 h-4 fill-white" />
            </div>
            <span className="text-[10px] font-bold bg-primary-container text-white px-2 py-0.5 rounded-full mt-1">你在位置</span>
          </div>
        </div>
        <button className="w-full py-4 bg-primary-fixed text-on-primary-fixed font-headline font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform">
          <Navigation className="w-5 h-5 fill-white" />
          开启实时导航
        </button>
      </section>

      {/* Recommended Routes */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="font-headline font-extrabold text-xl text-on-surface">推荐路线</h3>
          <span className="text-primary text-sm font-bold">查看更多</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container-low p-4 rounded-lg flex flex-col gap-3 group hover:bg-secondary-container transition-colors">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <Footprints className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="font-headline font-bold text-sm">最美晨跑线</p>
              <p className="text-xs text-on-surface-variant">绕人工湖 1.2km</p>
            </div>
          </div>
          <div className="bg-surface-container-low p-4 rounded-lg flex flex-col gap-3 group hover:bg-primary-container transition-colors">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-headline font-bold text-sm">图书馆捷径</p>
              <p className="text-xs text-on-surface-variant">避开人流 5min</p>
            </div>
          </div>
          <div className="col-span-2 bg-surface-container-highest p-4 rounded-lg flex items-center justify-between border-2 border-dashed border-primary/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <Zap className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <p className="font-headline font-bold">快到寝室</p>
                <p className="text-xs text-on-surface-variant">最短直线距离路线</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-primary" />
          </div>
        </div>
      </section>
    </div>
  );
};
