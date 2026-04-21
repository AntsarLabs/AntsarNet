import React, { useState } from 'react';
import { LogOut, Send, Flame, ChevronDown, MessageSquare, Inbox } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

interface TopHeaderProps {
  isLoggedIn: boolean;
  currentUser: {
    emoji: string;
    friendId: string;
  } | null;
  onLogin: () => void;
  onLogout: () => void;
  onAccountClick?: () => void;
}

export function TopHeader({
  isLoggedIn,
  currentUser,
  onLogin,
  onLogout,
  onAccountClick
}: TopHeaderProps) {
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const location = useLocation();
  const path = location.pathname;

  const getActiveTab = () => {
    if (path === '/discover') return 'main';
    if (path === '/confessions') return 'confessions';
    if (path === '/messages/chats') return 'chats';
    if (path === '/messages/inbox') return 'inbox';
    return '';
  };

  const activeView = getActiveTab();
  const isMessagesActive = path.startsWith('/messages');
  const showTabs = ['/discover', '/confessions', '/messages/chats', '/messages/inbox'].includes(path);

  return (
    <div className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-xl border-b border-white/5 px-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between h-14 md:h-16 relative">
        
        {/* MOBILE: PROFILE (Left) | DESKTOP: LOGO (Left) */}
        <div className="flex items-center w-32 md:w-auto">
          <Link to="/discover" className="hidden md:flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-500/20 group-hover:scale-105 transition-transform">
              <span className="text-white text-[10px] font-black italic">A</span>
            </div>
            <span className="text-white font-black text-xl tracking-tighter uppercase italic">
              Addis<span className="text-pink-500">Net</span>
            </span>
          </Link>
        </div>

        {/* MOBILE: CENTERED LOGO */}
        <div className="md:hidden absolute left-1/2 -translate-x-1/2 pointer-events-none">
          <span className="text-white font-black text-lg tracking-tight uppercase italic flex items-center gap-1.5 translate-y-0.5">
            Addis<span className="text-pink-500">Net</span>
          </span>
        </div>

        {/* DESKTOP CENTER TABS */}
        {showTabs && (
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/discover"
              className={`text-sm font-medium transition-colors relative pb-0.5 ${activeView === 'main' ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Discover
              {activeView === 'main' && (
                <motion.div
                  layoutId="headerTab"
                  className="absolute -bottom-3 left-0 right-0 h-0.5 bg-pink-500" />
              )}
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setIsMessagesOpen(true)}
              onMouseLeave={() => setIsMessagesOpen(false)}
            >
              <button
                className={`text-sm font-medium transition-colors relative pb-0.5 flex items-center gap-1.5 ${isMessagesActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Messages
                <ChevronDown size={14} className={`transition-transform duration-200 ${isMessagesOpen ? 'rotate-180' : ''}`} />
                {isMessagesActive && (
                  <motion.div
                    layoutId="headerTab"
                    className="absolute -bottom-3 left-0 right-0 h-0.5 bg-pink-500" />
                )}
              </button>

              <AnimatePresence>
                {isMessagesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-44 pointer-events-auto"
                  >
                    <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-1.5 backdrop-blur-xl">
                      <Link
                        to="/messages/chats"
                        onClick={() => setIsMessagesOpen(false)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeView === 'chats' ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                          }`}
                      >
                        <MessageSquare size={16} />
                        Private Chats
                      </Link>
                      <Link
                        to="/messages/inbox"
                        onClick={() => setIsMessagesOpen(false)}
                        className={`w-full mt-1 flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeView === 'inbox' ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                          }`}
                      >
                        <Inbox size={16} />
                        Anonymous Inbox
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/confessions"
              className={`text-sm font-medium transition-colors relative pb-0.5 ${activeView === 'confessions' ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Confessions
              {activeView === 'confessions' && (
                <motion.div
                  layoutId="headerTab"
                  className="absolute -bottom-3 left-0 right-0 h-0.5 bg-pink-500" />
              )}
            </Link>
          </div>
        )}

        {/* RIGHT AREA: ACTION BUTTONS */}
        <div className="flex items-center justify-end w-32 md:w-auto gap-2">
          {isLoggedIn && currentUser ? (
            <div className="flex items-center gap-2 md:gap-4">
              {/* Desktop Profile Pill */}
              <button
                onClick={onAccountClick}
                className="hidden md:flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[10px] shadow-sm">
                  {currentUser.emoji}
                </div>
                <span className="text-white text-xs font-mono font-bold tracking-tight">
                  {currentUser.friendId}
                </span>
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="flex items-center gap-2 bg-[#0088cc] hover:bg-[#0077b3] text-white px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-lg active:scale-95"
            >
              <Send size={14} className="-ml-0.5" />
              <span className="hidden sm:inline">Connect Telegram</span>
              <span className="sm:hidden text-[10px]">Connect</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}