import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { SendInboxMobileView } from '../components/InboxFormMobileView';
import { SendInboxDesktopView } from '../components/InboxFormDesktopView';

export function InboxReceivingPage() {
  const { inboxId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [instruction, setInstruction] = useState('Tell me something you never had the courage to say in person... 💭');

  useEffect(() => {
    // Decode custom title/instruction from the URL search parameters if provided
    const searchParams = new URLSearchParams(location.search);
    const tParam = searchParams.get('t');
    if (tParam) {
      try {
        const decodedTitle = decodeURIComponent(atob(tParam));
        if (decodedTitle) {
          setInstruction(decodedTitle);
        }
      } catch (err) {
        console.error('Failed to decode instruction param', err);
      }
    }
  }, [location.search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSending(true);
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setSubject('');
      setMessage('');
    }, 1500);
  };

  const handleNavigateHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full relative bg-transparent font-sans overflow-x-hidden flex flex-col">
      <SendInboxMobileView
        inboxId={inboxId}
        subject={subject}
        setSubject={setSubject}
        message={message}
        setMessage={setMessage}
        instruction={instruction}
        isSending={isSending}
        isSent={isSent}
        setIsSent={setIsSent}
        handleSubmit={handleSubmit}
        onNavigateHome={handleNavigateHome}
      />
      
      <SendInboxDesktopView
        inboxId={inboxId}
        subject={subject}
        setSubject={setSubject}
        message={message}
        setMessage={setMessage}
        instruction={instruction}
        isSending={isSending}
        isSent={isSent}
        handleSubmit={handleSubmit}
        onNavigateHome={handleNavigateHome}
      />
    </div>
  );
}
