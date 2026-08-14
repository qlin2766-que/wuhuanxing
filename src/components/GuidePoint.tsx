import React from 'react';

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
  if (isSelected) {
    return (
      <img
        src="/src/assets/UI/指引点.png"
        alt="Guide Point"
        className={`${sizeClassName} object-contain pointer-events-none filter drop-shadow-[0_0_8px_rgba(255,255,255,0.9)] scale-90 transition-all duration-300 ${className}`}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      className={`${sizeClassName} object-contain pointer-events-none transition-all duration-300 ${className}`}
    >
      <source src="/src/assets/UI/指引点.webm" type="video/webm" />
    </video>
  );
};
