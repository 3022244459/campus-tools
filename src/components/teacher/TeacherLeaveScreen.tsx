import React from 'react';
import { 
  ClipboardCheck, 
  UserCheck, 
  Clock, 
  Calendar, 
  ChevronRight, 
  CheckCircle, 
  XCircle, 
  Filter,
  Search
} from 'lucide-react';

export const TeacherLeaveScreen: React.FC = () => {
  return (
    <div className="space-y-8 pt-4 pb-20">
      {/* Hero Section */}
      <section className="relative bg-primary-fixed rounded-xl p-8 overflow-hidden flex items-center justify-between shadow-lg min-h-[180px]">
        <div className="z-10 max-w-[60%]">
          <h2 className="text-3xl font-black text-white leading-tight mb-2">请假审批</h2>
          <p className="text-white opacity-80 text-sm">高效处理学生请假申请，维护校园出勤秩序。</p>
        </div>
        <div className="absolute -right-4 -bottom-4 w-44 h-44">
          <ClipboardCheck className="w-full h-full text-white opacity-10" />
        </div>
      </section>

      {/* Filter & Search */}
      <section className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input 
            type="text" 
            placeholder="搜索学生姓名..." 
            className="w-full bg-surface-container-low border-none rounded-full py-3 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary-fixed"
          />
        </div>
        <button className="bg-surface-container-low p-3 rounded-full text-on-surface-variant active:scale-95 transition-transform">
          <Filter className="w-5 h-5" />
        </button>
      </section>

      {/* Pending Applications */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">待处理申请</h3>
          <span className="text-xs font-bold text-primary bg-primary-container/20 px-3 py-1 rounded-full">3 条待办</span>
        </div>

        <div className="space-y-4">
          {/* Leave Card 1 */}
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold">
                  王
                </div>
                <div>
                  <h4 className="font-bold text-on-surface">王小明</h4>
                  <p className="text-xs text-on-surface-variant">计算机 2101 班</p>
                </div>
              </div>
              <span className="text-[10px] font-black text-primary uppercase bg-primary-container/10 px-2 py-1 rounded">事假</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 py-3 border-y border-surface-container">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase">开始时间</p>
                <div className="flex items-center gap-2 text-xs font-bold">
                  <Calendar className="w-3 h-3 text-primary" />
                  <span>05-20 08:00</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase">结束时间</p>
                <div className="flex items-center gap-2 text-xs font-bold">
                  <Calendar className="w-3 h-3 text-primary" />
                  <span>05-22 18:00</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase">请假理由</p>
              <p className="text-sm text-on-surface leading-relaxed">
                因家里有急事需要回家处理，特此请假 3 天，望老师批准。
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button className="flex-1 py-3 bg-surface-container-high text-on-surface-variant font-bold rounded-xl text-sm active:scale-95 transition-transform flex items-center justify-center gap-2">
                <XCircle className="w-4 h-4" />
                驳回
              </button>
              <button className="flex-1 py-3 bg-primary-fixed text-white font-bold rounded-xl text-sm shadow-lg shadow-orange-200 active:scale-95 transition-transform flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                批准
              </button>
            </div>
          </div>

          {/* Leave Card 2 */}
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container font-bold">
                  李
                </div>
                <div>
                  <h4 className="font-bold text-on-surface">李华</h4>
                  <p className="text-xs text-on-surface-variant">外语 2203 班</p>
                </div>
              </div>
              <span className="text-[10px] font-black text-secondary uppercase bg-secondary-container/20 px-2 py-1 rounded">病假</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 py-3 border-y border-surface-container">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase">开始时间</p>
                <div className="flex items-center gap-2 text-xs font-bold">
                  <Calendar className="w-3 h-3 text-secondary" />
                  <span>05-21 14:00</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase">结束时间</p>
                <div className="flex items-center gap-2 text-xs font-bold">
                  <Calendar className="w-3 h-3 text-secondary" />
                  <span>05-21 18:00</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase">请假理由</p>
              <p className="text-sm text-on-surface leading-relaxed">
                感冒发烧，需要去校医院输液。
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button className="flex-1 py-3 bg-surface-container-high text-on-surface-variant font-bold rounded-xl text-sm active:scale-95 transition-transform flex items-center justify-center gap-2">
                <XCircle className="w-4 h-4" />
                驳回
              </button>
              <button className="flex-1 py-3 bg-primary-fixed text-white font-bold rounded-xl text-sm shadow-lg shadow-orange-200 active:scale-95 transition-transform flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                批准
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* History Link */}
      <button className="w-full py-4 bg-surface-container-low text-on-surface-variant font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform">
        <Clock className="w-5 h-5" />
        查看历史审批记录
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
