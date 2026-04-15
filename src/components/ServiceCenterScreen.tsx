import React from 'react';
import { 
  Search, 
  School, 
  Package, 
  Truck, 
  Wrench, 
  SearchCheck, 
  Users, 
  Compass, 
  ShoppingBag, 
  Briefcase,
  Droplets,
  Zap,
  CreditCard,
  ArrowRight,
  Navigation,
  Wallet,
  BookOpen,
  Clock
} from 'lucide-react';

interface ServiceCenterProps {
  onNavigate: (screen: string) => void;
}

export const ServiceCenterScreen: React.FC<ServiceCenterProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 pt-4">
      {/* Search Bar */}
      <section className="relative">
        <div className="flex items-center bg-surface-container-low rounded-xl px-4 py-3 gap-3">
          <Search className="w-5 h-5 text-outline" />
          <input className="bg-transparent border-none focus:ring-0 text-on-surface placeholder-on-surface-variant w-full font-medium" placeholder="搜索校内服务..." type="text"/>
        </div>
      </section>

      {/* Hero Banner */}
      <section className="relative bg-secondary-fixed-dim rounded-lg p-6 overflow-hidden min-h-[160px] flex flex-col justify-between shadow-sm">
        <div className="absolute right-[-10%] top-[-10%] opacity-20 pointer-events-none">
          <School className="w-32 h-32 text-on-secondary-container" />
        </div>
        <div className="relative z-10">
          <span className="bg-primary text-on-primary px-3 py-1 rounded-full text-xs font-bold mb-3 inline-block">校园头条</span>
          <h2 className="text-on-secondary-container text-xl font-bold leading-tight">卧龙校区智慧服务<br/>全面升级，快来体验吧！</h2>
        </div>
        <div className="flex items-center gap-2 mt-4 relative z-10">
          <div className="w-2 h-2 rounded-full bg-primary-container"></div>
          <p className="text-on-secondary-container text-sm font-medium">查看最新公告</p>
        </div>
        <img 
          src="./images/remote-23-39efd26e11.png" 
          alt="Campus View" 
          className="absolute right-4 bottom-4 w-24 h-24 object-cover rounded-lg opacity-80 mix-blend-multiply"
          referrerPolicy="no-referrer"
        />
      </section>

      {/* Daily Life */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h3 className="text-on-surface font-bold text-xl">生活服务</h3>
          <span className="text-on-surface-variant text-xs uppercase tracking-wider">Daily Life</span>
        </div>
        <div className="grid grid-cols-4 gap-y-6">
          <ServiceIcon icon={<Package className="w-7 h-7" />} label="快递服务" onClick={() => onNavigate('courier')} />
          <ServiceIcon icon={<Truck className="w-7 h-7" />} label="美食外卖" onClick={() => onNavigate('takeout')} />
          <ServiceIcon icon={<Wrench className="w-7 h-7" />} label="报修中心" onClick={() => onNavigate('repair')} />
          <ServiceIcon icon={<SearchCheck className="w-7 h-7" />} label="失物招领" onClick={() => onNavigate('lost-found')} />
          <ServiceIcon icon={<Users className="w-7 h-7" />} label="校园社团" onClick={() => onNavigate('clubs')} />
          <ServiceIcon icon={<Compass className="w-7 h-7" />} label="校园导航" onClick={() => onNavigate('map')} />
          <ServiceIcon icon={<ShoppingBag className="w-7 h-7" />} label="食堂惠购" onClick={() => onNavigate('canteen')} />
          <ServiceIcon icon={<Briefcase className="w-7 h-7" />} label="校园兼职" onClick={() => onNavigate('jobs')} />
        </div>
      </section>

      {/* Utilities */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h3 className="text-on-surface font-bold text-xl">生活缴费</h3>
          <span className="text-on-surface-variant text-xs uppercase tracking-wider">Utilities</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div 
            className="bg-surface-container-low rounded-lg p-5 flex flex-col gap-4 relative overflow-hidden cursor-pointer"
            onClick={() => onNavigate('water')}
          >
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
            <div 
              className="bg-surface-container-highest rounded-lg p-4 flex items-center justify-between group cursor-pointer"
              onClick={() => onNavigate('electricity')}
            >
              <div className="flex flex-col">
                <span className="text-on-background font-bold">电费充值</span>
                <span className="text-[10px] text-on-surface-variant">Electricity</span>
              </div>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary-container shadow-sm">
                <Zap className="w-5 h-5 fill-primary-container" />
              </div>
            </div>
            <div 
              className="bg-secondary-container rounded-lg p-4 flex items-center justify-between group cursor-pointer"
              onClick={() => onNavigate('wallet')}
            >
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

      {/* Campus Info */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h3 className="text-on-surface font-bold text-xl">校园资讯</h3>
          <span className="text-on-surface-variant text-xs uppercase tracking-wider">Campus Info</span>
        </div>
        <div className="grid grid-cols-12 grid-rows-2 gap-4 h-64">
          <div 
            className="col-span-7 row-span-2 bg-surface-container rounded-lg p-5 flex flex-col justify-between relative overflow-hidden cursor-pointer"
            onClick={() => onNavigate('courier-compare')}
          >
            <div>
              <h4 className="text-primary font-bold text-lg">比价中心</h4>
              <p className="text-on-surface-variant text-xs mt-1">校内超市价格一手掌握</p>
            </div>
            <div className="flex items-center gap-2 bg-white/50 backdrop-blur rounded-full px-3 py-1 w-fit">
              <span className="text-[10px] font-bold text-primary">立即对比</span>
              <ArrowRight className="w-3 h-3 text-primary" />
            </div>
            <Wallet className="absolute right-2 bottom-2 w-32 h-32 text-primary/10" />
          </div>
          <div className="col-span-5 row-span-1 bg-tertiary-container rounded-lg p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/40 rounded-full flex items-center justify-center text-tertiary">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-on-tertiary-container font-bold text-sm">空闲教室</span>
          </div>
          <div className="col-span-5 row-span-1 bg-surface-container-highest rounded-lg p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/40 rounded-full flex items-center justify-center text-primary">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-on-primary-fixed-variant font-bold text-sm">校车时间</span>
          </div>
        </div>
      </section>

      {/* Tip */}
      <section className="flex bg-surface-container-lowest rounded-lg p-6 items-center gap-6 border-outline-variant/15 border-2">
        <div className="flex-shrink-0 relative">
          <div className="w-16 h-16 rounded-full bg-secondary-fixed flex items-center justify-center overflow-hidden">
            <img 
              src="./images/remote-24-9adc354462.png" 
              alt="Koala" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -top-2 -right-2 bg-error-container text-white text-[10px] px-2 py-0.5 rounded-full font-bold">New!</div>
        </div>
        <div>
          <p className="text-on-surface font-medium leading-snug">嘿！我是小宝，今天卧龙校区天气晴朗，记得按时喝水哦！</p>
          <button className="text-primary font-bold text-sm mt-2 flex items-center gap-1">
            获取今日校园贴士
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};

const ServiceIcon: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={onClick}>
    <div className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center text-primary transition-transform group-active:scale-90 shadow-sm">
      {icon}
    </div>
    <span className="text-on-surface text-xs font-medium">{label}</span>
  </div>
);
