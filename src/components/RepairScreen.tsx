import React from 'react';
import {BarChart3, Building, Camera, Clock3, Droplets, Lightbulb, MapPin, Wrench, Zap} from 'lucide-react';
import {fetchRepair, submitRepair} from '../lib/api';
import {emptyRepairData} from '../lib/emptyData';
import {useRemoteData} from '../lib/useRemoteData';
import type {AuthSession, RepairData, RepairRequest, RepairType} from '../lib/types';

interface RepairScreenProps {
  session: AuthSession;
}

export const RepairScreen: React.FC<RepairScreenProps> = ({session}) => {
  const remote = useRemoteData<RepairData>(session, emptyRepairData, fetchRepair);
  const [viewData, setViewData] = React.useState<RepairData>(remote.data);
  const [currentSource, setCurrentSource] = React.useState<'api' | 'mock'>(remote.source);
  const [activeTypeId, setActiveTypeId] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [imageCount, setImageCount] = React.useState(0);
  const [actionError, setActionError] = React.useState('');
  const [actionMessage, setActionMessage] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    setViewData(remote.data);
  }, [remote.data]);

  React.useEffect(() => {
    setCurrentSource(remote.source);
  }, [remote.source]);

  React.useEffect(() => {
    const nextType = remote.data.repairTypes.find((type) => type.active)?.id ?? remote.data.repairTypes[0]?.id ?? '';
    setActiveTypeId((current) => current || nextType);
  }, [remote.data.repairTypes]);

  React.useEffect(() => {
    if (!location) {
      setLocation(remote.data.defaultLocation);
    }
    if (!description) {
      setDescription(remote.data.defaultDescription);
    }
  }, [description, location, remote.data.defaultDescription, remote.data.defaultLocation]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setActionError('');
    setActionMessage('');

    try {
      const result = await submitRepair(session, {
        typeId: activeTypeId,
        location,
        description,
        imageCount,
      }, viewData);
      setViewData(result.data);
      setCurrentSource(result.source);
      setActionMessage('报修申请已提交，页面已同步最新工单。');
      setDescription(remote.data.defaultDescription);
      setImageCount(0);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : '报修提交失败，请稍后重试。');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8 pt-4 pb-20">
      <section className="relative bg-secondary-fixed rounded-lg p-6 overflow-hidden shadow-sm">
        <div className="z-10 relative max-w-[60%]">
          <h1 className="text-3xl font-black text-on-secondary-fixed leading-tight">{viewData.heroTitle}</h1>
          <p className="text-on-secondary-fixed-variant font-medium mt-2 whitespace-pre-line">{viewData.heroDescription}</p>
        </div>
        <div className="absolute -right-4 -bottom-2 w-48 h-48 drop-shadow-2xl transform rotate-3">
          <img
            src="./images/remote-22-3df9276542.png"
            alt="Mascot"
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      <StatusNote
        loading={remote.loading}
        error={remote.error || actionError}
        source={currentSource}
        message={actionMessage}
      />

      <div className="grid grid-cols-2 gap-4">
        {viewData.quickActions.map((action) => (
          <button
            key={action.id}
            className={`p-5 rounded-lg flex flex-col items-center gap-2 transition-colors group ${
              action.icon === 'wrench'
                ? 'bg-surface-container-highest hover:bg-[#ffd5b2]'
                : 'bg-surface-container-low hover:bg-surface-container-high'
            }`}
            type="button"
            onClick={() => {
              if (action.icon === 'chart') {
                setActionMessage(`当前共有 ${viewData.recentRequests.length} 条报修记录，最新工单状态已显示在下方。`);
              } else {
                setActionMessage('请填写下方报修单，提交后会立即出现在最近报修列表。');
              }
            }}
          >
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center group-active:scale-95 duration-200 ${
                action.icon === 'wrench'
                  ? 'bg-primary-container text-white'
                  : 'bg-secondary-container text-on-secondary-container'
              }`}
            >
              {action.icon === 'wrench'
                ? <Wrench className="w-7 h-7 fill-white" />
                : <BarChart3 className="w-7 h-7 fill-on-secondary-container" />}
            </div>
            <span className="font-bold text-on-surface">{action.title}</span>
          </button>
        ))}
      </div>

      <section className="bg-surface-container-lowest rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-8 bg-primary-container rounded-full" />
          <h2 className="text-xl font-bold text-on-surface">报修单填写</h2>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-bold text-on-surface-variant mb-3">报修类型</label>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {viewData.repairTypes.map((type) => (
                <TypeChip
                  key={type.id}
                  icon={renderRepairTypeIcon(type.icon)}
                  label={type.label}
                  active={type.id === activeTypeId}
                  onClick={() => setActiveTypeId(type.id)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-on-surface-variant">故障位置</label>
            <div className="relative">
              <input
                className="w-full bg-surface-container-low border-none rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary placeholder:text-outline/50 font-medium"
                placeholder={viewData.defaultLocation}
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
              />
              <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-on-surface-variant">问题描述</label>
            <textarea
              className="w-full bg-surface-container-low border-none rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary placeholder:text-outline/50 font-medium"
              placeholder={viewData.defaultDescription}
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-on-surface-variant">上传图片（最多 3 张）</label>
            <div className="flex items-center gap-3">
              {[0, 1, 2].map((index) => {
                const selected = imageCount > index;
                return (
                  <button
                    key={index}
                    className={`w-24 h-24 rounded-lg flex flex-col items-center justify-center border-2 border-dashed transition-colors ${
                      selected
                        ? 'bg-primary-container text-white border-primary-container'
                        : 'bg-surface-container-high text-outline hover:bg-surface-container-highest border-outline-variant'
                    }`}
                    onClick={() => setImageCount(index + 1)}
                    type="button"
                  >
                    <Camera className="w-8 h-8" />
                    <span className="mt-2 text-xs font-bold">{selected ? `已选 ${index + 1}` : `照片 ${index + 1}`}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            className="w-full bg-primary-fixed text-on-primary-fixed py-5 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-transform mt-4 disabled:opacity-70"
            type="submit"
            disabled={submitting}
          >
            {submitting ? '提交中...' : '提交报修申请'}
          </button>
        </form>
      </section>

      <section className="bg-surface-container-lowest rounded-lg p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock3 className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-on-surface">最近报修</h3>
          </div>
          <span className="text-xs font-bold text-primary bg-primary-container/15 px-3 py-1 rounded-full">
            {viewData.recentRequests.length} 条
          </span>
        </div>
        <div className="space-y-3">
          {viewData.recentRequests.map((request) => (
            <RepairRequestCard key={request.id} request={request} />
          ))}
        </div>
      </section>

      <section className="bg-secondary-fixed-dim rounded-lg p-6 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-on-secondary-fixed font-bold text-lg">{viewData.noticeTitle}</h3>
          <ul className="mt-3 space-y-2 text-sm text-on-secondary-fixed-variant">
            {viewData.notices.map((notice) => (
              <li key={notice} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                {notice}
              </li>
            ))}
          </ul>
        </div>
        <div className="absolute -right-8 -bottom-8 opacity-20 transform rotate-12 pointer-events-none">
          <Building className="w-32 h-32 fill-on-secondary-fixed" />
        </div>
      </section>
    </div>
  );
};

const TypeChip: React.FC<{icon: React.ReactNode; label: string; active?: boolean; onClick: () => void}> = ({icon, label, active, onClick}) => (
  <button
    className={`flex-shrink-0 px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-colors ${
      active ? 'bg-primary-container text-white' : 'bg-surface-container-high text-on-surface-variant'
    }`}
    onClick={onClick}
    type="button"
  >
    {icon}
    {label}
  </button>
);

const RepairRequestCard: React.FC<{request: RepairRequest}> = ({request}) => (
  <div className="bg-surface-container-low rounded-xl p-4 flex items-center justify-between gap-4">
    <div>
      <p className="font-bold text-on-surface">{request.title}</p>
      <p className="text-xs text-on-surface-variant mt-1">{request.location}</p>
    </div>
    <div className="text-right">
      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
        request.status === 'done'
          ? 'bg-green-100 text-green-700'
          : request.status === 'scheduled'
            ? 'bg-secondary-container text-on-secondary-container'
            : 'bg-primary-container/15 text-primary'
      }`}
      >
        {request.status === 'done' ? '已完成' : request.status === 'scheduled' ? '已派单' : '待处理'}
      </span>
      <p className="text-[11px] text-on-surface-variant mt-2">{request.time}</p>
    </div>
  </div>
);

function renderRepairTypeIcon(icon: RepairType['icon']) {
  switch (icon) {
    case 'droplets':
      return <Droplets className="w-4 h-4" />;
    case 'zap':
      return <Zap className="w-4 h-4" />;
    default:
      return <Lightbulb className="w-4 h-4" />;
  }
}

const StatusNote: React.FC<{loading: boolean; error: string; source: 'api' | 'mock'; message: string}> = ({loading, error, message}) => {
  if (loading) {
    return <p className="text-xs font-medium text-primary">正在同步报修数据...</p>;
  }
  if (error) {
    return <p className="text-xs font-medium text-red-600">{error}</p>;
  }
  if (message) {
    return <p className="text-xs font-medium text-green-600">{message}</p>;
  }
  return null;
};
