import React from 'react';
import { 
  Wallet, 
  Banknote, 
  QrCode, 
  CreditCard, 
  Utensils, 
  WashingMachine, 
  PlusSquare, 
  ShoppingBag,
  ChevronRight
} from 'lucide-react';

export const WalletScreen: React.FC = () => {
  return (
    <div className="space-y-8 pt-4 pb-10">
      {/* Hero Balance Card */}
      <section className="relative">
        <div className="bg-primary-container rounded-lg p-8 overflow-hidden relative shadow-lg min-h-[180px] flex flex-col justify-center">
          {/* Mascot Decoration */}
          <div className="absolute -right-4 -bottom-6 w-40 h-40 opacity-90 rotate-12 z-0">
            <img 
              src="./images/remote-44-50fadcabea.png" 
              alt="Mascot" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="relative z-10 space-y-2">
            <p className="text-on-primary-fixed-variant font-medium opacity-80 text-sm">总余额 (元)</p>
            <h2 className="text-white text-5xl font-black tracking-tight headline-lg">8,842.50</h2>
            <div className="pt-4 flex items-center gap-2">
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs text-white backdrop-blur-sm font-bold">今日收益 +12.40</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Actions Bento Grid */}
      <section className="grid grid-cols-2 gap-4">
        <ActionCard 
          icon={<Wallet className="w-8 h-8" />} 
          label="充值" 
          bgColor="bg-surface-container-highest" 
          iconBg="bg-primary-fixed" 
        />
        <ActionCard 
          icon={<Banknote className="w-8 h-8" />} 
          label="提现" 
          bgColor="bg-secondary-container" 
          iconBg="bg-secondary" 
        />
        <ActionCard 
          icon={<QrCode className="w-8 h-8" />} 
          label="付款码" 
          bgColor="bg-secondary-container" 
          iconBg="bg-secondary" 
        />
        <ActionCard 
          icon={<CreditCard className="w-8 h-8" />} 
          label="银行卡" 
          bgColor="bg-surface-container-highest" 
          iconBg="bg-primary-fixed" 
        />
      </section>

      {/* Transaction History */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-xl font-bold text-on-background">收支明细</h3>
          <button className="text-primary font-bold text-sm">查看全部</button>
        </div>
        <div className="bg-surface-container-lowest rounded-lg overflow-hidden p-2 space-y-1 shadow-sm">
          <TransactionItem 
            icon={<Utensils className="w-6 h-6" />} 
            title="二食堂 - 兰州拉面" 
            time="今天 12:30" 
            amount="-15.00" 
            iconColor="text-orange-600" 
            iconBg="bg-orange-100" 
          />
          <TransactionItem 
            icon={<WashingMachine className="w-6 h-6" />} 
            title="5号楼 - 自助洗衣" 
            time="今天 09:15" 
            amount="-4.00" 
            iconColor="text-sky-600" 
            iconBg="bg-sky-100" 
          />
          <TransactionItem 
            icon={<PlusSquare className="w-6 h-6" />} 
            title="银行卡充值" 
            time="昨天 18:20" 
            amount="+500.00" 
            isPositive 
            iconColor="text-green-600" 
            iconBg="bg-green-100" 
          />
          <TransactionItem 
            icon={<ShoppingBag className="w-6 h-6" />} 
            title="校园超市 - 文具购买" 
            time="昨天 14:05" 
            amount="-22.50" 
            iconColor="text-purple-600" 
            iconBg="bg-purple-100" 
          />
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
}> = ({ icon, label, bgColor, iconBg }) => (
  <div className={`${bgColor} rounded-lg p-6 flex flex-col justify-between items-start aspect-square hover:opacity-90 transition-all active:scale-95 duration-150 group cursor-pointer shadow-sm`}>
    <div className={`${iconBg} rounded-full p-3 text-white shadow-md`}>
      {icon}
    </div>
    <span className="font-bold text-lg text-on-background">{label}</span>
  </div>
);

const TransactionItem: React.FC<{
  icon: React.ReactNode;
  title: string;
  time: string;
  amount: string;
  isPositive?: boolean;
  iconColor: string;
  iconBg: string;
}> = ({ icon, title, time, amount, isPositive, iconColor, iconBg }) => (
  <div className="flex items-center justify-between p-4 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 ${iconBg} ${iconColor} rounded-full flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="font-bold text-on-background">{title}</p>
        <p className="text-xs text-on-surface-variant font-medium">{time}</p>
      </div>
    </div>
    <span className={`font-bold ${isPositive ? 'text-green-600' : 'text-on-background'}`}>
      {amount}
    </span>
  </div>
);

