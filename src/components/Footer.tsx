import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="relative z-10 bg-white/80 backdrop-blur-md border-t border-slate-200/60 py-8 w-full">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-800 text-lg">AntsarNet</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-400">v1.0</span>
          </div>
          <p className="text-slate-500 text-xs">
            Developed by{' '}
            <a
              href="https://t.me/thekassdag"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:text-pink-600 transition-colors"
            >
              Kassdag
            </a>{' '}
            under{' '}
            <a
              href="https://antsar.et"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:text-pink-600 transition-colors"
            >
              AntsarLabs
            </a>
          </p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-6 text-slate-500">
          <Link to="/privacy-policy" className="hover:text-pink-500 transition-colors">
            Privacy Policy
          </Link>
        </div>
        <p className="text-slate-400 text-xs flex items-center gap-1.5">
          <Lock size={12} /> Anonymous & encrypted
        </p>
      </div>
    </footer>);
}