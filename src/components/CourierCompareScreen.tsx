import React from 'react';
import {AlertCircle, Calculator, LoaderCircle, MapPin, Tag} from 'lucide-react';
import {fetchCompareQuotes} from '../lib/api';
import {emptyCompareForm, emptyCompareResult} from '../lib/emptyData';
import {readStoredCompareForm, writeStoredCompareForm} from '../lib/storage';
import type {AuthSession, CompareResult} from '../lib/types';

interface CourierCompareScreenProps {
  session: AuthSession;
}

export const CourierCompareScreen: React.FC<CourierCompareScreenProps> = ({session}) => {
  const storedForm = readStoredCompareForm() ?? emptyCompareForm;
  const [weight, setWeight] = React.useState(storedForm.weight);
  const [destination, setDestination] = React.useState(storedForm.destination);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [result, setResult] = React.useState<CompareResult>(emptyCompareResult);
  const [sourceLabel, setSourceLabel] = React.useState('输入目的地和重量后即可查询报价。');

  React.useEffect(() => {
    writeStoredCompareForm({weight, destination});
  }, [weight, destination]);

  const handleCompare = async () => {
    setLoading(true);
    setError('');

    try {
      const numericWeight = Number(weight);
      const response = await fetchCompareQuotes(session, destination.trim(), numericWeight);
      setResult(response.data);
      setSourceLabel('报价已更新。');
    } catch (error) {
      setError(error instanceof Error ? error.message : '查询失败，请稍后重试。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pt-4">
      <section className="relative bg-secondary-fixed-dim rounded-lg p-6 overflow-hidden shadow-sm">
        <div className="relative z-10 w-2/3">
          <h1 className="text-3xl font-black text-on-secondary-fixed leading-tight mb-2">快递比价</h1>
          <p className="text-on-secondary-fixed-variant text-sm opacity-90">输入目的地和重量，常用路线快速比价。</p>
        </div>
        <div className="absolute right-[-10px] bottom-[-10px] w-48 h-48">
          <img
            src="./images/remote-06-3b9ca81ec0.png"
            alt="Monkey Mascot"
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      <section className="bg-surface-container-highest rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-on-surface font-bold text-lg">寄件参数</h2>
          <Calculator className="w-5 h-5 text-primary fill-primary" />
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-on-surface-variant mb-1 block">包裹重量 (kg)</label>
            <input
              className="w-full bg-surface-container-lowest border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary text-on-surface font-medium"
              placeholder="1.0"
              type="number"
              min="0.1"
              step="0.1"
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-on-surface-variant mb-1 block">目的地</label>
            <div className="flex items-center bg-surface-container-lowest rounded-xl px-4">
              <MapPin className="w-4 h-4 text-on-surface-variant mr-2" />
              <input
                className="w-full bg-transparent border-none py-3 px-0 focus:ring-0 text-on-surface font-medium placeholder:text-outline/50"
                placeholder="请输入收件省市区"
                type="text"
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
              />
            </div>
          </div>
        </div>
        <button
          onClick={handleCompare}
          disabled={loading}
          className="w-full bg-primary-container text-white font-bold py-4 rounded-xl mt-6 active:scale-95 transition-all shadow-lg shadow-primary-container/20 disabled:opacity-70"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <LoaderCircle className="w-4 h-4 animate-spin" />
              正在比价
            </span>
          ) : '立即比价'}
        </button>

        <p className="mt-3 text-xs font-medium text-primary">{sourceLabel}</p>

        {error ? (
          <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}
      </section>

      <section>
        <div className="flex justify-between items-end mb-4 px-2">
          <h2 className="text-2xl font-black text-on-surface tracking-tight">推荐方案</h2>
          <span className="text-xs font-bold text-primary">
            补贴 ¥{result.subsidy.toFixed(1)}
          </span>
        </div>
        <div className="space-y-4">
          {result.quotes.map((quote) => (
            <PriceCard key={`${quote.company}-${quote.title}`} result={quote} />
          ))}
        </div>
      </section>

      <section className="mb-6">
        <div className="bg-secondary-container rounded-lg p-5 relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="font-bold text-on-secondary-container text-lg mb-1">寄件小贴士</h4>
            <p className="text-xs text-on-secondary-container opacity-80 max-w-[70%]">
              在宿舍楼下服务点投递，每单可额外享受校园补贴。最近一次查询条件会自动保存在本地。
            </p>
          </div>
          <Tag className="absolute right-[-10px] bottom-[-20px] w-24 h-24 opacity-30 rotate-12" />
        </div>
      </section>
    </div>
  );
};

const PriceCard: React.FC<{result: CompareResult['quotes'][number]}> = ({result}) => {
  const logoTone = result.logoTone === 'dark'
    ? 'bg-on-background'
    : result.logoTone === 'brand-zto'
      ? 'bg-[#004d69]'
      : result.logoTone === 'brand-yto'
        ? 'bg-[#854a51]'
        : 'bg-green-700';

  const tagTone = result.tagTone === 'error'
    ? 'bg-error/10 text-error'
    : result.tagTone === 'secondary'
      ? 'bg-secondary/10 text-secondary'
      : result.tagTone === 'success'
        ? 'bg-green-100 text-green-700'
        : 'bg-on-surface-variant/10 text-on-surface-variant/70';

  return (
    <div className="bg-surface-container-lowest rounded-lg p-5 flex items-center justify-between group hover:bg-surface-container-high transition-colors shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 ${logoTone} rounded-full flex items-center justify-center text-white font-black text-sm`}>
          {result.company}
        </div>
        <div>
          <h3 className="font-bold text-on-surface">{result.title}</h3>
          <p className="text-xs text-on-surface-variant">预计 {result.time} 天送达</p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-xl font-black text-primary">¥{result.price}</div>
        <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${tagTone}`}>{result.tag}</div>
      </div>
    </div>
  );
};
