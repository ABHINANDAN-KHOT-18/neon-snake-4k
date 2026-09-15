import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Crown, RotateCcw, Home, Zap } from 'lucide-react';
import { GameStatsSnapshot } from '../engine/GameEngine';
import { soundEngine } from '../engine/SoundEngine';

interface VictoryModalProps {
  stats: GameStatsSnapshot;
  onRestart: () => void;
  onMainMenu: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  stats,
  onRestart,
  onMainMenu,
}) => {
  useEffect(() => {
    // Elegant fireworks / confetti
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 45,
        origin: { x: 0 },
        colors: ['#00f5ff', '#a855f7', '#ffe600'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 45,
        origin: { x: 1 },
        colors: ['#00f5ff', '#a855f7', '#ffe600'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/75 backdrop-blur-xl z-40 p-4 animate-in fade-in duration-300 select-none">
      <div className="glass-panel w-full max-w-md p-8 rounded-3xl text-center flex flex-col items-center gap-6">
        {/* Crown Icon */}
        <div className="w-14 h-14 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-[0_0_24px_rgba(251,191,36,0.3)]">
          <Crown className="w-7 h-7" />
        </div>

        {/* Mode Badge */}
        {stats.gameMode === 'speed_challenge' && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-300 text-[11px] font-mono-cyber uppercase tracking-widest">
            <Zap className="w-3 h-3 text-fuchsia-400" />
            <span>SPEED CHALLENGE</span>
          </div>
        )}

        {/* Title */}
        <div>
          <h2 className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-white glow-cyan">
            NEON MASTER
          </h2>
          <p className="text-xs font-mono-cyber text-cyan-400 uppercase tracking-widest mt-1">
            LEVEL 10 COMPLETE
          </p>
        </div>

        {/* Final Score */}
        <div className="flex flex-col items-center">
          <span className="text-4xl sm:text-5xl font-heading font-black text-white glow-yellow">
            {stats.score.toLocaleString()}
          </span>
          <span className="text-[11px] font-mono-cyber uppercase tracking-[0.2em] text-slate-400 mt-1">
            FINAL SCORE
          </span>
        </div>

        {/* Clean Minimal Stats Row */}
        <div className="grid grid-cols-3 gap-2.5 w-full text-xs font-mono-cyber">
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <div className="text-[10px] text-slate-500 uppercase">HIGH SCORE</div>
            <div className="font-bold text-slate-200 mt-0.5">{stats.highScore.toLocaleString()}</div>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <div className="text-[10px] text-slate-500 uppercase">MAX SPEED</div>
            <div className="font-bold text-cyan-400 mt-0.5">{stats.speed.toFixed(1)}x</div>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <div className="text-[10px] text-slate-500 uppercase">FOOD</div>
            <div className="font-bold text-emerald-400 mt-0.5">{stats.foodCollected}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5 mt-2">
          <button
            onClick={() => {
              soundEngine.playClick();
              onRestart();
            }}
            className="btn-primary w-full py-4 rounded-full text-xs font-heading font-bold tracking-wider uppercase flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>PLAY AGAIN</span>
          </button>

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
