import React from 'react';
import {ApiError, fetchCourier, fetchCurrentUser, fetchHome, fetchWallet} from './api';
import {emptyCourierData, emptyHomeBootstrap, emptyWalletData} from './emptyData';
import type {Screen} from './routes';
import type {AuthSession, CourierData, HomeBootstrap, Identity, WalletData} from './types';

interface UseShellDataOptions {
  session: AuthSession | null;
  preferredIdentity: Identity;
  currentScreen: Screen;
  onSessionRefresh: (session: AuthSession) => void;
  onSessionExpired: () => void;
}

export interface ShellDataState {
  dataLoading: boolean;
  dataNotice: string;
  homeData: HomeBootstrap;
  courierData: CourierData;
  walletData: WalletData;
}

const mockLoginNotice = '';
const mockFallbackNotice = '';
const apiConnectedNotice = '';
const adminConnectedNotice = '';

export function useShellData({
  session,
  preferredIdentity,
  currentScreen,
  onSessionRefresh,
  onSessionExpired,
}: UseShellDataOptions): ShellDataState {
  const [dataLoading, setDataLoading] = React.useState(Boolean(session));
  const [dataNotice, setDataNotice] = React.useState(session?.source === 'mock' ? mockLoginNotice : '');
  const [homeData, setHomeData] = React.useState<HomeBootstrap>(emptyHomeBootstrap);
  const [courierData, setCourierData] = React.useState<CourierData>(emptyCourierData);
  const [walletData, setWalletData] = React.useState<WalletData>(emptyWalletData);

  const refreshShellData = React.useCallback(async (nextSession: AuthSession, options?: {silent?: boolean}) => {
    if (!options?.silent) {
      setDataLoading(true);
    }

    try {
      const user = await fetchCurrentUser(nextSession);
      const normalizedSession = {...nextSession, user};
      onSessionRefresh(normalizedSession);

      if (normalizedSession.user.role === 'admin') {
        setDataNotice(adminConnectedNotice);
        return;
      }

      const [homeResult, courierResult, walletResult] = await Promise.all([
        fetchHome(normalizedSession),
        fetchCourier(normalizedSession),
        fetchWallet(normalizedSession),
      ]);

      setHomeData(homeResult.data);
      setCourierData(courierResult.data);
      setWalletData(walletResult.data);

      if (normalizedSession.source === 'mock') {
        setDataNotice(mockLoginNotice);
      } else if (homeResult.source === 'mock' || courierResult.source === 'mock' || walletResult.source === 'mock') {
        setDataNotice(mockFallbackNotice);
      } else {
        setDataNotice(apiConnectedNotice);
      }
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 401) {
        onSessionExpired();
        return;
      }

      try {
        const mockSession: AuthSession = {...nextSession, source: 'mock'};
        const [homeResult, courierResult, walletResult] = await Promise.all([
          fetchHome(mockSession),
          fetchCourier(mockSession),
          fetchWallet(mockSession),
        ]);

        setHomeData(homeResult.data);
        setCourierData(courierResult.data);
        setWalletData(walletResult.data);
        setDataNotice(mockFallbackNotice);
      } catch {
        setHomeData(emptyHomeBootstrap);
        setCourierData(emptyCourierData);
        setWalletData(emptyWalletData);
        setDataNotice('');
      }
    } finally {
      setDataLoading(false);
    }
  }, [onSessionExpired, onSessionRefresh]);

  React.useEffect(() => {
    if (!session) {
      setDataLoading(false);
      setHomeData(emptyHomeBootstrap);
      setCourierData(emptyCourierData);
      setWalletData(emptyWalletData);
      setDataNotice('');
      return;
    }

    void refreshShellData(session);
  }, [preferredIdentity, refreshShellData, session?.token]);

  React.useEffect(() => {
    if (!session) {
      return;
    }

    const shouldRefresh = ['home', 'profile', 'teacher-profile', 'services'].includes(currentScreen);
    if (!shouldRefresh) {
      return;
    }

    void refreshShellData(session, {silent: true});
  }, [currentScreen, refreshShellData, session?.token]);

  React.useEffect(() => {
    if (!session) {
      return;
    }

    function handleFocus() {
      void refreshShellData(session!, {silent: true});
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        void refreshShellData(session!, {silent: true});
      }
    }

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refreshShellData, session]);

  return {
    dataLoading,
    dataNotice,
    homeData,
    courierData,
    walletData,
  };
}
