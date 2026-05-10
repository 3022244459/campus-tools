import React from 'react';
import {Layout} from './components/Layout';
import {SplashScreen} from './components/SplashScreen';
import {IdentitySelectionScreen} from './components/IdentitySelectionScreen';
import {AdminDashboardScreen} from './components/AdminDashboardScreen';
import {AppScreenRenderer} from './components/AppScreenRenderer';
import {AUTH_SESSION_EXPIRED_EVENT, login, logout} from './lib/api';
import {
  getActiveTab,
  getScreenTitle,
  getSessionEntryScreen,
  isRootShellScreen,
  isScreen,
  isScreenAllowedForSession,
  normalizeScreenForIdentity,
} from './lib/routes';
import {readStoredIdentity, readStoredSession, writeStoredIdentity, writeStoredSession} from './lib/storage';
import {useScreenRouting} from './lib/useScreenRouting';
import {useShellData} from './lib/useShellData';
import type {AuthSession, Identity} from './lib/types';

const initialSession = readStoredSession();
const initialIdentity = initialSession?.user.identity ?? readStoredIdentity() ?? 'student';

export default function App() {
  const [session, setSession] = React.useState<AuthSession | null>(initialSession);
  const [preferredIdentity, setPreferredIdentity] = React.useState<Identity>(initialIdentity);
  const [authError, setAuthError] = React.useState('');
  const [loginLoading, setLoginLoading] = React.useState(false);
  const activeSessionRef = React.useRef<AuthSession | null>(initialSession);
  const {currentScreen, commitScreen} = useScreenRouting(session);

  const handleSessionRefresh = React.useCallback((nextSession: AuthSession) => {
    activeSessionRef.current = nextSession;
    setSession(nextSession);
  }, []);

  const handleSessionExpired = React.useCallback(() => {
    activeSessionRef.current = null;
    setSession(null);
    setAuthError('登录已过期，请重新登录。');
    commitScreen('identity', {replace: true});
  }, [commitScreen]);

  React.useEffect(() => {
    activeSessionRef.current = session;
  }, [session]);

  React.useEffect(() => {
    const handleApiSessionExpired = () => {
      if (activeSessionRef.current) {
        handleSessionExpired();
      }
    };

    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleApiSessionExpired);
    return () => {
      window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, handleApiSessionExpired);
    };
  }, [handleSessionExpired]);

  const {
    dataLoading,
    dataNotice,
    homeData,
    courierData,
    walletData,
  } = useShellData({
    session,
    preferredIdentity,
    currentScreen,
    onSessionRefresh: handleSessionRefresh,
    onSessionExpired: handleSessionExpired,
  });

  React.useEffect(() => {
    writeStoredSession(session);
    if (session) {
      writeStoredIdentity(session.user.identity);
      setPreferredIdentity(session.user.identity);
    }
  }, [session]);

  const identity = session?.user.identity ?? null;

  const handleNavigate = (screen: string) => {
    if (!isScreen(screen)) {
      return;
    }

    const nextScreen = normalizeScreenForIdentity(screen, identity);
    if (!isScreenAllowedForSession(nextScreen, session)) {
      return;
    }

    commitScreen(nextScreen);
  };

  const handleBack = () => {
    commitScreen('home');
  };

  const handleLogin = async (nextIdentity: Identity, username: string, password: string) => {
    setLoginLoading(true);
    setAuthError('');
    setPreferredIdentity(nextIdentity);
    writeStoredIdentity(nextIdentity);

    try {
      const nextSession = await login(nextIdentity, username, password);
      activeSessionRef.current = nextSession;
      setSession(nextSession);
      commitScreen(nextSession.user.role === 'admin' ? 'admin-dashboard' : 'home', {replace: true});
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : '登录失败，请稍后重试。');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    if (session) {
      setPreferredIdentity(session.user.identity);
      writeStoredIdentity(session.user.identity);
    }
    await logout(session);
    activeSessionRef.current = null;
    setSession(null);
    setAuthError('');
    commitScreen('identity', {replace: true});
  };

  if (currentScreen === 'splash') {
    return (
      <SplashScreen
        onComplete={() => commitScreen(getSessionEntryScreen(session), {replace: true})}
      />
    );
  }

  if (!session || currentScreen === 'identity') {
    return (
      <IdentitySelectionScreen
        defaultIdentity={identity ?? preferredIdentity}
        loading={loginLoading}
        error={authError}
        onLogin={handleLogin}
      />
    );
  }

  if (session.user.role === 'admin') {
    return (
      <AdminDashboardScreen
        session={session}
        onLogout={handleLogout}
        onSessionExpired={handleSessionExpired}
      />
    );
  }

  const headerTitle = getScreenTitle(currentScreen, identity);

  const activeTab = getActiveTab(currentScreen);

  return (
    <Layout
      title={headerTitle}
      activeTab={activeTab}
      setActiveTab={handleNavigate}
      onBack={handleBack}
      showBack={!isRootShellScreen(currentScreen, identity)}
      identity={identity}
    >
      <AppScreenRenderer
        currentScreen={currentScreen}
        identity={identity}
        session={session}
        homeData={homeData}
        courierData={courierData}
        walletData={walletData}
        dataLoading={dataLoading}
        dataNotice={dataNotice}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    </Layout>
  );
}
