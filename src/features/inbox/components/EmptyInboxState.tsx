import React from 'react';
import { Sparkles } from 'lucide-react';

export function EmptyInboxState() {
  return (
    <div className="text-center py-20 bg-white/85 backdrop-blur-md rounded-3xl border border-white/60 shadow-sm">
      <div className="w-20 h-20 mb-6 mx-auto rounded-full bg-slate-100 flex items-center justify-center relative border border-slate-200">
        <Sparkles className="text-slate-400" size={32} />
      </div>
      <p className="text-slate-800 text-lg font-bold mb-1">Waiting for the first message...</p>
      <p className="text-slate-500 text-sm max-w-xs mx-auto">
        When someone sends an anonymous message, feedback, or confession, it will appear here.
      </p>
    </div>
  );
}
