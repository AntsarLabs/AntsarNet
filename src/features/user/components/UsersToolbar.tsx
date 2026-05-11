import { Search, Shuffle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UsersToolbarProps } from '../types';


export function UsersToolbar({
  searchQuery,
  onSearchQueryChange,
  onConnect,
  error,
  isSearching,
  isSpinning,
  onRandomPick,
  activeCount,
  hasContacts
}: UsersToolbarProps) {
  const onlineUsersCount = Math.max(activeCount - 1, 0); // cuz current user is included in the activeCount
  return (
    <div className="w-full max-w-2xl mx-auto px-2 md:px-0 relative z-50">
      <div className="flex items-center">
        <div className="flex-1 flex items-center bg-white/90 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm min-h-[46px]">
          <form onSubmit={onConnect} className="flex-1 relative h-full">
            <motion.div
              animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="relative flex items-center h-full"
            >
              <input
                type="text"
                placeholder="Find users by username without @ e.g: fox_Q4788"
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                disabled={isSpinning}
                className="w-full bg-transparent pl-4 pr-12 py-2.5 text-sm text-slate-900 focus:outline-none placeholder:text-slate-500 h-full"
              />
              <button
                type="submit"
                disabled={!searchQuery.trim() || isSpinning || isSearching}
                className="absolute right-2 p-2 text-pink-500 hover:bg-pink-50 active:bg-pink-100 rounded-xl disabled:opacity-50 transition-all"
              >
                {isSearching ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
              </button>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-400 text-[10px] font-bold mt-1 pl-4 absolute bg-white/80 backdrop-blur-sm rounded-full px-2 py-0.5 border border-red-100 shadow-sm top-[-24px] left-2"
                >
                  Not found. Check username.
                </motion.p>
              )}
            </AnimatePresence>
          </form>
        </div>

        <button
          onClick={onRandomPick}
          disabled={isSpinning || !hasContacts}
          className={`ml-2 p-3 rounded-2xl font-medium transition-all duration-300 min-h-[46px] min-w-[46px] flex items-center justify-center flex-shrink-0 shadow-sm ${isSpinning ? 'bg-pink-50 text-pink-500 border border-pink-200' : 'bg-white/90 backdrop-blur-md hover:bg-white active:bg-white/80 text-slate-600 hover:text-slate-900 border border-white/50'} disabled:opacity-50 disabled:cursor-not-allowed`}
          title="Random Match"
        >
          <motion.div
            animate={isSpinning ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 0.5, repeat: isSpinning ? Infinity : 0, ease: 'linear' }}
          >
            <Shuffle className="w-5 h-5" />
          </motion.div>
        </button>
      </div>
      <div className="flex items-center justify-center gap-2 mt-3">
        <span className="text-slate-600 text-sm md:text-lg font-medium">

          {isSpinning ? 'Randomly picking a friend...' : `${onlineUsersCount} ${onlineUsersCount === 1 ? 'user' : 'users'} online now`}
        </span>
      </div>
    </div>
  );
}
