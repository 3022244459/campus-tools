import React from 'react';
import {BookOpen, Calendar, ChevronRight, FileText, Music, Package, Plus, TrendingUp, Users} from 'lucide-react';
import {
  fetchTeacherLeave,
  fetchTeacherOffice,
  fetchTeacherStudentAffairs,
  reviewTeacherLeaveApplication,
  reviewTeacherStudentAffairApplication,
} from '../../lib/api';
import {emptyTeacherOfficeData} from '../../lib/emptyData';
import {useRemoteData} from '../../lib/useRemoteData';
import type {AuthSession, TeacherOfficeData, TeacherTool} from '../../lib/types';

export const TeacherOfficeScreen: React.FC<{ onNavigate: (screen: string) => void; session: AuthSession }> = ({ onNavigate, session }) => {
  const {data, loading, error, source} = useRemoteData<TeacherOfficeData>(session, emptyTeacherOfficeData, fetchTeacherOffice);
  const [approvals, setApprovals] = React.useState(data.approvals);
  const [message, setMessage] = React.useState('');
  const [panel, setPanel] = React.useState<'schedule' | 'supplies' | null>(null);

  React.useEffect(() => {
    setApprovals(data.approvals);
  }, [data.approvals]);

  async function handleOfficeApproval(approvalId: string, decision: 'approve' | 'reject') {
    setMessage('');
    try {
      if (approvalId === 'approval-1') {
        const leave = await fetchTeacherLeave(session);
        const application = leave.data.applications[0];
        if (application) {
          await reviewTeacherLeaveApplication(session, application.id, decision, leave.data);
        }
      } else if (approvalId === 'approval-2') {
        const affairs = await fetchTeacherStudentAffairs(session);
        const application = affairs.data.applications[0];
        if (application) {
          await reviewTeacherStudentAffairApplication(session, application.id, decision, affairs.data);
        }
      }

      setApprovals((current) => current.filter((item) => item.id !== approvalId));
      setMessage(decision === 'approve' ? '审批已通过，待办卡片已移除。' : '审批已驳回，待办卡片已移除。');
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : '审批处理失败，请稍后重试。');
    }
  }

  return (
    <div className="space-y-8 pt-4 pb-20">
      <section className="relative overflow-visible pt-4">
        <div className="flex flex-col gap-1">
          <p className="text-on-surface-variant font-medium text-sm">{data.greeting}</p>
          <h1 className="text-4xl font-extrabold text-on-surface leading-tight">
            {data.headline.split('，')[0]}
            <br />
            {data.headline.split('，')[1] ?? ''}
          </h1>
        </div>
        <div className="absolute -right-4 -top-8 w-40 h-40 pointer-events-none transform rotate-12">
          <img src="./images/remote-36-4ce80c8277.png" alt="Mascot" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
        </div>
      </section>

      <StatusNote loading={loading} error={error} source={source} />
      {message ? (
        <section className="rounded-lg bg-primary-container/15 px-4 py-3 text-sm font-bold text-primary">
          {message}
        </section>
      ) : null}

      <section>
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-bold">待办审批</h2>
          <button
            className="text-sm font-semibold text-primary underline underline-offset-4 cursor-pointer active:scale-95"
            type="button"
            onClick={() => onNavigate('teacher-leave')}
          >
            查看全部
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {approvals.map((approval) => (
            <div key={approval.id} className={`p-5 flex flex-col justify-between h-40 relative overflow-hidden shadow-sm border rounded-lg ${approval.tone === 'primary' ? 'bg-surface-container-low border-outline-variant/5' : 'bg-secondary-container border-outline-variant/5'}`}>
              <div className="z-10">
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold mb-2 ${approval.tone === 'primary' ? 'bg-primary-container text-black' : 'bg-secondary text-white'}`}>{approval.badge}</span>
                <h3 className="text-lg font-bold">{approval.title}</h3>
                <p className="text-sm text-on-surface-variant">{approval.description}</p>
              </div>
              <div className="flex gap-2 z-10">
                <button
                  className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm active:scale-95 transition-transform ${approval.tone === 'primary' ? 'bg-primary text-on-primary' : 'bg-on-secondary-container text-white'}`}
                  type="button"
                  onClick={() => void handleOfficeApproval(approval.id, 'approve')}
                >
                  {approval.primaryAction}
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-sm font-bold active:scale-95 transition-transform ${approval.tone === 'primary' ? 'bg-surface-container-highest text-on-surface' : 'bg-white/40 text-on-secondary-container'}`}
                  type="button"
                  onClick={() => approval.secondaryAction === '详情' ? onNavigate('teacher-leave') : void handleOfficeApproval(approval.id, 'reject')}
                >
                  {approval.secondaryAction}
                </button>
              </div>
              <div className="absolute -bottom-4 -right-4 opacity-10 pointer-events-none">
                {approval.icon === 'file' ? <FileText className="w-32 h-32 text-primary" /> : <Music className="w-32 h-32 text-secondary" />}
              </div>
            </div>
          ))}
          {!approvals.length ? (
            <div className="rounded-lg bg-surface-container-lowest p-5 text-sm font-bold text-on-surface-variant shadow-sm">
              当前没有待办审批。
            </div>
          ) : null}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">工作统计</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 bg-surface-container-lowest p-6 rounded-lg shadow-sm flex flex-col justify-between border-2 border-primary/5">
            <div>
              <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">本周课时</p>
              <p className="text-5xl font-black text-primary">{data.weeklyHours}<span className="text-lg ml-1 font-bold">节</span></p>
            </div>
            <div className="mt-4 space-y-2">
              <div className="w-full bg-surface-container-low rounded-full h-3 overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: `${Math.min(100, Math.round((data.completedHours / data.weeklyHours) * 100))}%` }}></div>
              </div>
              <p className="text-[10px] font-semibold text-on-surface-variant">已完成 {data.completedHours} 节 / 剩余 {data.weeklyHours - data.completedHours} 节</p>
            </div>
          </div>
          <div className="bg-secondary-fixed-dim/20 p-5 rounded-lg flex flex-col justify-center items-center text-center border border-secondary-fixed-dim/10">
            <Users className="w-8 h-8 text-secondary mb-1 fill-secondary/20" />
            <p className="text-xs font-bold text-on-secondary-container">学生到访</p>
            <p className="text-xl font-black">{data.visits}</p>
          </div>
          <div className="bg-surface-container-highest p-5 rounded-lg flex flex-col justify-center items-center text-center border border-primary/10">
            <FileText className="w-8 h-8 text-primary mb-1 fill-primary/20" />
            <p className="text-xs font-bold text-on-primary-container">待阅公文</p>
            <p className="text-xl font-black">{data.documents}</p>
          </div>
          <div className="col-span-2 bg-surface-container-low p-5 rounded-lg flex items-center gap-4 border border-outline-variant/5">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary-fixed shadow-sm">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold">{data.efficiencyText}</p>
              <p className="text-[10px] text-on-surface-variant">继续保持。</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">常用工具</h2>
        <div className="grid grid-cols-2 gap-4">
          {data.tools.map((tool) => (
            <ToolButton
              key={tool.id}
              icon={renderToolIcon(tool)}
              title={tool.title}
              desc={tool.description}
              onClick={() => {
                if (tool.route) {
                  onNavigate(tool.route);
                  return;
                }
                setPanel(tool.id === 'tool-schedule' ? 'schedule' : 'supplies');
              }}
            />
          ))}
        </div>
      </section>

      {panel === 'schedule' ? (
        <section className="rounded-xl bg-surface-container-lowest p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-on-surface">我的课表</h3>
            <span className="text-xs font-bold text-primary">本周课程</span>
          </div>
          {[
            ['周一 08:30', '数据结构', '北洋园校区 第26教学楼 B206'],
            ['周三 14:00', '人工智能导论', '卫津路校区 第9教学楼 301'],
            ['周五 10:20', '课程设计答辩', '北洋园校区 智算学部报告厅'],
          ].map(([time, title, place]) => (
            <div key={`${time}-${title}`} className="rounded-lg bg-surface-container-low p-4">
              <p className="text-xs font-bold text-primary">{time}</p>
              <p className="mt-1 text-base font-black text-on-surface">{title}</p>
              <p className="text-xs font-medium text-on-surface-variant">{place}</p>
            </div>
          ))}
        </section>
      ) : null}

      {panel === 'supplies' ? (
        <section className="rounded-xl bg-surface-container-lowest p-5 shadow-sm space-y-3">
          <h3 className="text-lg font-black text-on-surface">耗材领用</h3>
          {['A4 打印纸 2 包', '白板笔 4 支', '档案袋 20 个'].map((item) => (
            <button key={item} className="flex w-full items-center justify-between rounded-lg bg-surface-container-low px-4 py-3 text-left text-sm font-bold active:scale-[0.99]" type="button" onClick={() => setMessage(`${item} 领用申请已提交。`)}>
              {item}
              <ChevronRight className="h-4 w-4 text-on-surface-variant" />
            </button>
          ))}
        </section>
      ) : null}

      <section className="pb-10">
        <div className="bg-secondary-fixed-dim rounded-lg p-6 relative overflow-hidden flex items-center shadow-lg border border-secondary-fixed-dim/30">
          <div className="relative z-10 space-y-1">
            <h3 className="text-xl font-black text-on-secondary-fixed">{data.bannerTitle}</h3>
            <p className="text-sm text-on-secondary-fixed-variant leading-relaxed max-w-[60%]">{data.bannerDescription}</p>
            <button
              className="mt-2 bg-on-secondary-container text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wide shadow-md active:scale-95 transition-transform"
              type="button"
              onClick={() => window.alert('教师活动报名已提交。')}
            >
              立即报名
            </button>
          </div>
          <div className="absolute right-0 top-0 bottom-0 opacity-20 pointer-events-none transform scale-150 translate-x-8">
            <TrendingUp className="w-40 h-40 text-on-secondary-fixed" />
          </div>
          <div className="absolute -right-6 -bottom-4 w-32 h-32 transform -rotate-12">
            <img src="./images/remote-37-e34fa1e0bb.png" alt="Campus Shape" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
          </div>
        </div>
      </section>

      <div className="fixed right-6 bottom-28 z-40">
        <button
          className="w-16 h-16 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-transform"
          type="button"
          onClick={() => onNavigate('teacher-message')}
        >
          <Plus className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

function renderToolIcon(tool: TeacherTool) {
  switch (tool.icon) {
    case 'calendar': return <Calendar className="w-6 h-6 text-primary fill-primary/10" />;
    case 'book': return <BookOpen className="w-6 h-6 text-secondary fill-secondary/10" />;
    case 'schedule': return <Calendar className="w-6 h-6 text-purple-600 fill-purple-600/10" />;
    case 'package': return <Package className="w-6 h-6 text-green-600 fill-green-600/10" />;
    default: return <Calendar className="w-6 h-6 text-primary fill-primary/10" />;
  }
}

const ToolButton: React.FC<{ icon: React.ReactNode; title: string; desc: string; onClick: () => void }> = ({ icon, title, desc, onClick }) => (
  <button className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md active:scale-95 transition-all border border-outline-variant/5" onClick={onClick} type="button">
    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0">{icon}</div>
    <div className="text-left">
      <p className="font-bold text-sm text-on-surface">{title}</p>
      <p className="text-[10px] text-on-surface-variant">{desc}</p>
    </div>
  </button>
);

const StatusNote: React.FC<{loading: boolean; error: string; source: 'api' | 'mock'}> = ({loading, error}) => {
  if (loading) return <p className="text-xs font-medium text-primary">正在同步办公中心数据...</p>;
  if (error) return <p className="text-xs font-medium text-red-600">{error}</p>;
  return null;
};
