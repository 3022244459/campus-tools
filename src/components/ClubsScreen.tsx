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
import {IntegrationPendingNote} from './IntegrationPendingNote';

export const ClubsScreen: React.FC = () => {
  const [message, setMessage] = React.useState('');
  const [registeredClub, setRegisteredClub] = React.useState('');
  const [detail, setDetail] = React.useState<{
    name: string;
    title: string;
    desc: string;
    members: string;
    activity: string;
  } | null>(null);

  function openDetail(name: string, title: string, desc: string, members: string, activity: string) {
    setDetail({name, title, desc, members, activity});
    setMessage('');
  }

  return (
    <div className="space-y-8 pt-4">
      <IntegrationPendingNote />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-secondary-container rounded-lg p-6 flex items-center justify-between shadow-sm">
        <div className="z-10 max-w-[60%]">
          <h2 className="text-3xl font-extrabold text-on-secondary-container leading-tight">发现<br/>你的色彩</h2>
          <p className="text-on-secondary-container/80 text-sm mt-2 font-medium">120+ 热门社团正在招新</p>
          <button
            type="button"
            onClick={() => openDetail('社团招新中心', '天津大学社团联合招新', '浏览各类社团详情，选择感兴趣的组织后再报名。', '120+ 社团', '本周五 北洋广场')}
            className="mt-4 bg-primary text-white font-bold py-2 px-6 rounded-full text-sm active:scale-95 transition-transform"
          >
            浏览社团
          </button>
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

      {message ? (
        <section className="rounded-lg bg-primary-container/15 px-4 py-3 text-sm font-bold text-primary">
          {message}
        </section>
      ) : null}

      {/* Hot Clubs */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-xl font-extrabold">热门社团</h3>
            <p className="text-on-surface-variant text-xs">大家都在关注的圈子</p>
          </div>
          <button
            className="text-primary font-bold text-xs cursor-pointer active:scale-95"
            type="button"
            onClick={() => setMessage('已展开热门社团：吉他社、动漫艺术、街球联盟、摄影社、街舞社。')}
          >
            查看全部
          </button>
        </div>
        <div className="flex overflow-x-auto gap-4 no-scrollbar -mx-4 px-4">
          <ClubChip icon={<Music className="w-6 h-6" />} label="吉他社" members="2.4k" color="bg-secondary-fixed-dim" onClick={() => openDetail('吉他社', '北洋园草坪音乐夜', '面向零基础和进阶同学开放，提供民谣吉他、电吉他和乐队排练。', '2.4k 成员', '周三 19:00 学生活动中心')} />
          <ClubChip icon={<Palette className="w-6 h-6" />} label="动漫艺术" members="1.8k" color="bg-primary-container" onClick={() => openDetail('动漫艺术社', '角色设计公开课', '包含插画、手办、漫画分镜与同人创作交流。', '1.8k 成员', '周六 14:00 北洋园活动室')} />
          <ClubChip icon={<Trophy className="w-6 h-6" />} label="街球联盟" members="3.1k" color="bg-tertiary-container" onClick={() => openDetail('街球联盟', '三人篮球挑战赛', '组织校内篮球训练、约战和新生杯赛事。', '3.1k 成员', '每天 18:30 东区球场')} />
        </div>
      </section>

      {detail ? (
        <section className="rounded-xl bg-surface-container-lowest p-5 shadow-sm space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black text-primary uppercase tracking-widest">{detail.name}</p>
              <h3 className="mt-1 text-2xl font-black text-on-surface">{detail.title}</h3>
              <p className="mt-2 text-sm font-medium leading-relaxed text-on-surface-variant">{detail.desc}</p>
            </div>
            <button className="rounded-full bg-surface-container-low px-3 py-1 text-xs font-bold text-on-surface-variant" type="button" onClick={() => setDetail(null)}>
              关闭
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-secondary-container/40 p-4">
              <p className="text-[10px] font-bold text-on-surface-variant">成员规模</p>
              <p className="text-lg font-black text-on-surface">{detail.members}</p>
            </div>
            <div className="rounded-xl bg-primary-container/15 p-4">
              <p className="text-[10px] font-bold text-on-surface-variant">近期活动</p>
              <p className="text-sm font-black text-on-surface">{detail.activity}</p>
            </div>
          </div>
          {registeredClub === detail.name ? (
            <div className="rounded-xl bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
              报名已提交，负责人会在消息中心联系你。
            </div>
          ) : null}
          <button
            className="w-full rounded-xl bg-primary-fixed py-4 text-sm font-black text-on-primary-fixed active:scale-95"
            type="button"
            onClick={() => {
              setRegisteredClub(detail.name);
              setMessage(`${detail.name} 报名已提交，负责人会在消息中心联系你。`);
            }}
          >
            {registeredClub === detail.name ? '已报名' : '报名加入'}
          </button>
        </section>
      ) : null}

      {/* Feed */}
      <section className="space-y-6">
        <h3 className="text-xl font-extrabold">社团动态</h3>
        
        <article
          className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm transition-transform active:scale-[0.98] cursor-pointer"
          role="button"
          tabIndex={0}
          onClick={() => openDetail('街舞社', '北洋园校区街舞大奖赛', '展示你的舞姿，赢取丰厚奖品。今年更有神秘嘉宾助阵。', '860 成员', '周五 19:30 北洋广场')}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              openDetail('街舞社', '北洋园校区街舞大奖赛', '展示你的舞姿，赢取丰厚奖品。今年更有神秘嘉宾助阵。', '860 成员', '周五 19:30 北洋广场');
            }
          }}
        >
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
            <h4 className="text-lg font-bold leading-tight">北洋园校区街舞大奖赛：报名通道正式开启！</h4>
            <p className="text-on-surface-variant text-sm line-clamp-2">展示你的舞姿，赢取丰厚奖品。今年更有神秘嘉宾助阵，快来加入我们的节奏之战...</p>
            <div className="flex justify-between items-center pt-2">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full border-2 border-white bg-orange-200"></div>
                <div className="w-6 h-6 rounded-full border-2 border-white bg-blue-200"></div>
                <div className="w-6 h-6 rounded-full border-2 border-white bg-pink-200"></div>
                <div className="text-[10px] flex items-center pl-4 font-medium text-on-surface-variant">+42 报名</div>
              </div>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setMessage('已收藏街舞大奖赛。');
                }}
                aria-label="收藏街舞大奖赛"
              >
                <Heart className="w-5 h-5 text-primary fill-primary cursor-pointer" />
              </button>
            </div>
          </div>
        </article>

        <article className="bg-secondary-fixed-dim/20 rounded-lg p-5 flex gap-4 items-start relative overflow-hidden">
          <div className="flex-1 space-y-2 z-10">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-tighter">专题讲座</span>
            <h4 className="font-bold text-base">摄影社：从构图到光影的魔法</h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">主讲：校报资深摄影师 张同学<br/>地点：行政楼 302</p>
            <button
              className="bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold px-4 py-1.5 rounded-full mt-2 active:scale-95"
              type="button"
              onClick={() => setMessage('摄影社讲座已收藏。')}
            >
              点击收藏
            </button>
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

const ClubChip: React.FC<{ icon: React.ReactNode; label: string; members: string; color: string; onClick: () => void }> = ({ icon, label, members, color, onClick }) => (
  <button
    className="flex-shrink-0 w-40 bg-surface-container-lowest rounded-lg p-4 text-left shadow-sm border-b-4 border-black/5 active:scale-95 transition-transform"
    type="button"
    onClick={onClick}
  >
    <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center mb-3 text-white`}>
      {icon}
    </div>
    <p className="font-bold text-sm">{label}</p>
    <p className="text-[10px] text-on-surface-variant mt-1">{members} 成员</p>
  </button>
);
