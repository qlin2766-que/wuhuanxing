import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { audioManager } from '../utils/audio';
import { assets } from '../utils/assets';

interface SceneMenuProps {
  onStart: () => void;
  isEnglish: boolean;
}

export const SceneMenu: React.FC<SceneMenuProps> = ({ onStart, isEnglish }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const [isStartHovered, setIsStartHovered] = useState(false);
  const [isFalling, setIsFalling] = useState(false);

  // Let's create falling leaves state for dynamic falling leaf animation
  const [leaves, setLeaves] = useState<Array<{
    id: number;
    x: number; // percentage (0 - 100)
    y: number; // percentage (-20 to 110)
    speedY: number;
    speedX: number;
    swayOffset: number;
    swaySpeed: number;
    rotation: number;
    rotateSpeed: number;
    scale: number;
    imgFailed: boolean;
  }>>([]);

  // Initialize leaves - increased count to 10 for denser foliage
  useEffect(() => {
    const initialLeaves = Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      x: Math.random() * 110 - 5,
      y: Math.random() * 120 - 20,
      speedY: 0.03 + Math.random() * 0.05, // Slower fall speed
      speedX: 0.01 + Math.random() * 0.02, // Slower sway speed
      swayOffset: Math.random() * 100,
      swaySpeed: 0.0005 + Math.random() * 0.001,
      rotation: Math.random() * 360,
      rotateSpeed: (Math.random() - 0.5) * 0.7,
      scale: 0.8 + Math.random() * 1.0, // Larger leaf size scale
      imgFailed: false,
    }));
    setLeaves(initialLeaves);
  }, []);

  // Update position loop with mouse deflection physics
  useEffect(() => {
    let animId: number;
    const updateLeaves = () => {
      setLeaves((prevLeaves) =>
        prevLeaves.map((leaf) => {
          let nextY = leaf.y + leaf.speedY;
          let nextX = leaf.x + Math.sin(Date.now() * leaf.swaySpeed + leaf.swayOffset) * leaf.speedX;
          let nextRotation = leaf.rotation + leaf.rotateSpeed;

          // Mouse deflection mathematics (push leaf away when cursor is close)
          const mouse = mouseRef.current;
          const dx = nextX - mouse.x;
          const dy = nextY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const repelRadius = 8; // around 8% container width radius (smaller touch detection range)

          if (dist < repelRadius) {
            const force = (repelRadius - dist) / repelRadius;
            const dirX = dist > 0 ? dx / dist : (Math.random() - 0.5);
            const dirY = dist > 0 ? dy / dist : -1; // push upwards/outwards
            
            // Distort movement vectors based on cursor distance
            nextX += dirX * force * 2.5;
            nextY += dirY * force * 2.0;
            // Add extra whirl spin when brushed by mouse
            nextRotation += (dirX > 0 ? 1 : -1) * force * 6;
          }

          // Loop leaf back if it hits bottom or sides
          if (nextY > 110) {
            nextY = -20;
            nextX = Math.random() * 100;
          }
          if (nextX > 115) {
            nextX = -5;
          } else if (nextX < -15) {
            nextX = 105;
          }

          return {
            ...leaf,
            x: nextX,
            y: nextY,
            rotation: nextRotation,
          };
        })
      );
      animId = requestAnimationFrame(updateLeaves);
    };
    animId = requestAnimationFrame(updateLeaves);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pctX = ((e.clientX - rect.left) / rect.width) * 100;
    const pctY = ((e.clientY - rect.top) / rect.height) * 100;
    mouseRef.current = { x: pctX, y: pctY };
  };

  const handleMouseLeave = () => {
    mouseRef.current = { x: -1000, y: -1000 };
  };

  const handleStartJourney = () => {
    if (isFalling) return;
    audioManager.playUI1();
    setIsFalling(true);
    setTimeout(() => {
      onStart();
    }, 1500);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full min-h-screen bg-[#24292A] flex flex-col items-center justify-center relative overflow-hidden px-8 py-20 font-sans" 
      id="scene_menu"
      style={{ backgroundColor: '#24292A' }}
    >

      {/* ==================================================================== */}
      {/* NEW: BOTTOM STATIC BACKDROP IMAGE LAYER (首页底图.png) */}
      {/* ==================================================================== */}
      <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
        <img 
          src="/src/assets/images/首页底图.png" 
          alt="Home Bottom Map Backdrop"
          className="absolute left-0 inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* ==================================================================== */}
      {/* PLACEHOLDER: MAIN HOME BACKGROUND WEBM LAYER */}
      {/* ==================================================================== */}
      {assets.webm.homeBackground.enabled ? (
        <div 
          className="absolute left-0 inset-0 w-full h-full pointer-events-none z-[2] animate-fade-in overflow-hidden"
        >
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            preload="auto"
            className="absolute left-0 inset-0 w-full h-full object-cover"
            style={{ 
              opacity: 0.02,
              filter: 'blur(3.5px) contrast(0.78) brightness(1.04) saturate(0.85)'
            }}
          >
            <source src={assets.webm.homeBackground.src} type="video/webm" />
          </video>
        </div>
      ) : null}

      {/* ==================================================================== */}
      {/* CORES: HOME FOREGROUND WEBM SWAY DECORATIVE CANOPY OVERLAY (树冠) */}
      {/* ==================================================================== */}
      {assets.webm.homeForegroundWebm.enabled ? (
        <div className="absolute inset-0 pointer-events-none z-[3] overflow-hidden">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            preload="auto"
            className="absolute left-0 inset-0 w-full h-full object-cover opacity-99"
            style={{ 
              filter: 'blur(2.6px) contrast(0.95) brightness(0.98)'
            }}
          >
            <source src={assets.webm.homeForegroundWebm.src} type="video/webm" />
          </video>
        </div>
      ) : null}

      {/* ==================================================================== */}
      {/* UNBLURRED/SHARP SHORELINE / DETAIL WEBM FOREGROUND (NO BLUR EFFECT) */}
      {/* ==================================================================== */}
      {assets.webm.homeSharpForegroundWebm.enabled ? (
        <div 
          className="absolute left-0 inset-0 w-full h-full pointer-events-none z-[4] animate-fade-in overflow-hidden"
        >
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            preload="auto"
            className="absolute left-0 inset-0 w-full h-full object-cover opacity-0"
            style={{ 
              filter: 'blur(0px) contrast(1.5) brightness(0.98)'
            }}
          >
            <source src={assets.webm.homeSharpForegroundWebm.src} type="video/webm" />
          </video>
        </div>
      ) : null}

      {/* ==================================================================== */}
      {/* NEW: WINDOW OVERLAY FOREGROUND IMAGE LAYER (首页-窗.png) */}
      {/* ==================================================================== */}
      <div className="absolute inset-0 pointer-events-none z-[6] overflow-hidden">
        <img 
          src="/src/assets/images/首页-窗.png" 
          alt="Home Foreground Window"
          className="absolute left-0 inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* ==================================================================== */}
      {/* NEW: DYNAMIC DAISY FLOWER LAYER (雏菊-开.png / 雏菊-闭.png) */}
      {/* ==================================================================== */}
      <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden">
        <img 
          src={isStartHovered ? "/src/assets/images/雏菊-开.png" : "/src/assets/images/雏菊-闭.png"} 
          alt="Home Daisy State Flower"
          className="absolute left-0 inset-0 w-full h-full object-cover transition-all duration-300"
          style={{ transform: 'translateY(20px)' }}
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Summer memory glow refraction pass (soft bloom sky scatter) */}
      <div className="summer-bloom-bg" />



      {/* Dynamic Falling Leaves Animation Container */}
      <div className="absolute inset-0 pointer-events-none z-[7] overflow-hidden">
        {leaves.map((leaf) => (
          <div
            key={leaf.id}
            className="absolute transition-transform duration-75 ease-linear pointer-events-none"
            style={{
              left: `${leaf.x}%`,
              top: `${leaf.y}%`,
              transform: `rotate(${leaf.rotation}deg) scale(${leaf.scale})`,
              filter: leaf.scale > 1.65 
                ? 'blur(1.2px) contrast(0.95)' 
                : leaf.scale < 0.85 
                  ? 'blur(0.4px) opacity(0.7)' 
                  : 'none'
            }}
          >
            {/* Double Layer leaf structure: PNG over elegant SVG placeholder */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              {!leaf.imgFailed && assets.images.fallingLeafPlaceholder.enabled && (
                <img
                  src={assets.images.fallingLeafPlaceholder.src}
                  alt={assets.images.fallingLeafPlaceholder.alt}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-contain select-none"
                  onError={() => {
                    // Update state to render fallback vector if image file is empty or broken
                    setLeaves((prev) =>
                      prev.map((l) => (l.id === leaf.id ? { ...l, imgFailed: true } : l))
                    );
                  }}
                />
              )}

              {/* Poetic outline SVG leaf fallback - beautiful minimal aesthetic when PNG empty or if failed to load */}
              {(leaf.imgFailed || !assets.images.fallingLeafPlaceholder.enabled) && (
                <svg
                  viewBox="0 0 24 24"
                  className="w-8 h-8 stroke-white/50 fill-white/10 filter drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.1)]"
                >
                  <path d="M2,22 Q12,20 22,2 C12,4 4,12 2,22 Z" strokeWidth="1.2" />
                  <path d="M2,22 L15,10" strokeWidth="1" />
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Main Container - Lightweight, pure, transparent floating layered style */}
      <div className="text-center z-10 max-w-xl flex flex-col items-center justify-center space-y-7 select-none bg-transparent p-10 md:p-14 border-0 border-stone-250/70 backdrop-blur-none" id="menu_main_card">
        
        {/* Elegant curved SVG logo emblem instead of double hard boxes */}
        <div className="w-[140px] h-[140px] flex items-center justify-center animate-pulse soft-bloom-glow" style={{ marginBottom: '-20px' }}>
          {assets.images.homeTopEmblem.enabled ? (
            <img 
              src={assets.images.homeTopEmblem.src} 
              alt={assets.images.homeTopEmblem.alt}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain" 
              style={{ width: '140px', height: '140px' }}
            />
          ) : (
            <svg viewBox="0 0 40 40" className="w-full h-full stroke-stone-600 fill-none stroke-[0.8] drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
              {/* Delicate natural vector curved lines */}
              <path d="M 10,20 C 15,10 25,10 30,20 C 25,30 15,30 10,20 Z" />
              <path d="M 15,20 C 18,15 22,15 25,20 C 22,25 18,25 15,20 Z" className="fill-[#C7D4C9]/40" />
              <circle cx="20" cy="20" r="1.5" className="fill-stone-800" />
            </svg>
          )}
        </div>

        {/* Title */}
        <div className="flex flex-col items-center" style={{ marginTop: '-20px', gap: '10px' }}>
          {assets.images.homeTitleLogo.enabled ? (
            <img 
              src={assets.images.homeTitleLogo.src} 
              alt={assets.images.homeTitleLogo.alt}
              referrerPolicy="no-referrer"
              className="object-contain animate-fade-in filter drop-shadow-[0_0_12px_rgba(255,255,255,0.45)]" 
              style={{ height: '100px' }}
            />
          ) : (
            <h1 className="text-4xl md:text-5xl font-serif text-stone-900 tracking-[0.3em] font-light animate-fade-in py-1 subtle-chromatic-aberration" style={{ color: '#e1e1e1' }}>
              物换星
            </h1>
          )}
          <p className="text-[16px] font-mono text-stone-400 tracking-[0.2em] uppercase font-bold subtle-chromatic-aberration" style={{ color: '#cff1f6' }}>
            用时间去交换的旅程
          </p>
        </div>

        {/* Subtitle / Description of visual novel portfolio */}
        <div className="max-w-md bg-transparent p-1">
          <p className="text-xs md:text-sm text-stone-650 leading-relaxed font-serif" style={{ color: '#e8f2ff' }}>
            {isEnglish 
              ? 'An interactive portfolio website for authors, and also an experimental demo for the visual novel game "Wu Huan Star".'
              : '一部作者的交互作品集网页，同时也是视觉小说游戏《物换星》的实验性 Demo。'}
          </p>
        </div>

        {/* Start Button styled with custom button1.png and button1-hover.png UI frame */}
        <div className="pt-6 flex items-center justify-center">
          <div
            role="button"
            id="start_button"
            onClick={handleStartJourney}
            onMouseEnter={() => setIsStartHovered(true)}
            onMouseLeave={() => setIsStartHovered(false)}
            className="relative w-[126px] h-[44px] md:w-[138px] md:h-[48px] flex items-center justify-center cursor-pointer select-none transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            {/* Custom Button Background PNG (button1.png / button1-hover.png) */}
            <motion.img
              src={isStartHovered ? "/src/assets/UI/button1-hover.png" : "/src/assets/UI/button1.png"}
              alt="Start Button Frame"
              className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none filter drop-shadow-md"
              referrerPolicy="no-referrer"
              animate={{ 
                opacity: isFalling ? 0 : 1
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />

            {/* Text container directly centered on the button background */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center text-center pointer-events-none z-10"
              animate={{ 
                opacity: isFalling ? 0 : 1
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <span 
                className="text-white font-serif text-xs md:text-sm tracking-[0.25em] font-bold select-none pl-[0.25em] leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] whitespace-nowrap"
              >
                {isEnglish ? 'ENTER' : '启 程'}
              </span>
            </motion.div>

            {/* Leaf Image on left side, extending above top border of frame */}
            <motion.div
              className="absolute left-1.5 md:left-2 top-1/2 -translate-y-1/2 -mt-2.5 z-20 w-8 h-8 md:w-9 md:h-9 flex items-center justify-center shrink-0"
              animate={isFalling ? {
                y: [0, 45, 120, 210, 290],
                x: [0, -18, 22, -12, 10],
                rotate: [0, -15, 25, -20, 35],
                opacity: [1, 0.95, 0.85, 0.6, 0.2],
                scale: [1, 0.98, 0.95, 0.9, 0.85]
              } : {
                rotate: isStartHovered ? -15 : 0,
                scale: isStartHovered ? 1.12 : 1.0 
              }}
              transition={isFalling ? {
                duration: 3.2,
                times: [0, 0.25, 0.5, 0.75, 1],
                ease: "easeOut"
              } : {
                type: "spring",
                stiffness: 150,
                damping: 15
              }}
            >
              <img
                src="/src/assets/images/树叶0.png"
                alt="Leaf"
                className="w-full h-full object-contain pointer-events-none select-none filter drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </div>

        {/* Sound Note Tip with curved bracket text */}
        <p className="text-[9px] font-mono text-stone-400 uppercase tracking-widest" style={{ color: '#000000' }}>
          ~ {isEnglish ? 'Optimal experience with audio activated' : '建议开启声效，以获得沉静的探索体验'} ~
        </p>
      </div>

      {/* Decorative Margin Accents (Anti-AI-Slop Clean margins) */}
      <div className="absolute bottom-8 left-12 hidden md:block z-[30]">
        <span className="font-mono text-[11px] text-stone-400 tracking-wider font-bold subtle-chromatic-aberration" style={{ color: '#ffffff' }}>
          2023-2026
        </span>
      </div>
      <div className="absolute bottom-8 right-12 hidden md:block z-[30]">
        <span className="font-mono text-[11px] text-stone-400 tracking-wider uppercase font-bold subtle-chromatic-aberration" style={{ color: '#ffffff' }}>
          {isEnglish ? 'QLin Personal Portfolio' : 'QLin Personal Portfolio'}
        </span>
      </div>
    </div>
  );
};
