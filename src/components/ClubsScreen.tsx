import React from 'react';
import { 
  Music, 
  Palette, 
  Trophy, 
  Heart, 
  Eye, 
  MessageCircle, 
  Share2,
  Camera
} from 'lucide-react';

export const ClubsScreen: React.FC = () => {
  return (
    <div className="space-y-8 pt-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-secondary-container rounded-lg p-6 flex items-center justify-between shadow-sm">
        <div className="z-10 max-w-[60%]">
          <h2 className="text-3xl font-extrabold text-on-secondary-container leading-tight">发现<br/>你的色彩</h2>
          <p className="text-on-secondary-container/80 text-sm mt-2 font-medium">120+ 热门社团正在招新</p>
          <button className="mt-4 bg-primary-fixed text-on-primary-fixed font-bold py-2 px-6 rounded-full text-sm shadow-lg transform transition active:scale-95">活动报名</button>
        </div>
        <div className="absolute right-[-20px] bottom-[-10px] w-48 h-48">
          <img 
            src="./images/remote-03-d238208209.png" 
            alt="Rabbit Mascot" 
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      {/* Hot Clubs */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-xl font-extrabold">热门社团</h3>
            <p className="text-on-surface-variant text-xs">大家都在关注的圈子</p>
          </div>
          <span className="text-primary font-bold text-xs cursor-pointer">查看全部</span>
        </div>
        <div className="flex overflow-x-auto gap-4 no-scrollbar -mx-4 px-4">
          <ClubChip icon={<Music className="w-6 h-6" />} label="吉他社" members="2.4k" color="bg-secondary-fixed-dim" />
          <ClubChip icon={<Palette className="w-6 h-6" />} label="动漫艺术" members="1.8k" color="bg-primary-container" />
          <ClubChip icon={<Trophy className="w-6 h-6" />} label="街球联盟" members="3.1k" color="bg-tertiary-container" />
        </div>
      </section>

      {/* Feed */}
      <section className="space-y-6">
        <h3 className="text-xl font-extrabold">社团动态</h3>
        
        <article className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm transition-transform active:scale-[0.98]">
          <div className="h-48 w-full relative">
            <img 
              src="./images/remote-04-46876cabcf.png" 
              alt="Poster" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 left-4 bg-primary-fixed text-on-primary-fixed text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">即将开始</div>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-secondary-fixed"></div>
              <span className="text-xs font-bold text-on-surface-variant">街舞社 · 2小时前</span>
            </div>
            <h4 className="text-lg font-bold leading-tight">卧龙校区街舞大奖赛：报名通道正式开启！</h4>
            <p className="text-on-surface-variant text-sm line-clamp-2">展示你的舞姿，赢取丰厚奖品。今年更有神秘嘉宾助阵，快来加入我们的节奏之战...</p>
            <div className="flex justify-between items-center pt-2">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full border-2 border-white bg-orange-200"></div>
                <div className="w-6 h-6 rounded-full border-2 border-white bg-blue-200"></div>
                <div className="w-6 h-6 rounded-full border-2 border-white bg-pink-200"></div>
                <div className="text-[10px] flex items-center pl-4 font-medium text-on-surface-variant">+42 报名</div>
              </div>
              <Heart className="w-5 h-5 text-primary fill-primary cursor-pointer" />
            </div>
          </div>
        </article>

        <article className="bg-secondary-fixed-dim/20 rounded-lg p-5 flex gap-4 items-start relative overflow-hidden">
          <div className="flex-1 space-y-2 z-10">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-tighter">专题讲座</span>
            <h4 className="font-bold text-base">摄影社：从构图到光影的魔法</h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">主讲：校报资深摄影师 张同学<br/>地点：行政楼 302</p>
            <button className="bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold px-4 py-1.5 rounded-full mt-2">点击收藏</button>
          </div>
          <div className="w-24 h-24 rounded-lg overflow-hidden z-10">
            <img 
              src="./images/remote-05-484e7b318e.png" 
              alt="Camera" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <Camera className="absolute -bottom-6 -right-6 w-32 h-32 text-secondary-fixed-dim/10 pointer-events-none" />
        </article>
      </section>
    </div>
  );
};

const ClubChip: React.FC<{ icon: React.ReactNode; label: string; members: string; color: string }> = ({ icon, label, members, color }) => (
  <div className="flex-shrink-0 w-40 bg-surface-container-lowest rounded-lg p-4 shadow-sm border-b-4 border-black/5">
    <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center mb-3 text-white`}>
      {icon}
    </div>
    <p className="font-bold text-sm">{label}</p>
    <p className="text-[10px] text-on-surface-variant mt-1">{members} 成员</p>
  </div>
);
