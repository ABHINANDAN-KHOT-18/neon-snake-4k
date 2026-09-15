import React, { useRef, useEffect, useCallback } from 'react';
import { GameEngine, GameState, GameStatsSnapshot } from '../engine/GameEngine';
import { AchievementToast } from '../engine/AchievementManager';

interface GameCanvasProps {
  engineRef: React.MutableRefObject<GameEngine | null>;
  onStatsChange: (stats: GameStatsSnapshot) => void;
  onStateChange: (state: GameState) => void;
  onPause: () => void;
  onLevelTransition?: (nextLevel: number) => void;
  onAchievementToast?: (toast: AchievementToast) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  engineRef,
  onStatsChange,
  onStateChange,
  onPause,
  onLevelTransition,
  onAchievementToast,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const callbacksRef = useRef({ onStatsChange, onStateChange, onLevelTransition, onPause, onAchievementToast });
  callbacksRef.current = { onStatsChange, onStateChange, onLevelTransition, onPause, onAchievementToast };

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new GameEngine(canvasRef.current);
    engine.onStatsChange = (stats) => callbacksRef.current.onStatsChange?.(stats);
    engine.onStateChange = (state) => callbacksRef.current.onStateChange?.(state);
    engine.onLevelTransition = (nextLevel) => callbacksRef.current.onLevelTransition?.(nextLevel);
    engine.onAchievementToast = (toast) => callbacksRef.current.onAchievementToast?.(toast);
    engineRef.current = engine;

    const resizeObserver = new ResizeObserver(() => {
      if (engineRef.current) {
        engineRef.current.resizeCanvas();
        engineRef.current.render();
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      engine.destroy();
      engineRef.current = null;
    };
  }, [engineRef]);

  // Keyboard controls handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!engineRef.current) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          engineRef.current.handleInput('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          engineRef.current.handleInput('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          engineRef.current.handleInput('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          engineRef.current.handleInput('RIGHT');
          break;
        case ' ':
        case 'p':
        case 'P':
        case 'Escape':
          e.preventDefault();
          if (engineRef.current.state === 'PLAYING') {
            callbacksRef.current.onPause();
          } else if (engineRef.current.state === 'PAUSED') {
            engineRef.current.resume();
          }
          break;
      }
    },
    [engineRef]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Touch Swipe Gesture Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || !engineRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const minSwipeDistance = 16;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > minSwipeDistance) {
      engineRef.current.handleInput(dx > 0 ? 'RIGHT' : 'LEFT');
    } else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > minSwipeDistance) {
      engineRef.current.handleInput(dy > 0 ? 'DOWN' : 'UP');
    }
    touchStartRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      className="relative flex-1 flex items-center justify-center w-full max-h-[74vh] p-2 overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <canvas
        ref={canvasRef}
        className="rounded-3xl border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] bg-[#080b18] touch-none"
      />
    </div>
  );
};
