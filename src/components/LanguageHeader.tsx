import React from 'react';
import { Volume2, VolumeX, Globe } from 'lucide-react';
import { SceneId } from '../types';
import { audioManager } from '../utils/audio';

interface LanguageHeaderProps {
  isEnglish: boolean;
  setIsEnglish: (val: boolean) => void;
  isMuted: boolean;
  setIsMuted: (val: boolean) => void;
  currentScene: SceneId;
  setCurrentScene: (scene: SceneId) => void;
  sceneOrder: SceneId[];
  sceneNames: Record<SceneId, { cn: string; en: string }>;
}

export const LanguageHeader: React.FC<LanguageHeaderProps> = ({
  isEnglish,
  setIsEnglish,
  isMuted,
  setIsMuted,
  currentScene,
  setCurrentScene,
  sceneOrder,
  sceneNames
}) => {
  const [isMenuHovered, setIsMenuHovered] = React.useState(false);
  const [hoveredScene, setHoveredScene] = React.useState<string | null>(null);

  const toggleMute = () => {
    const nextMuted = audioManager.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      audioManager.playClick();
    }
  };

  const handleGlobeClick = () => {
    setIsEnglish(!isEnglish);
    audioManager.playWaterDrop();
  };

  const handleSceneJump = (sceneId: SceneId) => {
    setCurrentScene(sceneId);
    audioManager.playUI2();
  };

  const isDarkScene = currentScene === 'menu' || currentScene === 'wisdom_tooth';

  return (
    <header 
      className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-2.5 backdrop-blur-md transition-all duration-500" 
      id="header_nav" 
      style={{ 
        backgroundColor: 'rgba(203, 240, 237, 0.35)', 
        borderBottom: '1.1px solid rgba(203, 240, 237, 0.2)',
        boxShadow: '0 2px 10px -4px rgba(0,0,0,0.06)'
      }}
    >
      {/* Brand Title with Menu Return Button */}
      <div 
        className="flex items-center space-x-3 cursor-pointer group"
        onClick={() => handleSceneJump('menu')}
        onMouseEnter={() => setIsMenuHovered(true)}
        onMouseLeave={() => setIsMenuHovered(false)}
        title={isEnglish ? "Return to Menu" : "返回主菜单"}
      >
        <div className="w-20 h-20 md:w-24 md:h-24 relative flex items-center justify-center transition-transform duration-200 group-hover:scale-105 shrink-0 -mb-8 md:-mb-10 translate-y-1 -ml-5 md:-ml-8">
          <img 
            src={isMenuHovered ? "/src/assets/UI/menu-hover.png" : "/src/assets/UI/menu.png"} 
            alt="Menu" 
            className="w-full h-full object-contain select-none filter drop-shadow-md"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] md:text-xs font-mono font-black tracking-widest leading-none block uppercase text-stone-850">
            WUHUANXING
          </span>
          <span className="text-[9px] font-mono tracking-wider uppercase hidden sm:block mt-1 text-stone-500">
            / 个人作品集网站
          </span>
        </div>
      </div>

      {/* Chapters Navigator redesigned with custom menubar UI assets */}
      <nav className="hidden md:flex items-center space-x-2.5 lg:space-x-3.5 max-w-2xl">
        {sceneOrder.map((sceneId) => {
          const isActive = currentScene === sceneId;
          const isHovered = hoveredScene === sceneId;
          const name = sceneNames[sceneId];

          const frameImg = isHovered 
            ? "/src/assets/UI/menubar-hover.png" 
            : (isActive ? "/src/assets/UI/menubar-chosen.png" : null);

          return (
            <button
              key={sceneId}
              onClick={() => handleSceneJump(sceneId)}
              onMouseEnter={() => setHoveredScene(sceneId)}
              onMouseLeave={() => setHoveredScene(null)}
              className="group relative text-[11px] md:text-xs font-serif font-bold tracking-wider px-3.5 md:px-4 py-1.5 md:py-2 cursor-pointer flex items-center justify-center transition-all duration-200 whitespace-nowrap"
              style={{
                color: isActive ? '#ffffff' : (isHovered ? '#1c1916' : 'rgba(28, 25, 22, 0.55)'),
              }}
              title={isEnglish ? name.en : name.cn}
            >
              {frameImg && (
                <img 
                  src={frameImg} 
                  alt="Tab frame" 
                  className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none filter drop-shadow-sm transform scale-[1.2]"
                  referrerPolicy="no-referrer"
                />
              )}
              <span className="relative z-10 px-1 whitespace-nowrap drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
                {isEnglish ? name.en : name.cn}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Utility Actions in Ink Style */}
      <div className="flex items-center space-x-2">
        {/* Language switcher */}
        <button
          onClick={handleGlobeClick}
          className="px-2.5 py-1 rounded transition-all font-mono text-[9px] font-bold flex items-center space-x-1.5 cursor-pointer border"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.65)',
            borderColor: 'rgba(28, 25, 22, 0.12)',
            color: '#1c1916'
          }}
          title={isEnglish ? "Switch to Chinese" : "切换为英文"}
        >
          <Globe size={11} className="text-stone-600" />
          <span>{isEnglish ? "EN" : "CN"}</span>
        </button>

        {/* Mute switcher */}
        <button
          onClick={toggleMute}
          className="p-1.5 rounded transition-all flex items-center justify-center cursor-pointer border"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.65)',
            borderColor: 'rgba(28, 25, 22, 0.12)',
            color: '#1c1916'
          }}
          title={isMuted ? "Unmute Ambient sound" : "Mute Sound"}
        >
          {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
        </button>
      </div>
    </header>
  );
};
