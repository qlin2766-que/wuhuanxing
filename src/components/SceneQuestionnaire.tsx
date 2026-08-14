import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QuestionnaireAnswers } from '../types';
import { audioManager } from '../utils/audio';
import { GuidePoint } from './GuidePoint';

interface SceneQuestionnaireProps {
  answers: QuestionnaireAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<QuestionnaireAnswers>>;
  isEnglish: boolean;
  onComplete: () => void;
  isDialogueCompleted?: boolean;
  currentDialogueLineId?: string;
}

const hotspots = [
  {
    id: 'art_practitioner',
    nameCn: '工作牌',
    nameEn: 'Name Badge',
    descCn: '塑料壳被磨出了细小的划痕。\n 媒体艺术交互设计师？听上去很高级。',
    descEn: 'The plastic casing has tiny scratches on it.\nMedia art interaction designer? Sounds quite fancy.',
    style: { top: '43%', left: '58.5%' }
  },
  {
    id: 'student',
    nameCn: '背包',
    nameEn: 'Backpack',
    descCn: '拉链没有拉好。\n 里面露出一本重得像板砖的游戏本。',
    descEn: 'The zipper is not closed properly.\nA heavy gaming laptop peeks out like a brick.',
    style: { top: '48.5% ', left: '26.5%' }
  },
  {
    id: 'creator',
    nameCn: '这里什么都没有',
    nameEn: 'Nothing Here',
    descCn: '人看起来还在这。\n 但其实已经飞走了？',
    descEn: 'She seems to be sitting right here,\nbut her mind has already flown away?',
    style: { top: '24%', left: '56%' }
  }
] as const;

const NARRATIVES = {
  student: {
    titleCn: '学生',
    titleEn: 'Student',
    textCn: '非常容易被认出是个学生。\n 她背着很多东西。\n课本、耳机、一把雨伞。\n 还有一块堪比板砖的巨型游戏本。',
    textEn: 'Very easy to recognize as a student.\nShe carries many things:\ntextbooks, headphones, an umbrella,\nand a heavy gaming laptop as thick as a brick.'
  },
  art_practitioner: {
    titleCn: '从业者',
    titleEn: 'Practitioner',
    textCn: '看起来是个成熟稳重的人。\n不回消息的时候在上厕所。\n尽量在手忙脚乱的场合显得镇定。\n午饭吃到一半，又开始想下午的事情。',
    textEn: 'Looks like a mature, steady person.\nWhen not replying to messages, she is in the restroom.\nTrying her best to stay calm when flustered.\nHalfway through lunch, thinking about the afternoon.'
  },
  creator: {
    titleCn: '创作者',
    titleEn: 'Creator',
    textCn: '熬夜到凌晨四点是她的坏习惯。\n 夜晚安静的时候大脑变得不听话。\n 似乎是害怕有些念头如果现在不抓住，很快就会消失。',
    textEn: 'Staying up until 4 AM is her bad habit.\nWhen the night is quiet, her mind gets unruly,\nas if afraid that if some thoughts are not caught now,\nthey will soon vanish.'
  }
};

const THOUGHTS = {
  initial: {
    cn: ['……', '…'],
    en: ['...', '…']
  },
  student: {
    cn: [
      '早知道昨天晚上就不熬夜了，困死我了。',
      '糟糕，忘记带电脑充电线了…',
      '上完课去哪里好呢？'
    ],
    en: [
      "If I knew, I wouldn't have stayed up late last night... I'm so sleepy.",
      "Oh no, I forgot my laptop charger...",
      "Where should I go after class?"
    ]
  },
  art_practitioner: {
    cn: [
      '中午吃什么？算了，随便买一点。',
      '趁时间还早去买杯咖啡吧。',
      '昨天的文件应该已经发过去了吧？好像还有什么忘记了。'
    ],
    en: [
      "What to eat for lunch? Forget it, I'll just grab something.",
      "While it's still early, let's grab a coffee.",
      "Did I send yesterday's file? Feels like I forgot something."
    ]
  },
  creator: {
    cn: [
      '如果把自行车画成会飞的，应该会很奇怪吧？……但好像不错。',
      '今天的天空好漂亮，可是相机拍不出来。',
      '我感觉我以前来过这里，有些似曾相识。'
    ],
    en: [
      "If I paint a flying bicycle, would it look weird? ... But it actually sounds cool.",
      "The sky is so pretty today, but the camera can't capture it.",
      "I feel like I've been here before, it feels strangely familiar."
    ]
  }
};

export const SceneQuestionnaire: React.FC<SceneQuestionnaireProps> = ({
  answers,
  setAnswers,
  isEnglish,
  onComplete,
  isDialogueCompleted = false,
  currentDialogueLineId = ''
}) => {
  const activeIdentity = answers.identity;

  // Scene elements reveal when dialogue finishes OR when dialogue reaches q7
  const isSceneVisible = isDialogueCompleted || currentDialogueLineId === 'q7';
  
  // TV black screen overlay remains active during initial narration (q1 ~ q6)
  const isTvDarkOverlayActive = !isDialogueCompleted && currentDialogueLineId !== 'q7';
  
  // State: 'observing' (idle), 'transitioning', or 'selected'
  const [status, setStatus] = useState<'observing' | 'transitioning' | 'selected'>(
    activeIdentity ? 'selected' : 'observing'
  );
  const [hoveredHotspot, setHoveredHotspot] = useState<'student' | 'art_practitioner' | 'creator' | null>(null);
  const [lockedHotspot, setLockedHotspot] = useState<'student' | 'art_practitioner' | 'creator' | null>(null);
  const [transitioningTo, setTransitioningTo] = useState<'student' | 'art_practitioner' | 'creator' | null>(null);
  const [renderedIdentity, setRenderedIdentity] = useState<'student' | 'art_practitioner' | 'creator' | null>(
    activeIdentity || null
  );

  // Pick a random guide point on initial load for the hint tooltip
  const [randomHintHotspotId] = useState<string>(() => {
    const randomIndex = Math.floor(Math.random() * hotspots.length);
    return hotspots[randomIndex].id;
  });

  // Track if user has interacted with hotspots to dismiss the hint
  const [hasInteracted, setHasInteracted] = useState(false);

  // Bicycle tire sound loop effect when a girl identity is selected
  useEffect(() => {
    if (renderedIdentity) {
      audioManager.startBicycleLoop();
    } else {
      audioManager.stopBicycleLoop();
    }
    return () => {
      audioManager.stopBicycleLoop();
    };
  }, [renderedIdentity]);
  const [thoughtIndex, setThoughtIndex] = useState(0);
  const [thoughtVisible, setThoughtVisible] = useState(false);

  // Thought rotation effect (Initial 2.2s delay on identity change -> 6.5s visible -> 2.5s gap between thoughts)
  useEffect(() => {
    setThoughtIndex(0);
    setThoughtVisible(false);

    const identityKey = renderedIdentity || 'initial';
    const thoughtsList = isEnglish ? THOUGHTS[identityKey].en : THOUGHTS[identityKey].cn;

    if (!thoughtsList || thoughtsList.length === 0) return;

    let initialTimeout: NodeJS.Timeout;
    let showTimeout: NodeJS.Timeout;
    let hideTimeout: NodeJS.Timeout;

    const scheduleNextCycle = () => {
      // Stay visible for 6.5 seconds
      hideTimeout = setTimeout(() => {
        setThoughtVisible(false);

        // 2.5 seconds empty gap before showing next thought
        showTimeout = setTimeout(() => {
          setThoughtIndex((prev) => (prev + 1) % thoughtsList.length);
          setThoughtVisible(true);
          scheduleNextCycle();
        }, 2500);
      }, 6500);
    };

    // Initial delay so user observes the girl visual shift first (2.2s delay)
    initialTimeout = setTimeout(() => {
      setThoughtVisible(true);
      if (thoughtsList.length > 1) {
        scheduleNextCycle();
      }
    }, 2200);

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(hideTimeout);
      clearTimeout(showTimeout);
    };
  }, [renderedIdentity, isEnglish]);

  const activeIdentityKey = renderedIdentity || 'initial';
  const activeThoughtsList = isEnglish ? THOUGHTS[activeIdentityKey].en : THOUGHTS[activeIdentityKey].cn;
  const activeThoughtText = activeThoughtsList[thoughtIndex % activeThoughtsList.length];

  const getHotspotImage = (id: string | null) => {
    if (id === 'art_practitioner') return '/src/assets/images/工作牌.png';
    if (id === 'student') return '/src/assets/images/背包.png';
    if (id === 'creator') return '/src/assets/images/躺猫.png';
    return null;
  };

  const handleSelectIdentity = (id: 'art_practitioner' | 'creator' | 'student') => {
    let variableAspect: 'achievement' | 'connections' | 'inner_peace' = 'connections';
    let successDefinition: 'external_recognition' | 'self_contentment' | 'creative_output' = 'creative_output';
    let priority: 'efficiency' | 'happiness' | 'authenticity' = 'authenticity';

    if (id === 'art_practitioner') {
      variableAspect = 'achievement';
      successDefinition = 'external_recognition';
      priority = 'efficiency';
    } else if (id === 'creator') {
      variableAspect = 'connections';
      successDefinition = 'creative_output';
      priority = 'authenticity';
    } else {
      variableAspect = 'inner_peace';
      successDefinition = 'self_contentment';
      priority = 'happiness';
    }

    setAnswers(prev => ({
      ...prev,
      identity: id,
      valuableAspect: variableAspect,
      successDefinition: successDefinition,
      priority: priority
    }));
  };

  const handleHotspotClick = (id: 'student' | 'art_practitioner' | 'creator') => {
    if (status !== 'observing') return;
    setHasInteracted(true);
    audioManager.playClick();
    setLockedHotspot(id);
  };

  const handleConfirmIdentity = (id: 'student' | 'art_practitioner' | 'creator') => {
    if (status !== 'observing') return;

    audioManager.playUI1();
    
    setStatus('transitioning');
    setTransitioningTo(id);

    // Wait for beautiful lens-blur transition (1.5 seconds)
    setTimeout(() => {
      handleSelectIdentity(id);
      setRenderedIdentity(id);
      setStatus('selected');
      setTransitioningTo(null);
      setLockedHotspot(null);
    }, 1500);
  };

  const handleObserveAgain = () => {
    audioManager.playClick();

    setStatus('transitioning');
    setTransitioningTo(null);
    setLockedHotspot(null);

    // Transition back to default standing image
    setTimeout(() => {
      // Reset answers state at the end of transition to avoid premature updates
      setAnswers(prev => ({
        ...prev,
        identity: undefined
      }));
      setRenderedIdentity(null);
      setStatus('observing');
    }, 1200);
  };

  const getMediaSrc = () => {
    if (renderedIdentity === 'student') return '/src/assets/video/student.webp';
    if (renderedIdentity === 'art_practitioner') return '/src/assets/video/worker.webp';
    if (renderedIdentity === 'creator') return '/src/assets/video/creator.webp';
    return '/src/assets/video/initial.webp';
  };

  // Get active hovered or locked hotspot details for dynamic floating description
  const activeViewedId = hoveredHotspot || lockedHotspot;
  const activeViewedData = activeViewedId ? hotspots.find(h => h.id === activeViewedId) : null;

  return (
    <div className="w-full min-h-screen bg-[#effffb] flex flex-col items-center justify-center relative overflow-hidden select-none" id="scene_questionnaire" style={{ backgroundColor: '#effffb' }}>
      
      {/* TV Channel Black Screen Overlay (Active during narration q1..q6) */}
      <div 
        className={`absolute inset-0 w-full h-full bg-[#13171a] z-30 transition-opacity duration-[2500ms] ease-in-out flex flex-col items-center justify-center pointer-events-none ${
          isTvDarkOverlayActive ? 'opacity-100' : 'opacity-0'
        }`}
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

        {/* Outer retro television border frame */}
        <div className="absolute inset-4 sm:inset-6 md:inset-10 border border-stone-800/80 rounded-lg pointer-events-none z-10 shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]" />

        {/* Retro CRT OSD Header - Left */}
        <div className="absolute top-8 sm:top-12 left-8 sm:left-14 font-mono text-[9px] sm:text-[10px] text-emerald-400/80 tracking-[0.25em] select-none leading-none z-20 flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>CH 02 // {isEnglish ? 'WUHUANSTAR CONNECTED' : '物换星 接入中'}</span>
        </div>

        {/* Retro CRT OSD Header - Right */}
        <div className="absolute top-8 sm:top-12 right-8 sm:right-14 font-mono text-[9px] sm:text-[10px] text-amber-300/70 tracking-[0.25em] select-none leading-none z-20">
          AV-1 [PROLOGUE]
        </div>
      </div>

      {/* Immersive Absolute Video Background */}
      <div className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 transition-opacity duration-[2500ms] ease-in-out ${isSceneVisible ? 'opacity-100' : 'opacity-0'}`}>
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover opacity-65 transition-opacity duration-[2500ms] mix-blend-darken"
        >
          <source src="/src/assets/video/back.webm" type="video/webm" />
        </video>
      </div>

      {/* Immersive Blueprint Vector Background (Parchment look) */}
      <div className={`absolute inset-0 pointer-events-none z-0 transition-opacity duration-[2500ms] ease-in-out ${isSceneVisible ? 'opacity-40' : 'opacity-0'}`}>
        <svg className="w-full h-full stroke-stone-300/60 fill-none" viewBox="0 0 800 600" preserveAspectRatio="none">
          <circle cx="10%" cy="20%" r="150" strokeWidth="0.5" />
          <circle cx="90%" cy="80%" r="200" strokeWidth="0.5" strokeDasharray="3 3" />
          <line x1="0" y1="50%" x2="100%" y2="50%" strokeWidth="0.5" strokeDasharray="5 5" />
          <line x1="50%" y1="0" x2="50%" y2="100%" strokeWidth="0.5" strokeDasharray="5 5" />
        </svg>
      </div>

      {/* MAIN IMMERSIVE CONTAINER FOR THE CHARACTER */}
      <div className="relative w-full max-w-7xl h-[90vh] flex items-center justify-center z-10">
        
        {/* Aspect-Locked Wrapper to guarantee Hotspot alignment with the standing girl illustration */}
        <div className={`relative aspect-[3/4] h-[80vh] md:h-[112vh] max-h-[720px] md:max-h-[1050px] flex items-center justify-center transition-all duration-[2500ms] ease-in-out translate-y-[31px] md:translate-y-[47px] ${
          status === 'selected'
            ? 'md:-translate-x-[22%] lg:-translate-x-[32%] xl:-translate-x-[38%]'
            : 'md:-translate-x-[8%] lg:-translate-x-[15%] xl:-translate-x-[18%]'
        } ${isSceneVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          
          {/* Immersive Borderless Visual Loop */}
          <img 
            src={getMediaSrc()} 
            className={`w-full h-full object-contain select-none pointer-events-none transition-all duration-1000 ease-in-out mix-blend-darken ${
              status === 'transitioning' ? 'blur-md scale-[1.03] opacity-0 invisible' : 'blur-0 scale-100 opacity-100'
            }`} 
            alt="Cinematic Character Calibration" 
          />

          {/* Interactive Hotspots (Only enabled in observing state) */}
          {status === 'observing' && hotspots.map((h) => {
            const isRandomHintTarget = h.id === randomHintHotspotId && !hasInteracted && !lockedHotspot;

            return (
              <div
                key={h.id}
                className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
                style={h.style}
                onMouseEnter={() => setHoveredHotspot(h.id)}
                onMouseLeave={() => setHoveredHotspot(null)}
                onClick={() => handleHotspotClick(h.id)}
              >
                  {/* Immersive Hotspot Node using uploaded WebM / PNG GuidePoint */}
                  <div className="relative flex items-center justify-center cursor-pointer group p-2">
                    <GuidePoint 
                      isSelected={h.id === lockedHotspot || h.id === hoveredHotspot} 
                      sizeClassName="w-14 h-14 md:w-16 md:h-16" 
                    />

                    {/* Minimal translucent white hint card at the right side of the random guide point */}
                    <AnimatePresence>
                      {isRandomHintTarget && isSceneVisible && (
                        <motion.div
                          initial={{ opacity: 0, x: -6, scale: 0.95 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: 6, scale: 0.95 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                          className="absolute left-[88%] top-1/2 -translate-y-1/2 ml-1 z-30 pointer-events-none whitespace-nowrap"
                        >
                          <div className="bg-white/75 backdrop-blur-md border border-stone-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.06)] rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-stone-500 animate-pulse" />
                            <span className="font-wenkai text-[11px] md:text-xs text-stone-750 font-medium tracking-wider select-none">
                              {isEnglish ? 'Clickable observation point' : '可点击观察点'}
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
              </div>
            );
          })}

          {/* Dynamic Upper-Right Translucent Thought Bubble for Character */}
          {isSceneVisible && status !== 'transitioning' && (
            <div 
              className="absolute z-25 pointer-events-none transition-all duration-700 ease-out flex flex-col items-start"
              style={{ top: '12%', left: '58%' }}
            >
              <AnimatePresence mode="wait">
                {thoughtVisible && activeThoughtText && (
                  <motion.div
                    key={`${renderedIdentity || 'initial'}-${thoughtIndex}`}
                    initial={{ opacity: 0, scale: 0.85, y: 10 }}
                    animate={{ opacity: 0.7, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.85, y: -8 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="relative bg-white/55 backdrop-blur-md border border-stone-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-2xl md:rounded-3xl px-4 py-2.5 md:px-5 md:py-3.5 max-w-[190px] md:max-w-[260px] text-stone-800 font-wenkai text-xs md:text-sm leading-relaxed tracking-wide text-center"
                  >
                    <span>{activeThoughtText}</span>
                    
                    {/* Translucent thought tail circles pointing down-left towards girl's head */}
                    <div className="absolute -bottom-2 left-4 w-2.5 h-2.5 rounded-full bg-white/55 border border-stone-200/50 backdrop-blur-md" />
                    <div className="absolute -bottom-4 left-2 w-1.5 h-1.5 rounded-full bg-white/45 border border-stone-200/40 backdrop-blur-md" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Lens Blur Transition Loading Screen overlay */}
          <AnimatePresence>
            {status === 'transitioning' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center z-25 text-center p-6 bg-transparent"
              >
                <div className="w-12 h-12 rounded-full border-2 border-stone-300 border-t-sky-500 animate-spin mb-4" />
                <div className="font-mono text-[9px] text-sky-700 uppercase tracking-[0.2em] mb-1.5 animate-pulse">
                  {isEnglish ? '✦ CALIBRATING SURROUNDING GRAVITY ✦' : '✦ 正在重新校准环境重力 ✦'}
                </div>
                <div className="font-serif text-xs font-bold text-stone-700">
                  {isEnglish ? 'Aligning timelines...' : '正在导入命运轨迹...'}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

      {/* FLOATING TEXT OVERLAY: DYNAMIC PREVIEW/LOCKED DESCRIPTION ON THE RIGHT (observing state) */}
      <AnimatePresence>
        {status === 'observing' && activeViewedData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute right-6 left-6 bottom-8 md:bottom-auto md:left-auto md:right-12 md:top-1/2 md:-translate-y-1/2 max-w-sm md:max-w-[390px] bg-white/65 backdrop-blur-md border border-stone-200/70 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-2xl p-5 md:p-6 z-30 pointer-events-auto animate-fade-in"
          >
            <div className="flex flex-row items-center gap-3.5 md:gap-4">
              {/* Left Side: Image */}
              {getHotspotImage(activeViewedData.id) && (
                <div className="shrink-0 w-20 h-20 md:w-28 md:h-28 flex items-center justify-center self-center">
                  <img 
                    src={getHotspotImage(activeViewedData.id)!} 
                    alt="" 
                    className="w-full h-full object-contain filter drop-shadow-md"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Right Side: Stack of Title, Copy, Observe button, Reselect button */}
              <div className="flex-1 flex flex-col space-y-2">
                {/* Title */}
                <h4 className="font-serif text-base md:text-lg font-bold text-stone-850 tracking-wide">
                  {isEnglish ? activeViewedData.nameEn : activeViewedData.nameCn}
                </h4>

                {/* Description */}
                <p className="font-sans text-xs md:text-[13px] text-stone-600 leading-relaxed whitespace-pre-line">
                  {isEnglish ? activeViewedData.descEn : activeViewedData.descCn}
                </p>

                {/* Actions inside the right side column */}
                {lockedHotspot === activeViewedData.id ? (
                  <div className="pt-2 flex flex-col space-y-2">
                    <button
                      type="button"
                      onClick={() => handleConfirmIdentity(activeViewedData.id)}
                      className="w-full py-2 px-4 bg-stone-800 hover:bg-stone-900 text-stone-100 font-serif text-xs font-medium tracking-widest transition-all rounded-xl cursor-pointer shadow-sm hover:shadow active:scale-[0.99] flex items-center justify-center space-x-2"
                    >
                      <span>{isEnglish ? 'Confirm Perspective' : '观察'}</span>
                      <span className="text-stone-400">→</span>
                    </button>
                  </div>
                ) : (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleHotspotClick(activeViewedData.id)}
                      className="w-full py-2 px-4 border border-stone-200/80 hover:border-stone-300 bg-stone-50/60 hover:bg-stone-100/80 text-stone-700 font-serif text-xs font-medium tracking-wider transition-all rounded-xl cursor-pointer flex items-center justify-center space-x-1"
                    >
                      <span>{isEnglish ? 'Click to select perspective' : '点击观察'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING PARCHMENT CARD OVERLAY: SELECTED DOSSIER & ACTIONS (selected state) */}
      <AnimatePresence>
        {status === 'selected' && activeIdentity && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: 50 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="absolute right-6 left-6 bottom-8 md:bottom-auto md:left-auto md:right-12 md:top-1/2 md:-translate-y-1/2 max-w-sm md:max-w-[390px] bg-white/65 backdrop-blur-md border border-stone-200/70 shadow-[0_10px_35px_rgb(0,0,0,0.07)] rounded-2xl p-5 md:p-6 z-30 animate-fade-in"
          >
            <div className="flex flex-row items-center gap-3.5 md:gap-4">
              {/* Left Side: Image */}
              {getHotspotImage(activeIdentity) && (
                <div className="shrink-0 w-20 h-20 md:w-28 md:h-28 flex items-center justify-center self-center">
                  <img 
                    src={getHotspotImage(activeIdentity)!} 
                    alt="" 
                    className="w-full h-full object-contain filter drop-shadow-md"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Right Side: Stack of Title, Poetic text, Unified text, Continue button, Reselect button */}
              <div className="flex-1 flex flex-col space-y-2">
                {/* Identity Title */}
                <h4 className="font-serif text-base md:text-lg font-bold text-stone-850 tracking-wide">
                  {isEnglish ? NARRATIVES[activeIdentity].titleEn : NARRATIVES[activeIdentity].titleCn}
                </h4>

                {/* Poetic Narrative text */}
                <p className="font-sans text-xs md:text-[13px] text-stone-600 leading-relaxed whitespace-pre-line">
                  {isEnglish ? NARRATIVES[activeIdentity].textEn : NARRATIVES[activeIdentity].textCn}
                </p>
                
                {/* Unified final display text */}
                <div className="bg-stone-50/70 p-2.5 border border-stone-200/60 rounded-xl text-[11px] text-stone-600 leading-relaxed font-serif text-center font-medium whitespace-pre-line">
                  {isEnglish
                    ? 'You chose this perspective, \nand that\'s why you see her like this. '
                    : '你选择了这个视角，\n因此你看到了这样的她。 '
                  }
                </div>

                {/* Actions Block */}
                <div className="pt-2 flex flex-col space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      audioManager.playClick();
                      onComplete();
                    }}
                    className="w-full py-2 px-4 bg-stone-800 hover:bg-stone-900 text-stone-100 font-serif text-xs font-medium tracking-widest transition-all rounded-xl cursor-pointer shadow-sm hover:shadow active:scale-[0.99] flex items-center justify-center space-x-2"
                  >
                    <span>{isEnglish ? 'Continue Journey' : '继续'}</span>
                    <span className="text-stone-400">→</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleObserveAgain}
                    className="w-full text-center font-sans text-xs text-stone-400 hover:text-stone-600 transition-colors cursor-pointer py-0.5"
                  >
                    {isEnglish ? '↺ Observe Again' : '↺ 重新观察'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Immutable Footer Tag */}
      <div className="absolute bottom-6 left-8 hidden md:block">
        <span className="font-mono text-[9px] text-stone-400 tracking-[0.25em] font-black uppercase">
          CHAPTER 03 / THE APPARATUS OF SURVEY
        </span>
      </div>

    </div>
  );
};
