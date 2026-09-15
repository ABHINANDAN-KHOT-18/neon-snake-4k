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
    <div className="flex md:hidden items-center justify-center pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-1 z-20 select-none touch-none">
      <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full glass-pill flex items-center justify-center shadow-2xl border border-white/10">
        {/* Center glowing dot */}
        <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(0,245,255,0.8)]" />

        {/* UP */}
        <button
          onPointerDown={(e) => handlePointerDown('UP', e)}
          aria-label="Move Up"
          className="absolute top-1 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center text-slate-300 active:text-cyan-400 active:bg-cyan-500/20 active:scale-95 transition-all touch-none"
        >
          <ChevronUp className="w-7 h-7" />
        </button>

        {/* DOWN */}
        <button
          onPointerDown={(e) => handlePointerDown('DOWN', e)}
          aria-label="Move Down"
          className="absolute bottom-1 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center text-slate-300 active:text-cyan-400 active:bg-cyan-500/20 active:scale-95 transition-all touch-none"
        >
          <ChevronDown className="w-7 h-7" />
        </button>

        {/* LEFT */}
        <button
          onPointerDown={(e) => handlePointerDown('LEFT', e)}
          aria-label="Move Left"
          className="absolute left-1 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-slate-300 active:text-cyan-400 active:bg-cyan-500/20 active:scale-95 transition-all touch-none"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>

        {/* RIGHT */}
        <button
          onPointerDown={(e) => handlePointerDown('RIGHT', e)}
          aria-label="Move Right"
          className="absolute right-1 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-slate-300 active:text-cyan-400 active:bg-cyan-500/20 active:scale-95 transition-all touch-none"
        >
          <ChevronRight className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
};
