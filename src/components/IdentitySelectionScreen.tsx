import React from 'react';
import {ArrowRight, GraduationCap, LoaderCircle} from 'lucide-react';
import {motion} from 'motion/react';
import type {Identity} from '../lib/types';

interface IdentitySelectionProps {
  onLogin: (identity: Identity, username: string, password: string) => void;
  loading: boolean;
  error: string;
  defaultIdentity?: Identity;
}

const showDemoCredentials = import.meta.env.DEV ||
  import.meta.env.VITE_SHOW_DEMO_CREDENTIALS === 'true' ||
  import.meta.env.VITE_SHOW_DEMO_CREDENTIALS === '1' ||
  import.meta.env.VITE_SHOW_DEMO_CREDENTIALS === 'yes';

export const IdentitySelectionScreen: React.FC<IdentitySelectionProps> = ({
  onLogin,
  loading,
  error,
  defaultIdentity = 'student',
}) => {
  const initialIdentity = defaultIdentity as Identity;
  const [selected, setSelected] = React.useState<Identity>(initialIdentity);
  const [username, setUsername] = React.useState(() => getDemoUsername(initialIdentity));
  const [password, setPassword] = React.useState(() => getDemoPassword());

  React.useEffect(() => {
    setUsername(getDemoUsername(selected));
    setPassword(getDemoPassword());
  }, [selected]);

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col items-center justify-between py-12 px-6 max-w-md mx-auto relative overflow-hidden">
      <div className="fixed -top-12 -left-12 w-48 h-48 bg-primary-fixed/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed top-1/2 -right-12 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

      <header className="flex flex-col items-center space-y-4 relative z-10">
        <div className="relative">
          <div className="absolute inset-0 bg-primary-container blur-2xl opacity-20 rounded-2xl"></div>
          <img
            src="./images/remote-12-d769ee83a1.png"
            alt="Logo"
            className="w-24 h-24 relative z-10 drop-shadow-xl rounded-2xl object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-primary-fixed">校园宝</h1>
          <p className="text-on-surface-variant font-medium mt-1">选择身份后即可进入校园服务系统</p>
        </div>
      </header>

      <main className="w-full space-y-6 relative z-10">
        <div className="grid grid-cols-2 gap-6">
          <IdentityCard
            label="我是学生"
            type="student"
            selected={selected === 'student'}
            onClick={() => setSelected('student')}
            color="bg-[#66CCFF]"
            accentColor="bg-[#66CCFF]"
          />
          <IdentityCard
            label="我是老师"
            type="teacher"
            selected={selected === 'teacher'}
            onClick={() => setSelected('teacher')}
            color="bg-primary-fixed"
            accentColor="bg-primary-fixed"
          />
        </div>

        <div className="bg-surface-container-low p-6 rounded-lg border-2 border-dashed border-outline-variant/30 space-y-4">
          <div className="flex items-start gap-4">
            <div className="bg-primary-fixed p-2 rounded-full">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {showDemoCredentials
                  ? '当前已启用登录与会话持久化。默认填充的是可直接登录的测试账号。'
                  : '请输入学校统一身份账号。'}
              </p>
            </div>
          </div>

          <label className="block">
            <span className="text-xs font-semibold text-on-surface-variant">账号</span>
            <input
              className="mt-2 w-full rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-4 py-3 text-sm font-medium text-on-surface outline-none focus:border-primary"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="请输入账号"
              autoComplete="username"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-on-surface-variant">密码</span>
            <input
              className="mt-2 w-full rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-4 py-3 text-sm font-medium text-on-surface outline-none focus:border-primary"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="请输入密码"
              type="password"
              autoComplete="current-password"
            />
          </label>

          {showDemoCredentials ? (
            <p className="text-xs text-on-surface-variant">
              测试账号：`student001 / campus123`、`teacher001 / campus123`、管理员请选择教师入口并使用 `admin001 / campus123`
            </p>
          ) : null}

          {error ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>
          ) : null}
        </div>
      </main>

      <footer className="w-full flex flex-col items-center gap-4 relative z-10">
        <button
          onClick={() => onLogin(selected, username.trim(), password.trim())}
          disabled={loading}
          className="w-full py-5 font-bold text-xl rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_8px_0_0_#CC6600] active:shadow-none active:translate-y-2 bg-primary-fixed text-white disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none disabled:translate-y-0"
        >
          {loading ? (
            <>
              <LoaderCircle className="w-5 h-5 animate-spin" />
              <span>登录中</span>
            </>
          ) : (
            <>
              <span>进入校园宝</span>
              <ArrowRight className="w-6 h-6" />
            </>
          )}
        </button>
        <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium opacity-60">
          <span>继续即表示您同意</span>
          <a href="#" className="underline">服务条款</a>
          <span>与</span>
          <a href="#" className="underline">隐私政策</a>
        </div>
      </footer>
    </div>
  );
};

function getDemoUsername(identity: Identity): string {
  if (!showDemoCredentials) {
    return '';
  }

  return identity === 'student' ? 'student001' : 'teacher001';
}

function getDemoPassword(): string {
  return showDemoCredentials ? 'campus123' : '';
}

const IdentityCard: React.FC<{
  label: string;
  type: Identity;
  selected: boolean;
  onClick: () => void;
  color: string;
  accentColor: string;
}> = ({label, type, selected, onClick, color, accentColor}) => (
  <button
    onClick={onClick}
    className={`group relative flex flex-col items-center justify-center bg-surface-container-lowest p-6 rounded-lg transition-all duration-300 active:scale-95 border-2 shadow-sm ${
      selected ? 'border-primary-fixed ring-2 ring-primary-fixed/20' : 'border-transparent hover:border-gray-200'
    }`}
  >
    <div className={`w-28 h-28 mb-4 rounded-full flex items-center justify-center transition-colors relative overflow-visible ${color}/10`}>
      {type === 'student' ? <StudentAvatar /> : <TeacherAvatar />}
    </div>
    <span className="text-lg font-bold text-on-surface">{label}</span>
    <div className={`mt-2 h-1.5 rounded-full transition-all ${accentColor} ${
      selected ? 'w-16 opacity-100' : 'w-8 opacity-50 group-hover:w-16 group-hover:opacity-100'
    }`}></div>
  </button>
);

const StudentAvatar = () => (
  <svg className="w-24 h-24 drop-shadow-md" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="40" r="25" fill="#FFE0BD" stroke="#333" strokeWidth="2.5" />
    <path d="M25 40C25 25 75 25 75 40" stroke="#333" strokeLinecap="round" strokeWidth="5" />
    <rect x="35" y="65" width="30" height="30" rx="4" fill="#66CCFF" stroke="#333" strokeWidth="2.5" />
    <circle cx="42" cy="40" r="2.5" fill="#333" />
    <circle cx="58" cy="40" r="2.5" fill="#333" />
    <path d="M45 50Q50 53 55 50" stroke="#333" strokeWidth="2" fill="none" />
    <path d="M30 65L20 80" stroke="#333" strokeLinecap="round" strokeWidth="4" />
    <path d="M70 65L80 80" stroke="#333" strokeLinecap="round" strokeWidth="4" />
  </svg>
);

const TeacherAvatar = () => (
  <svg className="w-24 h-24 drop-shadow-md" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="40" r="25" fill="#FFE0BD" stroke="#333" strokeWidth="2.5" />
    <path d="M25 35C25 20 75 20 75 35" fill="#4B3621" stroke="#333" strokeWidth="2" />
    <rect x="35" y="65" width="30" height="35" rx="8" fill="#FF7F00" stroke="#333" strokeWidth="2.5" />
    <rect x="38" y="38" width="10" height="6" rx="1" stroke="#333" strokeWidth="1.5" />
    <rect x="52" y="38" width="10" height="6" rx="1" stroke="#333" strokeWidth="1.5" />
    <path d="M48 41H52" stroke="#333" strokeWidth="1" />
    <path d="M45 52Q50 55 55 52" stroke="#333" strokeWidth="2" fill="none" />
    <path d="M75 70L85 55" stroke="#333" strokeLinecap="round" strokeWidth="3" />
  </svg>
);
