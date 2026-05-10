import React from 'react';
import {Banknote, CreditCard, PlusSquare, QrCode, ShoppingBag, Utensils, Wallet, WashingMachine} from 'lucide-react';
import {payWallet, rechargeWallet, withdrawWallet} from '../lib/api';
import type {AuthSession, WalletData, WalletTransaction} from '../lib/types';

interface WalletScreenProps {
  data: WalletData;
  session: AuthSession;
}

export const WalletScreen: React.FC<WalletScreenProps> = ({data, session}) => {
  const [balance, setBalance] = React.useState(data.totalBalance);
  const [dailyChange, setDailyChange] = React.useState(data.dailyChange);
  const [transactions, setTransactions] = React.useState(data.transactions);
  const [activePanel, setActivePanel] = React.useState<'recharge' | 'withdraw' | 'pay' | 'bank' | null>(null);
  const [amount, setAmount] = React.useState('50');
  const [message, setMessage] = React.useState('');
  const [pendingAction, setPendingAction] = React.useState<'recharge' | 'withdraw' | 'pay' | null>(null);

  React.useEffect(() => {
    setBalance(data.totalBalance);
    setDailyChange(data.dailyChange);
    setTransactions(data.transactions);
  }, [data]);

  function getCurrentWalletData(): WalletData {
    return {
      ...data,
      totalBalance: balance,
      dailyChange,
      walletBalanceLabel: formatYuan(balance),
      transactions,
    };
  }

  function applyWalletData(nextData: WalletData) {
    setBalance(nextData.totalBalance);
    setDailyChange(nextData.dailyChange);
    setTransactions(nextData.transactions);
  }

  async function handleRecharge() {
    const parsed = Number(amount);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setMessage('请输入正确的充值金额。');
      return;
    }

    setPendingAction('recharge');
    setMessage('');

    try {
      const result = await rechargeWallet(session, Number(parsed.toFixed(2)), getCurrentWalletData());
      applyWalletData(result.data);
      setMessage(`充值成功，当前余额 ${formatYuan(result.data.totalBalance)}。`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '充值失败，请稍后重试。');
    } finally {
      setPendingAction(null);
    }
  }

  async function handleWithdraw() {
    const parsed = Number(amount);
    if (!Number.isFinite(parsed) || parsed <= 0 || parsed > balance) {
      setMessage('请输入不超过余额的提现金额。');
      return;
    }

    setPendingAction('withdraw');
    setMessage('');

    try {
      const result = await withdrawWallet(session, Number(parsed.toFixed(2)), getCurrentWalletData());
      applyWalletData(result.data);
      setMessage(`提现申请已提交，当前余额 ${formatYuan(result.data.totalBalance)}。`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '提现失败，请稍后重试。');
    } finally {
      setPendingAction(null);
    }
  }

  async function handlePay(amountToPay: number) {
    setPendingAction('pay');
    setMessage('');

    try {
      const result = await payWallet(session, amountToPay, getCurrentWalletData());
      applyWalletData(result.data);
      setMessage('付款成功，已生成消费记录。');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '付款失败，请稍后重试。');
    } finally {
      setPendingAction(null);
    }
  }

  return (
    <div className="space-y-8 pt-4 pb-10">
      <section className="relative">
        <div className="bg-primary-container rounded-lg p-8 overflow-hidden relative shadow-lg min-h-[180px] flex flex-col justify-center">
          <div className="absolute -right-4 -bottom-6 w-40 h-40 opacity-90 rotate-12 z-0">
            <img
              src="./images/remote-44-50fadcabea.png"
              alt="Mascot"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="relative z-10 space-y-2">
            <p className="text-on-primary-fixed-variant font-medium opacity-80 text-sm">总余额（元）</p>
            <h2 className="text-white text-5xl font-black tracking-tight headline-lg">{balance.toLocaleString('zh-CN', {minimumFractionDigits: 2})}</h2>
            <div className="pt-4 flex items-center gap-2">
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs text-white backdrop-blur-sm font-bold">
                今日变化 {dailyChange >= 0 ? '+' : ''}{dailyChange.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4">
        <ActionCard icon={<Wallet className="w-8 h-8" />} label="充值" bgColor="bg-surface-container-highest" iconBg="bg-primary-fixed" onClick={() => setActivePanel('recharge')} />
        <ActionCard icon={<Banknote className="w-8 h-8" />} label="提现" bgColor="bg-secondary-container" iconBg="bg-secondary" onClick={() => setActivePanel('withdraw')} />
        <ActionCard icon={<QrCode className="w-8 h-8" />} label="付款码" bgColor="bg-secondary-container" iconBg="bg-secondary" onClick={() => setActivePanel('pay')} />
        <ActionCard icon={<CreditCard className="w-8 h-8" />} label="银行卡" bgColor="bg-surface-container-highest" iconBg="bg-primary-fixed" onClick={() => setActivePanel('bank')} />
      </section>

      {message ? (
        <section className="rounded-lg bg-primary-container/15 px-4 py-3 text-sm font-bold text-primary">
          {message}
        </section>
      ) : null}

      {activePanel === 'recharge' || activePanel === 'withdraw' ? (
        <section className="rounded-lg bg-surface-container-lowest p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-on-surface">{activePanel === 'recharge' ? '校园卡充值' : '余额提现'}</h3>
            <span className="text-xs font-bold text-on-surface-variant">当前余额 {formatYuan(balance)}</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[20, 50, 100, 200].map((quickAmount) => (
              <button
                key={quickAmount}
                className={`rounded-full px-3 py-2 text-sm font-bold active:scale-95 ${
                  amount === String(quickAmount) ? 'bg-primary-fixed text-white' : 'bg-surface-container-low text-on-surface'
                }`}
                type="button"
                onClick={() => setAmount(String(quickAmount))}
              >
                ¥{quickAmount}
              </button>
            ))}
          </div>
          <input
            className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            inputMode="decimal"
            placeholder="输入金额"
          />
          <button
            className="w-full rounded-xl bg-primary-fixed py-4 text-base font-black text-on-primary-fixed active:scale-95"
            type="button"
            onClick={activePanel === 'recharge' ? handleRecharge : handleWithdraw}
            disabled={pendingAction === 'recharge' || pendingAction === 'withdraw'}
          >
            {pendingAction === activePanel ? '处理中...' : `确认${activePanel === 'recharge' ? '充值' : '提现'}`}
          </button>
        </section>
      ) : null}

      {activePanel === 'pay' ? (
        <section className="rounded-lg bg-surface-container-lowest p-6 shadow-sm text-center space-y-4">
          <div className="mx-auto grid h-36 w-36 grid-cols-5 gap-1 rounded-xl bg-white p-4 shadow-inner">
            {Array.from({length: 25}).map((_, index) => (
              <span key={index} className={`${index % 2 === 0 || index % 7 === 0 ? 'bg-on-surface' : 'bg-white'} rounded-sm`} />
            ))}
          </div>
          <p className="text-sm font-bold text-on-surface">付款码 2688 0426 2026</p>
          <button
            className="rounded-full bg-secondary px-5 py-2 text-sm font-bold text-on-secondary active:scale-95"
            type="button"
            onClick={() => handlePay(12.8)}
            disabled={pendingAction === 'pay'}
          >
            {pendingAction === 'pay' ? '处理中...' : '确认付款 ¥12.80'}
          </button>
        </section>
      ) : null}

      {activePanel === 'bank' ? (
        <section className="rounded-lg bg-surface-container-lowest p-5 shadow-sm space-y-3">
          <h3 className="text-lg font-black text-on-surface">已绑定银行卡</h3>
          {['工商银行 尾号 0826', '建设银行 尾号 1209'].map((card) => (
            <div key={card} className="flex items-center justify-between rounded-xl bg-surface-container-low px-4 py-3">
              <span className="text-sm font-bold text-on-surface">{card}</span>
              <span className="text-xs font-bold text-green-600">可用</span>
            </div>
          ))}
          <button
            className="w-full rounded-full bg-primary-fixed py-3 text-sm font-bold text-on-primary-fixed active:scale-95"
            type="button"
            onClick={() => setMessage('新银行卡绑定申请已提交。')}
          >
            添加银行卡
          </button>
        </section>
      ) : null}

      <section className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-xl font-bold text-on-background">收支明细</h3>
          <button className="text-primary font-bold text-sm" type="button" onClick={() => setMessage(`已显示最近 ${transactions.length} 条流水。`)}>查看全部</button>
        </div>
        <div className="bg-surface-container-lowest rounded-lg overflow-hidden p-2 space-y-1 shadow-sm">
          {transactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onClick={() => setMessage(`已打开流水详情：${transaction.title} ${transaction.amount}。`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

const ActionCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  bgColor: string;
  iconBg: string;
  onClick: () => void;
}> = ({icon, label, bgColor, iconBg, onClick}) => (
  <button
    className={`${bgColor} rounded-lg p-6 flex flex-col justify-between items-start aspect-square hover:opacity-90 transition-all active:scale-95 duration-150 group cursor-pointer shadow-sm`}
    type="button"
    onClick={onClick}
  >
    <div className={`${iconBg} rounded-full p-3 text-white shadow-md`}>
      {icon}
    </div>
    <span className="font-bold text-lg text-on-background">{label}</span>
  </button>
);

const TransactionItem: React.FC<{transaction: WalletTransaction; onClick: () => void}> = ({transaction, onClick}) => {
  const icon = getTransactionIcon(transaction.iconKey);
  const toneClass = getToneClass(transaction.tone);

  return (
    <button
      className="flex w-full items-center justify-between p-4 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer text-left active:scale-[0.99]"
      type="button"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${toneClass.bg} ${toneClass.text}`}>
          {icon}
        </div>
        <div>
          <p className="font-bold text-on-background">{transaction.title}</p>
          <p className="text-xs text-on-surface-variant font-medium">{transaction.time}</p>
        </div>
      </div>
      <span className={`font-bold ${transaction.positive ? 'text-green-600' : 'text-on-background'}`}>
        {transaction.amount}
      </span>
    </button>
  );
};

function getTransactionIcon(iconKey: WalletTransaction['iconKey']) {
  switch (iconKey) {
    case 'utensils': return <Utensils className="w-6 h-6" />;
    case 'washing': return <WashingMachine className="w-6 h-6" />;
    case 'plus': return <PlusSquare className="w-6 h-6" />;
    case 'shopping': return <ShoppingBag className="w-6 h-6" />;
    default: return <Wallet className="w-6 h-6" />;
  }
}

function formatYuan(value: number) {
  return `¥${value.toFixed(2)}`;
}

function getToneClass(tone: WalletTransaction['tone']) {
  switch (tone) {
    case 'orange': return {bg: 'bg-orange-100', text: 'text-orange-600'};
    case 'sky': return {bg: 'bg-sky-100', text: 'text-sky-600'};
    case 'green': return {bg: 'bg-green-100', text: 'text-green-600'};
    case 'purple': return {bg: 'bg-purple-100', text: 'text-purple-600'};
    default: return {bg: 'bg-gray-100', text: 'text-gray-600'};
  }
}
