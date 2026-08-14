import React, { useState, useEffect, useRef } from 'react';
import { DialogueLine } from '../data/dialogue';
import { audioManager } from '../utils/audio';

interface NovelFrameProps {
  lines: DialogueLine[];
  onSceneComplete: () => void;
  isEnglish: boolean;
  onNextChapter?: () => void;
  isCentered?: boolean;
  onLineChange?: (lineIndex: number, currentLine: DialogueLine) => void;
  isDark?: boolean;
}

export const NovelFrame: React.FC<NovelFrameProps> = ({
  lines,
  onSceneComplete,
  isEnglish,
  onNextChapter,
  isCentered = false,
  onLineChange,
  isDark = false
}) => {
  const [lineIndex, setLineIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const lastClickTimeRef = useRef<number>(0);

  const currentLine = lines[lineIndex];
  const hasChoices = Boolean(currentLine?.choices && currentLine.choices.length > 0);

  // Notify parent component when active dialogue line changes
  useEffect(() => {
    if (currentLine) {
      onLineChange?.(lineIndex, currentLine);
    }
  }, [lineIndex, currentLine, onLineChange]);

  const handleNext = () => {
    if (!currentLine) return;

    // Prevent double invocation within 180ms
    const now = Date.now();
    if (now - lastClickTimeRef.current < 180) {
      return;
    }
    lastClickTimeRef.current = now;

    if (isTyping) {
      const fullText = isEnglish ? currentLine.enText : currentLine.text;
      setTypedText(fullText);
      setIsTyping(false);
      audioManager.playClick();
      return;
    }

    // If there are choices waiting on this line, require explicit choice selection
    if (hasChoices) {
      return;
    }

    if (lineIndex < lines.length - 1) {
      setLineIndex((prev) => prev + 1);
    } else {
      onSceneComplete();
    }
    audioManager.playWaterDrop();
  };

  const handleChoiceSelect = (_choiceId: string) => {
    audioManager.playUI1();
    if (lineIndex < lines.length - 1) {
      setLineIndex((prev) => prev + 1);
    } else {
      onSceneComplete();
    }
  };

  // Typewriter effect
  useEffect(() => {
    if (!currentLine) return;
    
    const textToType = isEnglish ? currentLine.enText : currentLine.text;
    setTypedText('');
    setIsTyping(true);

    let charIndex = 0;
    
    // Quick interval
    const interval = setInterval(() => {
      charIndex++;
      setTypedText(textToType.slice(0, charIndex));
      
      if (charIndex % 3 === 0) {
        audioManager.playClick();
      }

      if (charIndex >= textToType.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [lineIndex, isEnglish, currentLine]);

  // Handle global click anywhere to advance dialog
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Ignore standard header navigation
      if (target.closest('#header_nav') || target.closest('header')) {
        return;
      }

      // Ignore actionable page forms and buttons
      if (
        target.closest('button') || 
        target.closest('a') || 
        target.closest('input') || 
        target.closest('textarea') || 
        target.closest('select') ||
        target.closest('[role="button"]')
      ) {
        return;
      }

      // Any neutral background or overlay click will proceed
      handleNext();
    };

    document.addEventListener('click', handleGlobalClick, true);
    return () => {
      document.removeEventListener('click', handleGlobalClick, true);
    };
  }, [lineIndex, isTyping, isEnglish, lines, currentLine, hasChoices]);

  // Auto progression - trigger auto-continue when line stays/pauses for over 4.5 seconds
  useEffect(() => {
    if (isTyping || !currentLine || hasChoices) return;
    
    const timeout = setTimeout(() => {
      handleNext();
    }, 4000);

    return () => clearTimeout(timeout);
  }, [isTyping, lineIndex, isEnglish, lines, currentLine, hasChoices]);

  // Reset index when lines change (new chapter)
  useEffect(() => {
    setLineIndex(0);
    setTypedText('');
  }, [lines]);

  if (!currentLine) return null;

  const topPositionClass = isCentered ? "top-1/2" : "top-[72%] md:top-[74%]";

  return (
    <div 
      className={`fixed ${topPositionClass} left-1/2 -translate-x-1/2 -translate-y-1/2 scale-105 md:scale-110 w-[88vw] max-w-[560px] aspect-[907/484] z-50 select-none animate-fade-in pointer-events-auto cursor-pointer filter drop-shadow-xl flex items-center justify-center p-8 md:p-12`}
      id="dialog_frame"
    >
      {/* Uploaded Dialogue PNG Frame - strictly preserving original 907:484 aspect ratio */}
      <img 
        src={isDark ? "/src/assets/UI/对话框b.png" : "/src/assets/UI/对话框.png"}
        alt="Dialogue Frame" 
        className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
        referrerPolicy="no-referrer"
      />

      {/* Choice options positioned ABOVE the dialogue frame */}
      {hasChoices && !isTyping && (
        <div className="absolute -top-14 md:-top-16 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 pointer-events-auto animate-fade-in z-20">
          {currentLine.choices!.map((choice) => (
            <button
              key={choice.id}
              onClick={(e) => {
                e.stopPropagation();
                handleChoiceSelect(choice.id);
              }}
              className="relative group min-w-[280px] sm:min-w-[340px] md:min-w-[380px] max-w-[90vw] py-1.5 md:py-2 px-6 md:px-10 text-stone-100 font-wenkai text-xs md:text-[13px] tracking-[0.26em] cursor-pointer transition-all duration-300 hover:scale-[1.015] active:scale-[0.985] rounded-[2px] shadow-[0_6px_24px_rgba(0,0,0,0.35)] overflow-hidden"
            >
              {/* Glassmorphism translucent backdrop with fine border */}
              <div className="absolute inset-0 bg-[#15181b]/88 backdrop-blur-md border border-stone-400/25 group-hover:border-amber-200/50 transition-colors duration-300" />
              
              {/* Subtle top & bottom highlight hairlines */}
              <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <div className="absolute inset-x-4 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

              {/* Decorative corner tick marks */}
              <span className="absolute top-1 left-1.5 text-[8px] text-stone-400/50 group-hover:text-amber-200/80 leading-none transition-colors">┌</span>
              <span className="absolute top-1 right-1.5 text-[8px] text-stone-400/50 group-hover:text-amber-200/80 leading-none transition-colors">┐</span>
              <span className="absolute bottom-1 left-1.5 text-[8px] text-stone-400/50 group-hover:text-amber-200/80 leading-none transition-colors">└</span>
              <span className="absolute bottom-1 right-1.5 text-[8px] text-stone-400/50 group-hover:text-amber-200/80 leading-none transition-colors">┘</span>

              {/* Content with minimalist accent elements */}
              <div className="relative z-10 flex items-center justify-center space-x-3 text-stone-200 group-hover:text-white font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                <div className="w-5 md:w-8 h-px bg-gradient-to-r from-transparent to-stone-400/50 group-hover:to-amber-200/70 transition-colors duration-300" />
                <span className="text-[9px] text-amber-200/60 group-hover:text-amber-200 group-hover:rotate-45 transition-all duration-300">✦</span>
                <span className="whitespace-nowrap pl-0.5">{isEnglish ? choice.enText : choice.text}</span>
                <span className="text-[9px] text-amber-200/60 group-hover:text-amber-200 group-hover:rotate-45 transition-all duration-300">✦</span>
                <div className="w-5 md:w-8 h-px bg-gradient-to-l from-transparent to-stone-400/50 group-hover:to-amber-200/70 transition-colors duration-300" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Narrative Text - centered within the dialogue box */}
      <div className={`relative z-10 w-[68%] max-w-[350px] ${isDark ? 'text-white' : 'text-stone-850'} text-xs md:text-sm leading-relaxed md:leading-loose tracking-wide font-wenkai font-bold text-center flex flex-col items-center justify-center whitespace-pre-wrap`}>
        <div>
          {typedText}
          {isTyping && (
            <span className={`inline-block w-1.5 h-3.5 ml-1 ${isDark ? 'bg-white' : 'bg-[#1c1f22]'} animate-pulse align-middle`} />
          )}
        </div>
      </div>
    </div>
  );
};
