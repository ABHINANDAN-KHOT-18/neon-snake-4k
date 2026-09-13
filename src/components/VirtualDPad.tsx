import React from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Direction } from '../engine/Snake';

interface VirtualDPadProps {
  onDirection: (dir: Direction) => void;
}

export const VirtualDPad: React.FC<VirtualDPadProps> = ({ onDirection }) => {
  const handlePress = (dir: Direction, e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDirection(dir);
    if ('vibrate' in navigator) {
      navigator.vibrate(8);
    }
  };

  return (
    <div className="flex md:hidden items-center justify-center pb-4 pt-1 z-20 select-none">
      <div className="relative w-36 h-36 rounded-full glass-pill flex items-center justify-center shadow-lg">
        {/* Center dot */}
        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400/40" />

        {/* UP */}
        <button
          onTouchStart={(e) => handlePress('UP', e)}
          onMouseDown={(e) => handlePress('UP', e)}
          aria-label="Move Up"
          className="absolute top-1 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full flex items-center justify-center text-slate-300 active:text-cyan-400 active:bg-white/10 transition-all"
        >
          <ChevronUp className="w-6 h-6" />
        </button>

        {/* DOWN */}
        <button
          onTouchStart={(e) => handlePress('DOWN', e)}
          onMouseDown={(e) => handlePress('DOWN', e)}
          aria-label="Move Down"
          className="absolute bottom-1 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full flex items-center justify-center text-slate-300 active:text-cyan-400 active:bg-white/10 transition-all"
        >
          <ChevronDown className="w-6 h-6" />
        </button>

        {/* LEFT */}
        <button
          onTouchStart={(e) => handlePress('LEFT', e)}
          onMouseDown={(e) => handlePress('LEFT', e)}
          aria-label="Move Left"
          className="absolute left-1 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-slate-300 active:text-cyan-400 active:bg-white/10 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* RIGHT */}
        <button
          onTouchStart={(e) => handlePress('RIGHT', e)}
          onMouseDown={(e) => handlePress('RIGHT', e)}
          aria-label="Move Right"
          className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-slate-300 active:text-cyan-400 active:bg-white/10 transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
