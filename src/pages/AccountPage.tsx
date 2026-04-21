import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  User,
  MessageSquare,
  MessageCircle,
  Ban,
  Settings,
  Copy,
  Check,
  Save,
  Bell,
  Volume2,
  Moon,
  Eye,
  MapPin,
  Clock,
  Calendar,
  Globe,
  Trash2,
  MoreVertical,
  Shield,
  Flame,
  Pencil,
  X,
  Share2,
  Send } from
'lucide-react';
import { Contact, ChatSession, Post } from '../types/chat';
interface AccountPageProps {
  currentUser: {
    emoji: string;
    friendId: string;
    bio?: string;
    location?: string;
  };
  contacts: Contact[];
  sessions: ChatSession[];
  posts: Post[];
  onBack: () => void;
  onOpenChat: (contactId: string) => void;
  onEditPost: (postId: string, newContent: string) => void;
  onDeletePost: (postId: string) => void;
}
type Tab = 'profile' | 'history' | 'confessions' | 'blocked' | 'settings';
const EMOJI_OPTIONS = [
'😎',
'🦊',
'🦉',
'🐯',
'🐻',
'🐬',
'🐺',
'🐱',
'🦅',
'🦁',
'🐼',
'🐨',
'🐸',
'🦄',
'🐙',
'🦋',
'🌸',
'🔥',
'✨',
'👻'];

export function AccountPage({
  currentUser,
  contacts,
  sessions,
  posts,
  onBack,
  onOpenChat,
  onEditPost,
  onDeletePost
}: AccountPageProps) {
  const [activeTab, setActiveTab] = useState<Tab | null>('profile');
  const [emoji, setEmoji] = useState(currentUser.emoji);
  const [codeName, setCodeName] = useState(currentUser.friendId);
  const [bio, setBio] = useState(currentUser.bio || 'Just joined AddisFriend!');
  const [location, setLocation] = useState(currentUser.location || 'Downtown');
  const [gender, setGender] = useState<'male' | 'female' | 'unspecified'>(
    'unspecified'
  );
  const [copied, setCopied] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    sound: true,
    darkMode: false,
    showOnline: true,
    showDistance: true,
    autoDelete: false,
    contentFiltering: true,
    language: 'English'
  });
  const handleCopyId = () => {
    navigator.clipboard.writeText(currentUser.friendId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const blockedContacts = contacts.filter(
    (c) => c.blockStatus === 'blocked_by_you'
  );
  const [activeSessions, setActiveSessions] = useState<ChatSession[]>(sessions);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const handleDeleteSession = (sessionId: string, type: 'mine' | 'both') => {
    setActiveSessions((prev) => prev.filter((s) => s.id !== sessionId));
    setOpenMenuId(null);
  };
  const tabs = [
  {
    id: 'profile' as Tab,
    label: 'Profile',
    description: 'Update your public persona',
    icon: User
  },
  {
    id: 'history' as Tab,
    label: 'Chat Sessions',
    description: 'View and manage your conversations',
    icon: MessageSquare
  },
  {
    id: 'confessions' as Tab,
    label: 'My Confessions',
    description: 'Manage your anonymous posts',
    icon: Flame
  },
  {
    id: 'blocked' as Tab,
    label: 'Block List',
    description: 'Users you have blocked',
    icon: Ban
  },
  {
    id: 'settings' as Tab,
    label: 'Settings',
    description: 'Manage your app preferences',
    icon: Settings
  }];

  const activeTabData = tabs.find((t) => t.id === activeTab);
  // Shared content renderer
  const renderTabContent = () =>
  <>
      {/* PROFILE TAB */}
      {activeTab === 'profile' &&
    <div className="space-y-4">
          {/* Avatar + Header Card */}
          <div className="bg-white/85 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/60 shadow-sm p-5 md:p-6">
            <div className="flex flex-col items-center sm:items-start sm:flex-row gap-5">
              <div className="relative">
                <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="w-20 h-20 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-3xl hover:border-pink-400 transition-colors shadow-sm">
              
                  {emoji}
                </button>
                <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-white">
                  ✎
                </span>
                {showEmojiPicker &&
            <div className="absolute top-full left-1/2 sm:left-0 -translate-x-1/2 sm:translate-x-0 mt-2 p-3 bg-white border border-slate-200 rounded-xl shadow-xl w-64 grid grid-cols-5 gap-2 z-30">
                    {EMOJI_OPTIONS.map((e) =>
              <button
                key={e}
                onClick={() => {
                  setEmoji(e);
                  setShowEmojiPicker(false);
                }}
                className={`w-10 h-10 flex items-center justify-center text-xl rounded-lg transition-colors ${e === emoji ? 'bg-pink-100 ring-2 ring-pink-400' : 'hover:bg-slate-100'}`}>
                
                        {e}
                      </button>
              )}
                  </div>
            }
              </div>
              <div className="flex-1 space-y-1 text-center sm:text-left">
                <h2 className="text-xl font-bold text-slate-900">
                  Profile Settings
                </h2>
                <p className="text-slate-500 text-sm">
                  Update your public persona
                </p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white/85 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/60 shadow-sm p-5 md:p-6 space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Code Name
              </label>
              <input
            type="text"
            value={codeName}
            onChange={(e) => setCodeName(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 font-mono focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition-all shadow-sm" />
          
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Gender
              </label>
              <div className="flex gap-2">
                {(
            [
            {
              value: 'male',
              label: 'Male'
            },
            {
              value: 'female',
              label: 'Female'
            },
            {
              value: 'unspecified',
              label: 'Prefer not to say'
            }] as
            const).
            map((option) =>
            <button
              key={option.value}
              type="button"
              onClick={() => setGender(option.value)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all border shadow-sm ${gender === option.value ? 'bg-[#D82B7D] text-white border-[#D82B7D]' : 'bg-white text-slate-600 border-slate-200 hover:border-pink-300 hover:text-slate-800'}`}>
              
                    {option.label}
                  </button>
            )}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-700">
                  Bio / Mood
                </label>
                <span className="text-xs text-slate-400">{bio.length}/120</span>
              </div>
              <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 120))}
            rows={3}
            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition-all resize-none shadow-sm" />
          
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Location
              </label>
              <div className="relative">
                <MapPin
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16} />
            
                <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition-all shadow-sm" />
            
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Friend ID (Read-only)
              </label>
              <div className="flex items-center gap-2">
                <input
              type="text"
              value={currentUser.friendId}
              readOnly
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-500 font-mono cursor-not-allowed shadow-sm" />
            
                <button
              onClick={handleCopyId}
              className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-lg transition-colors flex items-center justify-center min-w-[44px] shadow-sm">
              
                  {copied ?
              <Check size={18} className="text-green-500" /> :

              <Copy size={18} />
              }
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="flex items-center gap-2 bg-[#D82B7D] hover:bg-[#C0266F] active:bg-[#A82161] text-white px-6 py-2.5 rounded-xl font-semibold transition-colors shadow-sm">
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </div>
    }

      {/* HISTORY TAB */}
      {activeTab === 'history' &&
    <div className="space-y-4">
          <div className="bg-white/85 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/60 shadow-sm p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">Chat Sessions</h2>
            <p className="text-slate-500 text-sm mt-1">
              Only one chat session can be active at a time
            </p>
          </div>
          {activeSessions.length === 0 ?
      <div className="text-center py-12 bg-white/85 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/60 shadow-sm">
              <MessageSquare
          size={48}
          className="mx-auto text-slate-300 mb-4" />
        
              <h3 className="text-lg font-medium text-slate-700">
                No chat sessions
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                Start a conversation to begin a session.
              </p>
            </div> :

      <div className="space-y-3">
              {[...activeSessions].
        sort((a, b) =>
        a.status === 'active' ? -1 : b.status === 'active' ? 1 : 0
        ).
        map((session) => {
          const contact = contacts.find(
            (c) => c.id === session.contactId
          );
          if (!contact) return null;
          const isActiveSession = session.status === 'active';
          return (
            <div
              key={session.id}
              className={`w-full flex items-center gap-3 p-3 md:p-4 bg-white/85 backdrop-blur-md border rounded-xl md:rounded-2xl shadow-sm relative ${isActiveSession ? 'border-green-300/60' : 'border-white/60'} ${openMenuId === session.id ? 'z-30' : 'z-0'}`}>
              
                      <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xl flex-shrink-0 shadow-sm relative">
                        {contact.emoji}
                        {isActiveSession &&
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
                }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-mono font-semibold text-slate-800 text-sm truncate">
                            {contact.friendId}
                          </h3>
                          {isActiveSession &&
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wide flex-shrink-0">
                              Active
                            </span>
                  }
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
                          <Calendar
                    size={12}
                    className="text-slate-400 flex-shrink-0" />
                  
                          <span className="text-slate-600 font-medium">
                            {session.startedAt.split(',')[0]}
                          </span>
                          <span className="text-slate-500 font-medium">–</span>
                          <span className="text-slate-600 font-medium">
                            {session.lastMessageAt.split(',')[0]}
                          </span>
                          <span className="text-slate-300 mx-0.5">·</span>
                          <span className="text-slate-600 font-medium">
                            {session.totalMessages} msgs
                          </span>
                        </div>
                      </div>
                      {isActiveSession &&
              <button
                onClick={() => onOpenChat(contact.id)}
                className="relative flex items-center gap-1.5 px-3 py-1.5 bg-[#D82B7D] hover:bg-[#C0266F] active:bg-[#A82161] text-white rounded-lg text-xs font-semibold transition-colors shadow-sm flex-shrink-0">
                
                          <MessageCircle size={14} />
                          Message
                          {session.unrepliedCount > 0 &&
                <span className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 rounded-full bg-pink-500 text-white text-[11px] font-bold flex items-center justify-center border-2 border-white shadow-sm">
                              {session.unrepliedCount}
                            </span>
                }
                        </button>
              }
                      <div className="relative flex-shrink-0">
                        <button
                  onClick={() =>
                  setOpenMenuId(
                    openMenuId === session.id ? null : session.id
                  )
                  }
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                  
                          <MoreVertical size={18} />
                        </button>
                        {openMenuId === session.id &&
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1 overflow-hidden">
                            <button
                    onClick={() =>
                    handleDeleteSession(session.id, 'mine')
                    }
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                    
                              Delete from my side
                            </button>
                            <button
                    onClick={() =>
                    handleDeleteSession(session.id, 'both')
                    }
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    
                              Delete from both sides
                            </button>
                          </div>
                }
                      </div>
                    </div>);

        })}
            </div>
      }
          <div className="bg-amber-50/90 backdrop-blur-md border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <MessageSquare
          size={18}
          className="text-amber-500 mt-0.5 flex-shrink-0" />
        
            <div>
              <p className="text-sm font-medium text-amber-800">
                One session at a time
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                You must end or delete your current session before starting a
                new one with someone else.
              </p>
            </div>
          </div>
        </div>
    }

      {/* CONFESSIONS TAB */}
      {activeTab === 'confessions' &&
    <div className="space-y-4">
          <div className="bg-white/85 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/60 shadow-sm p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">My Confessions</h2>
            <p className="text-slate-500 text-sm mt-1">
              Manage your anonymous posts
            </p>
          </div>
          {posts.filter((p) => p.userId === currentUser.friendId).length ===
      0 ?
      <div className="text-center py-12 bg-white/85 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/60 shadow-sm">
              <Flame size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-700">
                No confessions yet
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                Share your thoughts anonymously on the discover page.
              </p>
            </div> :

      <div className="space-y-4">
              {posts.
        filter((p) => p.userId === currentUser.friendId).
        map((post) =>
        <div
          key={post.id}
          className="bg-white/85 backdrop-blur-md border border-white/60 rounded-2xl p-4 md:p-5 shadow-sm">
          
                    {editingPostId === post.id ?
          <div className="space-y-3">
                        <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition-all resize-none shadow-sm min-h-[100px]" />
            
                        <div className="flex justify-end gap-2">
                          <button
                onClick={() => {
                  setEditingPostId(null);
                  setEditContent('');
                }}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                
                            Cancel
                          </button>
                          <button
                onClick={() => {
                  onEditPost(post.id, editContent);
                  setEditingPostId(null);
                  setEditContent('');
                }}
                className="px-4 py-2 text-sm font-medium bg-[#D82B7D] text-white hover:bg-[#C0266F] rounded-lg transition-colors shadow-sm">
                
                            Save
                          </button>
                        </div>
                      </div> :

          <>
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-xs text-slate-500 font-medium">
                            {post.createdAt}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                  onClick={() => {
                    setEditingPostId(post.id);
                    setEditContent(post.content);
                  }}
                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit">
                  
                              <Pencil size={16} />
                            </button>
                            <button
                  onClick={() => setDeletingPostId(post.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete">
                  
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <p className="text-slate-700 text-[15px] leading-relaxed whitespace-pre-wrap mb-4">
                          {post.content}
                        </p>
                        {post.tags && post.tags.length > 0 &&
            <div className="flex flex-wrap gap-1.5 mb-4">
                            {post.tags.map((tag) =>
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-pink-50 text-pink-600 border border-pink-100">
                
                                {tag}
                              </span>
              )}
                          </div>
            }
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                            <span className="flex items-center gap-1.5">
                              <span className="text-lg leading-none">🤍</span>{' '}
                              {post.reactionCount}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MessageCircle size={16} /> {post.commentCount}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                  className="p-1.5 text-slate-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                  title="Send to Friend">
                  
                              <Send size={16} />
                            </button>
                            <button
                  className="p-1.5 text-slate-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                  title="Share">
                  
                              <Share2 size={16} />
                            </button>
                          </div>
                        </div>
                      </>
          }
                    <AnimatePresence>
                      {deletingPostId === post.id &&
            <motion.div
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: 1
              }}
              exit={{
                opacity: 0
              }}
              className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-6 z-10">
              
                          <Trash2 size={32} className="text-red-500 mb-3" />
                          <h4 className="text-lg font-bold text-slate-900 mb-1">
                            Delete Confession?
                          </h4>
                          <p className="text-sm text-slate-500 text-center mb-4">
                            This action cannot be undone.
                          </p>
                          <div className="flex gap-3 w-full max-w-[200px]">
                            <button
                  onClick={() => setDeletingPostId(null)}
                  className="flex-1 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                  
                              Cancel
                            </button>
                            <button
                  onClick={() => {
                    onDeletePost(post.id);
                    setDeletingPostId(null);
                  }}
                  className="flex-1 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors shadow-sm">
                  
                              Delete
                            </button>
                          </div>
                        </motion.div>
            }
                    </AnimatePresence>
                  </div>
        )}
            </div>
      }
        </div>
    }

      {/* BLOCKED TAB */}
      {activeTab === 'blocked' &&
    <div className="space-y-4">
          <div className="bg-white/85 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/60 shadow-sm p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">Block List</h2>
            <p className="text-slate-500 text-sm mt-1">
              Users you have blocked
            </p>
          </div>
          {blockedContacts.length === 0 ?
      <div className="text-center py-12 bg-white/85 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/60 shadow-sm">
              <Ban size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-700">
                No blocked users
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                You haven't blocked anyone yet.
              </p>
            </div> :

      <div className="space-y-2">
              {blockedContacts.map((contact) =>
        <div
          key={contact.id}
          className="flex items-center justify-between p-4 bg-white/85 backdrop-blur-md border border-white/60 rounded-xl md:rounded-2xl shadow-sm">
          
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xl shadow-sm">
                      {contact.emoji}
                    </div>
                    <span className="font-mono font-semibold text-slate-800 text-sm">
                      {contact.friendId}
                    </span>
                  </div>
                  <button className="px-4 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors shadow-sm">
                    Unblock
                  </button>
                </div>
        )}
            </div>
      }
        </div>
    }

      {/* SETTINGS TAB */}
      {activeTab === 'settings' &&
    <div className="space-y-4">
          <div className="bg-white/85 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/60 shadow-sm p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">Settings</h2>
            <p className="text-slate-500 text-sm mt-1">
              Manage your app preferences
            </p>
          </div>
          <div className="bg-white/85 backdrop-blur-md border border-white/60 rounded-xl md:rounded-2xl overflow-hidden divide-y divide-slate-100 shadow-sm">
            <SettingToggle
          icon={Bell}
          label="Push Notifications"
          checked={settings.notifications}
          onChange={(v) =>
          setSettings({
            ...settings,
            notifications: v
          })
          } />
        
            <SettingToggle
          icon={Shield}
          label="Content Filtering"
          description="Filter out inappropriate, offensive, or spam messages automatically"
          checked={settings.contentFiltering}
          onChange={(v) =>
          setSettings({
            ...settings,
            contentFiltering: v
          })
          } />
        
            <SettingToggle
          icon={Clock}
          label="Auto-delete Messages (24h)"
          checked={settings.autoDelete}
          onChange={(v) =>
          setSettings({
            ...settings,
            autoDelete: v
          })
          } />
        
          </div>
          <div className="bg-white/85 backdrop-blur-md border border-white/60 rounded-xl md:rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <Globe size={20} className="text-slate-500" />
              <span className="font-medium text-slate-800">Language</span>
            </div>
            <select
          value={settings.language}
          onChange={(e) =>
          setSettings({
            ...settings,
            language: e.target.value
          })
          }
          className="bg-white border border-slate-200 text-slate-800 rounded-lg px-3 py-1.5 focus:outline-none focus:border-pink-400 shadow-sm">
          
              <option value="English">English</option>
              <option value="Amharic">Amharic</option>
            </select>
          </div>
          <div className="pt-2">
            <button className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl md:rounded-2xl p-4 font-medium transition-colors shadow-sm">
              <Trash2 size={18} />
              Delete Account
            </button>
          </div>
        </div>
    }
    </>;

  // Shared menu list renderer
  const renderMenuList = (variant: 'mobile' | 'desktop') =>
  <div
    className={`bg-white/85 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm overflow-hidden divide-y divide-slate-100 ${variant === 'desktop' ? 'sticky top-24' : ''}`}>
    
      {variant === 'mobile' &&
    <div className="flex items-center gap-4 px-5 py-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-xl shadow-sm">
            {currentUser.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-mono font-bold text-slate-900 text-sm truncate">
              {currentUser.friendId}
            </h2>
            <p className="text-xs text-slate-500">Manage your account</p>
          </div>
        </div>
    }
      {tabs.map((tab) => {
      const Icon = tab.icon;
      const isActive = activeTab === tab.id;
      return (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`w-full flex items-center gap-3 px-4 py-3.5 transition-colors text-left group ${variant === 'desktop' && isActive ? 'bg-[#D82B7D]/10 border-l-[3px] border-l-[#D82B7D]' : variant === 'desktop' ? 'hover:bg-slate-50/80 border-l-[3px] border-l-transparent' : 'hover:bg-slate-50/80'}`}>
          
            <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${variant === 'desktop' && isActive ? 'bg-[#D82B7D]/15 text-[#D82B7D]' : 'bg-slate-100 text-slate-600 group-hover:bg-pink-50 group-hover:text-pink-600'}`}>
            
              <Icon size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <h3
              className={`text-sm font-semibold ${variant === 'desktop' && isActive ? 'text-[#D82B7D]' : 'text-slate-800'}`}>
              
                {tab.label}
              </h3>
              {variant === 'mobile' &&
            <p className="text-xs text-slate-500 mt-0.5">
                  {tab.description}
                </p>
            }
            </div>
            {variant === 'mobile' &&
          <ChevronRight
            size={18}
            className="text-slate-400 flex-shrink-0" />

          }
          </button>);

    })}
    </div>;

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
          onClick={() => {
            if (
            activeTab &&
            typeof window !== 'undefined' &&
            window.innerWidth < 768)
            {
              setActiveTab(null);
            } else {
              onBack();
            }
          }}
          className="p-2 -ml-2 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10">
          
          <ChevronLeft size={22} />
        </button>
        <h1 className="text-lg font-semibold ml-2 text-white">
          {/* Mobile: show section name when drilled in */}
          <span className="md:hidden">
            {activeTab ? activeTabData?.label || 'Account' : 'Account'}
          </span>
          {/* Desktop: always show Account */}
          <span className="hidden md:inline">Account</span>
        </h1>
      </div>

      {/* === DESKTOP LAYOUT (md+): sidebar + content side by side === */}
      <div className="hidden md:flex flex-1 max-w-6xl w-full mx-auto p-8 gap-6 relative z-10">
        {/* Left sidebar menu - always visible */}
        <div className="w-56 flex-shrink-0">{renderMenuList('desktop')}</div>
        {/* Right content area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab || 'empty'}
              initial={{
                opacity: 0,
                y: 10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              exit={{
                opacity: 0,
                y: -10
              }}
              transition={{
                duration: 0.2
              }}>
              
              {activeTab ?
              renderTabContent() :

              <div className="bg-white/85 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm p-12 text-center">
                  <p className="text-slate-500">
                    Select a section from the menu
                  </p>
                </div>
              }
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* === MOBILE LAYOUT (<md): drill-down === */}
      <div className="md:hidden flex-1 max-w-3xl w-full mx-auto p-4 relative z-10">
        <AnimatePresence mode="wait">
          {!activeTab ?
          <motion.div
            key="menu"
            initial={{
              opacity: 0,
              x: -20
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            exit={{
              opacity: 0,
              x: -20
            }}
            transition={{
              duration: 0.2
            }}>
            
              {renderMenuList('mobile')}
            </motion.div> :

          <motion.div
            key={activeTab}
            initial={{
              opacity: 0,
              x: 20
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            exit={{
              opacity: 0,
              x: 20
            }}
            transition={{
              duration: 0.2
            }}>
            
              {renderTabContent()}
            </motion.div>
          }
        </AnimatePresence>
      </div>
    </div>);

}
function SettingToggle({
  icon: Icon,
  label,
  description,
  checked,
  onChange






}: {icon: any;label: string;description?: string;checked: boolean;onChange: (checked: boolean) => void;}) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <Icon size={20} className="text-slate-500" />
        <div>
          <span className="font-medium text-slate-800">{label}</span>
          {description &&
          <p className="text-xs text-slate-400 mt-0.5 max-w-[260px] leading-relaxed">
              {description}
            </p>
          }
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${checked ? 'bg-[#D82B7D]' : 'bg-slate-300'}`}>
        
        <span
          className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
        
      </button>
    </div>);

}