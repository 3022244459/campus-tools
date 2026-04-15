import React from 'react';
import { 
  ChevronLeft, 
  UserCircle, 
  GraduationCap
} from 'lucide-react';
import { motion } from 'motion/react';

export const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  React.useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden max-w-md mx-auto">
      {/* Background Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'radial-gradient(#d8a272 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      {/* Abstract Shapes */}
      <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-secondary-fixed opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-5%] left-[-10%] w-80 h-80 bg-primary-container opacity-10 rounded-full blur-3xl"></div>

      <motion.main 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center gap-10"
      >
        {/* Logo Container */}
        <div className="relative w-48 h-48 md:w-56 md:h-56">
          <div className="absolute inset-0 bg-white/50 rounded-xl rotate-6 scale-105"></div>
          <div className="absolute inset-0 bg-primary-container/20 rounded-xl -rotate-3 scale-105"></div>
          <div className="w-full h-full rounded-xl bg-white p-6 shadow-2xl relative overflow-hidden flex items-center justify-center">
            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-secondary-fixed/10 -rotate-12 translate-y-4"></div>
            <img 
              src="./images/remote-12-d769ee83a1.png" 
              alt="Logo" 
              className="w-full h-full relative z-20"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* App Identity */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="font-headline font-extrabold text-5xl md:text-6xl tracking-tight text-on-surface">
            校园宝
          </h1>
          <div className="h-1.5 w-16 bg-primary-container rounded-full"></div>
          <p className="font-body font-semibold text-on-surface-variant text-lg mt-2 tracking-widest opacity-60 uppercase">HBWL CAMPUS PASS</p>
        </div>
      </motion.main>
    </div>
  );
};
