import React from 'react';
import { Trophy, X, CheckCircle, Lock } from 'lucide-react';
import { AchievementManager } from '../engine/AchievementManager';

interface AchievementsModalProps {
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ onClose }) => {
  const manager = new AchievementManager();
  const achievements = manager.getAchievements();
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in select-none">
      <div className="glass-panel w-full max-w-xl rounded-3xl p-6 border border-cyan-500/30 flex flex-col max-h-[85vh] shadow-2xl shadow-cyan-950/50">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-black tracking-widest text-white">ACHIEVEMENTS</h2>
              <p className="text-xs font-mono-cyber text-slate-400">
                {unlockedCount} / {achievements.length} UNLOCKED
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/5 rounded-full h-2 mb-6 overflow-hidden border border-white/10">
          <div
            className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full transition-all duration-500 rounded-full"
            style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
          />
        </div>

        {/* Grid of Badges */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {achievements.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all duration-300 flex items-start gap-3.5 ${
                item.unlocked
                  ? 'bg-gradient-to-br from-amber-500/10 to-yellow-500/5 border-amber-500/40 shadow-lg shadow-amber-950/20'
                  : 'bg-white/[0.02] border-white/10 opacity-60'
              }`}
            >
              <div className="text-2xl p-2 rounded-xl bg-black/30 border border-white/10 shrink-0">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <h3 className={`text-sm font-heading font-bold truncate ${item.unlocked ? 'text-amber-300' : 'text-slate-300'}`}>
                    {item.title}
                  </h3>
                  {item.unlocked ? (
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  )}
                </div>
                <p className="text-xs font-mono-cyber text-slate-400 leading-tight">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <button
            onClick={onClose}
            className="btn-secondary w-full py-3 rounded-full text-xs font-heading font-bold tracking-wider"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
