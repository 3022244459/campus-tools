import React from 'react';
import {ArrowRight, ParkingCircle, PlusCircle, QrCode, School, ShoppingBag, Utensils, Wallet, Wifi} from 'lucide-react';
import {fetchTeacherCampusCard} from '../../lib/api';
import {emptyTeacherCampusCardData} from '../../lib/emptyData';
import {useRemoteData} from '../../lib/useRemoteData';
import type {AuthSession, CampusCardTransaction, TeacherCampusCardData} from '../../lib/types';

export const TeacherCampusCardScreen: React.FC<{ session: AuthSession }> = ({session}) => {
  const {data, loading, error, source} = useRemoteData<TeacherCampusCardData>(session, emptyTeacherCampusCardData, fetchTeacherCampusCard);
  const [message, setMessage] = React.useState('');

  return (
    <div className="space-y-8 pt-4 pb-20">
      <section className="relative mt-8 group">
        <div className="absolute -top-12 -right-4 z-10 w-32 h-32 transform rotate-12 transition-transform group-hover:scale-110">
          <img src="./images/remote-27-1ec0168071.png" alt="Cute Deer Mascot" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
        </div>
        <div className="bg-gradient-to-br from-primary-container to-primary p-8 rounded-lg shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-12">
              <div>
                <p className="text-white/80 font-bold tracking-widest text-xs uppercase mb-1">TJU CAMPUS CARD</p>
                <h2 className="text-white font-headline font-extrabold text-2xl">{data.cardTitle}</h2>
              </div>
              <Wifi className="text-white w-8 h-8" />
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-white/70 text-sm mb-1">卡余额 (CNY)</p>
                <p className="text-white font-headline font-black text-5xl tracking-tight">{data.balance}</p>
              </div>
              <div className="text-right">
                <p className="text-white/90 font-bold text-lg">{data.ownerName}</p>
                <p className="text-white/60 text-xs font-mono">ID: {data.maskedId}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StatusNote loading={loading} error={error} source={source} />
      {message ? (
        <section className="rounded-lg bg-primary-container/15 px-4 py-3 text-sm font-bold text-primary">{message}</section>
      ) : null}

      <section className="mt-8 grid grid-cols-2 gap-4">
        <button
          className="flex flex-col items-center justify-center bg-secondary-container/80 backdrop-blur-md p-6 rounded-lg hover:bg-secondary-container transition-colors active:scale-95 border-b-4 border-secondary-dim/20 shadow-sm"
          type="button"
          onClick={() => setMessage('校园卡充值成功，余额已更新。')}
        >
          <PlusCircle className="text-secondary w-10 h-10 mb-2 fill-secondary/20" />
          <span className="font-bold text-on-secondary-container">余额充值</span>
        </button>
        <button
          className="flex flex-col items-center justify-center bg-surface-container-highest p-6 rounded-lg hover:bg-surface-container-high transition-colors active:scale-95 border-b-4 border-primary/10 shadow-sm"
          type="button"
          onClick={() => setMessage('付款码已打开，可用于食堂和停车场。')}
        >
          <QrCode className="text-primary w-10 h-10 mb-2" />
          <span className="font-bold text-on-primary-container">付款码</span>
        </button>
      </section>

      <section className="mt-10 bg-secondary-fixed-dim/20 rounded-lg p-6 relative overflow-hidden border border-secondary-fixed-dim/30">
        <div className="absolute -right-10 -bottom-10 opacity-10">
          <School className="w-32 h-32 text-on-surface" />
        </div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-headline font-bold text-lg flex items-center gap-2">
            <span className="w-2 h-6 bg-secondary-fixed-dim rounded-full"></span>
            校园动态
          </h3>
          <span className="text-secondary text-xs font-bold bg-white px-3 py-1 rounded-full shadow-sm">New</span>
        </div>
        <p className="text-on-surface-variant text-sm leading-relaxed">
          <span className="font-bold text-secondary">公告:</span> {data.notification}
        </p>
      </section>

      <section className="mt-10">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="font-headline font-extrabold text-2xl">交易流水</h3>
            <p className="text-on-surface-variant text-sm">Transaction History</p>
          </div>
          <button className="text-primary font-bold text-sm flex items-center gap-1" type="button" onClick={() => setMessage('已显示全部交易流水。')}>
            查看全部 <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-4">
          {data.transactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} onClick={() => setMessage(`已打开流水详情：${transaction.title}`)} />
          ))}
        </div>
      </section>
    </div>
  );
};

const TransactionItem: React.FC<{ transaction: CampusCardTransaction; onClick: () => void }> = ({ transaction, onClick }) => {
  const icon = transaction.icon === 'utensils'
    ? <Utensils className="w-6 h-6 text-secondary fill-secondary/20" />
    : transaction.icon === 'parking'
      ? <ParkingCircle className="w-6 h-6 text-primary-dim fill-primary-dim/20" />
      : transaction.icon === 'wallet'
        ? <Wallet className="w-6 h-6 text-green-700 fill-green-700/20" />
        : <ShoppingBag className="w-6 h-6 text-on-tertiary-container fill-on-tertiary-container/20" />;

  const bgColor = transaction.tone === 'secondary'
    ? 'bg-secondary-fixed'
    : transaction.tone === 'primary'
      ? 'bg-primary-fixed-dim/20'
      : transaction.tone === 'green'
        ? 'bg-green-100'
        : 'bg-tertiary-container';

  return (
    <button
      className="flex w-full items-center justify-between p-5 text-left bg-surface-container-low rounded-lg hover:bg-surface-container transition-colors cursor-pointer border border-outline-variant/5"
      type="button"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <h4 className="font-bold text-on-surface">{transaction.title}</h4>
          <p className="text-on-surface-variant text-xs">{transaction.time}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-headline font-bold text-lg ${transaction.positive ? 'text-green-600' : 'text-on-surface'}`}>{transaction.amount}</p>
        <p className="text-on-surface-variant text-[10px]">余额: {transaction.balance}</p>
      </div>
    </button>
  );
};

const StatusNote: React.FC<{loading: boolean; error: string; source: 'api' | 'mock'}> = ({loading, error}) => {
  if (loading) return <p className="text-xs font-medium text-primary">正在同步校园卡数据...</p>;
  if (error) return <p className="text-xs font-medium text-red-600">{error}</p>;
  return null;
};
