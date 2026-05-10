import React from 'react';
import {
  getSessionEntryScreen,
  isScreenAllowedForSession,
  normalizeScreenForIdentity,
  readScreenRoute,
  type Screen,
  writeScreenRoute,
} from './routes';
import type {AuthSession} from './types';

export function useScreenRouting(session: AuthSession | null) {
  const [currentScreen, setCurrentScreen] = React.useState<Screen>('splash');

  const commitScreen = React.useCallback((screen: Screen, options?: {replace?: boolean}) => {
    setCurrentScreen(screen);
    writeScreenRoute(screen, options);
  }, []);

  React.useEffect(() => {
    function handleRouteChange() {
      const routedScreen = readScreenRoute();
      if (!routedScreen) {
        return;
      }

      if (!isScreenAllowedForSession(routedScreen, session)) {
        setCurrentScreen(getSessionEntryScreen(session));
        return;
      }

      setCurrentScreen(normalizeScreenForIdentity(routedScreen, session?.user.identity ?? null));
    }

    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [session]);

  return {
    currentScreen,
    commitScreen,
  };
}
