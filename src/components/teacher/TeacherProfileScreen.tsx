import React from 'react';
import { 
  Verified, 
  Calendar, 
  Users, 
  ChevronRight, 
  LogOut, 
  User, 
  ShieldCheck, 
  Settings 
} from 'lucide-react';

export const TeacherProfileScreen: React.FC = () => {
  return (
    <div className="space-y-8 pt-4 pb-20">
      {/* Hero Section: Teacher Identity */}
      <section className="relative mb-8 pt-10">
        {/* Mascot Overlap */}
        <div className="absolute -top-4 -right-2 w-32 h-32 z-10">
          <img 
            src="./images/remote-38-6074718af5.png" 
            alt="Steady Panda Mascot" 
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        {/* Profile Card */}
        <div className="bg-surface-container-lowest rounded-lg p-8 shadow-lg relative overflow-hidden border border-outline-variant/5">
          <div className="flex flex-col gap-1 relative z-20">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-secondary text-on-secondary px-3 py-1 rounded-full text-[10px] font-bold tracking-wider">OFFICIAL</span>
              <div className="flex items-center gap-1 text-primary font-bold text-sm">
                <Verified className="w-4 h-4 fill-primary/20" />
                <span>已认证</span>
              </div>
            </div>
            <h2 className="font-headline font-extrabold text-4xl text-on-surface leading-tight tracking-tight">李晓明 <span className="text-lg font-medium text-on-surface-variant ml-2">教授</span></h2>
            <p className="font-body text-on-surface-variant text-lg">工号: 202308159</p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/5">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">所属院系</p>
              <p className="font-bold text-on-surface">信息工程学院</p>
            </div>
            <div className="bg-secondary-container/30 p-4 rounded-2xl border border-secondary-container/20">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">入职时长</p>
              <p className="font-bold text-on-surface">5年 4个月</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bento Grid */}
      <section className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-primary-container p-6 rounded-lg text-on-primary-container flex flex-col justify-between aspect-square shadow-md">
          <Calendar className="w-8 h-8 opacity-80" />
          <div>
            <p className="text-4xl font-black">12</p>
            <p className="text-sm font-bold opacity-80">本周课程</p>
          </div>
        </div>
        <div className="bg-secondary-container p-6 rounded-lg text-on-secondary-container flex flex-col justify-between aspect-square shadow-md">
          <Users className="w-8 h-8 opacity-80" />
          <div>
            <p className="text-4xl font-black">148</p>
            <p className="text-sm font-bold opacity-80">授课学生</p>
          </div>
        </div>
      </section>

      {/* Action List */}
      <div className="space-y-3">
        <h3 className="font-headline font-bold text-on-surface-variant text-sm px-2 uppercase tracking-widest">账户设置</h3>
        <ProfileMenuItem 
          icon={<User className="w-6 h-6 text-primary" />} 
          label="个人信息修改" 
        />
        <ProfileMenuItem 
          icon={<ShieldCheck className="w-6 h-6 text-secondary" />} 
          label="账户与安全" 
        />
        <ProfileMenuItem 
          icon={<Settings className="w-6 h-6 text-tertiary" />} 
          label="系统通用设置" 
        />
      </div>

      {/* Logout CTA */}
      <button className="w-full mt-12 py-5 bg-surface-container-highest/50 rounded-xl flex items-center justify-center gap-2 text-error font-bold hover:bg-error-container hover:text-on-error transition-all active:scale-90 shadow-sm border border-error/10">
        <LogOut className="w-5 h-5" />
        退出登录
      </button>
    </div>
  );
};

const ProfileMenuItem: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <button className="w-full flex items-center justify-between p-5 bg-surface-container-low rounded-2xl hover:bg-surface-container-highest transition-colors active:scale-95 duration-150 border border-outline-variant/5">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <span className="font-bold text-on-surface">{label}</span>
    </div>
    <ChevronRight className="text-on-surface-variant w-5 h-5" />
  </button>
);
