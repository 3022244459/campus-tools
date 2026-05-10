import React from 'react';
import {ChevronRight, HelpCircle, Info, ReceiptText} from 'lucide-react';
import {fetchTeacherSalary} from '../../lib/api';
import {emptyTeacherSalaryData} from '../../lib/emptyData';
import {useRemoteData} from '../../lib/useRemoteData';
import type {AuthSession, TeacherSalaryData} from '../../lib/types';

export const TeacherSalaryScreen: React.FC<{ session: AuthSession }> = ({session}) => {
  const {data, loading, error, source} = useRemoteData<TeacherSalaryData>(session, emptyTeacherSalaryData, fetchTeacherSalary);
  const [message, setMessage] = React.useState('');

  return (
    <div className="space-y-8 pt-4 pb-20">
      <section className="relative mt-4">
        <div className="absolute -top-6 -right-2 z-10 w-24 h-24 rotate-12">
          <img src="./images/remote-40-b5ec0d7701.png" alt="Hardworking Bee" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
        </div>
        <div className="bg-primary-container p-8 rounded-lg shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <span className="font-headline font-bold text-on-primary-container opacity-80 uppercase tracking-widest text-xs">{data.monthLabel}</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-on-primary-container font-headline font-extrabold text-5xl">{data.netSalary}</span>
            </div>
            <div className="mt-8 flex gap-4">
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 flex-1">
                <p className="text-xs text-on-primary-container/70 font-semibold mb-1">应发总额</p>
                <p className="text-lg font-headline font-bold text-on-primary-container">{data.grossSalary}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 flex-1">
                <p className="text-xs text-on-primary-container/70 font-semibold mb-1">扣款合计</p>
                <p className="text-lg font-headline font-bold text-on-primary-container">{data.totalDeductions}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StatusNote loading={loading} error={error} source={source} />
      {message ? (
        <section className="rounded-lg bg-primary-container/15 px-4 py-3 text-sm font-bold text-primary">{message}</section>
      ) : null}

      <section className="grid grid-cols-1 gap-6">
        <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm border border-outline-variant/10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline font-bold text-2xl text-on-surface">工资明细</h2>
            <ReceiptText className="text-primary w-6 h-6" />
          </div>
          <div className="space-y-4">
            {data.salaryItems.map((item) => (
              <SalaryItem key={item.label} label={item.label} value={item.value} color={item.color} />
            ))}
          </div>
        </div>

        <div className="bg-secondary-container/30 backdrop-blur-sm p-8 rounded-lg shadow-sm flex flex-col justify-between border border-outline-variant/10">
          <div>
            <h2 className="font-headline font-bold text-2xl text-on-secondary-container mb-6">五险一金</h2>
            <div className="space-y-4">
              {data.deductionItems.map((item) => (
                <DeductionItem key={item.label} label={item.label} value={item.value} />
              ))}
              <div className="pt-4 border-t border-secondary-container/50 flex justify-between font-bold text-error">
                <span>个税缴纳</span>
                <span>{data.tax}</span>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <button
              className="w-full bg-secondary text-on-secondary font-bold py-4 rounded-xl hover:bg-secondary-dim transition-transform active:scale-95 flex items-center justify-center gap-2"
              type="button"
              onClick={() => setMessage('详细申报已打开，包含五险一金和个税明细。')}
            >
              <Info className="w-5 h-5" />
              查看详细申报
            </button>
          </div>
        </div>
      </section>

      <section className="bg-surface-container-low p-8 rounded-lg shadow-sm border border-outline-variant/10">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-headline font-bold text-2xl text-on-surface">近半年趋势</h2>
            <p className="text-on-surface-variant text-sm mt-1">工资收入稳步提升中</p>
          </div>
          <div className="flex gap-2 items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-primary-fixed"></span>
            <span className="text-xs font-bold text-on-surface-variant">实发金额</span>
          </div>
        </div>
        <div className="h-48 flex items-end justify-between gap-2 px-2">
          {data.trend.map((item) => (
            <Bar key={item.label} height={`${item.value}%`} label={item.label} active={item.active} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <button
          className="flex w-full items-center justify-between p-6 bg-surface-container-highest rounded-lg cursor-pointer active:scale-95 transition-transform text-left"
          type="button"
          onClick={() => setMessage('工资疑问反馈已提交给人事处。')}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <HelpCircle className="text-white w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-on-surface">{data.complaintTitle}</h3>
              <p className="text-sm text-on-surface-variant">{data.complaintDescription}</p>
            </div>
          </div>
          <ChevronRight className="text-primary w-6 h-6" />
        </button>
      </section>
    </div>
  );
};

const SalaryItem: React.FC<{ label: string; value: string; color: TeacherSalaryData['salaryItems'][number]['color'] }> = ({ label, value, color }) => (
  <div className={`flex justify-between items-center p-4 bg-surface rounded-2xl border-l-4 shadow-sm ${color === 'primary' ? 'border-primary' : color === 'secondary' ? 'border-secondary' : color === 'primaryFixed' ? 'border-primary-fixed' : 'border-secondary-fixed-dim'}`}>
    <span className="font-semibold text-on-surface">{label}</span>
    <span className="font-headline font-bold text-primary">{value}</span>
  </div>
);

const DeductionItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between text-sm">
    <span className="text-on-secondary-container/70 font-medium">{label}</span>
    <span className="font-bold text-on-secondary-container">{value}</span>
  </div>
);

const Bar: React.FC<{ height: string; label: string; active?: boolean }> = ({ height, label, active }) => (
  <div className="flex-1 flex flex-col items-center gap-2">
    <div className={`w-full rounded-t-lg transition-all duration-500 ${active ? 'bg-primary-fixed ring-4 ring-primary-container/30' : 'bg-primary-fixed/30'}`} style={{ height }}></div>
    <span className={`text-[10px] font-bold ${active ? 'text-primary' : 'text-on-surface-variant'}`}>{label}</span>
  </div>
);

const StatusNote: React.FC<{loading: boolean; error: string; source: 'api' | 'mock'}> = ({loading, error}) => {
  if (loading) return <p className="text-xs font-medium text-primary">正在同步工资数据...</p>;
  if (error) return <p className="text-xs font-medium text-red-600">{error}</p>;
  return null;
};
