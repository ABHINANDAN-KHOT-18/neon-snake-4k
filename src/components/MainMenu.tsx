import React, { useState } from 'react';
import {
  Play,
  HelpCircle,
  Settings,
  Trophy,
  Zap,
  ChevronRight,
  Gauge,
  ArrowLeft,
  Award,
  Lock,
  CheckCircle,
  Coins,
  Bot,
} from 'lucide-react';
import { soundEngine } from '../engine/SoundEngine';
import { SpeedChallengeSettings, StorageManager } from '../engine/Storage';

export interface SpeedChallengeConfig {
  speedType: 'automatic' | 'custom';
  startingSpeed: number;
  maximumSpeed: number;
  speedIncrease: number;
  autoPlay?: boolean;
}

interface MainMenuProps {
  normalHighScore: number;
  speedChallengeHighScore: number;
  coins: number;
  onPlayNormal: () => void;
  onPlaySpeedChallenge: (config: SpeedChallengeConfig) => void;
  onHowToPlay: () => void;
  onSettings: () => void;
  onAchievements: () => void;
  onLeaderboard: () => void;
}

type MenuScreen = 'main' | 'neon_velocity';

export const MainMenu: React.FC<MainMenuProps> = ({
  normalHighScore,
  speedChallengeHighScore,
  coins,
  onPlayNormal,
  onPlaySpeedChallenge,
  onHowToPlay,
  onSettings,
  onAchievements,
  onLeaderboard,
}) => {
  const [screen, setScreen] = useState<MenuScreen>('main');

  // Load saved SC settings
  const [scSettings, setScSettings] = useState<SpeedChallengeSettings>(() =>
    StorageManager.getSpeedChallengeSettings()
  );
  const [isAutoPlaySelected, setIsAutoPlaySelected] = useState<boolean>(false);
  const [validationMsg, setValidationMsg] = useState<string>('');

  const updateScSettings = (patch: Partial<SpeedChallengeSettings>) => {
    const updated = { ...scSettings, ...patch };
    if (patch.startingSpeed !== undefined && patch.startingSpeed > updated.maximumSpeed) {
      updated.maximumSpeed = patch.startingSpeed;
    }
    setScSettings(updated);
    setValidationMsg('');
    StorageManager.saveSpeedChallengeSettings(updated);
  };

  const handleStartNeonVelocity = () => {
    soundEngine.playClick();
    if (isAutoPlaySelected && coins < 500) {
      setValidationMsg('Insufficient coins for Auto Play! 500 Coins required.');
      return;
    }
    onPlaySpeedChallenge({
      speedType: scSettings.speedType,
      startingSpeed: scSettings.startingSpeed,
      maximumSpeed: scSettings.maximumSpeed,
      speedIncrease: scSettings.speedIncrease,
      autoPlay: isAutoPlaySelected,
    });
  };

  if (screen === 'neon_velocity') {
    return (
      <NeonVelocityScreen
        scSettings={scSettings}
        speedChallengeHighScore={speedChallengeHighScore}
        coins={coins}
        isAutoPlaySelected={isAutoPlaySelected}
        validationMsg={validationMsg}
        onUpdateSettings={updateScSettings}
        onToggleAutoPlay={() => {
          soundEngine.playClick();
          if (!isAutoPlaySelected && coins < 500) {
            setValidationMsg('Insufficient coins! 500 Coins required for Auto Play.');
            return;
          }
          setValidationMsg('');
          setIsAutoPlaySelected((prev) => !prev);
        }}
        onStart={handleStartNeonVelocity}
        onBack={() => {
          soundEngine.playClick();
          setScreen('main');
          setValidationMsg('');
        }}
      />
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[540px] w-full max-w-2xl p-6 mx-auto my-auto text-center z-20 select-none">
      {/* Top Header Row: Coins display */}
      <div className="flex items-center gap-3 mb-6">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full glass-pill text-amber-300 text-xs font-mono-cyber border border-amber-500/30">
          <Coins className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="font-bold text-white">{coins.toLocaleString()}</span>
        </div>
      </div>

      {/* Hero Typography */}
      <h1 className="text-5xl sm:text-7xl font-heading font-black tracking-tight text-white glow-cyan mb-2">
        NEON SNAKE
      </h1>

      <p className="text-xs sm:text-sm font-mono-cyber text-slate-400 tracking-[0.25em] uppercase mb-10">
        MASTER THE GRID
      </p>

      {/* Two Main Mode Cards */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Mode 1: Snake Challenge */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-between gap-4 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 group">
          <div className="flex items-center gap-2 mb-1">
            <Play className="w-5 h-5 text-cyan-400" />
            <span className="text-base font-heading font-black tracking-widest text-white">SNAKE CHALLENGE</span>
          </div>
          {normalHighScore > 0 && (
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono-cyber text-amber-300">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>{normalHighScore.toLocaleString()}</span>
            </div>
          )}
          <button
            onClick={() => {
              soundEngine.playClick();
              onPlayNormal();
            }}
            className="btn-primary w-full py-3 rounded-full text-sm font-heading font-black tracking-wider flex items-center justify-center gap-2 mt-auto"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>PLAY</span>
          </button>
        </div>

        {/* Mode 2: Neon Velocity */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-between gap-4 border border-fuchsia-500/20 hover:border-fuchsia-500/40 transition-all duration-300 group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-transparent pointer-events-none rounded-2xl" />
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-5 h-5 text-fuchsia-400" />
            <span className="text-base font-heading font-black tracking-widest text-white">NEON VELOCITY</span>
          </div>
          {speedChallengeHighScore > 0 && (
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono-cyber text-fuchsia-300">
              <Trophy className="w-3.5 h-3.5 text-fuchsia-400" />
              <span>{speedChallengeHighScore.toLocaleString()}</span>
            </div>
          )}
          <button
            onClick={() => {
              soundEngine.playClick();
              setScreen('neon_velocity');
            }}
            className="w-full py-3 rounded-full text-sm font-heading font-black tracking-wider flex items-center justify-center gap-2 mt-auto bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white shadow-lg shadow-fuchsia-900/40 transition-all duration-200 active:scale-95"
          >
            <Gauge className="w-4 h-4" />
            <span>PLAY</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Secondary Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full max-w-lg">
        <button
          onClick={() => {
            soundEngine.playClick();
            onHowToPlay();
          }}
          className="btn-secondary py-2.5 px-3 rounded-2xl text-xs font-heading font-bold flex items-center justify-center gap-1.5"
        >
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>HELP</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            onAchievements();
          }}
          className="btn-secondary py-2.5 px-3 rounded-2xl text-xs font-heading font-bold flex items-center justify-center gap-1.5"
        >
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>TROPHIES</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            onLeaderboard();
          }}
          className="btn-secondary py-2.5 px-3 rounded-2xl text-xs font-heading font-bold flex items-center justify-center gap-1.5"
        >
          <Award className="w-3.5 h-3.5 text-fuchsia-400" />
          <span>SCORES</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            onSettings();
          }}
          className="btn-secondary py-2.5 px-3 rounded-2xl text-xs font-heading font-bold flex items-center justify-center gap-1.5"
        >
          <Settings className="w-3.5 h-3.5 text-slate-400" />
          <span>SETTINGS</span>
        </button>
      </div>

      {/* Footer - Contains ONLY @itzz_abhiii.18x */}
      <div className="mt-8 text-slate-500 text-[11px] font-mono-cyber tracking-wider">
        @itzz_abhiii.18x
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Unified Neon Velocity Screen
// ─────────────────────────────────────────────────────────────────────────────

interface NeonVelocityScreenProps {
  scSettings: SpeedChallengeSettings;
  speedChallengeHighScore: number;
  coins: number;
  isAutoPlaySelected: boolean;
  validationMsg: string;
  onUpdateSettings: (patch: Partial<SpeedChallengeSettings>) => void;
  onToggleAutoPlay: () => void;
  onStart: () => void;
  onBack: () => void;
}

const NeonVelocityScreen: React.FC<NeonVelocityScreenProps> = ({
  scSettings,
  speedChallengeHighScore,
  coins,
  isAutoPlaySelected,
  validationMsg,
  onUpdateSettings,
  onToggleAutoPlay,
  onStart,
  onBack,
}) => {
  const has500Coins = coins >= 500;

  return (
    <div className="relative flex flex-col items-center w-full max-w-lg mx-auto my-auto p-6 z-20 select-none">
      {/* Top Navigation Row */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-xs font-mono-cyber uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Header Title */}
      <div className="flex items-center gap-2 mb-1">
        <Zap className="w-6 h-6 text-fuchsia-400" />
        <h2 className="text-2xl sm:text-3xl font-heading font-black tracking-widest text-white">
          NEON VELOCITY
        </h2>
      </div>
      <p className="text-xs font-mono-cyber text-slate-400 tracking-[0.2em] mb-4">
        SPEED CONTROL & AUTOMATION
      </p>

      {/* High Score Badge */}
      {speedChallengeHighScore > 0 && (
        <div className="glass-pill px-4 py-1.5 rounded-full mb-4 inline-flex items-center gap-2 text-fuchsia-300 text-xs font-mono-cyber">
          <Trophy className="w-3.5 h-3.5 text-fuchsia-400" />
          <span>BEST</span>
          <span className="font-bold text-white">{speedChallengeHighScore.toLocaleString()}</span>
        </div>
      )}

      {/* Single Unified Speed & Automation Section */}
      <div className="glass-panel w-full rounded-2xl p-5 mb-4 flex flex-col gap-5 border border-fuchsia-500/30">
        {/* Speed Control Section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-bold text-fuchsia-300 tracking-wider flex items-center gap-1.5 uppercase">
              <Gauge className="w-4 h-4 text-fuchsia-400" />
              SPEED CONTROL
            </span>
            <span className="text-sm font-heading font-bold text-white bg-fuchsia-950/60 px-2.5 py-0.5 rounded-full border border-fuchsia-500/40">
              {scSettings.startingSpeed.toFixed(1)}x
            </span>
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { label: 'SLOW', val: 1.2 },
              { label: 'NORMAL', val: 2.0 },
              { label: 'FAST', val: 3.5 },
              { label: 'EXTREME', val: 5.0 },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => onUpdateSettings({ startingSpeed: preset.val })}
                className={`py-2 rounded-xl text-[10px] font-heading font-bold tracking-wider transition-all ${
                  Math.abs(scSettings.startingSpeed - preset.val) < 0.1
                    ? 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-900/50 scale-105'
                    : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Smooth Slider */}
          <input
            type="range"
            min={1.0}
            max={5.0}
            step={0.1}
            value={scSettings.startingSpeed}
            onChange={(e) => onUpdateSettings({ startingSpeed: parseFloat(e.target.value) })}
            className="w-full h-2 rounded-full cursor-pointer accent-fuchsia-500 bg-white/10"
          />
          <div className="flex justify-between text-[9px] font-mono-cyber text-slate-500">
            <span>Slow (1.0x)</span>
            <span>Normal (2.0x)</span>
            <span>Extreme (5.0x)</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10" />

        {/* Automate Game Section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-bold text-cyan-300 tracking-wider flex items-center gap-1.5 uppercase">
              <Bot className="w-4 h-4 text-cyan-400" />
              GAME AUTOMATION
            </span>
            {has500Coins ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono-cyber text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                <CheckCircle className="w-3 h-3" /> READY (500 🪙)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono-cyber text-amber-400 font-bold bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/40">
                <Lock className="w-3 h-3" /> LOCKED (500 🪙 REQUIRED)
              </span>
            )}
          </div>

          {!has500Coins ? (
            /* Locked State UI */
            <div className="glass-panel p-4 rounded-xl flex flex-col items-center text-center gap-2 border border-amber-500/20 bg-amber-950/10">
              <div className="flex items-center gap-1.5 text-xs font-mono-cyber text-slate-300 font-bold">
                <span>🔒 AUTO PLAY</span>
              </div>
              <p className="text-xs font-mono-cyber text-amber-300 font-bold">
                500 🪙 REQUIRED
              </p>
              <p className="text-[11px] font-mono-cyber text-slate-400">
                Earn coins in Snake Challenge mode to activate 1 session of autonomous AI steering.
              </p>
            </div>
          ) : (
            /* Ready / Selected State UI */
            <div className="glass-panel p-4 rounded-xl flex flex-col gap-3 border border-emerald-500/30 bg-emerald-950/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono-cyber text-emerald-300 font-bold">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>500 COINS AVAILABLE</span>
                </div>
                <button
                  onClick={onToggleAutoPlay}
                  className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition-all ${
                    isAutoPlaySelected
                      ? 'bg-emerald-500 text-black shadow-md shadow-emerald-950/50'
                      : 'bg-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {isAutoPlaySelected ? 'AUTO PLAY: ON' : 'AUTO PLAY: OFF'}
                </button>
              </div>
              <p className="text-xs font-mono-cyber text-slate-400 leading-relaxed">
                {isAutoPlaySelected
                  ? '500 Coins will be deducted when starting this run. The AI will autonomously navigate toward food and avoid hazards.'
                  : 'Toggle ON to use 500 Coins for 1 session of automated AI gameplay.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Validation Message */}
      {validationMsg && (
        <p className="text-xs text-rose-400 font-mono-cyber mb-3 text-center">{validationMsg}</p>
      )}

      {/* Start Game Button */}
      <button
        onClick={onStart}
        className="w-full py-4 rounded-full text-base font-heading font-black tracking-wider flex items-center justify-center gap-2 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white shadow-lg shadow-fuchsia-900/40 transition-all duration-200 active:scale-95"
      >
        <Play className="w-5 h-5 fill-current" />
        <span>START NEON VELOCITY</span>
      </button>
    </div>
  );
};
