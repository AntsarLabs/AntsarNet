import { EyeOff, ShieldCheck, Users, MapPin, Share2 } from 'lucide-react';

export function SendInboxPromoCards() {
  return (
    <>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <div className="flex gap-3 overflow-x-auto pb-4 px-6 hide-scrollbar">
        <div className="shrink-0 w-[140px] bg-slate-50 border border-slate-100 p-4 rounded-2xl">
          <EyeOff size={18} className="text-pink-500 mb-2" />
          <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-tight">Anonymous</h4>
          <p className="text-[9px] text-slate-500 mt-1 leading-tight">No tracking, your identity is hidden.</p>
        </div>
        <div className="shrink-0 w-[140px] bg-slate-50 border border-slate-100 p-4 rounded-2xl">
          <ShieldCheck size={18} className="text-blue-500 mb-2" />
          <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-tight">Private</h4>
          <p className="text-[9px] text-slate-500 mt-1 leading-tight">End-to-end encrypted delivery.</p>
        </div>
        <div className="shrink-0 w-[140px] bg-slate-50 border border-slate-100 p-4 rounded-2xl">
          <Share2 size={18} className="text-green-500 mb-2" />
          <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-tight">Post</h4>
          <p className="text-[9px] text-slate-500 mt-1 leading-tight">Share your thoughts anonymously</p>
        </div>
        <div className="shrink-0 w-[140px] bg-slate-50 border border-slate-100 p-4 rounded-2xl">
          <MapPin size={18} className="text-amber-500 mb-2" />
          <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-tight">Discovery</h4>
          <p className="text-[9px] text-slate-500 mt-1 leading-tight">Meet local friends safely.</p>
        </div>
      </div>
    </>
  );
}
