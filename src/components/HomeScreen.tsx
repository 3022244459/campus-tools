import React from 'react';
import { 
  Package, 
  Truck, 
  Wrench, 
  SearchCheck, 
  Users, 
  Compass, 
  Droplets, 
  Zap,
  CreditCard,
  BadgePercent,
  Utensils,
  Briefcase,
  Bell,
  QrCode,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

interface HomeProps {
  onNavigate: (screen: string) => void;
}

export const HomeScreen: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6 pt-4">
      {/* Header Info */}
      <section className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-container flex items-center justify-center">
            <img 
              src="./images/remote-12-d769ee83a1.png" 
              alt="App Icon" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-primary font-black text-2xl tracking-tight leading-tight">校园宝</span>
            <div className="flex items-center gap-1">
              <span className="text-on-surface-variant text-[10px] font-medium">湖北文理学院卧龙校区</span>
              <ChevronRight className="w-3 h-3 text-primary rotate-90" />
            </div>
          </div>
        </div>
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-primary active:scale-95 transition-transform">
          <QrCode className="w-6 h-6" />
        </button>
      </section>

      {/* Announcement Bar */}
      <section className="bg-secondary-fixed-dim/30 rounded-lg p-4 flex items-center justify-between relative overflow-hidden">
        <div className="flex items-center gap-3 relative z-10">
          <div className="bg-primary-container p-2 rounded-full flex items-center justify-center">
            <Bell className="w-4 h-4 text-white fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-primary tracking-wider">校园公告</span>
            <span className="text-sm text-on-surface-variant">暂无公告</span>
          </div>
        </div>
        <button className="text-xs font-bold text-secondary-dim bg-white/50 px-3 py-1 rounded-full border-none relative z-10">更多</button>
      </section>

      {/* Quick Functions Grid */}
      <section className="grid grid-cols-4 gap-y-6 gap-x-4">
        <FunctionItem icon={<Package className="w-6 h-6" />} label="取快递" onClick={() => onNavigate('courier')} />
        <FunctionItem icon={<Truck className="w-6 h-6" />} label="外卖代取" onClick={() => onNavigate('takeout')} />
        <FunctionItem icon={<Wrench className="w-6 h-6" />} label="校园报修" onClick={() => onNavigate('repair')} />
        <FunctionItem icon={<SearchCheck className="w-6 h-6" />} label="失物招领" onClick={() => onNavigate('lost-found')} />
        <FunctionItem icon={<Users className="w-6 h-6" />} label="社团资讯" onClick={() => onNavigate('clubs')} />
        <FunctionItem icon={<Compass className="w-6 h-6" />} label="校园导航" onClick={() => onNavigate('map')} />
        <FunctionItem icon={<Droplets className="w-6 h-6" />} label="热水充值" onClick={() => onNavigate('water')} />
        <FunctionItem icon={<Zap className="w-6 h-6" />} label="电费查询" onClick={() => onNavigate('electricity')} />
      </section>

      {/* Life Services */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h2 className="text-2xl font-headline font-bold text-on-surface tracking-tight">校园生活服务</h2>
          <span className="text-on-surface-variant text-xs font-semibold pb-1 flex items-center gap-1">
            更多服务 <ArrowRight className="w-3 h-3" />
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ServiceCard 
            icon={<CreditCard className="w-5 h-5" />} 
            title="校园卡充值" 
            desc="一键余额即刻到账" 
            bgColor="bg-surface-container-low" 
            iconColor="bg-primary-container"
            onClick={() => onNavigate('wallet')}
          />
          <ServiceCard 
            icon={<BadgePercent className="w-5 h-5" />} 
            title="快递比价" 
            desc="寄件省钱小帮手" 
            bgColor="bg-secondary-container" 
            iconColor="bg-secondary"
            onClick={() => onNavigate('courier-compare')}
          />
          <ServiceCard 
            icon={<Utensils className="w-5 h-5" />} 
            title="食堂优惠" 
            desc="卧龙校区专属折扣" 
            bgColor="bg-surface-container-highest" 
            iconColor="bg-primary-container/80"
            onClick={() => onNavigate('canteen')}
          />
          <ServiceCard 
            icon={<Briefcase className="w-5 h-5" />} 
            title="兼职信息" 
            desc="勤工俭学岗位速递" 
            bgColor="bg-tertiary-container" 
            iconColor="bg-tertiary"
            onClick={() => onNavigate('jobs')}
          />
        </div>
      </section>

      {/* Editorial Banner */}
      <section className="bg-primary p-6 rounded-lg text-on-primary flex items-center justify-between relative overflow-hidden mt-2">
        <div className="flex flex-col gap-1 relative z-10">
          <h3 className="text-xl font-headline font-extrabold italic uppercase tracking-tighter">校园联接</h3>
          <p className="text-xs opacity-90 max-w-[180px]">加入 2,000+ 名学生，每日在我们的校园生态中互动交流。</p>
        </div>
        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center relative z-10 overflow-hidden border-4 border-white/10">
          <img 
            src="./images/remote-13-c052b93e86.png" 
            alt="Tower Logo" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full"></div>
      </section>
    </div>
  );
};

const FunctionItem: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={onClick}>
    <div className="w-14 h-14 bg-surface-container-highest rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200 text-primary">
      {icon}
    </div>
    <span className="text-[12px] font-semibold text-on-surface">{label}</span>
  </div>
);

const ServiceCard: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  desc: string; 
  bgColor: string; 
  iconColor: string;
  onClick: () => void;
}> = ({ icon, title, desc, bgColor, iconColor, onClick }) => (
  <div 
    className={`${bgColor} rounded-lg p-5 flex flex-col gap-4 relative overflow-hidden group cursor-pointer`}
    onClick={onClick}
  >
    <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-black/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
    <div className={`w-10 h-10 ${iconColor} rounded-full flex items-center justify-center text-white`}>
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-base font-bold text-on-surface">{title}</span>
      <span className="text-[10px] text-on-surface-variant">{desc}</span>
    </div>
  </div>
);
