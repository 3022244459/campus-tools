import React from 'react';
import { 
  Library, 
  Users, 
  Clock, 
  Calendar, 
  Search, 
  ChevronRight, 
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const TeacherStudyRoomScreen: React.FC = () => {
  return (
    <div className="space-y-8 pt-4 pb-20">
      {/* Hero Section */}
      <section className="relative bg-secondary-fixed rounded-xl p-8 overflow-hidden flex items-center justify-between shadow-lg min-h-[180px]">
        <div className="z-10 max-w-[60%]">
          <h2 className="text-3xl font-black text-on-secondary-fixed leading-tight mb-2">研讨室管理</h2>
          <p className="text-on-secondary-fixed opacity-80 text-sm">为学术交流提供静谧空间，轻松管理实验室与研讨室。</p>
        </div>
        <div className="absolute -right-4 -bottom-4 w-44 h-44">
          <div className="w-full h-full rounded-full bg-white/10 blur-md" />
          <Library className="absolute inset-0 m-auto w-24 h-24 text-on-secondary-fixed opacity-10" />
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container-low p-5 rounded-lg border-l-4 border-primary shadow-sm">
          <p className="text-xs font-bold text-on-surface-variant mb-1">今日预约</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-on-surface">12</span>
            <span className="text-[10px] text-on-surface-variant">场次</span>
          </div>
        </div>
        <div className="bg-surface-container-low p-5 rounded-lg border-l-4 border-secondary shadow-sm">
          <p className="text-xs font-bold text-on-surface-variant mb-1">当前使用中</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-on-surface">5</span>
            <span className="text-[10px] text-on-surface-variant">房间</span>
          </div>
        </div>
      </section>

      {/* Room Management List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">房间状态</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input 
              type="text" 
              placeholder="搜索房间..." 
              className="bg-surface-container-highest border-none rounded-full py-2 pl-9 pr-4 text-xs font-medium focus:ring-2 focus:ring-primary-fixed"
            />
          </div>
        </div>

        <div className="space-y-4">
          {/* Room Item 1 */}
          <div className="bg-surface-container-lowest p-5 rounded-lg shadow-sm border border-outline-variant/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-on-surface">研讨室 201</h4>
                <p className="text-xs text-on-surface-variant">容纳: 8人 | 设备: 智慧屏</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded">空闲中</span>
              <ChevronRight className="w-4 h-4 text-on-surface-variant inline ml-2" />
            </div>
          </div>

          {/* Room Item 2 */}
          <div className="bg-surface-container-lowest p-5 rounded-lg shadow-sm border border-outline-variant/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-on-surface">实验室 405</h4>
                <p className="text-xs text-on-surface-variant">容纳: 20人 | 设备: 示波器</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-2 py-1 rounded">使用中</span>
              <ChevronRight className="w-4 h-4 text-on-surface-variant inline ml-2" />
            </div>
          </div>

          {/* Room Item 3 */}
          <div className="bg-surface-container-lowest p-5 rounded-lg shadow-sm border border-outline-variant/10 flex items-center justify-between opacity-60">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-on-surface">研讨室 102</h4>
                <p className="text-xs text-on-surface-variant">容纳: 6人 | 维护中</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-1 rounded">不可用</span>
              <ChevronRight className="w-4 h-4 text-on-surface-variant inline ml-2" />
            </div>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="grid grid-cols-2 gap-4">
        <button className="bg-primary-fixed text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-200 active:scale-95 transition-transform flex items-center justify-center gap-2">
          <Calendar className="w-5 h-5" />
          排课管理
        </button>
        <button className="bg-secondary-fixed text-on-secondary-fixed font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2">
          <Users className="w-5 h-5" />
          预约审核
        </button>
      </section>

      {/* Tip Card */}
      <section className="bg-surface-container-highest p-6 rounded-xl flex items-start gap-4">
        <Info className="w-6 h-6 text-primary-fixed shrink-0" />
        <p className="text-xs text-on-surface-variant leading-relaxed">
          老师，您可以点击房间查看详细的使用记录和未来的预约计划。如需紧急锁定房间，请前往“排课管理”进行操作。
        </p>
      </section>
    </div>
  );
};
