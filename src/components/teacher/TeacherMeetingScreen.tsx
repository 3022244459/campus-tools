import React from 'react';
import { 
  Clock, 
  Users, 
  Video, 
  Wifi, 
  Info, 
  Building,
  ChevronRight,
  Tv
} from 'lucide-react';

export const TeacherMeetingScreen: React.FC = () => {
  return (
    <div className="space-y-8 pt-4 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-xl bg-secondary-fixed p-6 shadow-lg min-h-[180px]">
        <div className="relative z-10 max-w-[60%]">
          <h2 className="text-3xl font-extrabold text-on-secondary-fixed leading-tight mb-2">会议室预约</h2>
          <p className="text-on-secondary-fixed-variant text-sm font-medium">今天有 5 个会议室空闲，快来预约吧！</p>
          <div className="mt-4 flex items-center gap-2 bg-white/40 backdrop-blur-md rounded-full px-4 py-2 w-fit">
            <Clock className="w-4 h-4 text-secondary" />
            <span className="text-xs font-bold text-on-secondary-fixed">14:30 - 15:30 暂无预约</span>
          </div>
        </div>
        <div className="absolute -right-4 -bottom-6 w-48 h-48 drop-shadow-xl transform rotate-3">
          <img 
            src="./images/remote-30-037b6b11cb.png" 
            alt="Timekeeper Rabbit" 
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      {/* Asymmetric Calendar View */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-on-surface">选择时间</h3>
          <span className="text-primary font-bold text-sm">2024年5月</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
          <CalendarDay day="周一" date="20" active />
          <CalendarDay day="周二" date="21" />
          <CalendarDay day="周三" date="22" />
          <CalendarDay day="周四" date="23" />
          <CalendarDay day="周五" date="24" />
          <CalendarDay day="周六" date="25" />
        </div>
      </section>

      {/* Meeting Room List */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-on-surface">会议室列表</h3>
        <div className="grid grid-cols-1 gap-6">
          {/* Room Card 1 */}
          <div className="bg-surface-container-lowest p-5 rounded-lg shadow-sm space-y-4 border border-outline-variant/10">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-bold text-on-surface">卧龙厅 (大)</h4>
                <p className="text-on-surface-variant text-xs mt-1">教学楼 A 栋 302</p>
              </div>
              <span className="bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2 py-1 rounded-full uppercase">AVAILABLE</span>
            </div>
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-surface-container">
              <img 
                src="./images/remote-31-ee1c0f3924.png" 
                alt="Meeting Room" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold">50人</span>
              </div>
              <div className="flex items-center gap-1">
                <Video className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold">投影仪</span>
              </div>
              <div className="flex items-center gap-1">
                <Wifi className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold">5G</span>
              </div>
            </div>
            <button className="w-full bg-primary-fixed text-on-primary-fixed font-bold py-3 rounded-full hover:opacity-90 active:scale-95 transition-all shadow-sm">立即预约</button>
          </div>

          {/* Room Card 2 */}
          <div className="bg-surface-container-lowest p-5 rounded-lg shadow-sm space-y-4 border border-outline-variant/10">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-bold text-on-surface">博学室 (中)</h4>
                <p className="text-on-surface-variant text-xs mt-1">图书馆 4 楼 415</p>
              </div>
              <span className="bg-tertiary-container text-on-tertiary-container text-[10px] font-bold px-2 py-1 rounded-full uppercase">BUSY</span>
            </div>
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-surface-container grayscale">
              <img 
                src="./images/remote-32-d0a64482f5.png" 
                alt="Small Meeting Room" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold">12人</span>
              </div>
              <div className="flex items-center gap-1">
                <Tv className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold">智能电视</span>
              </div>
            </div>
            <button className="w-full bg-surface-container-highest text-on-surface-variant font-bold py-3 rounded-full cursor-not-allowed opacity-50">暂不可约</button>
          </div>
        </div>
      </section>

      {/* Info Card */}
      <section className="bg-secondary-fixed-dim p-6 rounded-lg relative overflow-hidden shadow-sm">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-on-secondary-fixed">预约须知</h3>
            <p className="text-on-secondary-fixed-variant text-xs max-w-[200px] mt-1">请至少提前2小时提交预约申请，离开时请关闭电源。</p>
          </div>
          <Info className="w-10 h-10 text-on-secondary-fixed opacity-40" />
        </div>
        <Building className="absolute right-[-10%] top-0 w-32 h-32 text-on-secondary-fixed opacity-10 pointer-events-none" />
      </section>
    </div>
  );
};

const CalendarDay: React.FC<{ day: string; date: string; active?: boolean }> = ({ day, date, active }) => (
  <div className={`flex-shrink-0 w-16 h-24 flex flex-col items-center justify-center rounded-xl transition-all cursor-pointer ${
    active ? 'bg-primary text-white shadow-lg shadow-orange-200' : 'bg-surface-container-low text-on-surface-variant'
  }`}>
    <span className={`text-xs ${active ? 'opacity-80' : 'opacity-60'}`}>{day}</span>
    <span className="text-2xl font-bold">{date}</span>
  </div>
);
