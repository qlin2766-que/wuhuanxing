import React from 'react';
import { motion } from 'motion/react';

interface GuidePointProps {
  isSelected?: boolean;
  className?: string;
  sizeClassName?: string;
}

export const GuidePoint: React.FC<GuidePointProps> = ({ 
  isSelected = false, 
  className = "",
  sizeClassName = "w-10 h-10 md:w-12 md:h-12"
}) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer Breathing & Rotating White Ring Container */}
      <motion.div
        animate={{
          scale: isSelected ? [0.82, 0.90, 0.82] : [0.58, 0.78, 0.58],
          opacity: isSelected ? [0.4, 0.5, 0.4] : [0.85, 0.45, 0.85]
        }}
        transition={{
          repeat: Infinity,
          duration: 2.4,
          ease: "easeInOut"
        }}
        className="absolute -inset-2.5 md:-inset-3 pointer-events-none flex items-center justify-center"
      >
        {/* Soft Contrast Backdrop Ring for readability on light/dark backgrounds */}
        <div className="absolute inset-0 rounded-full border border-black/15 shadow-[0_0_12px_rgba(0,0,0,0.15)]" />

        {/* Primary Rotating Segmented White Ring */}
        <motion.svg
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 9,
            ease: "linear"
          }}
          className="w-full h-full text-white drop-shadow-[0_0_3px_rgba(0,0,0,0.4)]"
          viewBox="0 0 100 100"
        >
          {/* Dashed outer ring */}
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeDasharray="14 10"
            strokeLinecap="round"
            className="opacity-90"
          />
          {/* Cardinal accent nodes */}
          <circle cx="50" cy="6" r="2" fill="white" className="drop-shadow-[0_0_2px_rgba(0,0,0,0.5)]" />
          <circle cx="94" cy="50" r="2" fill="white" className="drop-shadow-[0_0_2px_rgba(0,0,0,0.5)]" />
          <circle cx="50" cy="94" r="2" fill="white" className="drop-shadow-[0_0_2px_rgba(0,0,0,0.5)]" />
          <circle cx="6" cy="50" r="2" fill="white" className="drop-shadow-[0_0_2px_rgba(0,0,0,0.5)]" />
        </motion.svg>

        {/* Subtle Counter-rotating Fine Inner Ring */}
        <motion.svg
          animate={{ rotate: -360 }}
          transition={{
            repeat: Infinity,
            duration: 14,
            ease: "linear"
          }}
          className="absolute inset-1 w-[calc(100%-8px)] h-[calc(100%-8px)] text-white/60 drop-shadow-[0_0_2px_rgba(0,0,0,0.3)]"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 8"
          />
        </motion.svg>
      </motion.div>

      {/* Center Core Guide Point Media */}
      {isSelected ? (
        <img
          src="/src/assets/UI/指引点.png"
          alt="Guide Point"
          className={`${sizeClassName} relative z-10 object-contain pointer-events-none filter drop-shadow-[0_0_8px_rgba(255,255,255,0.9)] scale-90 transition-all duration-300`}
          referrerPolicy="no-referrer"
        />
      ) : (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className={`${sizeClassName} relative z-10 object-contain pointer-events-none transition-all duration-300`}
        >
          <source src="/src/assets/UI/指引点.webm" type="video/webm" />
        </video>
      )}
    </div>
  );
};
