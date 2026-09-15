import React from 'react';
import { RotateCcw, Home, Trophy, Sparkles, Zap } from 'lucide-react';
import { GameStatsSnapshot } from '../engine/GameEngine';
import { soundEngine } from '../engine/SoundEngine';

interface GameOverModalProps {
  stats: GameStatsSnapshot;
  onRestart: () => void;
  onMainMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  onRestart,
  onMainMenu,
}) => {
  const isSpeedChallenge = stats.gameMode === 'speed_challenge';

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-lg z-40 p-4 animate-in fade-in duration-300 select-none">
      <div className="glass-panel w-full max-w-sm p-8 rounded-3xl text-center flex flex-col items-center gap-6">
        {/* New High Score Pill */}
        {stats.isNewHighScore && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[11px] font-mono-cyber uppercase tracking-widest animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>NEW HIGH SCORE</span>
          </div>
        )}

        {/* Mode Badge */}
        {isSpeedChallenge && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-300 text-[11px] font-mono-cyber uppercase tracking-widest">
            <Zap className="w-3 h-3 text-fuchsia-400" />
            <span>SPEED CHALLENGE</span>
          </div>
        )}

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-white">
          GAME OVER
        </h2>

        {/* Score Display */}
        <div className="flex flex-col items-center">
          <span className="text-5xl sm:text-6xl font-heading font-black text-white glow-cyan tracking-tight">
            {stats.score.toLocaleString()}
          </span>
          <span className="text-[11px] font-mono-cyber uppercase tracking-[0.2em] text-slate-400 mt-1">
            FINAL SCORE
          </span>
        </div>

        {/* Quick Stats Pill Row */}
        <div className="flex items-center justify-center gap-3 text-xs font-mono-cyber text-slate-400 py-1.5 px-4 rounded-full bg-white/[0.03]">
          <div className="flex items-center gap-1.5">
            <Trophy className={`w-3.5 h-3.5 ${isSpeedChallenge ? 'text-fuchsia-400' : 'text-amber-400'}`} />
            <span>BEST:</span>
            <span className="font-bold text-slate-200">{stats.highScore.toLocaleString()}</span>
          </div>
          <span className="text-white/10">•</span>
          <div>
            LEVEL <span className="font-bold text-slate-200">{stats.level}</span>
          </div>
          <span className="text-white/10">•</span>
          <div className="flex items-center gap-1 text-amber-300">
            <span>🪙</span>
            <span className="font-bold">{(stats.coins || 0).toLocaleString()}</span>
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
            <span>RETRY</span>
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
