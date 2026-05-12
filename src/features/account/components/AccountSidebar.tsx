import React from 'react';
import { ChevronRight, LogOut, Download } from 'lucide-react';
import { AccountSidebarProps } from '../types';
import { useAuthStore } from '@/features/auth/store';
import { E2EE } from '@/utils/e2ee';

export const AccountSidebar: React.FC<AccountSidebarProps> = ({
  tabs,
  activeTab,
  onTabChange
}) => {
  const { user, publicKey, privateKey, logout } = useAuthStore();

  const handleDownloadPasscard = () => {
    if (!publicKey || !privateKey) return;

    // Reconstruct the passcard: randomKey|publicKey|privateKey then btoa
    // Using 're-download' as the randomKey prefix
    const reconstructedPasscard = btoa(`re-download|${publicKey}|${privateKey}`);
    E2EE.downloadPassCard(reconstructedPasscard);
  };

  return (
    <div className="bg-white/85 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm overflow-hidden divide-y divide-slate-100 md:sticky md:top-24">
      {/* Mobile Header - Hidden on Desktop */}
      <div className="md:hidden flex items-center gap-4 px-5 py-4 border-b border-slate-100">
        <div className="w-12 h-12 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-xl shadow-sm">
          {user?.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-mono font-bold text-slate-900 text-sm truncate">
            @{user?.username}
          </h2>
          <p className="text-xs text-slate-500">Manage your account</p>
        </div>
      </div>

      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 transition-colors text-left group 
              ${isActive ? 'md:bg-[#D82B7D]/10 md:border-l-[3px] md:border-l-[#D82B7D]' : 'md:hover:bg-slate-50/80 md:border-l-[3px] md:border-l-transparent'}
              hover:bg-slate-50/80`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors 
                ${isActive ? 'md:bg-[#D82B7D]/15 md:text-[#D82B7D]' : 'bg-slate-100 text-slate-600 group-hover:bg-pink-50 group-hover:text-pink-600'}`}
            >
              <Icon size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`text-sm font-semibold ${isActive ? 'md:text-[#D82B7D]' : 'text-slate-800'}`}>
                {tab.label}
              </h3>
              <p className="md:hidden text-xs text-slate-500 mt-0.5">{tab.description}</p>
            </div>
            <ChevronRight size={18} className="md:hidden text-slate-400 flex-shrink-0" />
          </button>
        );
      })}

      {/* Download Passcard Button */}
      <button
        onClick={handleDownloadPasscard}
        className="w-full flex items-center gap-3 px-4 py-3.5 transition-colors text-left group hover:bg-pink-50/80"
      >
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-pink-100 text-[#D82B7D] transition-colors group-hover:bg-[#D82B7D] group-hover:text-white">
          <Download size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-[#D82B7D] group-hover:text-pink-700">PassCard</h3>
          <p className="md:hidden text-xs text-pink-400 mt-0.5">Download your login footprint</p>
        </div>
        <ChevronRight size={18} className="md:hidden text-pink-400/50 flex-shrink-0" />
      </button>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="w-full flex items-center gap-3 px-4 py-3.5 transition-colors text-left group hover:bg-red-50/80"
      >
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-red-100 text-red-600 transition-colors group-hover:bg-red-500 group-hover:text-white">
          <LogOut size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-red-600 group-hover:text-red-700">Log Out</h3>
          <p className="md:hidden text-xs text-red-400 mt-0.5">Securely exit your session</p>
        </div>
        <ChevronRight size={18} className="md:hidden text-red-400/50 flex-shrink-0" />
      </button>
    </div>
  );
};
