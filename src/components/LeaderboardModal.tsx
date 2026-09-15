import React, { useState } from 'react';
import { Award, X, Zap, Play } from 'lucide-react';
import { StorageManager, LeaderboardEntry } from '../engine/Storage';

interface LeaderboardModalProps {
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ onClose }) => {
  const [filterMode, setFilterMode] = useState<'all' | 'normal' | 'speed_challenge'>('all');
  const allEntries = StorageManager.getLeaderboard();

  const filtered = allEntries.filter((e) => filterMode === 'all' || e.mode === filterMode);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in select-none">
      <div className="glass-panel w-full max-w-lg rounded-3xl p-6 border border-cyan-500/30 flex flex-col max-h-[85vh] shadow-2xl shadow-cyan-950/50">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-black tracking-widest text-white">LEADERBOARD</h2>
              <p className="text-xs font-mono-cyber text-slate-400">TOP HALL OF FAME</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="glass-panel rounded-2xl p-1 flex gap-1 mb-4">
          <button
            onClick={() => setFilterMode('all')}
            className={`flex-1 py-2 rounded-xl text-xs font-heading font-bold tracking-wider transition-all ${
              filterMode === 'all' ? 'bg-cyan-500 text-black font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            ALL
          </button>
          <button
            onClick={() => setFilterMode('normal')}
            className={`flex-1 py-2 rounded-xl text-xs font-heading font-bold tracking-wider transition-all flex items-center justify-center gap-1 ${
              filterMode === 'normal' ? 'bg-cyan-500 text-black font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Play className="w-3 h-3" />
            NORMAL
          </button>
          <button
            onClick={() => setFilterMode('speed_challenge')}
            className={`flex-1 py-2 rounded-xl text-xs font-heading font-bold tracking-wider transition-all flex items-center justify-center gap-1 ${
              filterMode === 'speed_challenge' ? 'bg-fuchsia-600 text-white font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3 h-3" />
            SPEED
          </button>
        </div>

        {/* Table of High Scores */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-mono-cyber text-xs">
              No scores recorded yet. Play a game to claim your spot!
            </div>
          ) : (
            filtered.map((entry, idx) => (
              <LeaderboardRow key={entry.id} rank={idx + 1} entry={entry} />
            ))
          )}
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

const LeaderboardRow: React.FC<{ rank: number; entry: LeaderboardEntry }> = ({ rank, entry }) => {
  const getRankBadge = (r: number) => {
    if (r === 1) return 'bg-amber-400 text-black font-black';
    if (r === 2) return 'bg-slate-300 text-black font-bold';
    if (r === 3) return 'bg-amber-700 text-white font-bold';
    return 'bg-white/10 text-slate-400';
  };

  return (
    <div className="glass-panel p-3.5 rounded-2xl flex items-center justify-between border border-white/5 hover:border-cyan-500/30 transition-all">
      <div className="flex items-center gap-3">
        <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono-cyber ${getRankBadge(rank)}`}>
          #{rank}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-heading font-black text-white">
              {entry.score.toLocaleString()}
            </span>
            <span className="text-[10px] font-mono-cyber uppercase px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
              {entry.mode === 'speed_challenge' ? 'SPEED' : 'NORMAL'}
            </span>
          </div>
          <span className="text-[11px] font-mono-cyber text-slate-400">
            Level {entry.level} &nbsp;•&nbsp; {entry.date}
          </span>
        </div>
      </div>
    </div>
  );
};
