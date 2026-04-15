import React from 'react';
import { 
  ChevronLeft, 
  UserCircle, 
  Home, 
  Map as MapIcon, 
  LayoutGrid, 
  User
} from 'lucide-react';
import { motion } from 'motion/react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  onBack?: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showBack?: boolean;
  identity?: 'student' | 'teacher' | null;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title, 
  onBack, 
  activeTab, 
  setActiveTab,
  showBack = true,
  identity = 'student'
}) => {
  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-background relative overflow-x-hidden">
      {/* Top Bar */}
      <header className="fixed top-0 w-full max-w-md h-16 z-50 flex justify-between items-center px-6 py-4 bg-background/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          {showBack && (
            <button onClick={onBack} className="p-1 active:scale-95 transition-transform">
              <ChevronLeft className="w-6 h-6 text-primary" />
            </button>
          )}
          <h1 className="font-headline font-bold text-lg text-primary">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-1 active:scale-95 transition-transform">
            <UserCircle className="w-6 h-6 text-primary" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-16 pb-28 px-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full max-w-md z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-[#99daff]/80 backdrop-blur-xl rounded-t-[3rem] shadow-[0_-4px_32px_rgba(72,39,2,0.06)]">
        <NavItem 
          icon={<Home className="w-6 h-6" />} 
          label="首页" 
          active={activeTab === 'home'} 
          onClick={() => setActiveTab('home')} 
        />
        <NavItem 
          icon={<MapIcon className="w-6 h-6" />} 
          label="地图" 
          active={activeTab === 'map'} 
          onClick={() => setActiveTab('map')} 
        />
        <NavItem 
          icon={<LayoutGrid className="w-6 h-6" />} 
          label={identity === 'teacher' ? "办公" : "服务"} 
          active={activeTab === 'services'} 
          onClick={() => setActiveTab('services')} 
          isCenter
        />
        <NavItem 
          icon={<User className="w-6 h-6" />} 
          label="我的" 
          active={activeTab === 'profile'} 
          onClick={() => setActiveTab('profile')} 
        />
      </nav>
    </div>
  );
};

const NavItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  onClick: () => void;
  isCenter?: boolean;
}> = ({ icon, label, active, onClick, isCenter }) => {
  if (isCenter) {
    return (
      <button 
        onClick={onClick}
        className={`flex flex-col items-center justify-center rounded-[2rem] px-5 py-2 transition-all scale-90 active:scale-110 duration-300 ${
          active ? 'bg-primary-fixed text-white' : 'text-on-secondary-fixed'
        }`}
      >
        {icon}
        <span className="text-[10px] font-semibold mt-0.5">{label}</span>
      </button>
    );
  }

  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center px-5 py-2 transition-all scale-90 active:scale-110 duration-300 ${
        active ? 'text-primary-fixed' : 'text-on-secondary-fixed'
      }`}
    >
      {icon}
      <span className="text-[10px] font-semibold mt-0.5">{label}</span>
    </button>
  );
};
