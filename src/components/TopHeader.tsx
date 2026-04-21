import React from 'react';
import { LogOut, Send, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
interface TopHeaderProps {
  isLoggedIn: boolean;
  currentUser: {
    emoji: string;
    friendId: string;
  } | null;
  activeView?: 'main' | 'confessions' | 'chats' | string;
  onLogin: () => void;
  onLogout: () => void;
  onAccountClick?: () => void;
  onConfessClick?: () => void;
  onViewChange?: (view: 'main' | 'confessions' | 'chats') => void;
}
export function TopHeader({
  isLoggedIn,
  currentUser,
  activeView,
  onLogin,
  onLogout,
  onAccountClick,
  onConfessClick,
  onViewChange
}: TopHeaderProps) {
  const showTabs =
  activeView === 'main' ||
  activeView === 'confessions' ||
  activeView === 'chats';
  return (
    <div className="sticky top-0 z-50 w-full bg-slate-950 border-b border-slate-800 px-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between py-3">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-lg tracking-tight">
            AddisFriend
          </span>
        </div>

        {/* Center Tabs */}
        {showTabs && onViewChange &&
        <div className="hidden md:flex items-center gap-6">
            <button
            onClick={() => onViewChange('main')}
            className={`text-sm font-medium transition-colors relative pb-0.5 ${activeView === 'main' ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}>
            
              Discover
              {activeView === 'main' &&
            <motion.div
              layoutId="headerTab"
              className="absolute -bottom-3 left-0 right-0 h-0.5 bg-pink-500" />

            }
            </button>
            <button
            onClick={() => onViewChange('chats')}
            className={`text-sm font-medium transition-colors relative pb-0.5 ${activeView === 'chats' ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}>
            
              Chats
              {activeView === 'chats' &&
            <motion.div
              layoutId="headerTab"
              className="absolute -bottom-3 left-0 right-0 h-0.5 bg-pink-500" />

            }
            </button>
            <button
            onClick={() => onViewChange('confessions')}
            className={`text-sm font-medium transition-colors relative pb-0.5 ${activeView === 'confessions' ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}>
            
              Confessions
              {activeView === 'confessions' &&
            <motion.div
              layoutId="headerTab"
              className="absolute -bottom-3 left-0 right-0 h-0.5 bg-pink-500" />

            }
            </button>
          </div>
        }

        <div>
          {isLoggedIn && currentUser ?
          <div className="flex items-center gap-4">
              <button
              onClick={onAccountClick}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/15 transition-colors rounded-full pl-1 pr-3 py-1 border border-white/10">
              
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-sm shadow-sm">
                  {currentUser.emoji}
                </div>
                <span className="text-white text-sm font-mono font-medium">
                  {currentUser.friendId}
                </span>
              </button>
              <button
              onClick={onLogout}
              className="text-white/70 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
              title="Log out">
              
                <LogOut size={18} />
              </button>
            </div> :

          <button
            onClick={onLogin}
            className="flex items-center gap-2 bg-[#0088cc] hover:bg-[#0077b3] text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors shadow-sm">
            
              <Send size={14} className="-ml-0.5" />
              Connect Telegram
            </button>
          }
        </div>
      </div>
    </div>);

}