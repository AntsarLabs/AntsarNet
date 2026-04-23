import React from 'react';
import { motion } from 'framer-motion';

interface GlobalBackgroundProps {
  showFloatingEmojis?: boolean;
}

const FLOATING_EMOJIS = [
  { emoji: '🦊', top: '15%', left: '10%', delay: 0 },
  { emoji: '🦉', top: '25%', left: '85%', delay: 1 },
  { emoji: '🐯', top: '65%', left: '15%', delay: 2 },
  { emoji: '🐻', top: '75%', left: '80%', delay: 0.5 },
  { emoji: '🐬', top: '45%', left: '90%', delay: 1.5 },
  { emoji: '✨', top: '35%', left: '20%', delay: 2.5 },
];

export const GlobalBackground: React.FC<GlobalBackgroundProps> = ({ showFloatingEmojis = false }) => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Base Warm Light Color */}
      <div className="absolute inset-0 bg-[#FAF8F5]" />

      {/* Soft Gradient Mesh */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[60%] h-[50%] bg-gradient-to-br from-pink-100/40 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[50%] h-[40%] bg-gradient-to-tl from-rose-50/50 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[30%] h-[30%] bg-gradient-to-b from-amber-50/30 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      {/* Floating Emojis if requested */}
      {showFloatingEmojis && FLOATING_EMOJIS.map((item, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl md:text-5xl opacity-15 pointer-events-none z-10"
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
            ease: "easeInOut",
          }}
        >
          {item.emoji}
        </motion.div>
      ))}

      {/* Subtle Grain Overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] mix-blend-multiply"
        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
      />
    </div>
  );
};
