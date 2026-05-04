import { MainLayout } from '@/components/MainLayout';
import { InboxHeader } from './components/InboxHeader';
import { ShareInboxCard } from './components/ShareInboxCard';
import { InboxMessageList } from './components/InboxMessageList';

export function InboxPage() {
    return (
        <MainLayout>
            <div className="flex-1 w-full relative pb-32 md:pb-40 font-sans">
                <div className="relative z-10 w-full max-w-3xl mx-auto px-4 py-12 min-h-screen">
                    <InboxHeader />

                    <div className="flex flex-col h-full relative font-sans space-y-6">
                        <ShareInboxCard />
                        <InboxMessageList />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}