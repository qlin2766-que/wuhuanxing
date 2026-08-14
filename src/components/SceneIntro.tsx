import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Cpu, 
  GraduationCap, 
  Layers, 
  User, 
  Eye, 
  CornerDownRight,
  Camera,
  RotateCcw,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { audioManager } from '../utils/audio';
import { assets } from '../utils/assets';

interface SceneIntroProps {
  isEnglish: boolean;
  onDialogueComplete?: () => void;
  onReturnToPortfolio?: () => void;
}

interface FactNode {
  id: string;
  category: string;
  enCategory: string;
  title: string;
  enTitle: string;
  gradientId: string;
  activeGradientId: string;
  borderColor: string;
  textColor: string;
  icon: React.ReactNode;
  details: string[];
  enDetails: string[];
  summary?: string;
  enSummary?: string;
}

export const SceneIntro: React.FC<SceneIntroProps> = ({ isEnglish, onDialogueComplete, onReturnToPortfolio }) => {
  const [activeFactId, setActiveFactId] = useState<string>('about');
  const [hoveredBlob, setHoveredBlob] = useState<string | null>(null);

  // Live customizable avatar system
  const [customAvatar, setCustomAvatar] = useState<string>(() => {
    return localStorage.getItem('qlin_custom_avatar') || '';
  });

  // Floating Narrative Bubbles State and Sequential Auto-play
  const [bubbleExpanded, setBubbleExpanded] = useState<'encounter' | 'project' | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const cancelAutoPlayAndComplete = () => {
    setIsAutoPlaying(false);
    if (onDialogueComplete) {
      onDialogueComplete();
    }
  };

  useEffect(() => {
    if (!isAutoPlaying) return;

    // Expand first bubble at 800ms
    const t1 = setTimeout(() => {
      setBubbleExpanded('encounter');
      audioManager.playWaterDrop();
    }, 800);

    // Expand second bubble at 6000ms
    const t2 = setTimeout(() => {
      setBubbleExpanded('project');
      audioManager.playWaterDrop();
    }, 6000);

    // Complete and close both bubbles at 11500ms
    const t3 = setTimeout(() => {
      setBubbleExpanded(null);
      if (onDialogueComplete) {
        onDialogueComplete();
      }
    }, 11500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isAutoPlaying, onDialogueComplete]);

  const handleBubbleSelect = (id: 'encounter' | 'project') => {
    cancelAutoPlayAndComplete();
    audioManager.playChime();
    if (bubbleExpanded === id) {
      setBubbleExpanded(null);
    } else {
      setBubbleExpanded(id);
    }
  };
  
  // Anchor coordinates that stay perfectly locked to prevent drifting out of screen
  // Configured safely inside a 440x300 viewBox with generous spacing for 1.3x enlarged bubbles
  const [blobs, setBlobs] = useState([
    { 
      id: 'about', 
      baseCx: 95, 
      baseCy: 75, 
      cx: 95, 
      cy: 75, 
      r: 38, 
      speed: 1.1, 
      xDir: 1, 
      yDir: -1,
      path: assets.svgs.introBlobAbout
    },
    { 
      id: 'learning', 
      baseCx: 345, 
      baseCy: 75, 
      cx: 345, 
      cy: 75, 
      r: 38, 
      speed: 1.4, 
      xDir: -1, 
      yDir: 1,
      path: "M -35,-20 C -15,-38 25,-35 35,-15 C 45,5 30,38 5,38 C -20,38 -38,10 -35,-20 Z"
    },
    { 
      id: 'exploring', 
      baseCx: 220, 
      baseCy: 150, 
      cx: 220, 
      cy: 150, 
      r: 38, 
      speed: 1.0, 
      xDir: 1, 
      yDir: 1,
      path: "M -25,-35 C 5,-38 35,-25 35,-5 C 35,15 15,38 -15,38 C -35,38 -38,15 -38,-15 C -38,-30 -30,-35 -25,-35 Z"
    },
    { 
      id: 'forms', 
      baseCx: 95, 
      baseCy: 225, 
      cx: 95, 
      cy: 225, 
      r: 38, 
      speed: 0.8, 
      xDir: -1, 
      yDir: -1,
      path: "M -38,-15 C -38,-35 -10,-35 15,-30 C 35,-25 38,-10 32,20 C 26,38 -15,38 -30,22 C -38,12 -38,5 -38,-15 Z"
    },
    { 
      id: 'tools', 
      baseCx: 345, 
      baseCy: 225, 
      cx: 345, 
      cy: 225, 
      r: 38, 
      speed: 1.5, 
      xDir: 1, 
      yDir: -1,
      path: "M -30,-30 C -10,-38 20,-32 35,-10 C 45,10 32,35 5,38 C -20,40 -38,20 -38,-5 C -38,-20 -35,-25 -30,-30 Z"
    }
  ]);

  // Handle high-precision sinusoidal oscillations around fixed base centers (0 drift guarantee)
  useEffect(() => {
    let animId: number;
    const startTime = Date.now();
    const updatePositions = () => {
      const elapsed = (Date.now() - startTime) * 0.001;
      setBlobs((prev) =>
        prev.map((b) => {
          // Dynamic sinusoidal floating oscillation with expanded amplitude
          const waveX = Math.sin(elapsed * b.speed * 1.2) * 64 * b.xDir;
          const waveY = Math.cos(elapsed * b.speed * 1.2 + b.baseCx) * 48 * b.yDir;
          return {
            ...b,
            cx: b.baseCx + waveX,
            cy: b.baseCy + waveY
          };
        })
      );
      animId = requestAnimationFrame(updatePositions);
    };
    animId = requestAnimationFrame(updatePositions);
    return () => cancelAnimationFrame(animId);
  }, []);

  const facts: FactNode[] = [
    {
      id: 'about',
      category: '关于我',
      enCategory: 'About',
      title: '',
      enTitle: 'Evaluation, Identity & Self-Awareness',
      gradientId: 'grad-about',
      activeGradientId: 'grad-about-active',
      borderColor: 'border-amber-400',
      textColor: 'text-amber-850',
      icon: <User size={14} />,
      details: [
        '    我的创作通常围绕以下主题展开：',
        '• 我喜欢的 — 猫、音乐、情感体验、自我觉察、价值观表达',
        '• 如果有机会我也可以做些Problem-driven的设计',
        '• 也许能够让人更轻松的、不需要那么多思考的东西',
        '. ',
        '    我有以下几个爱好：',
        '• 听歌、跳舞、追剧追综艺看电影、骚扰小猫、游戏、旅行',
        '. ',
        '    让我形容我自己：',
        '• 自信坚决 — 擅长做决策并且一去不回，有时候会不够谨慎',
        '• 认真、缓慢 — 对待在意的事会再三思考，反复斟酌，可能显得反应迟缓',
        '• 擅长反思 — 也许我能做得更好'
      ],
      enDetails: [
        '    My creations usually revolve around these themes:',
        '• What I like — cats, music, emotional experiences, self-awareness, value expression',
        '• Given the opportunity, I can also do problem-driven design',
        '• Perhaps things that make people feel relaxed without needing too much thinking',
        '. ',
        '    My hobbies include:',
        '• Listening to music, dancing, watching shows/movies, bothering cats, gaming, traveling',
        '. ',
        '    How I would describe myself:',
        '• Confident & Decisive — Good at making decisions and moving forward, sometimes a bit reckless',
        '• Serious & Deliberate — Thinking thoroughly about things I care about, which might seem slow at times',
        '• Good at Reflection — Always believing I can do better'
      ]
    },
    {
      id: 'learning',
      category: '正在学习',
      enCategory: 'Learning',
      title: '',
      enTitle: 'My Ongoing Learning Path',
      gradientId: 'grad-learning',
      activeGradientId: 'grad-learning-active',
      borderColor: 'border-teal-400',
      textColor: 'text-teal-900',
      icon: <GraduationCap size={14} />,
      summary: '包括但不限于：',
      enSummary: 'Including but not limited to: ',
      details: [
        '• UI/UX ',
        '• 游戏设计',
        '• Unreal Engine',
        '• TouchDesigner ',
        '• Creative Coding ',
        '• 技术美术：实时图形学基础，着色器编程、粒子解算渲染'
      ],
      enDetails: [
        '• UI/UX Interface architectures and dynamic flow optimizations',
        '• Game Level mechanics and deep pacing calibration parameters',
        '• Graphic structures, shader matrices, and performance fluid simulations',
        '• Unreal Engine blueprints and high-fidelity physics stack environments',
        '• TouchDesigner multisource input mappings and sensory device bindings',
        '• Creative Coding high-FPS performance tunings and mathematical graphics'
      ]
    },
    {
      id: 'forms',
      category: '喜欢的创作形式',
      enCategory: 'Preferred Mediums',
      title: '',
      enTitle: 'Mediums of Visual Expression',
      gradientId: 'grad-forms',
      activeGradientId: 'grad-forms-active',
      borderColor: 'border-indigo-400',
      textColor: 'text-indigo-900',
      icon: <Layers size={14} />,
      summary: '我会被深刻、真诚、真实的事物所吸引。',
      enSummary: 'I am attracted by something Profound, sincere, or authentic.',
      details: [
        '• 视觉小说',
        '• 互动叙事 ',
        '• 独立游戏 ',
        '• 交互装置 ',
        '• 手工 '
      ],
      enDetails: [
        '• Visual Novels ',
        '• Interactive Stories',
        '• Indie Games',
        '• Interactive Installations',
        '• Handwork '
      ]
    },
    {
      id: 'tools',
      category: '常用工具',
      enCategory: 'Tools & Systems',
      title: '',
      enTitle: 'Tectonic Instruments',
      gradientId: 'grad-tools',
      activeGradientId: 'grad-tools-active',
      borderColor: 'border-purple-400',
      textColor: 'text-purple-900',
      icon: <Cpu size={14} />,
      summary: '包括但不限于：',
      enSummary: 'Including but not limited to: ',
      details: [
        '• 设计：Figma / Photoshop / Illustrator / After Effects',
        '• 三维：Blender ',
        '• 交互艺术：TouchDesigner ',
        '• 游戏：Unreal Engine / Unity'
      ],
      enDetails: [
        '• Ideation & Visuals: Figma / Photoshop / Illustrator / After Effects',
        '• 3D Geometries: Blender ',
        '• Interactions: TouchDesigner',
        '• Engine : Unreal Engine / Unity (C# structural loops and Blueprint mechanics)'
      ]
    },
    {
      id: 'exploring',
      category: '正在探索',
      enCategory: 'Exploring',
      title: '',
      enTitle: 'Bridging Tech & Sensory Fields',
      gradientId: 'grad-exploring',
      activeGradientId: 'grad-exploring-active',
      borderColor: 'border-orange-400',
      textColor: 'text-orange-900',
      icon: <Sparkles size={14} />,
      details: [
        '技术与艺术之间的桥梁。',
        '我喜欢那些既需要逻辑，又需要感性的工作。',
        '因此比起纯美术或纯开发，我更容易被介于两者之间的位置吸引。'
      ],
      enDetails: [
        'Brige between technology and art.',
        'I love working in domains that call both for logic and hyper-attentive emotional receptors.',
        'Rather than limiting myself to pure decoration or purely abstract code loops, I drift naturally toward the edge between both.'
      ]
    }
  ];

  const focusItems = [
    { title: 'UI / UX Design', details: '界面美学、精微响应结构与顺畅动效交互', enDetails: 'Interface aesthetics, dynamic microstructures and polished layouts' },
    { title: 'Game Design', details: '以丰富叙事张力与物理隐喻为核心的游戏主轴', enDetails: 'Storytelling tension and physical metaphorical mechanics' },
    { title: 'Technical Art', details: '衔接感性着色渲染艺术与硬核引擎逻辑管线', enDetails: 'Shader artwork and real-time developer rendering arrays' },
    { title: 'Interactive Installation', details: '链接实体展陈、动作追踪与多通道交互', enDetails: 'Interfacing body sensors, light, and projection' },
    { title: 'Creative Coding', details: '前沿算式艺术、生成式动态画布及网页物理交互', enDetails: 'Generative physics graphics and experimental code rendering' }
  ];

  const handleBlobHover = (id: string | null) => {
    setHoveredBlob(id);
    if (id) {
      audioManager.playWaterDrop();
    }
  };

  const handleBlobClick = (id: string) => {
    setActiveFactId(id);
    audioManager.playChime();
  };

  const activeFact = facts.find((f) => f.id === activeFactId) || facts[0];

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setCustomAvatar(base64String);
        localStorage.setItem('qlin_custom_avatar', base64String);
        audioManager.playChime();
      };
      reader.readAsDataURL(file);
    }
  };

  const resetAvatar = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomAvatar('');
    localStorage.removeItem('qlin_custom_avatar');
    audioManager.playWaterDrop();
  };

  const defaultAvatar = assets.images.qlinProfile.src;
  const avatarPath = customAvatar || defaultAvatar;

  return (
    <div 
      className="w-full min-h-screen bg-[#effffb] flex flex-col xl:flex-row items-stretch justify-start relative overflow-x-hidden pt-24 pb-32 px-4 md:px-8 xl:px-12 select-none gap-0" 
      id="scene_intro"
      style={{ backgroundColor: '#effffb' }}
    >
      {/* ==================================================================== */}
      {/* PLACEHOLDER: WEB M VIDEO BACKGROUND LAYER */}
      {/* ==================================================================== */}
      {/* If assets.webm.breathingTideBackground.enabled is toggle-set to true,
          it replaces the clean off-white background with a stunning responsive looping video layer. */}
      {assets.webm.breathingTideBackground.enabled ? (
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          preload="auto"
          poster={assets.webm.breathingTideBackground.poster}
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0"
        >
          <source src={assets.webm.breathingTideBackground.src} type="video/webm" />
        </video>
      ) : null}

      {/* ==================================================================== */}
      {/* PLACEHOLDER: GLB 3D INTERACTIVE STUDIO CANVAS */}
      {/* ==================================================================== */}
      {/* Set assets.glb.isometricAvatarRoom.enabled = true to render a full Canvas in the background. */}
      {assets.glb.isometricAvatarRoom.enabled ? (
        <div className="absolute inset-0 pointer-events-none z-0 opacity-15" id="glb_avatar_room_placeholder">
          {/* Client can safely mount <Canvas> and draft ThreeJS models here. Model URL is loaded via assets.glb.isometricAvatarRoom.modelUrl */}
        </div>
      ) : null}

      {/* ==================================================================== */}
      {/* PLACEHOLDER: LOTTIE AMBIENT ANIMATION LAYER */}
      {/* ==================================================================== */}
      {/* Upgrade background vector paths to immersive interactive vectors. */}
      {assets.lottie.introAmbient.enabled ? (
        <div className="absolute inset-0 pointer-events-none z-0" id="lottie_intro_ambient_placeholder">
          {/* Client can safely mount Lottie Player here, loading jsonUrl from assets.lottie.introAmbient.jsonUrl */}
        </div>
      ) : null}

      {/* Soft curved technical line overlays instead of harsh straight lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40">
        <path d={assets.svgs.introBackgroundLines.leftCurve} fill="none" stroke="#32c0b9" strokeWidth="0.6" strokeDasharray="2 4" />
        <path d={assets.svgs.introBackgroundLines.topHorizontal} fill="none" stroke="#cbf0ed" strokeWidth="0.6" />
      </svg>

      {/* COLUMN 1: Basic Profile (Left 42% - Zero rounded corners) */}
      <section className="w-full xl:w-[42%] flex flex-col justify-start z-10 relative shrink-0 xl:pr-8 py-6 border-b xl:border-b-0 border-stone-100 space-y-6">
        
        {/* Profile Card with Horizontal side-by-side split */}
        <div className="bg-transparent rounded-none border border-stone-200/60 p-4 md:p-5 relative flex flex-col" id="basic_profile_card">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 sm:items-stretch items-start select-none">
            
            {/* Core Info Details - Left Side (67% width / sm:col-span-8) */}
            <div className="sm:col-span-8 flex flex-col justify-between h-full space-y-3">
              <div>
                <div className="text-[9px] font-mono tracking-[0.25em] text-stone-400 uppercase font-bold leading-none">
                  CREATOR FILE // 02
                </div>
                <h2 className="font-sans text-xl sm:text-2xl font-black text-stone-900 tracking-tight mt-1.5">
                  林经纬 QLin
                </h2>
                <p className="font-mono text-[9px] text-stone-500 font-bold uppercase tracking-wider mt-0.5">
                  DESIGNER & DEVELOPER
                </p>
              </div>

              <div className="border-t border-dashed border-stone-200 pt-2 space-y-2">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2 text-xs text-stone-800">
                    <span className="w-1 h-1 bg-stone-400" />
                    <span className="font-bold select-all">{isEnglish ? 'Communication University of China' : '中国传媒大学'}</span>
                  </div>
                  <div className="text-[10px] text-stone-500 italic pl-3 select-all font-light">
                    {isEnglish ? 'New Media Art Major' : '新媒体艺术专业'}
                  </div>
                </div>

                {/* Vertical peer metadata: Creative Role & Focus Fields perfectly nested vertical siblings */}
                <div className="bg-stone-50/50 border border-stone-200/35 p-2.5 space-y-3">
                  <div>
                    <div className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-wider select-none">
                      {isEnglish ? 'CREATIVE ROLE' : '创作定位'}
                    </div>
                    <div className="text-[11px] text-stone-800 font-sans mt-0.5 font-bold leading-tight">
                      {isEnglish ? 'New Media Art Designer & Interaction Author' : '新媒体艺术设计师 / 交互创作者'}
                    </div>
                  </div>

                  <div className="border-t border-stone-200/40 pt-2">
                    <div className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-wider select-none">
                      {isEnglish ? 'FOCUS AREAS' : '关注方向'}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {focusItems.map((item, idx) => (
                        <span 
                          key={idx} 
                          title={isEnglish ? item.enDetails : item.details}
                          className="inline-block text-[9px] px-1.5 py-0.5 bg-white text-stone-800 border border-stone-200/80 hover:border-stone-400 font-bold transition-all duration-150 cursor-help"
                        >
                          {item.title}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Elegant Portrait Frame - Right Side (33% width / sm:col-span-4) with change action */}
            <div className="sm:col-span-4 relative bg-stone-50 border border-stone-200 rounded-none overflow-hidden block self-start w-full group">
              <div className="aspect-[3/4] w-full relative">
                <img 
                   src={avatarPath}
                   referrerPolicy="no-referrer"
                   alt="QLin Profile Frame"
                   className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                   onError={(e) => {
                     // Fallback to default block if image loaded fails
                     (e.target as HTMLImageElement).src = defaultAvatar;
                   }}
                />
                
                {/* Sleek hover overlay to click-to-change image */}
                <label className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center cursor-pointer text-white select-none">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleAvatarChange} 
                    className="hidden" 
                  />
                  <Camera size={18} className="mb-1 text-amber-200 animate-pulse" />
                  <span className="text-[9px] font-mono tracking-widest font-bold uppercase text-stone-100">
                    {isEnglish ? 'REPLACE IMAGE' : '更换图片'}
                  </span>
                  <span className="text-[7px] text-stone-300 font-mono mt-0.5">
                    {isEnglish ? 'DRAG OR CLICK' : '直接点击或拖入'}
                  </span>
                </label>

                {/* Optional reset button if custom image is set */}
                {customAvatar && (
                  <button
                    onClick={resetAvatar}
                    className="absolute top-2 right-2 bg-stone-950/85 hover:bg-stone-900 text-stone-300 hover:text-white p-1 border border-stone-800 transition-colors cursor-pointer z-20"
                    title={isEnglish ? "Reset default image" : "恢复默认图片"}
                  >
                    <RotateCcw size={10} />
                  </button>
                )}

                {/* Minimal aesthetic camera finder focus markings */}
                <div className="absolute top-2 left-2 w-1 h-1 border-t border-l border-stone-300 pointer-events-none" />
                {!customAvatar && <div className="absolute top-2 right-2 w-1 h-1 border-t border-r border-stone-300 pointer-events-none" />}
                <div className="absolute bottom-2 left-2 w-1 h-1 border-b border-l border-stone-300 pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-1 h-1 border-b border-r border-stone-300 pointer-events-none" />
              </div>
            </div>
            
          </div>
        </div>

      </section>

      {/* COLUMN 2: Interactive Mind Spheres Chamber & Readings (Right 58% - Side-by-side Layout) */}
      <section className="w-full xl:w-[58%] flex flex-col justify-start z-10 relative xl:pl-8 py-6">
        <div className="flex flex-col lg:flex-row items-stretch gap-5 w-full h-full min-h-[360px]">
          
          {/* LEFT PART: Floating Bubble Web Workspace - Uni-color white elegant canvas */}
          <div className="w-full lg:w-[48%] bg-white/70 rounded-none border border-stone-200/60 p-4 relative flex flex-col justify-between" id="mind_bubble_chamber">
            
            <div className="z-20">
              <h4 className="font-sans text-xs font-black text-stone-800 uppercase tracking-widest flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-stone-400 animate-pulse" />
                <span>{isEnglish ? 'More' : '更多'}</span>
              </h4>
              <p className="text-[8px] text-stone-400 font-mono uppercase tracking-wider mt-0.5 leading-tight">
                {isEnglish ? 'Touch beads to unfold detailed nodes' : '点击不规则白气泡，展开对应板块'}
              </p>
            </div>

            {/* SVG canvas with precision synchronized coordinates */}
            <div className="w-full h-[290px] md:h-[310px] relative overflow-hidden mt-2">
              <svg className="w-full h-full animate-fade-in" viewBox="0 0 440 300" preserveAspectRatio="xMidYMid meet">
                
                {/* Defs containing drop shadows */}
                <defs>
                  <filter id="soft-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Soft curved axis lines instead of hard straight lines */}
                <path d="M 0,150 Q 220,135 440,150" fill="none" stroke="#cbf0ed" strokeWidth="0.5" strokeDasharray="3 5" />
                <path d="M 220,0 Q 205,150 220,300" fill="none" stroke="#cbf0ed" strokeWidth="0.5" strokeDasharray="3 5" />
                <circle cx="220" cy="150" r="105" fill="none" stroke="#cbf0ed" strokeWidth="0.6" strokeDasharray="1 5" />
                
                {/* Dynamically Oscillated Nodes mapping - 1.17x scaled white elegant blobs */}
                {blobs.map((blob) => {
                  const fact = facts.find((f) => f.id === blob.id)!;
                  const isHovered = hoveredBlob === blob.id;
                  const isActive = activeFactId === blob.id;
                  const scaleVal = isActive ? 1.20 : isHovered ? 1.18 : 1.14;

                  return (
                    <g
                      key={blob.id}
                      className="cursor-pointer select-none transition-transform duration-300"
                      transform={`translate(${blob.cx}, ${blob.cy}) scale(${scaleVal})`}
                      onMouseEnter={() => handleBlobHover(blob.id)}
                      onMouseLeave={() => handleBlobHover(null)}
                      onClick={() => handleBlobClick(blob.id)}
                    >
                      {/* Outer boundary echo ring */}
                      <path
                        d={blob.path}
                        fill="none"
                        stroke={isActive ? '#78716C' : isHovered ? '#A8A29E' : 'rgba(0,0,0,0.08)'}
                        strokeWidth={0.8 / scaleVal}
                        strokeDasharray={isHovered && !isActive ? "2 2" : "none"}
                        transform="scale(1.08)"
                        className="transition-all duration-300 origin-center"
                      />

                      {/* Main Aesthetic Irregular Pure White Blob Shape */}
                      <path
                        d={blob.path}
                        fill="#FFFFFF"
                        stroke={isActive ? '#44403C' : isHovered ? '#78716C' : '#D6D3D1'}
                        strokeWidth={(isActive ? 1.4 : 1.0) / scaleVal}
                        filter={isActive ? 'url(#soft-glow)' : 'none'}
                        className="transition-all duration-300 origin-center"
                      />

                      {/* Unified Central Icon Representation (reduced by 2px) */}
                      <g 
                        transform="translate(-7, -15)" 
                        className={`transition-colors duration-300 ${isActive ? 'text-stone-900' : 'text-stone-700'}`}
                      >
                        {React.cloneElement(fact.icon as React.ReactElement, { size: 14 })}
                      </g>

                      {/* Node Text labels - centered directly inside white bubble (reduced by 2px) */}
                      <text
                        x="0"
                        y="10"
                        textAnchor="middle"
                        className={`font-sans text-[7px] md:text-[8px] font-bold select-none tracking-wider pointer-events-none transition-colors duration-300 ${
                          isActive ? 'fill-stone-900 font-black' : 'fill-stone-800'
                        }`}
                      >
                        {isEnglish ? fact.enCategory : fact.category}
                      </text>
                    </g>
                  );
                })}

              </svg>
            </div>
            
            <div className="text-[8px] text-stone-400 font-mono uppercase text-right leading-none mt-1 select-none">
              COORD // FLOAT // ENABLED
            </div>
          </div>

          {/* RIGHT PART: Dynamic Details Panel - Museum portfolio text board layout */}
          <div 
            className="w-full lg:w-[52%] bg-white rounded-none border border-stone-200/80 p-5 shadow-xs transition-all duration-300 relative flex flex-col justify-between"
            id="mind_details_panel"
          >
            <div>
              {/* Header Metadata */}
              <div className="flex justify-between items-center pb-3 border-b border-stone-100 select-none mb-3 text-[9px] font-mono">
                <span className="px-2 py-0.5 bg-stone-900 text-stone-100 font-bold tracking-widest uppercase">
                  {isEnglish ? activeFact.enCategory : activeFact.category}
                </span>
                <span className="text-stone-400 font-bold">NODE: 0{facts.indexOf(activeFact) + 1}</span>
              </div>

              {/* Text Content Block */}
              <div className="space-y-3.5 animate-fade-in select-text overflow-y-auto max-h-[190px] pr-1">
                <h4 className="font-sans text-xs md:text-sm font-black text-stone-900 uppercase tracking-widest">
                  {isEnglish ? activeFact.enTitle : activeFact.title}
                </h4>

                {activeFact.summary && (
                  <p className="text-[11px] text-stone-600 font-sans leading-relaxed tracking-wide bg-stone-50/50 p-2.5 border-l border-stone-400 font-light select-text">
                    {isEnglish ? activeFact.enSummary : activeFact.summary}
                  </p>
                )}

                <ul className="space-y-1.5 select-text">
                  {(isEnglish ? activeFact.enDetails : activeFact.details).map((line, lIdx) => {
                    const isHighlight = line.includes('—') || line.includes(':') || line.startsWith('•');
                    return (
                      <li 
                        key={lIdx} 
                        className={`text-[11px] md:text-xs leading-relaxed tracking-wider font-light ${
                          isHighlight ? 'text-stone-900 font-bold' : 'text-stone-550 font-light'
                        }`}
                      >
                        {line}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            
            {/* Flat Architectural Details Footer */}
            <div className="border-t border-stone-100 pt-3 flex items-center justify-between text-[10px] font-mono text-stone-400 select-none">
              <span>[ SYSTEM OVERVIEW ]</span>
              <span className="font-bold text-stone-500 uppercase tracking-wider">{isEnglish ? 'TACTILE SENSING' : '数字体温 // OK'}</span>
            </div>
          </div>

        </div>
      </section>

      {/* Floating Narrative Bubbles Overlay - Slowly drifting across the page */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
        
        {/* Bubble 1: Encounter ("你好") */}
        <motion.div
          className="absolute left-[6%] md:left-[10%] top-[12%] sm:top-[16%] pointer-events-auto flex flex-col items-center"
          animate={{ 
            x: [0, 50, -30, 40, 0], 
            y: [-40, 180, -90, 140, -40], 
            rotate: [0, 6, -4, 4, 0] 
          }}
          transition={{ 
            duration: 26, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          onMouseEnter={() => {
            cancelAutoPlayAndComplete();
            setBubbleExpanded('encounter');
            setHoveredBlob('narrative-encounter');
          }}
          onMouseLeave={() => {
            setBubbleExpanded(null);
            setHoveredBlob(null);
          }}
        >
          {/* Bubble Circle */}
          <motion.div
            whileHover={{ scale: 1.08 }}
            className="w-24 h-24 flex items-center justify-center cursor-pointer relative select-none"
          >
            <svg className="absolute inset-0 w-full h-full filter drop-shadow-[0_6px_16px_rgba(0,0,0,0.04)]" viewBox="-50 -50 100 100">
              <path
                d="M -35,-20 C -15,-38 25,-35 35,-15 C 45,5 30,38 5,38 C -20,38 -38,10 -35,-20 Z"
                fill="#FFFFFF"
                stroke={hoveredBlob === 'narrative-encounter' ? '#78716C' : '#E6E4D9'}
                strokeWidth="0.8"
                className="transition-colors duration-300"
              />
            </svg>
            <span className="relative z-10 text-stone-850 font-serif font-black text-xs tracking-wider select-none">
              {isEnglish ? 'Hello' : '你好'}
            </span>
          </motion.div>

          {/* Inline elegant hover tooltip to the right with slight overlap */}
          <AnimatePresence>
            {bubbleExpanded === 'encounter' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, x: -8, y: "-50%" }}
                animate={{ opacity: 1, scale: 1, x: 0, y: "-50%" }}
                exit={{ opacity: 0, scale: 0.95, x: -8, y: "-50%" }}
                transition={{ duration: 0.2 }}
                className="absolute left-[80px] top-1/2 w-[280px] bg-white/95 border border-stone-200/80 p-4.5 shadow-xl rounded-[4px] text-left z-50 pointer-events-auto"
              >
                <p className="text-xs sm:text-[13px] text-stone-800 leading-relaxed font-wenkai tracking-wide select-text">
                  {isEnglish 
                    ? "Hello, I am Lin, currently studying New Media Art at the Communication University of China. My creations mainly revolve around games, interactive websites, motion graphics, and digital media, hoping that technology serves not only functions but also becomes a part of expression."
                    : "你好，我是林，目前就读于中国传媒大学新媒体艺术专业。我的创作通常围绕游戏、交互网页、动态影像与数字媒介展开。我喜欢把抽象的感受转换成能够被体验的交互，希望技术不仅服务于功能，也能够成为表达的一部分。"
                  }
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Bubble 2: Project ("物换星") */}
        <motion.div
          className="absolute right-[22%] md:right-[34%] top-[14%] sm:top-[18%] pointer-events-auto flex flex-col items-center"
          animate={{ 
            x: [0, -50, 30, -40, 0], 
            y: [-30, 200, -80, 150, -30], 
            rotate: [0, -4, 6, -3, 0] 
          }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1.5
          }}
          onMouseEnter={() => {
            cancelAutoPlayAndComplete();
            setBubbleExpanded('project');
            setHoveredBlob('narrative-project');
          }}
          onMouseLeave={() => {
            setBubbleExpanded(null);
            setHoveredBlob(null);
          }}
        >
          {/* Bubble Circle */}
          <motion.div
            whileHover={{ scale: 1.08 }}
            className="w-24 h-24 flex items-center justify-center cursor-pointer relative select-none"
          >
            <svg className="absolute inset-0 w-full h-full filter drop-shadow-[0_6px_16px_rgba(0,0,0,0.04)]" viewBox="-50 -50 100 100">
              <path
                d="M -25,-35 C 5,-38 35,-25 35,-5 C 35,15 15,38 -15,38 C -35,38 -38,15 -38,-15 C -38,-30 -30,-35 -25,-35 Z"
                fill="#FFFFFF"
                stroke={hoveredBlob === 'narrative-project' ? '#78716C' : '#E6E4D9'}
                strokeWidth="0.8"
                className="transition-colors duration-300"
              />
            </svg>
            <span className="relative z-10 text-stone-850 font-serif font-black text-xs tracking-wider select-none">
              {isEnglish ? 'Wuhuanxing' : '物换星'}
            </span>
          </motion.div>

          {/* Inline elegant hover tooltip to the left with slight overlap */}
          <AnimatePresence>
            {bubbleExpanded === 'project' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, x: 8, y: "-50%" }}
                animate={{ opacity: 1, scale: 1, x: 0, y: "-50%" }}
                exit={{ opacity: 0, scale: 0.95, x: 8, y: "-50%" }}
                transition={{ duration: 0.2 }}
                className="absolute right-[80px] top-1/2 w-[280px] bg-white/95 border border-stone-200/80 p-4.5 shadow-xl rounded-[4px] text-left z-50 pointer-events-auto"
              >
                <p className="text-xs sm:text-[13px] text-stone-800 leading-relaxed font-wenkai tracking-wide select-text">
                  {isEnglish 
                    ? '"Wuhuanxing" was originally a visual novel. Due to the large scale of the project, I reorganized part of it into this interactive web page. It is both a story and my portfolio.'
                    : "《物换星》最初是一部视觉小说。由于项目规模较大，我将其中的一部分重新整理，制作成了现在这个交互网页。它既是一段故事，也是我的作品集。"
                  }
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </div>

      {/* Chapter Indicator Label */}
      <div className="absolute bottom-6 left-12 hidden xl:block pointer-events-none select-none">
        <span className="font-mono text-[9px] text-slate-300 tracking-[0.25em] uppercase">
          Wuhuanxing // Section 02: Structural Mind Coordinates
        </span>
      </div>
    </div>
  );
};
