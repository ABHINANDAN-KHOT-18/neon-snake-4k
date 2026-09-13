import React from 'react';
import { Play, HelpCircle, Settings, Trophy, Sparkles } from 'lucide-react';
import { soundEngine } from '../engine/SoundEngine';

interface MainMenuProps {
  highScore: number;
  onPlay: () => void;
  onHowToPlay: () => void;
  onSettings: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  highScore,
  onPlay,
  onHowToPlay,
  onSettings,
}) => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[540px] w-full max-w-xl p-8 mx-auto my-auto text-center z-20 select-none">
      {/* Subtle 4K Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill text-cyan-400 text-[11px] font-mono-cyber uppercase tracking-widest mb-6">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        <span>4K ULTRA EDITION</span>
      </div>

      {/* Hero Typography */}
      <h1 className="text-5xl sm:text-7xl font-heading font-black tracking-tight text-white glow-cyan mb-2">
        NEON SNAKE
      </h1>

      {/* Subtitle */}
      <p className="text-xs sm:text-sm font-mono-cyber text-slate-400 tracking-[0.25em] uppercase mb-8">
        MASTER THE GRID
      </p>

      {/* High Score Floating Pill */}
      {highScore > 0 && (
        <div className="glass-pill px-4 py-2 rounded-full mb-10 inline-flex items-center gap-2.5 text-slate-300">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-mono-cyber text-slate-400">RECORD</span>
          <span className="text-sm font-heading font-bold text-white">{highScore.toLocaleString()}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="w-full max-w-xs flex flex-col gap-3.5 mt-2">
        {/* Play Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onPlay();
          }}
          className="btn-primary w-full py-4 px-8 rounded-full text-base sm:text-lg font-heading font-black tracking-wider flex items-center justify-center gap-2.5"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>PLAY</span>
        </button>

        {/* Secondary Options */}
        <div className="grid grid-cols-2 gap-3 mt-1">
          <button
            onClick={() => {
              soundEngine.playClick();
              onHowToPlay();
            }}
            className="btn-secondary py-3 px-4 rounded-full text-xs sm:text-sm font-heading font-semibold flex items-center justify-center gap-2"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>HOW TO PLAY</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onSettings();
            }}
            className="btn-secondary py-3 px-4 rounded-full text-xs sm:text-sm font-heading font-semibold flex items-center justify-center gap-2"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>SETTINGS</span>
          </button>
        </div>
      </div>

      {/* Minimal Footer */}
      <div className="mt-14 text-slate-500 text-[11px] font-mono-cyber tracking-wider">
        10 PROGRESSIVE LEVELS • PROCEDURAL SYNTH SOUND
      </div>
    </div>
  );
};
