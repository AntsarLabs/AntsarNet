import { useEffect, useRef, useMemo } from 'react';
import { Radio, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useOnlineStatus } from '@/features/live/store';
import { useAuthStore } from '@/features/auth/store';
import { useUsersInfinite } from '../hooks';
import { UsersListProps } from '../types';
import { UserCard } from './UserCard';


export function UsersList({
  onSelect,
  isSpinning = false,
  spinComplete = false,
  highlightIndex = null,
  winnerId = null,
  searchQuery = ''
}: UsersListProps) {
  const { ref, inView } = useInView();
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const setBulkOnlineStatus = useOnlineStatus((state) => state.setBulkOnlineStatus);
  const { user: currentUser } = useAuthStore();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUsersInfinite({ username: searchQuery });

  const users = useMemo(() => data?.pages.flatMap((page) => page) ?? [], [data?.pages]);

  // Set online status for all contacts
  useEffect(() => {
    if (users.length > 0) {
      const updates = users.reduce((acc, user) => {
        acc[user.id] = user.is_online;
        return acc;
      }, {} as Record<string, boolean>);
      console.log('updates', updates);
      setBulkOnlineStatus(updates);
    }
  }, [users, setBulkOnlineStatus]);


  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (highlightIndex !== null && users[highlightIndex]) {
      const user = users[highlightIndex];
      const el = cardRefs.current[user.id];
      if (el) {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest'
        });
      }
    }
  }, [highlightIndex, users]);

  useEffect(() => {
    if (winnerId) {
      const el = cardRefs.current[winnerId];
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          });
        }, 100);
      }
    }
  }, [winnerId]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  if (isLoading && !users.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-pink-500" />
        <p className="font-medium">Finding people nearby...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 bg-white/85 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm">
        <p className="text-red-500 font-medium">Failed to load users</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-pink-600 font-semibold hover:underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 pb-20">
      <AnimatePresence mode="wait">
        {users.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16 md:py-20 text-center space-y-3 md:space-y-4 w-full"
          >
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <Radio className="w-7 h-7 md:w-8 md:h-8 opacity-50" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-medium text-foreground">
                No friends nearby
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                Check back soon for new connections.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 md:gap-4 relative w-full"
          >
            {users.map((user, index) => {
              if (user.id === currentUser?.id) {
                return null;
              }
              return (
                <UserCard
                  key={user.id}
                  user={user}
                  index={index}
                  highlightIndex={highlightIndex}
                  winnerId={winnerId}
                  isSpinning={isSpinning}
                  spinComplete={spinComplete}
                  onSelect={onSelect}
                  itemVariants={itemVariants}
                  cardRef={(el) => {
                    cardRefs.current[user.id] = el;
                  }}
                />
              )
            }
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Intersection Observer target for infinite scroll */}
      <div ref={ref} className="py-4 flex justify-center">
        {isFetchingNextPage && (
          <Loader2 className="w-6 h-6 text-pink-500 animate-spin" />
        )}
        {!hasNextPage && users.length > 0 && (
          <p className="text-slate-400 text-xs font-medium italic">You've reached the end</p>
        )}
      </div>
    </div>
  );
}

