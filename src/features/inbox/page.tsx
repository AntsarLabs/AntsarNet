import { MainLayout } from '@/components/MainLayout';
import { ShareInboxCard } from './components/ShareInboxCard';
import { InboxMessageList } from './components/InboxMessageList';

export function InboxPage() {
    return (
        <MainLayout>
            <div className="flex-1 w-full relative pb-32 md:pb-40 font-sans">
                <div className="relative z-10 w-full max-w-3xl mx-auto px-4 py-12 min-h-screen">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                                Anonymous Inbox [a.k.a Better-S.M.A :)]
                            </h2>
                            <p className="text-slate-500 text-sm max-w-md">
                                Generate a unique link to privately receive anonymous messages, honest feedback, and questions from anywhere.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col h-full relative font-sans space-y-6">
                        <ShareInboxCard />
                        <InboxMessageList />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}