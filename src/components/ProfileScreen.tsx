import React from 'react';
import { 
  User, 
  Settings, 
  ChevronRight, 
  CreditCard, 
  Package, 
  Bell, 
  ShieldCheck,
  LogOut
} from 'lucide-react';

interface ProfileProps {
  onNavigate: (screen: string) => void;
}

export const ProfileScreen: React.FC<ProfileProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 pt-4">
      {/* User Header */}
      <section className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-full border-4 border-primary-container p-1 relative">
          <img 
            src="./images/remote-21-b20d58e37d.png" 
            alt="Avatar" 
            className="w-full h-full rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-0 right-0 bg-primary-container text-white p-1.5 rounded-full border-2 border-white">
            <Settings className="w-4 h-4" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-black text-on-surface">张小宝</h2>
          <p className="text-on-surface-variant text-sm font-medium">湖北文理学院 · 2024级</p>
          <div className="mt-2 inline-flex items-center gap-1 bg-secondary-container/30 text-secondary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3" />
            已实名认证
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-4">
        <StatCard label="我的订单" value="12" />
        <StatCard label="我的报修" value="2" />
        <StatCard label="我的发布" value="5" />
      </section>

      {/* Menu List */}
      <section className="bg-surface-container-low rounded-lg divide-y divide-outline-variant/10 overflow-hidden">
        <MenuItem 
          icon={<CreditCard className="w-5 h-5" />} 
          label="我的钱包" 
          subLabel="余额: ¥88.50" 
          onClick={() => onNavigate('wallet')}
        />
        <MenuItem icon={<Package className="w-5 h-5" />} label="我的包裹" subLabel="3件待取" />
        <MenuItem icon={<Bell className="w-5 h-5" />} label="消息中心" subLabel="2条未读" />
        <MenuItem icon={<User className="w-5 h-5" />} label="个人资料" />
        <MenuItem icon={<Settings className="w-5 h-5" />} label="通用设置" />
      </section>

      {/* Logout */}
      <button className="w-full bg-surface-container-highest text-error font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform">
        <LogOut className="w-5 h-5" />
        退出登录
      </button>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bg-surface-container-lowest p-4 rounded-lg flex flex-col items-center gap-1 shadow-sm">
    <span className="text-2xl font-black text-primary">{value}</span>
    <span className="text-[10px] font-bold text-on-surface-variant uppercase">{label}</span>
  </div>
);

const MenuItem: React.FC<{ icon: React.ReactNode; label: string; subLabel?: string; onClick?: () => void }> = ({ icon, label, subLabel, onClick }) => (
  <div 
    className="flex items-center justify-between p-5 hover:bg-surface-container-high transition-colors cursor-pointer group"
    onClick={onClick}
  >
    <div className="flex items-center gap-4">
      <div className="text-primary group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="font-bold text-on-surface">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {subLabel && <span className="text-xs text-on-surface-variant font-medium">{subLabel}</span>}
      <ChevronRight className="w-5 h-5 text-outline-variant" />
    </div>
  </div>
);
