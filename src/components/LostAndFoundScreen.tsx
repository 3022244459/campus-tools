import React from 'react';
import { 
  Search, 
  PlusCircle, 
  MapPin, 
  Heart, 
  Eye, 
  MessageCircle, 
  Share2 
} from 'lucide-react';

export const LostAndFoundScreen: React.FC = () => {
  return (
    <div className="space-y-8 pt-4">
      {/* Hero Section */}
      <div className="relative bg-secondary-container rounded-lg p-6 overflow-hidden flex items-center justify-between">
        <div className="z-10 max-w-[60%]">
          <h1 className="text-3xl font-black leading-tight mb-2 text-on-secondary-container">别担心！<br/>汪汪帮你找</h1>
          <p className="text-on-secondary-container opacity-80 text-sm">每天有超过100件物品回到主人身边</p>
        </div>
        <div className="absolute right-0 bottom-0 w-40 h-40 transform translate-y-4">
          <img 
            src="./images/remote-15-6b090cb29b.png" 
            alt="Detective Cat" 
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button className="bg-primary-container text-white py-6 rounded-lg flex flex-col items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform">
          <Search className="w-10 h-10 fill-white" />
          <span className="font-bold">我丢了东西</span>
        </button>
        <button className="bg-secondary text-on-secondary py-6 rounded-lg flex flex-col items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform">
          <PlusCircle className="w-10 h-10 fill-on-secondary" />
          <span className="font-bold">我捡到东西</span>
        </button>
      </div>

      {/* Section Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-on-surface">最新发布</h2>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-surface-container-highest rounded-full text-xs font-bold">全部</span>
          <span className="px-3 py-1 bg-surface-container-low text-on-surface-variant rounded-full text-xs font-bold">电子产品</span>
        </div>
      </div>

      {/* Feed Grid */}
      <div className="grid grid-cols-2 gap-4">
        <LostItemCard 
          title="蓝牙耳机 (左耳)" 
          location="西区图书馆 2F" 
          time="2小时前" 
          type="捡到" 
          typeColor="bg-secondary/80"
          img="./images/remote-16-d9a6224c65.png"
        />
        <LostItemCard 
          title="宿舍钥匙 + 挂件" 
          location="北食堂 门口" 
          time="5小时前" 
          type="丢失" 
          typeColor="bg-primary/80"
          img="./images/remote-17-6a0cb9b443.png"
        />
        
        {/* Horizontal Card */}
        <div className="bg-surface-container-lowest rounded-lg overflow-hidden flex flex-col col-span-2 shadow-sm">
          <div className="flex h-32">
            <div className="w-1/3 h-full">
              <img 
                src="./images/remote-18-252d9d8fd2.png" 
                alt="Power Bank" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="w-2/3 p-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-base mb-1">黑色小米充电宝</h3>
                  <span className="bg-secondary/80 text-white text-[10px] px-2 py-0.5 rounded-full">捡到</span>
                </div>
                <p className="text-xs text-on-surface-variant line-clamp-2">在操场台阶上捡到的，充入电量还有一半左右。</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] text-on-surface-variant">
                  <MapPin className="w-3 h-3" />
                  <span>中心体育场</span>
                </div>
                <span className="text-[10px] font-bold text-primary">昨天 18:20</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LostItemCard: React.FC<{
  title: string;
  location: string;
  time: string;
  type: string;
  typeColor: string;
  img: string;
}> = ({ title, location, time, type, typeColor, img }) => (
  <div className="bg-surface-container-lowest rounded-lg overflow-hidden flex flex-col shadow-sm group">
    <div className="h-40 w-full relative">
      <img src={img} alt={title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      <div className={`absolute top-2 left-2 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-full ${typeColor}`}>
        {type}
      </div>
    </div>
    <div className="p-3">
      <h3 className="font-bold text-sm mb-1 truncate">{title}</h3>
      <div className="flex items-center gap-1 text-[10px] text-on-surface-variant">
        <MapPin className="w-3 h-3" />
        <span>{location}</span>
      </div>
      <div className="mt-2 text-[10px] text-primary font-bold">{time}</div>
    </div>
  </div>
);
