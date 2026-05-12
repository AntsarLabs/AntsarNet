import { motion } from 'framer-motion'
import {
  Shield,
  MessageCircle,
  Sparkles,
  EyeOff,
  Trash2,
  Ban,
  ChevronRight,
  Lock,
} from 'lucide-react'
import { Footer } from '@/components/Footer'
import { Link } from 'react-router-dom'

const FLOATING_EMOJIS = [
  {
    emoji: '🦊',
    top: '15%',
    left: '10%',
    delay: 0,
  },
  {
    emoji: '🦉',
    top: '25%',
    left: '85%',
    delay: 1,
  },
  {
    emoji: '🐯',
    top: '65%',
    left: '15%',
    delay: 2,
  },
  {
    emoji: '🐻',
    top: '75%',
    left: '80%',
    delay: 0.5,
  },
  {
    emoji: '🐬',
    top: '45%',
    left: '90%',
    delay: 1.5,
  },
  {
    emoji: '✨',
    top: '35%',
    left: '20%',
    delay: 2.5,
  },
]
const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
}
const staggerContainer = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}
export function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground font-sans overflow-x-hidden selection:bg-primary/30">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-32 px-4">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed z-0"
          style={{
            backgroundImage:
              'url("https://cdn.magicpatterns.com/uploads/buFFB14RxN7rp2dVxCiLRi/64b6005b9b1c73650c503c0f921982ab.2-1-super.1.jpg")',
          }}
        />
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] z-0" />

        {/* Floating Emojis */}
        {FLOATING_EMOJIS.map((item, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl md:text-5xl z-0 opacity-40 pointer-events-none"
            style={{
              top: item.top,
              left: item.left,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [-5, 5, -5],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: item.delay,
              ease: 'easeInOut',
            }}
          >
            {item.emoji}
          </motion.div>
        ))}

        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
          <motion.h1
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.1,
            }}
            className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight mb-6 flex flex-wrap justify-center items-baseline"
          >
            <span className="text-white">Antsar</span>
            <span
              className="text-pink-500 relative"
              style={{
                textShadow:
                  '0 0 40px rgba(236,72,153,0.5), 0 0 80px rgba(236,72,153,0.2)',
              }}
            >
              Net
            </span>
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.2,
            }}
            className="text-xl md:text-2xl text-slate-300 mb-4 max-w-2xl font-light leading-relaxed"
          >
            Privacy first and end-to-end encryption enabled social platform
          </motion.p>

          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.3,
            }}
            className="text-sm md:text-base text-slate-400 mb-12 max-w-lg"
          >
            Share thoughts, stories, questions, and feedback
            without revealing who you are
          </motion.p>

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.4,
            }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link
              to="/discover"
              className="w-full sm:w-auto px-10 py-4 bg-[#D82B7D] hover:bg-[#C0266F] text-white rounded-xl font-semibold text-lg transition-all shadow-[0_0_30px_rgba(216,43,125,0.3)] hover:shadow-[0_0_40px_rgba(216,43,125,0.5)] flex items-center justify-center gap-2"
            >
              <Sparkles size={20} />
              Start Exploring
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 1,
            duration: 1,
          }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400"
        >
          <span className="text-xs uppercase tracking-widest font-semibold">
            Scroll
          </span>
          <motion.div
            animate={{
              y: [0, 8, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-5 h-8 border-2 border-white/20 rounded-full flex justify-center pt-1.5"
          >
            <div className="w-1 h-1.5 bg-white/40 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 md:py-32 px-4 bg-background relative z-10 dot-grid opacity-60">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              margin: '-100px',
            }}
            variants={fadeInUp}
            className="text-center mb-16 md:mb-24"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
              Designed for <span className="text-primary">Privacy</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We built AntsarNet from the ground up to protect your identity while enabling honest, authentic communication.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              margin: '-100px',
            }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
          >
            {[
              {
                icon: Sparkles,
                title: 'Anonymous Posts',
                desc: 'Share confessions, vents, questions, or advice. Add tags, react with emojis, and comment anonymously.',
              },
              {
                icon: MessageCircle,
                title: 'Private Chat',
                desc: 'Send chat requests, accept or decline, and have private one-on-one conversations.',
              },
              {
                icon: EyeOff,
                title: 'Anonymous Inbox',
                desc: 'Share your inbox link to receive anonymous messages. Mark as read, reply, or delete anytime.',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="bg-card border border-border rounded-3xl p-8 hover:shadow-xl hover:shadow-primary/5 transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="py-24 md:py-32 px-4 bg-muted/30 border-y border-border relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              margin: '-100px',
            }}
            variants={fadeInUp}
            className="text-center mb-16 md:mb-24"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
              Real Scenarios
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              See how AntsarNet solves real privacy problems.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              margin: '-100px',
            }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Use Case 1: Content Creator Inbox */}
            <motion.div
              variants={fadeInUp}
              className="bg-card border border-border rounded-3xl p-8 hover:shadow-xl hover:shadow-primary/5 transition-all group"
            >
              {/* <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 transition-transform">
                <EyeOff size={28} />
              </div> */}
              <h3 className="text-xl font-bold mb-3 text-foreground">
                Content Creator Inbox
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Like <a href="https://www.youtube.com/@leyuandmahi" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-600 font-medium">Leyu & Mahi</a> who receive anonymous stories for their YouTube channel. Senders can share stories without being traced through Instagram or creating fake accounts.
              </p>
              <div className="bg-muted/50 rounded-xl p-4 text-sm">
                <p className="text-muted-foreground">
                  <span className="text-primary font-semibold">Problem:</span> Social media accounts are monitored. Creating fake accounts is still traceable.
                </p>
                <p className="text-muted-foreground mt-2">
                  <span className="text-primary font-semibold">Solution:</span> Share an anonymous inbox link. Zero identity exposure.
                </p>
              </div>
            </motion.div>

            {/* Use Case 2: Anonymous Posts */}
            <motion.div
              variants={fadeInUp}
              className="bg-card border border-border rounded-3xl p-8 hover:shadow-xl hover:shadow-primary/5 transition-all group"
            >
              {/* <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                <Sparkles size={28} />
              </div> */}
              <h3 className="text-xl font-bold mb-3 text-foreground">
                Secret Sharing & Advice
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Share secrets, seek advice, or help others — without the tracking found in confession and anonymous bots on Telegram. Unlike those bots linked to accounts, your posts can't be traced even if databases are compromised.
              </p>
              <div className="bg-muted/50 rounded-xl p-4 text-sm">
                <p className="text-muted-foreground">
                  <span className="text-primary font-semibold">Problem:</span> Confession and anonymous bots on Telegram claim anonymity but link to your account. Database breaches expose identities.
                </p>
                <p className="text-muted-foreground mt-2">
                  <span className="text-primary font-semibold">Solution:</span> Cryptographic identity protection. No account linkage.
                </p>
              </div>
            </motion.div>

            {/* Use Case 3: Encrypted Chat */}
            <motion.div
              variants={fadeInUp}
              className="bg-card border border-border rounded-3xl p-8 hover:shadow-xl hover:shadow-primary/5 transition-all group"
            >
              {/* <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 mb-6 group-hover:scale-110 transition-transform">
                <MessageCircle size={28} />
              </div> */}
              <h3 className="text-xl font-bold mb-3 text-foreground">
                Encrypted Connections
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Find gaming partners, make friends, or follow up on posts. End-to-end encrypted with 24-hour auto-delete — unlike Ethiopian anonymous apps that link to confession and anonymous channels on Telegram.
              </p>
              <div className="bg-muted/50 rounded-xl p-4 text-sm">
                <p className="text-muted-foreground">
                  <span className="text-primary font-semibold">Problem:</span> Ethiopian anonymous apps link to confession and anonymous channels on Telegram. No encryption. Messages persist forever.
                </p>
                <p className="text-muted-foreground mt-2">
                  <span className="text-primary font-semibold">Solution:</span> E2E encryption + auto-delete. Zero Telegram linkage.
                </p>
              </div>
            </motion.div>

            {/* Use Case 4: Honest Feedback */}
            <motion.div
              variants={fadeInUp}
              className="bg-card border border-border rounded-3xl p-8 hover:shadow-xl hover:shadow-primary/5 transition-all group"
            >
              {/* <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform">
                <EyeOff size={28} />
              </div> */}
              <h3 className="text-xl font-bold mb-3 text-foreground">
                Honest Product Feedback
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Share your anonymous inbox link when launching products or work. People act nice to your face but won't give honest criticism. Let them send real feedback privately without public visibility.
              </p>
              <div className="bg-muted/50 rounded-xl p-4 text-sm">
                <p className="text-muted-foreground">
                  <span className="text-primary font-semibold">Problem:</span> People don't give honest feedback face-to-face. They avoid public comment sections to stay anonymous.
                </p>
                <p className="text-muted-foreground mt-2">
                  <span className="text-primary font-semibold">Solution:</span> Share your anonymous inbox link. Receive honest feedback privately.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SAFETY & TRUST */}
      <section className="py-24 md:py-32 px-4 bg-background relative z-10 dot-grid opacity-60">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                margin: '-100px',
              }}
              variants={fadeInUp}
              className="flex-1 space-y-6"
            >
              <h2 className="text-3xl md:text-5xl font-bold leading-tight text-foreground">
                Your Safety, <br />
                <span className="text-primary">Our Priority</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Anonymous platforms require strong moderation. We've built protections to ensure quality while preserving your privacy.
              </p>
              <ul className="space-y-4 pt-4">
                {[
                  'Block users and report inappropriate content',
                  'Delete chats and posts at any time',
                  'Control who can message you',
                  'End-to-end encrypted private conversations',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-foreground/80">
                    <div className="mt-1 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                margin: '-100px',
              }}
              variants={staggerContainer}
              className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
            >
              {[
                {
                  icon: Ban,
                  title: 'Block Users',
                  color: 'text-red-400',
                  bg: 'bg-red-400/10',
                  border: 'border-red-400/20',
                },
                {
                  icon: Trash2,
                  title: 'Delete Content',
                  color: 'text-amber-400',
                  bg: 'bg-amber-400/10',
                  border: 'border-amber-400/20',
                },
                {
                  icon: Lock,
                  title: 'Encrypted Chats',
                  color: 'text-blue-400',
                  bg: 'bg-blue-400/10',
                  border: 'border-blue-400/20',
                },
                {
                  icon: EyeOff,
                  title: 'Anonymous',
                  color: 'text-emerald-400',
                  bg: 'bg-emerald-400/10',
                  border: 'border-emerald-400/20',
                },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center text-center gap-4 hover:shadow-lg transition-all"
                >
                  <div
                    className={`w-12 h-12 rounded-full ${card.bg} ${card.border} border flex items-center justify-center ${card.color}`}
                  >
                    <card.icon size={24} />
                  </div>
                  <h4 className="font-semibold text-foreground">{card.title}</h4>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed z-0"
          style={{
            backgroundImage:
              'url("https://cdn.magicpatterns.com/uploads/buFFB14RxN7rp2dVxCiLRi/64b6005b9b1c73650c503c0f921982ab.2-1-super.1.jpg")',
          }}
        />
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] z-0" />

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
            }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10"
          >
            {[
              {
                value: 'Zero',
                label: 'Identity Exposure',
              },
              {
                value: 'End-to-End',
                label: 'Encrypted',
              },
              {
                value: '100%',
                label: 'Anonymous',
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="flex flex-col items-center justify-center py-8 md:py-0"
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 font-mono tracking-tight">
                  {stat.value}
                </div>
                <div className="text-pink-400 font-semibold tracking-widest uppercase text-xs">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-24 md:py-32 px-4 bg-background relative z-10 dot-grid opacity-60 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
          }}
          variants={fadeInUp}
          className="max-w-3xl mx-auto flex flex-col items-center"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-foreground">
            Ready to share your thoughts?
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              to="/discover"
              className="w-full sm:w-auto px-8 py-4 bg-primary hover:opacity-90 text-white rounded-xl font-semibold text-lg transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              <Sparkles size={20} />
              Start Discovering
            </Link>
            <Link to="/privacy-policy"
              className="w-full sm:w-auto px-8 py-4 text-muted-foreground hover:text-foreground font-semibold text-lg transition-colors flex items-center justify-center gap-2">
              Learn more about safety
              <ChevronRight size={18} />
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}