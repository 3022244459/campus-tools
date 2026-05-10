import React from 'react';
import {Compass, History, MapPin, Package, Truck, User, Users} from 'lucide-react';
import {fetchCourier} from '../../lib/api';
import {emptyCourierData} from '../../lib/emptyData';
import {useRemoteData} from '../../lib/useRemoteData';
import type {AuthSession, CourierData, CourierPackage} from '../../lib/types';

interface TeacherCourierScreenProps {
  session: AuthSession;
}

export const TeacherCourierScreen: React.FC<TeacherCourierScreenProps> = ({session}) => {
  const {data, loading, error, source} = useRemoteData<CourierData>(
    session,
    emptyCourierData,
    fetchCourier,
  );
  const [message, setMessage] = React.useState('');

  return (
    <div className="space-y-8 pt-4 pb-20">
      <section className="relative bg-secondary-fixed rounded-xl p-8 overflow-hidden flex items-center justify-between shadow-lg min-h-[200px]">
        <div className="z-10 max-w-[60%]">
          <h2 className="font-headline font-extrabold text-3xl text-on-secondary-fixed mb-2 leading-tight">快递代取</h2>
          <p className="text-on-secondary-fixed-variant text-sm font-medium">{data.noteMessage}</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-surface-container-lowest/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm">
            <Package className="w-4 h-4 text-primary-fixed fill-primary-fixed" />
            <span className="text-xs font-bold text-on-surface">待取件 {data.pendingCount}</span>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 w-48 h-48 translate-x-4 translate-y-4">
          <img
            src="./images/remote-28-4ea4ac9770.png"
            alt="Postman Koala"
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

      <section className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        <button
          className="flex-none px-6 py-3 bg-primary-fixed text-white rounded-full font-bold shadow-md flex items-center gap-2"
          type="button"
          onClick={() => setMessage(`已显示我的快递，待取件 ${data.pendingCount} 件。`)}
        >
          <User className="w-4 h-4" />
          我的快递
        </button>
        <button
          className="flex-none px-6 py-3 bg-surface-container-high text-on-surface-variant rounded-full font-bold flex items-center gap-2"
          type="button"
          onClick={() => setMessage('学生互助代取列表已打开。')}
        >
          <Users className="w-4 h-4" />
          学生互助
        </button>
        <button
          className="flex-none px-6 py-3 bg-surface-container-high text-on-surface-variant rounded-full font-bold flex items-center gap-2"
          type="button"
          onClick={() => setMessage('历史记录已打开。')}
        >
          <History className="w-4 h-4" />
          历史记录
        </button>
      </section>

      <div className="grid grid-cols-1 gap-6">
        {data.packages.map((pkg) => (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            onAction={(action) => setMessage(action)}
          />
        ))}

        <div className="bg-secondary-fixed-dim rounded-lg p-6 relative overflow-hidden flex flex-col justify-between shadow-lg">
          <div className="relative z-10">
            <h4 className="font-headline font-bold text-xl text-on-secondary-fixed mb-2">{data.noteTitle}</h4>
            <p className="text-sm text-on-secondary-fixed-variant leading-relaxed">{data.noteMessage}</p>
          </div>
          <div className="relative z-10 mt-6">
            <button
              className="bg-white px-6 py-2 rounded-full text-sm font-black text-secondary-dim shadow-md active:scale-95"
              type="button"
              onClick={() => setMessage('代取需求已发布，等待同学接单。')}
            >
              发布代取
            </button>
          </div>
          <div className="absolute right-4 bottom-[-10px] opacity-20 pointer-events-none">
            <Compass className="w-32 h-32 text-on-secondary-fixed" />
          </div>
        </div>
      </div>
    </div>
  );
};

const PackageCard: React.FC<{pkg: CourierPackage; onAction: (message: string) => void}> = ({pkg, onAction}) => {
  const pending = pkg.etaDays === 0;

  return (
    <div className={`bg-surface-container-lowest rounded-lg p-6 shadow-sm relative overflow-hidden ${pending ? 'border-l-8 border-primary-fixed' : 'border-l-8 border-secondary-fixed'}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 block ${pending ? 'text-primary-fixed' : 'text-secondary-dim'}`}>
            {pending ? 'READY FOR PICKUP' : 'IN TRANSIT'}
          </span>
          <h3 className="font-headline font-bold text-xl text-on-surface">{pkg.title}</h3>
          <p className="text-xs text-on-surface-variant mt-1">取件码 {pkg.code}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-black ${pending ? 'bg-primary-container/10 text-primary-fixed' : 'bg-secondary-container/20 text-secondary-dim'}`}>
          {pkg.tag}
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-on-surface-variant" />
          <span className="text-sm text-on-surface-variant font-medium">{pkg.location}</span>
        </div>
        {pending ? null : (
          <div className="relative h-20 rounded-xl overflow-hidden bg-surface-container-low">
            <div className="absolute inset-0 bg-gradient-to-r from-secondary-fixed/20 to-transparent" />
            <div className="absolute top-1/2 left-4 -translate-y-1/2 flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Truck className="w-6 h-6 text-secondary fill-secondary" />
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface">正在配送至校区服务点</p>
                <p className="text-[10px] text-on-surface-variant">预计 {pkg.etaDays} 天内可取</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          className={`flex-1 py-3 font-bold rounded-full active:scale-95 transition-all text-sm ${pending ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-surface-container text-on-surface-variant'}`}
          type="button"
          onClick={() => onAction(pending ? `${pkg.title} 取件码：${pkg.code}` : `${pkg.title} 详情已打开。`)}
        >
          {pending ? '查看取件码' : '查看详情'}
        </button>
        {pending ? (
          <button
            className="flex-1 py-3 bg-primary-fixed text-white font-bold rounded-full active:scale-95 transition-all text-sm shadow-sm"
            type="button"
            onClick={() => onAction(`${pkg.title} 已委托代取。`)}
          >
            委托代取
          </button>
        ) : null}
      </div>
    </div>
  );
};

const StatusNote: React.FC<{loading: boolean; error: string; source: 'api' | 'mock'}> = ({loading, error}) => {
  if (loading) {
    return <p className="text-xs font-medium text-primary">正在同步教师快递数据...</p>;
  }
  if (error) {
    return <p className="text-xs font-medium text-red-600">{error}</p>;
  }
  return null;
};
