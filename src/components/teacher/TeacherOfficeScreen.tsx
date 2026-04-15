import React from 'react';
import { 
  Stethoscope, 
  Music, 
  TrendingUp, 
  Users, 
  FileText, 
  Calendar, 
  BookOpen, 
  Package, 
  Plus,
  ChevronRight
} from 'lucide-react';

export const TeacherOfficeScreen: React.FC<{ onNavigate: (screen: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 pt-4 pb-20">
      {/* Welcome Section & Mascot Bleed */}
      <section className="relative overflow-visible pt-4">
        <div className="flex flex-col gap-1">
          <p className="text-on-surface-variant font-medium text-sm">你好，李老师</p>
          <h1 className="text-4xl font-extrabold text-on-surface leading-tight">高效办公，<br/>开启活力一天！</h1>
        </div>
        {/* Mascot Decoration */}
        <div className="absolute -right-4 -top-8 w-40 h-40 pointer-events-none transform rotate-12">
          <img 
            src="./images/remote-36-4ce80c8277.png" 
            alt="Mascot" 
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      {/* Campus Pulse: Pending Approvals */}
      <section>
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-bold">待办审批</h2>
          <span className="text-sm font-semibold text-primary underline underline-offset-4 cursor-pointer">查看全部</span>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {/* Approval Card 1 */}
          <div className="bg-surface-container-low rounded-lg p-5 flex flex-col justify-between h-40 relative overflow-hidden shadow-sm border border-outline-variant/5">
            <div className="z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-primary-container text-black text-[10px] font-bold mb-2">请假申请</span>
              <h3 className="text-lg font-bold">高二(3)班 张同学</h3>
              <p className="text-sm text-on-surface-variant">病假审批 · 预计3天</p>
            </div>
            <div className="flex gap-2 z-10">
              <button className="px-4 py-2 bg-primary text-on-primary rounded-full text-sm font-bold shadow-sm active:scale-95 transition-transform">立即同意</button>
              <button className="px-4 py-2 bg-surface-container-highest text-on-surface rounded-full text-sm font-bold active:scale-95 transition-transform" onClick={() => onNavigate('teacher-leave')}>详情</button>
            </div>
            <div className="absolute -bottom-4 -right-4 opacity-5 pointer-events-none">
              <FileText className="w-32 h-32 text-primary" />
            </div>
          </div>
          {/* Approval Card 2 */}
          <div className="bg-secondary-container rounded-lg p-5 flex flex-col justify-between h-40 relative overflow-hidden shadow-sm border border-outline-variant/5">
            <div className="z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-secondary text-white text-[10px] font-bold mb-2">学生活动</span>
              <h3 className="text-lg font-bold">校园歌手大赛</h3>
              <p className="text-sm text-on-surface-variant">物料申请 · 话筒、音响</p>
            </div>
            <div className="flex gap-2 z-10">
              <button className="px-4 py-2 bg-on-secondary-container text-white rounded-full text-sm font-bold shadow-sm active:scale-95 transition-transform">通过</button>
              <button className="px-4 py-2 bg-white/40 text-on-secondary-container rounded-full text-sm font-bold active:scale-95 transition-transform">驳回</button>
            </div>
            <div className="absolute -bottom-4 -right-4 opacity-10 pointer-events-none">
              <Music className="w-32 h-32 text-secondary" />
            </div>
          </div>
        </div>
      </section>

      {/* Work Statistics (Bento Style) */}
      <section>
        <h2 className="text-xl font-bold mb-4">工作统计</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 bg-surface-container-lowest p-6 rounded-lg shadow-sm flex flex-col justify-between border-2 border-primary/5">
            <div>
              <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">本周课时</p>
              <p className="text-5xl font-black text-primary">24<span className="text-lg ml-1 font-bold">节</span></p>
            </div>
            <div className="mt-4 space-y-2">
              <div className="w-full bg-surface-container-low rounded-full h-3 overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-[10px] font-semibold text-on-surface-variant">已完成 18 节 / 剩余 6 节</p>
            </div>
          </div>
          <div className="bg-secondary-fixed-dim/20 p-5 rounded-lg flex flex-col justify-center items-center text-center border border-secondary-fixed-dim/10">
            <Users className="w-8 h-8 text-secondary mb-1 fill-secondary/20" />
            <p className="text-xs font-bold text-on-secondary-container">学生到访</p>
            <p className="text-xl font-black">12</p>
          </div>
          <div className="bg-surface-container-highest p-5 rounded-lg flex flex-col justify-center items-center text-center border border-primary/10">
            <FileText className="w-8 h-8 text-primary mb-1 fill-primary/20" />
            <p className="text-xs font-bold text-on-primary-container">待阅公文</p>
            <p className="text-xl font-black">5</p>
          </div>
          <div className="col-span-2 bg-surface-container-low p-5 rounded-lg flex items-center gap-4 border border-outline-variant/5">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary-fixed shadow-sm">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold">效率超过了 88% 的老师</p>
              <p className="text-[10px] text-on-surface-variant">继续保持哦！</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Tools */}
      <section>
        <h2 className="text-xl font-bold mb-4">常用工具</h2>
        <div className="grid grid-cols-2 gap-4">
          <ToolButton 
            icon={<Calendar className="w-6 h-6 text-primary fill-primary/10" />} 
            title="会议室预约" 
            desc="实时查看空闲" 
            onClick={() => onNavigate('teacher-meeting')}
          />
          <ToolButton 
            icon={<BookOpen className="w-6 h-6 text-secondary fill-secondary/10" />} 
            title="自习室申请" 
            desc="学生课后辅导" 
            onClick={() => onNavigate('teacher-study-room')}
          />
          <ToolButton 
            icon={<Calendar className="w-6 h-6 text-purple-600 fill-purple-600/10" />} 
            title="我的课表" 
            desc="查看全天安排" 
            onClick={() => {}}
          />
          <ToolButton 
            icon={<Package className="w-6 h-6 text-green-600 fill-green-600/10" />} 
            title="耗材领用" 
            desc="办公用品申领" 
            onClick={() => {}}
          />
        </div>
      </section>

      {/* Floating Mascot Banner */}
      <section className="pb-10">
        <div className="bg-secondary-fixed-dim rounded-lg p-6 relative overflow-hidden flex items-center shadow-lg border border-secondary-fixed-dim/30">
          <div className="relative z-10 space-y-1">
            <h3 className="text-xl font-black text-on-secondary-fixed">教工之家新活动</h3>
            <p className="text-sm text-on-secondary-fixed-variant leading-relaxed max-w-[60%]">周五下午“趣味羽毛球赛”开启报名，快来运动吧！</p>
            <button className="mt-2 bg-on-secondary-container text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wide shadow-md active:scale-95 transition-transform">立即报名</button>
          </div>
          <div className="absolute right-0 top-0 bottom-0 opacity-20 pointer-events-none transform scale-150 translate-x-8">
            <TrendingUp className="w-40 h-40 text-on-secondary-fixed" />
          </div>
          <div className="absolute -right-6 -bottom-4 w-32 h-32 transform -rotate-12">
            <img 
              src="./images/remote-37-e34fa1e0bb.png" 
              alt="Campus Shape" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* FAB for New Task */}
      <div className="fixed right-6 bottom-28 z-40">
        <button className="w-16 h-16 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-transform">
          <Plus className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

const ToolButton: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  desc: string; 
  onClick: () => void;
}> = ({ icon, title, desc, onClick }) => (
  <button 
    className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md active:scale-95 transition-all border border-outline-variant/5"
    onClick={onClick}
  >
    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="text-left">
      <p className="font-bold text-sm text-on-surface">{title}</p>
      <p className="text-[10px] text-on-surface-variant">{desc}</p>
    </div>
  </button>
);
