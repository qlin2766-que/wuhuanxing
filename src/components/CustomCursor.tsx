import React, { useState, useEffect } from 'react';

interface TrailDot {
  x: number;
  y: number;
  id: number;
  opacity: number;
}

interface Ripple {
  x: number;
  y: number;
  id: number;
}

export function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState<TrailDot[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile touch interfaces representing no natural pointer cursor
    const checkIsTouch = () => {
      const isTouch = window.matchMedia('(pointer: coarse)').matches;
      setIsMobile(isTouch);
    };
    checkIsTouch();
    window.addEventListener('resize', checkIsTouch, { passive: true });
    return () => window.removeEventListener('resize', checkIsTouch);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    let lastTime = 0;
    let trailId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      setPosition({ x, y });

      // Generate soft tailing stars/ghosts dynamically
      const now = performance.now();
      if (now - lastTime > 45) { // Throttle slightly for fluid spacing and CPU efficiency
        setTrail((prev) => {
          const updated = [
            { x, y, id: ++trailId, opacity: 0.65 },
            ...prev,
          ];
          return updated.slice(0, 8); // Elegant max size of ghosts
        });
        lastTime = now;
      }

      // Detect hovering interactive components for elastic scaling
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = 
          target.tagName === 'BUTTON' || 
          target.tagName === 'A' || 
          target.closest('button') || 
          target.closest('a') ||
          target.classList.contains('cursor-pointer') ||
          target.getAttribute('role') === 'button';
        setIsHoveringClickable(!!isClickable);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      setRipples((prev) => [...prev, { x, y, id: Date.now() }]);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [isMobile]);

  // Trail gradual decay lifecycle loop
  useEffect(() => {
    if (isMobile || trail.length === 0) return;
    const timer = setInterval(() => {
      setTrail((prev) => 
        prev
          .map((dot) => ({ ...dot, opacity: dot.opacity - 0.08 }))
          .filter((dot) => dot.opacity > 0)
      );
    }, 70);
    return () => clearInterval(timer);
  }, [trail.length, isMobile]);

  // Ripples automatic clean lifespan
  useEffect(() => {
    if (ripples.length === 0) return;
    const timer = setTimeout(() => {
      setRipples((prev) => prev.slice(1));
    }, 800);
    return () => clearTimeout(timer);
  }, [ripples]);

  if (isMobile) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
      {/* Click Ripples */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute rounded-full border border-stone-800/40 animate-[ping_0.8s_ease-out_forwards]"
          style={{
            left: ripple.x - 24,
            top: ripple.y - 24,
            width: 48,
            height: 48,
          }}
        />
      ))}

      {/* Residual Motion Trails - Poetic Sparkles fading away */}
      {trail.map((dot, index) => {
        const scale = 1 - index * 0.12;
        return (
          <div
            key={dot.id}
            className="absolute fill-stone-500/20 pointer-events-none select-none"
            style={{
              left: dot.x - 8,
              top: dot.y - 8,
              opacity: dot.opacity,
              transform: `scale(${scale > 0 ? scale : 0}) rotate(${index * 8}deg)`,
              transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
            }}
          >
            {/* Elegant SVG curved four-pointed star vector (flare/sparkle) */}
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-stone-400/40">
              <path d="M12 2 Q11.8 11.8 2 12 Q11.8 12.2 12 22 Q12.2 12.2 22 12 Q12.2 11.8 12 2 Z" />
            </svg>
          </div>
        );
      })}

      {/* Main interactive cursor 4-pointed star */}
      <div
        className="absolute pointer-events-none select-none transition-transform duration-75 ease-out"
        style={{
          left: position.x - 12,
          top: position.y - 12,
          transform: `scale(${isHoveringClickable ? 1.4 : 1})`,
        }}
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-stone-800 drop-shadow-[0_2px_4px_rgba(30,25,20,0.18)]">
          <path d="M12 2 Q11.8 11.8 2 12 Q11.8 12.2 12 22 Q12.2 12.2 22 12 Q12.2 11.8 12 2 Z" />
        </svg>
      </div>
    </div>
  );
}
