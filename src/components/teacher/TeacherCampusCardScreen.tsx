import React from 'react';
import { 
  Wifi, 
  QrCode, 
  PlusCircle, 
  School, 
  ArrowRight, 
  Utensils, 
  ParkingCircle, 
  Wallet, 
  ShoppingBag 
} from 'lucide-react';

export const TeacherCampusCardScreen: React.FC = () => {
  return (
    <div className="space-y-8 pt-4 pb-20">
      {/* Hero Section: Campus Card */}
      <section className="relative mt-8 group">
        <div className="absolute -top-12 -right-4 z-10 w-32 h-32 transform rotate-12 transition-transform group-hover:scale-110">
          <img 
            src="./images/remote-27-1ec0168071.png" 
            alt="Cute Deer Mascot" 
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="bg-gradient-to-br from-primary-container to-primary p-8 rounded-lg shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-12">
              <div>
                <p className="text-white/80 font-bold tracking-widest text-xs uppercase mb-1">HBUAS CAMPUS CARD</p>
                <h2 className="text-white font-headline font-extrabold text-2xl">教师电子卡</h2>
              </div>
              <Wifi className="text-white w-8 h-8" />
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-white/70 text-sm mb-1">卡余额 (CNY)</p>
                <p className="text-white font-headline font-black text-5xl tracking-tight">¥ 864.50</p>
              </div>
              <div className="text-right">
                <p className="text-white/90 font-bold text-lg">王晓云 教授</p>
                <p className="text-white/60 text-xs font-mono">ID: **** 8829</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Bento */}
      <section className="mt-8 grid grid-cols-2 gap-4">
        <button className="flex flex-col items-center justify-center bg-secondary-container/80 backdrop-blur-md p-6 rounded-lg hover:bg-secondary-container transition-colors active:scale-95 border-b-4 border-secondary-dim/20 shadow-sm">
          <PlusCircle className="text-secondary w-10 h-10 mb-2 fill-secondary/20" />
          <span className="font-bold text-on-secondary-container">余额充值</span>
        </button>
        <button className="flex flex-col items-center justify-center bg-surface-container-highest p-6 rounded-lg hover:bg-surface-container-high transition-colors active:scale-95 border-b-4 border-primary/10 shadow-sm">
          <QrCode className="text-primary w-10 h-10 mb-2" />
          <span className="font-bold text-on-primary-container">付款码</span>
        </button>
      </section>

      {/* Campus Pulse: Notifications */}
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
          <span className="font-bold text-secondary">公告:</span> 卧龙校区B区停车场于周五进行路面维护，请老师们移步C区停放。
        </p>
      </section>

      {/* Transaction History */}
      <section className="mt-10">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="font-headline font-extrabold text-2xl">交易流水</h3>
            <p className="text-on-surface-variant text-sm">Transaction History</p>
          </div>
          <button className="text-primary font-bold text-sm flex items-center gap-1">
            查看全部 <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-4">
          <TransactionItem 
            icon={<Utensils className="w-6 h-6 text-secondary fill-secondary/20" />} 
            title="第一教工食堂" 
            time="今天 12:15 · 午餐" 
            amount="-18.50" 
            balance="864.50" 
            bgColor="bg-secondary-fixed"
          />
          <TransactionItem 
            icon={<ParkingCircle className="w-6 h-6 text-primary-dim fill-primary-dim/20" />} 
            title="卧龙校区停车场" 
            time="昨天 18:30 · 停车费" 
            amount="-5.00" 
            balance="883.00" 
            bgColor="bg-primary-fixed-dim/20"
          />
          <TransactionItem 
            icon={<Wallet className="w-6 h-6 text-green-700 fill-green-700/20" />} 
            title="系统充值" 
            time="10月24日 09:00 · 银行卡转入" 
            amount="+500.00" 
            balance="888.00" 
            bgColor="bg-green-100"
            positive
          />
          <TransactionItem 
            icon={<ShoppingBag className="w-6 h-6 text-on-tertiary-container fill-on-tertiary-container/20" />} 
            title="校园超市 (便利店)" 
            time="10月23日 16:45 · 零售" 
            amount="-32.40" 
            balance="388.00" 
            bgColor="bg-tertiary-container"
          />
        </div>
      </section>
    </div>
  );
};

const TransactionItem: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  time: string; 
  amount: string; 
  balance: string; 
  bgColor: string;
  positive?: boolean;
}> = ({ icon, title, time, amount, balance, bgColor, positive }) => (
  <div className="flex items-center justify-between p-5 bg-surface-container-low rounded-lg hover:bg-surface-container transition-colors cursor-pointer border border-outline-variant/5">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-on-surface">{title}</h4>
        <p className="text-on-surface-variant text-xs">{time}</p>
      </div>
    </div>
    <div className="text-right">
      <p className={`font-headline font-bold text-lg ${positive ? 'text-green-600' : 'text-on-surface'}`}>{amount}</p>
      <p className="text-on-surface-variant text-[10px]">余额: {balance}</p>
    </div>
  </div>
);
