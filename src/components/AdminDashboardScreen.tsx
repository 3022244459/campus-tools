import React from 'react';
import {Activity, Bell, LogOut, RefreshCcw, Search, ShieldCheck, UsersRound} from 'lucide-react';
import {ApiError, fetchAdminMetrics, fetchAdminOverview, fetchAdminUsers, publishAdminAnnouncement, revokeAdminUserSessions} from '../lib/api';
import type {AdminMetrics, AdminOverview, AdminUserDirectory, AnnouncementSubmitPayload, AuthSession, UserRole} from '../lib/types';

interface AdminDashboardScreenProps {
  session: AuthSession;
  onLogout: () => void;
  onSessionExpired: () => void;
}

const initialForm: AnnouncementSubmitPayload = {
  audience: 'all',
  label: '校园公告',
  message: '',
};

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({session, onLogout, onSessionExpired}) => {
  const [overview, setOverview] = React.useState<AdminOverview | null>(null);
  const [metrics, setMetrics] = React.useState<AdminMetrics | null>(null);
  const [directory, setDirectory] = React.useState<AdminUserDirectory | null>(null);
  const [form, setForm] = React.useState<AnnouncementSubmitPayload>(initialForm);
  const [userRoleFilter, setUserRoleFilter] = React.useState<'all' | UserRole>('all');
  const [userSearch, setUserSearch] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [metricsLoading, setMetricsLoading] = React.useState(true);
  const [usersLoading, setUsersLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [revokingUserId, setRevokingUserId] = React.useState<string | null>(null);
  const [error, setError] = React.useState('');

  const handleAdminError = React.useCallback((adminError: unknown, fallback: string) => {
    if (adminError instanceof ApiError && adminError.statusCode === 401) {
      onSessionExpired();
      return;
    }

    setError(adminError instanceof Error ? adminError.message : fallback);
  }, [onSessionExpired]);

  const loadOverview = React.useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      setOverview(await fetchAdminOverview(session));
    } catch (loadError) {
      handleAdminError(loadError, '管理员数据加载失败。');
    } finally {
      setLoading(false);
    }
  }, [handleAdminError, session]);

  const loadUsers = React.useCallback(async () => {
    setUsersLoading(true);
    setError('');

    try {
      setDirectory(await fetchAdminUsers(session, {
        role: userRoleFilter === 'all' ? undefined : userRoleFilter,
        q: userSearch.trim() || undefined,
        limit: 8,
      }));
    } catch (loadError) {
      handleAdminError(loadError, '用户列表加载失败。');
    } finally {
      setUsersLoading(false);
    }
  }, [handleAdminError, session, userRoleFilter, userSearch]);

  const loadMetrics = React.useCallback(async () => {
    setMetricsLoading(true);
    setError('');

    try {
      setMetrics(await fetchAdminMetrics(session));
    } catch (loadError) {
      handleAdminError(loadError, '运行指标加载失败。');
    } finally {
      setMetricsLoading(false);
    }
  }, [handleAdminError, session]);

  React.useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  React.useEffect(() => {
    void loadMetrics();
  }, [loadMetrics]);

  React.useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const nextOverview = await publishAdminAnnouncement(session, form);
      setOverview(nextOverview);
      setForm({...initialForm, audience: form.audience});
    } catch (saveError) {
      handleAdminError(saveError, '公告发布失败。');
    } finally {
      setSaving(false);
    }
  };

  const handleRevokeSessions = async (userId: string) => {
    setRevokingUserId(userId);
    setError('');

    try {
      await revokeAdminUserSessions(session, userId);
      await Promise.all([loadOverview(), loadUsers()]);
    } catch (revokeError) {
      handleAdminError(revokeError, '会话清退失败。');
    } finally {
      setRevokingUserId(null);
    }
  };

  const stats = overview?.stats;
  const roleFilters: Array<{value: 'all' | UserRole; label: string}> = [
    {value: 'all', label: '全部'},
    {value: 'student', label: '学生'},
    {value: 'teacher', label: '教师'},
    {value: 'admin', label: '管理员'},
  ];

  return (
    <div className="min-h-screen max-w-md mx-auto bg-background text-on-surface px-4 py-6 space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Admin Console</p>
          <h1 className="text-2xl font-headline font-extrabold text-primary-fixed">校园后台</h1>
          <p className="text-sm text-on-surface-variant mt-1">{session.user.name} · {session.user.organization}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              void loadOverview();
              void loadMetrics();
              void loadUsers();
            }}
            className="h-10 w-10 rounded-full bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-center active:scale-95"
            aria-label="刷新"
          >
            <RefreshCcw className="h-5 w-5 text-primary" />
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="h-10 w-10 rounded-full bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-center active:scale-95"
            aria-label="退出登录"
          >
            <LogOut className="h-5 w-5 text-primary" />
          </button>
        </div>
      </header>

      {error ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>
      ) : null}

      <section className="rounded-lg bg-primary-fixed text-white p-5 space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-white/15 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-white/70">权限状态</p>
            <h2 className="text-xl font-bold">管理员已认证</h2>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-white/75">
          当前后台可查看用户、公告、会话、审批和系统运行指标。
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <MetricCard icon={<UsersRound className="h-5 w-5" />} label="用户" value={stats?.users ?? 0} />
        <MetricCard icon={<ShieldCheck className="h-5 w-5" />} label="管理员" value={stats?.admins ?? 0} />
        <MetricCard label="会话" value={stats?.activeSessions ?? 0} />
        <MetricCard label="待审批" value={stats?.pendingApprovals ?? 0} />
        <MetricCard label="代取单" value={stats?.takeoutOrders ?? 0} />
        <MetricCard label="报修单" value={stats?.repairRequests ?? 0} />
      </section>

      <section className="rounded-lg bg-surface-container-lowest border border-outline-variant/30 p-4 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-primary-fixed">运行指标</h2>
          </div>
          <span className="text-xs font-semibold text-on-surface-variant">
            {metrics ? `运行 ${formatUptime(metrics.uptimeSeconds)}` : '等待同步'}
          </span>
        </div>

        {metricsLoading ? (
          <p className="rounded-lg bg-surface p-4 text-sm text-on-surface-variant">正在加载运行指标...</p>
        ) : metrics ? (
          <>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <RuntimeStat label="请求总量" value={metrics.totalRequests} />
              <RuntimeStat label="处理中" value={metrics.inFlightRequests} />
              <RuntimeStat label="平均延迟" value={`${metrics.averageLatencyMs}ms`} />
              <RuntimeStat label="P95 延迟" value={`${metrics.p95LatencyMs}ms`} />
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-on-surface-variant">状态码</span>
                <span className="font-semibold text-on-surface">{formatCountMap(metrics.statusCounts)}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-on-surface-variant">告警</span>
                <span className="font-semibold text-on-surface">
                  {metrics.alerts.enabled ? `已启用 · 成功 ${metrics.alerts.sentCount} / 失败 ${metrics.alerts.failedCount}` : '未配置'}
                </span>
              </div>
            </div>

            {metrics.topPaths.length ? (
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-primary-fixed">高频路径</h3>
                {metrics.topPaths.slice(0, 4).map((item) => (
                  <div key={item.path} className="flex items-center justify-between gap-3 text-sm">
                    <span className="min-w-0 truncate text-on-surface-variant">{item.path}</span>
                    <span className="shrink-0 font-semibold text-on-surface">{item.count}</span>
                  </div>
                ))}
              </div>
            ) : null}

            {metrics.recentFailures.length ? (
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-primary-fixed">最近失败</h3>
                {metrics.recentFailures.slice(0, 3).map((failure) => (
                  <div key={`${failure.timestamp}-${failure.path}`} className="text-sm">
                    <p className="font-semibold text-red-600">{failure.statusCode} · {failure.method} {failure.path}</p>
                    <p className="text-xs text-on-surface-variant">
                      {new Date(failure.timestamp).toLocaleString()} · {failure.durationMs}ms
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant">暂无失败请求。</p>
            )}
          </>
        ) : (
          <p className="rounded-lg bg-surface p-4 text-sm text-on-surface-variant">暂无运行指标。</p>
        )}
      </section>

      <section className="rounded-lg bg-surface-container-lowest border border-outline-variant/30 p-4 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <UsersRound className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-primary-fixed">用户与会话</h2>
          </div>
          <span className="text-xs font-semibold text-on-surface-variant">
            {directory?.total ?? 0} 个匹配
          </span>
        </div>

        <label className="flex items-center gap-2 rounded-lg border border-outline-variant/30 bg-surface px-3 py-2">
          <Search className="h-4 w-4 text-on-surface-variant" />
          <input
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            value={userSearch}
            onChange={(event) => setUserSearch(event.target.value)}
            placeholder="搜索账号、姓名、院系"
            maxLength={80}
          />
        </label>

        <div className="grid grid-cols-4 gap-2">
          {roleFilters.map((filter) => (
            <button
              type="button"
              key={filter.value}
              onClick={() => setUserRoleFilter(filter.value)}
              className={`rounded-lg px-2 py-2 text-xs font-semibold border ${
                userRoleFilter === filter.value
                  ? 'bg-primary-fixed text-white border-primary-fixed'
                  : 'bg-surface text-on-surface-variant border-outline-variant/30'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {usersLoading ? (
          <p className="rounded-lg bg-surface p-4 text-sm text-on-surface-variant">正在加载用户...</p>
        ) : directory?.items.length ? (
          <div className="space-y-2">
            {directory.items.map((user) => (
              <article key={user.id} className="rounded-lg bg-surface border border-outline-variant/30 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-bold text-on-surface">{user.name}</h3>
                      <span className="rounded-full bg-secondary-container px-2 py-0.5 text-xs font-semibold text-on-secondary-container">
                        {formatRole(user.role)}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-xs text-on-surface-variant">
                      {user.username} · {user.organization}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${
                    user.activeSessionCount > 0
                      ? 'bg-green-100 text-green-700'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                  >
                    {user.activeSessionCount > 0 ? `${user.activeSessionCount} 会话` : '离线'}
                  </span>
                </div>
                <p className="mt-2 text-xs text-on-surface-variant">
                  最近登录：{formatDateTime(user.lastSessionAt)}
                </p>
                {user.id !== session.user.id && user.activeSessionCount > 0 ? (
                  <button
                    type="button"
                    onClick={() => void handleRevokeSessions(user.id)}
                    disabled={revokingUserId === user.id}
                    className="mt-3 w-full rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 disabled:opacity-60"
                  >
                    {revokingUserId === user.id ? '清退中...' : '清退该用户会话'}
                  </button>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-lg bg-surface p-4 text-sm text-on-surface-variant">暂无匹配用户。</p>
        )}
      </section>

      <form onSubmit={handleSubmit} className="rounded-lg bg-surface-container-lowest border border-outline-variant/30 p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <h2 className="font-bold text-primary-fixed">公告发布</h2>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {(['all', 'student', 'teacher'] as const).map((audience) => (
            <button
              type="button"
              key={audience}
              onClick={() => setForm((current) => ({...current, audience}))}
              className={`rounded-lg px-3 py-2 text-sm font-semibold border ${
                form.audience === audience
                  ? 'bg-primary-fixed text-white border-primary-fixed'
                  : 'bg-surface text-on-surface-variant border-outline-variant/30'
              }`}
            >
              {audience === 'all' ? '全部' : audience === 'student' ? '学生' : '教师'}
            </button>
          ))}
        </div>

        <label className="block">
          <span className="text-xs font-semibold text-on-surface-variant">标题</span>
          <input
            className="mt-2 w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-3 text-sm outline-none focus:border-primary"
            value={form.label}
            onChange={(event) => setForm((current) => ({...current, label: event.target.value}))}
            maxLength={24}
            required
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-on-surface-variant">内容</span>
          <textarea
            className="mt-2 min-h-24 w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-3 text-sm outline-none focus:border-primary"
            value={form.message}
            onChange={(event) => setForm((current) => ({...current, message: event.target.value}))}
            maxLength={240}
            required
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-primary-fixed py-3 text-sm font-bold text-white disabled:bg-gray-300"
        >
          {saving ? '发布中...' : '发布公告'}
        </button>
      </form>

      <section className="space-y-3">
        <h2 className="font-bold text-primary-fixed">最近公告</h2>
        {loading ? (
          <p className="rounded-lg bg-surface-container-lowest p-4 text-sm text-on-surface-variant">正在加载...</p>
        ) : overview?.announcements.length ? (
          overview.announcements.map((announcement) => (
            <article key={announcement.id} className="rounded-lg bg-surface-container-lowest border border-outline-variant/30 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold text-on-surface">{announcement.label}</h3>
                <span className="rounded-full bg-secondary-container px-2 py-1 text-xs font-semibold text-on-secondary-container">
                  {announcement.audience === 'all' ? '全部' : announcement.audience === 'student' ? '学生' : '教师'}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{announcement.message}</p>
              <p className="mt-2 text-xs text-on-surface-variant">{new Date(announcement.publishedAt).toLocaleString()}</p>
            </article>
          ))
        ) : (
          <p className="rounded-lg bg-surface-container-lowest p-4 text-sm text-on-surface-variant">暂无公告。</p>
        )}
      </section>

      <section className="space-y-3 pb-4">
        <h2 className="font-bold text-primary-fixed">审计日志</h2>
        {overview?.recentAuditLogs.length ? (
          overview.recentAuditLogs.map((log) => (
            <article key={log.id} className="rounded-lg bg-surface-container-lowest border border-outline-variant/30 p-3">
              <p className="text-xs font-semibold text-primary">{log.type}</p>
              <p className="mt-1 text-sm text-on-surface">{log.detail}</p>
              <p className="mt-1 text-xs text-on-surface-variant">{new Date(log.createdAt).toLocaleString()}</p>
            </article>
          ))
        ) : (
          <p className="rounded-lg bg-surface-container-lowest p-4 text-sm text-on-surface-variant">暂无审计日志。</p>
        )}
      </section>
    </div>
  );
};

function formatRole(role: UserRole): string {
  if (role === 'admin') {
    return '管理员';
  }

  return role === 'teacher' ? '教师' : '学生';
}

function formatDateTime(value?: string): string {
  if (!value) {
    return '暂无记录';
  }

  return new Date(value).toLocaleString();
}

function formatUptime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m`;
  }

  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

function formatCountMap(record: Record<string, number>): string {
  const entries = Object.entries(record).filter(([, value]) => value > 0);
  if (!entries.length) {
    return '暂无';
  }

  return entries.map(([key, value]) => `${key} ${value}`).join(' · ');
}

const RuntimeStat: React.FC<{label: string; value: number | string}> = ({label, value}) => (
  <div>
    <p className="text-xs font-semibold text-on-surface-variant">{label}</p>
    <p className="mt-1 text-lg font-extrabold text-primary-fixed">{value}</p>
  </div>
);

const MetricCard: React.FC<{icon?: React.ReactNode; label: string; value: number}> = ({icon, label, value}) => (
  <div className="rounded-lg bg-surface-container-lowest border border-outline-variant/30 p-4 min-h-24">
    <div className="flex items-center justify-between">
      <p className="text-sm font-semibold text-on-surface-variant">{label}</p>
      {icon ? <span className="text-primary">{icon}</span> : null}
    </div>
    <p className="mt-3 text-2xl font-extrabold text-primary-fixed">{value}</p>
  </div>
);
