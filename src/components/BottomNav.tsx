import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Flame, User, MessageCircle, MessageSquare, Inbox as InboxIcon, ChevronUp } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export function BottomNav() {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const isMessagesActive = path.startsWith('/messages') || path.startsWith('/chats');

  const tabs = [
    {
      id: 'main',
      label: 'Discover',
      icon: Compass,
      to: '/discover'
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageCircle
    },
    {
      id: 'confessions',
      label: 'Confessions',
      icon: Flame,
      to: '/confessions'
    },
    {
      id: 'account',
      label: 'Account',
      icon: User
    }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-slate-200/60 pb-safe shadow-[0_-1px_3px_rgba(0,0,0,0.04)]">
      {/* Sub-menu popover */}
      <AnimatePresence>
        {isSubMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-full left-0 right-0 p-4 pb-0 pointer-events-none"
          >
            <div className="max-w-xs mx-auto bg-white border border-slate-200 rounded-2xl shadow-xl p-2 flex gap-2 pointer-events-auto">
              <Link
                to="/chats"
                onClick={() => setIsSubMenuOpen(false)}
                className={`flex-1 flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${path.startsWith('/chats') ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20' : 'text-slate-500 bg-slate-50'
                  }`}
              >
                <MessageSquare size={18} />
                <span className="text-[10px] font-bold">Chats</span>
              </Link>
              <Link
                to="/messages/inbox"
                onClick={() => setIsSubMenuOpen(false)}
                className={`flex-1 flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${path === '/messages/inbox' ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20' : 'text-slate-500 bg-slate-50'
                  }`}
              >
                <InboxIcon size={18} />
                <span className="text-[10px] font-bold">Inbox</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === 'messages' ? isMessagesActive : (
            path === tab.to || (tab.id === 'account' && path === '/account')
          );

          const Content = (
            <div className="relative z-10 flex flex-col items-center justify-center">
              <Icon
                size={20}
                className={`transition-colors duration-200 ${isActive ? 'text-pink-500' : 'text-slate-400'}`}
              />
              <span
                className={`text-[10px] font-medium transition-colors duration-200 ${isActive ? 'text-pink-500' : 'text-slate-400'}`}
              >
                {tab.label}
                {tab.id === 'messages' && <ChevronUp size={10} className={`inline ml-0.5 transition-transform ${isSubMenuOpen ? 'rotate-180' : ''}`} />}
              </span>
            </div>
          );

          if (tab.to) {
            return (
              <Link
                key={tab.id}
                to={tab.to}
                onClick={() => setIsSubMenuOpen(false)}
                className="relative flex flex-col items-center justify-center w-16 h-12 gap-1"
              >
                {Content}
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute inset-0 bg-pink-500/8 rounded-xl"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'account') {
                  navigate('/account');
                } else if (tab.id === 'messages') {
                  setIsSubMenuOpen(!isSubMenuOpen);
                }
              }}
              className="relative flex flex-col items-center justify-center w-16 h-12 gap-1"
            >
              {Content}
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute inset-0 bg-pink-500/8 rounded-xl"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}