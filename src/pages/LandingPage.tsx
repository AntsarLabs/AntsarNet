import React from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  MapPin,
  Lock,
  MessageCircle,
  User,
  Sparkles,
  EyeOff,
  Trash2,
  Ban,
  ChevronRight,
  Users
} from
  'lucide-react';
import { Footer } from '../components/Footer';
interface LandingPageProps {
  onEnterApp: () => void;
}
import { GlobalBackground } from '../components/GlobalBackground';

const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 30
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  }
};
const staggerContainer = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export function LandingPage({ onEnterApp }: LandingPageProps) {
  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] text-slate-800 font-sans overflow-x-hidden selection:bg-pink-500/20 selection:text-pink-700">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-32 px-4">
        <GlobalBackground showFloatingEmojis={true} />

        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            transition={{
              duration: 0.8,
              type: 'spring'
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-slate-200/60 backdrop-blur-md mb-8 shadow-sm">

            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-slate-600">
              Now live in your city
            </span>
          </motion.div>

          <motion.h1
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.6,
              delay: 0.1
            }}
            className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight mb-6 flex flex-wrap justify-center items-baseline gap-2 md:gap-4">

            <span
              className="text-pink-500 relative"
              style={{
                textShadow:
                  '0 0 40px rgba(236,72,153,0.2), 0 0 80px rgba(236,72,153,0.08)'
              }}>

              Addis
            </span>
            <span className="text-slate-900">Net</span>
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.6,
              delay: 0.2
            }}
            className="text-xl md:text-2xl text-slate-600 mb-4 max-w-2xl font-light leading-relaxed">

            Meet someone new. Stay anonymous. Stay safe.
          </motion.p>

          <motion.p
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.6,
              delay: 0.3
            }}
            className="text-sm md:text-base text-slate-500 mb-12 max-w-lg">

            Discover anonymous friends in your neighborhood. No real names, no
            photos — just genuine conversations.
          </motion.p>

          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.6,
              delay: 0.4
            }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">

            <button
              onClick={onEnterApp}
              className="w-full sm:w-auto px-10 py-4 bg-[#D82B7D] hover:bg-[#C0266F] text-white rounded-xl font-semibold text-lg transition-all shadow-[0_0_30px_rgba(216,43,125,0.2)] hover:shadow-[0_0_40px_rgba(216,43,125,0.35)] flex items-center justify-center gap-2">

              <Sparkles size={20} />
              Discover Nearby Friends
            </button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          transition={{
            delay: 1,
            duration: 1
          }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400">

          <span className="text-xs uppercase tracking-widest font-semibold">
            Scroll
          </span>
          <motion.div
            animate={{
              y: [0, 8, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="w-5 h-8 border-2 border-slate-300 rounded-full flex justify-center pt-1.5">

            <div className="w-1 h-1.5 bg-slate-400 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 md:py-32 px-4 bg-white relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              margin: '-100px'
            }}
            variants={fadeInUp}
            className="text-center mb-16 md:mb-24">

            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900">
              Designed for <span className="text-pink-500">Privacy</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              We built AddisNet from the ground up to protect your identity
              while helping you make meaningful local connections.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              margin: '-100px'
            }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

            {[
              {
                icon: EyeOff,
                title: 'Anonymous Identity',
                desc: 'No real names or photos. Express yourself through emoji avatars and unique code names.'
              },
              {
                icon: MapPin,
                title: 'Nearby Discovery',
                desc: 'Find people close to you. We only show approximate distances, never your exact location.'
              },
              {
                icon: Lock,
                title: 'End-to-End Encrypted',
                desc: 'Your conversations are private. Messages are encrypted and automatically delete after 24 hours.'
              }].
              map((feature, i) =>
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="bg-slate-50/80 border border-slate-200/60 backdrop-blur-md rounded-3xl p-8 hover:bg-white hover:shadow-lg transition-all group">

                  <div className="w-14 h-14 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-500 mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                </motion.div>
              )}
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 md:py-32 px-4 bg-[#FAF8F5] border-y border-slate-200/40 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              margin: '-100px'
            }}
            variants={fadeInUp}
            className="text-center mb-16 md:mb-24">

            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900">
              How It Works
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Three simple steps to start meeting new people in your area.
            </p>
          </motion.div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-pink-300/40 to-transparent -translate-y-1/2 z-0" />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                margin: '-100px'
              }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative z-10">

              {[
                {
                  step: '01',
                  icon: User,
                  title: 'Create Your Identity',
                  desc: 'Sign up and get a unique code name with an emoji avatar. No personal info required.'
                },
                {
                  step: '02',
                  icon: Users,
                  title: 'Discover Nearby Friends',
                  desc: 'Browse anonymous people near you, sorted by distance. See their mood and vibe.'
                },
                {
                  step: '03',
                  icon: MessageCircle,
                  title: 'Start Chatting',
                  desc: 'Hit message to connect. Conversations are private, encrypted, and auto-delete.'
                }].
                map((item, i) =>
                  <motion.div
                    key={i}
                    variants={fadeInUp}
                    className="flex flex-col items-center text-center relative">

                    <div className="w-20 h-20 rounded-full bg-white border-2 border-pink-200/60 flex items-center justify-center mb-6 shadow-lg relative">
                      <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-pink-500 text-white text-sm font-bold flex items-center justify-center border-4 border-[#FAF8F5]">
                        {item.step}
                      </span>
                      <item.icon size={32} className="text-pink-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 leading-relaxed max-w-xs">
                      {item.desc}
                    </p>
                  </motion.div>
                )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* SAFETY & TRUST */}
      <section className="py-24 md:py-32 px-4 bg-white relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                margin: '-100px'
              }}
              variants={fadeInUp}
              className="flex-1 space-y-6">

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-2">
                <Shield size={16} />
                Trust & Safety
              </div>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight text-slate-900">
                Your Safety, <br />
                <span className="text-pink-500">Our Priority</span>
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed">
                We believe you shouldn't have to compromise your safety to meet
                new people. Our platform includes built-in protections to ensure
                a positive experience for everyone.
              </p>
              <ul className="space-y-4 pt-4">
                {[
                  'Automated content filtering for inappropriate messages',
                  'One-tap block and report functionality',
                  'No personal data stored on our servers',
                  'Strict community guidelines enforcement'].
                  map((item, i) =>
                    <li key={i} className="flex items-start gap-3 text-slate-600">
                      <div className="mt-1 w-5 h-5 rounded-full bg-pink-50 flex items-center justify-center flex-shrink-0 border border-pink-100">
                        <div className="w-2 h-2 rounded-full bg-pink-500" />
                      </div>
                      {item}
                    </li>
                  )}
              </ul>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                margin: '-100px'
              }}
              variants={staggerContainer}
              className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">

              {[
                {
                  icon: Shield,
                  title: 'Content Filtering',
                  color: 'text-blue-500',
                  bg: 'bg-blue-50',
                  border: 'border-blue-100'
                },
                {
                  icon: Ban,
                  title: 'Block & Report',
                  color: 'text-red-500',
                  bg: 'bg-red-50',
                  border: 'border-red-100'
                },
                {
                  icon: Trash2,
                  title: 'Auto-Delete',
                  color: 'text-amber-500',
                  bg: 'bg-amber-50',
                  border: 'border-amber-100'
                },
                {
                  icon: EyeOff,
                  title: 'No Real Names',
                  color: 'text-emerald-500',
                  bg: 'bg-emerald-50',
                  border: 'border-emerald-100'
                }].
                map((card, i) =>
                  <motion.div
                    key={i}
                    variants={fadeInUp}
                    className="bg-slate-50/80 border border-slate-200/60 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center text-center gap-4 hover:bg-white hover:shadow-lg transition-all">

                    <div
                      className={`w-12 h-12 rounded-full ${card.bg} ${card.border} border flex items-center justify-center ${card.color}`}>

                      <card.icon size={24} />
                    </div>
                    <h4 className="font-semibold text-slate-800">{card.title}</h4>
                  </motion.div>
                )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-20 bg-pink-50/60 border-y border-pink-200/30 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true
            }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-pink-200/40">

            {[
              {
                value: '10K+',
                label: 'Connections Made'
              },
              {
                value: '50+',
                label: 'Neighborhoods Active'
              },
              {
                value: '100%',
                label: 'Anonymous & Secure'
              }].
              map((stat, i) =>
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="flex flex-col items-center justify-center py-6 md:py-0">

                  <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2 font-mono">
                    {stat.value}
                  </div>
                  <div className="text-pink-500 font-medium tracking-wide uppercase text-sm">
                    {stat.label}
                  </div>
                </motion.div>
              )}
          </motion.div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-32 px-4 bg-white relative z-10 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true
          }}
          variants={fadeInUp}
          className="max-w-3xl mx-auto flex flex-col items-center">

          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-slate-900">
            Ready to meet someone new?
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={onEnterApp}
              className="w-full sm:w-auto px-8 py-4 bg-[#D82B7D] hover:bg-[#C0266F] text-white rounded-xl font-semibold text-lg transition-all shadow-[0_0_30px_rgba(216,43,125,0.2)] hover:shadow-[0_0_40px_rgba(216,43,125,0.35)] flex items-center justify-center gap-2">

              <Sparkles size={20} />
              Start Discovering
            </button>
            <button className="w-full sm:w-auto px-8 py-4 text-slate-600 hover:text-slate-900 font-semibold text-lg transition-colors flex items-center justify-center gap-2">
              Learn more about safety
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>);

}