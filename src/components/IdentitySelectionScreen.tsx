import React from 'react';
import { 
  ChevronLeft, 
  GraduationCap, 
  ArrowRight 
} from 'lucide-react';
import { motion } from 'motion/react';

interface IdentitySelectionProps {
  onSelect: (identity: 'student' | 'teacher') => void;
}

export const IdentitySelectionScreen: React.FC<IdentitySelectionProps> = ({ onSelect }) => {
  const [selected, setSelected] = React.useState<'student' | 'teacher' | null>(null);

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col items-center justify-between py-12 px-6 max-w-md mx-auto relative overflow-hidden">
      {/* Background Decorations */}
      <div className="fixed -top-12 -left-12 w-48 h-48 bg-primary-fixed/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed top-1/2 -right-12 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Branding */}
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
          <p className="text-on-surface-variant font-medium mt-1">请选择您的校园身份</p>
        </div>
      </header>

      {/* Selection Grid */}
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

        {/* Description Card */}
        <div className="bg-surface-container-low p-6 rounded-lg border-2 border-dashed border-outline-variant/30">
          <div className="flex items-start gap-4">
            <div className="bg-primary-fixed p-2 rounded-full">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-on-surface-variant leading-relaxed">
                选择身份后，我们将为您定制个性化的校园功能，包括课程表、成绩查询或教学管理工具。
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Actions */}
      <footer className="w-full flex flex-col items-center gap-4 relative z-10">
        <button 
          disabled={!selected}
          onClick={() => selected && onSelect(selected)}
          className={`w-full py-5 font-bold text-xl rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_8px_0_0_#CC6600] active:shadow-none active:translate-y-2 ${
            selected ? 'bg-primary-fixed text-white' : 'bg-gray-300 text-gray-500 shadow-none cursor-not-allowed'
          }`}
        >
          <span>完成</span>
          <ArrowRight className="w-6 h-6" />
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

const IdentityCard: React.FC<{ 
  label: string; 
  type: 'student' | 'teacher'; 
  selected: boolean; 
  onClick: () => void;
  color: string;
  accentColor: string;
}> = ({ label, type, selected, onClick, color, accentColor }) => (
  <button 
    onClick={onClick}
    className={`group relative flex flex-col items-center justify-center bg-surface-container-lowest p-6 rounded-lg transition-all duration-300 active:scale-95 border-2 shadow-sm ${
      selected ? `border-primary-fixed ring-2 ring-primary-fixed/20` : 'border-transparent hover:border-gray-200'
    }`}
  >
    <div className={`w-28 h-28 mb-4 rounded-full flex items-center justify-center transition-colors relative overflow-visible ${color}/10`}>
      {type === 'student' ? (
        <StudentAvatar />
      ) : (
        <TeacherAvatar />
      )}
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
