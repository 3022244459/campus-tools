import React from 'react';
import {AlertCircle, Calendar, CheckCircle2, ChevronRight, Clock, Info, Library, Search, Users} from 'lucide-react';
import {fetchTeacherStudyRoom} from '../../lib/api';
import {emptyTeacherStudyRoomData} from '../../lib/emptyData';
import {useRemoteData} from '../../lib/useRemoteData';
import type {AuthSession, StudyRoomItem, TeacherStudyRoomData} from '../../lib/types';

interface TeacherStudyRoomScreenProps {
  session: AuthSession;
}

export const TeacherStudyRoomScreen: React.FC<TeacherStudyRoomScreenProps> = ({session}) => {
  const {data, loading, error, source} = useRemoteData<TeacherStudyRoomData>(
    session,
    emptyTeacherStudyRoomData,
    fetchTeacherStudyRoom,
  );
  const [query, setQuery] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [panel, setPanel] = React.useState<'schedule' | 'review' | null>(null);
  const [approvedRooms, setApprovedRooms] = React.useState<string[]>([]);

  const rooms = React.useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) {
      return data.rooms;
    }

    return data.rooms.filter((room) => (
      room.title.toLowerCase().includes(keyword) ||
      room.capacity.toLowerCase().includes(keyword) ||
      room.equipment.toLowerCase().includes(keyword)
    ));
  }, [data.rooms, query]);

  return (
    <div className="space-y-8 pt-4 pb-20">
      <section className="relative bg-secondary-fixed rounded-xl p-8 overflow-hidden flex items-center justify-between shadow-lg min-h-[180px]">
        <div className="z-10 max-w-[60%]">
          <h2 className="text-3xl font-black text-on-secondary-fixed leading-tight mb-2">{data.heroTitle}</h2>
          <p className="text-on-secondary-fixed opacity-80 text-sm">{data.heroDescription}</p>
        </div>
        <div className="absolute -right-4 -bottom-4 w-44 h-44">
          <div className="w-full h-full rounded-full bg-white/10 blur-md" />
          <Library className="absolute inset-0 m-auto w-24 h-24 text-on-secondary-fixed opacity-10" />
        </div>
      </section>

      <StatusNote loading={loading} error={error} source={source} />
      {message ? (
        <section className="rounded-lg bg-primary-container/15 px-4 py-3 text-sm font-bold text-primary">
          {message}
        </section>
      ) : null}

      <section className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container-low p-5 rounded-lg border-l-4 border-primary shadow-sm">
          <p className="text-xs font-bold text-on-surface-variant mb-1">今日预约</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-on-surface">{data.stats.todayBookings}</span>
            <span className="text-[10px] text-on-surface-variant">场次</span>
          </div>
        </div>
        <div className="bg-surface-container-low p-5 rounded-lg border-l-4 border-secondary shadow-sm">
          <p className="text-xs font-bold text-on-surface-variant mb-1">当前使用中</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-on-surface">{data.stats.activeRooms}</span>
            <span className="text-[10px] text-on-surface-variant">房间</span>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">房间状态</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input
              type="text"
              placeholder="搜索房间..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="bg-surface-container-highest border-none rounded-full py-2 pl-9 pr-4 text-xs font-medium focus:ring-2 focus:ring-primary-fixed"
            />
          </div>
        </div>

        <div className="space-y-4">
          {rooms.map((room) => (
            <RoomItem
              key={room.id}
              room={room}
              onClick={() => setMessage(`${room.title} 详情已打开。`)}
            />
          ))}
          {!rooms.length ? (
            <div className="bg-surface-container-lowest p-5 rounded-lg shadow-sm border border-outline-variant/10 text-sm text-on-surface-variant">
              当前没有匹配的房间。
            </div>
          ) : null}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4">
        <button
          className="bg-primary-fixed text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-200 active:scale-95 transition-transform flex items-center justify-center gap-2"
          type="button"
          onClick={() => setPanel('schedule')}
        >
          <Calendar className="w-5 h-5" />
          {data.primaryAction}
        </button>
        <button
          className="bg-secondary-fixed text-on-secondary-fixed font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
          type="button"
          onClick={() => setPanel('review')}
        >
          <Users className="w-5 h-5" />
          {data.secondaryAction}
        </button>
      </section>

      {panel === 'schedule' ? (
        <section className="rounded-xl bg-surface-container-lowest p-5 shadow-sm space-y-4">
          <h3 className="text-lg font-black text-on-surface">排课管理</h3>
          {[
            ['周二 19:00-21:00', '研讨室 201', '算法答疑'],
            ['周四 14:00-16:00', '研讨室 102', '项目评审'],
            ['周六 09:00-11:00', '实验室 405', '课程设计辅导'],
          ].map(([time, room, title]) => (
            <button key={`${time}-${room}`} className="flex w-full items-center justify-between rounded-lg bg-surface-container-low px-4 py-3 text-left active:scale-[0.99]" type="button" onClick={() => setMessage(`${room} ${time} 已锁定为「${title}」。`)}>
              <div>
                <p className="text-sm font-black text-on-surface">{title}</p>
                <p className="text-xs font-medium text-on-surface-variant">{time} · {room}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-on-surface-variant" />
            </button>
          ))}
        </section>
      ) : null}

      {panel === 'review' ? (
        <section className="rounded-xl bg-surface-container-lowest p-5 shadow-sm space-y-4">
          <h3 className="text-lg font-black text-on-surface">预约审核</h3>
          {['研讨室 201 · 张同学项目讨论', '实验室 405 · 课程设计小组'].map((item) => (
            <div key={item} className="rounded-lg bg-surface-container-low p-4 space-y-3">
              <p className="text-sm font-black text-on-surface">{item}</p>
              <button
                className="rounded-full bg-primary-fixed px-4 py-2 text-xs font-black text-on-primary-fixed active:scale-95 disabled:opacity-50"
                type="button"
                disabled={approvedRooms.includes(item)}
                onClick={() => {
                  setApprovedRooms((current) => [...current, item]);
                  setMessage(`${item} 已通过。`);
                }}
              >
                {approvedRooms.includes(item) ? '已通过' : '通过预约'}
              </button>
            </div>
          ))}
        </section>
      ) : null}

      <section className="bg-surface-container-highest p-6 rounded-xl flex items-start gap-4">
        <Info className="w-6 h-6 text-primary-fixed shrink-0" />
        <p className="text-xs text-on-surface-variant leading-relaxed">{data.tip}</p>
      </section>
    </div>
  );
};

const RoomItem: React.FC<{room: StudyRoomItem; onClick: () => void}> = ({room, onClick}) => {
  const icon = room.status === 'available'
    ? <CheckCircle2 className="w-6 h-6" />
    : room.status === 'occupied'
      ? <Clock className="w-6 h-6" />
      : <AlertCircle className="w-6 h-6" />;

  const tone = room.status === 'available'
    ? 'bg-green-100 text-green-600'
    : room.status === 'occupied'
      ? 'bg-orange-100 text-orange-600'
      : 'bg-red-100 text-red-600';

  const badge = room.status === 'available'
    ? '空闲中'
    : room.status === 'occupied'
      ? '使用中'
      : '不可用';

  const badgeTone = room.status === 'available'
    ? 'text-green-600 bg-green-50'
    : room.status === 'occupied'
      ? 'text-orange-600 bg-orange-50'
      : 'text-red-600 bg-red-50';

  return (
    <button
      className={`w-full bg-surface-container-lowest p-5 rounded-lg shadow-sm border border-outline-variant/10 flex items-center justify-between text-left active:scale-[0.99] ${room.status === 'maintenance' ? 'opacity-60' : ''}`}
      type="button"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${tone}`}>
          {icon}
        </div>
        <div>
          <h4 className="font-bold text-on-surface">{room.title}</h4>
          <p className="text-xs text-on-surface-variant">容纳: {room.capacity} | 设备: {room.equipment}</p>
        </div>
      </div>
      <div className="text-right">
        <span className={`text-[10px] font-black px-2 py-1 rounded ${badgeTone}`}>{badge}</span>
        <ChevronRight className="w-4 h-4 text-on-surface-variant inline ml-2" />
      </div>
    </button>
  );
};

const StatusNote: React.FC<{loading: boolean; error: string; source: 'api' | 'mock'}> = ({loading, error}) => {
  if (loading) {
    return <p className="text-xs font-medium text-primary">正在同步研讨室数据...</p>;
  }
  if (error) {
    return <p className="text-xs font-medium text-red-600">{error}</p>;
  }
  return null;
};
