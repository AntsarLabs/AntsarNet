import React, { useState } from 'react';
import { LogOut, Send, ChevronDown, MessageSquare, Inbox } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export function TopHeader() {
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  // Mock user
  const currentUser = {
    emoji: '😎',
    friendId: 'MyCodeName123'
  };

  const getActiveTab = () => {
    if (path === '/discover') return 'main';
    if (path === '/confessions') return 'confessions';
    if (path === '/messages/chats') return 'chats';
    if (path === '/messages/inbox') return 'inbox';
    return '';
  };

  const activeView = getActiveTab();
  const isMessagesActive = path.startsWith('/messages');
  const showTabs = ['/discover', '/confessions', '/messages/chats', '/messages/inbox', '/account'].includes(path);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);
  const handleAccountClick = () => navigate('/account');

  return (
    <div className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="max-w-5xl mx-auto flex items-center justify-between h-14 md:h-16 relative">

        {/* MOBILE: PROFILE (Left) | DESKTOP: LOGO (Left) */}
        <div className="flex items-center w-32 md:w-auto">
          <Link to="/discover" className="hidden md:flex items-center gap-2 group">
            <span className="text-slate-900 font-black text-xl tracking-tighter uppercase italic">
              Addis<span className="text-pink-500">Net</span>
            </span>
          </Link>
        </div>

        {/* MOBILE: CENTERED LOGO */}
        <div className="md:hidden absolute left-1/2 -translate-x-1/2 pointer-events-none">
          <span className="text-slate-900 font-black text-lg tracking-tight uppercase italic flex items-center gap-1.5 translate-y-0.5">
            Addis<span className="text-pink-500">Net</span>
          </span>
        </div>

        {/* DESKTOP CENTER TABS */}
        {showTabs && (
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/discover"
              className={`text-sm font-medium transition-colors relative pb-0.5 ${activeView === 'main' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-700'}`}
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
                className={`text-sm font-medium transition-colors relative pb-0.5 flex items-center gap-1.5 ${isMessagesActive ? 'text-slate-900' : 'text-slate-400 hover:text-slate-700'}`}
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
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden p-1.5 backdrop-blur-xl">
                      <Link
                        to="/messages/chats"
                        onClick={() => setIsMessagesOpen(false)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeView === 'chats' ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                      >
                        <MessageSquare size={16} />
                        Private Chats
                      </Link>
                      <Link
                        to="/messages/inbox"
                        onClick={() => setIsMessagesOpen(false)}
                        className={`w-full mt-1 flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeView === 'inbox' ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
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
              className={`text-sm font-medium transition-colors relative pb-0.5 ${activeView === 'confessions' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-700'}`}
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
          {isLoggedIn ? (
            <div className="flex items-center gap-2 md:gap-4">
              {/* Desktop Profile Pill */}
              <button
                onClick={handleAccountClick}
                className="hidden md:flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full border border-slate-200 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[10px] shadow-sm border border-slate-100">
                  {currentUser.emoji}
                </div>
                <span className="text-slate-800 text-xs font-mono font-bold tracking-tight">
                  {currentUser.friendId}
                </span>
              </button>
              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
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