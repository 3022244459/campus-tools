import React from 'react';
import {MapPin, PlusCircle, Search} from 'lucide-react';
import {fetchLostFound, submitLostFound} from '../lib/api';
import {emptyLostFoundData} from '../lib/emptyData';
import {useRemoteData} from '../lib/useRemoteData';
import type {AuthSession, LostFoundData, LostFoundItem} from '../lib/types';

interface LostAndFoundScreenProps {
  session: AuthSession;
}

export const LostAndFoundScreen: React.FC<LostAndFoundScreenProps> = ({session}) => {
  const remote = useRemoteData<LostFoundData>(session, emptyLostFoundData, fetchLostFound);
  const [viewData, setViewData] = React.useState<LostFoundData>(remote.data);
  const [currentSource, setCurrentSource] = React.useState<'api' | 'mock'>(remote.source);
  const [query, setQuery] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState<'all' | 'lost' | 'found'>('all');
  const [publishType, setPublishType] = React.useState<'lost' | 'found'>('lost');
  const [title, setTitle] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [actionError, setActionError] = React.useState('');
  const [actionMessage, setActionMessage] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    setViewData(remote.data);
  }, [remote.data]);

  React.useEffect(() => {
    setCurrentSource(remote.source);
  }, [remote.source]);

  const filteredItems = React.useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return viewData.latestItems.filter((item) => {
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      const matchesKeyword = !keyword || [
        item.title,
        item.location,
        item.description ?? '',
      ].some((value) => value.toLowerCase().includes(keyword));
      return matchesType && matchesKeyword;
    });
  }, [query, typeFilter, viewData.latestItems]);

  const featuredItem = filteredItems.find((item) => item.featured) ?? null;
  const gridItems = featuredItem ? filteredItems.filter((item) => item.id !== featuredItem.id) : filteredItems;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setActionError('');
    setActionMessage('');

    try {
      const result = await submitLostFound(session, {
        title,
        location,
        description,
        type: publishType,
      }, viewData);
      setViewData(result.data);
      setCurrentSource(result.source);
      setActionMessage(publishType === 'lost' ? '寻物信息已发布。' : '招领信息已发布。');
      setTitle('');
      setLocation('');
      setDescription('');
      setTypeFilter(publishType);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : '发布失败，请稍后重试。');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8 pt-4 pb-20">
      <div className="relative bg-secondary-container rounded-lg p-6 overflow-hidden flex items-center justify-between">
        <div className="z-10 max-w-[60%]">
          <h1 className="text-3xl font-black leading-tight mb-2 text-on-secondary-container">{viewData.heroTitle}</h1>
          <p className="text-on-secondary-container opacity-80 text-sm">
            {viewData.heroDescription} 已帮助找回 {viewData.foundCount} 件物品。
          </p>
        </div>
        <div className="absolute right-0 bottom-0 w-40 h-40 transform translate-y-4">
          <img
            src="./images/remote-15-6b090cb29b.png"
            alt="Detective Cat"
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      <StatusNote
        loading={remote.loading}
        error={remote.error || actionError}
        source={currentSource}
        message={actionMessage}
      />

      <section className="grid grid-cols-2 gap-4">
        <button
          className={`py-6 rounded-lg flex flex-col items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform ${
            publishType === 'lost'
              ? 'bg-primary-container text-white'
              : 'bg-surface-container-low text-on-surface'
          }`}
          onClick={() => setPublishType('lost')}
          type="button"
        >
          <Search className="w-10 h-10 fill-current" />
          <span className="font-bold">我丢了东西</span>
        </button>
        <button
          className={`py-6 rounded-lg flex flex-col items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform ${
            publishType === 'found'
              ? 'bg-secondary text-on-secondary'
              : 'bg-surface-container-low text-on-surface'
          }`}
          onClick={() => setPublishType('found')}
          type="button"
        >
          <PlusCircle className="w-10 h-10 fill-current" />
          <span className="font-bold">我捡到东西</span>
        </button>
      </section>

      <section className="bg-surface-container-lowest rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-on-surface">{publishType === 'lost' ? '发布寻物启事' : '发布招领信息'}</h2>
          <span className="text-xs font-bold text-primary bg-primary-container/15 px-3 py-1 rounded-full">
            发布后直接出现在列表顶部
          </span>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            className="w-full bg-surface-container-low rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-primary"
            placeholder={publishType === 'lost' ? '例如：黑色雨伞' : '例如：学生证'}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <input
            className="w-full bg-surface-container-low rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-primary"
            placeholder="发现或丢失地点"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />
          <textarea
            className="w-full bg-surface-container-low rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-primary"
            placeholder="补充颜色、特征、时间等信息"
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <button
            className="w-full bg-primary-fixed text-on-primary-fixed py-4 rounded-xl font-bold shadow-lg disabled:opacity-70"
            type="submit"
            disabled={submitting}
          >
            {submitting ? '发布中...' : publishType === 'lost' ? '发布寻物' : '发布招领'}
          </button>
        </form>
      </section>

      <section className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            type="text"
            placeholder="搜索物品名或地点..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full bg-surface-container-low border-none rounded-full py-3 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <FilterChip label="全部" active={typeFilter === 'all'} onClick={() => setTypeFilter('all')} />
          <FilterChip label="招领" active={typeFilter === 'found'} onClick={() => setTypeFilter('found')} />
          <FilterChip label="寻物" active={typeFilter === 'lost'} onClick={() => setTypeFilter('lost')} />
        </div>
      </section>

      {featuredItem ? <FeaturedCard item={featuredItem} /> : null}

      <div className="grid grid-cols-2 gap-4">
        {gridItems.map((item) => (
          <LostItemCard key={item.id} item={item} />
        ))}
        {!filteredItems.length ? (
          <div className="col-span-2 bg-surface-container-lowest rounded-lg p-6 text-sm text-on-surface-variant shadow-sm">
            当前没有匹配的信息，稍后再来看一看。
          </div>
        ) : null}
      </div>
    </div>
  );
};

const FeaturedCard: React.FC<{item: LostFoundItem}> = ({item}) => (
  <div className="bg-surface-container-lowest rounded-lg overflow-hidden flex flex-col col-span-2 shadow-sm">
    <div className="flex h-32">
      <div className="w-1/3 h-full">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="w-2/3 p-4 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-base mb-1">{item.title}</h3>
            <span className={`text-white text-[10px] px-2 py-0.5 rounded-full ${item.type === 'found' ? 'bg-secondary/80' : 'bg-primary/80'}`}>
              {item.type === 'found' ? '招领' : '寻物'}
            </span>
          </div>
          <p className="text-xs text-on-surface-variant line-clamp-2">{item.description}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-[10px] text-on-surface-variant">
            <MapPin className="w-3 h-3" />
            <span>{item.location}</span>
          </div>
          <span className="text-[10px] font-bold text-primary">{item.time}</span>
        </div>
      </div>
    </div>
  </div>
);

const LostItemCard: React.FC<{item: LostFoundItem}> = ({item}) => (
  <div className="bg-surface-container-lowest rounded-lg overflow-hidden flex flex-col shadow-sm group">
    <div className="h-40 w-full relative">
      <img src={item.image} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      <div className={`absolute top-2 left-2 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-full ${item.type === 'found' ? 'bg-secondary/80' : 'bg-primary/80'}`}>
        {item.type === 'found' ? '招领' : '寻物'}
      </div>
    </div>
    <div className="p-3">
      <h3 className="font-bold text-sm mb-1 truncate">{item.title}</h3>
      <div className="flex items-center gap-1 text-[10px] text-on-surface-variant">
        <MapPin className="w-3 h-3" />
        <span>{item.location}</span>
      </div>
      <div className="mt-2 text-[10px] text-primary font-bold">{item.time}</div>
    </div>
  </div>
);

const FilterChip: React.FC<{label: string; active: boolean; onClick: () => void}> = ({label, active, onClick}) => (
  <button
    className={`px-3 py-1 rounded-full text-xs font-bold ${
      active ? 'bg-surface-container-highest text-on-surface' : 'bg-surface-container-low text-on-surface-variant'
    }`}
    onClick={onClick}
    type="button"
  >
    {label}
  </button>
);

const StatusNote: React.FC<{loading: boolean; error: string; source: 'api' | 'mock'; message: string}> = ({loading, error, message}) => {
  if (loading) {
    return <p className="text-xs font-medium text-primary">正在同步失物招领数据...</p>;
  }
  if (error) {
    return <p className="text-xs font-medium text-red-600">{error}</p>;
  }
  if (message) {
    return <p className="text-xs font-medium text-green-600">{message}</p>;
  }
  return null;
};
