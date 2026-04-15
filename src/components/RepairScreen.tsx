import React from 'react';
import { 
  Wrench, 
  BarChart3, 
  MapPin, 
  Camera, 
  Building,
  Lightbulb,
  Droplets,
  Zap,
  Info
} from 'lucide-react';

export const RepairScreen: React.FC = () => {
  return (
    <div className="space-y-8 pt-4">
      {/* Hero Section */}
      <section className="relative bg-secondary-fixed rounded-lg p-6 overflow-hidden shadow-sm">
        <div className="z-10 relative max-w-[60%]">
          <h1 className="text-3xl font-black text-on-secondary-fixed leading-tight">校园报修</h1>
          <p className="text-on-secondary-fixed-variant font-medium mt-2">哪里坏了修哪里<br/>沃龙小助手时刻在线</p>
        </div>
        <div className="absolute -right-4 -bottom-2 w-48 h-48 drop-shadow-2xl transform rotate-3">
          <img 
            src="./images/remote-22-3df9276542.png" 
            alt="Mascot" 
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button className="bg-surface-container-highest p-5 rounded-lg flex flex-col items-center gap-2 hover:bg-[#ffd5b2] transition-colors group">
          <div className="w-14 h-14 bg-primary-container rounded-full flex items-center justify-center text-white group-active:scale-95 duration-200">
            <Wrench className="w-7 h-7 fill-white" />
          </div>
          <span className="font-bold text-on-surface">在线报修</span>
        </button>
        <button className="bg-surface-container-low p-5 rounded-lg flex flex-col items-center gap-2 hover:bg-surface-container-high transition-colors group">
          <div className="w-14 h-14 bg-secondary-container rounded-full flex items-center justify-center text-on-secondary-container group-active:scale-95 duration-200">
            <BarChart3 className="w-7 h-7 fill-on-secondary-container" />
          </div>
          <span className="font-bold text-on-surface">进度查询</span>
        </button>
      </div>

      {/* Form Card */}
      <section className="bg-surface-container-lowest rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-8 bg-primary-container rounded-full"></div>
          <h2 className="text-xl font-bold text-on-surface">报修单填写</h2>
        </div>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-bold text-on-surface-variant mb-3">报修类型</label>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              <TypeChip icon={<Lightbulb className="w-4 h-4" />} label="照明" active />
              <TypeChip icon={<Droplets className="w-4 h-4" />} label="给排水" />
              <TypeChip icon={<Zap className="w-4 h-4" />} label="电力" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-on-surface-variant">故障位置</label>
            <div className="relative">
              <input className="w-full bg-surface-container-low border-none rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary placeholder:text-outline/50 font-medium" placeholder="例：卧龙校区3号宿舍楼204" type="text"/>
              <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-on-surface-variant">问题描述</label>
            <textarea className="w-full bg-surface-container-low border-none rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary placeholder:text-outline/50 font-medium" placeholder="请详细描述故障情况..." rows={3}></textarea>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-on-surface-variant">上传图片 (最多3张)</label>
            <div className="w-24 h-24 bg-surface-container-high rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-outline-variant text-outline hover:bg-surface-container-highest cursor-pointer">
              <Camera className="w-8 h-8" />
            </div>
          </div>

          <button className="w-full bg-primary-fixed text-on-primary-fixed py-5 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-transform mt-4">
            提交报修申请
          </button>
        </form>
      </section>

      {/* Info Card */}
      <section className="bg-secondary-fixed-dim rounded-lg p-6 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-on-secondary-fixed font-bold text-lg">报修须知</h3>
          <ul className="mt-3 space-y-2 text-sm text-on-secondary-fixed-variant">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
              紧急维修请拨打：0710-123456
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
              日常报修将在24小时内响应
            </li>
          </ul>
        </div>
        <div className="absolute -right-8 -bottom-8 opacity-20 transform rotate-12 pointer-events-none">
          <Building className="w-32 h-32 fill-on-secondary-fixed" />
        </div>
      </section>
    </div>
  );
};

const TypeChip: React.FC<{ icon: React.ReactNode; label: string; active?: boolean }> = ({ icon, label, active }) => (
  <button className={`flex-shrink-0 px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-colors ${
    active ? 'bg-primary-container text-white' : 'bg-surface-container-high text-on-surface-variant'
  }`}>
    {icon}
    {label}
  </button>
);
