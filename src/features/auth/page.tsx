import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthHeader, AuthHero, LoginForm, RegisterForm } from '@/features/auth/components';

export const AuthPage = ({ onAuthSuccess }: { onAuthSuccess: () => void }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen w-full relative flex flex-col font-sans overflow-x-hidden selection:text-pink-600 selection:bg-pink-100 bg-transparent dot-grid">
      <AuthHeader />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:justify-center relative z-10 w-full xl:max-w-[1400px] xl:mx-auto">
        <div className="w-full flex-1 md:flex-none flex items-center justify-center px-4 md:px-8 py-8 md:py-0">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[1000px] relative"
          >
            {/* Ambient Background Glow for the Card */}
            <div className="absolute -inset-16 bg-gradient-to-tr from-pink-200/20 via-rose-100/10 to-purple-200/15 blur-[100px] rounded-[4rem] md:rounded-[6rem] pointer-events-none -z-10 hidden md:block"></div>

            <div className="relative bg-white/90 md:bg-white/80 backdrop-blur-2xl border border-slate-200/60 rounded-3xl md:rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col md:flex-row gap-8 md:gap-16 p-6 md:p-12 lg:p-16 w-full">
              <AuthHero />

              <div className="flex-[1.2] flex flex-col relative z-10 w-full max-w-md mx-auto md:max-w-none min-h-[300px] justify-center">
                <AnimatePresence mode="wait">
                  {isLogin ? (
                    <LoginForm
                      onAuthSuccess={onAuthSuccess}
                      onSwitchToRegister={() => setIsLogin(false)}
                    />
                  ) : (
                    <RegisterForm
                      onSwitchToLogin={() => setIsLogin(true)}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
