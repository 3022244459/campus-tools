import React from 'react';
import { 
  Droplets, 
  Zap, 
  History, 
  ChevronRight, 
  Calendar,
  Bath,
  Edit2,
  ArrowRight
} from 'lucide-react';
import {fetchUtilities, rechargeWater} from '../lib/api';
import type {AuthSession, UtilityData} from '../lib/types';
import {IntegrationPendingNote} from './IntegrationPendingNote';

interface WaterRechargeScreenProps {
  session: AuthSession;
}

export const WaterRechargeScreen: React.FC<WaterRechargeScreenProps> = ({session}) => {
  const [utilityData, setUtilityData] = React.useState<UtilityData>(getInitialUtilityData(session.user.identity));
  const [selectedAmount, setSelectedAmount] = React.useState(20);
  const [message, setMessage] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    fetchUtilities(session)
      .then((result) => {
        if (active) {
          setUtilityData(result.data);
        }
      })
      .catch((error) => {
        if (active) {
          setMessage(error instanceof Error ? error.message : '热水余额读取失败。');
        }
      });

    return () => {
      active = false;
    };
  }, [session]);

  async function handleRecharge() {
    setSubmitting(true);
    setMessage('');

    try {
      const result = await rechargeWater(session, selectedAmount, utilityData);
      setUtilityData(result.data);
      setMessage(`热水充值成功，当前余额 ¥${result.data.waterBalance.toFixed(2)}。`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '热水充值失败，请稍后重试。');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-8 pt-4">
      <IntegrationPendingNote />

      {/* Hero Section */}
      <section className="relative">
        <div className="bg-secondary-container rounded-lg p-8 overflow-hidden relative min-h-[220px] flex flex-col justify-end">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary-fixed-dim opacity-30 rounded-full"></div>
          <div className="absolute top-12 right-12 w-8 h-8 bg-white opacity-20 rounded-full"></div>
          
          <div className="absolute right-0 bottom-0 w-48 h-48 translate-x-4 translate-y-4">
            <img 
              src="./images/remote-45-43d9591fec.png" 
              alt="Otter Mascot" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="relative z-10">
            <p className="text-on-secondary-container font-semibold text-sm opacity-80 mb-1">当前热水余额 (元)</p>
            <h2 className="text-on-secondary-container font-headline font-extrabold text-5xl tracking-tight">{utilityData.waterBalance.toFixed(2)}</h2>
          </div>
        </div>
        <div className="absolute -bottom-3 left-12 w-10 h-10 bg-secondary-fixed shadow-lg rounded-full flex items-center justify-center border-4 border-background">
          <Droplets className="w-5 h-5 text-on-secondary-fixed fill-on-secondary-fixed" />
        </div>
      </section>

      {/* Quick Top-up */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="font-headline font-bold text-2xl text-on-surface">快速充值</h3>
            <p className="text-on-surface-variant text-sm">选择充值金额，即刻享受热水</p>
          </div>
          <Zap className="w-8 h-8 text-primary-fixed fill-primary-fixed" />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {[10, 20, 50, 100, 200].map((amount) => (
            <button 
              key={amount}
              className={`py-6 rounded-lg flex flex-col items-center justify-center transition-all active:scale-95 ${
                amount === selectedAmount ? 'bg-primary-container shadow-lg shadow-primary-container/20' : 'bg-surface-container-highest border-2 border-transparent hover:border-primary'
              }`}
              type="button"
              onClick={() => setSelectedAmount(amount)}
            >
              <span className={`text-xs mb-1 font-bold ${amount === selectedAmount ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>¥</span>
              <span className={`font-headline font-bold text-2xl ${amount === selectedAmount ? 'text-on-primary-container' : 'text-on-surface'}`}>{amount}</span>
            </button>
          ))}
          <button
            className="bg-surface-container-low border-2 border-dashed border-outline-variant py-6 rounded-lg flex flex-col items-center justify-center active:scale-95"
            type="button"
            onClick={() => {
              setSelectedAmount(30);
              setMessage('已选择自定义金额 ¥30。');
            }}
          >
            <Edit2 className="w-5 h-5 text-on-surface-variant mb-1" />
            <span className="text-on-surface-variant font-bold text-xs">自定义</span>
          </button>
        </div>

        {message ? (
          <p className="mt-4 rounded-lg bg-primary-container/15 px-4 py-3 text-sm font-bold text-primary">{message}</p>
        ) : null}

        <button
          type="button"
          onClick={handleRecharge}
          disabled={submitting}
          className="w-full mt-8 bg-primary text-white font-headline font-bold py-5 rounded-xl text-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          {submitting ? '处理中...' : '立即充值'}
          <ArrowRight className="w-5 h-5" />
        </button>
      </section>

      {/* Usage History */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-headline font-bold text-2xl text-on-surface">用水记录</h3>
          <button
            className="text-primary font-bold text-sm flex items-center gap-1"
            type="button"
            onClick={() => setMessage('已显示近 30 天用水记录。')}
          >
            查看全部
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container-low p-5 rounded-lg flex flex-col gap-3 relative overflow-hidden group">
            <div className="absolute -right-2 -top-2 w-12 h-12 bg-secondary-container/20 rounded-full group-hover:scale-150 transition-transform"></div>
            <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center">
              <Calendar className="w-5 h-5 text-on-secondary-fixed" />
            </div>
            <div>
              <p className="text-on-surface-variant text-xs font-semibold">昨日消耗</p>
              <p className="text-on-surface font-headline font-bold text-xl">¥ 3.50</p>
            </div>
          </div>
          
          <div className="bg-surface-container-low p-5 rounded-lg flex flex-col gap-3 relative overflow-hidden group">
            <div className="absolute -right-2 -top-2 w-12 h-12 bg-primary-container/20 rounded-full group-hover:scale-150 transition-transform"></div>
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
              <History className="w-5 h-5 text-on-primary-fixed" />
            </div>
            <div>
              <p className="text-on-surface-variant text-xs font-semibold">平均每日</p>
              <p className="text-on-surface font-headline font-bold text-xl">¥ 4.20</p>
            </div>
          </div>

          <div className="col-span-2 bg-surface-container-lowest p-5 rounded-lg flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-primary">
                <Bath className="w-6 h-6" />
              </div>
              <div>
                <p className="text-on-surface font-bold">{utilityData.waterTransactions[0]?.title ?? '热水充值'}</p>
                <p className="text-on-surface-variant text-xs">{utilityData.waterTransactions[0]?.time ?? '刚刚'}</p>
              </div>
            </div>
            <p className="text-on-surface font-headline font-bold text-lg">{utilityData.waterTransactions[0]?.amount ?? '+0.00'}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

function getInitialUtilityData(identity: AuthSession['user']['identity']): UtilityData {
  return {
    waterBalance: identity === 'teacher' ? 68 : 42.5,
    electricityKwh: identity === 'teacher' ? 58 : 36.5,
    reminderEnabled: true,
    waterTransactions: [
      {id: 'water-initial', title: identity === 'teacher' ? '教师公寓热水' : '1号宿舍楼 302室', time: '昨天 19:45', amount: identity === 'teacher' ? '-3.20' : '-2.80'},
    ],
    electricityTransactions: [
      {id: 'electricity-initial', title: '电费缴纳', time: '上月 08:30', amount: '+30.00 度'},
    ],
  };
}
