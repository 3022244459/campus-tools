import React from 'react';
import { 
  Search, 
  Filter, 
  Pin, 
  MessageSquarePlus, 
  Megaphone, 
  Building, 
  School,
  ChevronRight
} from 'lucide-react';

export const TeacherMessageScreen: React.FC = () => {
  return (
    <div className="space-y-6 pt-4 pb-20">
      {/* Search Section */}
      <div className="relative">
        <div className="flex items-center bg-surface-container-highest rounded-xl px-4 py-3 gap-3 shadow-sm border-none">
          <Search className="w-5 h-5 text-on-surface-variant" />
          <input 
            className="bg-transparent border-none focus:ring-0 text-on-surface w-full placeholder:text-on-surface-variant/60 font-medium text-sm" 
            placeholder="搜索联系人、群聊或消息" 
            type="text"
          />
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        <button className="bg-primary-container text-black px-6 py-2 rounded-full font-bold whitespace-nowrap active:scale-95 transition-transform shadow-sm">全部</button>
        <button className="bg-secondary-container text-on-secondary-fixed px-6 py-2 rounded-full font-semibold whitespace-nowrap active:scale-95 transition-transform">学生</button>
        <button className="bg-secondary-container text-on-secondary-fixed px-6 py-2 rounded-full font-semibold whitespace-nowrap active:scale-95 transition-transform">同事</button>
        <button className="bg-secondary-container text-on-secondary-fixed px-6 py-2 rounded-full font-semibold whitespace-nowrap active:scale-95 transition-transform">家长群</button>
      </div>

      {/* Chat List */}
      <div className="grid grid-cols-1 gap-4">
        {/* Pinned Chat */}
        <div className="bg-surface-container-lowest p-5 rounded-lg flex items-center gap-4 relative overflow-hidden group hover:bg-surface-container transition-colors cursor-pointer shadow-sm border border-outline-variant/5">
          <div className="absolute top-0 right-0 p-1">
            <Pin className="w-3 h-3 text-primary-container fill-primary-container" />
          </div>
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-secondary-container flex items-center justify-center overflow-hidden border-2 border-white">
              <img 
                src="./images/remote-33-7b55a167ec.png" 
                alt="Group Chat" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-error rounded-full flex items-center justify-center border-2 border-white">
              <span className="text-[10px] text-white font-bold">12</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-bold text-lg text-on-surface truncate">高一(3)班 家长交流群</h3>
              <span className="text-xs text-on-surface-variant/70">10:45</span>
            </div>
            <p className="text-on-surface-variant text-sm truncate">李晓明的家长：老师，下周的校服订购是在哪...</p>
          </div>
        </div>

        {/* Regular Chat 1 */}
        <div className="bg-surface-container-low p-5 rounded-lg flex items-center gap-4 group hover:bg-surface-container transition-colors cursor-pointer border border-outline-variant/5">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
            <img 
              src="./images/remote-34-21e6b502a1.png" 
              alt="Student" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-bold text-lg text-on-surface">张子涵 (学生)</h3>
              <span className="text-xs text-on-surface-variant/70">昨天</span>
            </div>
            <p className="text-on-surface-variant text-sm truncate">好的老师，我会准时提交作业的。谢谢您！</p>
          </div>
        </div>

        {/* Regular Chat 2 */}
        <div className="bg-surface-container-lowest p-5 rounded-lg flex items-center gap-4 group hover:bg-surface-container transition-colors cursor-pointer shadow-sm border border-outline-variant/5">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
            <img 
              src="./images/remote-35-83a9a0934a.png" 
              alt="Colleague" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-bold text-lg text-on-surface">王建国 (教研组长)</h3>
              <span className="text-xs text-on-surface-variant/70">14:20</span>
            </div>
            <p className="text-primary font-medium text-sm truncate">[图片] 教务处最新通知</p>
          </div>
        </div>

        {/* Campus Pulse Card */}
        <div className="relative bg-secondary-fixed-dim p-6 rounded-lg overflow-hidden flex flex-col justify-end min-h-[160px] shadow-lg border border-secondary-fixed-dim/30">
          <div className="absolute top-0 right-0 opacity-20 pointer-events-none">
            <Building className="w-32 h-32 translate-x-10 -translate-y-4 text-on-secondary-fixed" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Megaphone className="w-4 h-4 text-on-secondary-fixed fill-on-secondary-fixed" />
              <span className="font-bold text-on-secondary-fixed text-sm uppercase tracking-wider">校园动态</span>
            </div>
            <h2 className="text-2xl font-black text-on-secondary-fixed leading-tight mb-4">全校教师大会：<br/>下周一卧龙礼堂举行</h2>
            <div className="flex items-center gap-2">
              <span className="bg-on-secondary-fixed text-secondary-fixed-dim px-3 py-1 rounded-full text-xs font-bold">置顶公告</span>
              <span className="text-on-secondary-fixed/70 text-xs font-medium">10分钟前</span>
            </div>
          </div>
        </div>

        {/* Regular Chat 3 */}
        <div className="bg-surface-container-low p-5 rounded-lg flex items-center gap-4 group hover:bg-surface-container transition-colors cursor-pointer border border-outline-variant/5">
          <div className="w-14 h-14 rounded-2xl bg-surface-container-highest flex items-center justify-center shadow-sm">
            <School className="w-8 h-8 text-primary fill-primary/20" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-bold text-lg text-on-surface">系统通知</h3>
              <span className="text-xs text-on-surface-variant/70">09:00</span>
            </div>
            <p className="text-on-surface-variant text-sm truncate">您的绩效自评报告已进入审核阶段，请留意...</p>
          </div>
        </div>
      </div>

      {/* FAB for New Message */}
      <button className="fixed bottom-32 right-6 w-16 h-16 bg-primary-fixed text-black rounded-full flex items-center justify-center shadow-2xl z-40 active:scale-90 transition-transform">
        <MessageSquarePlus className="w-8 h-8" />
      </button>
    </div>
  );
};
