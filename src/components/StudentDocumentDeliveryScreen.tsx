import React from 'react';
import {CheckCircle2, FileText, MapPin, PackageCheck, Timer, UserRound} from 'lucide-react';
import {fetchDocumentDelivery, fetchWallet, rewardWallet} from '../lib/api';
import {emptyDocumentDeliveryData} from '../lib/emptyData';
import {useRemoteData} from '../lib/useRemoteData';
import type {AuthSession, DocumentDeliveryData, DocumentDeliveryTask} from '../lib/types';

interface StudentDocumentDeliveryScreenProps {
  session: AuthSession;
}

export const StudentDocumentDeliveryScreen: React.FC<StudentDocumentDeliveryScreenProps> = ({session}) => {
  const remote = useRemoteData<DocumentDeliveryData>(session, emptyDocumentDeliveryData, fetchDocumentDelivery);
  const [viewData, setViewData] = React.useState(remote.data);
  const [currentTask, setCurrentTask] = React.useState<DocumentDeliveryTask | null>(null);
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');
  const [settling, setSettling] = React.useState(false);

  React.useEffect(() => {
    setViewData(remote.data);
  }, [remote.data]);

  function handleClaim(task: DocumentDeliveryTask) {
    const nextTask: DocumentDeliveryTask = {...task, status: 'claimed'};
    setCurrentTask(nextTask);
    setMessage(`已接下「${task.title}」，请前往 ${task.pickupLabel} 取件。`);
    setError('');
  }

  function handlePicked() {
    if (!currentTask) {
      return;
    }

    setCurrentTask({...currentTask, status: 'picked'});
    setMessage(`已确认取到文件，正在送往 ${currentTask.destinationLabel}。`);
  }

  async function handleDelivered() {
    if (!currentTask || currentTask.status === 'delivered') {
      return;
    }

    const rewardAmount = parseRewardAmount(currentTask.reward);
    setSettling(true);
    setError('');
    setMessage('');

    try {
      const walletResult = await fetchWallet(session);
      const rewardResult = rewardAmount > 0
        ? await rewardWallet(session, rewardAmount, walletResult.data)
        : walletResult;
      setCurrentTask({...currentTask, status: 'delivered'});
      setMessage(
        rewardAmount > 0
          ? `文件已送达，赏金 ¥${rewardAmount.toFixed(2)} 已到账，当前钱包余额 ${rewardResult.data.walletBalanceLabel}。`
          : '文件已送达，任务状态已完成。',
      );
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '送达确认失败，请稍后重试。');
    } finally {
      setSettling(false);
    }
  }

  return (
    <div className="space-y-6 pt-4 pb-20">
      <section className="relative overflow-hidden rounded-lg bg-secondary-container p-6 shadow-sm">
        <div className="relative z-10 max-w-[70%] space-y-3">
          <span className="inline-flex rounded-full bg-primary px-3 py-1 text-xs font-black text-white">
            学生接单
          </span>
          <h2 className="text-3xl font-black leading-tight text-on-secondary-container">教师文件代送</h2>
          <p className="text-sm font-medium text-on-secondary-container/75">
            教师端发布后会出现在这里，接单后可跟踪取件、送达和赏金到账。
          </p>
        </div>
        <FileText className="absolute -right-4 bottom-0 h-36 w-36 rotate-6 text-primary/20" />
      </section>

      <StatusNote loading={remote.loading} error={remote.error || error} message={message} />

      {currentTask ? (
        <section className="rounded-xl bg-primary-container p-5 text-white shadow-lg space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-white/70">当前任务</p>
              <h3 className="mt-1 text-xl font-black">{currentTask.title}</h3>
              <p className="mt-1 text-sm font-bold text-white/80">
                {currentTask.pickupLabel} → {currentTask.destinationLabel}
              </p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-primary">
              {currentTask.status === 'claimed' ? '已接单' : currentTask.status === 'picked' ? '配送中' : '已送达'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
            <Step active>接单</Step>
            <Step active={currentTask.status === 'picked' || currentTask.status === 'delivered'}>取件</Step>
            <Step active={currentTask.status === 'delivered'}>送达</Step>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              className="rounded-xl bg-white/20 py-3 text-sm font-black active:scale-95 disabled:opacity-50"
              type="button"
              disabled={currentTask.status !== 'claimed'}
              onClick={handlePicked}
            >
              已取到文件
            </button>
            <button
              className="rounded-xl bg-white py-3 text-sm font-black text-primary active:scale-95 disabled:opacity-50"
              type="button"
              disabled={currentTask.status === 'delivered' || settling}
              onClick={() => void handleDelivered()}
            >
              {settling ? '结算中...' : '确认送达'}
            </button>
          </div>
        </section>
      ) : null}

      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="text-xl font-black text-on-surface">待接文件任务</h3>
            <p className="text-xs font-medium text-on-surface-variant">来自教师端的文件代送需求</p>
          </div>
          <span className="rounded-full bg-primary-container/15 px-3 py-1 text-xs font-bold text-primary">
            {viewData.tasks.length} 单可接
          </span>
        </div>
        <div className="space-y-3">
          {viewData.tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClaim={() => handleClaim(task)} />
          ))}
          {!viewData.tasks.length ? (
            <div className="rounded-lg bg-surface-container-lowest p-5 text-sm font-medium text-on-surface-variant shadow-sm">
              当前没有待接文件任务。
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
};

const TaskCard: React.FC<{task: DocumentDeliveryTask; onClaim: () => void}> = ({task, onClaim}) => (
  <div className="rounded-lg bg-surface-container-lowest p-5 shadow-sm space-y-4">
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant">
          <UserRound className="h-4 w-4 text-primary" />
          {task.teacherName}
        </div>
        <h4 className="mt-2 text-lg font-black text-on-surface">{task.title}</h4>
      </div>
      <span className="rounded-full bg-secondary-container px-3 py-1 text-xs font-black text-on-secondary-container">
        {task.reward}
      </span>
    </div>
    <div className="space-y-2 text-sm font-medium text-on-surface-variant">
      <p className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-primary" />
        {task.pickupLabel} → {task.destinationLabel}
      </p>
      <p className="flex items-center gap-2">
        <Timer className="h-4 w-4 text-secondary" />
        {task.urgency} · {task.etaText}
      </p>
    </div>
    <button
      className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-fixed py-3 text-sm font-black text-on-primary-fixed active:scale-95"
      type="button"
      onClick={onClaim}
    >
      <PackageCheck className="h-4 w-4" />
      立即接单
    </button>
  </div>
);

const Step: React.FC<{active: boolean; children: React.ReactNode}> = ({active, children}) => (
  <div className={`rounded-xl p-3 ${active ? 'bg-white text-primary' : 'bg-white/20'}`}>
    {active ? <CheckCircle2 className="mx-auto mb-1 h-4 w-4" /> : null}
    {children}
  </div>
);

const StatusNote: React.FC<{loading: boolean; error: string; message: string}> = ({loading, error, message}) => {
  if (loading) {
    return <p className="text-xs font-medium text-primary">正在读取文件代送任务...</p>;
  }
  if (error) {
    return <p className="text-xs font-medium text-red-600">{error}</p>;
  }
  if (message) {
    return <p className="text-xs font-medium text-green-600">{message}</p>;
  }
  return null;
};

function parseRewardAmount(reward: string): number {
  const matched = reward.match(/\d+(?:\.\d+)?/);
  return matched ? Number(matched[0]) : 0;
}
