import React from 'react';
import { 
  Wrench, 
  Zap, 
  Droplets, 
  Armchair, 
  Send, 
  CheckCircle, 
  Clock,
  FileText
} from 'lucide-react';

export const TeacherRepairScreen: React.FC = () => {
  return (
    <div className="space-y-8 pt-4 pb-20">
      {/* Hero Section */}
      <section className="relative bg-secondary-fixed rounded-xl p-8 overflow-hidden flex items-center justify-between shadow-lg min-h-[180px]">
        <div className="z-10 max-w-[60%]">
          <h2 className="text-3xl font-black text-on-secondary-fixed leading-tight mb-2">师傅马上就到！</h2>
          <p className="text-on-secondary-fixed opacity-80 text-sm">校园设施报修，高效响应，温暖守护办公每一刻。</p>
        </div>
        <div className="absolute -right-4 -bottom-6 w-40 h-40">
          <img 
            src="./images/remote-39-6dd606361a.png" 
            alt="Handyman Monkey" 
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      {/* Quick Submit Categories */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <h3 className="text-2xl font-bold tracking-tight">快捷报修项目</h3>
          <span className="text-xs font-bold text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full">选择分类</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <CategoryCard icon={<Zap className="w-8 h-8 fill-primary-container" />} label="电力维修" color="border-primary-container" bgColor="bg-primary-container/20" />
          <CategoryCard icon={<Droplets className="w-8 h-8 fill-secondary" />} label="水利管道" color="border-secondary-fixed" bgColor="bg-secondary-fixed/20" />
          <CategoryCard icon={<Armchair className="w-8 h-8 fill-tertiary" />} label="桌椅家具" color="border-tertiary-fixed" bgColor="bg-tertiary-fixed/20" fullWidth />
        </div>
      </section>

      {/* Detailed Submission Module */}
      <section className="bg-surface-container-low p-8 rounded-xl space-y-6 shadow-sm">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary-fixed" />
          详细报修申请
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold ml-2 text-on-surface-variant">故障位置</label>
            <input className="w-full bg-surface-container-highest border-none rounded-lg p-4 focus:ring-2 focus:ring-primary-fixed text-on-surface placeholder:text-on-surface-variant/50" placeholder="例如：博学楼 302 办公室" type="text"/>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold ml-2 text-on-surface-variant">故障描述</label>
            <textarea className="w-full bg-surface-container-highest border-none rounded-lg p-4 focus:ring-2 focus:ring-primary-fixed text-on-surface placeholder:text-on-surface-variant/50" placeholder="请简述损坏情况..." rows={3}></textarea>
          </div>
          <button className="w-full bg-primary-fixed text-white font-bold py-5 rounded-full shadow-lg shadow-orange-200 active:scale-95 transition-transform flex items-center justify-center gap-2">
            <Send className="w-5 h-5" />
            立即提交报修
          </button>
        </div>
      </section>

      {/* Progress Tracker */}
      <section className="pb-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">报修进度轨迹</h3>
          <button className="text-sm font-bold text-primary">全部记录</button>
        </div>
        <div className="space-y-4">
          {/* Status Card 1 */}
          <div className="bg-surface-container-lowest p-5 rounded-lg flex items-start gap-4 shadow-sm relative overflow-hidden border border-outline-variant/10">
            <div className="absolute top-0 right-0 px-4 py-1 bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold rounded-bl-lg">处理中</div>
            <div className="w-12 h-12 bg-secondary-fixed/10 rounded-lg flex items-center justify-center text-secondary shrink-0">
              <Zap className="w-6 h-6 fill-secondary" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-on-surface">空调无法通电</h4>
              <p className="text-xs text-on-surface-variant mt-1">办公楼 405 室 - 刚才</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-1.5 w-16 bg-secondary-fixed rounded-full"></div>
                <div className="h-1.5 w-16 bg-surface-container rounded-full"></div>
                <span className="text-[10px] font-bold text-secondary">王师傅已接单</span>
              </div>
            </div>
          </div>
          {/* Status Card 2 */}
          <div className="bg-surface-container-lowest p-5 rounded-lg flex items-start gap-4 shadow-sm opacity-80 border border-outline-variant/10">
            <div className="absolute top-0 right-0 px-4 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-bl-lg">已完成</div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600 shrink-0">
              <CheckCircle className="w-6 h-6 fill-green-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-on-surface">洗手池漏水</h4>
              <p className="text-xs text-on-surface-variant mt-1">教学楼 A座 2层 - 昨天</p>
              <p className="text-[10px] text-on-surface-variant mt-2 italic">“维修非常迅速，好评！”</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const CategoryCard: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  color: string; 
  bgColor: string;
  fullWidth?: boolean;
}> = ({ icon, label, color, bgColor, fullWidth }) => (
  <button className={`${fullWidth ? 'col-span-2' : 'col-span-1'} bg-surface-container-lowest p-6 rounded-lg shadow-sm border-b-4 ${color} flex flex-col items-center gap-3 active:scale-95 transition-transform`}>
    <div className={`w-14 h-14 ${bgColor} rounded-full flex items-center justify-center`}>
      {icon}
    </div>
    <span className="font-bold text-on-surface">{label}</span>
  </button>
);
