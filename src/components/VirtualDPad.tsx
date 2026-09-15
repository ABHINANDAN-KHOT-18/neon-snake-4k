import React, { useRef } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Direction } from '../engine/Snake';

interface VirtualDPadProps {
  onDirection: (dir: Direction) => void;
}

export const VirtualDPad: React.FC<VirtualDPadProps> = ({ onDirection }) => {
  const lastPressTimeRef = useRef<number>(0);

  const handlePointerDown = (dir: Direction, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Prevent debounce/duplicate firing within 40ms
    const now = performance.now();
    if (now - lastPressTimeRef.current < 40) return;
    lastPressTimeRef.current = now;

    onDirection(dir);
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch {
        // Ignore vibration errors
      }
    }
  };

  return (
    <div className="flex md:hidden items-center justify-center pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] pt-1 z-20 select-none touch-none">
      <div className="grid grid-cols-3 grid-rows-3 gap-1.5 sm:gap-2.5 w-44 h-44 sm:w-48 sm:h-48 items-center justify-items-center">
        {/* Row 1, Col 2: UP Button */}
        <div className="col-start-2 row-start-1">
          <button
            onPointerDown={(e) => handlePointerDown('UP', e)}
            aria-label="Move Up"
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl glass-pill flex items-center justify-center text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,245,255,0.2)] active:scale-90 active:bg-cyan-500/30 active:border-cyan-400 active:text-white active:shadow-[0_0_22px_rgba(0,245,255,0.7)] transition-all touch-none"
          >
            <ChevronUp className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-300" />
          </button>
        </div>

        {/* Row 2, Col 1: LEFT Button */}
        <div className="col-start-1 row-start-2">
          <button
            onPointerDown={(e) => handlePointerDown('LEFT', e)}
            aria-label="Move Left"
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl glass-pill flex items-center justify-center text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,245,255,0.2)] active:scale-90 active:bg-cyan-400/30 active:border-cyan-400 active:text-white active:shadow-[0_0_22px_rgba(0,245,255,0.7)] transition-all touch-none"
          >
            <ChevronLeft className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-300" />
          </button>
        </div>

        {/* Row 2, Col 2: Center Indicator */}
        <div className="col-start-2 row-start-2 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400/60 shadow-[0_0_10px_rgba(0,245,255,0.8)] animate-pulse" />
        </div>

        {/* Row 2, Col 3: RIGHT Button */}
        <div className="col-start-3 row-start-2">
          <button
            onPointerDown={(e) => handlePointerDown('RIGHT', e)}
            aria-label="Move Right"
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl glass-pill flex items-center justify-center text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,245,255,0.2)] active:scale-90 active:bg-cyan-400/30 active:border-cyan-400 active:text-white active:shadow-[0_0_22px_rgba(0,245,255,0.7)] transition-all touch-none"
          >
            <ChevronRight className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-300" />
          </button>
        </div>

        {/* Row 3, Col 2: DOWN Button */}
        <div className="col-start-2 row-start-3">
          <button
            onPointerDown={(e) => handlePointerDown('DOWN', e)}
            aria-label="Move Down"
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl glass-pill flex items-center justify-center text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,245,255,0.2)] active:scale-90 active:bg-cyan-400/30 active:border-cyan-400 active:text-white active:shadow-[0_0_22px_rgba(0,245,255,0.7)] transition-all touch-none"
          >
            <ChevronDown className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
