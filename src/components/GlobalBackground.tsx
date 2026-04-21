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
      {/* Base Dark Color */}
      <div className="absolute inset-0 bg-slate-950" />
      
      {/* Background Image with Fixed Attachment */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed opacity-100"
        style={{
          backgroundImage: 'url("https://cdn.magicpatterns.com/uploads/buFFB14RxN7rp2dVxCiLRi/64b6005b9b1c73650c503c0f921982ab.2-1-super.1.jpg")',
        }}
      />
      
      {/* Overlay for Contrast and Blur */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]" />
      
      {/* Decorative Gradients for depth */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-slate-950/40 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-slate-950/80 to-transparent" />
      </div>

      {/* Floating Emojis if requested */}
      {showFloatingEmojis && FLOATING_EMOJIS.map((item, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl md:text-5xl opacity-30 pointer-events-none z-10"
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
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
      />
    </div>
  );
};
