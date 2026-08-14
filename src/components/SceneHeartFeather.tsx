import React, { useState, useEffect } from 'react';
import { RotateCcw, Sparkles, Heart, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { audioManager } from '../utils/audio';
import { assets } from '../utils/assets';

interface SceneHeartFeatherProps {
  isEnglish: boolean;
  onComplete?: () => void;
}

interface DialogueItem {
  id: number;
  speaker: 'girl' | 'elf';
  cn: string;
  en: string;
}

interface SpeechFragment {
  id: string;
  initialX: number;
  initialY: number;
  scrambledText: string;
  enScrambled: string;
  clearText: string;
  enClear: string;
}

const DIALOGUE_SERIES: DialogueItem[] = [
  { id: 0, speaker: 'girl', cn: '你是什么东西？', en: 'What are you?' },
  { id: 1, speaker: 'elf', cn: '我不是东西，', en: "I'm not a thing," },
  { id: 2, speaker: 'elf', cn: '你可以叫我智齿精灵。', en: 'you can call me the Wisdom Tooth Elf.' },
  { id: 3, speaker: 'girl', cn: '你是我的智齿？', en: 'Are you my wisdom tooth?' },
  { id: 4, speaker: 'elf', cn: '严格来说，', en: 'Strictly speaking,' },
  { id: 5, speaker: 'elf', cn: '我是住在智齿里的精灵。', en: "I'm the elf inside the tooth." },
  { id: 6, speaker: 'girl', cn: '……都怪你。', en: "...It's all your fault." },
  { id: 7, speaker: 'girl', cn: '现在天平失衡了。', en: 'Now the scale is unbalanced.' },
  { id: 8, speaker: 'elf', cn: '哦。', en: 'Oh.' },
  { id: 9, speaker: 'elf', cn: '原来你第一反应不是关心我，', en: "So your first reaction isn't caring about me," },
  { id: 10, speaker: 'elf', cn: '而是担心你的天平。', en: 'but worrying about your scale.' },
  { id: 11, speaker: 'girl', cn: '当然。', en: 'Of course.' },
  { id: 12, speaker: 'girl', cn: '这是物换星的规则。', en: 'This is the rule of exchanging star for matter.' },
  { id: 13, speaker: 'elf', cn: '规则？', en: 'Rules?' },
  { id: 14, speaker: 'girl', cn: '等价交换。', en: 'Equivalent exchange.' },
  { id: 15, speaker: 'girl', cn: '放入相等的重量，', en: 'Put in equal weight' },
  { id: 16, speaker: 'girl', cn: '才能得到想要的东西。', en: 'to get what you want.' },
  { id: 17, speaker: 'elf', cn: '你真的相信这个？', en: 'Do you really believe in this?' },
  { id: 18, speaker: 'girl', cn: '为什么不相信？', en: "Why wouldn't I?" },
  { id: 19, speaker: 'elf', cn: '好吧，那麻烦来了。', en: 'Alright, then here comes trouble.' },
  { id: 20, speaker: 'elf', cn: '你的智齿掉下来以后，', en: 'When your wisdom tooth fell out,' },
  { id: 21, speaker: 'elf', cn: '少掉的不是一颗普通的牙。', en: "what was lost wasn't an ordinary tooth." },
  { id: 22, speaker: 'girl', cn: '那是什么？', en: 'What was it then?' },
  { id: 23, speaker: 'elf', cn: '一个非常麻烦的重量。', en: 'A very troublesome weight.' },
  { id: 24, speaker: 'elf', cn: '比羽毛重一点，比珍珠轻一点。', en: 'A bit heavier than a feather, a bit lighter than a pearl.' },
  { id: 25, speaker: 'elf', cn: '没有任何东西和它刚好一样。', en: 'Nothing else is exactly equal to it.' },
  { id: 26, speaker: 'girl', cn: '……', en: '...' },
  { id: 27, speaker: 'elf', cn: '所以，你暂时补不上它。', en: "So, you can't replace it for now." },
  { id: 28, speaker: 'girl', cn: '那我的愿望怎么办？', en: 'Then what about my wish?' },
  { id: 29, speaker: 'girl', cn: '我已经按照规则做了这么久。', en: "I've followed the rules for so long." },
  { id: 30, speaker: 'elf', cn: '既然这样，我可以借你一点魔力。', en: 'In that case, I can lend you a bit of magic.' },
  { id: 31, speaker: 'elf', cn: '很珍贵的那种。', en: 'The precious kind.' },
  { id: 32, speaker: 'elf', cn: '虽然大部分时间，', en: 'Though most of the time,' },
  { id: 33, speaker: 'elf', cn: '只能用来做一些没什么用的小事。', en: 'it only works for trivial things.' },
  { id: 34, speaker: 'girl', cn: '比如？', en: 'Like what?' },
  { id: 35, speaker: 'elf', cn: '让掉在地上的笔自己滚回来。', en: 'Making a fallen pen roll back to you.' },
  { id: 36, speaker: 'elf', cn: '让泡面快一点降温。', en: 'Cooling down instant noodles a bit faster.' },
  { id: 37, speaker: 'elf', cn: '让快没电的耳机再坚持一会儿。', en: 'Letting low-battery earbuds hold on a little longer.' },
  { id: 38, speaker: 'girl', cn: '这有什么用？', en: 'What use is that?' },
  { id: 39, speaker: 'elf', cn: '我也说了，没什么用。', en: 'I told you, not much use.' },
  { id: 40, speaker: 'elf', cn: '但是偶尔很方便。', en: 'But occasionally quite handy.' },
  { id: 41, speaker: 'girl', cn: '……', en: '...' },
  { id: 42, speaker: 'elf', cn: '我们可以一起去找答案。', en: 'We can go find the answer together.' },
  { id: 43, speaker: 'elf', cn: '去看看天平之外有什么。', en: 'See what lies beyond the scale.' },
  { id: 44, speaker: 'girl', cn: '可是如果我离开天平，', en: 'But if I leave the scale,' },
  { id: 45, speaker: 'girl', cn: '愿望就无法实现。', en: "the wish won't come true." },
  { id: 46, speaker: 'elf', cn: '你每天都在努力得到那个愿望。', en: 'You strive every day for that wish.' },
  { id: 47, speaker: 'elf', cn: '有没有可能……', en: 'Is it possible...' },
  { id: 48, speaker: 'elf', cn: '你已经忘记自己为什么想要它了？', en: "you've forgotten why you wanted it in the first place?" },
  { id: 49, speaker: 'girl', cn: '……', en: '...' },
  { id: 50, speaker: 'girl', cn: '好吧，我跟你一起去。', en: "Alright, I'll go with you." },
  { id: 51, speaker: 'elf', cn: '太好了。', en: 'Great!' },
  { id: 52, speaker: 'elf', cn: '我还以为，', en: "I thought I'd have to" },
  { id: 53, speaker: 'elf', cn: '我要自己拖着一颗牙旅行。', en: 'drag a tooth on a trip all by myself.' },
];

export const SceneHeartFeather: React.FC<SceneHeartFeatherProps> = ({ isEnglish, onComplete }) => {
  const [patience, setPatience] = useState<number>(0); // scale 0 to 100
  const [visitedNodes, setVisitedNodes] = useState<string[]>([]);
  const [snailState, setSnailState] = useState<'pickup' | 'afterpickup'>('pickup');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [dragY, setDragY] = useState<number>(0);
  const trackRef = React.useRef<HTMLDivElement>(null);

  // Behavior states
  const [behaviorMode, setBehaviorMode] = useState<'crawling' | 'retracting' | 'retracted'>('crawling');
  const [crawlTargetPatience, setCrawlTargetPatience] = useState<number>(35);
  const [wasRestingOnDragStart, setWasRestingOnDragStart] = useState<boolean>(false);

  const isAdvancing = (behaviorMode === 'crawling' || isDragging) && patience < 100;

  // Bicycle sound loop when progress bar is advancing
  useEffect(() => {
    if (isAdvancing) {
      audioManager.startBicycle3Loop();
    } else {
      audioManager.stopBicycle3Loop();
    }
    return () => {
      audioManager.stopBicycle3Loop();
    };
  }, [isAdvancing]);

  // Transition pickup -> afterpickup after 1.2s when dragging
  useEffect(() => {
    if (isDragging && snailState === 'pickup') {
      const timer = setTimeout(() => {
        setSnailState('afterpickup');
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [snailState, isDragging]);

  // Transition retracting -> retracted after 1.5s
  useEffect(() => {
    if (behaviorMode === 'retracting') {
      const timer = setTimeout(() => {
        setBehaviorMode('retracted');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [behaviorMode]);

  // Transition retracted -> crawling after random delay
  useEffect(() => {
    if (behaviorMode === 'retracted' && patience < 100 && !isDragging) {
      const randomDelay = Math.random() * 1500 + 2000;
      const timer = setTimeout(() => {
        setBehaviorMode('crawling');
        setCrawlTargetPatience(patience + Math.random() * 10 + 15);
      }, randomDelay);
      return () => clearTimeout(timer);
    }
  }, [behaviorMode, patience, isDragging]);

  // Smooth automatic crawling (advances slowly)
  useEffect(() => {
    if (behaviorMode !== 'crawling' || isDragging || patience >= 100) return;

    let lastTime = performance.now();
    let frameId: number;

    const tick = (now: number) => {
      const elapsed = now - lastTime;
      lastTime = now;
      
      // Auto-advance speed: ~1.1% per second (halved speed for gentle pacing)
      const increment = (1.1 * elapsed) / 1000;
      
      setPatience((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          setBehaviorMode('retracting');
          return 100;
        }
        if (next >= crawlTargetPatience) {
          setBehaviorMode('retracting');
        }
        return next;
      });
      
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [behaviorMode, isDragging, patience, crawlTargetPatience]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    setIsDragging(true);
    setStartX(e.clientX);
    setStartTime(Date.now());

    const isResting = behaviorMode === 'retracted' || behaviorMode === 'retracting';
    setWasRestingOnDragStart(isResting);

    if (!isResting) {
      setSnailState('pickup');
    }

    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    setPatience(pct);

    if (pct >= 100) {
      setBehaviorMode('retracting');
    }

    const currentDragY = e.clientY - (rect.top + rect.height / 2);
    setDragY(currentDragY);

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    setPatience(pct);

    if (pct >= 100) {
      setBehaviorMode('retracting');
    }

    const currentDragY = e.clientY - (rect.top + rect.height / 2);
    setDragY(currentDragY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);

    setDragY(0);

    const rect = trackRef.current ? trackRef.current.getBoundingClientRect() : null;
    const pct = rect ? Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)) : patience;
    setPatience(pct);

    if (pct >= 100) {
      setBehaviorMode('retracting');
    } else {
      if (wasRestingOnDragStart) {
        setBehaviorMode('crawling');
        setCrawlTargetPatience(pct + Math.random() * 15 + 25);
      } else {
        setSnailState('afterpickup');
        setBehaviorMode('crawling');
        setCrawlTargetPatience(pct + Math.random() * 15 + 25);
      }
    }

    const duration = Date.now() - startTime;
    const distance = Math.abs(e.clientX - startX);

    if (duration < 250 && distance < 10) {
      if (behaviorMode === 'crawling') {
        setBehaviorMode('retracting');
      } else if (behaviorMode === 'retracted') {
        setBehaviorMode('crawling');
        setCrawlTargetPatience(pct + Math.random() * 15 + 25);
      }
      audioManager.playChime();
    }
  };

  // Original Speech Fragments with updated text
  const fragments: SpeechFragment[] = [
    {
      id: 'f1',
      initialX: -280,
      initialY: -180,
      scrambledText: '▼ 这是※物换星%的规则……',
      enScrambled: '▼ This is the r*le of exch*nging...',
      clearText: '「这是物换星的规则。\n放入相等的重量，才能得到想要的东西。」',
      enClear: '“This is the rule of exchanging star for matter.\nOnly by putting in equal weight can you get what you desire.”'
    },
    {
      id: 'f2',
      initialX: 260,
      initialY: -30,
      scrambledText: '▼ 你还※记得%为什么想要它吗……',
      enScrambled: '▼ Do you st*ll rem*mber why...',
      clearText: '「你每天都在努力得到那个愿望。\n你还记得为什么想要得到它吗？」',
      enClear: '“You strive every day to fulfill that wish.\nDo you still remember why you wanted it?”'
    },
    {
      id: 'f3',
      initialX: -220,
      initialY: 190,
      scrambledText: '▼ 靠近一点※看见%自己……',
      enScrambled: '▼ Come cl*ser to see y*urself...',
      clearText: '「靠近一点，再靠近一点。\n你会看到误解、看到投射，看到天平之外的另一个切片，一个截然相反的，你自己。」',
      enClear: '“Come closer, a little closer.\nYou will see misunderstandings, projections, and another slice beyond the balance—an exact opposite of yourself.”'
    }
  ];

  useEffect(() => {
    if (patience > 5 && Math.round(patience) % 15 === 0) {
      audioManager.playFeatherBreeze();
    }
  }, [patience]);

  const handleFragmentClick = (id: string, isUnlocked: boolean) => {
    if (isUnlocked) {
      if (!visitedNodes.includes(id)) {
        setVisitedNodes((prev) => [...prev, id]);
      }
      audioManager.playChime();
    } else {
      audioManager.playUncomfortableRustle();
    }
  };

  const handleRestart = () => {
    setPatience(0);
    setVisitedNodes([]);
    setBehaviorMode('crawling');
    setCrawlTargetPatience(Math.random() * 15 + 30);
    audioManager.playChime();
  };

  const isResolved = patience >= 95;

  // Orbit & silhouette movement values based on patience slider
  const progressRatio = patience / 100;
  
  // Left silhouette starts at -340px and approaches -20px
  const leftX = -340 + progressRatio * 320;
  // Right silhouette starts at 340px and approaches 20px
  const rightX = 340 - progressRatio * 320;

  // Revolution system rotation
  const systemRotation = progressRatio * 360;
  const counterRotation = -systemRotation;

  const girlOpacity = 0.85 + progressRatio * 0.15;

  // Dialogue pacing with initial delay, longer blank pause between bubbles, and sequential slow exit at the end
  const PATIENCE_START = 3.0; // Initial delay
  const PATIENCE_END = 93.0;   // All dialogue lines introduced across 3% to 93% patience
  const PATIENCE_SPAN = PATIENCE_END - PATIENCE_START;

  const totalWeight = DIALOGUE_SERIES.reduce((sum, d) => sum + Math.max(12, d.cn.length), 0);

  const slotStarts: number[] = [];
  const slotDurations: number[] = [];
  let accumP = PATIENCE_START;

  DIALOGUE_SERIES.forEach((d) => {
    const w = Math.max(12, d.cn.length);
    const dur = (w / totalWeight) * PATIENCE_SPAN;
    slotStarts.push(accumP);
    slotDurations.push(dur);
    accumP += dur;
  });

  interface DialoguePacing {
    item: DialogueItem;
    revealPatience: number;
    exitPatience: number;
  }

  const N = DIALOGUE_SERIES.length;
  const GAP_RATIO = 0.40; // 40% blank pause time between oldest bubble exit and new bubble entry

  const pacingList: DialoguePacing[] = DIALOGUE_SERIES.map((d, k) => {
    const pauseGap = Math.max(0.6, slotDurations[k] * GAP_RATIO);
    const revealP = slotStarts[k] + pauseGap;

    let exitP: number;
    if (k + 4 < N) {
      exitP = slotStarts[k + 4];
    } else {
      // Last items disappear slowly one by one after PATIENCE_END, all exiting by 97%
      const remainingIdx = k - (N - 4);
      exitP = PATIENCE_END + (remainingIdx + 1) * 0.8;
    }

    return {
      item: d,
      revealPatience: revealP,
      exitPatience: Math.min(97.0, exitP),
    };
  });

  // Active visible items in sliding window with pause gaps
  const visibleItems = pacingList
    .filter((p) => patience >= p.revealPatience && patience < p.exitPatience)
    .map((p) => p.item);

  // Deterministic vertical and horizontal position offsets per dialogue item
  const getDialogueYOffset = (id: number) => {
    const offsets = [
      -130, -50, 40, 110, -140, -60, 20, 90, -110, -80, 50, 120, -150, -30, 30,
      80, -90, -120, 60, 100, -130, -40, 40, 90, -110, -70, 30, 80
    ];
    return offsets[id % offsets.length];
  };

  const getDialogueXOffset = (id: number) => {
    const offsets = [
      -15, 25, -25, 30, -10, 35, -20, 20, -30, 15, -20, 35, 10, -25, 30,
      -15, 20, -30, 25, -10, 35, -20, 15, 30, -15, 25, -20, 20
    ];
    return offsets[id % offsets.length];
  };

  return (
    <div 
      className="w-full h-screen max-h-screen bg-[#effffb] flex flex-col items-center justify-center relative overflow-hidden px-0 py-4 select-none" 
      id="heart_feather_scene" 
      style={{ backgroundColor: '#effffb' }}
    >
      {/* Immersive Absolute Video Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 flex items-center justify-center">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover opacity-90 transition-opacity duration-1000"
        >
          <source src="/src/assets/video/涟漪.webm" type="video/webm" />
        </video>
      </div>

      {/* Background Rotating Wheel - unclipped full viewport overlay */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-[1] overflow-hidden select-none">
        <motion.img 
          src="/src/assets/images/车轮.png" 
          alt="Rotating Wheel" 
          className="absolute left-1/2 top-1/2 w-full h-full object-contain origin-center opacity-85"
          style={{ 
            x: '-50%', 
            y: 'calc(-50% - 120px)',
            scale: 1.35,
            rotate: progressRatio * 360,
          }}
        />
      </div>

      {/* STAGE CONTAINER IN CENTER */}
      <div className="w-full max-w-full h-[88vh] max-h-[760px] md:max-h-[820px] bg-transparent p-4 md:p-6 flex flex-col items-center justify-center relative z-10 overflow-hidden animate-fade-in translate-y-2">
        
        {assets.webm.heartFeatherOrganicEthers.enabled ? (
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none z-10"
          >
            <source src={assets.webm.heartFeatherOrganicEthers.src} type="video/webm" />
          </video>
        ) : null}

        {/* The Graphic Canvas displaying Silhouettes */}
        <div className="w-full flex-1 relative overflow-visible flex items-center justify-center min-h-0">
          
          {/* Revolving System Container */}
          <motion.div 
            className="relative w-full h-full flex items-center justify-center overflow-visible z-20"
            style={{ rotate: systemRotation }}
          >
            {/* LEFT SILHOUETTE (Girl) */}
            <motion.div 
              style={{ 
                x: leftX,
                opacity: girlOpacity,
                rotate: counterRotation,
                scale: 1 + progressRatio * 0.1,
              }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-[420px] md:w-[600px] md:h-[900px] transition-all duration-300 ease-out flex items-center justify-center pointer-events-none"
            >
              <div className="w-full h-full relative pointer-events-none animate-sway-left">
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  preload="auto"
                  className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(152,222,211,0.22)]"
                >
                  <source src="/src/assets/video/女孩.webm" type="video/webm" />
                </video>
              </div>
            </motion.div>

            {/* RIGHT SILHOUETTE (Fairy / Elf) */}
            <motion.div 
              style={{ 
                x: rightX,
                opacity: girlOpacity,
                rotate: counterRotation,
                scale: 1 + progressRatio * 0.1,
              }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-[420px] md:w-[600px] md:h-[900px] transition-all duration-300 ease-out flex items-center justify-center pointer-events-none"
            >
              <div className="w-full h-full relative pointer-events-none animate-sway-right">
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  preload="auto"
                  className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(255,184,209,0.22)]"
                >
                  <source src="/src/assets/video/妖精.webm" type="video/webm" />
                </video>
              </div>
            </motion.div>
          </motion.div>

          {/* 1. CIRCULAR / ELLIPTICAL DIALOGUE BUBBLES ON LEFT & RIGHT SIDES (Borderless, elliptical, up to 4 simultaneous bubbles with x/y offsets & exit pause) */}
          <div className="absolute inset-0 pointer-events-none z-40 flex items-center justify-between px-2 md:px-12">
            
            {/* LEFT SIDE: Girl Dialogue Bubbles */}
            <div className="w-1/2 max-w-[280px] md:max-w-[340px] relative h-full flex justify-start items-center pl-2 md:pl-6">
              <AnimatePresence>
                {visibleItems
                  .filter((d) => d.speaker === 'girl')
                  .map((d) => (
                    <motion.div
                      key={`girl-bubble-${d.id}`}
                      initial={{ opacity: 0, scale: 0.8, x: getDialogueXOffset(d.id), y: getDialogueYOffset(d.id) + 15 }}
                      animate={{ opacity: 1, scale: 1, x: getDialogueXOffset(d.id), y: getDialogueYOffset(d.id) }}
                      exit={{ opacity: 0, scale: 0.75, x: getDialogueXOffset(d.id), y: getDialogueYOffset(d.id) - 15 }}
                      transition={{ duration: 0.38, ease: 'easeOut' }}
                      style={{ borderRadius: '50% / 50%' }}
                      className="absolute px-6 py-4 md:px-8 md:py-5 bg-white/55 backdrop-blur-lg text-stone-900 shadow-[0_12px_36px_rgba(0,0,0,0.10)] border-0 flex items-center justify-center text-center max-w-[220px] md:max-w-[260px]"
                    >
                      <p className="text-xs md:text-sm font-wenkai font-bold leading-relaxed whitespace-pre-line text-center">
                        {isEnglish ? d.en : d.cn}
                      </p>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>

            {/* RIGHT SIDE: Elf Dialogue Bubbles */}
            <div className="w-1/2 max-w-[280px] md:max-w-[340px] relative h-full flex justify-end items-center pr-2 md:pr-6">
              <AnimatePresence>
                {visibleItems
                  .filter((d) => d.speaker === 'elf')
                  .map((d) => (
                    <motion.div
                      key={`elf-bubble-${d.id}`}
                      initial={{ opacity: 0, scale: 0.8, x: -getDialogueXOffset(d.id), y: getDialogueYOffset(d.id) + 15 }}
                      animate={{ opacity: 1, scale: 1, x: -getDialogueXOffset(d.id), y: getDialogueYOffset(d.id) }}
                      exit={{ opacity: 0, scale: 0.75, x: -getDialogueXOffset(d.id), y: getDialogueYOffset(d.id) - 15 }}
                      transition={{ duration: 0.38, ease: 'easeOut' }}
                      style={{ borderRadius: '50% / 50%' }}
                      className="absolute px-6 py-4 md:px-8 md:py-5 bg-teal-950/50 backdrop-blur-lg text-teal-100 shadow-[0_12px_36px_rgba(20,184,166,0.20)] border-0 flex items-center justify-center text-center max-w-[220px] md:max-w-[260px]"
                    >
                      <p className="text-xs md:text-sm font-wenkai font-bold leading-relaxed whitespace-pre-line text-center">
                        {isEnglish ? d.en : d.cn}
                      </p>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>

          </div>

          {/* 2. ORIGINAL INTERACTIVE FLOATING SPEECH FRAGMENTS (F3 converges to center as final progress text) */}
          {fragments.map((frag, idx) => {
            const progress = patience / 100;
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
            const scaleFactor = isMobile ? 0.65 : 1.0;
            
            // Hide upper two fragments when reaching 90%, leaving f3 in center
            const shouldHide = (idx === 0 || idx === 1) && patience >= 90;
            
            let initialX = -180;
            let initialY = -140;
            let finalX = 0;
            let finalY = 0;

            if (idx === 0) {
              initialX = -280;
              initialY = -180;
              finalX = 0;
              finalY = -120;
            } else if (idx === 1) {
              initialX = 260;
              initialY = -30;
              finalX = 0;
              finalY = 120;
            } else {
              // f3: "靠近一点，再靠近一点..."
              initialX = -220;
              initialY = 190;
              finalX = 0;
              if (patience >= 90) {
                const shiftRatio = (patience - 90) / 10;
                finalY = 120 - shiftRatio * 120; // Smoothly moves to 0 (center)
              } else {
                finalY = 120;
              }
            }

            const dynamicX = Math.round((initialX + (finalX - initialX) * progress) * scaleFactor);
            const dynamicY = Math.round((initialY + (finalY - initialY) * progress) * scaleFactor);
            const isUnlocked = patience >= (idx * 2 + 1) * 15;

            let blurAmount = 10;
            if (isResolved || patience >= 85) {
              blurAmount = 0;
            } else if (isUnlocked) {
              const delta = patience - (idx * 2 + 1) * 15;
              blurAmount = Math.max(0, 10 - delta * 2.0);
            }

            return (
              <button
                key={frag.id}
                onClick={() => handleFragmentClick(frag.id, isUnlocked)}
                style={{
                  transform: `translate(${dynamicX}px, ${dynamicY}px)`,
                  filter: blurAmount > 0 ? `blur(${blurAmount}px)` : undefined,
                  opacity: shouldHide ? 0 : (isUnlocked ? 1 : 0.6),
                  pointerEvents: shouldHide ? 'none' : 'auto',
                }}
                className={`absolute p-3.5 border border-stone-200/80 shadow-[2px_2px_8px_rgba(28,25,22,0.06)] rounded-xl transition-[transform,opacity,background-color,border-color,box-shadow] duration-300 cursor-pointer text-left max-w-[210px] md:max-w-[290px] z-35 ${
                  isResolved 
                    ? 'bg-stone-900/70 backdrop-blur-md text-white font-bold border-stone-800/80 shadow-[0_8px_24px_rgba(0,0,0,0.3)]' 
                    : isUnlocked 
                      ? 'bg-white/55 backdrop-blur-md text-stone-800' 
                      : 'bg-white/18 backdrop-blur-sm border-stone-300/40 opacity-60 text-stone-400'
                } ${visitedNodes.includes(frag.id) ? 'ring-2 ring-sky-300 outline-none shadow-[2px_2px_10px_rgba(56,189,248,0.15)]' : ''}`}
                title={isUnlocked ? (isEnglish ? 'Click to synthesize' : '点击拼合') : (isEnglish ? 'Requires Patience' : '对视度不足')}
              >
                <div className="flex items-start space-x-2">
                  <div className={`mt-0.5 shrink-0 ${isResolved ? 'text-white' : (isUnlocked ? 'text-sky-500' : 'text-stone-400')}`}>
                    {isResolved ? <Heart size={11} className="fill-white text-white" /> : <MessageCircle size={11} />}
                  </div>
                  <div>
                    <p className="text-[10px] md:text-[11px] tracking-wide leading-relaxed font-sans font-bold whitespace-pre-line">
                      {isUnlocked
                        ? (isEnglish ? frag.enClear : frag.clearText)
                        : (isEnglish ? frag.enScrambled : frag.scrambledText)}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}

        </div>

        {/* BOTTOM UNDERSTANDING PROGRESS SLIDER */}
        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl z-30 flex items-center space-x-4 px-4 md:px-8">
          
          {/* Reset button */}
          <button
            onClick={handleRestart}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/40 rounded-full transition-all duration-200 cursor-pointer shrink-0"
            title={isEnglish ? 'RESTART' : '重置'}
          >
            <RotateCcw size={15} />
          </button>

          {/* Custom Interactive Snail Slider Track */}
          <div 
            ref={trackRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="relative flex-1 h-12 flex items-center cursor-pointer select-none touch-none group"
            id="snail-slider-track"
          >
            {/* Visual Line Track */}
            <div className="relative w-full h-[3px] bg-[#e2edd9] rounded-full pointer-events-none overflow-visible">
              <div 
                className="h-full bg-[#3b6635] rounded-full" 
                style={{ 
                  width: `${patience}%`,
                  transition: isDragging ? 'none' : 'width 0.15s ease-out'
                }}
              />
              <div className="absolute -top-[12px] left-[15%] text-[10px] text-emerald-800/25 select-none pointer-events-none font-sans">🌱</div>
              <div className="absolute -top-[12px] left-[45%] text-[10px] text-emerald-800/20 select-none pointer-events-none font-sans">🌱</div>
              <div className="absolute -top-[12px] left-[75%] text-[10px] text-emerald-800/25 select-none pointer-events-none font-sans font-normal">🌱</div>
            </div>

            {/* Snail WebM Overlay */}
            <div 
              className="absolute pointer-events-none top-1/2 flex items-center justify-center w-[46px] h-[46px] shrink-0 select-none"
              style={{ 
                left: `${patience}%`,
                transform: `translate(-50%, calc(-50% + ${isDragging ? dragY : 0}px - 13px))`,
                transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), left 0.15s ease-out',
              }}
            >
              {isDragging ? (
                wasRestingOnDragStart ? (
                  <img 
                    key="drag-shell"
                    src="/src/assets/images/蜗牛壳.png" 
                    alt="Resting Snail Shell" 
                    className="w-[46px] h-[46px] object-contain shrink-0"
                  />
                ) : (
                  snailState === 'pickup' ? (
                    <video 
                      key="drag-pickup"
                      autoPlay 
                      muted 
                      playsInline 
                      preload="auto"
                      className="w-[46px] h-[46px] object-contain shrink-0"
                    >
                      <source src="/src/assets/video/蜗牛_pickup.webm" type="video/webm" />
                    </video>
                  ) : (
                    <video 
                      key="drag-afterpickup"
                      autoPlay 
                      loop 
                      muted 
                      playsInline 
                      preload="auto"
                      className="w-[46px] h-[46px] object-contain shrink-0"
                    >
                      <source src="/src/assets/video/蜗牛_afterpickup.webm" type="video/webm" />
                    </video>
                  )
                )
              ) : (
                behaviorMode === 'crawling' ? (
                  <video 
                    key="crawl"
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    preload="auto"
                    className="w-[46px] h-[46px] object-contain shrink-0"
                  >
                    <source src="/src/assets/video/蜗牛_爬行.webm" type="video/webm" />
                  </video>
                ) : behaviorMode === 'retracting' ? (
                  <video 
                    key="retract"
                    autoPlay 
                    muted 
                    playsInline 
                    preload="auto"
                    className="w-[46px] h-[46px] object-contain shrink-0"
                  >
                    <source src="/src/assets/video/蜗牛_缩进壳.webm" type="video/webm" />
                  </video>
                ) : (
                  <img 
                    key="shell"
                    src="/src/assets/images/蜗牛壳.png" 
                    alt="Snail Shell" 
                    className="w-[46px] h-[46px] object-contain shrink-0"
                  />
                )
              )}
            </div>
          </div>

          {/* Action / Percentage area */}
          <div className="flex items-center space-x-2 shrink-0">
            {Math.round(patience) >= 100 ? (
              <button
                onClick={() => {
                  audioManager.playUI1();
                  if (onComplete) onComplete();
                }}
                className="px-3.5 py-1 bg-white hover:bg-stone-50 text-stone-800 hover:text-stone-950 font-sans font-bold text-xs rounded-full border border-stone-200/90 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center space-x-1 shrink-0 animate-pulse active:scale-95"
                title={isEnglish ? 'Proceed to next scene' : '进入下一幕'}
              >
                <span>{isEnglish ? 'Next' : '前进'}</span>
                <span className="text-xs font-bold">→</span>
              </button>
            ) : (
              <div className="text-[11px] font-mono font-black text-[#3b6635] bg-[#e2edd9]/60 px-2 py-0.5 rounded border border-[#e2edd9]">
                {Math.round(patience)}%
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

