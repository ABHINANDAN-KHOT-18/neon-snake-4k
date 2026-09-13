import React from 'react';
import { Sparkles } from 'lucide-react';

interface LevelUpOverlayProps {
  level: number;
}

export const LevelUpOverlay: React.FC<LevelUpOverlayProps> = ({ level }) => {
  const formattedLevel = level < 10 ? `0${level}` : `${level}`;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-30 pointer-events-none animate-in fade-in zoom-in-90 duration-300 select-none">
      <div className="glass-panel px-8 py-6 rounded-3xl flex flex-col items-center gap-2 border border-cyan-400/30 shadow-[0_0_50px_rgba(0,245,255,0.2)]">
        <div className="inline-flex items-center gap-1.5 text-cyan-400 text-[11px] font-mono-cyber uppercase tracking-[0.2em]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>STAGE COMPLETE</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-white glow-cyan">
          LEVEL UP
        </h2>

        <div className="text-lg sm:text-xl font-heading font-bold text-slate-300 mt-1">
          LEVEL <span className="text-cyan-400 font-black">{formattedLevel}</span>
        </div>
      </div>
    </div>
  );
};
