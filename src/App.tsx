import { useState, useRef, useEffect, useCallback } from 'react';
import { GameEngine, GameState, GameStatsSnapshot, SpeedChallengeConfig } from './engine/GameEngine';
import { StorageManager, GameSettings } from './engine/Storage';
import { soundEngine } from './engine/SoundEngine';
import { Direction } from './engine/Snake';

import { HUD } from './components/HUD';
import { MainMenu } from './components/MainMenu';
import { CountdownOverlay } from './components/CountdownOverlay';
import { LevelTransitionOverlay } from './components/LevelTransitionOverlay';
import { PauseModal } from './components/PauseModal';
import { GameOverModal } from './components/GameOverModal';
import { VictoryModal } from './components/VictoryModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { SettingsModal } from './components/SettingsModal';
import { VirtualDPad } from './components/VirtualDPad';
import { GameCanvas } from './components/GameCanvas';

export function App() {
  const engineRef = useRef<GameEngine | null>(null);

  const [gameState, setGameState] = useState<GameState>('MENU');
  const [settings, setSettings] = useState<GameSettings>(() => StorageManager.getSettings());
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [transitionNextLevel, setTransitionNextLevel] = useState<number | null>(null);

  // Separate high scores per mode
  const [normalHighScore] = useState<number>(() => StorageManager.getStats().highScore);
  const [speedChallengeHighScore] = useState<number>(() => StorageManager.getSpeedChallengeHighScore());

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
  }));

  useEffect(() => {
    soundEngine.setSfxEnabled(settings.sfxEnabled);
    soundEngine.setMusicEnabled(settings.musicEnabled);
    soundEngine.setSfxVolume(settings.sfxVolume);
    soundEngine.setMusicVolume(settings.musicVolume);
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

  return (
    <div className="relative flex flex-col items-center justify-between w-screen h-screen bg-[#060813] overflow-hidden select-none">
      {/* Soft Ambient Radial Lights */}
      <div className="ambient-glow top-0 left-1/4 w-[450px] h-[450px] bg-cyan-500/15" />
      <div className="ambient-glow bottom-0 right-1/4 w-[450px] h-[450px] bg-indigo-500/15" />

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
          />
        </div>

        {/* Main Menu Screen */}
        {gameState === 'MENU' && (
          <MainMenu
            normalHighScore={normalHighScore}
            speedChallengeHighScore={speedChallengeHighScore}
            onPlayNormal={handlePlayNormal}
            onPlaySpeedChallenge={handlePlaySpeedChallenge}
            onHowToPlay={() => setIsHowToPlayOpen(true)}
            onSettings={() => setIsSettingsOpen(true)}
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
    </div>
  );
}

export default App;
