import React, { useEffect, useState, useRef } from 'react';
import { soundEngine } from '../engine/SoundEngine';

interface CountdownOverlayProps {
  onComplete: () => void;
}

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({ onComplete }) => {
  const [count, setCount] = useState<number>(3);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    soundEngine.playCountdown(false);

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          soundEngine.playCountdown(true);
          setTimeout(() => {
            onCompleteRef.current();
          }, 500);
          return 0; // "GO!"
        }
        soundEngine.playCountdown(false);
        return prev - 1;
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-30 pointer-events-none select-none">
      <div key={count} className="animate-in zoom-in-75 fade-in duration-200 flex flex-col items-center">
        {count > 0 ? (
          <div className="text-8xl sm:text-9xl font-heading font-black text-white glow-cyan tracking-tight">
            {count}
          </div>
        ) : (
          <div className="text-7xl sm:text-9xl font-heading font-black text-cyan-400 glow-cyan tracking-tight">
            GO!
          </div>
        )}
        <div className="text-[11px] font-mono-cyber uppercase tracking-[0.3em] text-slate-400 mt-4">
          SYSTEM ENGAGED
        </div>
      </div>
    </div>
  );
};
