import React, { useState } from 'react';
import {
  Play,
  HelpCircle,
  Settings,
  Trophy,
  Sparkles,
  Zap,
  ChevronRight,
  Gauge,
  ArrowLeft,
} from 'lucide-react';
import { soundEngine } from '../engine/SoundEngine';
import { SpeedChallengeSettings, StorageManager } from '../engine/Storage';

interface SpeedChallengeConfig {
  speedType: 'automatic' | 'custom';
  startingSpeed: number;
  maximumSpeed: number;
  speedIncrease: number;
}

interface MainMenuProps {
  normalHighScore: number;
  speedChallengeHighScore: number;
  onPlayNormal: () => void;
  onPlaySpeedChallenge: (config: SpeedChallengeConfig) => void;
  onHowToPlay: () => void;
  onSettings: () => void;
}

type MenuScreen = 'main' | 'speed_challenge';

export const MainMenu: React.FC<MainMenuProps> = ({
  normalHighScore,
  speedChallengeHighScore,
  onPlayNormal,
  onPlaySpeedChallenge,
  onHowToPlay,
  onSettings,
}) => {
  const [screen, setScreen] = useState<MenuScreen>('main');

  // Load saved SC settings
  const [scSettings, setScSettings] = useState<SpeedChallengeSettings>(() =>
    StorageManager.getSpeedChallengeSettings()
  );

  const [validationMsg, setValidationMsg] = useState<string>('');

  const updateScSettings = (patch: Partial<SpeedChallengeSettings>) => {
    const updated = { ...scSettings, ...patch };

    // Validation: starting speed must not exceed maximum speed
    if (patch.startingSpeed !== undefined && patch.startingSpeed > updated.maximumSpeed) {
      updated.maximumSpeed = patch.startingSpeed;
    }
    if (patch.maximumSpeed !== undefined && patch.maximumSpeed < updated.startingSpeed) {
      updated.startingSpeed = patch.maximumSpeed;
    }

    setScSettings(updated);
    setValidationMsg('');
    StorageManager.saveSpeedChallengeSettings(updated);
  };

  const handleStartSpeedChallenge = () => {
    // Final validation
    if (scSettings.startingSpeed <= 0 || isNaN(scSettings.startingSpeed)) {
      setValidationMsg('Starting speed must be greater than 0.');
      return;
    }
    if (scSettings.maximumSpeed <= 0 || isNaN(scSettings.maximumSpeed)) {
      setValidationMsg('Maximum speed must be greater than 0.');
      return;
    }
    if (scSettings.startingSpeed > scSettings.maximumSpeed) {
      setValidationMsg('Starting speed cannot exceed maximum speed.');
      return;
    }
    soundEngine.playClick();
    onPlaySpeedChallenge({
      speedType: scSettings.speedType,
      startingSpeed: scSettings.startingSpeed,
      maximumSpeed: scSettings.maximumSpeed,
      speedIncrease: scSettings.speedIncrease,
    });
  };

  if (screen === 'speed_challenge') {
    return (
      <SpeedChallengeScreen
        scSettings={scSettings}
        speedChallengeHighScore={speedChallengeHighScore}
        validationMsg={validationMsg}
        onUpdateSettings={updateScSettings}
        onStart={handleStartSpeedChallenge}
        onBack={() => {
          soundEngine.playClick();
          setScreen('main');
          setValidationMsg('');
        }}
      />
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[540px] w-full max-w-2xl p-8 mx-auto my-auto text-center z-20 select-none">
      {/* 4K Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill text-cyan-400 text-[11px] font-mono-cyber uppercase tracking-widest mb-6">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        <span>4K ULTRA EDITION</span>
      </div>

      {/* Hero Typography */}
      <h1 className="text-5xl sm:text-7xl font-heading font-black tracking-tight text-white glow-cyan mb-2">
        NEON SNAKE
      </h1>

      <p className="text-xs sm:text-sm font-mono-cyber text-slate-400 tracking-[0.25em] uppercase mb-10">
        MASTER THE GRID
      </p>

      {/* Two Mode Cards */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Normal Mode Card */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col items-center gap-4 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 group">
          <div className="flex items-center gap-2 mb-1">
            <Play className="w-5 h-5 text-cyan-400" />
            <span className="text-base font-heading font-black tracking-widest text-white">NORMAL MODE</span>
          </div>
          <p className="text-xs font-mono-cyber text-slate-400 leading-relaxed text-center">
            Classic progressive Snake.<br />10 levels of escalating challenge.
          </p>
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

        {/* Speed Challenge Card */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col items-center gap-4 border border-fuchsia-500/20 hover:border-fuchsia-500/40 transition-all duration-300 group relative overflow-hidden">
          {/* Subtle accent glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-transparent pointer-events-none rounded-2xl" />
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-5 h-5 text-fuchsia-400" />
            <span className="text-base font-heading font-black tracking-widest text-white">SPEED CHALLENGE</span>
          </div>
          <p className="text-xs font-mono-cyber text-slate-400 leading-relaxed text-center">
            Test your speed & reflexes.<br />Push beyond your limits.
          </p>
          {speedChallengeHighScore > 0 && (
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono-cyber text-fuchsia-300">
              <Trophy className="w-3.5 h-3.5 text-fuchsia-400" />
              <span>{speedChallengeHighScore.toLocaleString()}</span>
            </div>
          )}
          <button
            onClick={() => {
              soundEngine.playClick();
              setScreen('speed_challenge');
            }}
            className="w-full py-3 rounded-full text-sm font-heading font-black tracking-wider flex items-center justify-center gap-2 mt-auto bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white shadow-lg shadow-fuchsia-900/40 transition-all duration-200 active:scale-95"
          >
            <Gauge className="w-4 h-4" />
            <span>SELECT</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Secondary buttons */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
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

      {/* Footer */}
      <div className="mt-10 text-slate-500 text-[11px] font-mono-cyber tracking-wider">
        10 PROGRESSIVE LEVELS • PROCEDURAL SYNTH SOUND
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Speed Challenge Config Screen
// ─────────────────────────────────────────────────────────────────────────────

interface SpeedChallengeScreenProps {
  scSettings: SpeedChallengeSettings;
  speedChallengeHighScore: number;
  validationMsg: string;
  onUpdateSettings: (patch: Partial<SpeedChallengeSettings>) => void;
  onStart: () => void;
  onBack: () => void;
}

const SpeedChallengeScreen: React.FC<SpeedChallengeScreenProps> = ({
  scSettings,
  speedChallengeHighScore,
  validationMsg,
  onUpdateSettings,
  onStart,
  onBack,
}) => {
  return (
    <div className="relative flex flex-col items-center w-full max-w-md mx-auto my-auto p-6 z-20 select-none">
      {/* Back button */}
      <button
        onClick={onBack}
        className="self-start mb-4 flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-xs font-mono-cyber uppercase tracking-widest"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* Title */}
      <div className="flex items-center gap-2 mb-1">
        <Zap className="w-6 h-6 text-fuchsia-400" />
        <h2 className="text-2xl sm:text-3xl font-heading font-black tracking-widest text-white">
          SPEED CHALLENGE
        </h2>
      </div>
      <p className="text-xs font-mono-cyber text-slate-500 tracking-[0.2em] mb-6">
        CHOOSE SPEED TYPE
      </p>

      {/* High Score */}
      {speedChallengeHighScore > 0 && (
        <div className="glass-pill px-4 py-1.5 rounded-full mb-5 inline-flex items-center gap-2 text-fuchsia-300 text-xs font-mono-cyber">
          <Trophy className="w-3.5 h-3.5 text-fuchsia-400" />
          <span>BEST</span>
          <span className="font-bold text-white">{speedChallengeHighScore.toLocaleString()}</span>
        </div>
      )}

      {/* Speed Type Toggle */}
      <div className="glass-panel w-full rounded-2xl p-1 flex gap-1 mb-5">
        <button
          onClick={() => onUpdateSettings({ speedType: 'automatic' })}
          className={`flex-1 py-2.5 rounded-xl text-xs font-heading font-bold tracking-widest transition-all duration-200 flex items-center justify-center gap-1.5 ${
            scSettings.speedType === 'automatic'
              ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-900/50'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          AUTOMATIC
        </button>
        <button
          onClick={() => onUpdateSettings({ speedType: 'custom' })}
          className={`flex-1 py-2.5 rounded-xl text-xs font-heading font-bold tracking-widest transition-all duration-200 flex items-center justify-center gap-1.5 ${
            scSettings.speedType === 'custom'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Gauge className="w-3.5 h-3.5" />
          CUSTOM
        </button>
      </div>

      {/* Panel Content */}
      <div className="glass-panel w-full rounded-2xl p-5 mb-4">
        {scSettings.speedType === 'automatic' ? (
          <AutomaticPanel />
        ) : (
          <CustomPanel
            scSettings={scSettings}
            onUpdateSettings={onUpdateSettings}
          />
        )}
      </div>

      {/* Validation Message */}
      {validationMsg && (
        <p className="text-xs text-red-400 font-mono-cyber mb-3 text-center">{validationMsg}</p>
      )}

      {/* Start Game Button */}
      <button
        onClick={onStart}
        className="w-full py-4 rounded-full text-base font-heading font-black tracking-wider flex items-center justify-center gap-2 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white shadow-lg shadow-fuchsia-900/40 transition-all duration-200 active:scale-95"
      >
        <Play className="w-5 h-5 fill-current" />
        START GAME
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Automatic sub-panel
// ─────────────────────────────────────────────────────────────────────────────
const AutomaticPanel: React.FC = () => (
  <div className="flex flex-col items-center gap-3 text-center py-2">
    <Zap className="w-8 h-8 text-fuchsia-400 mb-1" />
    <p className="text-sm font-mono-cyber text-slate-300 leading-relaxed">
      Speed increases automatically as you progress through levels.
    </p>
    <div className="w-full mt-2 grid grid-cols-5 gap-1">
      {['1.5x', '2.0x', '3.0x', '4.5x', '6.0x'].map((s, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <div
            className="w-full rounded-md bg-fuchsia-500/20 border border-fuchsia-500/30"
            style={{ height: `${(i + 1) * 8 + 16}px` }}
          />
          <span className="text-[9px] font-mono-cyber text-slate-500">{s}</span>
        </div>
      ))}
    </div>
    <p className="text-[11px] font-mono-cyber text-slate-500 tracking-wider mt-1">
      L1 → 1.5x &nbsp;•&nbsp; L5 → 3.5x &nbsp;•&nbsp; L10 → 6.0x
    </p>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Custom sub-panel
// ─────────────────────────────────────────────────────────────────────────────
interface CustomPanelProps {
  scSettings: SpeedChallengeSettings;
  onUpdateSettings: (patch: Partial<SpeedChallengeSettings>) => void;
}

const CustomPanel: React.FC<CustomPanelProps> = ({ scSettings, onUpdateSettings }) => {
  return (
    <div className="flex flex-col gap-5">
      <SliderRow
        label="STARTING SPEED"
        value={scSettings.startingSpeed}
        min={1.0}
        max={5.0}
        step={0.1}
        unit="x"
        color="fuchsia"
        onChange={(v) => onUpdateSettings({ startingSpeed: v })}
      />
      <SliderRow
        label="MAXIMUM SPEED"
        value={scSettings.maximumSpeed}
        min={1.0}
        max={10.0}
        step={0.1}
        unit="x"
        color="purple"
        onChange={(v) => onUpdateSettings({ maximumSpeed: v })}
      />
      <SliderRow
        label="SPEED INCREASE"
        value={scSettings.speedIncrease}
        min={0.1}
        max={1.0}
        step={0.05}
        unit="x"
        color="violet"
        onChange={(v) => onUpdateSettings({ speedIncrease: v })}
      />
      {/* Preview */}
      <div className="pt-1 border-t border-white/[0.06] text-center">
        <p className="text-[11px] font-mono-cyber text-slate-500">
          Start{' '}
          <span className="text-fuchsia-300 font-bold">{scSettings.startingSpeed.toFixed(1)}x</span>
          {' → '}after each food +{scSettings.speedIncrease.toFixed(2)}x, cap{' '}
          <span className="text-purple-300 font-bold">{scSettings.maximumSpeed.toFixed(1)}x</span>
        </p>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Reusable Slider Row
// ─────────────────────────────────────────────────────────────────────────────
interface SliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  color: 'fuchsia' | 'purple' | 'violet';
  onChange: (v: number) => void;
}

const colorMap: Record<string, string> = {
  fuchsia: 'accent-fuchsia-500',
  purple: 'accent-purple-500',
  violet: 'accent-violet-500',
};

const SliderRow: React.FC<SliderRowProps> = ({ label, value, min, max, step, unit, color, onChange }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono-cyber tracking-widest text-slate-400 uppercase">{label}</span>
        <span className="text-sm font-heading font-bold text-white">
          {value.toFixed(value < 1 ? 2 : 1)}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={`w-full h-1.5 rounded-full cursor-pointer ${colorMap[color]} bg-white/10`}
        style={{
          background: `linear-gradient(to right, var(--tw-gradient-stops, currentColor) ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) ${((value - min) / (max - min)) * 100}%)`,
        }}
      />
      <div className="flex justify-between text-[9px] font-mono-cyber text-slate-600">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
};
