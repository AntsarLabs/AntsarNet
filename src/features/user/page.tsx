import React, { useState, useCallback, useEffect } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { UsersList } from './components/UsersList';
import { UsersToolbar } from './components/UsersToolbar';
import { useUsersInfinite, useTotalOnlineUsers } from './hooks';


export function DiscoverPage() {
  const query = new URLSearchParams(window.location.search);
  const [searchQuery, setSearchQuery] = useState(query.get('q') || '');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [error, setError] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const [winnerId, setWinnerId] = useState<string | null>(null);
  const [spinComplete, setSpinComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== '') {
        setDebouncedQuery(searchQuery);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: usersData, isFetching } = useUsersInfinite({ username: debouncedQuery });
  const { data: totalOnlineCount = 0 } = useTotalOnlineUsers();

  const allUsers = usersData?.pages.flatMap((page) => page) ?? [];
  const onlineContacts = allUsers; // Use all users for the random pick logic

  const clearSelection = useCallback(() => {
    if (!isSpinning) {
      setWinnerId(null);
      setSpinComplete(false);
      setHighlightIndex(null);
    }
  }, [isSpinning]);

  const handleRandomPick = () => {
    if (isSpinning || onlineContacts.length === 0) return;
    setIsSpinning(true);
    setWinnerId(null);
    setSpinComplete(false);
    const winnerIdx = Math.floor(Math.random() * onlineContacts.length);
    const winner = onlineContacts[winnerIdx];
    const minSpins = 4;
    const totalSteps = minSpins * onlineContacts.length + winnerIdx;
    let currentStep = 0;
    let currentDelay = 50;
    const spin = () => {
      setHighlightIndex(currentStep % onlineContacts.length);
      if (currentStep < totalSteps) {
        currentStep++;
        const progress = currentStep / totalSteps;
        currentDelay = 50 + Math.pow(progress, 4) * 400;
        setTimeout(spin, currentDelay);
      } else {
        setWinnerId(winner.id);
        setSpinComplete(true);
        setIsSpinning(false);
      }
    };
    spin();
  };

  const handleConnect = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // Manual search is now handled by the real-time filter on the list
  };

  return (
    <MainLayout>
      <div 
        className="flex-1 w-full flex flex-col items-center py-16 md:py-24 px-4 overflow-y-auto"
        onClick={clearSelection}
      >
        <div className="w-full max-w-3xl mx-auto relative z-10 flex flex-col space-y-5 md:space-y-8">
          <UsersToolbar
            searchQuery={searchQuery}
            onSearchQueryChange={(val) => {
              setSearchQuery(val);
              setError(false);
            }}
            onConnect={handleConnect}
            error={error}
            isSearching={isFetching || searchQuery !== debouncedQuery}
            isSpinning={isSpinning}
            onRandomPick={handleRandomPick}
            activeCount={totalOnlineCount}
            hasContacts={onlineContacts.length > 0}
          />
          <UsersList
            onSelect={(id) => {
              setWinnerId(id);
              setSpinComplete(true);
            }}
            isSpinning={isSpinning}
            spinComplete={spinComplete}
            highlightIndex={highlightIndex}
            winnerId={winnerId}
            searchQuery={searchQuery}
          />
        </div>
      </div>
    </MainLayout>
  );
}

