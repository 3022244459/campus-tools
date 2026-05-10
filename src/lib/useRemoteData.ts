import React from 'react';
import type {AuthSession, DataSource} from './types';
import type {RemoteResult} from './api';

export function useRemoteData<T>(
  session: AuthSession,
  initialData: T,
  loader: (session: AuthSession) => Promise<RemoteResult<T>>,
) {
  const [data, setData] = React.useState<T>(initialData);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [source, setSource] = React.useState<DataSource>(session.source);

  React.useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError('');

      try {
        const result = await loader(session);
        if (cancelled) {
          return;
        }

        setData(result.data);
        setSource(result.source);
      } catch (error) {
        if (cancelled) {
          return;
        }

        setError(error instanceof Error ? error.message : '加载失败，请稍后重试。');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [loader, session]);

  return {data, loading, error, source};
}
