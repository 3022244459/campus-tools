import React from 'react';
import {BarChart3, CheckCircle, Droplets, FileText, Lightbulb, MapPin, Send, Wrench, Zap} from 'lucide-react';
import {fetchRepair} from '../../lib/api';
import {emptyRepairData} from '../../lib/emptyData';
import {useRemoteData} from '../../lib/useRemoteData';
import type {AuthSession, RepairData, RepairType} from '../../lib/types';

interface TeacherRepairScreenProps {
  session: AuthSession;
}

export const TeacherRepairScreen: React.FC<TeacherRepairScreenProps> = ({session}) => {
  const {data, loading, error, source} = useRemoteData<RepairData>(
    session,
    emptyRepairData,
    fetchRepair,
  );
  const [activeTypeId, setActiveTypeId] = React.useState('');
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    const nextType = data.repairTypes.find((type) => type.active)?.id ?? data.repairTypes[0]?.id ?? '';
    setActiveTypeId(nextType);
  }, [data.repairTypes]);

  return (
    <div className="space-y-8 pt-4 pb-20">
      <section className="relative bg-secondary-fixed rounded-xl p-8 overflow-hidden flex items-center justify-between shadow-lg min-h-[180px]">
        <div className="z-10 max-w-[60%]">
          <h2 className="text-3xl font-black text-on-secondary-fixed leading-tight mb-2">{data.heroTitle}</h2>
          <p className="text-on-secondary-fixed opacity-80 text-sm">{data.heroDescription}</p>
        </div>
        <div className="absolute -right-4 -bottom-6 w-40 h-40">
          <img
            src="./images/remote-39-6dd606361a.png"
            alt="Handyman Monkey"
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

      <section>
        <div className="flex items-end justify-between mb-6">
          <h3 className="text-2xl font-bold tracking-tight">快捷报修项目</h3>
          <span className="text-xs font-bold text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full">选择分类</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {data.repairTypes.map((type, index) => (
            <CategoryCard
              key={type.id}
              type={type}
              active={type.id === activeTypeId}
              onClick={() => setActiveTypeId(type.id)}
              fullWidth={index === data.repairTypes.length - 1 && data.repairTypes.length % 2 === 1}
            />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4">
        {data.quickActions.map((item) => (
          <div key={item.id} className="bg-surface-container-low p-5 rounded-lg flex items-center gap-3 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
              {item.icon === 'wrench' ? <Wrench className="w-6 h-6 text-primary-fixed" /> : <BarChart3 className="w-6 h-6 text-secondary" />}
            </div>
            <div>
              <p className="font-bold">{item.title}</p>
              <p className="text-[10px] text-on-surface-variant">今日可处理</p>
            </div>
          </div>
        ))}
      </section>

      <section className="bg-surface-container-low p-8 rounded-xl space-y-6 shadow-sm">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary-fixed" />
          详细报修申请
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold ml-2 text-on-surface-variant">故障位置</label>
            <div className="relative">
              <input
                className="w-full bg-surface-container-highest border-none rounded-lg p-4 pr-12 focus:ring-2 focus:ring-primary-fixed text-on-surface placeholder:text-on-surface-variant/50"
                placeholder={data.defaultLocation}
                type="text"
              />
              <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-fixed" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold ml-2 text-on-surface-variant">故障描述</label>
            <textarea
              className="w-full bg-surface-container-highest border-none rounded-lg p-4 focus:ring-2 focus:ring-primary-fixed text-on-surface placeholder:text-on-surface-variant/50"
              placeholder={data.defaultDescription}
              rows={3}
            />
          </div>
          <button
            className="w-full bg-primary-fixed text-white font-bold py-5 rounded-full shadow-lg shadow-orange-200 active:scale-95 transition-transform flex items-center justify-center gap-2"
            type="button"
            onClick={() => setMessage('报修申请已提交，维修人员会尽快处理。')}
          >
            <Send className="w-5 h-5" />
            立即提交报修
          </button>
        </div>
      </section>

      <section className="pb-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">{data.noticeTitle}</h3>
          <button
            className="text-sm font-bold text-primary active:scale-95"
            type="button"
            onClick={() => setMessage('全部报修记录已打开。')}
          >
            全部记录
          </button>
        </div>
        <div className="space-y-4">
          {data.notices.map((notice, index) => (
            <div key={notice} className="bg-surface-container-lowest p-5 rounded-lg flex items-start gap-4 shadow-sm relative overflow-hidden border border-outline-variant/10">
              <div className={`absolute top-0 right-0 px-4 py-1 text-[10px] font-bold rounded-bl-lg ${index === 0 ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-green-100 text-green-700'}`}>
                {index === 0 ? '处理中' : '已提醒'}
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${index === 0 ? 'bg-secondary-fixed/10 text-secondary' : 'bg-green-50 text-green-600'}`}>
                {index === 0 ? <Zap className="w-6 h-6 fill-current" /> : <CheckCircle className="w-6 h-6 fill-current" />}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-on-surface">{notice}</h4>
                <p className="text-xs text-on-surface-variant mt-1">{index === 0 ? '系统已同步维修须知与优先级说明' : '可作为报修提交前的检查清单'}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const CategoryCard: React.FC<{type: RepairType; active: boolean; onClick: () => void; fullWidth?: boolean}> = ({type, active, onClick, fullWidth}) => (
  <button
    className={`${fullWidth ? 'col-span-2' : 'col-span-1'} bg-surface-container-lowest p-6 rounded-lg shadow-sm border-b-4 ${active ? 'border-primary-container' : 'border-outline-variant'} flex flex-col items-center gap-3 active:scale-95 transition-transform`}
    onClick={onClick}
    type="button"
  >
    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${active ? 'bg-primary-container/20' : 'bg-surface-container-high'}`}>
      {renderTypeIcon(type.icon, active)}
    </div>
    <span className="font-bold text-on-surface">{type.label}</span>
  </button>
);

function renderTypeIcon(icon: RepairType['icon'], active: boolean) {
  const className = `w-8 h-8 ${active ? 'text-primary-container' : 'text-secondary'}`;
  switch (icon) {
    case 'droplets':
      return <Droplets className={`${className} fill-current`} />;
    case 'zap':
      return <Zap className={`${className} fill-current`} />;
    default:
      return <Lightbulb className={`${className} fill-current`} />;
  }
}

const StatusNote: React.FC<{loading: boolean; error: string; source: 'api' | 'mock'}> = ({loading, error}) => {
  if (loading) {
    return <p className="text-xs font-medium text-primary">正在同步教师报修数据...</p>;
  }
  if (error) {
    return <p className="text-xs font-medium text-red-600">{error}</p>;
  }
  return null;
};
