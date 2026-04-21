import React from 'react';
import { Lock } from 'lucide-react';
export function Footer() {
  return (
    <footer className="relative z-10 bg-slate-950 border-t border-slate-800 py-8 w-full">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-200 text-lg">AddisFriend</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">v1.0</span>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-6 text-slate-400">
          <button className="hover:text-pink-400 transition-colors">
            Safety
          </button>
          <button className="hover:text-pink-400 transition-colors">
            Guidelines
          </button>
          <button className="hover:text-pink-400 transition-colors">
            Report
          </button>
          <button className="hover:text-pink-400 transition-colors">
            Privacy
          </button>
        </div>
        <p className="text-slate-500 text-xs flex items-center gap-1.5">
          <Lock size={12} /> Anonymous & encrypted
        </p>
      </div>
    </footer>);

}