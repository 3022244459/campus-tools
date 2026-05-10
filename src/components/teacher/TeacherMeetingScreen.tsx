import React from 'react';
import {Building, Clock, Info, Tv, Users, Video, Wifi} from 'lucide-react';
import {fetchTeacherMeeting} from '../../lib/api';
import {emptyTeacherMeetingData} from '../../lib/emptyData';
import {useRemoteData} from '../../lib/useRemoteData';
import type {AuthSession, MeetingCalendarDay, MeetingRoom, TeacherMeetingData} from '../../lib/types';

interface TeacherMeetingScreenProps {
  session: AuthSession;
}

export const TeacherMeetingScreen: React.FC<TeacherMeetingScreenProps> = ({session}) => {
  const {data, loading, error, source} = useRemoteData<TeacherMeetingData>(
    session,
    emptyTeacherMeetingData,
    fetchTeacherMeeting,
  );
  const [activeDay, setActiveDay] = React.useState('');
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    const nextDay = data.calendarDays.find((item) => item.active)?.date ?? data.calendarDays[0]?.date ?? '';
    setActiveDay(nextDay);
  }, [data.calendarDays]);

  return (
    <div className="space-y-8 pt-4 pb-20">
      <section className="relative overflow-hidden rounded-xl bg-secondary-fixed p-6 shadow-lg min-h-[180px]">
        <div className="relative z-10 max-w-[60%]">
          <h2 className="text-3xl font-extrabold text-on-secondary-fixed leading-tight mb-2">{data.heroTitle}</h2>
          <p className="text-on-secondary-fixed-variant text-sm font-medium">
            今天有 {data.availableCount} 间会议室空闲，快来预约吧。
          </p>
          <div className="mt-4 flex items-center gap-2 bg-white/40 backdrop-blur-md rounded-full px-4 py-2 w-fit">
            <Clock className="w-4 h-4 text-secondary" />
            <span className="text-xs font-bold text-on-secondary-fixed">{data.activeSlot}</span>
          </div>
        </div>
        <div className="absolute -right-4 -bottom-6 w-48 h-48 drop-shadow-xl transform rotate-3">
          <img
            src="./images/remote-30-037b6b11cb.png"
            alt="Timekeeper Rabbit"
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      <StatusNote loading={loading} error={error} source={source} />
      {message ? (
        <section className="rounded-lg bg-primary-container/15 px-4 py-3 text-sm font-bold text-primary">
          {message}
        </section>
      ) : null}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-on-surface">选择时间</h3>
          <span className="text-primary font-bold text-sm">{data.monthLabel}</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
          {data.calendarDays.map((day) => (
            <CalendarDay
              key={`${day.day}-${day.date}`}
              day={day}
              active={day.date === activeDay}
              onClick={() => {
                setActiveDay(day.date);
                setMessage(`已切换到 ${data.monthLabel} ${day.date} 日。`);
              }}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-bold text-on-surface">会议室列表</h3>
        <div className="grid grid-cols-1 gap-6">
          {data.rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onReserve={() => setMessage(`${room.title} 已预约 ${activeDay ? `${data.monthLabel} ${activeDay} 日` : '今天'} ${data.activeSlot}。`)}
            />
          ))}
        </div>
      </section>

      <section className="bg-secondary-fixed-dim p-6 rounded-lg relative overflow-hidden shadow-sm">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-on-secondary-fixed">{data.noticeTitle}</h3>
            <p className="text-on-secondary-fixed-variant text-xs max-w-[220px] mt-1">{data.noticeDescription}</p>
          </div>
          <Info className="w-10 h-10 text-on-secondary-fixed opacity-40" />
        </div>
        <Building className="absolute right-[-10%] top-0 w-32 h-32 text-on-secondary-fixed opacity-10 pointer-events-none" />
      </section>
    </div>
  );
};

const CalendarDay: React.FC<{day: MeetingCalendarDay; active: boolean; onClick: () => void}> = ({day, active, onClick}) => (
  <button
    className={`flex-shrink-0 w-16 h-24 flex flex-col items-center justify-center rounded-xl transition-all cursor-pointer ${
      active ? 'bg-primary text-white shadow-lg shadow-orange-200' : 'bg-surface-container-low text-on-surface-variant'
    }`}
    onClick={onClick}
    type="button"
  >
    <span className={`text-xs ${active ? 'opacity-80' : 'opacity-60'}`}>{day.day}</span>
    <span className="text-2xl font-bold">{day.date}</span>
  </button>
);

const RoomCard: React.FC<{room: MeetingRoom; onReserve: () => void}> = ({room, onReserve}) => (
  <div className="bg-surface-container-lowest p-5 rounded-lg shadow-sm space-y-4 border border-outline-variant/10">
    <div className="flex justify-between items-start">
      <div>
        <h4 className="text-lg font-bold text-on-surface">{room.title}</h4>
        <p className="text-on-surface-variant text-xs mt-1">{room.location}</p>
      </div>
      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${room.status === 'available' ? 'bg-secondary-container text-on-secondary-container' : 'bg-tertiary-container text-on-tertiary-container'}`}>
        {room.status === 'available' ? '空闲' : '已占用'}
      </span>
    </div>
    <div className={`aspect-video w-full rounded-lg overflow-hidden bg-surface-container ${room.status === 'busy' ? 'grayscale' : ''}`}>
      <img
        src={room.image}
        alt={room.title}
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
    </div>
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-1">
        <Users className="w-4 h-4 text-primary" />
        <span className="text-xs font-bold">{room.capacity}</span>
      </div>
      {room.equipment.map((item) => (
        <div key={item} className="flex items-center gap-1">
          {renderEquipmentIcon(item)}
          <span className="text-xs font-bold">{item}</span>
        </div>
      ))}
    </div>
    <button
      className={`w-full font-bold py-3 rounded-full transition-all shadow-sm ${room.status === 'available' ? 'bg-primary-fixed text-on-primary-fixed hover:opacity-90 active:scale-95' : 'bg-surface-container-highest text-on-surface-variant cursor-not-allowed opacity-50'}`}
      disabled={room.status !== 'available'}
      type="button"
      onClick={onReserve}
    >
      {room.status === 'available' ? '立即预约' : '暂不可约'}
    </button>
  </div>
);

function renderEquipmentIcon(label: string) {
  if (label.includes('投影')) {
    return <Video className="w-4 h-4 text-primary" />;
  }
  if (label.includes('5G') || label.toLowerCase().includes('wifi')) {
    return <Wifi className="w-4 h-4 text-primary" />;
  }
  return <Tv className="w-4 h-4 text-primary" />;
}

const StatusNote: React.FC<{loading: boolean; error: string; source: 'api' | 'mock'}> = ({loading, error}) => {
  if (loading) {
    return <p className="text-xs font-medium text-primary">正在同步会议室数据...</p>;
  }
  if (error) {
    return <p className="text-xs font-medium text-red-600">{error}</p>;
  }
  return null;
};
