import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { SendInboxMobileView } from '../components/InboxFormMobileView';
import { SendInboxDesktopView } from '../components/InboxFormDesktopView';
import { inboxApi } from '../api';
import { GlobalBackground } from '@/components/GlobalBackground';

export function InboxReceivingPage() {
  const { inboxId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [title, setTitle] = useState('');

  useEffect(() => {
    // Decode custom title from the URL search parameters if provided
    const searchParams = new URLSearchParams(location.search);
    const tParam = searchParams.get('t');
    if (tParam) {
      try {
        const decodedTitle = decodeURIComponent(atob(tParam));
        if (decodedTitle) {
          setTitle(decodedTitle);
        }
      } catch (err) {
        console.error('Failed to decode title param', err);
      }
    }
  }, [location.search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSending(true);
    // Simulate API call
    setTimeout(async () => {
      setIsSending(false);
      if (inboxId) {
        await inboxApi.sendMessageToInbox(title, message, inboxId);
      }
      setMessage('');
      setIsSent(true);
      setTimeout(() => setIsSent(false), 3000);
    }, 1500);
  };

  const handleNavigateHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full relative bg-transparent font-sans overflow-x-hidden flex flex-col">
      <GlobalBackground />
      <SendInboxMobileView
        inboxId={inboxId}
        message={message}
        setMessage={setMessage}
        title={title}
        isSending={isSending}
        isSent={isSent}
        handleSubmit={handleSubmit}
        onNavigateHome={handleNavigateHome}
      />

      <SendInboxDesktopView
        inboxId={inboxId}
        message={message}
        setMessage={setMessage}
        title={title}
        isSending={isSending}
        isSent={isSent}
        handleSubmit={handleSubmit}
        onNavigateHome={handleNavigateHome}
      />
    </div>
  );
}
