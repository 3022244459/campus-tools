import React from 'react';
import {BookOpen, Building2, CheckCircle2, Clock, Search, Users} from 'lucide-react';

const rooms = [
  {id: 'r1', building: '第 26 教学楼', room: 'B206', capacity: 48, until: '20:30', equipment: '多媒体 / 空调', quiet: '较安静'},
  {id: 'r2', building: '第 45 教学楼', room: 'A312', capacity: 64, until: '21:00', equipment: '投影 / 白板', quiet: '安静'},
  {id: 'r3', building: '北洋园图书馆', room: '研讨间 305', capacity: 12, until: '19:40', equipment: '屏幕 / 预约屏', quiet: '非常安静'},
  {id: 'r4', building: '卫津路教学楼', room: 'C104', capacity: 52, until: '18:50', equipment: '多媒体', quiet: '一般'},
];

export const EmptyClassroomScreen: React.FC = () => {
  const [query, setQuery] = React.useState('');
  const [selected, setSelected] = React.useState(rooms[0]);
  const [message, setMessage] = React.useState('');

  const filteredRooms = rooms.filter((room) => {
    const keyword = query.trim();
    if (!keyword) return true;
    return `${room.building}${room.room}${room.equipment}`.includes(keyword);
  });

  return (
    <div className="space-y-7 pt-4 pb-20">
      <section className="relative overflow-hidden rounded-xl bg-secondary-container p-6 shadow-sm">
        <div className="relative z-10 max-w-[65%] space-y-2">
          <p className="text-xs font-black text-secondary uppercase tracking-widest">实时空闲</p>
          <h2 className="text-3xl font-black leading-tight text-on-secondary-container">找一间能立刻学习的教室</h2>
          <p className="text-sm font-medium text-on-secondary-container/75">按教学楼、容量和可用时段筛选，适合课程汇报演示。</p>
        </div>
        <BookOpen className="absolute -right-4 -bottom-8 h-40 w-40 text-on-secondary-container/10" />
      </section>

      <section className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
        <input
          className="w-full rounded-xl border-none bg-surface-container-highest py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜索教学楼或教室号"
        />
      </section>

      {message ? (
        <section className="rounded-lg bg-primary-container/15 px-4 py-3 text-sm font-bold text-primary">{message}</section>
      ) : null}

      <section className="grid grid-cols-3 gap-3">
        <Stat icon={<CheckCircle2 className="h-5 w-5" />} label="当前可用" value={`${filteredRooms.length} 间`} />
        <Stat icon={<Clock className="h-5 w-5" />} label="最长空闲" value="2.5h" />
        <Stat icon={<Users className="h-5 w-5" />} label="最大容量" value="64 人" />
      </section>

      <section className="space-y-4">
        {filteredRooms.map((room) => (
          <button
            key={room.id}
            className={`w-full rounded-xl p-5 text-left shadow-sm transition-transform active:scale-[0.99] ${
              selected.id === room.id ? 'bg-primary-container text-white' : 'bg-surface-container-lowest text-on-surface'
            }`}
            type="button"
            onClick={() => {
              setSelected(room);
              setMessage(`已选择 ${room.building} ${room.room}，可用到 ${room.until}。`);
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${selected.id === room.id ? 'bg-white/20' : 'bg-surface-container-low'}`}>
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black">{room.building} {room.room}</h3>
                  <p className={`text-xs font-bold ${selected.id === room.id ? 'text-white/80' : 'text-on-surface-variant'}`}>{room.equipment}</p>
                </div>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-black ${selected.id === room.id ? 'bg-white text-primary' : 'bg-green-50 text-green-600'}`}>
                空闲中
              </span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs font-bold">
              <span>容量 {room.capacity}</span>
              <span>到 {room.until}</span>
              <span>{room.quiet}</span>
            </div>
          </button>
        ))}
      </section>
    </div>
  );
};

const Stat: React.FC<{icon: React.ReactNode; label: string; value: string}> = ({icon, label, value}) => (
  <div className="rounded-xl bg-surface-container-lowest p-4 text-center shadow-sm">
    <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-primary-container/15 text-primary">{icon}</div>
    <p className="text-[10px] font-bold text-on-surface-variant">{label}</p>
    <p className="text-sm font-black text-on-surface">{value}</p>
  </div>
);
