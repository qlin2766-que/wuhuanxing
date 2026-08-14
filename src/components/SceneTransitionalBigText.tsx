import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audioManager } from '../utils/audio';

export interface BigTextSlide {
  textCn: string;
  textEn: string;
  subTextCn?: string;
  subTextEn?: string;
}

interface SceneTransitionalBigTextProps {
  isEnglish: boolean;
  onComplete: () => void;
  chapterLabelCn?: string;
  chapterLabelEn?: string;
  slides?: BigTextSlide[];
  theme?: 'light' | 'dark';
}

export const SceneTransitionalBigText: React.FC<SceneTransitionalBigTextProps> = ({ 
  isEnglish, 
  onComplete,
  chapterLabelCn = '序章',
  chapterLabelEn = 'CHAPTER / PROLOGUE',
  slides,
  theme = 'light'
}) => {
  const defaultSlides: BigTextSlide[] = [
    {
      textCn: "你好，很高兴在这里见到你",
      textEn: "Hello, I am glad to meet you here."
    },
    {
      textCn: "在这里，你可以得到一段短暂而特别的旅程。",
      textEn: "Here, you can embark on a brief and special journey.",
      subTextCn: "首先让我来呈现我的创作与作品。",
      subTextEn: "First, let me present my creations and works."
    }
  ];

  const activeSlides = slides || defaultSlides;
  const [slideIndex, setSlideIndex] = useState<number>(0);
  const [subStep, setSubStep] = useState<number>(1); // 1 = main text, 2 = sub text (if any)
  const [typedMainText, setTypedMainText] = useState('');
  const [typedSubText, setTypedSubText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const currentSlide = activeSlides[slideIndex] || activeSlides[0];
  const hasSubText = !!(currentSlide.subTextCn || currentSlide.subTextEn);
  const currentTargetText = subStep === 1 
    ? (isEnglish ? currentSlide.textEn : currentSlide.textCn)
    : (isEnglish ? (currentSlide.subTextEn || '') : (currentSlide.subTextCn || ''));

  const isDark = theme === 'dark';

  // Typewriting core hook
  useEffect(() => {
    setIsTypingComplete(false);
    let currentText = '';
    let idx = 0;
    const targetText = currentTargetText;

    if (subStep === 1) setTypedMainText('');
    else setTypedSubText('');

    // Select typewriter speed based on language density
    const typingSpeed = isEnglish ? 18 : 36;

    const timer = setInterval(() => {
      if (idx < targetText.length) {
        currentText += targetText.charAt(idx);
        if (subStep === 1) {
          setTypedMainText(currentText);
        } else {
          setTypedSubText(currentText);
        }
        
        // Crisp aesthetic mechanical keyboard tactile clicks
        if (idx % 2 === 0) {
          audioManager.playTone(isDark ? 480 + Math.random() * 120 : 650 + Math.random() * 150, 'sine', 0.04, 0.005);
        }
        idx++;
      } else {
        clearInterval(timer);
        setIsTypingComplete(true);
      }
    }, typingSpeed);

    return () => clearInterval(timer);
  }, [slideIndex, subStep, isEnglish, currentTargetText, isDark]);

  const handleContainerClick = () => {
    if (!isTypingComplete) {
      // Skip typewriting immediately to full text
      if (subStep === 1) {
        setTypedMainText(isEnglish ? currentSlide.textEn : currentSlide.textCn);
      } else {
        setTypedSubText(isEnglish ? (currentSlide.subTextEn || '') : (currentSlide.subTextCn || ''));
      }
      setIsTypingComplete(true);
      audioManager.playClick();
      return;
    }

    if (hasSubText && subStep === 1) {
      audioManager.playDeepChime();
      setSubStep(2);
      return;
    }

    if (slideIndex < activeSlides.length - 1) {
      audioManager.playDeepChime();
      setSlideIndex(prev => prev + 1);
      setSubStep(1);
    } else {
      audioManager.playChime();
      onComplete();
    }
  };

  return (
    <div 
      onClick={handleContainerClick}
      className={`w-full min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-8 py-20 cursor-pointer select-none transition-colors duration-500 ${
        isDark ? 'bg-black text-[#effffb]' : 'bg-[#effffb] text-[#1c2422]'
      }`}
      id="scene_transition_text"
      style={{ backgroundColor: isDark ? '#000000' : '#effffb' }}
    >
      {/* Decorative architectural borders for neo-brutalist paper feel */}
      <div className={`absolute inset-4 border border-dashed pointer-events-none z-10 ${
        isDark ? 'border-stone-800' : 'border-stone-300'
      }`} />
      
      {/* Subtle top branding coordinate to echo the artwork style */}
      <div className={`absolute top-10 left-12 font-mono text-[9px] opacity-70 tracking-[0.25em] select-none leading-none z-20 ${
        isDark ? 'text-stone-400' : 'text-[#3a4c48]'
      }`}>
        {isEnglish ? chapterLabelEn : chapterLabelCn}
      </div>

      <div className={`absolute top-10 right-12 font-mono text-[9px] opacity-70 tracking-[0.25em] select-none leading-none z-20 ${
        isDark ? 'text-stone-400' : 'text-[#3a4c48]'
      }`}>
        PAGE 0{slideIndex + 1} / 0{activeSlides.length}
      </div>

      {/* Main typewriter text container */}
      <div className="max-w-xl md:max-w-2xl w-full flex flex-col items-center text-center px-4 z-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${slideIndex}_${subStep}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center min-h-[180px] justify-center text-center space-y-6"
          >
            <h1 className={`font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-wide leading-relaxed px-2 ${
              isDark 
                ? 'text-[#effffb] filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]' 
                : 'text-[#1c2422] filter drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]'
            }`}>
              {typedMainText}
              {subStep === 1 && (
                <span className={`inline-block w-2.5 h-6 ml-1 animate-pulse align-middle ${
                  isDark ? 'bg-teal-300' : 'bg-[#3a4c48]'
                }`} />
              )}
            </h1>

            {(subStep === 2 || typedSubText.length > 0) && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`font-serif text-lg sm:text-xl md:text-2xl font-medium tracking-wide leading-loose px-2 ${
                  isDark ? 'text-stone-300' : 'text-[#3a4c48]'
                }`}
              >
                {typedSubText}
                {subStep === 2 && (
                  <span className={`inline-block w-2.5 h-6 ml-1 animate-pulse align-middle ${
                    isDark ? 'bg-teal-300' : 'bg-[#3a4c48]'
                  }`} />
                )}
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* "Click anywhere to continue" floating prompt */}
      <div className={`absolute bottom-12 left-1/2 -translate-x-1/2 z-20 font-mono text-[9px] tracking-[0.3em] font-black uppercase flex flex-col items-center space-y-1.5 select-none text-center ${
        isDark ? 'text-stone-300/80' : 'text-[#3a4c48]/70'
      }`}>
        <AnimatePresence>
          {isTypingComplete ? (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 2.0, ease: "easeInOut" }}
              className={`flex items-center space-x-2 ${isDark ? 'text-teal-300' : 'text-[#3a4c48]'}`}
            >
              <span>{isEnglish ? 'CLICK ANYWHERE TO CONTINUE' : '点击任意位置继续'}</span>
              <span className="animate-bounce">↓</span>
            </motion.div>
          ) : (
            <div className={`opacity-40 italic ${isDark ? 'text-stone-400' : 'text-[#3a4c48]/50'}`}>
              {isEnglish ? 'TYPING...' : '加载中...'}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative margins lines */}
      <div className="absolute bottom-8 left-12 hidden md:block z-20">
        <span className={`font-mono text-[9px] tracking-wider font-bold uppercase ${
          isDark ? 'text-stone-400' : 'text-[#3a4c48]/70'
        }`}>
          {isEnglish ? chapterLabelEn : chapterLabelCn}
        </span>
      </div>
    </div>
  );
};
