import React, { useState } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { MOCK_INBOX_MESSAGES } from './constants';
import { useAuthStore } from '../auth/store';
import { InboxHeader } from './components/InboxHeader';
import { ShareInboxCard } from './components/ShareInboxCard';
import { InboxMessageList } from './components/InboxMessageList';

export function InboxPage() {
    const { user } = useAuthStore();
    const [inboxMessages, setInboxMessages] = useState(MOCK_INBOX_MESSAGES);
    const [copied, setCopied] = useState(false);
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [subject, setSubject] = useState('');
    const [instruction, setInstruction] = useState('');

    const inboxUrl = `${import.meta.env.VITE_FRONTEND_URL}/inbox/${user?.inbox_id}`;

    const queryParams = new URLSearchParams();
    if (subject) queryParams.append('subject', subject);
    if (instruction) queryParams.append('instruction', instruction);
    const queryString = queryParams.toString();
    const displayUrl = queryString ? `${inboxUrl}${inboxUrl.includes('?') ? '&' : '?'}${queryString}` : inboxUrl;

    const handleCopy = () => {
        if (typeof navigator !== 'undefined') {
            navigator.clipboard.writeText(displayUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleMarkRead = (id: string) => {
        setInboxMessages((prev) => prev.map((msg) => msg.id === id ? { ...msg, isRead: true } : msg));
    };

    const toggleExpand = (id: string, isRead: boolean) => {
        if (!isRead) {
            handleMarkRead(id);
        }
        setExpandedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    return (
        <MainLayout>
            <div className="flex-1 w-full relative pb-32 md:pb-40 font-sans">
                <div className="relative z-10 w-full max-w-3xl mx-auto px-4 py-12 min-h-screen">
                    <InboxHeader />

                    <div className="flex flex-col h-full relative font-sans space-y-6">
                        <ShareInboxCard
                            isShareOpen={isShareOpen}
                            setIsShareOpen={setIsShareOpen}
                            copied={copied}
                            displayUrl={displayUrl}
                            handleCopy={handleCopy}
                            subject={subject}
                            setSubject={setSubject}
                            instruction={instruction}
                            setInstruction={setInstruction}
                        />

                        <InboxMessageList
                            inboxMessages={inboxMessages}
                            expandedIds={expandedIds}
                            onToggleExpand={toggleExpand}
                        />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}