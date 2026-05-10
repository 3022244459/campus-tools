import React from 'react';
import {Calendar, CheckCircle, ChevronRight, ClipboardCheck, Clock, Filter, Search, XCircle} from 'lucide-react';
import {fetchTeacherLeave, reviewTeacherLeaveApplication} from '../../lib/api';
import {emptyTeacherLeaveData} from '../../lib/emptyData';
import {useRemoteData} from '../../lib/useRemoteData';
import type {AuthSession, LeaveApplication, ReviewDecision, TeacherLeaveData} from '../../lib/types';

interface TeacherLeaveScreenProps {
  session: AuthSession;
}

export const TeacherLeaveScreen: React.FC<TeacherLeaveScreenProps> = ({session}) => {
  const remote = useRemoteData<TeacherLeaveData>(session, emptyTeacherLeaveData, fetchTeacherLeave);
  const [viewData, setViewData] = React.useState<TeacherLeaveData>(remote.data);
  const [currentSource, setCurrentSource] = React.useState<'api' | 'mock'>(remote.source);
  const [query, setQuery] = React.useState('');
  const [actionError, setActionError] = React.useState('');
  const [actionMessage, setActionMessage] = React.useState('');
  const [pendingActionId, setPendingActionId] = React.useState('');

  React.useEffect(() => {
    setViewData(remote.data);
  }, [remote.data]);

  React.useEffect(() => {
    setCurrentSource(remote.source);
  }, [remote.source]);

  const filteredApplications = React.useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) {
      return viewData.applications;
    }

    return viewData.applications.filter((item) => (
      item.studentName.toLowerCase().includes(keyword) ||
      item.className.toLowerCase().includes(keyword) ||
      item.reason.toLowerCase().includes(keyword) ||
      item.leaveType.toLowerCase().includes(keyword)
    ));
  }, [query, viewData.applications]);

  async function handleDecision(applicationId: string, decision: ReviewDecision) {
    setPendingActionId(`${applicationId}:${decision}`);
    setActionError('');
    setActionMessage('');

    try {
      const result = await reviewTeacherLeaveApplication(session, applicationId, decision, viewData);
      setViewData(result.data);
      setCurrentSource(result.source);
      setActionMessage(decision === 'approve' ? '请假申请已批准。' : '请假申请已驳回。');
    } catch (error) {
      setActionError(error instanceof Error ? error.message : '审批失败，请稍后重试。');
    } finally {
      setPendingActionId('');
    }
  }

  return (
    <div className="space-y-8 pt-4 pb-20">
      <section className="relative bg-primary-fixed rounded-xl p-8 overflow-hidden flex items-center justify-between shadow-lg min-h-[180px]">
        <div className="z-10 max-w-[60%]">
          <h2 className="text-3xl font-black text-white leading-tight mb-2">{viewData.heroTitle}</h2>
          <p className="text-white opacity-80 text-sm">{viewData.heroDescription}</p>
        </div>
        <div className="absolute -right-4 -bottom-4 w-44 h-44">
          <ClipboardCheck className="w-full h-full text-white opacity-10" />
        </div>
      </section>

      <StatusNote loading={remote.loading} error={remote.error || actionError} source={currentSource} message={actionMessage} />

      <section className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            type="text"
            placeholder="搜索学生姓名..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full bg-surface-container-low border-none rounded-full py-3 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary-fixed"
          />
        </div>
        <button
          className="bg-surface-container-low p-3 rounded-full text-on-surface-variant active:scale-95 transition-transform"
          type="button"
          onClick={() => setActionMessage(`已筛选出 ${filteredApplications.length} 条待处理申请。`)}
        >
          <Filter className="w-5 h-5" />
        </button>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">待处理申请</h3>
          <span className="text-xs font-bold text-primary bg-primary-container/20 px-3 py-1 rounded-full">
            {filteredApplications.length} / {viewData.pendingCount} 条待办
          </span>
        </div>

        <div className="space-y-4">
          {filteredApplications.map((application, index) => (
            <LeaveCard
              key={application.id}
              application={application}
              accent={index % 2 === 0 ? 'secondary' : 'tertiary'}
              pendingActionId={pendingActionId}
              onDecision={handleDecision}
            />
          ))}
          {!filteredApplications.length ? (
            <div className="bg-surface-container-lowest p-6 rounded-xl text-sm text-on-surface-variant shadow-sm border border-outline-variant/10">
              没有符合搜索条件的请假申请。
            </div>
          ) : null}
        </div>
      </section>

      <button
        className="w-full py-4 bg-surface-container-low text-on-surface-variant font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
        type="button"
        onClick={() => setActionMessage('历史审批记录已打开。')}
      >
        <Clock className="w-5 h-5" />
        查看历史审批记录
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

const LeaveCard: React.FC<{
  application: LeaveApplication;
  accent: 'secondary' | 'tertiary';
  pendingActionId: string;
  onDecision: (applicationId: string, decision: ReviewDecision) => void;
}> = ({application, accent, pendingActionId, onDecision}) => {
  const approveKey = `${application.id}:approve`;
  const rejectKey = `${application.id}:reject`;

  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${accent === 'secondary' ? 'bg-secondary-container text-on-secondary-container' : 'bg-tertiary-container text-on-tertiary-container'}`}>
            {application.avatarText}
          </div>
          <div>
            <h4 className="font-bold text-on-surface">{application.studentName}</h4>
            <p className="text-xs text-on-surface-variant">{application.className}</p>
          </div>
        </div>
        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${accent === 'secondary' ? 'text-primary bg-primary-container/10' : 'text-secondary bg-secondary-container/20'}`}>
          {application.leaveType}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 py-3 border-y border-surface-container">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase">开始时间</p>
          <div className="flex items-center gap-2 text-xs font-bold">
            <Calendar className={`w-3 h-3 ${accent === 'secondary' ? 'text-primary' : 'text-secondary'}`} />
            <span>{application.startTime}</span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase">结束时间</p>
          <div className="flex items-center gap-2 text-xs font-bold">
            <Calendar className={`w-3 h-3 ${accent === 'secondary' ? 'text-primary' : 'text-secondary'}`} />
            <span>{application.endTime}</span>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-[10px] font-bold text-on-surface-variant uppercase">请假理由</p>
        <p className="text-sm text-on-surface leading-relaxed">{application.reason}</p>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          className="flex-1 py-3 bg-surface-container-high text-on-surface-variant font-bold rounded-xl text-sm active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-60"
          onClick={() => onDecision(application.id, 'reject')}
          type="button"
          disabled={pendingActionId === approveKey || pendingActionId === rejectKey}
        >
          <XCircle className="w-4 h-4" />
          {pendingActionId === rejectKey ? '处理中...' : '驳回'}
        </button>
        <button
          className="flex-1 py-3 bg-primary-fixed text-white font-bold rounded-xl text-sm shadow-lg shadow-orange-200 active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-60"
          onClick={() => onDecision(application.id, 'approve')}
          type="button"
          disabled={pendingActionId === approveKey || pendingActionId === rejectKey}
        >
          <CheckCircle className="w-4 h-4" />
          {pendingActionId === approveKey ? '处理中...' : '批准'}
        </button>
      </div>
    </div>
  );
};

const StatusNote: React.FC<{loading: boolean; error: string; source: 'api' | 'mock'; message: string}> = ({loading, error, message}) => {
  if (loading) {
    return <p className="text-xs font-medium text-primary">正在同步请假审批数据...</p>;
  }
  if (error) {
    return <p className="text-xs font-medium text-red-600">{error}</p>;
  }
  if (message) {
    return <p className="text-xs font-medium text-green-600">{message}</p>;
  }
  return null;
};
