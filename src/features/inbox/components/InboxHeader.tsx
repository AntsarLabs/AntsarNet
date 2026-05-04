import React from 'react';
import { Sparkles } from 'lucide-react';

export function InboxHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-1 flex items-center gap-2">
          Anonymous Inbox <Sparkles className="text-pink-500" size={24} />
        </h2>
        <p className="text-slate-500 text-sm max-w-md">
          Generate a unique link to privately receive anonymous messages, honest feedback, and questions from anywhere.
        </p>
      </div>
    </div>
  );
}
