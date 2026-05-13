import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, Check, MoreVertical, Download, Copy, Trash2 } from 'lucide-react';
import { InboxMessageCardProps } from '../types';

export function InboxMessageCard({
  msg,
  index,
  onMarkRead,
  onDelete
}: InboxMessageCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isLong = msg.message.length > 180;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleExpand = () => {
    if (!msg.isRead) {
      onMarkRead(msg.id);
    }
    setIsExpanded(!isExpanded);
  };

  const handleMarkReadOnly = () => {
    if (!msg.isRead) {
      onMarkRead(msg.id);
    }
  };

  const handleExportImage = (message: typeof msg) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 400;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // Header with ID
    ctx.fillStyle = '#d82b7d';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(`#${message.id.slice(-7).toUpperCase()}`, 30, 45);

    // Subject
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 18px system-ui';
    ctx.fillText(message.subject, 30, 80);

    // Message text (wrap text)
    ctx.fillStyle = '#475569';
    ctx.font = '14px system-ui';
    const maxWidth = 740;
    const lineHeight = 22;
    const words = message.message.split(' ');
    let line = '';
    let y = 115;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, 30, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 30, y);

    // Timestamp
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px system-ui';
    ctx.fillText(`Sent: ${message.createdAt}`, 30, 360);

    // Download
    const link = document.createElement('a');
    link.download = `message-${message.id.slice(-7)}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCopyText = (message: typeof msg) => {
    const text = `Subject: ${message.subject}\n\n${message.message}\n\nSent: ${message.createdAt}`;
    navigator.clipboard.writeText(text).then(() => {
      // Could show toast notification here
    });
  };

  return (
    <motion.div
      layoutId={`whisper-${msg.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`group relative overflow-visible flex flex-col gap-4 p-5 rounded-2xl transition-all duration-300 ${isMenuOpen ? 'z-50' : 'z-0'
        } ${!msg.isRead
          ? 'bg-white shadow-[0_8px_30px_rgba(216,43,125,0.1)] border-l-4 border-l-pink-500 border-y border-r border-white/60'
          : 'bg-white/85 backdrop-blur-md border border-white/60 hover:bg-white transition-all shadow-sm'
        }`}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="text-[10px] font-black font-mono text-pink-500 bg-pink-50 px-2.5 py-1.5 rounded-lg border border-pink-100 uppercase tracking-widest shadow-sm">
              #{msg.id.slice(-7).toUpperCase()}
            </span>
            {!msg.isRead && (
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-pink-500 border-2 border-white shadow-[0_0_8px_rgba(216,43,125,0.5)] z-10" />
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em] tabular-nums">
            {msg.createdAt}
          </span>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 -mr-1.5 rounded-full hover:bg-slate-100"
              title="Menu"
            >
              <MoreVertical size={16} />
            </button>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-100 py-1 z-50"
              >
                <button
                  onClick={() => {
                    handleExportImage(msg);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Download size={14} className="text-slate-400" />
                  Export as image
                </button>
                <button
                  onClick={() => {
                    handleCopyText(msg);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Copy size={14} className="text-slate-400" />
                  Copy as text
                </button>
                <div className="my-1 border-t border-slate-100" />
                <button
                  onClick={() => {
                    onDelete(msg.id);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} className="text-red-400" />
                  Delete
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <div className="relative space-y-2">
        <h4 className="text-[15px] font-bold text-slate-800 tracking-tight">
          {msg.subject}
        </h4>
        <p
          className={`text-[14px] leading-relaxed transition-all duration-300 text-slate-600 ${!isExpanded && isLong ? 'line-clamp-3' : ''
            }`}
        >
          {msg.message}
        </p>

        {isLong && (
          <button
            onClick={handleToggleExpand}
            className="mt-3 flex items-center gap-1.5 text-xs font-bold text-pink-600 hover:text-pink-700 transition-colors group/btn bg-pink-50 px-3 py-1.5 rounded-lg border border-pink-100 w-fit"
          >
            {isExpanded ? (
              <>
                Show less <ChevronUp size={14} className="transition-transform group-hover/btn:-translate-y-0.5" />
              </>
            ) : (
              <>
                Read full message <ChevronDown size={14} className="transition-transform group-hover/btn:translate-y-0.5" />
              </>
            )}
          </button>
        )}

        {!isLong && !msg.isRead && (
          <button
            onClick={handleMarkReadOnly}
            className="mt-3 text-[10px] font-bold text-slate-400 hover:text-pink-600 transition-colors uppercase tracking-[0.15em] flex items-center gap-1.5"
          >
            <Check size={12} />
            Mark as read
          </button>
        )}
      </div>
    </motion.div>
  );
}
