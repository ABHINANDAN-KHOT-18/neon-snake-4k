import React, { useEffect, useState, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { soundEngine } from '../engine/SoundEngine';
import { LEVEL_CONFIGS } from '../engine/LevelManager';

interface LevelTransitionOverlayProps {
  nextLevel: number;
  onComplete: () => void;
}

type TransitionPhase = 'INTRO' | '3' | '2' | '1' | 'GO';

export const LevelTransitionOverlay: React.FC<LevelTransitionOverlayProps> = ({
  nextLevel,
  onComplete,
}) => {
  const [phase, setPhase] = useState<TransitionPhase>('INTRO');
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const levelCfg = LEVEL_CONFIGS[nextLevel - 1] || LEVEL_CONFIGS[0];
  const formattedLevel = nextLevel < 10 ? `0${nextLevel}` : `${nextLevel}`;

  useEffect(() => {
    // Play level up fanfare on start
    soundEngine.playLevelUp();

    const timers: number[] = [];

    // Phase 1: Intro banner (0ms to 600ms)
    // Phase 2: "3" (at 600ms)
    timers.push(
      window.setTimeout(() => {
        setPhase('3');
        soundEngine.playCountdown(false);
      }, 600)
    );

    // Phase 3: "2" (at 1600ms)
    timers.push(
      window.setTimeout(() => {
        setPhase('2');
        soundEngine.playCountdown(false);
      }, 1600)
    );

    // Phase 4: "1" (at 2600ms)
    timers.push(
      window.setTimeout(() => {
        setPhase('1');
        soundEngine.playCountdown(false);
      }, 2600)
    );

    // Phase 5: "GO!" (at 3600ms)
    timers.push(
      window.setTimeout(() => {
        setPhase('GO');
        soundEngine.playCountdown(true);
      }, 3600)
    );

    // Phase 6: Complete transition & resume gameplay (at 4100ms)
    timers.push(
      window.setTimeout(() => {
        onCompleteRef.current();
      }, 4100)
    );

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-30 pointer-events-none select-none animate-in fade-in duration-300">
      <div className="flex flex-col items-center text-center">
        {/* Level Up Title Banner */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill border border-cyan-400/30 text-cyan-400 text-xs font-mono-cyber uppercase tracking-[0.25em] mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>LEVEL COMPLETE</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-heading font-black tracking-wider text-white glow-cyan mb-1">
          LEVEL UP!
        </h2>

        <div className="text-sm sm:text-base font-heading font-semibold text-slate-300 uppercase tracking-widest mb-6">
          LEVEL {formattedLevel} • {levelCfg.name}
        </div>

        {/* Dynamic Countdown Display */}
        <div className="h-28 flex items-center justify-center">
          {phase === 'INTRO' && (
            <div className="text-xs font-mono-cyber text-slate-400 uppercase tracking-[0.3em] animate-pulse">
              PREPARING ARENA...
            </div>
          )}

          {(phase === '3' || phase === '2' || phase === '1') && (
            <div
              key={phase}
              className="text-7xl sm:text-9xl font-heading font-black text-white glow-cyan tracking-tight animate-in zoom-in-50 fade-in duration-200"
            >
              {phase}
            </div>
          )}

          {phase === 'GO' && (
            <div
              key="GO"
              className="text-7xl sm:text-9xl font-heading font-black text-cyan-400 glow-cyan tracking-tight animate-in zoom-in-75 fade-in duration-150"
            >
              GO!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
