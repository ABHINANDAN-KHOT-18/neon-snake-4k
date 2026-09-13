import React from 'react';
import { Play, RotateCcw, Home } from 'lucide-react';
import { soundEngine } from '../engine/SoundEngine';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onMainMenu: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onMainMenu,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-lg z-40 p-4 animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-xs p-7 rounded-3xl text-center flex flex-col items-center gap-6">
        <div>
          <h2 className="text-2xl font-heading font-black tracking-widest text-white">
            PAUSED
          </h2>
          <p className="text-[11px] font-mono-cyber text-slate-400 mt-1">
            GAMEPLAY SUSPENDED
          </p>
        </div>

        <div className="w-full flex flex-col gap-2.5">
          {/* Resume */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onResume();
            }}
            className="btn-primary w-full py-3.5 rounded-full text-xs font-heading font-bold tracking-wider uppercase flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>RESUME</span>
          </button>

          {/* Restart */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onRestart();
            }}
            className="btn-secondary w-full py-3 rounded-full text-xs font-heading font-semibold flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>RESTART</span>
          </button>

          {/* Main Menu */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onMainMenu();
            }}
            className="btn-secondary w-full py-3 rounded-full text-xs font-heading font-semibold text-slate-400 hover:text-white flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
