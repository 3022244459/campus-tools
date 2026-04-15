import React from 'react';
import { 
  Truck, 
  MapPin, 
  Clock, 
  FileUp, 
  Send, 
  ShieldCheck, 
  Lock,
  ChevronRight
} from 'lucide-react';

export const TeacherDocumentScreen: React.FC = () => {
  return (
    <div className="space-y-8 pt-4 pb-20">
      {/* Hero Section */}
      <section className="relative bg-secondary-fixed rounded-lg p-6 overflow-hidden flex items-center justify-between shadow-lg min-h-[160px]">
        <div className="relative z-10 max-w-[60%]">
          <h2 className="text-on-secondary-fixed font-headline font-extrabold text-2xl leading-tight">猫头鹰小使者<br/>为您效劳！</h2>
          <p className="text-on-secondary-fixed-variant text-sm mt-2 font-medium">校园文件代送，准时安全到达。</p>
        </div>
        <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-48 h-48 opacity-90">
          <img 
            src="./images/remote-29-764ca061a2.png" 
            alt="Owl Messenger" 
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      {/* Delivery Status Tracker */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-headline font-bold text-xl text-on-surface">正在配送</h3>
          <span className="text-xs font-bold bg-primary-container text-white px-3 py-1 rounded-full shadow-sm">1 个进行中</span>
        </div>
        <div className="bg-surface-container-low rounded-lg p-5 flex flex-col gap-4 shadow-sm border-l-8 border-primary">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary-container rounded-full flex items-center justify-center text-secondary">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-on-surface">期末考卷分发</p>
                <p className="text-xs text-on-surface-variant">订单号: WL20230824</p>
              </div>
            </div>
            <span className="bg-primary-fixed-dim/20 text-primary-dim text-[10px] font-black px-2 py-1 rounded-md">加急</span>
          </div>
          <div className="relative flex items-center justify-between px-2">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 bg-primary rounded-full z-10"></div>
              <span className="text-[10px] mt-1 font-bold text-on-surface-variant">行政楼</span>
            </div>
            <div className="flex-1 h-1 bg-primary-container/30 mx-2 rounded-full overflow-hidden">
              <div className="w-2/3 h-full bg-primary-container"></div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 bg-outline-variant rounded-full z-10"></div>
              <span className="text-[10px] mt-1 font-bold text-on-surface-variant">教学楼A</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <Clock className="w-4 h-4" />
            <span>预计 10 分钟后送达</span>
          </div>
        </div>
      </section>

      {/* Document Delivery Form */}
      <section className="bg-surface-container-lowest rounded-xl p-8 shadow-sm space-y-6 border border-outline-variant/10">
        <div className="border-b-2 border-surface-container pb-4">
          <h3 className="font-headline font-bold text-xl text-primary">发起代送申请</h3>
          <p className="text-sm text-on-surface-variant">填写以下信息，小使者立即出发</p>
        </div>
        <form className="space-y-5">
          <div className="space-y-4">
            {/* Pickup */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant ml-2">取件地点</label>
              <div className="relative">
                <FileUp className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                <input className="w-full bg-surface-container-low border-none rounded-lg py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary-container font-medium text-sm text-on-surface" placeholder="例如：行政楼 302" type="text"/>
              </div>
            </div>
            {/* Destination */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant ml-2">送达地点</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary w-5 h-5" />
                <input className="w-full bg-surface-container-low border-none rounded-lg py-4 pl-12 pr-4 focus:ring-2 focus:ring-secondary-container font-medium text-sm text-on-surface" placeholder="例如：图书馆 办公区" type="text"/>
              </div>
            </div>
          </div>
          {/* Urgency Chips */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant ml-2">紧急程度</label>
            <div className="flex gap-3">
              <button className="flex-1 py-3 px-4 rounded-lg bg-surface-container-low text-on-surface font-bold text-sm hover:bg-secondary-container transition-colors border-2 border-transparent focus:border-secondary-container" type="button">
                普通
              </button>
              <button className="flex-1 py-3 px-4 rounded-lg bg-primary-container text-white font-bold text-sm shadow-md scale-105" type="button">
                加急
              </button>
              <button className="flex-1 py-3 px-4 rounded-lg bg-surface-container-low text-on-surface font-bold text-sm hover:bg-secondary-container transition-colors border-2 border-transparent focus:border-secondary-container" type="button">
                定时
              </button>
            </div>
          </div>
          {/* Remarks */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant ml-2">备注信息</label>
            <textarea className="w-full bg-surface-container-low border-none rounded-lg p-4 focus:ring-2 focus:ring-primary-container font-medium text-sm text-on-surface" placeholder="请告知文件类型或特殊要求..." rows={3}></textarea>
          </div>
          {/* Submit Button */}
          <button className="w-full bg-primary-fixed text-white font-headline font-extrabold text-lg py-5 rounded-xl shadow-lg shadow-orange-200 active:scale-95 transition-all flex items-center justify-center gap-3 mt-4" type="button">
            <Send className="w-6 h-6 fill-white" />
            立即召唤代送
          </button>
        </form>
      </section>

      {/* Tips Section */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-secondary-fixed/20 p-4 rounded-lg flex items-center gap-3 shadow-sm">
          <ShieldCheck className="w-6 h-6 text-secondary" />
          <span className="text-xs font-bold text-secondary-dim">全程轨迹跟踪</span>
        </div>
        <div className="bg-primary-fixed/10 p-4 rounded-lg flex items-center gap-3 shadow-sm">
          <Lock className="w-6 h-6 text-primary" />
          <span className="text-xs font-bold text-primary-dim">隐私文件保护</span>
        </div>
      </section>
    </div>
  );
};
