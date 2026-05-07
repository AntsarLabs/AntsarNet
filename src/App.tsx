import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, Navigate } from 'react-router-dom';

import { MainLayout } from '@/components/MainLayout';
import { AccountPage } from '@/features/account/page';
import { InboxPage } from '@/features/inbox/page';
import { LandingPage } from '@/pages/LandingPage';
import { ConfessionsPage } from '@/features/confession/page';
import { ChatPage } from '@/pages/ChatPage';
import { ChatsListPage } from '@/pages/ChatsListPage';
import { InboxReceivingPage } from '@/features/inbox/pages/InboxReceivingPage';
import { AuthPage } from '@/features/auth/page';
import { DiscoverPage } from '@/features/user/page';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import {
  Contact,
  Message,
  ChatSession,
} from '@/types/chat';

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


function AppContent() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Record<string, Message[]>>(MOCK_MESSAGES);
  const [sessions, setSessions] = useState<ChatSession[]>(MOCK_SESSIONS);

  const handleSelect = (id: string) => {
    navigate(`/chat/${id}`);
  };

  const handleSendMessage = (contactId: string, text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), newMessage]
    }));
  };


  // const ChatPageRoute = () => {
  //   const { id } = useParams();
  //   if (!id) return <Navigate to="/discover" />;

  //   const contact = MOCK_USERS.find(c => c.id === id);
  //   if (!contact) return <Navigate to="/discover" />;

  //   return (
  //     <div className="h-screen w-full bg-slate-50 flex flex-col">
  //       <ChatPage
  //         contact={contact}
  //         messages={messages[id] || []}
  //         onBack={() => navigate(-1)}
  //         onSend={(text) => handleSendMessage(id, text)}
  //       />
  //     </div>
  //   );
  // };




  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/inbox/:inboxId" element={<InboxReceivingPage />} />

        {/* Protected routes — layout route pattern for React Router v6 */}
        <Route element={<ProtectedRoute />}>
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/confessions" element={<ConfessionsPage />} />
          {/* <Route path="/messages/chats" element={
            <MainLayout>
              <div className="flex-1 w-full relative pb-20 md:pb-0 font-sans">
                <div className="relative z-10 w-full h-full">
                  <ChatsListPage
                    sessions={sessions}
                    contacts={MOCK_USERS}
                    messages={messages}
                    onOpenChat={handleSelect}
                    onSendMessage={handleSendMessage}
                  />
                </div>
              </div>
            </MainLayout>
          } /> */}
          <Route path="/messages/inbox" element={<InboxPage />} />
          <Route path="/account" element={<AccountPage />} />

          {/* <Route path="/chat/:id" element={
            <MainLayout showHeader={false} showBottomNav={false}>
              <ChatPageRoute />
            </MainLayout>
          } /> */}
        </Route>
      </Routes>
    </>
  );
}

export function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
