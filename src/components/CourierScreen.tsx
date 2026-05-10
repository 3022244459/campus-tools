import React from 'react';
import {Building2, ChevronRight, History, Lightbulb, QrCode, UserCheck} from 'lucide-react';
import type {CourierData} from '../lib/types';

interface CourierScreenProps {
  data: CourierData;
}

export const CourierScreen: React.FC<CourierScreenProps> = ({data}) => {
  const [panel, setPanel] = React.useState<'proxy' | 'history' | 'pickup' | null>(null);
  const [message, setMessage] = React.useState('');

  function handlePickup(code?: string) {
    setPanel('pickup');
    setMessage(code ? `取件码 ${code} 已确认，驿站核验后即可领取。` : '扫码取件已打开，请对准驿站取件码。');
  }

  return (
    <div className="space-y-8 pt-4">
      <section className="relative bg-secondary-container/30 rounded-lg p-6 flex items-center justify-between overflow-hidden">
        <div className="z-10 flex-1">
          <h2 className="text-3xl font-black tracking-tight text-on-surface mb-1">
            你有 <span className="text-primary-fixed">{data.pendingCount}</span> 件包裹
          </h2>
          <p className="text-on-surface-variant font-medium">快去驿站把包裹带回去吧。</p>
          <div className="mt-4">
            <button
              className="bg-primary-fixed text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-primary/20 flex items-center gap-2 active:scale-95 transition-transform"
              type="button"
              onClick={() => handlePickup()}
            >
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

      {message ? (
        <section className="rounded-lg bg-primary-container/15 px-4 py-3 text-sm font-bold text-primary">
          {message}
        </section>
      ) : null}

      <section className="grid grid-cols-2 gap-4">
        <button
          className="bg-surface-container-highest/60 p-4 rounded-lg flex flex-col items-center gap-2 text-center hover:bg-surface-container-highest transition-colors cursor-pointer active:scale-95"
          type="button"
          onClick={() => {
            setPanel('proxy');
            setMessage('代领取申请已生成，可把取件码发给同学代取。');
          }}
        >
          <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary">
            <UserCheck className="w-7 h-7" />
          </div>
          <span className="font-bold text-sm text-on-surface">代领取申请</span>
        </button>
        <button
          className="bg-surface-container-highest/60 p-4 rounded-lg flex flex-col items-center gap-2 text-center hover:bg-surface-container-highest transition-colors cursor-pointer active:scale-95"
          type="button"
          onClick={() => {
            setPanel('history');
            setMessage('');
          }}
        >
          <div className="w-12 h-12 rounded-full bg-tertiary-container flex items-center justify-center text-tertiary">
            <History className="w-7 h-7" />
          </div>
          <span className="font-bold text-sm text-on-surface">取件历史 {data.historyCount}</span>
        </button>
      </section>

      {panel === 'proxy' ? (
        <section className="rounded-lg bg-surface-container-lowest p-5 shadow-sm space-y-3">
          <h3 className="text-lg font-black text-on-surface">代领取申请</h3>
          <p className="text-sm text-on-surface-variant">申请人：张小宝 · 可领取 {data.pendingCount} 件待取包裹</p>
          <div className="rounded-xl bg-surface-container-low p-4 text-sm font-bold text-primary">
            代取验证码：TJ-{data.packages[0]?.code ?? '2026'}
          </div>
          <button
            className="w-full rounded-full bg-primary-fixed py-3 text-sm font-black text-on-primary-fixed active:scale-95"
            type="button"
            onClick={() => setMessage('代领取申请已发送给联系人。')}
          >
            发送给联系人
          </button>
        </section>
      ) : null}

      {panel === 'history' ? (
        <section className="rounded-lg bg-surface-container-lowest p-5 shadow-sm space-y-3">
          <h3 className="text-lg font-black text-on-surface">取件历史</h3>
          {[
            ['京东快递', '昨天 18:20', '已取件'],
            ['邮政校园件', '周三 12:05', '已取件'],
            ['中通快递', '周一 09:42', '已取件'],
          ].map(([title, time, status]) => (
            <div key={`${title}-${time}`} className="flex items-center justify-between rounded-xl bg-surface-container-low px-4 py-3">
              <div>
                <p className="text-sm font-bold text-on-surface">{title}</p>
                <p className="text-xs text-on-surface-variant">{time}</p>
              </div>
              <span className="text-xs font-bold text-green-600">{status}</span>
            </div>
          ))}
        </section>
      ) : null}

      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xl font-extrabold text-on-surface">待取包裹</h3>
          <span className="text-xs font-bold text-on-surface-variant bg-surface-container-low px-3 py-1 rounded-full">
            {data.stationName}
          </span>
        </div>

        {data.packages.map((pkg) => (
          <PackageCard
            key={pkg.id}
            title={pkg.title}
            code={pkg.code}
            location={pkg.location}
            tag={pkg.tag}
            tagTone={pkg.tagTone}
            icon={pkg.icon}
            dimmed={pkg.etaDays >= 3}
            onClick={() => handlePickup(pkg.code)}
          />
        ))}
      </section>

      <section className="bg-secondary-fixed-dim/40 rounded-lg p-5 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-5 h-5 text-secondary fill-secondary" />
            <span className="font-bold text-sm text-secondary">{data.noteTitle}</span>
          </div>
          <p className="text-on-secondary-container text-xs leading-relaxed font-medium">
            {data.noteMessage}
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
  tagTone: 'secondary' | 'neutral' | 'error';
  icon: string;
  dimmed?: boolean;
  onClick: () => void;
}> = ({title, code, location, tag, tagTone, icon, dimmed = false, onClick}) => {
  const toneClass = tagTone === 'secondary'
    ? 'bg-secondary-container text-on-secondary-container'
    : tagTone === 'error'
      ? 'bg-red-50 text-red-600'
      : 'bg-surface-container-high text-on-surface-variant';

  return (
    <button
      className={`w-full bg-surface-container-lowest rounded-lg p-5 text-left shadow-sm border-b-4 border-surface-variant flex gap-4 items-center active:scale-[0.99] transition-transform ${dimmed ? 'opacity-80' : ''}`}
      type="button"
      onClick={onClick}
    >
      <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <img src={icon} alt="Parcel Icon" className="w-10 h-10" referrerPolicy="no-referrer" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start gap-4">
          <h4 className="font-bold text-lg leading-tight">{title}</h4>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${toneClass}`}>{tag}</span>
        </div>
        <p className="text-xs text-on-surface-variant mt-1">取件码：<span className="text-primary font-black">{code}</span></p>
        <p className="text-[10px] text-outline mt-1 font-medium">存放地：{location}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-outline-variant" />
    </button>
  );
};
