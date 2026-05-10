import React from 'react';
import {Bell, Bus, CheckCircle2, Clock, MapPin, Navigation} from 'lucide-react';

const schedules = [
  {id: 's1', from: '北洋园校区', to: '卫津路校区', depart: '18:30', arrive: '19:10', status: '可预约', seats: 18},
  {id: 's2', from: '卫津路校区', to: '北洋园校区', depart: '19:20', arrive: '20:00', status: '可预约', seats: 9},
  {id: 's3', from: '北洋园校区', to: '天津站', depart: '20:10', arrive: '20:55', status: '余票紧张', seats: 3},
];

export const ShuttleScheduleScreen: React.FC = () => {
  const [activeId, setActiveId] = React.useState(schedules[0].id);
  const [message, setMessage] = React.useState('');
  const active = schedules.find((item) => item.id === activeId) ?? schedules[0];

  return (
    <div className="space-y-7 pt-4 pb-20">
      <section className="relative overflow-hidden rounded-xl bg-primary-container p-6 text-white shadow-lg">
        <div className="relative z-10 max-w-[65%] space-y-2">
          <p className="text-xs font-black uppercase tracking-widest text-white/70">校区通勤</p>
          <h2 className="text-3xl font-black leading-tight">校车时刻与预约</h2>
          <p className="text-sm font-medium text-white/80">北洋园校区、卫津路校区往返班次实时展示。</p>
        </div>
        <Bus className="absolute -right-4 -bottom-8 h-44 w-44 text-white/15" />
      </section>

      {message ? (
        <section className="rounded-lg bg-primary-container/15 px-4 py-3 text-sm font-bold text-primary">{message}</section>
      ) : null}

      <section className="rounded-xl bg-surface-container-lowest p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-on-surface-variant">当前选择</p>
            <h3 className="mt-1 text-xl font-black text-on-surface">{active.from} → {active.to}</h3>
          </div>
          <div className="rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-600">{active.status}</div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          <InfoBlock icon={<Clock className="h-5 w-5" />} label="发车" value={active.depart} />
          <InfoBlock icon={<Navigation className="h-5 w-5" />} label="到达" value={active.arrive} />
          <InfoBlock icon={<CheckCircle2 className="h-5 w-5" />} label="余座" value={`${active.seats} 座`} />
        </div>
        <button
          className="mt-5 w-full rounded-xl bg-primary-fixed py-4 text-sm font-black text-on-primary-fixed active:scale-95"
          type="button"
          onClick={() => setMessage(`${active.from} 到 ${active.to} ${active.depart} 班次已预约。`)}
        >
          预约该班次
        </button>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-black text-on-surface">今日班次</h3>
        {schedules.map((item) => (
          <button
            key={item.id}
            className={`w-full rounded-xl p-5 text-left shadow-sm active:scale-[0.99] ${
              activeId === item.id ? 'bg-secondary-container' : 'bg-surface-container-lowest'
            }`}
            type="button"
            onClick={() => {
              setActiveId(item.id);
              setMessage('');
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/70 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-black text-on-surface">{item.from} → {item.to}</p>
                  <p className="text-xs font-bold text-on-surface-variant">{item.depart} 发车 · {item.arrive} 到达</p>
                </div>
              </div>
              <span className="text-xs font-black text-primary">{item.seats} 座</span>
            </div>
          </button>
        ))}
      </section>

      <section className="rounded-xl bg-secondary-fixed-dim/40 p-5">
        <div className="flex items-start gap-3">
          <Bell className="mt-0.5 h-5 w-5 text-secondary" />
          <p className="text-sm font-medium leading-relaxed text-on-secondary-container">预约后会在发车前 15 分钟提醒，乘车点为各校区行政楼前校车站。</p>
        </div>
      </section>
    </div>
  );
};

const InfoBlock: React.FC<{icon: React.ReactNode; label: string; value: string}> = ({icon, label, value}) => (
  <div className="rounded-xl bg-surface-container-low p-3 text-center">
    <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary">{icon}</div>
    <p className="text-[10px] font-bold text-on-surface-variant">{label}</p>
    <p className="text-sm font-black text-on-surface">{value}</p>
  </div>
);
