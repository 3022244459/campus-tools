import React from 'react';
import {BookOpen, ChevronRight, Footprints, Map as MapIcon, MapPin, Navigation, Pizza, School, Search, Zap} from 'lucide-react';
import {fetchNavigation} from '../lib/api';
import {emptyNavigationData} from '../lib/emptyData';
import {useRemoteData} from '../lib/useRemoteData';
import type {AuthSession, NavigationData} from '../lib/types';

interface NavigationScreenProps {
  session: AuthSession;
}

export const NavigationScreen: React.FC<NavigationScreenProps> = ({session}) => {
  const {data, loading, error, source} = useRemoteData<NavigationData>(session, emptyNavigationData, fetchNavigation);
  const [query, setQuery] = React.useState('');
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    const destination = window.sessionStorage.getItem('campus:navigationDestination');
    if (!destination) {
      return;
    }
    window.sessionStorage.removeItem('campus:navigationDestination');
    setQuery(destination);
    setMessage(`已为你定位到：${destination}。`);
  }, []);

  const filteredRoutes = React.useMemo(() => {
    if (!query.trim()) {
      return data.routes;
    }
    const keyword = query.trim().toLowerCase();
    return data.routes.filter((route) => (
      route.title.toLowerCase().includes(keyword) ||
      route.description.toLowerCase().includes(keyword)
    ));
  }, [data.routes, query]);

  return (
    <div className="space-y-6 pt-4">
      <section className="relative">
        <div className="bg-secondary-container rounded-lg p-6 flex items-center justify-between overflow-hidden">
          <div className="z-10 max-w-[60%]">
            <h2 className="font-headline font-extrabold text-3xl text-on-secondary-container leading-tight">
              校园导航
              <br />
              智能路线
            </h2>
            <p className="font-body text-sm text-on-secondary-container mt-2 opacity-80">{data.heroDescription}</p>
          </div>
          <div className="absolute -right-4 -bottom-2 w-40 h-40">
            <img
              src="./images/remote-19-73f2b0da9b.png"
              alt="Penguin Mascot"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      <div className="relative group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-primary" />
        </div>
        <input
          className="w-full bg-surface-container-highest border-none rounded-xl py-4 pl-14 pr-6 font-body font-semibold text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary transition-all"
          placeholder="搜索目的地或路线"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <StatusNote loading={loading} error={error} source={source} />
      {message ? (
        <section className="rounded-lg bg-primary-container/15 px-4 py-3 text-sm font-bold text-primary">
          {message}
        </section>
      ) : null}

      <section className="bg-surface-container-lowest rounded-lg shadow-sm overflow-hidden border-2 border-surface-container">
        <div className="p-4 flex justify-between items-center bg-surface-container-low">
          <span className="font-headline font-bold text-on-surface">{data.mapTitle}</span>
          <MapIcon className="w-5 h-5 text-primary-fixed" />
        </div>
        <div className="relative h-64 w-full bg-[#e7f5ff] overflow-hidden">
          <img
            src="./images/remote-20-5a7339b422.png"
            alt="Map"
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />

          {data.pins.map((pin) => (
            <div key={pin.id} className={`absolute ${pin.positionClass} flex flex-col items-center`}>
              <div className={`text-white p-2 rounded-full shadow-lg ${pin.type === 'academic' ? 'bg-primary' : pin.type === 'canteen' ? 'bg-secondary' : 'bg-tertiary ring-4 ring-white scale-110'}`}>
                {pin.type === 'academic' ? <School className="w-4 h-4 fill-white" /> : pin.type === 'canteen' ? <Pizza className="w-4 h-4 fill-white" /> : <MapPin className="w-4 h-4 fill-white" />}
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${pin.type === 'location' ? 'bg-primary-container text-white' : 'bg-white/90 text-on-surface'}`}>
                {pin.label}
              </span>
            </div>
          ))}
        </div>
        <button
          className="w-full py-4 bg-primary-fixed text-on-primary-fixed font-headline font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
          type="button"
          onClick={() => setMessage('导航已开始：预计 8 分钟到达目的地。')}
        >
          <Navigation className="w-5 h-5 fill-white" />
          开启实时导航
        </button>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="font-headline font-extrabold text-xl text-on-surface">推荐路线</h3>
          <button
            className="text-primary text-sm font-bold active:scale-95"
            type="button"
            onClick={() => setMessage('已显示全部推荐路线。')}
          >
            查看更多
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {filteredRoutes.map((route) => (
            <button
              key={route.id}
              className={`p-4 rounded-lg flex flex-col gap-3 text-left group transition-colors active:scale-95 ${route.accent === 'secondary' ? 'bg-surface-container-low hover:bg-secondary-container' : 'bg-surface-container-low hover:bg-primary-container'}`}
              type="button"
              onClick={() => setMessage(`已选择路线：${route.title}。`)}
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                {route.icon === 'footprints' ? <Footprints className={`w-5 h-5 ${route.accent === 'secondary' ? 'text-secondary' : 'text-primary'}`} /> : route.icon === 'book' ? <BookOpen className={`w-5 h-5 ${route.accent === 'secondary' ? 'text-secondary' : 'text-primary'}`} /> : <Zap className={`w-5 h-5 fill-current ${route.accent === 'secondary' ? 'text-secondary' : 'text-primary'}`} />}
              </div>
              <div>
                <p className="font-headline font-bold text-sm">{route.title}</p>
                <p className="text-xs text-on-surface-variant">{route.description}</p>
              </div>
            </button>
          ))}
          <button
            className="col-span-2 bg-surface-container-highest p-4 rounded-lg flex items-center justify-between text-left border-2 border-dashed border-primary/20 active:scale-[0.99]"
            type="button"
            onClick={() => setMessage(`已选择：${data.spotlightTitle}。`)}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <Zap className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <p className="font-headline font-bold">{data.spotlightTitle}</p>
                <p className="text-xs text-on-surface-variant">{data.spotlightDescription}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-primary" />
          </button>
        </div>
      </section>
    </div>
  );
};

const StatusNote: React.FC<{loading: boolean; error: string; source: 'api' | 'mock'}> = ({loading, error}) => {
  if (loading) {
    return <p className="text-xs font-medium text-primary">正在同步导航数据...</p>;
  }
  if (error) {
    return <p className="text-xs font-medium text-red-600">{error}</p>;
  }
  return null;
};
