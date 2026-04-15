import React from 'react';
import { 
  QrCode, 
  MapPin, 
  ChevronRight, 
  Megaphone, 
  Truck, 
  Pizza, 
  FileText, 
  School, 
  Wrench, 
  Calendar, 
  BookOpen, 
  CheckSquare,
  Building,
  CreditCard,
  Banknote,
  Bell,
  Award
} from 'lucide-react';

interface TeacherHomeProps {
  onNavigate: (screen: string) => void;
}

export const TeacherHomeScreen: React.FC<TeacherHomeProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6 pt-4 pb-10">
      {/* Announcement Bar */}
      <section className="bg-surface-container-lowest rounded-lg p-4 flex items-center gap-3 shadow-sm">
        <div className="bg-primary-container/10 px-3 py-1 rounded-full flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-primary fill-primary" />
          <span className="text-primary font-bold text-xs">教师公告</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-on-surface-variant text-sm truncate">暂无公告</p>
        </div>
        <button className="text-on-surface-variant/60 text-xs flex items-center font-medium">
          更多
          <ChevronRight className="w-4 h-4" />
        </button>
      </section>

      {/* Bento Grid Menu */}
      <section className="grid grid-cols-4 gap-4">
        <MenuIcon 
          icon={<Truck className="w-7 h-7" />} 
          label="快递代取" 
          bgColor="bg-secondary-fixed" 
          iconColor="text-on-secondary-fixed" 
          onClick={() => onNavigate('teacher-courier')}
        />
        <MenuIcon 
          icon={<Pizza className="w-7 h-7" />} 
          label="外卖代取" 
          bgColor="bg-primary-fixed" 
          iconColor="text-white" 
          onClick={() => onNavigate('teacher-takeout')}
        />
        <MenuIcon 
          icon={<FileText className="w-7 h-7" />} 
          label="文件代送" 
          bgColor="bg-tertiary-fixed" 
          iconColor="text-on-tertiary-fixed" 
          onClick={() => onNavigate('teacher-document')}
        />
        <MenuIcon 
          icon={<School className="w-7 h-7" />} 
          label="学生事务" 
          bgColor="bg-surface-container-highest" 
          iconColor="text-on-primary-container" 
          onClick={() => onNavigate('teacher-student-affairs')}
        />
        <MenuIcon 
          icon={<Wrench className="w-7 h-7" />} 
          label="校园报修" 
          bgColor="bg-surface-container-high" 
          iconColor="text-on-surface-variant" 
          onClick={() => onNavigate('teacher-repair')}
        />
        <MenuIcon 
          icon={<Calendar className="w-7 h-7" />} 
          label="会议预约" 
          bgColor="bg-secondary-fixed-dim" 
          iconColor="text-on-secondary-fixed" 
          onClick={() => onNavigate('teacher-meeting')}
        />
        <MenuIcon 
          icon={<BookOpen className="w-7 h-7" />} 
          label="自习室管理" 
          bgColor="bg-tertiary-container" 
          iconColor="text-on-tertiary-container" 
          onClick={() => onNavigate('teacher-study-room')}
        />
        <MenuIcon 
          icon={<CheckSquare className="w-7 h-7" />} 
          label="请假审批" 
          bgColor="bg-primary-container/20" 
          iconColor="text-primary" 
          onClick={() => onNavigate('teacher-leave')}
        />
      </section>

      {/* Teacher Service Section */}
      <section>
        <div className="flex justify-between items-end mb-4">
          <h2 className="font-headline font-bold text-2xl text-on-surface">教师服务</h2>
          <span className="text-on-surface-variant text-xs opacity-60">Professional Portal</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ServiceCard 
            icon={<Building className="w-6 h-6 fill-on-secondary-container" />} 
            title="教务入口" 
            desc="教学管理与课程安排" 
            bgColor="bg-secondary-container" 
            onClick={() => {}}
          />
          <ServiceCard 
            icon={<Banknote className="w-6 h-6 fill-primary" />} 
            title="工资查询" 
            desc="明细账单实时查看" 
            bgColor="bg-primary-container/20" 
            onClick={() => onNavigate('teacher-salary')}
          />
          <ServiceCard 
            icon={<CreditCard className="w-6 h-6 fill-on-tertiary-container" />} 
            title="校园卡" 
            desc="充值查询与挂失" 
            bgColor="bg-tertiary-container" 
            onClick={() => onNavigate('teacher-campus-card')}
          />
          <ServiceCard 
            icon={<Bell className="w-6 h-6 fill-on-secondary-fixed" />} 
            title="办公通知" 
            desc="公文流转与会议通报" 
            bgColor="bg-secondary-fixed-dim" 
            onClick={() => {}}
          />
        </div>
      </section>

      {/* Campus Pulse Decoration */}
      <section className="bg-secondary-fixed-dim rounded-lg p-6 relative overflow-hidden min-h-[140px] flex items-center shadow-sm">
        <div className="z-10 max-w-[60%]">
          <h4 className="font-headline font-extrabold text-2xl text-on-secondary-fixed leading-tight">教研之星评选<br/>即刻开启</h4>
          <p className="text-on-secondary-fixed-variant text-xs mt-2">弘扬教育精神，争做时代名师</p>
        </div>
        <div className="absolute -right-4 -bottom-4 w-36 h-36 opacity-30">
          <Award className="w-full h-full text-on-secondary-fixed" />
        </div>
      </section>
    </div>
  );
};

const MenuIcon: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  bgColor: string; 
  iconColor: string;
  onClick: () => void;
}> = ({ icon, label, bgColor, iconColor, onClick }) => (
  <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={onClick}>
    <div className={`w-16 h-16 rounded-lg ${bgColor} flex items-center justify-center active:scale-90 transition-transform shadow-sm`}>
      <div className={iconColor}>{icon}</div>
    </div>
    <span className="text-xs font-medium text-on-surface">{label}</span>
  </div>
);

const ServiceCard: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  desc: string; 
  bgColor: string;
  onClick: () => void;
}> = ({ icon, title, desc, bgColor, onClick }) => (
  <div 
    className="bg-surface-container-lowest p-5 rounded-lg flex flex-col gap-4 border border-outline-variant/10 shadow-sm relative overflow-hidden group cursor-pointer"
    onClick={onClick}
  >
    <div className={`absolute -top-4 -right-4 w-16 h-16 ${bgColor}/10 rounded-full group-hover:scale-150 transition-transform duration-500`}></div>
    <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center`}>
      {icon}
    </div>
    <div>
      <h3 className="font-bold text-on-surface">{title}</h3>
      <p className="text-[10px] text-on-surface-variant mt-1">{desc}</p>
    </div>
  </div>
);
