import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Ban,
  Flame,
  ChevronLeft
} from 'lucide-react';
import { AccountTab, TabItem, AccountUser } from './types';
import { AccountSidebar, ProfileTab, BlockedTab } from './components';
import { MainLayout } from '@/components/MainLayout';
import { useNavigate } from 'react-router-dom';

const TABS: TabItem[] = [
  {
    id: 'profile',
    label: 'Profile',
    description: 'Update your public persona',
    icon: User
  },
  {
    id: 'blocked',
    label: 'Block List',
    description: 'Users you have blocked',
    icon: Ban
  }
];


export function AccountPage() {
  const [activeTab, setActiveTab] = useState<AccountTab | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.innerWidth >= 768 && !activeTab) {
      setActiveTab('profile');
    }
  }, []);

  const activeTabData = TABS.find((t) => t.id === activeTab);

  const renderTabContent = (tab: AccountTab | null) => {
    switch (tab) {
      case 'profile':
        return <ProfileTab />;
      case 'blocked':
        return <BlockedTab />;
      default:
        return null;
    }
  };

  return (
    <MainLayout headerClassName="hidden md:block">
      <div className="flex-1 w-full flex flex-col bg-transparent relative">
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="md:hidden h-14 flex items-center px-4 sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <button
            onClick={() => {
              if (activeTab && typeof window !== 'undefined' && window.innerWidth < 768) {
                setActiveTab(null);
              } else {
                navigate('/discover');
              }
            }}
            className="p-2 -ml-2 text-slate-500 hover:text-slate-800 transition-colors rounded-full hover:bg-slate-100"
          >
            <ChevronLeft size={22} />
          </button>
          <h1 className="text-lg font-semibold ml-2 text-slate-900">
            {activeTab ? activeTabData?.label || 'Account' : 'Account'}
          </h1>
        </div>

        <div className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 gap-6 relative z-[30] flex flex-col md:flex-row">
          {/* Sidebar container */}
          <div className={`${activeTab ? 'hidden md:block' : 'block'} w-full md:w-56 flex-shrink-0`}>
            <AccountSidebar
              tabs={TABS}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          {/* Content area container */}
          <div className={`${!activeTab ? 'hidden md:block' : 'block'} flex-1 min-w-0`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab || 'empty'}
                initial={{ opacity: 0, x: activeTab ? 20 : 0, y: activeTab ? 0 : 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: activeTab ? 20 : 0, y: activeTab ? 0 : -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab ? (
                  renderTabContent(activeTab)
                ) : (
                  <div className="hidden md:block bg-white/85 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm p-12 text-center">
                    <p className="text-slate-500">Loading profile...</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
