import React from 'react';
import { 
  Calculator, 
  MapPin, 
  Tag, 
  ArrowRight,
  Bell
} from 'lucide-react';

export const CourierCompareScreen: React.FC = () => {
  return (
    <div className="space-y-8 pt-4">
      {/* Hero Section */}
      <section className="relative bg-secondary-fixed-dim rounded-lg p-6 overflow-hidden shadow-sm">
        <div className="relative z-10 w-2/3">
          <h1 className="text-3xl font-black text-on-secondary-fixed leading-tight mb-2">快递比价</h1>
          <p className="text-on-secondary-fixed-variant text-sm opacity-90">全校快递 一键查询<br/>省钱又省心</p>
        </div>
        <div className="absolute right-[-10px] bottom-[-10px] w-48 h-48">
          <img 
            src="./images/remote-06-3b9ca81ec0.png" 
            alt="Monkey Mascot" 
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      {/* Parameters */}
      <section className="bg-surface-container-highest rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-on-surface font-bold text-lg">寄件参数</h2>
          <Calculator className="w-5 h-5 text-primary fill-primary" />
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-on-surface-variant mb-1 block">包裹重量 (kg)</label>
            <input className="w-full bg-surface-container-lowest border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary text-on-surface font-medium" placeholder="1.0" type="number"/>
          </div>
          <div>
            <label className="text-xs font-bold text-on-surface-variant mb-1 block">目的地</label>
            <div className="flex items-center bg-surface-container-lowest rounded-xl px-4">
              <MapPin className="w-4 h-4 text-on-surface-variant mr-2" />
              <input className="w-full bg-transparent border-none py-3 px-0 focus:ring-0 text-on-surface font-medium placeholder:text-outline/50" placeholder="请输入收件省市区" type="text"/>
            </div>
          </div>
        </div>
        <button className="w-full bg-primary-container text-white font-bold py-4 rounded-xl mt-6 active:scale-95 transition-all shadow-lg shadow-primary-container/20">
          立即比价
        </button>
      </section>

      {/* Results */}
      <section>
        <div className="flex justify-between items-end mb-4 px-2">
          <h2 className="text-2xl font-black text-on-surface tracking-tight">推荐方案</h2>
          <span className="text-xs font-bold text-primary">实时汇率</span>
        </div>
        <div className="space-y-4">
          <PriceCard company="顺丰" title="顺丰标快" time="1-2" price="12.0" tag="时效首选" tagColor="bg-error/10 text-error" logoColor="bg-on-background" />
          <PriceCard company="中通" title="中通快递" time="3-4" price="8.5" tag="学生专享" tagColor="bg-secondary/10 text-secondary" logoColor="bg-[#004d69]" />
          <PriceCard company="圆通" title="圆通速递" time="3-4" price="8.0" tag="常规路线" tagColor="bg-on-surface-variant/10 text-on-surface-variant/50" logoColor="bg-[#854a51]" />
          <PriceCard company="邮政" title="中国邮政" time="4-5" price="6.5" tag="偏远直达" tagColor="bg-green-100 text-green-700" logoColor="bg-green-700" />
        </div>
      </section>

      {/* Tip */}
      <section className="mb-6">
        <div className="bg-secondary-container rounded-lg p-5 relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="font-bold text-on-secondary-container text-lg mb-1">寄件小贴士</h4>
            <p className="text-xs text-on-secondary-container opacity-80 max-w-[70%]">在宿舍楼下服务点投递，每单可额外享受 ¥1.0 校园补贴。</p>
          </div>
          <Tag className="absolute right-[-10px] bottom-[-20px] w-24 h-24 opacity-30 rotate-12" />
        </div>
      </section>
    </div>
  );
};

const PriceCard: React.FC<{ 
  company: string; 
  title: string; 
  time: string; 
  price: string; 
  tag: string; 
  tagColor: string;
  logoColor: string;
}> = ({ company, title, time, price, tag, tagColor, logoColor }) => (
  <div className="bg-surface-container-lowest rounded-lg p-5 flex items-center justify-between group hover:bg-surface-container-high transition-colors shadow-sm">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 ${logoColor} rounded-full flex items-center justify-center text-white font-black text-sm`}>
        {company}
      </div>
      <div>
        <h3 className="font-bold text-on-surface">{title}</h3>
        <p className="text-xs text-on-surface-variant">预计 {time} 天送达</p>
      </div>
    </div>
    <div className="text-right">
      <div className="text-xl font-black text-primary">¥{price}</div>
      <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${tagColor}`}>{tag}</div>
    </div>
  </div>
);
