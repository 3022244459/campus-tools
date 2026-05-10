import React from 'react';
import {Award, Calendar, CheckCircle, ChevronRight, Megaphone, XCircle} from 'lucide-react';
import {fetchTeacherStudentAffairs, reviewTeacherStudentAffairApplication} from '../../lib/api';
import {emptyTeacherStudentAffairsData} from '../../lib/emptyData';
import {useRemoteData} from '../../lib/useRemoteData';
import type {AuthSession, ReviewDecision, StudentAffairApplication, TeacherStudentAffairsData} from '../../lib/types';

interface TeacherStudentAffairsScreenProps {
  session: AuthSession;
}

export const TeacherStudentAffairsScreen: React.FC<TeacherStudentAffairsScreenProps> = ({session}) => {
  const remote = useRemoteData<TeacherStudentAffairsData>(session, emptyTeacherStudentAffairsData, fetchTeacherStudentAffairs);
  const [viewData, setViewData] = React.useState<TeacherStudentAffairsData>(remote.data);
  const [currentSource, setCurrentSource] = React.useState<'api' | 'mock'>(remote.source);
  const [actionError, setActionError] = React.useState('');
  const [actionMessage, setActionMessage] = React.useState('');
  const [pendingActionId, setPendingActionId] = React.useState('');

  React.useEffect(() => {
    setViewData(remote.data);
  }, [remote.data]);

  React.useEffect(() => {
    setCurrentSource(remote.source);
  }, [remote.source]);

  async function handleDecision(applicationId: string, decision: ReviewDecision) {
    setPendingActionId(`${applicationId}:${decision}`);
    setActionError('');
    setActionMessage('');

    try {
      const result = await reviewTeacherStudentAffairApplication(session, applicationId, decision, viewData);
      setViewData(result.data);
      setCurrentSource(result.source);
      setActionMessage(decision === 'approve' ? '学生事务申请已批准。' : '学生事务申请已驳回。');
    } catch (error) {
      setActionError(error instanceof Error ? error.message : '审批失败，请稍后重试。');
    } finally {
      setPendingActionId('');
    }
  }

  return (
    <div className="space-y-8 pt-4 pb-20">
      <section className="relative mb-10 mt-4 overflow-visible">
        <div className="bg-secondary-fixed p-8 rounded-lg relative overflow-hidden flex items-end justify-between min-h-[180px] shadow-lg">
          <div className="relative z-10">
            <p className="text-on-secondary-fixed font-bold text-sm mb-1">{viewData.portalLabel}</p>
            <h2 className="text-3xl font-black text-on-secondary-fixed leading-tight">{viewData.heroTitle}</h2>
            <p className="text-on-secondary-fixed/80 mt-2 font-medium">{viewData.heroGreeting}</p>
          </div>
          <div className="absolute -top-6 -right-4 w-48 h-48 z-0">
            <img
              src="./images/remote-41-b9297c8836.png"
              alt="Professor Elephant"
              className="w-full h-full object-contain transform rotate-[-5deg]"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      <StatusNote loading={remote.loading} error={remote.error || actionError} source={currentSource} message={actionMessage} />

      <section className="grid grid-cols-3 gap-4 mb-10">
        <StatCard value={viewData.stats.pending} label="待审批" accent="primary" />
        <StatCard value={viewData.stats.approved} label="已通过" accent="secondary" />
        <StatCard value={viewData.stats.rejected} label="已驳回" accent="muted" />
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black text-on-surface">待审批列表</h3>
          <button
            className="text-primary font-bold text-sm flex items-center gap-1 active:scale-95"
            type="button"
            onClick={() => setActionMessage(`已显示全部 ${viewData.applications.length} 条待审批申请。`)}
          >
            全部 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-6">
          {viewData.applications.map((application) => (
            <ApplicationCard key={application.id} application={application} pendingActionId={pendingActionId} onDecision={handleDecision} />
          ))}
          {!viewData.applications.length ? (
            <div className="bg-surface-container-lowest rounded-lg p-6 shadow-sm border border-outline-variant/10 text-sm text-on-surface-variant">
              当前没有待审批的学生事务申请。
            </div>
          ) : null}
        </div>
      </section>

      <div className="mt-12 text-center opacity-30 pb-12">
        <p className="font-headline font-black tracking-widest text-[#482702]">TIANJIN UNIVERSITY</p>
      </div>
    </div>
  );
};

const StatCard: React.FC<{value: number; label: string; accent: 'primary' | 'secondary' | 'muted'}> = ({value, label, accent}) => (
  <div className={`p-5 rounded-lg flex flex-col items-center justify-center text-center shadow-sm ${
    accent === 'primary'
      ? 'bg-surface-container-highest'
      : accent === 'secondary'
        ? 'bg-surface-container-low border-2 border-primary/10'
        : 'bg-surface-container-low border-2 border-error/5'
  }`}>
    <span className={`text-3xl font-black ${
      accent === 'primary' ? 'text-primary' : accent === 'secondary' ? 'text-secondary' : 'text-on-surface-variant'
    }`}>
      {value}
    </span>
    <span className="text-xs font-bold text-on-surface-variant mt-1">{label}</span>
  </div>
);

const ApplicationCard: React.FC<{
  application: StudentAffairApplication;
  pendingActionId: string;
  onDecision: (applicationId: string, decision: ReviewDecision) => void;
}> = ({application, pendingActionId, onDecision}) => {
  const approveKey = `${application.id}:approve`;
  const rejectKey = `${application.id}:reject`;

  return (
    <div className="bg-surface-container-lowest rounded-lg p-6 shadow-sm relative border border-outline-variant/10">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            application.icon === 'award'
              ? 'bg-secondary-container text-on-secondary-container'
              : 'bg-tertiary-container text-on-tertiary-container'
          }`}>
            {application.icon === 'award'
              ? <Award className="w-6 h-6 fill-current" />
              : <Megaphone className="w-6 h-6 fill-current" />}
          </div>
          <div>
            <h4 className="font-bold text-lg text-on-surface">{application.title}</h4>
            <p className="text-xs text-on-surface-variant font-medium">申请人：{application.applicant}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider ${
          application.icon === 'award'
            ? 'bg-primary-container/10 text-primary'
            : 'bg-secondary-container/20 text-secondary'
        }`}>
          {application.category}
        </span>
      </div>

      {application.quote ? (
        <p className="text-sm text-on-surface-variant leading-relaxed mb-6 italic bg-surface-container-low/50 p-3 rounded">
          “{application.quote}”
        </p>
      ) : null}

      {application.detail ? (
        <p className="text-sm text-on-surface-variant leading-relaxed mb-4">{application.detail}</p>
      ) : null}

      {application.meta?.length ? (
        <div className="flex items-center gap-4 text-xs font-bold text-on-surface-variant mb-6 flex-wrap">
          {application.meta.map((item) => (
            <span key={item} className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {item}
            </span>
          ))}
        </div>
      ) : null}

      <div className="flex gap-3">
        <button
          className="flex-1 py-3 px-4 bg-secondary-fixed text-on-secondary-fixed rounded-xl font-bold text-sm active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          onClick={() => onDecision(application.id, 'reject')}
          type="button"
          disabled={pendingActionId === approveKey || pendingActionId === rejectKey}
        >
          <XCircle className="w-4 h-4" />
          {pendingActionId === rejectKey ? '处理中...' : '驳回'}
        </button>
        <button
          className="flex-1 py-3 px-4 bg-primary-container text-white rounded-xl font-bold text-sm active:scale-95 transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2 disabled:opacity-60"
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
    return <p className="text-xs font-medium text-primary">正在同步学生事务数据...</p>;
  }
  if (error) {
    return <p className="text-xs font-medium text-red-600">{error}</p>;
  }
  if (message) {
    return <p className="text-xs font-medium text-green-600">{message}</p>;
  }
  return null;
};
