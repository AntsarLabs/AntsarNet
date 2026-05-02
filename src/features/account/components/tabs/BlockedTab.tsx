import React from 'react';
import { Ban } from 'lucide-react';
import { Contact } from '@/types/chat';

// Mock data inside component as requested
const MOCK_BLOCKED: Contact[] = [
  { id: '2', friendId: 'B7d2e9a01bC3', emoji: '🦉', isOnline: true, distance: '1.2km', city: 'Addis Ababa', blockStatus: 'blocked_by_you' }
];

export const BlockedTab: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="bg-white/85 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/60 shadow-sm p-5 md:p-6">
        <h2 className="text-xl font-bold text-slate-900">Block List</h2>
        <p className="text-slate-500 text-sm mt-1">Users you have blocked</p>
      </div>

      {MOCK_BLOCKED.length === 0 ? (
        <div className="text-center py-12 bg-white/85 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/60 shadow-sm">
          <Ban size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-700">No blocked users</h3>
          <p className="text-slate-400 text-sm mt-1">You haven't blocked anyone yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {MOCK_BLOCKED.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between p-4 bg-white/85 backdrop-blur-md border border-white/60 rounded-xl md:rounded-2xl shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xl shadow-sm">
                  {contact.emoji}
                </div>
                <span className="font-mono font-semibold text-slate-800 text-sm">{contact.friendId}</span>
              </div>
              <button className="px-4 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors shadow-sm">
                Unblock
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
