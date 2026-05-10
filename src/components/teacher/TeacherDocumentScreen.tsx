import React from 'react';
import {Clock, FileUp, Lock, MapPin, Send, ShieldCheck, Truck} from 'lucide-react';
import {fetchTeacherDocument, submitTeacherDocument} from '../../lib/api';
import {emptyTeacherDocumentData} from '../../lib/emptyData';
import {useRemoteData} from '../../lib/useRemoteData';
import type {AuthSession, TeacherDocumentData, TeacherDocumentSubmitPayload} from '../../lib/types';

interface TeacherDocumentScreenProps {
  session: AuthSession;
}

export const TeacherDocumentScreen: React.FC<TeacherDocumentScreenProps> = ({session}) => {
  const remote = useRemoteData<TeacherDocumentData>(session, emptyTeacherDocumentData, fetchTeacherDocument);
  const [viewData, setViewData] = React.useState<TeacherDocumentData>(remote.data);
  const [currentSource, setCurrentSource] = React.useState<'api' | 'mock'>(remote.source);
  const [actionError, setActionError] = React.useState('');
  const [actionMessage, setActionMessage] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [form, setForm] = React.useState<TeacherDocumentSubmitPayload>({
    pickupLocation: '',
    destinationLocation: '',
    urgency: '加急',
    remarks: '',
  });

  React.useEffect(() => {
    setViewData(remote.data);
  }, [remote.data]);

  React.useEffect(() => {
    setCurrentSource(remote.source);
  }, [remote.source]);

  React.useEffect(() => {
    setForm((current) => ({
      ...current,
      urgency: remote.data.form.urgencyOptions.includes(current.urgency) ? current.urgency : ((remote.data.form.urgencyOptions[1] ?? remote.data.form.urgencyOptions[0] ?? '加急') as TeacherDocumentSubmitPayload['urgency']),
    }));
  }, [remote.data.form.urgencyOptions]);

  function updateForm<K extends keyof TeacherDocumentSubmitPayload>(key: K, value: TeacherDocumentSubmitPayload[K]) {
    setForm((current) => ({...current, [key]: value}));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setActionError('');
    setActionMessage('');

    try {
      const result = await submitTeacherDocument(session, form, viewData);
      setViewData(result.data);
      setCurrentSource(result.source);
      setActionMessage('文件代送申请已提交。');
      setForm({
        pickupLocation: '',
        destinationLocation: '',
        urgency: form.urgency,
        remarks: '',
      });
    } catch (error) {
      setActionError(error instanceof Error ? error.message : '提交失败，请稍后重试。');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8 pt-4 pb-20">
      <section className="relative bg-secondary-fixed rounded-lg p-6 overflow-hidden flex items-center justify-between shadow-lg min-h-[160px]">
        <div className="relative z-10 max-w-[60%]">
          <h2 className="text-on-secondary-fixed font-headline font-extrabold text-2xl leading-tight whitespace-pre-line">
            {viewData.heroTitle.replace(' ', '\n')}
          </h2>
          <p className="text-on-secondary-fixed-variant text-sm mt-2 font-medium">{viewData.heroDescription}</p>
        </div>
        <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-48 h-48 opacity-90">
          <img
            src="./images/remote-29-764ca061a2.png"
            alt="Owl Messenger"
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      <StatusNote loading={remote.loading} error={remote.error || actionError} source={currentSource} message={actionMessage} />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-headline font-bold text-xl text-on-surface">正在配送</h3>
          <span className="text-xs font-bold bg-primary-container text-white px-3 py-1 rounded-full shadow-sm">
            {viewData.activeDeliveries} 个进行中
          </span>
        </div>
        <div className="bg-surface-container-low rounded-lg p-5 flex flex-col gap-4 shadow-sm border-l-8 border-primary">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary-container rounded-full flex items-center justify-center text-secondary">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-on-surface">{viewData.activeOrder.title}</p>
                <p className="text-xs text-on-surface-variant">订单号 {viewData.activeOrder.orderCode}</p>
              </div>
            </div>
            <span className="bg-primary-fixed-dim/20 text-primary-dim text-[10px] font-black px-2 py-1 rounded-md">
              {viewData.activeOrder.urgency}
            </span>
          </div>
          <div className="relative flex items-center justify-between px-2">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 bg-primary rounded-full z-10" />
              <span className="text-[10px] mt-1 font-bold text-on-surface-variant">{viewData.activeOrder.pickupLabel}</span>
            </div>
            <div className="flex-1 h-1 bg-primary-container/30 mx-2 rounded-full overflow-hidden">
              <div className="h-full bg-primary-container" style={{width: `${viewData.activeOrder.progress}%`}} />
            </div>
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 bg-outline-variant rounded-full z-10" />
              <span className="text-[10px] mt-1 font-bold text-on-surface-variant">{viewData.activeOrder.destinationLabel}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <Clock className="w-4 h-4" />
            <span>{viewData.activeOrder.etaText}</span>
          </div>
        </div>
      </section>

      <section className="bg-surface-container-lowest rounded-xl p-8 shadow-sm space-y-6 border border-outline-variant/10">
        <div className="border-b-2 border-surface-container pb-4">
          <h3 className="font-headline font-bold text-xl text-primary">发起代送申请</h3>
          <p className="text-sm text-on-surface-variant">填写以下信息，小使者立刻出发</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant ml-2">取件地点</label>
              <div className="relative">
                <FileUp className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                <input
                  className="w-full bg-surface-container-low border-none rounded-lg py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary-container font-medium text-sm text-on-surface"
                  placeholder={viewData.form.pickupPlaceholder}
                  type="text"
                  value={form.pickupLocation}
                  onChange={(event) => updateForm('pickupLocation', event.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant ml-2">送达地点</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary w-5 h-5" />
                <input
                  className="w-full bg-surface-container-low border-none rounded-lg py-4 pl-12 pr-4 focus:ring-2 focus:ring-secondary-container font-medium text-sm text-on-surface"
                  placeholder={viewData.form.destinationPlaceholder}
                  type="text"
                  value={form.destinationLocation}
                  onChange={(event) => updateForm('destinationLocation', event.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant ml-2">紧急程度</label>
            <div className="flex gap-3">
              {viewData.form.urgencyOptions.map((item) => (
                <button
                  key={item}
                  className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-colors border-2 ${form.urgency === item ? 'bg-primary-container text-white shadow-md scale-105 border-primary-container' : 'bg-surface-container-low text-on-surface border-transparent hover:bg-secondary-container'}`}
                  onClick={() => updateForm('urgency', item as TeacherDocumentSubmitPayload['urgency'])}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant ml-2">备注信息</label>
            <textarea
              className="w-full bg-surface-container-low border-none rounded-lg p-4 focus:ring-2 focus:ring-primary-container font-medium text-sm text-on-surface"
              placeholder={viewData.form.remarksPlaceholder}
              rows={3}
              value={form.remarks}
              onChange={(event) => updateForm('remarks', event.target.value)}
            />
          </div>

          <button className="w-full bg-primary-fixed text-white font-headline font-extrabold text-lg py-5 rounded-xl shadow-lg shadow-orange-200 active:scale-95 transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-60" type="submit" disabled={submitting}>
            <Send className="w-6 h-6 fill-white" />
            {submitting ? '提交中...' : '立即呼叫代送'}
          </button>
        </form>
      </section>

      <section className="grid grid-cols-2 gap-4">
        <div className="bg-secondary-fixed/20 p-4 rounded-lg flex items-center gap-3 shadow-sm">
          <ShieldCheck className="w-6 h-6 text-secondary" />
          <span className="text-xs font-bold text-secondary-dim">{viewData.tips[0]}</span>
        </div>
        <div className="bg-primary-fixed/10 p-4 rounded-lg flex items-center gap-3 shadow-sm">
          <Lock className="w-6 h-6 text-primary" />
          <span className="text-xs font-bold text-primary-dim">{viewData.tips[1]}</span>
        </div>
      </section>
    </div>
  );
};

const StatusNote: React.FC<{loading: boolean; error: string; source: 'api' | 'mock'; message: string}> = ({loading, error, message}) => {
  if (loading) {
    return <p className="text-xs font-medium text-primary">正在同步文件代送数据...</p>;
  }
  if (error) {
    return <p className="text-xs font-medium text-red-600">{error}</p>;
  }
  if (message) {
    return <p className="text-xs font-medium text-green-600">{message}</p>;
  }
  return null;
};
