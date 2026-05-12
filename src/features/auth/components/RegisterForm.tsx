import { motion } from 'framer-motion';
import { Download, AlertTriangle } from 'lucide-react';
import { E2EE } from '@/utils/e2ee';
import { AuthFormProps } from '../types';



export const RegisterForm = ({ switchToAuthType }: AuthFormProps) => {

  const handleRegisterClick = async () => {
    const passCard = await E2EE.generatePassCard()

    // download passcard as text file
    E2EE.downloadPassCard(passCard)

    // navigate to login page
    switchToAuthType("login")
  };

  return (
    <motion.div
      key="register"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4 w-full"
    >
      <div className="relative group/mint">
        <div className="absolute -inset-[1px] bg-gradient-to-r from-pink-500/30 to-rose-600/30 rounded-3xl blur-md opacity-0 group-hover/mint:opacity-60 transition duration-500 -z-10"></div>
        <button
          onClick={handleRegisterClick}
          className="relative w-full bg-white border border-slate-200/60 rounded-3xl p-5 md:p-7 text-left hover:bg-slate-50/80 transition-all flex items-start gap-5 overflow-hidden group/btn shadow-sm hover:shadow-md"
        >
          <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/20 group-hover/btn:scale-105 transition-transform duration-300">
            <Download className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-slate-900 font-black text-lg md:text-xl mb-1 md:mb-1.5 tracking-tight uppercase">Create New PassCard</h3>
            <p className="text-slate-500 text-xs md:text-sm font-light leading-relaxed">System will generate and download your encrypted footprint as a Anstarnet-passcard.txt file.</p>
          </div>
          <div className="absolute left-0 top-0 w-1 h-full bg-pink-500 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
        </button>
      </div>

      {/* Warning Block */}
      <div className="bg-amber-50/80 border border-amber-200/60 rounded-2xl p-4 flex gap-3 items-start text-amber-700 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
        <AlertTriangle size={20} className="shrink-0 mt-0.5 text-amber-500" />
        <div className="flex flex-col gap-1">
          <span className="font-bold text-xs tracking-wide uppercase">Important Security Notice</span>
          <p className="text-xs leading-relaxed opacity-90">
            Do not share your AnstarNet PassCard with anybody. Please save it securely on Telegram, Google Drive, or another cloud storage to log back in later.
          </p>
        </div>
      </div>

      <div className="text-center mt-2">
        <button
          onClick={() => switchToAuthType('login')}
          className="text-slate-500 hover:text-slate-700 transition-colors text-sm font-medium"
        >
          Already have a PassCard? <span className="text-pink-600 hover:underline">Use existing</span>
        </button>
      </div>
    </motion.div>
  );
};
