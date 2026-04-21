import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Flame, User, MessageCircle } from 'lucide-react';
interface BottomNavProps {
  activeView: 'main' | 'confessions' | 'chats' | string;
  onViewChange: (view: 'main' | 'confessions' | 'chats') => void;
  onAccountClick: () => void;
}
export function BottomNav({
  activeView,
  onViewChange,
  onAccountClick
}: BottomNavProps) {
  const tabs = [
  {
    id: 'main',
    label: 'Discover',
    icon: Compass
  },
  {
    id: 'chats',
    label: 'Chats',
    icon: MessageCircle
  },
  {
    id: 'confessions',
    label: 'Confessions',
    icon: Flame
  },
  {
    id: 'account',
    label: 'Account',
    icon: User
  }];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-lg border-t border-slate-800 pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
          activeView === tab.id ||
          tab.id === 'account' && activeView === 'account';
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'account') {
                  onAccountClick();
                } else {
                  onViewChange(tab.id as 'main' | 'confessions' | 'chats');
                }
              }}
              className="relative flex flex-col items-center justify-center w-16 h-12 gap-1">
              
              <div className="relative z-10 flex flex-col items-center justify-center">
                <Icon
                  size={20}
                  className={`transition-colors duration-200 ${isActive ? 'text-pink-500' : 'text-slate-400'}`} />
                
                <span
                  className={`text-[10px] font-medium transition-colors duration-200 ${isActive ? 'text-pink-500' : 'text-slate-400'}`}>
                  
                  {tab.label}
                </span>
              </div>

              {isActive &&
              <motion.div
                layoutId="bottomNavIndicator"
                className="absolute inset-0 bg-pink-500/10 rounded-xl"
                transition={{
                  type: 'spring',
                  bounce: 0.2,
                  duration: 0.6
                }} />

              }
            </button>);

        })}
      </div>
    </div>);

}