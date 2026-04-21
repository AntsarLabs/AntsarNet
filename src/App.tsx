import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { OnlineUsers } from './components/OnlineUsers';
import { TopHeader } from './components/TopHeader';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { AccountPage } from './pages/AccountPage';
import { LandingPage } from './pages/LandingPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { ConfessionsFeed } from './components/ConfessionsFeed';
import { ReactionType } from './components/ReactionBar';
import { ChatPage } from './pages/ChatPage';
import { ChatsListPage } from './pages/ChatsListPage';
import {
  Contact,
  Message,
  ChatSession,
  Post,
  Comment,
  InboxMessage } from
'./types/chat';
const MOCK_USERS: Contact[] = [
{
  id: '1',
  friendId: 'Ae1cf8ff45cF',
  emoji: '🦊',
  isOnline: true,
  distance: '500m',
  blockStatus: null,
  mood: '😔 feeling low today… need someone to talk to'
},
{
  id: '2',
  friendId: 'B7d2e9a01bC3',
  emoji: '🦉',
  isOnline: true,
  distance: '1.2km',
  blockStatus: 'blocked_by_you',
  mood: '🎧 vibing to lo-fi beats rn'
},
{
  id: '3',
  friendId: '4fE8c1d73aB6',
  emoji: '🐯',
  isOnline: true,
  distance: '3.4km',
  blockStatus: 'blocked_you',
  mood: '💪 gym mode activated'
},
{
  id: '4',
  friendId: 'Dc5a92f0e8F1',
  emoji: '🐻',
  isOnline: true,
  distance: '800m',
  blockStatus: null,
  mood: "☕ just woke up, don't talk to me yet lol"
},
{
  id: '5',
  friendId: '9bA3d7c46eE2',
  emoji: '🐬',
  isOnline: false,
  distance: '12km',
  blockStatus: null,
  mood: '✨ manifesting good energy today'
},
{
  id: '6',
  friendId: 'F2e6b8a15dC0',
  emoji: '🐺',
  isOnline: true,
  distance: '2.5km',
  blockStatus: 'blocked_you',
  mood: '🔥 on a winning streak fr'
},
{
  id: '7',
  friendId: '3cD1f4e97aB8',
  emoji: '🐱',
  isOnline: false,
  distance: '5km',
  blockStatus: 'blocked_by_you',
  mood: '😴 nap time is every time'
},
{
  id: '8',
  friendId: 'E8a0c5d32fF7',
  emoji: '🦅',
  isOnline: true,
  distance: '15km',
  blockStatus: null,
  mood: '🌅 chasing sunsets and good convos'
}];

const MOCK_MESSAGES: Record<string, Message[]> = {
  '1': [
  {
    id: 'm1',
    senderId: '1',
    text: 'Are you in position?',
    timestamp: '10:30 AM'
  },
  {
    id: 'm2',
    senderId: 'me',
    text: 'Almost there. Give me 5 mins.',
    timestamp: '10:32 AM'
  }]

};
const MOCK_SESSIONS: ChatSession[] = [
{
  id: 's1',
  contactId: '1',
  startedAt: 'Apr 12, 2026 3:45 PM',
  lastMessageAt: 'Apr 12, 2026 4:30 PM',
  totalMessages: 42,
  unrepliedCount: 0,
  status: 'ended'
},
{
  id: 's2',
  contactId: '2',
  startedAt: 'Apr 17, 2026 10:15 AM',
  lastMessageAt: 'Apr 17, 2026 11:02 AM',
  totalMessages: 15,
  unrepliedCount: 3,
  status: 'active'
},
{
  id: 's3',
  contactId: '6',
  startedAt: 'Apr 10, 2026 8:00 PM',
  lastMessageAt: 'Apr 11, 2026 2:15 PM',
  totalMessages: 5,
  unrepliedCount: 0,
  status: 'ended'
}];

const MOCK_POSTS: Post[] = [
{
  id: 'p1',
  userId: 'Ae1cf8ff45cF',
  emoji: '🦊',
  content:
  "I've been going to the same coffee shop for 3 months just because the barista is cute. I don't even like coffee that much 😭",
  tags: ['Crush', 'Funny', 'Secret'],
  visibility: 'public',
  createdAt: '2 hours ago',
  status: 'active',
  reactionCount: 45,
  commentCount: 12,
  reportCount: 0
},
{
  id: 'p2',
  userId: 'B7d2e9a01bC3',
  emoji: '🦉',
  content:
  "Sometimes I pretend to be on a phone call when walking past people handing out flyers. I'm sorry, I just have social anxiety.",
  tags: ['Vent', 'Mental Health'],
  visibility: 'public',
  createdAt: '5 hours ago',
  status: 'active',
  reactionCount: 128,
  commentCount: 3,
  reportCount: 0
},
{
  id: 'p3',
  userId: '4fE8c1d73aB6',
  emoji: '🐯',
  content:
  "I accidentally liked my ex's new partner's Instagram post from 2021. I immediately deactivated my account. Moving to Nepal tomorrow.",
  tags: ['Awkward', 'Relationship', 'Regret'],
  visibility: 'public',
  createdAt: '1 day ago',
  status: 'active',
  reactionCount: 342,
  commentCount: 45,
  reportCount: 0
},
{
  id: 'p4',
  userId: 'Dc5a92f0e8F1',
  emoji: '🐻',
  content:
  "I'm 28 and I still sleep with a stuffed bear. It's the only thing keeping my mental health together.",
  tags: ['Wholesome', 'Mental Health'],
  visibility: 'anonymous_room',
  createdAt: '2 days ago',
  status: 'active',
  reactionCount: 89,
  commentCount: 15,
  reportCount: 0
},
{
  id: 'p5',
  userId: 'MyCodeName123',
  emoji: '😎',
  content:
  'I told my boss I was sick but I actually spent the whole day binge-watching a K-drama. No regrets, the finale was worth it 🍿',
  tags: ['Funny', 'Secret', 'Regret'],
  visibility: 'public',
  createdAt: '3 hours ago',
  status: 'active',
  reactionCount: 67,
  commentCount: 8,
  reportCount: 0
},
{
  id: 'p6',
  userId: 'MyCodeName123',
  emoji: '😎',
  content:
  "I've been learning to cook just to impress someone who doesn't even know I exist. My kitchen has seen things… burnt things 🔥😅",
  tags: ['Crush', 'Funny'],
  visibility: 'public',
  createdAt: '1 day ago',
  status: 'active',
  reactionCount: 134,
  commentCount: 22,
  reportCount: 0
},
{
  id: 'p7',
  userId: 'MyCodeName123',
  emoji: '😎',
  content:
  "Sometimes I walk around the city with earphones in but no music playing, just so I can eavesdrop on strangers' conversations. I'm basically a detective at this point 🕵️",
  tags: ['Awkward', 'Secret'],
  visibility: 'anonymous_room',
  createdAt: '3 days ago',
  status: 'active',
  reactionCount: 201,
  commentCount: 31,
  reportCount: 0
}];

const MOCK_COMMENTS: Comment[] = [
{
  id: 'c1',
  postId: 'p1',
  userId: '9bA3d7c46eE2',
  emoji: '🐬',
  content: 'Omg same! Have you talked to them yet?',
  createdAt: '1 hour ago',
  status: 'active',
  reactionCount: 5,
  reportCount: 0
},
{
  id: 'c2',
  postId: 'p1',
  userId: 'F2e6b8a15dC0',
  emoji: '🐺',
  parentCommentId: 'c1',
  content:
  "Plot twist: they know and they're making your coffee extra weak on purpose.",
  createdAt: '45 mins ago',
  status: 'active',
  reactionCount: 12,
  reportCount: 0
},
{
  id: 'c3',
  postId: 'p3',
  userId: '3cD1f4e97aB8',
  emoji: '🐱',
  content:
  "RIP. We've all been there. The Nepal move is the only logical step.",
  createdAt: '20 hours ago',
  status: 'active',
  reactionCount: 45,
  reportCount: 0
}];

const MOCK_INBOX_MESSAGES: InboxMessage[] = [
{
  id: 'i1',
  senderLabel: '🕵️ Anonymous',
  content: 'I saw you at the coffee shop today, your outfit was amazing!',
  createdAt: '2 hours ago',
  isRead: false
},
{
  id: 'i2',
  senderLabel: 'Someone nearby',
  content:
  'Hey, I really liked your recent confession. Totally relate to it.',
  createdAt: '1 day ago',
  isRead: true,
  repliedAt: '1 day ago'
},
{
  id: 'i3',
  senderLabel: 'Secret Admirer',
  content: 'You have a great smile 😊',
  createdAt: '3 days ago',
  isRead: true
}];

export function App() {
  const [view, setView] = useState<
    'landing' | 'main' | 'account' | 'confessions' | 'chats' | 'profile'>(
    'landing');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [profileUserId, setProfileUserId] = useState<string | null>(null);
  const [messages, setMessages] =
  useState<Record<string, Message[]>>(MOCK_MESSAGES);
  const [sessions, setSessions] = useState<ChatSession[]>(MOCK_SESSIONS);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [inboxMessages, setInboxMessages] =
  useState<InboxMessage[]>(MOCK_INBOX_MESSAGES);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const currentUser = {
    emoji: '😎',
    friendId: 'MyCodeName123'
  };
  const inboxUrl = `addisfriend.com/inbox/${currentUser.friendId}`;
  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
  };
  const handleSelect = (id: string) => {
    setSelectedId(id);
    setView('main');
  };
  const handleViewProfile = (id: string) => {
    setProfileUserId(id);
    setView('profile');
  };
  const handleSendMessage = (contactId: string, text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    setMessages((prev) => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), newMessage]
    }));
  };
  const handleAddPost = (
  content: string,
  visibility: 'public' | 'anonymous_room',
  tags: string[]) =>
  {
    const newPost: Post = {
      id: `p${Date.now()}`,
      userId: currentUser.friendId,
      emoji: currentUser.emoji,
      content,
      tags,
      visibility,
      createdAt: 'Just now',
      status: 'active',
      reactionCount: 0,
      commentCount: 0,
      reportCount: 0
    };
    setPosts([newPost, ...posts]);
  };
  const handleEditPost = (postId: string, newContent: string) => {
    setPosts(
      posts.map((p) =>
      p.id === postId ?
      {
        ...p,
        content: newContent
      } :
      p
      )
    );
  };
  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter((p) => p.id !== postId));
  };
  const handleAddComment = (
  postId: string,
  content: string,
  parentId?: string) =>
  {
    const newComment: Comment = {
      id: `c${Date.now()}`,
      postId,
      userId: currentUser.friendId,
      emoji: currentUser.emoji,
      content,
      parentCommentId: parentId,
      createdAt: 'Just now',
      status: 'active',
      reactionCount: 0,
      reportCount: 0
    };
    setComments([...comments, newComment]);
    setPosts(
      posts.map((p) =>
      p.id === postId ?
      {
        ...p,
        commentCount: p.commentCount + 1
      } :
      p
      )
    );
  };
  const handleReactPost = (postId: string, type: ReactionType) => {
    setPosts(
      posts.map((p) =>
      p.id === postId ?
      {
        ...p,
        reactionCount: p.reactionCount + 1
      } :
      p
      )
    );
  };
  const handleReactComment = (commentId: string, type: ReactionType) => {
    setComments(
      comments.map((c) =>
      c.id === commentId ?
      {
        ...c,
        reactionCount: c.reactionCount + 1
      } :
      c
      )
    );
  };
  const handleMarkInboxRead = (id: string) => {
    setInboxMessages((prev) =>
    prev.map((msg) =>
    msg.id === id ?
    {
      ...msg,
      isRead: true
    } :
    msg
    )
    );
  };
  const handleReplyInbox = (id: string, text: string) => {
    setInboxMessages((prev) =>
    prev.map((msg) =>
    msg.id === id ?
    {
      ...msg,
      repliedAt: 'Just now'
    } :
    msg
    )
    );
    // In a real app, this would also create a public post or update the user's profile
  };
  const selectedContact = MOCK_USERS.find((c) => c.id === selectedId);
  if (view === 'landing') {
    return <LandingPage onEnterApp={() => setView('main')} />;
  }
  if (view === 'account') {
    return (
      <AccountPage
        currentUser={currentUser}
        contacts={MOCK_USERS}
        sessions={sessions}
        posts={posts}
        onBack={() => setView('main')}
        onOpenChat={handleSelect}
        onEditPost={handleEditPost}
        onDeletePost={handleDeletePost} />);


  }
  if (view === 'profile' && profileUserId) {
    const profileUser = MOCK_USERS.find((c) => c.id === profileUserId);
    if (profileUser) {
      return (
        <UserProfilePage
          user={profileUser}
          posts={posts}
          onBack={() => {
            setProfileUserId(null);
            setView('main');
          }}
          onMessage={(id) => {
            setProfileUserId(null);
            handleSelect(id);
          }}
          onReactPost={handleReactPost} />);


    }
  }
  return (
    <div className="min-h-screen w-full flex flex-col text-foreground font-sans selection:bg-pink-500/30 overflow-x-hidden bg-slate-950">
      <TopHeader
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        activeView={!selectedId ? view : undefined}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onAccountClick={() => setView('account')}
        onViewChange={(v) => setView(v)} />
      

      <AnimatePresence mode="wait">
        {view === 'confessions' ?
        <motion.div
          key="confessions"
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
            x: -20
          }}
          transition={{
            duration: 0.2
          }}
          className="flex-1 w-full relative bg-cover bg-center bg-no-repeat bg-fixed pb-20 md:pb-0"
          style={{
            backgroundImage:
            'url("https://cdn.magicpatterns.com/uploads/buFFB14RxN7rp2dVxCiLRi/64b6005b9b1c73650c503c0f921982ab.2-1-super.1.jpg")'
          }}>
          
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] pointer-events-none" />
            <div className="relative z-10">
              <ConfessionsFeed
              currentUser={currentUser}
              posts={posts}
              comments={comments}
              onAddPost={handleAddPost}
              onAddComment={handleAddComment}
              onReactPost={handleReactPost}
              onReactComment={handleReactComment} />
            
            </div>
          </motion.div> :
        view === 'chats' ?
        <motion.div
          key="chats"
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
            x: -20
          }}
          transition={{
            duration: 0.2
          }}
          className="flex-1 w-full flex flex-col">
          
            <ChatsListPage
            sessions={sessions}
            contacts={MOCK_USERS}
            messages={messages}
            inboxMessages={inboxMessages}
            inboxUrl={inboxUrl}
            onOpenChat={handleSelect}
            onSendMessage={handleSendMessage}
            onMarkInboxRead={handleMarkInboxRead}
            onReplyInbox={handleReplyInbox} />
          
          </motion.div> :
        !selectedId ?
        <motion.div
          key="discover"
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
          }}
          className="flex-1 w-full flex flex-col items-center relative bg-cover bg-center bg-no-repeat bg-fixed pb-20 md:pb-0"
          style={{
            backgroundImage:
            'url("https://cdn.magicpatterns.com/uploads/buFFB14RxN7rp2dVxCiLRi/64b6005b9b1c73650c503c0f921982ab.2-1-super.1.jpg")'
          }}>
          
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] pointer-events-none" />
            <div className="w-full max-w-3xl mx-auto p-4 md:p-8 pt-8 md:pt-16 pb-[30vh] md:pb-[30vh] relative z-10">
              <OnlineUsers
              contacts={MOCK_USERS}
              onSelect={handleSelect}
              onViewProfile={handleViewProfile} />
            
            </div>
          </motion.div> :

        <motion.div
          key="chat"
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
          }}
          className="h-screen w-full absolute inset-0 z-20">
          
            {selectedContact &&
          <ChatPage
            contact={selectedContact}
            messages={messages[selectedId] || []}
            onBack={() => setSelectedId(null)}
            onSend={(text) => handleSendMessage(selectedId, text)} />

          }
          </motion.div>
        }
      </AnimatePresence>

      {!selectedId && (
      view === 'main' || view === 'confessions' || view === 'chats') &&
      <BottomNav
        activeView={view}
        onViewChange={(v) => setView(v)}
        onAccountClick={() => setView('account')} />

      }

      <Footer />
    </div>);

}