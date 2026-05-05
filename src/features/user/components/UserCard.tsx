import { motion } from 'framer-motion';
import { MessagesSquare, UserPlus } from 'lucide-react';
import { timeAgo } from '@/utils/date';
import { useOnlineStatus } from '@/features/live/store';
import { UserCardProps } from '../types';


const MATCH_COLOR = {
  border: 'border-pink-200',
  bg: 'bg-pink-50',
  cardBg: 'bg-pink-50/50',
  text: 'text-pink-600',
  glow: 'shadow-[0_0_20px_rgba(236,72,153,0.2)]'
};


export function UserCard({
  user,
  index,
  highlightIndex,
  winnerId,
  isSpinning,
  spinComplete,
  onSelect,
  itemVariants,
  cardRef
}: UserCardProps) {
  const isOnline = useOnlineStatus((state) => state.onlineStatus[user.id] ?? user.is_online);


  const isHighlighted = highlightIndex === index;
  const isWinner = winnerId === user.id;
  const isSpinningLocal = isSpinning || false;
  const isComplete = spinComplete || false;
  const isDimmed = (isSpinningLocal || isComplete) && !isHighlighted && !isWinner;

  return (
    <motion.div
      ref={cardRef}
      variants={itemVariants}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isSpinning && onSelect) onSelect(user.id);
      }}
      whileHover={!isSpinningLocal && !isComplete ? { scale: 1.03, y: -4 } : {}}
      animate={{
        scale: isWinner ? 1.05 : isHighlighted ? 1.02 : 1,
        y: 0,
        opacity: isDimmed ? 0.75 : 1,
        filter: isDimmed ? 'grayscale(0.6) brightness(0.85)' : 'grayscale(0) brightness(1)'
      }}
      transition={{ duration: 0.15 }}
      className={`group relative flex flex-col p-3.5 md:p-5 bg-white/85 backdrop-blur-md rounded-xl md:rounded-2xl border transition-all duration-200 shadow-sm overflow-visible cursor-pointer h-full ${isWinner || isHighlighted
        ? `${MATCH_COLOR.border} ${MATCH_COLOR.glow}`
        : 'border-white/60 hover:border-pink-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]'
        }`}
      style={{
        zIndex: isWinner || isHighlighted ? 10 : 1
      }}
    >
      {/* Card Header: Circular Icon + Friend ID card */}
      <div className="flex items-center gap-3 w-full group/header">
        <div className="relative flex-shrink-0">
          <div
            className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-2 flex items-center justify-center text-xl md:text-2xl transition-all shadow-sm group-hover/header:scale-105 ${isWinner || isHighlighted ? `${MATCH_COLOR.border} bg-white` : 'border-slate-100 bg-slate-50/50'
              }`}
          >
            {user.emoji}
          </div>
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-slate-900 text-sm md:text-base truncate">
              @{user.username}
            </span>
          </div>
          <span className="text-[10px] md:text-[11px] text-slate-500 font-medium flex items-center gap-1">
            {isOnline ? (
              <>
                {/* <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> */}
                <span className="text-green-600 font-semibold">Online</span>
              </>
            ) : (
              <>
                {/* <span className="w-2 h-2 rounded-full bg-gray-400"></span> */}
                <span>last seen {user.updated_at ? timeAgo(user.updated_at) : 'a while ago'}</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Mood / Bio as speech bubble */}
      <div className="flex-1 flex flex-col relative mt-3 md:mt-4 w-full">
        {/* Bubble tail pointing up toward the ID */}
        <div className="absolute -top-[7px] left-3 md:left-4 w-3 h-3 bg-white/90 rotate-45 z-10 border-l border-t border-slate-200 [border-bottom:none] [border-right:none]" />
        <div className="relative flex-1 px-3 py-3 md:px-4 md:py-3.5 rounded-xl bg-white/90 border border-slate-200 w-full rounded-tl-sm shadow-sm flex items-center">
          <p className={`text-[10px] md:text-xs leading-relaxed line-clamp-4 text-left font-medium w-full ${user?.bio ? 'text-slate-400 italic' : 'text-slate-600'}`}>
            {user?.bio || 'No bio yet'}
          </p>
        </div>
      </div>

      {/* Card Footer: Action buttons side by side */}
      <div className="flex items-center justify-between gap-3 w-full mt-auto pt-4 md:pt-5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onSelect) onSelect(user.id);
          }}
          disabled={isSpinning}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 md:py-2 rounded-lg text-[10px] md:text-xs font-bold transition-all shadow-sm bg-pink-50 text-pink-600 border border-pink-200 disabled:opacity-50`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          connect
        </button>

        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="flex items-center gap-1.5 text-slate-500 hover:text-pink-600 transition-colors cursor-pointer group/link shrink-0"
        >
          <MessagesSquare size={14} className="group-hover/link:text-pink-600" />
          <span className="text-[10px] md:text-xs font-bold group-hover/link:underline decoration-pink-300 underline-offset-4">
            Confessions
          </span>
        </div>
      </div>
    </motion.div>
  );
}



