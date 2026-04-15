import React from 'react';
import { 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Truck, 
  Compass, 
  PlusCircle,
  User,
  Users,
  History
} from 'lucide-react';

export const TeacherCourierScreen: React.FC = () => {
  return (
    <div className="space-y-8 pt-4 pb-20">
      {/* Hero Section */}
      <section className="relative bg-secondary-fixed rounded-xl p-8 overflow-hidden flex items-center justify-between shadow-lg min-h-[200px]">
        <div className="z-10 max-w-[60%]">
          <h2 className="font-headline font-extrabold text-3xl text-on-secondary-fixed mb-2 leading-tight">快递代取</h2>
          <p className="text-on-secondary-fixed-variant text-sm font-medium">老师，您的包裹已进入配送轨道，邮差考拉为您护航！</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-surface-container-lowest/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm">
            <Package className="w-4 h-4 text-primary-fixed fill-primary-fixed" />
            <span className="text-xs font-bold text-on-surface">待取件 3</span>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 w-48 h-48 translate-x-4 translate-y-4">
          <img 
            src="./images/remote-28-4ea4ac9770.png" 
            alt="Postman Koala" 
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      {/* Filters Section */}
      <section className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        <button className="flex-none px-6 py-3 bg-primary-fixed text-white rounded-full font-bold shadow-md flex items-center gap-2">
          <User className="w-4 h-4" />
          我的快递
        </button>
        <button className="flex-none px-6 py-3 bg-surface-container-high text-on-surface-variant rounded-full font-bold flex items-center gap-2">
          <Users className="w-4 h-4" />
          学生互助
        </button>
        <button className="flex-none px-6 py-3 bg-surface-container-high text-on-surface-variant rounded-full font-bold flex items-center gap-2">
          <History className="w-4 h-4" />
          历史记录
        </button>
      </section>

      {/* Package List */}
      <div className="grid grid-cols-1 gap-6">
        {/* Package Card 1: Pending */}
        <div className="bg-surface-container-lowest rounded-lg p-6 shadow-sm relative overflow-hidden group border-l-8 border-primary-fixed">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary-fixed mb-1 block">SF EXPRESS • 顺丰速运</span>
              <h3 className="font-headline font-bold text-xl text-on-surface">办公用纸与耗材</h3>
            </div>
            <div className="bg-primary-container/10 text-primary-fixed px-3 py-1 rounded-full text-xs font-black">
              待取件
            </div>
          </div>
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-on-surface-variant" />
              <span className="text-sm text-on-surface-variant font-medium">2号教学楼 快递柜 402</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-on-surface-variant" />
              <span className="text-sm text-on-surface-variant font-medium">请在 20:00 前取出</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex-1 py-3 bg-secondary-fixed text-on-secondary-fixed font-bold rounded-full active:scale-95 transition-all text-sm">查看取件码</button>
            <button className="flex-1 py-3 bg-primary-fixed text-white font-bold rounded-full active:scale-95 transition-all text-sm shadow-sm">委托代取</button>
          </div>
        </div>

        {/* Package Card 2: In Transit */}
        <div className="bg-surface-container-lowest rounded-lg p-6 shadow-sm relative overflow-hidden border-l-8 border-secondary-fixed">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-secondary-dim mb-1 block">JD LOGISTICS • 京东快递</span>
              <h3 className="font-headline font-bold text-xl text-on-surface">教学投影仪配件</h3>
            </div>
            <div className="bg-secondary-container/20 text-secondary-dim px-3 py-1 rounded-full text-xs font-black">
              运输中
            </div>
          </div>
          <div className="relative h-24 mb-4 rounded-xl overflow-hidden bg-surface-container-low">
            <div className="absolute inset-0 bg-gradient-to-r from-secondary-fixed/20 to-transparent"></div>
            <div className="absolute top-1/2 left-4 -translate-y-1/2 flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Truck className="w-6 h-6 text-secondary fill-secondary" />
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface">正在配送至校区...</p>
                <p className="text-[10px] text-on-surface-variant">预计 14:30 送达</p>
              </div>
            </div>
            <Compass className="absolute right-[-20px] bottom-[-20px] w-32 h-32 text-on-surface-variant opacity-10" />
          </div>
          <button className="w-full py-3 bg-surface-container text-on-surface-variant font-bold rounded-full active:scale-95 transition-all text-sm">查看详情</button>
        </div>

        {/* Tip Card */}
        <div className="bg-secondary-fixed-dim rounded-lg p-6 relative overflow-hidden flex flex-col justify-between shadow-lg">
          <div className="relative z-10">
            <h4 className="font-headline font-bold text-xl text-on-secondary-fixed mb-2">校园代取小贴士</h4>
            <p className="text-sm text-on-secondary-fixed-variant leading-relaxed">近期包裹较多，若老师不便前往，可在下方发布代取请求，学生志愿者将为您送到办公室。</p>
          </div>
          <div className="relative z-10 mt-6">
            <button className="bg-white px-6 py-2 rounded-full text-sm font-black text-secondary-dim shadow-md">发布代取</button>
          </div>
          <div className="absolute right-4 bottom-[-10px] opacity-20 pointer-events-none">
            <Compass className="w-32 h-32 text-on-secondary-fixed" />
          </div>
        </div>
      </div>

      {/* FAB */}
      <button className="fixed right-6 bottom-28 w-16 h-16 bg-primary-fixed text-white rounded-full shadow-2xl flex items-center justify-center z-50 active:scale-90 transition-transform">
        <PlusCircle className="w-8 h-8" />
      </button>
    </div>
  );
};
