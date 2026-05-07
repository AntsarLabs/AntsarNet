import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AccountPage } from '@/features/account/page';
import { InboxPage } from '@/features/inbox/page';
import { LandingPage } from '@/pages/LandingPage';
import { ConfessionsPage } from '@/features/confession/page';
import { ChatPage } from '@/features/chat/pages/ChatPage';
import { ChatsListPage } from '@/features/chat/page';
import { InboxReceivingPage } from '@/features/inbox/pages/InboxReceivingPage';
import { AuthPage } from '@/features/auth/page';
import { DiscoverPage } from '@/features/user/page';
import { ProtectedRoute } from '@/components/ProtectedRoute';

function AppContent() {
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
          <Route path="/messages/chats" element={<ChatsListPage />} />
          <Route path="/messages/inbox" element={<InboxPage />} />
          <Route path="/account" element={<AccountPage />} />

          <Route path="/chat/:id" element={<ChatPage />} />
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
