import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  MessageCircle,
  Ban,
  Flag,
  MapPin,
  Calendar,
  Flame,
  MessageSquare } from
'lucide-react';
import { Contact, Post } from '../types/chat';
import { PostCard } from '../components/PostCard';
import { ReactionType } from '../components/ReactionBar';
interface UserProfilePageProps {
  user: Contact;
  posts: Post[];
  onBack: () => void;
  onMessage: (contactId: string) => void;
  onReactPost: (postId: string, type: ReactionType) => void;
}
export function UserProfilePage({
  user,
  posts,
  onBack,
  onMessage,
  onReactPost
}: UserProfilePageProps) {
  const userPosts = useMemo(() => {
    return posts.filter(
      (p) => p.userId === user.friendId && p.status === 'active'
    );
  }, [posts, user.friendId]);
  const totalReactions = useMemo(() => {
    return userPosts.reduce((sum, post) => sum + post.reactionCount, 0);
  }, [userPosts]);
  return (
    <div
      className="min-h-screen w-full flex flex-col bg-cover bg-center bg-no-repeat bg-fixed relative"
      style={{
        backgroundImage:
        'url("https://cdn.magicpatterns.com/uploads/buFFB14RxN7rp2dVxCiLRi/64b6005b9b1c73650c503c0f921982ab.2-1-super.1.jpg")'
      }}>
      
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] pointer-events-none" />

      {/* Header */}
      <div className="h-14 flex items-center px-4 sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10">
          
          <ChevronLeft size={22} />
        </button>
        <h1 className="text-lg font-semibold ml-2 text-white">Profile</h1>
      </div>

      <div className="flex-1 w-full max-w-3xl mx-auto p-4 md:p-8 relative z-10 pb-32">
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="space-y-6">
          
          {/* Hero Section */}
          <div className="bg-white/85 backdrop-blur-md border border-white/60 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-pink-500/10 to-transparent pointer-events-none" />

            <div className="relative mb-4 z-10">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white border-4 border-white flex items-center justify-center text-5xl md:text-6xl shadow-md">
                {user.emoji}
              </div>
              {user.isOnline &&
              <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-green-500 border-4 border-white shadow-sm" />
              }
            </div>

            <h2 className="text-2xl md:text-3xl font-mono font-bold text-slate-900 mb-2">
              {user.friendId}
            </h2>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/80 border border-slate-200 shadow-sm">
                <MapPin size={14} className="text-slate-500" />
                <span className="text-xs font-medium text-slate-600">
                  {user.distance} away
                </span>
              </div>
            </div>

            {user.mood &&
            <div className="relative w-full max-w-md">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/90 rotate-45 border-l border-t border-slate-200" />
                <div className="relative bg-white/90 border border-slate-200 rounded-xl p-4 shadow-sm">
                  <p className="text-sm md:text-base text-slate-700 font-medium italic">
                    "{user.mood}"
                  </p>
                </div>
              </div>
            }
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            <div className="bg-white/85 backdrop-blur-md border border-white/60 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
              <MessageSquare size={20} className="text-pink-500 mb-2" />
              <span className="text-xl md:text-2xl font-bold text-slate-900">
                {userPosts.length}
              </span>
              <span className="text-[10px] md:text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">
                Confessions
              </span>
            </div>
            <div className="bg-white/85 backdrop-blur-md border border-white/60 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
              <Flame size={20} className="text-orange-500 mb-2" />
              <span className="text-xl md:text-2xl font-bold text-slate-900">
                {totalReactions}
              </span>
              <span className="text-[10px] md:text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">
                Reactions
              </span>
            </div>
            <div className="bg-white/85 backdrop-blur-md border border-white/60 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
              <Calendar size={20} className="text-blue-500 mb-2" />
              <span className="text-lg md:text-xl font-bold text-slate-900">
                Mar '26
              </span>
              <span className="text-[10px] md:text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">
                Joined
              </span>
            </div>
          </div>

          {/* Recent Confessions */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 px-2">
              Recent Confessions
            </h3>

            {userPosts.length === 0 ?
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center">
                <p className="text-slate-400 text-sm">
                  No public confessions yet.
                </p>
              </div> :

            <div className="space-y-4">
                {userPosts.map((post) =>
              <PostCard
                key={post.id}
                post={post}
                onReact={onReactPost}
                onClick={() => {}} />

              )}
              </div>
            }
          </div>
        </motion.div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur-lg border-t border-slate-800 p-4 z-30">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button
            onClick={() => onMessage(user.id)}
            className="flex-1 flex items-center justify-center gap-2 bg-[#D82B7D] hover:bg-[#C0266F] active:bg-[#A82161] text-white py-3.5 rounded-xl font-semibold transition-colors shadow-sm">
            
            <MessageCircle size={20} />
            Message
          </button>
          <button
            className="p-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors border border-white/10"
            title="Block User">
            
            <Ban size={20} />
          </button>
          <button
            className="p-3.5 bg-white/10 hover:bg-white/20 text-red-400 rounded-xl transition-colors border border-white/10"
            title="Report User">
            
            <Flag size={20} />
          </button>
        </div>
      </div>
    </div>);

}