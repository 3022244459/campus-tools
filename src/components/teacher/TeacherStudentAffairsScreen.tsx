import React from 'react';
import { 
  Award, 
  Megaphone, 
  Calendar, 
  MapPin, 
  ChevronRight, 
  CheckCircle, 
  XCircle, 
  Clock,
  School
} from 'lucide-react';

export const TeacherStudentAffairsScreen: React.FC = () => {
  return (
    <div className="space-y-8 pt-4 pb-20">
      {/* Hero Section */}
      <section className="relative mb-10 mt-4 overflow-visible">
        <div className="bg-secondary-fixed p-8 rounded-lg relative overflow-hidden flex items-end justify-between min-h-[180px] shadow-lg">
          <div className="relative z-10">
            <p className="text-on-secondary-fixed font-bold text-sm mb-1">教师工作台</p>
            <h2 className="text-3xl font-black text-on-secondary-fixed leading-tight">学生事务中心</h2>
            <p className="text-on-secondary-fixed/80 mt-2 font-medium">早上好，大象教授！</p>
          </div>
          <div className="absolute -top-6 -right-4 w-48 h-48 z-0">
            <img 
              src="./images/remote-41-b9297c8836.png" 
              alt="Professor Elephant" 
              className="w-full h-full object-contain transform rotate-[-5deg]"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Stats Summary Bento Grid */}
      <section className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-surface-container-highest p-5 rounded-lg flex flex-col items-center justify-center text-center shadow-sm">
          <span className="text-3xl font-black text-primary">12</span>
          <span className="text-xs font-bold text-on-surface-variant mt-1">待审批</span>
        </div>
        <div className="bg-surface-container-low p-5 rounded-lg flex flex-col items-center justify-center text-center border-2 border-primary/10 shadow-sm">
          <span className="text-3xl font-black text-secondary">85</span>
          <span className="text-xs font-bold text-on-surface-variant mt-1">已通过</span>
        </div>
        <div className="bg-surface-container-low p-5 rounded-lg flex flex-col items-center justify-center text-center border-2 border-error/5 shadow-sm">
          <span className="text-3xl font-black text-on-surface-variant">4</span>
          <span className="text-xs font-bold text-on-surface-variant mt-1">已驳回</span>
        </div>
      </section>

      {/* Applications List Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black text-on-surface">待审批列表</h3>
          <button className="text-primary font-bold text-sm flex items-center gap-1">
            全部 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-6">
          {/* Application Card 1 */}
          <div className="bg-surface-container-lowest rounded-lg p-6 shadow-sm relative border border-outline-variant/10">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center">
                  <Award className="w-6 h-6 text-on-secondary-container fill-on-secondary-container" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-on-surface">国家励志奖学金</h4>
                  <p className="text-xs text-on-surface-variant font-medium">申请人：张晓华 (计算机系)</p>
                </div>
              </div>
              <span className="bg-primary-container/10 text-primary px-3 py-1 rounded-full text-[10px] font-black tracking-wider">奖学金类</span>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-6 italic bg-surface-container-low/50 p-3 rounded">
              "在校期间表现优异，专业排名前3%，积极参与社会实践活动..."
            </p>
            <div className="flex gap-3">
              <button className="flex-1 py-3 px-4 bg-secondary-fixed text-on-secondary-fixed rounded-xl font-bold text-sm active:scale-95 transition-all">驳回</button>
              <button className="flex-1 py-3 px-4 bg-primary-container text-white rounded-xl font-bold text-sm active:scale-95 transition-all shadow-lg shadow-orange-200">批准</button>
            </div>
          </div>

          {/* Application Card 2 */}
          <div className="bg-surface-container-lowest rounded-lg p-6 shadow-sm relative border border-outline-variant/10">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-tertiary-container flex items-center justify-center">
                  <Megaphone className="w-6 h-6 text-on-tertiary-container fill-on-tertiary-container" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-on-surface">校园吉他社公演许可</h4>
                  <p className="text-xs text-on-surface-variant font-medium">申请人：李沐风 (艺术学院)</p>
                </div>
              </div>
              <span className="bg-secondary-container/20 text-secondary px-3 py-1 rounded-full text-[10px] font-black tracking-wider">活动许可</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold text-on-surface-variant mb-6">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> 11月25日</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> 卧龙广场</span>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 py-3 px-4 bg-secondary-fixed text-on-secondary-fixed rounded-xl font-bold text-sm active:scale-95 transition-all">驳回</button>
              <button className="flex-1 py-3 px-4 bg-primary-container text-white rounded-xl font-bold text-sm active:scale-95 transition-all shadow-lg shadow-orange-200">批准</button>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Branding Footer Hint */}
      <div className="mt-12 text-center opacity-30 pb-12">
        <p className="font-headline font-black tracking-widest text-[#482702]">HBUAS WOLONG CAMPUS</p>
      </div>
    </div>
  );
};
