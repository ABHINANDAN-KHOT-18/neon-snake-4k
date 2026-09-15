import { useState, useRef, useEffect, useCallback } from 'react';
import { GameEngine, GameState, GameStatsSnapshot, SpeedChallengeConfig } from './engine/GameEngine';
import { StorageManager, GameSettings } from './engine/Storage';
import { soundEngine } from './engine/SoundEngine';
import { Direction } from './engine/Snake';
import { AchievementToast } from './engine/AchievementManager';

import { HUD } from './components/HUD';
import { MainMenu } from './components/MainMenu';
import { CountdownOverlay } from './components/CountdownOverlay';
import { LevelTransitionOverlay } from './components/LevelTransitionOverlay';
import { PauseModal } from './components/PauseModal';
import { GameOverModal } from './components/GameOverModal';
import { VictoryModal } from './components/VictoryModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { SettingsModal } from './components/SettingsModal';
import { AchievementsModal } from './components/AchievementsModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { VirtualDPad } from './components/VirtualDPad';
import { GameCanvas } from './components/GameCanvas';

export function App() {
  const engineRef = useRef<GameEngine | null>(null);

  const [gameState, setGameState] = useState<GameState>('MENU');
  const [settings, setSettings] = useState<GameSettings>(() => StorageManager.getSettings());
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [achievementToast, setAchievementToast] = useState<AchievementToast | null>(null);
  const [transitionNextLevel, setTransitionNextLevel] = useState<number | null>(null);

  // High scores read from StorageManager (non-reactive initial values, updated via stats)
  const normalHighScore = StorageManager.getStats().highScore;
  const speedChallengeHighScore = StorageManager.getSpeedChallengeHighScore();

  const [stats, setStats] = useState<GameStatsSnapshot>(() => ({
    score: 0,
    highScore: StorageManager.getStats().highScore,
    level: 1,
    speed: 1.0,
    foodCollected: 0,
    levelFoodProgress: 0,
    levelFoodTarget: 5,
    combo: 0,
    comboTimeLeft: 0,
    isNewHighScore: false,
    gameDuration: 0,
    gameMode: 'normal',
    scSpeedType: 'automatic',
    activePowerUps: [],
    hasShield: false,
    theme: StorageManager.getSettings().theme,
    coins: StorageManager.getCoins(),
    isAutoPlayEnabled: false,
    isAutomationUnlocked: StorageManager.isAutomationUnlocked(),
  }));

  useEffect(() => {
    soundEngine.setSfxEnabled(settings.sfxEnabled);
    soundEngine.setMusicEnabled(settings.musicEnabled);
    soundEngine.setSfxVolume(settings.sfxVolume);
    soundEngine.setMusicVolume(settings.musicVolume);
  }, [settings]);

  useEffect(() => {
    if (engineRef.current && settings.theme) {
      engineRef.current.setTheme(settings.theme);
    }
  }, [settings.theme]);

  const handleAchievementToast = useCallback((toast: AchievementToast) => {
    setAchievementToast(toast);
    setTimeout(() => {
      setAchievementToast(null);
    }, 3500);
  }, []);

  // --- Normal Mode ---
  const handlePlayNormal = useCallback(() => {
    soundEngine.init();
    setTransitionNextLevel(null);
    if (engineRef.current) {
      engineRef.current.startCountdown('normal');
    }
  }, []);

  // --- Speed Challenge Mode ---
  const handlePlaySpeedChallenge = useCallback((config: SpeedChallengeConfig) => {
    soundEngine.init();
    setTransitionNextLevel(null);
    if (engineRef.current) {
      engineRef.current.startCountdown('speed_challenge', config);
    }
  }, []);

  const handleCountdownComplete = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.beginPlaying();
    }
  }, []);

  const handlePause = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.pause();
    }
  }, []);

  const handleResume = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.resume();
    }
  }, []);

  const handleRestart = useCallback(() => {
    setTransitionNextLevel(null);
    if (engineRef.current) {
      engineRef.current.restart();
    }
  }, []);

  const handleMainMenu = useCallback(() => {
    setTransitionNextLevel(null);
    if (engineRef.current) {
      engineRef.current.returnToMenu();
    }
  }, []);

  const handleDirection = useCallback((dir: Direction) => {
    if (engineRef.current) {
      engineRef.current.handleInput(dir);
    }
  }, []);

  const handleLevelTransition = useCallback((nextLevel: number) => {
    setTransitionNextLevel(nextLevel);
  }, []);

  const handleTransitionComplete = useCallback(() => {
    if (transitionNextLevel !== null && engineRef.current) {
      engineRef.current.completeLevelTransition(transitionNextLevel);
      setTransitionNextLevel(null);
    }
  }, [transitionNextLevel]);

  useEffect(() => {
    // Unconditional safe audio context unlock on first user gesture
    const unlockAudio = () => {
      soundEngine.init();
    };
    window.addEventListener('pointerdown', unlockAudio, { once: true, passive: true });
    window.addEventListener('keydown', unlockAudio, { once: true, passive: true });
    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-between w-full h-[100dvh] min-h-[100dvh] max-h-[100dvh] bg-[#060813] overflow-hidden select-none safe-top safe-bottom safe-left safe-right">
      {/* Soft Ambient Radial Lights */}
      <div className="ambient-glow top-0 left-1/4 w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] bg-cyan-500/15" />
      <div className="ambient-glow bottom-0 right-1/4 w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] bg-indigo-500/15" />

      {/* Achievement Unlock Toast */}
      {achievementToast && (
        <div className="fixed top-4 right-4 z-50 glass-panel p-3 sm:p-4 rounded-2xl border border-amber-500/50 flex items-center gap-3 shadow-2xl shadow-amber-950/60 animate-slide-down max-w-[90vw]">
          <div className="text-2xl sm:text-3xl p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 shrink-0">
            {achievementToast.icon}
          </div>
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] font-mono-cyber font-bold tracking-widest text-amber-400 uppercase truncate block">
              ACHIEVEMENT UNLOCKED!
            </span>
            <h4 className="text-xs sm:text-sm font-heading font-black text-white truncate">{achievementToast.title}</h4>
            <p className="text-[11px] sm:text-xs font-mono-cyber text-slate-300 leading-tight">{achievementToast.description}</p>
          </div>
        </div>
      )}

      {/* Top Floating HUD */}
      {gameState !== 'MENU' && (
        <HUD
          stats={stats}
          onPause={handlePause}
          sfxEnabled={settings.sfxEnabled}
          musicEnabled={settings.musicEnabled}
          onToggleSfx={() => {
            const updated = { ...settings, sfxEnabled: !settings.sfxEnabled };
            soundEngine.setSfxEnabled(updated.sfxEnabled);
            StorageManager.saveSettings(updated);
            setSettings(updated);
          }}
          onToggleMusic={() => {
            const updated = { ...settings, musicEnabled: !settings.musicEnabled };
            soundEngine.setMusicEnabled(updated.musicEnabled);
            StorageManager.saveSettings(updated);
            setSettings(updated);
          }}
          onToggleAutoPlay={() => {
            if (engineRef.current) {
              engineRef.current.toggleAutoPlay();
            }
          }}
        />
      )}

      {/* Main Game Stage */}
      <div className="relative flex-1 flex flex-col items-center justify-center w-full max-w-5xl px-3">
        {/* Game Canvas */}
        <div className={`w-full h-full items-center justify-center ${gameState === 'MENU' ? 'hidden' : 'flex'}`}>
          <GameCanvas
            engineRef={engineRef}
            onStatsChange={setStats}
            onStateChange={setGameState}
            onPause={handlePause}
            onLevelTransition={handleLevelTransition}
            onAchievementToast={handleAchievementToast}
          />
        </div>

        {/* Main Menu Screen */}
        {gameState === 'MENU' && (
          <MainMenu
            normalHighScore={normalHighScore}
            speedChallengeHighScore={speedChallengeHighScore}
            coins={stats.coins ?? StorageManager.getCoins()}
            onPlayNormal={handlePlayNormal}
            onPlaySpeedChallenge={handlePlaySpeedChallenge}
            onHowToPlay={() => setIsHowToPlayOpen(true)}
            onSettings={() => setIsSettingsOpen(true)}
            onAchievements={() => setIsAchievementsOpen(true)}
            onLeaderboard={() => setIsLeaderboardOpen(true)}
          />
        )}

        {/* 3-2-1-GO Countdown at Game Start */}
        {gameState === 'COUNTDOWN' && (
          <CountdownOverlay onComplete={handleCountdownComplete} />
        )}

        {/* 3-Second Cinematic Level Transition Countdown */}
        {gameState === 'LEVEL_TRANSITION' && transitionNextLevel !== null && (
          <LevelTransitionOverlay
            nextLevel={transitionNextLevel}
            onComplete={handleTransitionComplete}
          />
        )}

        {/* Pause Modal */}
        {gameState === 'PAUSED' && (
          <PauseModal
            onResume={handleResume}
            onRestart={handleRestart}
            onMainMenu={handleMainMenu}
          />
        )}

        {/* Game Over Modal */}
        {gameState === 'GAMEOVER' && (
          <GameOverModal
            stats={stats}
            onRestart={handleRestart}
            onMainMenu={handleMainMenu}
          />
        )}

        {/* Victory Modal */}
        {gameState === 'VICTORY' && (
          <VictoryModal
            stats={stats}
            onRestart={handleRestart}
            onMainMenu={handleMainMenu}
          />
        )}
      </div>

      {/* Mobile Virtual D-pad */}
      {gameState === 'PLAYING' && (
        <VirtualDPad onDirection={handleDirection} />
      )}

      {/* How To Play Modal */}
      {isHowToPlayOpen && (
        <HowToPlayModal onClose={() => setIsHowToPlayOpen(false)} />
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={setSettings}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* Achievements Modal */}
      {isAchievementsOpen && (
        <AchievementsModal onClose={() => setIsAchievementsOpen(false)} />
      )}

      {/* Leaderboard Modal */}
      {isLeaderboardOpen && (
        <LeaderboardModal onClose={() => setIsLeaderboardOpen(false)} />
      )}
    </div>
  );
}

export default App;

