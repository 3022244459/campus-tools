import React from 'react';
import { 
  Briefcase, 
  MapPin, 
  BellPlus,
  ChevronRight
} from 'lucide-react';

export const JobsScreen: React.FC = () => {
  return (
    <div className="space-y-8 pt-4">
      {/* Hero Section */}
      <section className="relative">
        <div className="bg-secondary-fixed-dim rounded-lg p-6 relative overflow-hidden flex items-end min-h-[180px]">
          <div className="z-10 w-2/3">
            <h1 className="font-headline font-extrabold text-3xl text-on-secondary-fixed leading-tight mb-2">勤工俭学<br/>就在校园</h1>
            <p className="text-on-secondary-fixed-variant text-sm font-medium opacity-80">今日新增 12 个校内岗位</p>
          </div>
          <div className="absolute -right-4 -bottom-2 w-40 h-40">
            <img 
              src="./images/remote-14-0d5b7f7994.png" 
              alt="Squirrel Mascot" 
              className="drop-shadow-xl w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Filter Chips */}
      <section className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button className="bg-primary-container text-white px-6 py-2 rounded-full font-bold text-sm whitespace-nowrap shadow-sm">全部岗位</button>
        <button className="bg-surface-container-high text-on-surface-variant px-6 py-2 rounded-full font-medium text-sm whitespace-nowrap hover:bg-surface-container-highest transition-colors">行政助理</button>
        <button className="bg-surface-container-high text-on-surface-variant px-6 py-2 rounded-full font-medium text-sm whitespace-nowrap hover:bg-surface-container-highest transition-colors">图书馆</button>
        <button className="bg-surface-container-high text-on-surface-variant px-6 py-2 rounded-full font-medium text-sm whitespace-nowrap hover:bg-surface-container-highest transition-colors">后勤勤务</button>
      </section>

      {/* Job Listings */}
      <div className="space-y-4">
        <JobCard 
          title="图书馆图书管理员" 
          loc="中心校区 · 图书馆" 
          pay="25" 
          tags={["长期岗", "需面试"]} 
          isHot 
        />
        <JobCard 
          title="教务处行政助理" 
          loc="行政楼 · 302办公室" 
          pay="22" 
          tags={["整理文件", "大二优先"]} 
          isNew 
        />
        <JobCard 
          title="校园绿化维护助理" 
          loc="后勤部 · 校园全域" 
          pay="20" 
          tags={["体力活", "无需经验"]} 
        />

        {/* Subscription Card */}
        <div className="bg-surface-container-high rounded-lg p-5 flex items-center justify-between border-2 border-dashed border-outline-variant/30">
          <div className="flex flex-col">
            <p className="text-on-surface-variant font-medium text-xs mb-1">没有找到合适的？</p>
            <h4 className="font-headline font-bold text-on-surface">订阅新岗位通知</h4>
          </div>
          <button className="bg-secondary text-white w-12 h-12 rounded-full flex items-center justify-center active:scale-90 transition-transform shadow-md">
            <BellPlus className="w-6 h-6 fill-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

const JobCard: React.FC<{
  title: string;
  loc: string;
  pay: string;
  tags: string[];
  isHot?: boolean;
  isNew?: boolean;
}> = ({ title, loc, pay, tags, isHot, isNew }) => (
  <div className="bg-surface-container-lowest rounded-lg p-5 shadow-sm relative group transition-all hover:scale-[1.02]">
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-headline font-bold text-xl text-on-surface">{title}</h3>
          {isHot && <span className="bg-error-container text-white text-[10px] px-2 py-0.5 rounded-full font-black tracking-wider uppercase">Hot</span>}
          {isNew && <span className="bg-secondary text-white text-[10px] px-2 py-0.5 rounded-full font-black tracking-wider uppercase">New</span>}
        </div>
        <p className="text-on-surface-variant text-sm flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {loc}
        </p>
      </div>
      <div className="text-right">
        <p className="text-primary font-bold text-lg">{pay}<span className="text-xs ml-0.5">元/小时</span></p>
      </div>
    </div>
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        {tags.map(tag => (
          <span key={tag} className="bg-secondary-container/30 text-secondary px-3 py-1 rounded-full text-xs font-medium">{tag}</span>
        ))}
      </div>
      <button className="bg-primary-container text-white font-bold px-6 py-2 rounded-full text-sm active:scale-95 transition-transform">申请岗位</button>
    </div>
  </div>
);
