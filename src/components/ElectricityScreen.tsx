import React from 'react';
import { 
  Zap, 
  BarChart3, 
  Wallet, 
  BellRing, 
  History, 
  ChevronRight,
  Lightbulb
} from 'lucide-react';
import {fetchUtilities, fetchWallet, payElectricity, setElectricityReminder} from '../lib/api';
import type {AuthSession, UtilityData} from '../lib/types';
import {IntegrationPendingNote} from './IntegrationPendingNote';

interface ElectricityScreenProps {
  session: AuthSession;
}

export const ElectricityScreen: React.FC<ElectricityScreenProps> = ({session}) => {
  const [utilityData, setUtilityData] = React.useState<UtilityData>(getInitialUtilityData(session.user.identity));
  const [message, setMessage] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [selectedAmount, setSelectedAmount] = React.useState(30);
  const [customAmount, setCustomAmount] = React.useState('');

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
          setMessage(error instanceof Error ? error.message : '电费信息读取失败。');
        }
      });

    return () => {
      active = false;
    };
  }, [session]);

  async function handlePay() {
    setSubmitting(true);
    setMessage('');

    try {
      const amount = customAmount ? Number(customAmount) : selectedAmount;
      if (!Number.isFinite(amount) || amount <= 0) {
        setMessage('请输入正确的缴费度数。');
        return;
      }
      const result = await payElectricity(session, Number(amount.toFixed(2)), utilityData);
      const walletResult = await fetchWallet(session);
      setUtilityData(result.data);
      setMessage(`缴费成功，当前剩余电量 ${result.data.electricityKwh.toFixed(2)} 度，钱包已扣 ¥${amount.toFixed(2)}，余额 ${walletResult.data.walletBalanceLabel}。`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '电费缴纳失败，请稍后重试。');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReminderToggle() {
    const nextEnabled = !utilityData.reminderEnabled;
    setUtilityData((current) => ({...current, reminderEnabled: nextEnabled}));
    setMessage(nextEnabled ? '低电量提醒已开启。' : '低电量提醒已关闭。');

    try {
      const result = await setElectricityReminder(session, nextEnabled, utilityData);
      setUtilityData(result.data);
    } catch (error) {
      setUtilityData((current) => ({...current, reminderEnabled: !nextEnabled}));
      setMessage(error instanceof Error ? error.message : '提醒设置保存失败。');
    }
  }

  return (
    <div className="space-y-8 pt-4">
      <IntegrationPendingNote />

      {/* Hero Section */}
      <section className="relative">
        <div className="bg-primary-container rounded-lg p-8 shadow-lg overflow-hidden relative">
          <div className="absolute -right-4 -top-8 w-40 h-40 transform rotate-12">
            <img 
              src="./images/remote-11-4fa958baef.png" 
              alt="Electric Mascot" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="relative z-10">
            <p className="font-headline font-bold text-on-primary-container/70 text-sm tracking-wider uppercase">Dormitory 402</p>
            <h2 className="font-headline font-extrabold text-white text-5xl mt-2 tracking-tight">{utilityData.electricityKwh.toFixed(2)} <span className="text-xl">度</span></h2>
            <p className="text-white/90 font-medium mt-1">当前剩余电量</p>
            <div className="mt-5 grid max-w-[260px] grid-cols-3 gap-2">
              {[20, 30, 50].map((amount) => (
                <button
                  key={amount}
                  className={`rounded-full px-3 py-2 text-xs font-black active:scale-95 ${
                    !customAmount && selectedAmount === amount ? 'bg-white text-primary' : 'bg-white/25 text-white'
                  }`}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount('');
                  }}
                >
                  {amount} 度
                </button>
              ))}
            </div>
            <input
              className="mt-3 w-40 rounded-full border-none bg-white/25 px-4 py-2 text-sm font-bold text-white placeholder:text-white/70 focus:ring-2 focus:ring-white"
              value={customAmount}
              onChange={(event) => setCustomAmount(event.target.value)}
              inputMode="decimal"
              placeholder="自定义度数"
            />
            <div className="mt-8">
              <button
                type="button"
                onClick={handlePay}
                disabled={submitting}
                className="bg-white text-primary px-8 py-3 rounded-xl font-bold text-sm active:scale-95 transition-transform"
              >
                {submitting ? '处理中...' : `缴费 ${customAmount || selectedAmount} 度`}
              </button>
            </div>
          </div>
        </div>
      </section>

      {message ? (
        <section className="rounded-lg bg-primary-container/15 px-4 py-3 text-sm font-bold text-primary">
          {message}
        </section>
      ) : null}

      {/* Usage Chart */}
      <section className="grid grid-cols-2 gap-4">
        <div className="col-span-2 bg-surface-container-lowest rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h3 className="font-headline font-bold text-on-surface text-xl">用电趋势</h3>
              <p className="text-on-surface-variant text-xs">最近 7 天用电情况 (kWh)</p>
            </div>
            <div className="flex items-center gap-1 text-primary font-bold">
              <span className="text-xs">详情</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
          
          <div className="flex items-end justify-between h-32 gap-2 px-2">
            {[40, 65, 50, 85, 45, 90, 70].map((h, i) => (
              <div 
                key={i} 
                className={`w-full rounded-t-lg transition-all hover:bg-primary-container ${i === 6 ? 'bg-primary-container' : 'bg-secondary-fixed-dim'}`}
                style={{ height: `${h}%` }}
              ></div>
            ))}
          </div>
          <div className="flex justify-between mt-2 px-1">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
              <span key={d} className={`text-[10px] font-bold ${i === 6 ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>{d}</span>
            ))}
          </div>
        </div>

        <div className="bg-secondary-container rounded-lg p-5 flex flex-col justify-between">
          <Zap className="w-8 h-8 text-on-secondary-container mb-4 fill-on-secondary-container" />
          <div>
            <p className="text-on-secondary-container/80 text-xs font-bold">今日已用</p>
            <h4 className="text-on-secondary-container font-headline font-extrabold text-2xl">4.2 <span className="text-sm">度</span></h4>
          </div>
        </div>

        <div className="bg-surface-container-high rounded-lg p-5 flex flex-col justify-between border-2 border-transparent hover:border-primary/20 transition-all">
          <Wallet className="w-8 h-8 text-primary mb-4 fill-primary" />
          <div>
            <p className="text-on-surface-variant text-xs font-bold">上月电费</p>
            <h4 className="text-on-surface font-headline font-extrabold text-2xl">¥128.0</h4>
          </div>
        </div>
      </section>

      {/* Settings */}
      <section className="space-y-4">
        <h3 className="font-headline font-bold text-on-surface text-lg px-2">功能设置</h3>
        <div className="bg-surface-container-low rounded-lg divide-y divide-outline-variant/10">
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-error-container/20 rounded-full flex items-center justify-center">
                <BellRing className="w-5 h-5 text-error fill-error" />
              </div>
              <div>
                <p className="font-bold text-on-surface">低电量提醒</p>
                <p className="text-xs text-on-surface-variant">低于 5 度时自动通知</p>
              </div>
            </div>
            <button
              className={`w-12 h-6 rounded-full relative p-1 cursor-pointer ${utilityData.reminderEnabled ? 'bg-primary-container' : 'bg-surface-container-highest'}`}
              type="button"
              onClick={handleReminderToggle}
            >
              <div className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${utilityData.reminderEnabled ? 'right-1' : 'left-1'}`}></div>
            </button>
          </div>
          <button
            className="flex w-full items-center justify-between p-5 text-left active:scale-[0.99]"
            type="button"
            onClick={() => setMessage(`已显示近半年缴费记录：${utilityData.electricityTransactions[0]?.title ?? '电费缴纳'} ${utilityData.electricityTransactions[0]?.amount ?? '+0.00 度'}。`)}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-secondary-container/30 rounded-full flex items-center justify-center">
                <History className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="font-bold text-on-surface">缴费记录</p>
                <p className="text-xs text-on-surface-variant">查看近半年的充值详情</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>
      </section>

      {/* Tip */}
      <section className="bg-secondary-fixed-dim/40 rounded-lg p-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-5 h-5 text-secondary fill-secondary" />
            <span className="font-bold text-secondary text-sm">省电小贴士</span>
          </div>
          <p className="text-on-secondary-container text-sm leading-relaxed">
            晚上 11 点后关闭宿舍大灯和显示器，每月可节省约 <span className="font-extrabold">12.5%</span> 的电费哦！
          </p>
        </div>
        <Lightbulb className="absolute right-0 bottom-0 w-32 h-32 opacity-20 transform translate-x-4 translate-y-4" />
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
