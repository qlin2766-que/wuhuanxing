import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SceneId, QuestionnaireAnswers } from './types';
import { DIALOGUE_SCRIPT } from './data/dialogue';
import { LanguageHeader } from './components/LanguageHeader';
import { NovelFrame } from './components/NovelFrame';
import { SceneMenu } from './components/SceneMenu';
import { SceneIntro } from './components/SceneIntro';
import { SceneQuestionnaire } from './components/SceneQuestionnaire';
import { SceneScaleGirl } from './components/SceneScaleGirl';
import { SceneWisdomTooth } from './components/SceneWisdomTooth';
import { SceneHeartFeather } from './components/SceneHeartFeather';
import { ScenePortfolio } from './components/ScenePortfolio';
import { CustomCursor } from './components/CustomCursor';
import { SceneTVChannelTransition } from './components/SceneTVChannelTransition';
import { SceneTransitionalBigText } from './components/SceneTransitionalBigText';
import { InitialPreloader } from './components/InitialPreloader';
import { audioManager } from './utils/audio';
import { assets } from './utils/assets';

const SCENE_ORDER: SceneId[] = [
  'portfolio',
  'menu',
  'questionnaire',
  'scale_girl',
  'wisdom_tooth',
  'heart_feather',
  'intro'
];

const SCENE_NAMES: Record<SceneId, { cn: string; en: string }> = {
  portfolio: { cn: '果实', en: 'Fruit' },
  menu: { cn: '主页', en: 'Home' },
  questionnaire: { cn: '第一眼', en: 'Glance' },
  scale_girl: { cn: '称量', en: 'Weighing' },
  wisdom_tooth: { cn: '智齿', en: 'Tooth' },
  heart_feather: { cn: '看见', en: 'Seeing' },
  intro: { cn: '初见', en: 'Introduction' }
};

// Precise Morphing Bézier Paths for 7 different Stations
const SHAPE_PATHS: Record<SceneId, string> = {
  portfolio: "M 100 20 C 150 45 180 55 180 100 C 180 145 150 155 100 180 C 50 155 20 145 20 100 C 20 55 50 45 100 20 Z", // Crystalline Hexagonal Dodecahedron
  menu: "M 100 20 C 144 20 180 56 180 100 C 180 144 144 180 100 180 C 56 180 20 144 20 100 C 20 56 56 20 100 20 Z", // Pure pristine Sphere
  questionnaire: "M 100 20 C 140 60 180 60 180 100 C 180 140 140 140 100 180 C 60 140 20 140 20 100 C 20 60 60 60 100 20 Z", // Diamond
  scale_girl: "M 100 30 C 125 75 160 130 185 170 C 140 170 60 170 15 170 C 40 130 75 75 100 30 Z", // Upward weight scale Triangle
  wisdom_tooth: "M 100 25 C 125 25 155 50 165 85 C 175 120 180 165 145 175 C 115 185 110 135 100 135 C 90 135 85 185 55 175 C 20 165 25 120 35 85 C 45 50 75 25 100 25 Z", // Dual-rooted tooth crown
  heart_feather: "M 100 45 C 125 10 180 15 180 75 C 180 120 140 155 100 180 C 60 155 20 120 20 75 C 20 15 75 10 100 45 Z", // Deep Empathetic Heart
  intro: "M 100 30 C 160 10 190 60 170 110 C 150 160 130 180 100 175 C 70 170 30 150 30 100 C 30 50 60 10 100 30 Z" // Organic Wet Droplet / Pebble
};

// Signature palette matching each station - light, sour, mint, yellow, pink, greyish-olive tones
const SCENE_COLORS: Record<SceneId, string> = {
  portfolio: "#3dd3c4",     // Crystal Mint/Teal
  menu: "#32c0b9",          // Core Mint blue-green
  questionnaire: "#fef08a", // Sour Lemon yellow
  scale_girl: "#fbcfe8",    // Sour Pink highlight
  wisdom_tooth: "#3a4c48",  // Greyish brown-green (dark slate sage)
  heart_feather: "#ffb8d1", // Juicy Pink highlight
  intro: "#7be2d1"          // Vibrant mint highlight
};

const SCENE_LABELS_CN: Record<SceneId, string> = {
  portfolio: '果实 · 结晶与作品集',
  menu: '回到起点 · 初始的虚无',
  questionnaire: '第一眼 · 凝视与视角',
  scale_girl: '称量 · 承受的天平',
  wisdom_tooth: '智齿 · 裂开的痛楚',
  heart_feather: '看见 · 两个人的黑影',
  intro: '初见 · 无重力世界'
};

const SCENE_LABELS_EN: Record<SceneId, string> = {
  portfolio: 'Fruit · Crystallized Projects',
  menu: 'Original State · Starvation Circle',
  questionnaire: 'Glance · Gazing Perspectives',
  scale_girl: 'Weighing · Burden of Scales',
  wisdom_tooth: 'Tooth · Shattered Cords',
  heart_feather: 'Seeing · Two Hand Silhouettes',
  intro: 'Afloat · Gravity-Free World'
};

export default function App() {
  const [hasPreloaded, setHasPreloaded] = useState<boolean>(false);
  const [currentScene, _setCurrentScene] = useState<SceneId>('portfolio');
  const [prologueProgress, setPrologueProgress] = useState<'active' | 'completed'>('active');
  const [questionnaireProgress, setQuestionnaireProgress] = useState<'none' | 'active' | 'completed'>('none');
  const [scaleGirlProgress, setScaleGirlProgress] = useState<'intro' | 'completed'>('intro');
  const [prevScene, setPrevScene] = useState<SceneId>('portfolio');
  const [nextScene, setNextScene] = useState<SceneId>('portfolio');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const [isEnglish, setIsEnglish] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false); // Starts muted by default for general compliance, easily toggled in UI
  const [dialogueFinishedScenes, setDialogueFinishedScenes] = useState<string[]>([]);
  const [currentDialogueLineId, setCurrentDialogueLineId] = useState<string>('');
  const [isIntroSequenceFinished, setIsIntroSequenceFinished] = useState<boolean>(false);

  // Smooth architectural scene transition interceptor
  const setCurrentScene = (nextSceneVal: SceneId | ((prev: SceneId) => SceneId)) => {
    const target = typeof nextSceneVal === 'function' ? nextSceneVal(currentScene) : nextSceneVal;
    if (target === currentScene || isTransitioning) return;

    setIsTransitioning(true);
    setPrevScene(currentScene);
    setNextScene(target);

    // Play tactile deep space chime
    audioManager.playDeepChime();

    // Pivot rendering at climax (650ms)
    setTimeout(() => {
      _setCurrentScene(target);
    }, 650);

    // Fade out and release transition locks at 1450ms
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1450);
  };
  
  // Custom questionnaire answers
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({
    valuableAspect: 'connections',
    successDefinition: 'creative_output',
    priority: 'authenticity',
    identity: undefined
  });

  // Synchronise or reset on scene shifts
  useEffect(() => {
    setCurrentDialogueLineId('');
    if (currentScene === 'menu') {
      setQuestionnaireProgress('none');
    } else if (currentScene === 'questionnaire' && questionnaireProgress === 'none') {
      setQuestionnaireProgress('active');
    }
  }, [currentScene, questionnaireProgress]);

  // Synchronise active BGM track according to scene
  useEffect(() => {
    if (currentScene === 'portfolio') {
      audioManager.switchBgmTrack('portfolio');
    } else {
      audioManager.switchBgmTrack('default');
    }
  }, [currentScene]);

  // Background music control based on mute state
  useEffect(() => {
    if (!isMuted) {
      audioManager.playBgm();
    } else {
      audioManager.stopBgm();
    }
  }, [isMuted]);

  // Navigate to next scene
  const handleNextScene = () => {
    const currentIndex = SCENE_ORDER.indexOf(currentScene);
    if (currentIndex < SCENE_ORDER.length - 1) {
      const nextId = SCENE_ORDER[currentIndex + 1];
      setCurrentScene(nextId);
      audioManager.playDeepChime();
    } else {
      // From 'intro' (last station), return to 'portfolio'!
      setCurrentScene('portfolio');
      audioManager.playDeepChime();
    }
  };

  // Skip dialogue layer of active scene to directly interact
  const handleSceneDialogueComplete = () => {
    if (!dialogueFinishedScenes.includes(currentScene)) {
      setDialogueFinishedScenes((prev) => [...prev, currentScene]);
    }
  };

  // Check if dialogue is currently completed for current scene
  const isDialogueCompleted = dialogueFinishedScenes.includes(currentScene);

  // Render the core narrative chapter scene based on state
  const renderActiveScene = () => {
    switch (currentScene) {
      case 'portfolio':
        if (prologueProgress !== 'completed') {
          return (
            <SceneTransitionalBigText 
              isEnglish={isEnglish} 
              onComplete={() => {
                setPrologueProgress('completed');
              }}
            />
          );
        }
        return (
          <ScenePortfolio 
            isEnglish={isEnglish} 
            isDialogueCompleted={isDialogueCompleted}
            onEnterWorld={() => {
              setCurrentScene('menu');
            }}
          />
        );
      case 'menu':
        return (
          <SceneMenu 
            onStart={() => {
              setCurrentScene('questionnaire');
              setQuestionnaireProgress('active');
            }} 
            isEnglish={isEnglish} 
          />
        );
      case 'questionnaire':
        if (questionnaireProgress !== 'completed') {
          return (
            <SceneTVChannelTransition 
              isEnglish={isEnglish} 
              onComplete={() => {
                setQuestionnaireProgress('completed');
              }} 
            />
          );
        }
        return (
          <SceneQuestionnaire 
            answers={answers} 
            setAnswers={setAnswers} 
            isEnglish={isEnglish} 
            onComplete={() => {
              handleSceneDialogueComplete();
              handleNextScene();
            }} 
            isDialogueCompleted={isDialogueCompleted}
            currentDialogueLineId={currentDialogueLineId}
          />
        );
      case 'scale_girl':
        if (scaleGirlProgress !== 'completed') {
          return (
            <SceneTransitionalBigText 
              isEnglish={isEnglish}
              chapterLabelCn="第二章 · 称量"
              chapterLabelEn="CHAPTER 02 · WEIGHING"
              theme="dark"
              slides={[
                {
                  textCn: "从前……有一个住在天平上的女孩",
                  textEn: "Once upon a time... there was a girl who lived on a balance scale."
                }
              ]}
              onComplete={() => {
                setScaleGirlProgress('completed');
              }}
            />
          );
        }
        return (
          <SceneScaleGirl 
            answers={answers} 
            isEnglish={isEnglish} 
            onComplete={handleNextScene}
            isDialogueCompleted={isDialogueCompleted}
            currentDialogueLineId={currentDialogueLineId}
          />
        );
      case 'wisdom_tooth':
        return (
          <SceneWisdomTooth 
            isEnglish={isEnglish} 
            onComplete={handleNextScene}
            isDialogueCompleted={isDialogueCompleted}
          />
        );
      case 'heart_feather':
        return (
          <SceneHeartFeather 
            isEnglish={isEnglish} 
            onComplete={handleNextScene}
          />
        );
      case 'intro':
        return (
          <SceneIntro 
            isEnglish={isEnglish} 
            isDialogueCompleted={isDialogueCompleted}
            onDialogueComplete={handleSceneDialogueComplete}
            onIntroSequenceComplete={() => setIsIntroSequenceFinished(true)}
            onReturnToPortfolio={() => {
              setCurrentScene('portfolio');
            }}
          />
        );
      default:
        return null;
    }
  };

  // Dialogue script items for active scene
  const activeDialogueLines = DIALOGUE_SCRIPT[currentScene] || [];

  // Determine app-level background color based on active scene
  const getSceneBgClass = () => {
    if (currentScene === 'scale_girl' || currentScene === 'wisdom_tooth') return 'bg-black';
    if (currentScene === 'menu') return 'bg-[#1a1e1e]';
    if (currentScene === 'portfolio') return 'bg-[#effffb]';
    return 'bg-[#FCFAF6]';
  };

  return (
    <div className={`min-h-screen ${getSceneBgClass()} transition-colors duration-500 flex flex-col justify-between relative overflow-hidden select-none custom-cursor-area`}>
      {!hasPreloaded && (
        <InitialPreloader 
          onComplete={() => setHasPreloaded(true)} 
          isEnglish={isEnglish} 
        />
      )}
      
      {/* Top Navigation Headers */}
      <LanguageHeader 
        isEnglish={isEnglish} 
        setIsEnglish={setIsEnglish} 
        isMuted={isMuted} 
        setIsMuted={setIsMuted} 
        currentScene={currentScene}
        setCurrentScene={setCurrentScene}
        sceneOrder={SCENE_ORDER}
        sceneNames={SCENE_NAMES}
      />

      {/* Main active content view with smooth motion transition */}
      <main className="flex-1 w-full relative z-10 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentScene}_${questionnaireProgress}_${prologueProgress}_${scaleGirlProgress}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 w-full flex flex-col"
          >
            {renderActiveScene()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Dialogue Console Layer (Hides on start menu, during big text screens, and before questionnaire completes) */}
      {currentScene !== 'menu' && !isDialogueCompleted && activeDialogueLines.length > 0 && !(currentScene === 'portfolio' && prologueProgress !== 'completed') && !(currentScene === 'questionnaire' && questionnaireProgress !== 'completed') && !(currentScene === 'scale_girl' && scaleGirlProgress !== 'completed') && (
        <NovelFrame
          key={currentScene}
          lines={activeDialogueLines}
          isEnglish={isEnglish}
          onSceneComplete={handleSceneDialogueComplete}
          onNextChapter={currentScene === 'portfolio' ? undefined : (currentScene === 'intro' ? () => setCurrentScene('portfolio') : handleNextScene)}
          isCentered={currentScene === 'questionnaire'}
          onLineChange={(_idx, line) => setCurrentDialogueLineId(line.id)}
          isDark={currentScene === 'scale_girl'}
        />
      )}

      {/* Subtle bottom footer statement on Intro scene or when dialogue is minimized / already consumed */}
      {(((currentScene === 'intro' && isDialogueCompleted && isIntroSequenceFinished)) || (isDialogueCompleted && currentScene !== 'portfolio' && currentScene !== 'menu' && currentScene !== 'scale_girl' && currentScene !== 'questionnaire' && currentScene !== 'wisdom_tooth' && currentScene !== 'heart_feather')) && (
        <div className="fixed bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-40 text-center pointer-events-auto">
          {currentScene === 'intro' ? (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 0.95, y: 0 }}
              transition={{ duration: 0.4 }}
              onClick={handleNextScene}
              whileHover={{ 
                scale: 1.03, 
                backgroundColor: 'rgba(28, 25, 22, 1)' 
              }}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-2.5 bg-stone-900/95 hover:bg-stone-900 text-white rounded-md backdrop-blur-md font-sans text-xs md:text-[13px] tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-[0_4px_16px_rgba(0,0,0,0.12)] select-none border border-white/10 opacity-95 hover:opacity-100"
              id="btn_narrative_bottom_action"
            >
              <span className="font-wenkai tracking-wider font-normal">
                {isEnglish ? 'Return to Portfolio' : '返回“果实”页面'}
              </span>
              <span className="text-white/60 group-hover:text-white/90 text-xs font-mono transition-colors">
                →
              </span>
            </motion.button>
          ) : (
            <button
              onClick={handleNextScene}
              className="px-6 py-2.5 bg-white hover:bg-stone-900 text-stone-900 hover:text-white border-2 border-stone-900 rounded-none font-mono text-xs font-black tracking-wider shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer flex items-center space-x-2 select-none group"
              id="btn_narrative_bottom_action"
            >
              <span className="font-wenkai md:font-mono font-bold tracking-wide">
                {isEnglish ? 'PROCEED TO NEXT STATION →' : '前往下一个车站 →'}
              </span>
            </button>
          )}
        </div>
      )}

      {/* Cinematic Fullscreen Geometric Morphing Portal Transition */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="fixed inset-0 z-[100] bg-[#FAF8F5]/95 backdrop-blur-[8px] flex flex-col items-center justify-center p-6"
          >
            <div className="relative w-80 h-80 flex flex-col items-center justify-center">
              {/* ==================================================================== */}
              {/* PLACEHOLDER: WEB M TRANSITION VIDEOS BETWEEN SCENES                  */}
              {/* ==================================================================== */}
              {/* 1. 天平页面 ("scale_girl") -> 成长页面 ("wisdom_tooth")                 */}
              {/* 2. 成长页面 ("wisdom_tooth") -> 理解页面 ("heart_feather")              */}
              {/* ==================================================================== */}
              {((prevScene === 'scale_girl' && nextScene === 'wisdom_tooth' && assets.webm.transitionScaleToGrow.enabled) ||
                (prevScene === 'wisdom_tooth' && nextScene === 'heart_feather' && assets.webm.transitionGrowToUnderstand.enabled)) ? (
                <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none" id="webm_scenic_transitions_overlay">
                  
                  {/* Transition Video Block: Scale Girl -> Wisdom Tooth */}
                  {prevScene === 'scale_girl' && nextScene === 'wisdom_tooth' && assets.webm.transitionScaleToGrow.enabled && (
                    <video 
                      autoPlay 
                      muted 
                      playsInline
                      preload="auto"
                      className="w-full h-full object-contain"
                    >
                      <source src={assets.webm.transitionScaleToGrow.src} type="video/webm" />
                    </video>
                  )}

                  {/* Transition Video Block: Wisdom Tooth -> Heart Feather */}
                  {prevScene === 'wisdom_tooth' && nextScene === 'heart_feather' && assets.webm.transitionGrowToUnderstand.enabled && (
                    <video 
                      autoPlay 
                      muted 
                      playsInline
                      preload="auto"
                      className="w-full h-full object-contain"
                    >
                      <source src={assets.webm.transitionGrowToUnderstand.src} type="video/webm" />
                    </video>
                  )}

                </div>
              ) : (
                <>
                  {/* Dynamic radiating blur circle for premium depth */}
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.45, 0.15] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                    style={{ backgroundColor: SCENE_COLORS[nextScene] }}
                    className="absolute w-64 h-64 rounded-full filter blur-3xl"
                  />

                  {/* Seamless morphological shifting of the core geometric motif */}
                  <svg 
                    viewBox="0 0 200 200" 
                    className="w-56 h-56 relative z-10 drop-shadow-[0_12px_24px_rgba(30,25,20,0.18)]"
                  >
                    <motion.path
                      initial={{ d: SHAPE_PATHS[prevScene] }}
                      animate={{ 
                        d: [SHAPE_PATHS[prevScene], SHAPE_PATHS[nextScene]],
                        rotate: [0, 180]
                      }}
                      transition={{ 
                        duration: 1.1,
                        times: [0, 1],
                        ease: [0.16, 1, 0.3, 1]
                      }}
                      className="stroke-stone-900 stroke-[3.5] fill-transparent transition-colors duration-[1100ms] ease-out"
                      style={{
                        fill: `${SCENE_COLORS[nextScene]}ec` // fluid semi-opacified filling
                      }}
                    />
                  </svg>

                  {/* Dynamic secondary orbiting sparks */}
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                    className="absolute inset-0 pointer-events-none"
                  >
                    <div className="absolute top-8 left-1/2 w-2 h-2 bg-stone-900 rounded-sm" />
                    <div className="absolute bottom-8 left-1/3 w-1.5 h-1.5 bg-stone-950 rounded-full" />
                  </motion.div>
                </>
              )}
            </div>

            {/* Narrative flight stations panel */}
            <div className="mt-8 text-center max-w-sm relative z-20 flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: [0, 0.9, 0], y: [12, 0, -12] }}
                transition={{ duration: 1.25, times: [0, 0.5, 1] }}
                className="font-mono text-[9px] uppercase tracking-[0.25em] text-stone-550 mb-1.5"
              >
                {isEnglish 
                  ? `Leaving: ${SCENE_LABELS_EN[prevScene] || prevScene.toUpperCase()}`
                  : `驶离车站: ${SCENE_LABELS_CN[prevScene] || prevScene}`
                }
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.42, duration: 0.6, ease: 'easeOut' }}
                className="font-serif text-[15px] font-black tracking-widest text-stone-900"
              >
                {isEnglish
                  ? SCENE_LABELS_EN[nextScene]
                  : SCENE_LABELS_CN[nextScene]
                }
              </motion.div>
              
              <div className="mt-4 flex items-center justify-center space-x-1.5 opacity-60">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-850 animate-ping" />
                <span className="h-[1px] w-24 bg-stone-900/30 border-t border-dashed" />
                <span className="w-1 h-1 rounded-full bg-stone-850" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CustomCursor />

      {/* Atmospheric Film Post-Processing Layers */}
      <div className="vignette-atmosphere" />

    </div>
  );
}
