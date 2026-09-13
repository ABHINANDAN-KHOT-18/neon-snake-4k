import React from 'react';
import { X, Volume2, VolumeX, Music, Disc, RotateCcw } from 'lucide-react';
import { GameSettings, StorageManager } from '../engine/Storage';
import { soundEngine } from '../engine/SoundEngine';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  const toggleSfx = () => {
    const updated = { ...settings, sfxEnabled: !settings.sfxEnabled };
    soundEngine.setSfxEnabled(updated.sfxEnabled);
    StorageManager.saveSettings(updated);
    onUpdateSettings(updated);
    if (updated.sfxEnabled) soundEngine.playClick();
  };

  const toggleMusic = () => {
    const updated = { ...settings, musicEnabled: !settings.musicEnabled };
    soundEngine.setMusicEnabled(updated.musicEnabled);
    StorageManager.saveSettings(updated);
    onUpdateSettings(updated);
    if (settings.sfxEnabled) soundEngine.playClick();
  };

  const handleSfxVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const updated = { ...settings, sfxVolume: val };
    soundEngine.setSfxVolume(val);
    StorageManager.saveSettings(updated);
    onUpdateSettings(updated);
  };

  const handleMusicVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const updated = { ...settings, musicVolume: val };
    soundEngine.setMusicVolume(val);
    StorageManager.saveSettings(updated);
    onUpdateSettings(updated);
  };

  const handleClearData = () => {
    if (confirm('Reset high score and player statistics?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-40 p-4 animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-sm p-6 sm:p-7 rounded-3xl text-left flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-heading font-black tracking-tight text-white">
            SETTINGS
          </h2>
          <button
            onClick={() => {
              if (settings.sfxEnabled) soundEngine.playClick();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Settings List */}
        <div className="flex flex-col gap-5">
          {/* Sound Effects Toggle & Slider */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs font-heading font-semibold text-slate-200">
                {settings.sfxEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                <span>SOUND EFFECTS</span>
              </div>
              <button
                onClick={toggleSfx}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${
                  settings.sfxEnabled ? 'bg-cyan-400 justify-end' : 'bg-white/10 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-slate-900 shadow-md transform transition-transform" />
              </button>
            </div>
            {settings.sfxEnabled && (
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.sfxVolume}
                onChange={handleSfxVolume}
                className="w-full accent-cyan-400 cursor-pointer h-1 bg-white/10 rounded-lg appearance-none"
              />
            )}
          </div>

          {/* Synthwave Music Toggle & Slider */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs font-heading font-semibold text-slate-200">
                {settings.musicEnabled ? <Music className="w-4 h-4 text-purple-400" /> : <Disc className="w-4 h-4 text-slate-500" />}
                <span>SYNTH MUSIC</span>
              </div>
              <button
                onClick={toggleMusic}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${
                  settings.musicEnabled ? 'bg-purple-500 justify-end' : 'bg-white/10 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-slate-900 shadow-md transform transition-transform" />
              </button>
            </div>
            {settings.musicEnabled && (
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.musicVolume}
                onChange={handleMusicVolume}
                className="w-full accent-purple-400 cursor-pointer h-1 bg-white/10 rounded-lg appearance-none"
              />
            )}
          </div>

          {/* Reset Stats Option */}
          <div className="pt-3 border-t border-white/10">
            <button
              onClick={handleClearData}
              className="w-full py-2.5 px-3 rounded-full hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 text-xs font-mono-cyber flex items-center justify-center gap-2 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET HIGH SCORES</span>
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            if (settings.sfxEnabled) soundEngine.playClick();
            onClose();
          }}
          className="btn-primary w-full py-3.5 rounded-full text-xs font-heading font-bold tracking-wider uppercase"
        >
          DONE
        </button>
      </div>
    </div>
  );
};
