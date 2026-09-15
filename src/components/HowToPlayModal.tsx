import React from 'react';
import { X, Navigation, Apple, PlusCircle, ShieldAlert, Trophy, Zap } from 'lucide-react';
import { soundEngine } from '../engine/SoundEngine';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  const guideItems = [
    {
      icon: <Navigation className="w-5 h-5 text-cyan-400" />,
      title: 'MOVE',
      desc: 'Arrow Keys / WASD or Touch Swipe',
    },
    {
      icon: <Apple className="w-5 h-5 text-emerald-400" />,
      title: 'COLLECT',
      desc: 'Eat glowing food & bonus stars',
    },
    {
      icon: <PlusCircle className="w-5 h-5 text-purple-400" />,
      title: 'GROW',
      desc: 'Your snake grows with each bite',
    },
    {
      icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
      title: 'SURVIVE',
      desc: 'Avoid perimeter walls & obstacles',
    },
    {
      icon: <Trophy className="w-5 h-5 text-amber-400" />,
      title: 'SCORE',
      desc: 'Chain quick eats to multiply combos',
    },
    {
      icon: <Zap className="w-5 h-5 text-cyan-400" />,
      title: 'LEVEL UP',
      desc: 'Speed and difficulty scale across 10 stages',
    },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-40 p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-md p-5 sm:p-7 rounded-3xl text-left flex flex-col gap-5 sm:gap-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-heading font-black tracking-tight text-white">
            HOW TO PLAY
          </h2>
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Minimal 2-column Guide Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {guideItems.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-start gap-3"
            >
              <div className="p-2 rounded-xl bg-white/[0.04] mt-0.5">
                {item.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-heading font-bold text-white tracking-wider">
                  {item.title}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  {item.desc}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="btn-primary w-full py-3.5 rounded-full text-xs font-heading font-bold tracking-wider uppercase"
        >
          GOT IT
        </button>
      </div>
    </div>
  );
};
