import React from 'react';
import { 
  QrCode, 
  UserCheck, 
  History, 
  ChevronRight, 
  Lightbulb, 
  Building2 
} from 'lucide-react';

export const CourierScreen: React.FC = () => {
  return (
    <div className="space-y-8 pt-4">
      {/* Hero Section */}
      <section className="relative bg-secondary-container/30 rounded-lg p-6 flex items-center justify-between overflow-hidden">
        <div className="z-10 flex-1">
          <h2 className="text-3xl font-black tracking-tight text-on-surface mb-1">
            你有 <span className="text-primary-fixed">3</span> 件包裹
          </h2>
          <p className="text-on-surface-variant font-medium">快去快递站领回家吧！</p>
          <div className="mt-4">
            <button className="bg-primary-fixed text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-primary/20 flex items-center gap-2 active:scale-95 transition-transform">
              <QrCode className="w-4 h-4" />
              扫码取件
            </button>
          </div>
        </div>
        <div className="relative w-32 h-32 flex-shrink-0 -mr-4 -mb-4">
          <img 
            src="./images/remote-07-670a0bd58f.png" 
            alt="Fox Mascot" 
            className="w-full h-full object-contain drop-shadow-xl"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container-highest/60 p-4 rounded-lg flex flex-col items-center gap-2 text-center hover:bg-surface-container-highest transition-colors cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary">
            <UserCheck className="w-7 h-7" />
          </div>
          <span className="font-bold text-sm text-on-surface">代领申请</span>
        </div>
        <div className="bg-surface-container-highest/60 p-4 rounded-lg flex flex-col items-center gap-2 text-center hover:bg-surface-container-highest transition-colors cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-tertiary-container flex items-center justify-center text-tertiary">
            <History className="w-7 h-7" />
          </div>
          <span className="font-bold text-sm text-on-surface">取件历史</span>
        </div>
      </section>

      {/* Pending Packages */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xl font-extrabold text-on-surface">待取包裹</h3>
          <span className="text-xs font-bold text-on-surface-variant bg-surface-container-low px-3 py-1 rounded-full">沃龙校区驿站</span>
        </div>

        <PackageCard 
          title="天猫超市包裹" 
          code="2-4-3012" 
          location="1号货架 A区" 
          tag="今天到达" 
          tagColor="bg-secondary-container text-on-secondary-container"
          icon="./images/remote-08-da7557d24e.png"
        />
        <PackageCard 
          title="顺丰速运" 
          code="5-1-1088" 
          location="5号货架 C区" 
          tag="待取 2天" 
          tagColor="bg-surface-container-high text-on-surface-variant"
          icon="./images/remote-09-046b88fbc2.png"
        />
        <PackageCard 
          title="拼多多包裹" 
          code="1-2-0045" 
          location="大件区" 
          tag="待取 3天" 
          tagColor="bg-surface-container-high text-on-surface-variant"
          icon="./images/remote-10-f909a49b37.png"
          opacity="opacity-80"
        />
      </section>

      {/* Tip Card */}
      <section className="bg-secondary-fixed-dim/40 rounded-lg p-5 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-5 h-5 text-secondary fill-secondary" />
            <span className="font-bold text-sm text-secondary">温馨提示</span>
          </div>
          <p className="text-on-secondary-container text-xs leading-relaxed font-medium">
            驿站营业时间：08:00 - 21:00。<br />
            若长时间未取件，系统将自动发起退回预警哦！
          </p>
        </div>
        <div className="absolute -right-4 -bottom-6 opacity-10 pointer-events-none transform -rotate-12">
          <Building2 className="w-32 h-32" />
        </div>
      </section>
    </div>
  );
};

const PackageCard: React.FC<{
  title: string;
  code: string;
  location: string;
  tag: string;
  tagColor: string;
  icon: string;
  opacity?: string;
}> = ({ title, code, location, tag, tagColor, icon, opacity = "" }) => (
  <div className={`bg-surface-container-lowest rounded-lg p-5 shadow-sm border-b-4 border-surface-variant flex gap-4 items-center ${opacity}`}>
    <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
      <img src={icon} alt="Parcel Icon" className="w-10 h-10" referrerPolicy="no-referrer" />
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-lg leading-tight">{title}</h4>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${tagColor}`}>{tag}</span>
      </div>
      <p className="text-xs text-on-surface-variant mt-1">取件码：<span className="text-primary font-black">{code}</span></p>
      <p className="text-[10px] text-outline mt-1 font-medium">存放地：{location}</p>
    </div>
    <ChevronRight className="w-5 h-5 text-outline-variant" />
  </div>
);
