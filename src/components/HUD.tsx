import React from 'react';
import { Trophy, Zap, Pause, Volume2, VolumeX, Music, Disc } from 'lucide-react';
import { GameStatsSnapshot } from '../engine/GameEngine';

interface HUDProps {
  stats: GameStatsSnapshot;
  onPause: () => void;
  sfxEnabled: boolean;
  musicEnabled: boolean;
  onToggleSfx: () => void;
  onToggleMusic: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  stats,
  onPause,
  sfxEnabled,
  musicEnabled,
  onToggleSfx,
  onToggleMusic,
}) => {
  const formattedLevel = stats.level < 10 ? `0${stats.level}` : `${stats.level}`;
  const progressPct = Math.min(100, Math.round((stats.levelFoodProgress / stats.levelFoodTarget) * 100));

  const isSpeedChallenge = stats.gameMode === 'speed_challenge';
  const speedLabel = isSpeedChallenge
    ? `${stats.scSpeedType === 'automatic' ? 'AUTO' : 'CUSTOM'} ${stats.speed.toFixed(1)}x`
    : `${stats.speed.toFixed(1)}x`;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pt-4 pb-2 z-10 select-none">
      {/* Elegant Floating Top HUD */}
      <div className="flex items-center justify-between">
        {/* Top-Left: SCORE */}
        <div className="flex flex-col">
          <span className="text-[10px] sm:text-xs font-mono-cyber font-medium tracking-widest text-slate-400 uppercase">
            SCORE
          </span>
          <span className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white glow-cyan">
            {stats.score.toLocaleString()}
          </span>
        </div>

        {/* Top-Center: LEVEL */}
        <div className="flex flex-col items-center">
          <div className="glass-pill px-3.5 py-1 rounded-full flex items-center gap-2">
            <span className="text-[10px] sm:text-xs font-mono-cyber font-medium tracking-widest text-slate-400">
              LEVEL
            </span>
            <span className="text-sm sm:text-base font-heading font-black text-cyan-400">
              {formattedLevel}
            </span>
          </div>
          {/* Subtle Level Progress Bar */}
          <div className="w-20 sm:w-28 h-1 bg-white/10 rounded-full overflow-hidden mt-1.5">
            <div
              className="h-full bg-cyan-400 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(0,245,255,0.8)]"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Top-Right: HIGH SCORE & Controls */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] sm:text-xs font-mono-cyber font-medium tracking-widest text-slate-400 uppercase flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-400" />
              <span>HIGH SCORE</span>
            </span>
            <span className="text-xl sm:text-2xl font-heading font-bold text-slate-200">
              {stats.highScore.toLocaleString()}
            </span>
          </div>

          {/* Minimal Controls */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-white/10">
            <button
              onClick={onToggleSfx}
              title={sfxEnabled ? 'Mute SFX' : 'Enable SFX'}
              className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-all"
            >
              {sfxEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={onToggleMusic}
              title={musicEnabled ? 'Mute Music' : 'Enable Music'}
              className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-all"
            >
              {musicEnabled ? <Music className="w-4 h-4 text-purple-400" /> : <Disc className="w-4 h-4" />}
            </button>

            <button
              onClick={onPause}
              title="Pause Game (Space / P)"
              className="p-2 rounded-full glass-pill hover:bg-white/10 text-slate-200 hover:text-white transition-all ml-1"
            >
              <Pause className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Bottom / Sub-metrics Overlay Bar */}
      <div className="flex items-center justify-between text-xs font-mono-cyber mt-2 px-1 text-slate-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Zap className={`w-3.5 h-3.5 ${isSpeedChallenge ? 'text-fuchsia-400' : 'text-cyan-400'}`} />
            <span>SPEED</span>
            <span className={`font-bold ${isSpeedChallenge ? 'text-fuchsia-300' : 'text-white'}`}>
              {speedLabel}
            </span>
          </div>
          <span className="text-white/20">•</span>
          <div className="text-slate-400">
            FOOD <span className="font-medium text-slate-200">{stats.foodCollected}</span>
          </div>
          {/* Mode chip */}
          {isSpeedChallenge && (
            <>
              <span className="text-white/20">•</span>
              <div className="inline-flex items-center gap-1 text-[10px] font-mono-cyber text-fuchsia-400 uppercase tracking-wider">
                <Zap className="w-3 h-3" />
                SPEED CHALLENGE
              </div>
            </>
          )}
        </div>

        {/* Dynamic Combo Pill (appears only when active) */}
        {stats.combo > 1 && (
          <div className="glass-pill px-2.5 py-0.5 rounded-full flex items-center gap-1.5 text-pink-400 animate-pulse border border-pink-500/30">
            <span className="font-bold tracking-wider">COMBO</span>
            <span className="font-black text-white text-glow-pink">x{stats.combo}</span>
          </div>
        )}
      </div>
    </div>
  );
};
