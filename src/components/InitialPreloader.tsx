import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { assetPreloader, PreloadProgress } from '../utils/preloader';

interface InitialPreloaderProps {
  onComplete: () => void;
  isEnglish?: boolean;
}

export const InitialPreloader: React.FC<InitialPreloaderProps> = ({ onComplete, isEnglish = false }) => {
  const [progress, setProgress] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [currentAsset, setCurrentAsset] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    assetPreloader.startPreload((p: PreloadProgress) => {
      if (!isMounted) return;
      setProgress(p.percentage);
      setCurrentAsset(p.currentAsset);

      if (p.isComplete) {
        setTimeout(() => {
          if (!isMounted) return;
          setIsFinished(true);
          setTimeout(() => {
            if (isMounted) onComplete();
          }, 600); // Smooth fade-out duration
        }, 400);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] bg-[#24292A] flex flex-col items-center justify-center p-8 select-none font-serif text-stone-200"
          id="initial_preloader_screen"
        >
          {/* Top Emblem Logo with subtle pulse */}
          <div className="w-[120px] h-[120px] mb-6 flex items-center justify-center relative">
            <motion.img 
              src="/src/assets/images/logo4.png" 
              alt="Wuhuanxing Logo Emblem"
              className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]"
              animate={{ opacity: [0.65, 1, 0.65], scale: [0.98, 1.02, 0.98] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-serif text-[#e1e1e1] tracking-[0.3em] font-light mb-2">
              物换星
            </h1>
            <p className="text-xs font-mono text-[#cff1f6]/80 tracking-[0.2em] uppercase font-bold">
              {isEnglish ? 'LOADING NARRATIVE EXPERIENCE' : '正在初始化探索之旅'}
            </p>
          </div>

          {/* Progress Container */}
          <div className="w-64 md:w-80 flex flex-col items-center">
            {/* Percentage Indicator */}
            <div className="w-full flex justify-between items-center mb-2 font-mono text-xs text-stone-400 font-bold tracking-widest">
              <span>{isEnglish ? 'PROGRESS' : '加载进度'}</span>
              <span className="text-[#3dd3c4] font-mono text-sm">{progress}%</span>
            </div>

            {/* Progress Bar Track */}
            <div className="w-full h-[3px] bg-stone-800 rounded-full overflow-hidden relative border border-stone-700/50">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#32c0b9] via-[#3dd3c4] to-[#7be2d1] rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              />
            </div>

            {/* Current Asset Loading Path Info */}
            <div className="mt-4 h-5 overflow-hidden text-center w-full">
              <p className="text-[10px] font-mono text-stone-500 truncate tracking-wide">
                {currentAsset ? `Preloading: ${currentAsset.split('/').pop()}` : (isEnglish ? 'Preparing assets...' : '准备核心资源...')}
              </p>
            </div>
          </div>

          {/* Footer Aesthetic Tip */}
          <div className="absolute bottom-10 text-center">
            <p className="text-[10px] font-mono text-stone-500 tracking-widest uppercase">
              ~ {isEnglish ? 'Synchronizing media & interactive modules' : '正在载入高清素材与声效库'} ~
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
