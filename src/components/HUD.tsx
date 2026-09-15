import React from 'react';
import { Trophy, Zap, Pause, Volume2, VolumeX, Music, Disc, Coins, Bot } from 'lucide-react';
import { GameStatsSnapshot } from '../engine/GameEngine';

interface HUDProps {
  stats: GameStatsSnapshot;
  onPause: () => void;
  sfxEnabled: boolean;
  musicEnabled: boolean;
  onToggleSfx: () => void;
  onToggleMusic: () => void;
  onToggleAutoPlay?: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  stats,
  onPause,
  sfxEnabled,
  musicEnabled,
  onToggleSfx,
  onToggleMusic,
  onToggleAutoPlay,
}) => {
  const formattedLevel = stats.level < 10 ? `0${stats.level}` : `${stats.level}`;
  const progressPct = Math.min(100, Math.round((stats.levelFoodProgress / stats.levelFoodTarget) * 100));

  const isSpeedChallenge = stats.gameMode === 'speed_challenge';
  const speedLabel = isSpeedChallenge
    ? `NEON VELOCITY ${stats.speed.toFixed(1)}x`
    : `${stats.speed.toFixed(1)}x`;

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 pt-1 sm:pt-4 pb-1 sm:pb-2 z-10 select-none">
      {/* Elegant Floating Top HUD */}
      <div className="flex items-center justify-between gap-1 sm:gap-4">
        {/* Top-Left: SCORE & COINS */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className="flex flex-col">
            <span className="text-[9px] sm:text-xs font-mono-cyber font-medium tracking-widest text-slate-400 uppercase">
              SCORE
            </span>
            <span className="text-xl sm:text-3xl font-heading font-black tracking-tight text-white glow-cyan">
              {stats.score.toLocaleString()}
            </span>
          </div>

          {!isSpeedChallenge && (
            <div className="glass-pill px-2 sm:px-3 py-0.5 sm:py-1 rounded-full flex items-center gap-1 sm:gap-1.5 text-amber-300 text-[10px] sm:text-xs font-mono-cyber border border-amber-500/30">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold text-white">{(stats.coins || 0).toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Top-Center: LEVEL */}
        <div className="flex flex-col items-center shrink-0">
          <div className="glass-pill px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full flex items-center gap-1.5 sm:gap-2">
            <span className="text-[9px] sm:text-xs font-mono-cyber font-medium tracking-widest text-slate-400">
              LVL
            </span>
            <span className="text-xs sm:text-base font-heading font-black text-cyan-400">
              {formattedLevel}
            </span>
          </div>
          {/* Subtle Level Progress Bar */}
          <div className="w-14 sm:w-28 h-1 bg-white/10 rounded-full overflow-hidden mt-1 sm:mt-1.5">
            <div
              className="h-full bg-cyan-400 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(0,245,255,0.8)]"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Top-Right: HIGH SCORE & Controls */}
        <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
          <div className="flex flex-col items-end">
            <span className="text-[9px] sm:text-xs font-mono-cyber font-medium tracking-widest text-slate-400 uppercase flex items-center gap-1">
              <Trophy className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" />
              <span className="hidden sm:inline">HIGH SCORE</span>
              <span className="inline sm:hidden">BEST</span>
            </span>
            <span className="text-base sm:text-2xl font-heading font-bold text-slate-200">
              {stats.highScore.toLocaleString()}
            </span>
          </div>

          {/* Minimal Controls */}
          <div className="flex items-center gap-1 sm:gap-1.5 pl-1.5 sm:pl-2 border-l border-white/10">
            {stats.isAutomationUnlocked && (
              <button
                onClick={onToggleAutoPlay}
                title={stats.isAutoPlayEnabled ? 'Disable Auto Play' : 'Enable Auto Play'}
                className={`p-1.5 sm:p-2 rounded-full border transition-all ${
                  stats.isAutoPlayEnabled
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 animate-pulse'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            )}

            <button
              onClick={onToggleSfx}
              title={sfxEnabled ? 'Mute SFX' : 'Enable SFX'}
              className="p-1.5 sm:p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-all"
            >
              {sfxEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>

            <button
              onClick={onToggleMusic}
              title={musicEnabled ? 'Mute Music' : 'Enable Music'}
              className="p-1.5 sm:p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-all"
            >
              {musicEnabled ? <Music className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" /> : <Disc className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>

            <button
              onClick={onPause}
              title="Pause Game (Space / P)"
              className="p-1.5 sm:p-2 rounded-full glass-pill hover:bg-white/10 text-slate-200 hover:text-white transition-all ml-0.5 sm:ml-1"
            >
              <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Bottom / Sub-metrics Overlay Bar */}
      <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono-cyber mt-1 sm:mt-2 px-1 text-slate-400 flex-wrap gap-1">
        <div className="flex items-center gap-1.5 sm:gap-3">
          <div className="flex items-center gap-1 text-slate-300">
            <Zap className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isSpeedChallenge ? 'text-fuchsia-400' : 'text-cyan-400'}`} />
            <span className="hidden sm:inline">SPEED</span>
            <span className={`font-bold ${isSpeedChallenge ? 'text-fuchsia-300' : 'text-white'}`}>
              {speedLabel}
            </span>
          </div>
          <span className="text-white/20">•</span>
          <div className="text-slate-400">
            FOOD <span className="font-medium text-slate-200">{stats.foodCollected}</span>
          </div>
          {/* Auto Play Active Badge */}
          {stats.isAutoPlayEnabled && (
            <>
              <span className="text-white/20">•</span>
              <div className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-mono-cyber text-emerald-400 font-bold uppercase tracking-wider animate-pulse">
                <Bot className="w-3 h-3" />
                AUTO PLAY
              </div>
            </>
          )}
        </div>

        {/* Dynamic Combo & Active Power-Ups */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Power-up Status Badges */}
          {stats.activePowerUps && stats.activePowerUps.map((p) => {
            const icons: Record<string, { symbol: string; color: string; label: string }> = {
              shield: { symbol: '🛡️', color: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40', label: 'SHIELD' },
              timewarp: { symbol: '⏱️', color: 'text-purple-400 border-purple-500/40 bg-purple-950/40', label: 'SLOW-MO' },
              magnet: { symbol: '🧲', color: 'text-amber-400 border-amber-500/40 bg-amber-950/40', label: 'MAGNET' },
              phase: { symbol: '👻', color: 'text-fuchsia-400 border-fuchsia-500/40 bg-fuchsia-950/40', label: 'PHASE' },
            };
            const meta = icons[p.type] || { symbol: '⚡', color: 'text-white border-white/20 bg-white/10', label: p.type };
            return (
              <div key={p.type} className={`glass-pill px-1.5 sm:px-2 py-0.5 rounded-full flex items-center gap-0.5 sm:gap-1 border text-[9px] sm:text-[10px] font-mono-cyber ${meta.color}`}>
                <span>{meta.symbol}</span>
                <span className="font-bold">{meta.label}</span>
                {p.type !== 'shield' && (
                  <span className="text-slate-300 font-bold ml-0.5">{Math.ceil(p.timeLeft)}s</span>
                )}
              </div>
            );
          })}

          {/* Dynamic Combo Pill */}
          {stats.combo > 1 && (
            <div className="glass-pill px-2 sm:px-2.5 py-0.5 rounded-full flex items-center gap-1 text-pink-400 animate-pulse border border-pink-500/30 text-[10px] sm:text-xs">
              <span className="font-bold tracking-wider">COMBO</span>
              <span className="font-black text-white text-glow-pink">x{stats.combo}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
