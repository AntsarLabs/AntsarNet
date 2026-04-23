import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
  Children } from
'react';
import {
  MapPin,
  Radio,
  Search,
  MessageCircle,
  Shuffle,
  Sparkles,
  ChevronDown } from
'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Contact } from '../types/chat';
import { getEmojiName, getStableRandom } from '../utils/user';
interface OnlineUsersProps {
  contacts: Contact[];
  onSelect: (id: string) => void;
  onViewProfile?: (id: string) => void;
}
const MATCH_COLOR = {
  border: 'border-pink-200',
  bg: 'bg-pink-50',
  cardBg: 'bg-pink-50/50',
  text: 'text-pink-600',
  glow: 'shadow-[0_0_20px_rgba(236,72,153,0.2)]'
};

const ETHIOPIAN_CITIES = [
  'All',
  'Addis Ababa',
  'Adama',
  'Bahir Dar',
  'Dire Dawa',
  'Hawassa',
  'Mekelle',
  'Gondar',
  'Jimma',
  'Dessie',
  'Jijiga'
];

const CITY_CODES: Record<string, string> = {
  'Addis Ababa': 'AA',
  'Adama': 'AD',
  'Bahir Dar': 'BD',
  'Dire Dawa': 'DD',
  'Hawassa': 'HW',
  'Mekelle': 'MK',
  'Gondar': 'GD',
  'Jimma': 'JM',
  'Dessie': 'DS',
  'Jijiga': 'JJ',
  'All': 'ET'
};

export function OnlineUsers({
  contacts,
  onSelect,
  onViewProfile
}: OnlineUsersProps) {
  const [friendId, setFriendId] = useState('');
  const [error, setError] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const [winnerId, setWinnerId] = useState<string | null>(null);
  const [spinComplete, setSpinComplete] = useState(false);
  const [selectedCity, setSelectedCity] = useState('All');
  const [isCityMenuOpen, setIsCityMenuOpen] = useState(false);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const onlineContacts = contacts.filter((c) => c.isOnline && (selectedCity === 'All' || c.city === selectedCity));
  // Parse distance string to numeric value in meters for sorting
  const parseDistance = (dist?: string): number => {
    if (!dist) return Infinity;
    const num = parseFloat(dist);
    if (isNaN(num)) return Infinity;
    if (dist.includes('km')) return num * 1000;
    return num; // assume meters
  };
  // Sort online contacts by closeness to the selected location
  const sortedOnlineContacts = useMemo(() => {
    return [...onlineContacts].sort(
      (a, b) => parseDistance(a.distance) - parseDistance(b.distance)
    );
  }, [onlineContacts]);
  const clearSelection = useCallback(() => {
    if (!isSpinning) {
      setWinnerId(null);
      setSpinComplete(false);
      setHighlightIndex(null);
    }
  }, [isSpinning]);
  const handleConnect = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!friendId.trim() || isSpinning) return;
    const found = contacts.find(
      (c) => c.friendId.toLowerCase() === friendId.trim().toLowerCase()
    );
    if (found) {
      setError(false);
      setFriendId('');
      onSelect(found.id);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };
  const handleRandomPick = () => {
    if (isSpinning || sortedOnlineContacts.length === 0) return;
    setIsSpinning(true);
    setWinnerId(null);
    setSpinComplete(false);
    const winnerIdx = Math.floor(Math.random() * sortedOnlineContacts.length);
    const winner = sortedOnlineContacts[winnerIdx];
    const minSpins = 4;
    const totalSteps = minSpins * sortedOnlineContacts.length + winnerIdx;
    let currentStep = 0;
    let currentDelay = 50;
    const spin = () => {
      setHighlightIndex(currentStep % sortedOnlineContacts.length);
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
  useEffect(() => {
    if (highlightIndex !== null && sortedOnlineContacts[highlightIndex]) {
      const contact = sortedOnlineContacts[highlightIndex];
      const el = cardRefs.current[contact.id];
      if (el) {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest'
        });
      }
    }
  }, [highlightIndex, sortedOnlineContacts]);
  useEffect(() => {
    if (winnerId) {
      const el = cardRefs.current[winnerId];
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          });
        }, 100);
      }
    }
  }, [winnerId]);
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  };
  return (
    <div
      className="flex flex-col w-full space-y-5 md:space-y-8"
      onClick={clearSelection}>
      
      {/* Single-row Controls */}
      <div className="w-full max-w-2xl mx-auto px-2 md:px-0 relative z-50">
        <div className="flex items-center">
          {/* Unified Location + Search Group */}
          <div className="flex-1 flex items-center bg-white/90 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm min-h-[46px]">
            {/* Location Dropdown (Prefix) */}
            <div className="relative border-r border-slate-100 flex-shrink-0 h-full">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCityMenuOpen(!isCityMenuOpen);
                }}
                className="h-full px-4 flex items-center justify-center gap-2 hover:bg-slate-50 active:bg-slate-100 text-slate-800 transition-colors font-bold text-sm min-w-[70px] rounded-l-2xl"
                title="Filter by location">
                <MapPin className="w-4 h-4 text-pink-500" />
                <span className="font-bold">{CITY_CODES[selectedCity]}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isCityMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isCityMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden py-1.5 z-[100]"
                  >
                    <div className="max-h-60 overflow-y-auto hide-scrollbar">
                      {ETHIOPIAN_CITIES.map((city) => (
                        <button
                          key={city}
                          onClick={() => {
                            setSelectedCity(city);
                            setIsCityMenuOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm font-bold transition-all ${
                            selectedCity === city 
                              ? 'bg-pink-500 text-white' 
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Friend ID Input (Main) */}
            <form onSubmit={handleConnect} className="flex-1 relative h-full">
              <motion.div
                animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="relative flex items-center h-full">
                <input
                  type="text"
                  placeholder="Find by name or ID..."
                  value={friendId}
                  onChange={(e) => {
                    setFriendId(e.target.value);
                    setError(false);
                  }}
                  disabled={isSpinning}
                  className="w-full bg-transparent pl-4 pr-12 py-2.5 text-sm text-slate-900 focus:outline-none placeholder:text-slate-500 h-full" 
                />
                <button
                  type="submit"
                  disabled={!friendId.trim() || isSpinning}
                  className="absolute right-2 p-2 text-pink-500 hover:bg-pink-50 active:bg-pink-100 rounded-xl disabled:opacity-50 transition-all">
                  <Search className="w-5 h-5" />
                </button>
              </motion.div>
              
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-400 text-[10px] font-bold mt-1 pl-4 absolute bg-white/80 backdrop-blur-sm rounded-full px-2 py-0.5 border border-red-100 shadow-sm top-[-24px] left-2">
                    Not found. Check ID.
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* Random Pick (Separate Action) */}
          <button
            onClick={handleRandomPick}
            disabled={isSpinning || sortedOnlineContacts.length === 0}
            className={`ml-2 p-3 rounded-2xl font-medium transition-all duration-300 min-h-[46px] min-w-[46px] flex items-center justify-center flex-shrink-0 shadow-sm ${isSpinning ? 'bg-pink-50 text-pink-500 border border-pink-200' : 'bg-white/90 backdrop-blur-md hover:bg-white active:bg-white/80 text-slate-600 hover:text-slate-900 border border-white/50'} disabled:opacity-50 disabled:cursor-not-allowed`}
            title="Random Match">
            <motion.div
              animate={isSpinning ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 0.5, repeat: isSpinning ? Infinity : 0, ease: 'linear' }}>
              <Shuffle className="w-5 h-5" />
            </motion.div>
          </button>
        </div>
        <div className="flex items-center justify-center gap-2 mt-3">
          <span className="text-slate-600 text-sm md:text-lg font-medium">
            {sortedOnlineContacts.length} active in
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm md:text-lg text-slate-800 font-bold border border-slate-200/60 shadow-sm">
            <MapPin className="w-4 h-4 text-pink-500" />
            {selectedCity}
          </span>
        </div>
      </div>

      {/* Grid Section */}
      <AnimatePresence mode="wait">
        {sortedOnlineContacts.length === 0 ?
        <motion.div
          key="empty"
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          className="flex flex-col items-center justify-center py-16 md:py-20 text-center space-y-3 md:space-y-4">
          
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <Radio className="w-7 h-7 md:w-8 md:h-8 opacity-50" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-medium text-foreground">
                No friends nearby
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                Check back soon for new connections.
              </p>
            </div>
          </motion.div> :

        <motion.div
          key="grid"
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 md:gap-4 relative">
          
            {sortedOnlineContacts.map((contact, index) => {
            const isHighlighted = highlightIndex === index;
            const isWinner = winnerId === contact.id;
            const isDimmed =
            (isSpinning || spinComplete) && !isHighlighted && !isWinner;
            return (
              <motion.div
                key={contact.id}
                ref={(el: HTMLDivElement | null) => {
                  cardRefs.current[contact.id] = el;
                }}
                variants={itemVariants}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                whileHover={
                !isSpinning && !spinComplete ?
                {
                  scale: 1.03,
                  y: -4
                } :
                {}
                }
                animate={{
                  scale: isWinner ? 1.05 : isHighlighted ? 1.02 : 1,
                  y: 0,
                  opacity: isDimmed ? 0.75 : 1,
                  filter: isDimmed ?
                  'grayscale(0.6) brightness(0.85)' :
                  'grayscale(0) brightness(1)'
                }}
                transition={{
                  duration: 0.15
                }}
                className={`group relative flex flex-col p-3.5 md:p-5 bg-white/85 backdrop-blur-md rounded-xl md:rounded-2xl border transition-all duration-200 shadow-sm overflow-visible ${isWinner || isHighlighted ? `${MATCH_COLOR.border} ${MATCH_COLOR.glow}` : 'border-white/60 hover:border-pink-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]'}`}
                style={{
                  zIndex: isWinner || isHighlighted ? 10 : 1
                }}>
                
                  {/* Card Header: Circular Icon + Friend ID card */}
                  <div
                  className="flex items-center gap-3 w-full cursor-pointer group/header"
                  onClick={() => {
                    if (!isSpinning && onViewProfile) {
                      onViewProfile(contact.id);
                    }
                  }}>
                  
                    <div className="relative flex-shrink-0">
                      <div
                      className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-2 flex items-center justify-center text-xl md:text-2xl transition-all shadow-sm group-hover/header:scale-105 ${isWinner || isHighlighted ? `${MATCH_COLOR.border} bg-white` : 'border-slate-100 bg-slate-50/50'}`}>
                        {contact.emoji}
                      </div>
                    </div>
                    
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-bold text-slate-900 text-sm md:text-base truncate">
                          @{getEmojiName(contact.emoji)}_{getStableRandom(contact.friendId)}
                        </span>
                      </div>
                      <span className="text-[10px] md:text-[11px] text-slate-500 font-medium flex items-center gap-1">
                        {contact.isOnline ? 'online' : 'last seen 1h ago'}
                      </span>
                    </div>
                  </div>

                  {/* Mood / Bio as speech bubble */}
                  {contact.mood &&
                <div className="relative mt-3 md:mt-4 w-full">
                      {/* Bubble tail pointing up toward the ID */}
                      <div className="absolute -top-[7px] left-3 md:left-4 w-3 h-3 bg-white/90 rotate-45 z-10 border-l border-t border-slate-200 [border-bottom:none] [border-right:none]" />
                      <div className="relative px-3 py-2 md:px-4 md:py-2.5 rounded-xl bg-white/90 border border-slate-200 w-full rounded-tl-sm shadow-sm">
                        <p className="text-[10px] md:text-xs text-slate-600 leading-relaxed line-clamp-2 text-left font-medium">
                          {contact.mood}
                        </p>
                      </div>
                    </div>
                }

                  {/* Card Footer: Connect button (80%) + Distance (20%) */}
                  <div className="flex items-center gap-1.5 w-full mt-2 md:mt-3">
                    <button
                    onClick={() => !isSpinning && onSelect(contact.id)}
                    disabled={isSpinning}
                    className={`flex-[4] flex items-center justify-center gap-1.5 px-2 py-1.5 md:py-2 rounded-lg text-[10px] md:text-xs font-semibold transition-all shadow-sm ${isWinner || isHighlighted ? `${MATCH_COLOR.bg} ${MATCH_COLOR.text} border ${MATCH_COLOR.border}` : 'bg-[#D82B7D] text-white hover:bg-[#C0266F] active:bg-[#A82161]'} disabled:opacity-50`}>
                    
                      <MessageCircle className="w-3 h-3" />
                      Message
                    </button>
                    <div className="flex-1 flex items-center justify-center gap-1 px-1.5 py-1.5 md:py-2 rounded-lg bg-slate-50 shadow-inner">
                      <MapPin className="w-2.5 h-2.5 md:w-3 md:h-3 text-slate-500" />
                      <span className="text-[9px] md:text-[11px] text-slate-600 font-bold whitespace-nowrap">
                        {contact.city ? CITY_CODES[contact.city] || '??' : '??'}
                      </span>
                    </div>
                  </div>
                </motion.div>);

          })}
          </motion.div>
        }
      </AnimatePresence>

      {/* 30% spacer between cards and footer */}
      <div className="h-[30vh] md:h-[30vh]" />
    </div>);

}