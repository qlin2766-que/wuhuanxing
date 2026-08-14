import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audioManager } from '../utils/audio';

interface SceneTVChannelTransitionProps {
  isEnglish: boolean;
  onComplete: () => void;
}

export const SceneTVChannelTransition: React.FC<SceneTVChannelTransitionProps> = ({ isEnglish, onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [typedText, setTypedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isFlickering, setIsFlickering] = useState(false);

  const rawText1Cn = "正在寻找一个合适的频道……";
  const rawText1En = "Searching for a suitable channel...";

  const rawText2Cn = "请稍等片刻。";
  const rawText2En = "Please wait a moment.";

  const rawText3Cn = "有个故事正在接入...";
  const rawText3En = "A story is connecting...";

  const getCurrentRawText = (s: 1 | 2 | 3) => {
    if (s === 1) return isEnglish ? rawText1En : rawText1Cn;
    if (s === 2) return isEnglish ? rawText2En : rawText2Cn;
    return isEnglish ? rawText3En : rawText3Cn;
  };

  const currentRawText = getCurrentRawText(step);

  // CRT TV sound loop effect during TV channel transition screen
  useEffect(() => {
    audioManager.startCrtTvLoop();
    return () => {
      audioManager.stopCrtTvLoop();
    };
  }, []);

  // Typewriter effect hook
  useEffect(() => {
    setIsTypingComplete(false);
    setTypedText('');
    let currentText = '';
    let idx = 0;
    const targetText = currentRawText;
    const typingSpeed = isEnglish ? 22 : 45;

    const timer = setInterval(() => {
      if (idx < targetText.length) {
        currentText += targetText.charAt(idx);
        setTypedText(currentText);

        // Retro subtle CRT tuning sound
        if (idx % 2 === 0) {
          audioManager.playTone(480 + Math.random() * 120, 'sine', 0.03, 0.005);
        }
        idx++;
      } else {
        clearInterval(timer);
        setIsTypingComplete(true);
      }
    }, typingSpeed);

    return () => clearInterval(timer);
  }, [step, isEnglish, currentRawText]);

  const triggerChannelChangeGlitch = () => {
    setIsFlickering(true);
    audioManager.playTone(180, 'square', 0.08, 0.02);
    setTimeout(() => {
      setIsFlickering(false);
    }, 180);
  };

  const handleContainerClick = () => {
    if (!isTypingComplete) {
      // Complete typing immediately
      setTypedText(currentRawText);
      setIsTypingComplete(true);
      audioManager.playClick();
      return;
    }

    if (step === 1) {
      triggerChannelChangeGlitch();
      setStep(2);
    } else if (step === 2) {
      triggerChannelChangeGlitch();
      setStep(3);
    } else {
      triggerChannelChangeGlitch();
      audioManager.stopCrtTvLoop();
      audioManager.playDeepChime();
      onComplete();
    }
  };

  return (
    <div
      onClick={handleContainerClick}
      className="w-full min-h-screen bg-[#13171a] text-stone-100 flex flex-col items-center justify-center relative overflow-hidden px-8 py-20 cursor-pointer select-none font-serif"
      id="scene_tv_channel_transition"
    >
      {/* CRT Screen Edge Shadow / Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.85)_100%)] pointer-events-none z-10" />

      {/* CRT Scanline Overlay Effect */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.35) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.04), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.04))',
          backgroundSize: '100% 4px, 6px 100%'
        }}
      />

      {/* TV Screen Channel Switch Static/Flicker Overlay */}
      <AnimatePresence>
        {isFlickering && (
          <motion.div
            initial={{ opacity: 0.8 }}
            animate={{ opacity: [0.8, 0.2, 0.9, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 bg-stone-300/20 mix-blend-difference pointer-events-none z-30"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 3px)'
            }}
          />
        )}
      </AnimatePresence>

      {/* Outer retro television border frame */}
      <div className="absolute inset-4 sm:inset-6 md:inset-10 border border-stone-800/80 rounded-lg pointer-events-none z-10 shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]" />

      {/* Retro CRT OSD Header - Left */}
      <div className="absolute top-8 sm:top-12 left-8 sm:left-14 font-mono text-[9px] sm:text-[10px] text-emerald-400/80 tracking-[0.25em] select-none leading-none z-20 flex items-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>CH 02 // {isEnglish ? 'SEARCHING CHANNEL' : '频道搜索中'}</span>
      </div>

      {/* Retro CRT OSD Header - Right */}
      <div className="absolute top-8 sm:top-12 right-8 sm:right-14 font-mono text-[9px] sm:text-[10px] text-amber-300/70 tracking-[0.25em] select-none leading-none z-20">
        AV-1 [AUTO] · PAGE 0{step}/03
      </div>

      {/* Main CRT Text Box Display */}
      <div className="max-w-xl md:max-w-2xl w-full flex flex-col items-center text-center px-4 z-20 my-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.02, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center text-center min-h-[140px]"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl text-stone-100 font-bold tracking-wider leading-relaxed filter drop-shadow-[0_0_12px_rgba(255,255,255,0.25)] px-4">
              {typedText}
              <span className="inline-block w-2.5 sm:w-3 h-5 sm:h-6 ml-1.5 bg-emerald-400 animate-pulse align-middle" />
            </h2>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom prompt */}
      <div className="absolute bottom-10 sm:bottom-12 left-1/2 -translate-x-1/2 z-20 font-mono text-[9px] tracking-[0.3em] font-bold text-stone-400/80 uppercase flex flex-col items-center space-y-1.5 select-none text-center">
        <AnimatePresence>
          {isTypingComplete ? (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="flex items-center space-x-2 text-stone-300"
            >
              <span>{isEnglish ? 'CLICK ANYWHERE TO CONTINUE' : '点击任意位置继续'}</span>
              <span className="animate-bounce text-emerald-400">↓</span>
            </motion.div>
          ) : (
            <div className="opacity-40 italic text-stone-500">
              {isEnglish ? 'TUNING SIGNAL...' : '信号接入中...'}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom left retro metadata label */}
      <div className="absolute bottom-8 left-12 hidden md:block z-20">
        <span className="font-mono text-[9px] text-stone-500/80 tracking-wider font-bold uppercase">
          {isEnglish ? 'ANALOG SIGNAL BROADCAST' : '模拟信号接入 // TV-02'}
        </span>
      </div>
    </div>
  );
};
