import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { audioManager } from '../utils/audio';
import { GuidePoint } from './GuidePoint';

interface SceneWisdomToothProps {
  isEnglish: boolean;
  onComplete?: () => void;
  isDialogueCompleted?: boolean;
}

type WisdomStage = 
  | 'toothache'       // Stage 1: Toothache video with initial 4 dialogue boxes (Steps 0-3)
  | 'tooth_dropping'  // Stage 2: Black screen + Tooth dropping animation (No dialogue)
  | 'scale_unbalance' // Stage 3: Black background + Scale unbalancing animation (No dialogue)
  | 'scale_dialogue'  // Stage 4: "等一下。少了一点重量。" (Step 4) & "不行。如果不恢复平衡..." (Step 5)
  | 'tooth_search'    // Stage 5: Black screen searching spotlight (No dialogue)
  | 'search_dialogue' // Stage 6: "到底掉在哪里了？" (Step 6)
  | 'tooth_loop'      // Stage 7: Tooth loop animation + Tap tooth -> "……这是什么？" (Step 7)
  | 'birth_video'     // Stage 8: Tooth cracking birth animation (No dialogue)
  | 'fairy_loop';     // Stage 9: Fairy hovering loop + "你终于找到我啦。" (Step 8) -> Next scene

export const SceneWisdomTooth: React.FC<SceneWisdomToothProps> = ({ 
  isEnglish, 
  onComplete 
}) => {
  const [stage, setStage] = useState<WisdomStage>('toothache');
  const [step, setStep] = useState<number>(0);
  const [isToothHovered, setIsToothHovered] = useState<boolean>(false);
  const [hasTappedTooth, setHasTappedTooth] = useState<boolean>(false);
  const [hasToothachePlayedOnce, setHasToothachePlayedOnce] = useState<boolean>(false);
  const [scaleTilt, setScaleTilt] = useState<number>(0);
  const [leftPanSway, setLeftPanSway] = useState<number>(0);
  const [rightPanSway, setRightPanSway] = useState<number>(0);

  // Helper to rotate point (x, y) around pivot (cx, cy)
  const getRotatedPoint = (x: number, y: number, cx: number, cy: number, angleDegrees: number) => {
    const rad = (angleDegrees * Math.PI) / 180;
    const dx = x - cx;
    const dy = y - cy;
    return {
      x: cx + dx * Math.cos(rad) - dy * Math.sin(rad),
      y: cy + dx * Math.sin(rad) + dy * Math.cos(rad)
    };
  };

  // Video references
  const videoToothacheRef = useRef<HTMLVideoElement>(null);
  const videoLoopRef = useRef<HTMLVideoElement>(null);
  const videoBirthRef = useRef<HTMLVideoElement>(null);
  const videoFairyBgRef = useRef<HTMLVideoElement>(null);
  const videoFairyFgRef = useRef<HTMLVideoElement>(null);

  // Typewriter state
  const [typedText, setTypedText] = useState<string>('');
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Dialogue lines configuration for each step
  const dialogueScript: Record<number, { speaker: { cn: string; en: string }; text: { cn: string; en: string } }> = {
    0: {
      speaker: { cn: '女孩', en: 'Girl' },
      text: { cn: '嘶……又来了。', en: 'Ouch... Here it comes again.' }
    },
    1: {
      speaker: { cn: '女孩', en: 'Girl' },
      text: { cn: '最近这颗牙越来越奇怪。', en: 'This tooth has been feeling stranger and stranger lately.' }
    },
    2: {
      speaker: { cn: '女孩', en: 'Girl' },
      text: { cn: '智齿？可是……', en: 'A wisdom tooth? But...' }
    },
    3: {
      speaker: { cn: '女孩', en: 'Girl' },
      text: { cn: '我不是早就过了长智齿的年纪吗？', en: "Aren't I way past the age of growing wisdom teeth?" }
    },
    4: {
      speaker: { cn: '女孩', en: 'Girl' },
      text: { cn: '等一下。少了一点重量。', en: 'Wait. A bit of weight is missing.' }
    },
    5: {
      speaker: { cn: '女孩', en: 'Girl' },
      text: { cn: '如果不恢复平衡，愿望是不会实现的。', en: "No way. If balance isn't restored, the wish won't come true." }
    },
    6: {
      speaker: { cn: '女孩', en: 'Girl' },
      text: { cn: '到底掉在哪里了？', en: 'Where on earth did it fall?' }
    },
    7: {
      speaker: { cn: '女孩', en: 'Girl' },
      text: { cn: '……这是什么？', en: '...What is this?' }
    },
    8: {
      speaker: { cn: '精灵', en: 'Elf' },
      text: { cn: '你终于找到我啦。', en: 'You finally found me!' }
    }
  };

  // Synchronize videos according to active stage
  useEffect(() => {
    if (videoToothacheRef.current) {
      if (stage === 'toothache') {
        videoToothacheRef.current.currentTime = 0;
        videoToothacheRef.current.play().catch(() => {});
      } else {
        videoToothacheRef.current.pause();
      }
    }

    if (videoLoopRef.current) {
      if (stage === 'tooth_loop') {
        videoLoopRef.current.currentTime = 0;
        videoLoopRef.current.play().catch(() => {});
      } else {
        videoLoopRef.current.pause();
      }
    }

    if (videoBirthRef.current) {
      if (stage === 'birth_video') {
        audioManager.playCrackSequential();
        videoBirthRef.current.currentTime = 0;
        videoBirthRef.current.play().catch(() => {});
      } else {
        videoBirthRef.current.pause();
      }
    }

    if (videoFairyBgRef.current) {
      if (stage === 'fairy_loop') {
        audioManager.playMagical();
        videoFairyBgRef.current.currentTime = 0;
        videoFairyBgRef.current.play().catch(() => {});
      } else {
        videoFairyBgRef.current.pause();
      }
    }

    if (videoFairyFgRef.current) {
      if (stage === 'fairy_loop') {
        videoFairyFgRef.current.currentTime = 0;
        videoFairyFgRef.current.play().catch(() => {});
      } else {
        videoFairyFgRef.current.pause();
      }
    }
  }, [stage]);

  // Tooth dropping auto timer -> transitions to scale_unbalance
  useEffect(() => {
    if (stage === 'tooth_dropping') {
      audioManager.playWaterDrop();
      const timer = setTimeout(() => {
        setStage('scale_unbalance');
      }, 2600);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // Scale unbalance auto timer -> transitions to scale_dialogue
  useEffect(() => {
    if (stage === 'scale_unbalance') {
      audioManager.playChime();
      const timer = setTimeout(() => {
        setStage('scale_dialogue');
        setStep(4);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // Scale tilt & pan sway physics effect when entering scale unbalance stage
  useEffect(() => {
    if (stage === 'scale_unbalance' || stage === 'scale_dialogue') {
      const t1 = setTimeout(() => {
        setScaleTilt(14.5);
        setLeftPanSway(-10);
        setRightPanSway(9);
      }, 40);

      const t2 = setTimeout(() => {
        setLeftPanSway(6.5);
        setRightPanSway(-6);
      }, 340);

      const t3 = setTimeout(() => {
        setLeftPanSway(-3.5);
        setRightPanSway(3);
      }, 640);

      const t4 = setTimeout(() => {
        setLeftPanSway(1.2);
        setRightPanSway(-1);
      }, 940);

      const t5 = setTimeout(() => {
        setLeftPanSway(0);
        setRightPanSway(0);
      }, 1240);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
        clearTimeout(t5);
      };
    } else {
      setScaleTilt(0);
      setLeftPanSway(0);
      setRightPanSway(0);
    }
  }, [stage]);

  // Tooth search auto timer -> transitions to search_dialogue
  useEffect(() => {
    if (stage === 'tooth_search') {
      const timer = setTimeout(() => {
        setStage('search_dialogue');
        setStep(6);
      }, 2400);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // Typewriter effect for current dialogue line
  useEffect(() => {
    const currentLine = dialogueScript[step];
    if (!currentLine) {
      setTypedText('');
      return;
    }

    const fullText = isEnglish ? currentLine.text.en : currentLine.text.cn;
    setTypedText('');
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < fullText.length) {
        idx++;
        setTypedText(fullText.slice(0, idx));
        if (idx % 2 === 0) {
          audioManager.playClick();
        }
      } else {
        clearInterval(interval);
      }
    }, 55);

    return () => clearInterval(interval);
  }, [step, isEnglish]);

  // Advance dialogue step handler
  const handleAdvanceDialogue = useCallback(() => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }

    audioManager.playWaterDrop();

    if (stage === 'toothache') {
      if (step < 3) {
        setStep(prev => prev + 1);
      } else {
        // Step 3 completed -> Tooth dropping animation if video played once or skip used
        if (hasToothachePlayedOnce) {
          setStage('tooth_dropping');
        } else {
          // If video is still on first play, user can wait or click SKIP
        }
      }
    } else if (stage === 'scale_dialogue') {
      if (step < 5) {
        setStep(prev => prev + 1);
      } else {
        // Step 5 completed -> Tooth search spotlight
        setStage('tooth_search');
      }
    } else if (stage === 'search_dialogue') {
      // Step 6 completed -> Tooth loop animation
      setStage('tooth_loop');
    } else if (stage === 'tooth_loop') {
      if (hasTappedTooth) {
        // Step 7 completed -> Birth video
        setStage('birth_video');
      }
    } else if (stage === 'fairy_loop') {
      if (onComplete) onComplete();
    }
  }, [stage, step, hasTappedTooth, hasToothachePlayedOnce, onComplete]);

  // Auto-play dialogue timer (slower rate: 4.2s delay after typed text completes)
  useEffect(() => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }

    const currentLine = dialogueScript[step];
    if (!currentLine) return;

    const fullText = isEnglish ? currentLine.text.en : currentLine.text.cn;

    if (typedText.length === fullText.length && fullText.length > 0) {
      const canAutoAdvance = 
        (stage === 'toothache' && (step < 3 || hasToothachePlayedOnce)) ||
        stage === 'scale_dialogue' ||
        stage === 'search_dialogue' ||
        (stage === 'tooth_loop' && hasTappedTooth) ||
        stage === 'fairy_loop';

      if (canAutoAdvance) {
        autoAdvanceTimerRef.current = setTimeout(() => {
          handleAdvanceDialogue();
        }, 4200);
      }
    }

    return () => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }
    };
  }, [typedText, step, stage, hasTappedTooth, hasToothachePlayedOnce, isEnglish, handleAdvanceDialogue]);

  // Handle clicking the interactive tooth in tooth_loop stage
  const handleToothClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioManager.playChime();
    setHasTappedTooth(true);
    setStep(7);
  };

  const currentLineConfig = dialogueScript[step];
  const activeSpeaker = currentLineConfig ? (isEnglish ? currentLineConfig.speaker.en : currentLineConfig.speaker.cn) : '';
  const fullTextLength = currentLineConfig ? (isEnglish ? currentLineConfig.text.en.length : currentLineConfig.text.cn.length) : 0;

  // Dialogue box is ONLY shown during dialogue stages, NOT during pure transition animations
  const showDialogueBox = 
    stage === 'toothache' ||
    stage === 'scale_dialogue' ||
    stage === 'search_dialogue' ||
    (stage === 'tooth_loop' && hasTappedTooth) ||
    stage === 'fairy_loop';

  return (
    <div 
      className="w-full h-[calc(100dvh-48px)] mt-[48px] bg-black flex flex-col justify-end items-center relative overflow-hidden select-none" 
      id="wisdom_tooth_scene"
    >
      {/* Main Full-Screen Theater Stage */}
      <div className="w-full h-full max-h-full max-w-full relative flex items-end justify-center overflow-hidden">
        
        {/* ================= STAGE 1: Toothache Video ================= */}
        <div className={`absolute inset-0 w-full h-full transition-opacity duration-700 flex items-end justify-center ${stage === 'toothache' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
          <video
            ref={videoToothacheRef}
            muted
            playsInline
            preload="auto"
            className="w-full h-full max-h-full max-w-full object-contain object-bottom pointer-events-none"
            onEnded={() => {
              setHasToothachePlayedOnce(true);
              if (videoToothacheRef.current) {
                videoToothacheRef.current.currentTime = 0;
                videoToothacheRef.current.play().catch(() => {});
              }
            }}
            onTimeUpdate={() => {
              if (videoToothacheRef.current && videoToothacheRef.current.duration > 0) {
                if (videoToothacheRef.current.currentTime >= videoToothacheRef.current.duration - 0.3) {
                  setHasToothachePlayedOnce(true);
                }
              }
            }}
          >
            <source src="/src/assets/video/ani2_牙痛.webm" type="video/webm" />
          </video>

          {/* Toothache Stage Skip Button */}
          {stage === 'toothache' && (
            <div className="absolute bottom-6 right-6 z-30">
              <button
                onClick={() => {
                  setHasToothachePlayedOnce(true);
                  setStage('tooth_dropping');
                }}
                className="px-5 py-2 bg-black/50 hover:bg-white/15 active:scale-95 text-stone-200 border border-white/10 rounded-full font-sans text-xs font-black tracking-widest shadow-xl backdrop-blur-md transition-all duration-300 cursor-pointer"
              >
                {isEnglish ? 'SKIP' : '跳过'}
              </button>
            </div>
          )}
        </div>

        {/* ================= STAGE 2: Tooth Dropping Black Screen Animation (No Dialogue Box) ================= */}
        {stage === 'tooth_dropping' && (
          <div className="absolute inset-0 bg-black z-30 flex items-center justify-center overflow-hidden">
            <motion.div
              initial={{ y: -200, opacity: 0, rotate: 0, scale: 0.8 }}
              animate={{ y: 160, opacity: 1, rotate: 540, scale: 1.1 }}
              transition={{ duration: 2.4, ease: [0.25, 1, 0.5, 1] }}
              className="relative flex items-center justify-center"
            >
              <div className="absolute w-28 h-28 bg-teal-300/20 rounded-full filter blur-xl animate-pulse" />
              <img 
                src="/src/assets/images/智齿.png" 
                alt="Dropping Tooth" 
                className="w-20 md:w-24 h-auto object-contain filter drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]"
              />
            </motion.div>
            <div className="absolute bottom-12 text-stone-400 font-mono text-xs tracking-widest animate-pulse">
              ✦ {isEnglish ? 'TOOTH FALLING...' : '智齿脱落中...'} ✦
            </div>
          </div>
        )}

        {/* ================= STAGE 3 & 4: Scale Unbalancing Black Screen Animation & Dialogue ================= */}
        {(stage === 'scale_unbalance' || stage === 'scale_dialogue') && (() => {
          const leftPivot = getRotatedPoint(491, 513.5, 1214.5, 513.5, scaleTilt);
          const rightPivot = getRotatedPoint(1938, 513.5, 1214.5, 513.5, scaleTilt);

          return (
            <div className="absolute inset-0 bg-black z-20 flex items-end justify-center overflow-hidden">
              <div className="absolute inset-0 bg-radial-gradient from-teal-900/20 via-transparent to-black pointer-events-none" />

              {/* Full Scale SVG Container matching SceneScaleGirl height fitting */}
              <div className="relative h-full max-h-full max-w-full aspect-[2388/1668] flex items-end justify-center p-0">
                <svg className="w-full h-full max-h-full max-w-full select-none" viewBox="0 0 2388 1668" preserveAspectRatio="xMidYMax meet">
                  {/* 1. 秤后星星3, 2, 1 */}
                  <image href="/src/assets/images/秤后星星3.png" x="0" y="0" width="2388" height="1668" pointerEvents="none" className="animate-star-float-3" />
                  <image href="/src/assets/images/秤后星星2.png" x="0" y="0" width="2388" height="1668" pointerEvents="none" className="animate-star-float-2" />
                  <image href="/src/assets/images/秤后星星1.png" x="0" y="0" width="2388" height="1668" pointerEvents="none" className="animate-star-float-1" />

                  {/* 2. 秤柱 */}
                  <image href="/src/assets/images/秤柱.png" x="0" y="0" width="2388" height="1668" pointerEvents="none" />

                  {/* 3. 秤杆 pivot rotating around (1214.5, 513.5) */}
                  <g 
                    transform={`rotate(${scaleTilt}, 1214.5, 513.5)`} 
                    className="transition-transform duration-[1100ms] ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none"
                  >
                    <image href="/src/assets/images/秤杆.png" x="0" y="0" width="2388" height="1668" pointerEvents="none" />
                  </g>

                  {/* 4. Left Hand Pan */}
                  <g 
                    transform={`translate(${leftPivot.x - 491}, ${leftPivot.y - 513.5})`} 
                    className="transition-transform duration-[1100ms] ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none"
                  >
                    <g 
                      transform={`rotate(${leftPanSway}, 491, 513.5)`} 
                      className="transition-transform duration-[320ms] ease-in-out pointer-events-none"
                    >
                      <image href="/src/assets/images/秤盘-后景.png" x="0" y="0" width="2388" height="1668" pointerEvents="none" />
                      <image href="/src/assets/images/秤盘-前景.png" x="0" y="0" width="2388" height="1668" pointerEvents="none" />
                    </g>
                  </g>

                  {/* 5. Right Hand Pan (Mirrored to match right pan symmetry) */}
                  <g 
                    transform={`translate(${rightPivot.x - 1938}, ${rightPivot.y - 513.5})`} 
                    className="transition-transform duration-[1100ms] ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none"
                  >
                    <g transform="translate(1938, 0) scale(-1, 1) translate(-491, 0)" className="pointer-events-none">
                      <g 
                        transform={`rotate(${rightPanSway}, 491, 513.5)`} 
                        className="transition-transform duration-[320ms] ease-in-out pointer-events-none"
                      >
                        <image href="/src/assets/images/秤盘-后景.png" x="0" y="0" width="2388" height="1668" pointerEvents="none" />
                        <image href="/src/assets/images/秤盘-前景.png" x="0" y="0" width="2388" height="1668" pointerEvents="none" />
                      </g>
                    </g>
                  </g>

                  {/* 6. 秤前星 */}
                  <image href="/src/assets/images/秤前星.png" x="0" y="0" width="2388" height="1668" pointerEvents="none" />
                </svg>
              </div>

              <div className="absolute top-10 text-stone-400 font-mono text-xs tracking-widest uppercase z-10">
                ✦ {isEnglish ? 'UNBALANCED EQUILIBRIUM' : '天平失去平衡'} ✦
              </div>
            </div>
          );
        })()}

        {/* ================= STAGE 5 & 6: Searching Tooth Black Screen & Dialogue ================= */}
        {(stage === 'tooth_search' || stage === 'search_dialogue') && (
          <div className="absolute inset-0 bg-black z-20 flex items-center justify-center overflow-hidden">
            <motion.div 
              animate={{ 
                x: [-120, 100, -60, 140, 0],
                y: [-60, 40, 80, -40, 0]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="w-64 h-64 rounded-full bg-radial-gradient from-teal-200/20 via-teal-400/5 to-transparent filter blur-xl pointer-events-none"
            />
            <div className="absolute top-10 text-stone-400 font-mono text-xs tracking-widest uppercase animate-pulse">
              ✦ {isEnglish ? 'SEARCHING IN DARKNESS...' : '在黑暗中寻找...'} ✦
            </div>
          </div>
        )}

        {/* ================= STAGE 7: Second Tooth Loop Animation ================= */}
        <div className={`absolute inset-0 w-full h-full transition-opacity duration-700 flex items-end justify-center ${stage === 'tooth_loop' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
          <video
            ref={videoLoopRef}
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full max-h-full max-w-full object-contain object-bottom pointer-events-none"
          >
            <source src="/src/assets/video/ani3-智齿循环动画.webm" type="video/webm" />
          </video>

          {/* Interactive Tooth Element Container (Spans exact video width for seamless tap target) */}
          <div className="relative h-full max-h-full max-w-full aspect-video flex flex-col items-center justify-center">
            {!hasTappedTooth && (
              <div className="absolute top-12 z-30 bg-white/20 backdrop-blur-sm border border-white/10 px-5 py-1.5 rounded-full text-stone-200/90 font-sans font-bold text-xs tracking-[0.2em] shadow-sm animate-pulse flex items-center space-x-2 pointer-events-none">
                <GuidePoint isSelected={isToothHovered} sizeClassName="w-5 h-5" />
                <span>{isEnglish ? 'TAP THE WISDOM TOOTH' : '点击智齿'}</span>
              </div>
            )}

            <motion.button
              onClick={handleToothClick}
              onMouseEnter={() => setIsToothHovered(true)}
              onMouseLeave={() => setIsToothHovered(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-full relative flex items-center justify-center outline-none cursor-pointer group z-20"
            >
              {/* Center glow aura */}
              <div className="absolute w-40 h-40 md:w-52 md:h-52 bg-[#ffb8d1]/25 rounded-full filter blur-2xl animate-pulse group-hover:bg-[#ffb8d1]/40 transition-all" />
            </motion.button>
          </div>
        </div>

        {/* ================= STAGE 8: Birth Video ================= */}
        <div className={`absolute inset-0 w-full h-full transition-opacity duration-300 flex items-end justify-center ${stage === 'birth_video' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
          <video
            ref={videoBirthRef}
            muted
            playsInline
            preload="auto"
            className="w-full h-full max-h-full max-w-full object-contain object-bottom pointer-events-none"
            onEnded={() => {
              setStage('fairy_loop');
              setStep(8);
            }}
          >
            <source src="/src/assets/video/ani4-智齿女孩诞生.webm" type="video/webm" />
          </video>
          
          <div className="absolute bottom-6 right-6 z-30">
            <button
              onClick={() => {
                setStage('fairy_loop');
                setStep(8);
              }}
              className="px-5 py-2 bg-black/50 hover:bg-white/15 active:scale-95 text-stone-200 border border-white/10 rounded-full font-sans text-xs font-black tracking-widest shadow-xl backdrop-blur-md transition-all duration-300 cursor-pointer"
            >
              {isEnglish ? 'SKIP' : '跳过'}
            </button>
          </div>
        </div>

        {/* ================= STAGE 9: Fairy Hovering Loop ================= */}
        <div className={`absolute inset-0 w-full h-full transition-opacity duration-700 flex items-end justify-center ${stage === 'fairy_loop' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
          <video
            ref={videoFairyBgRef}
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full max-h-full max-w-full object-contain object-bottom pointer-events-none"
          >
            <source src="/src/assets/video/ani3-智齿循环动画.webm" type="video/webm" />
          </video>

          <video
            ref={videoFairyFgRef}
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full max-h-full max-w-full object-contain object-bottom relative z-20 pointer-events-none"
          >
            <source src="/src/assets/video/ani5-妖精悬浮循环.webm" type="video/webm" />
          </video>

          <div className="absolute top-10 z-30 bg-white/20 backdrop-blur-sm border border-white/10 px-5 py-1.5 rounded-full text-stone-200/90 font-sans font-bold text-xs tracking-[0.2em] shadow-sm animate-pulse flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#ffb8d1] animate-ping" />
            <span>{isEnglish ? 'FAIRY DISCOVERED' : '智齿妖精 · 诞生'}</span>
          </div>
        </div>

      </div>

      {/* ================= DIALOGUE BOX OVERLAY (Using /src/assets/UI/对话框.png) ================= */}
      {showDialogueBox && (
        <div 
          onClick={handleAdvanceDialogue}
          className="fixed bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 scale-100 md:scale-105 w-[90vw] max-w-[540px] aspect-[907/484] z-50 select-none animate-fade-in pointer-events-auto cursor-pointer filter drop-shadow-xl flex flex-col items-center justify-center p-6 md:p-8 text-center group"
          id="wisdom_tooth_dialogue_box"
        >
          {/* Dialogue PNG Frame */}
          <img 
            src="/src/assets/UI/对话框.png" 
            alt="Dialogue Frame" 
            className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none group-hover:brightness-105 transition-all"
            referrerPolicy="no-referrer"
          />

          {/* Speaker Badge positioned comfortably lower & slightly right inside top-left of Dialogue Frame */}
          {activeSpeaker && (
            <div className="absolute top-[25%] left-[12%] md:top-[31%] md:left-[15%] z-20 px-3.5 py-0.5 bg-stone-900/10 border border-stone-800/20 rounded-full text-[10px] md:text-xs font-serif font-bold text-stone-800 tracking-wider">
              {activeSpeaker}
            </div>
          )}

          {/* Main Narrative Text - Centered vertically and horizontally inside frame */}
          <div className="relative z-10 w-full px-8 md:px-12 text-stone-900 text-sm md:text-base leading-relaxed tracking-wider font-wenkai font-bold min-h-[52px] flex items-center justify-center text-center whitespace-pre-wrap">
            <span>{typedText}</span>
            {typedText.length < fullTextLength && (
              <span className="inline-block w-1.5 h-4 ml-1 bg-stone-700 animate-pulse align-middle" />
            )}
          </div>

          {/* Navigation Hint Footer (Placed OUTSIDE slightly higher below dialogue frame) */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] md:text-xs font-mono text-stone-300/90 uppercase tracking-widest text-center whitespace-nowrap pointer-events-none filter drop-shadow-md flex items-center space-x-1.5">
            <span>✦ {stage === 'fairy_loop' ? (isEnglish ? 'ENTER NEXT SCENE' : '前往下一个界面') : (isEnglish ? 'CLICK TO CONTINUE' : '点击继续')} ✦</span>
            <span className="animate-bounce text-xs font-bold text-stone-200">▼</span>
          </div>
        </div>
      )}
    </div>
  );
};
