/**
 * GameEngine.ts - Master 60FPS High-DPI 4K Cyber Arcade Engine
 */

import { Snake, Direction } from './Snake';
import { FoodManager, FoodItem } from './FoodManager';
import { LevelManager, ThemeId } from './LevelManager';
import { ParticleSystem } from './ParticleSystem';
import { soundEngine } from './SoundEngine';
import { StorageManager } from './Storage';
import { PowerUpManager, PowerUpActiveState, POWER_UP_CONFIGS } from './PowerUpManager';
import { AchievementManager, AchievementToast } from './AchievementManager';
import { AutoPlayAI } from './AutoPlayAI';

export type GameState = 'MENU' | 'COUNTDOWN' | 'PLAYING' | 'PAUSED' | 'GAMEOVER' | 'VICTORY' | 'LEVEL_TRANSITION';
export type GameMode = 'normal' | 'speed_challenge';
export type SCSpeedType = 'automatic' | 'custom';

export interface SpeedChallengeConfig {
  speedType: SCSpeedType;
  startingSpeed: number;
  maximumSpeed: number;
  speedIncrease: number;
  autoPlay?: boolean;
}

export interface GameStatsSnapshot {
  score: number;
  highScore: number;
  level: number;
  speed: number;
  foodCollected: number;
  levelFoodProgress: number;
  levelFoodTarget: number;
  combo: number;
  comboTimeLeft: number;
  isNewHighScore: boolean;
  gameDuration: number;
  gameMode: GameMode;
  scSpeedType: SCSpeedType;
  activePowerUps: PowerUpActiveState[];
  hasShield: boolean;
  theme: ThemeId;
  coins: number;
  isAutoPlayEnabled: boolean;
  isAutomationUnlocked: boolean;
}

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animFrameId: number | null = null;
  private lastTime: number = 0;

  // Grid Configuration
  public readonly gridCols: number = 28;
  public readonly gridRows: number = 28;
  private cellSize: number = 24;

  // Subsystems
  public snake: Snake;
  public foodManager: FoodManager;
  public levelManager: LevelManager;
  public particles: ParticleSystem;
  public powerUpManager: PowerUpManager;
  public achievementManager: AchievementManager;

  // Auto Play & Coin State
  public coins: number = StorageManager.getCoins();
  public isAutoPlayEnabled: boolean = false;
  public isAutomationUnlocked: boolean = StorageManager.isAutomationUnlocked();

  // Game Play State
  public state: GameState = 'MENU';
  public score: number = 0;
  public highScore: number = 0;
  public foodCollected: number = 0;
  public levelFoodEaten: number = 0;
  public goldenEatenRun: number = 0;
  public powerUpsCollectedTotal: number = 0;
  public combo: number = 0;
  public comboTimer: number = 0;
  public readonly maxComboTime: number = 3.5;
  public gameDuration: number = 0;
  public isNewHighScore: boolean = false;

  // Timing & Movement Tick
  private tickAccumulator: number = 0;
  private baseTickRate: number = 7;

  // --- Speed Challenge State ---
  public gameMode: GameMode = 'normal';
  public scSpeedType: SCSpeedType = 'automatic';
  private scCurrentSpeed: number = 1.5;
  private scMaximumSpeed: number = 6.0;
  private scSpeedIncrease: number = 0.5;

  /** Speed multipliers for Automatic SC per level (index 0 = level 1) */
  private static readonly SC_AUTO_SPEEDS: number[] = [
    1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0,
  ];

  // React State Callbacks
  public onStatsChange?: (stats: GameStatsSnapshot) => void;
  public onStateChange?: (state: GameState) => void;
  public onLevelTransition?: (nextLevel: number) => void;
  public onAchievementToast?: (toast: AchievementToast) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false })!;

    this.snake = new Snake(8, 14, 4);
    this.foodManager = new FoodManager(this.gridCols, this.gridRows);
    this.levelManager = new LevelManager(this.gridCols, this.gridRows);
    this.particles = new ParticleSystem();
    this.powerUpManager = new PowerUpManager(this.gridCols, this.gridRows);
    this.achievementManager = new AchievementManager();

    const storedSettings = StorageManager.getSettings();
    this.levelManager.activeTheme = storedSettings.theme;

    const storedStats = StorageManager.getStats();
    this.highScore = storedStats.highScore;

    this.updateSnakeColors();
    this.resizeCanvas();
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('orientationchange', this.handleResize);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', this.handleResize);
    }
  }

  public setTheme(themeId: ThemeId) {
    this.levelManager.activeTheme = themeId;
    this.updateSnakeColors();
    this.render();
  }

  public destroy() {
    this.stopLoop();
    soundEngine.stopMusic();
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('orientationchange', this.handleResize);
    if (window.visualViewport) {
      window.visualViewport.removeEventListener('resize', this.handleResize);
    }
  }

  private handleResize = () => {
    this.resizeCanvas();
    this.render();
  };

  public resizeCanvas() {
    const parent = this.canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    let availableWidth = rect.width > 0 ? rect.width : window.innerWidth - 24;
    let availableHeight = rect.height > 0 ? rect.height : window.innerHeight * 0.65;

    const size = Math.min(availableWidth, availableHeight) - 6;
    const finalSize = Math.max(220, Math.floor(size));

    this.canvas.width = finalSize * dpr;
    this.canvas.height = finalSize * dpr;
    this.canvas.style.width = `${finalSize}px`;
    this.canvas.style.height = `${finalSize}px`;

    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.cellSize = finalSize / this.gridCols;
  }

  private stopLoop() {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  public startCountdown(mode: GameMode = 'normal', scConfig?: SpeedChallengeConfig) {
    this.stopLoop();
    this.state = 'COUNTDOWN';
    this.score = 0;
    this.foodCollected = 0;
    this.levelFoodEaten = 0;
    this.goldenEatenRun = 0;
    this.powerUpsCollectedTotal = 0;
    this.combo = 0;
    this.comboTimer = 0;
    this.gameDuration = 0;
    this.isNewHighScore = false;

    this.powerUpManager.reset();

    // --- Mode setup ---
    this.gameMode = mode;
    if (mode === 'speed_challenge' && scConfig) {
      this.scSpeedType = scConfig.speedType;
      this.scCurrentSpeed = scConfig.speedType === 'automatic'
        ? GameEngine.SC_AUTO_SPEEDS[0]
        : Math.max(0.1, scConfig.startingSpeed);
      this.scMaximumSpeed = Math.max(this.scCurrentSpeed, scConfig.maximumSpeed);
      this.scSpeedIncrease = Math.max(0.01, scConfig.speedIncrease);

      this.highScore = StorageManager.getSpeedChallengeHighScore();

      // Single-use 500-coin Auto Play activation
      if (scConfig.autoPlay && StorageManager.getCoins() >= 500) {
        StorageManager.deductCoins(500);
        this.coins = StorageManager.getCoins();
        this.isAutoPlayEnabled = true;
      } else {
        this.isAutoPlayEnabled = false;
      }
    } else {
      this.gameMode = 'normal';
      this.isAutoPlayEnabled = false;
      const storedStats = StorageManager.getStats();
      this.highScore = storedStats.highScore;
    }

    this.levelManager.loadLevel(1);
    this.snake.reset(8, 14, 4);
    this.particles.clear();
    this.foodManager.foodEatenCount = 0;
    this.foodManager.bonusFood = null;
    this.foodManager.spawnFood(this.snake.body, this.levelManager);

    this.updateSnakeColors();
    this.resizeCanvas();
    this.emitStats();
    this.render();
    this.onStateChange?.('COUNTDOWN');
  }

  public beginPlaying() {
    this.stopLoop();
    this.state = 'PLAYING';
    this.lastTime = performance.now();
    this.tickAccumulator = 0;

    soundEngine.startMusic(this.getCurrentSpeed());
    this.onStateChange?.('PLAYING');

    this.animFrameId = requestAnimationFrame(this.loop);
  }

  public pause() {
    if (this.state !== 'PLAYING') return;
    this.state = 'PAUSED';
    this.stopLoop();
    soundEngine.stopMusic();
    soundEngine.playClick();
    this.render();
    this.onStateChange?.('PAUSED');
  }

  public resume() {
    if (this.state !== 'PAUSED') return;
    this.stopLoop();
    this.state = 'PLAYING';
    this.lastTime = performance.now();
    soundEngine.startMusic(this.getCurrentSpeed());
    soundEngine.playClick();
    this.onStateChange?.('PLAYING');

    this.animFrameId = requestAnimationFrame(this.loop);
  }

  public restart() {
    soundEngine.stopMusic();
    if (this.gameMode === 'speed_challenge') {
      this.startCountdown('speed_challenge', {
        speedType: this.scSpeedType,
        startingSpeed: this.scCurrentSpeed,
        maximumSpeed: this.scMaximumSpeed,
        speedIncrease: this.scSpeedIncrease,
      });
    } else {
      this.startCountdown('normal');
    }
  }

  public returnToMenu() {
    this.stopLoop();
    this.state = 'MENU';
    this.isAutoPlayEnabled = false;
    soundEngine.stopMusic();
    soundEngine.playClick();
    this.onStateChange?.('MENU');
  }

  public handleInput(dir: Direction) {
    if (this.state === 'PLAYING' || this.state === 'COUNTDOWN' || this.state === 'LEVEL_TRANSITION') {
      this.snake.setDirection(dir);
    }
  }

  public completeLevelTransition(nextLevel: number) {
    this.levelManager.loadLevel(nextLevel);
    this.levelFoodEaten = 0;
    this.updateSnakeColors();

    if (this.gameMode === 'speed_challenge' && this.scSpeedType === 'automatic') {
      const idx = Math.max(0, Math.min(nextLevel - 1, GameEngine.SC_AUTO_SPEEDS.length - 1));
      this.scCurrentSpeed = GameEngine.SC_AUTO_SPEEDS[idx];
    }

    if (!this.foodManager.currentFood) {
      this.foodManager.spawnFood(this.snake.body, this.levelManager);
    }

    soundEngine.updateMusicSpeed(this.getCurrentSpeed());

    this.state = 'PLAYING';
    this.lastTime = performance.now();
    this.tickAccumulator = 0;
    this.emitStats();
    this.onStateChange?.('PLAYING');

    this.animFrameId = requestAnimationFrame(this.loop);
  }

  public getCurrentSpeed(): number {
    const comboBoost = Math.min(0.25, this.combo * 0.025);
    let rawSpeed = 1.0;

    if (this.gameMode === 'speed_challenge') {
      rawSpeed = Math.min(this.scCurrentSpeed + comboBoost, this.scMaximumSpeed);
    } else {
      const cfg = this.levelManager.getLevelConfig();
      rawSpeed = cfg.baseSpeed + comboBoost;
    }

    if (this.powerUpManager.isEffectActive('timewarp')) {
      rawSpeed *= 0.6; // Time Warp 40% slow-mo!
    }

    return Number(Math.max(0.2, rawSpeed).toFixed(2));
  }

  private updateSnakeColors() {
    const cfg = this.levelManager.getLevelConfig();
    this.snake.setColor(cfg.colorScheme.primary, cfg.colorScheme.secondary, cfg.colorScheme.glow);
  }

  // --- GAME LOOP ---

  private loop = (currentTime: number) => {
    if (this.state !== 'PLAYING') {
      this.render();
      return;
    }

    const dt = Math.min(0.08, (currentTime - this.lastTime) / 1000);
    this.lastTime = currentTime;

    this.update(dt);
    this.render();

    if (this.state === 'PLAYING') {
      this.animFrameId = requestAnimationFrame(this.loop);
    }
  };

  private update(dt: number) {
    this.gameDuration += dt;

    if (this.combo > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.combo = 0;
        this.comboTimer = 0;
      }
    }

    this.foodManager.update(dt);
    this.levelManager.update(dt);
    this.foodManager.repositionIfColliding(this.snake.body, this.levelManager);
    this.particles.update();

    this.powerUpManager.update(
      dt,
      this.snake.getHead(),
      [this.foodManager.currentFood, this.foodManager.bonusFood],
      this.snake.body,
      this.levelManager
    );

    // Achievement checks
    this.achievementManager.check(
      {
        level: this.levelManager.currentLevel,
        speed: this.getCurrentSpeed(),
        combo: this.combo,
        goldenInRun: this.goldenEatenRun,
        powerUpsCollectedTotal: this.powerUpsCollectedTotal,
      },
      (toast) => {
        soundEngine.playAchievement();
        this.onAchievementToast?.(toast);
      }
    );

    const currentSpeed = this.getCurrentSpeed();
    const ticksPerSec = this.baseTickRate * currentSpeed;
    const tickInterval = 1 / ticksPerSec;

    this.tickAccumulator += dt;
    this.snake.interpolationProgress = Math.min(1, this.tickAccumulator / tickInterval);

    if (this.tickAccumulator >= tickInterval) {
      this.tickAccumulator -= tickInterval;
      this.performGameTick();
    }

    if (this.state === 'PLAYING' && !this.powerUpManager.isEffectActive('phase')) {
      const head = this.snake.getInterpolatedHead();
      if (this.levelManager.checkContinuousCollision(head.x, head.y)) {
        if (this.powerUpManager.consumeShield()) {
          soundEngine.playShieldAbsorb();
          this.particles.triggerShake(10);
          this.particles.addShockwave(
            (head.x + 0.5) * this.cellSize,
            (head.y + 0.5) * this.cellSize,
            '#06b6d4',
            120
          );
        } else {
          this.handleGameOver();
          return;
        }
      }
    }

    this.emitStats();
  }

  public toggleAutoPlay(): boolean {
    if (this.gameMode !== 'speed_challenge') return false;
    this.isAutoPlayEnabled = !this.isAutoPlayEnabled;
    this.emitStats();
    return true;
  }


  private performGameTick() {
    if (this.isAutoPlayEnabled) {
      const autoDir = AutoPlayAI.getNextDirection(
        this.snake,
        this.foodManager,
        this.levelManager,
        this.powerUpManager,
        this.gridCols,
        this.gridRows
      );
      this.snake.setDirection(autoDir);
    }

    const isPhase = this.powerUpManager.isEffectActive('phase');
    const alive = this.snake.step(this.gridCols, this.gridRows);

    if (!alive && !isPhase) {
      if (this.powerUpManager.consumeShield()) {
        soundEngine.playShieldAbsorb();
        const head = this.snake.getHead();
        this.particles.triggerShake(10);
        this.particles.addShockwave(
          (head.x + 0.5) * this.cellSize,
          (head.y + 0.5) * this.cellSize,
          '#06b6d4',
          120
        );
      } else {
        this.handleGameOver();
        return;
      }
    } else if (!alive && isPhase) {
      // Wrap head around grid walls during phase shift!
      const head = this.snake.body[0];
      if (head.x < 0) head.x = this.gridCols - 1;
      else if (head.x >= this.gridCols) head.x = 0;
      if (head.y < 0) head.y = this.gridRows - 1;
      else if (head.y >= this.gridRows) head.y = 0;
    }

    const head = this.snake.getHead();

    if (!isPhase && this.levelManager.checkDiscreteGridCollision(head.x, head.y)) {
      if (this.powerUpManager.consumeShield()) {
        soundEngine.playShieldAbsorb();
        this.particles.triggerShake(10);
        this.particles.addShockwave(
          (head.x + 0.5) * this.cellSize,
          (head.y + 0.5) * this.cellSize,
          '#06b6d4',
          120
        );
      } else {
        this.handleGameOver();
        return;
      }
    }

    const tail = this.snake.body[this.snake.body.length - 1];
    const cfg = this.levelManager.getLevelConfig();
    this.particles.addTrailParticle(
      (tail.x + 0.5) * this.cellSize,
      (tail.y + 0.5) * this.cellSize,
      cfg.colorScheme.primary
    );

    // Food collisions
    if (
      this.foodManager.currentFood &&
      Math.hypot(head.x - this.foodManager.currentFood.x, head.y - this.foodManager.currentFood.y) < 0.85
    ) {
      this.collectFood(this.foodManager.currentFood);
      this.foodManager.spawnFood(this.snake.body, this.levelManager);
    }

    if (
      this.foodManager.bonusFood &&
      Math.hypot(head.x - this.foodManager.bonusFood.x, head.y - this.foodManager.bonusFood.y) < 0.85
    ) {
      this.collectFood(this.foodManager.bonusFood);
      this.foodManager.bonusFood = null;
    }

    // Power-Up pickup collision
    if (
      this.powerUpManager.activeItem &&
      Math.hypot(head.x - this.powerUpManager.activeItem.x, head.y - this.powerUpManager.activeItem.y) < 0.85
    ) {
      const pItem = this.powerUpManager.activeItem;
      this.powerUpManager.collectPowerUp(pItem.type);
      this.powerUpsCollectedTotal++;
      soundEngine.playPowerUp();

      const cx = (pItem.x + 0.5) * this.cellSize;
      const cy = (pItem.y + 0.5) * this.cellSize;
      this.particles.addSparks(cx, cy, pItem.color, 24);
      this.particles.addShockwave(cx, cy, pItem.color, 100);
      this.particles.addFloatingText(
        cx,
        cy - 12,
        POWER_UP_CONFIGS[pItem.type].name,
        pItem.color,
        18
      );
    }
  }

  private collectFood(food: FoodItem) {
    this.snake.grow(food.type === 'bonus' ? 2 : 1);
    this.foodCollected++;
    this.levelFoodEaten++;
    this.foodManager.foodEatenCount++;
    if (food.type === 'golden') this.goldenEatenRun++;

    // Coin earnings: Snake Challenge only (normal=1, golden=5, bonus=10)
    if (this.gameMode === 'normal') {
      const coinEarned = food.type === 'golden' ? 5 : food.type === 'bonus' ? 10 : 1;
      StorageManager.addCoins(coinEarned);
      this.coins = StorageManager.getCoins();
    }

    this.combo = Math.min(10, this.combo + 1);
    this.comboTimer = this.maxComboTime;

    const multiplier = 1 + (this.combo - 1) * 0.5;
    const addedScore = Math.floor(food.points * multiplier);
    this.score += addedScore;

    if (this.gameMode === 'speed_challenge') {
      if (this.scSpeedType === 'automatic') {
        const idx = Math.max(0, Math.min(this.levelManager.currentLevel - 1, GameEngine.SC_AUTO_SPEEDS.length - 1));
        const levelTargetSpeed = GameEngine.SC_AUTO_SPEEDS[idx];
        const nudge = 0.05;
        this.scCurrentSpeed = Math.min(levelTargetSpeed, this.scCurrentSpeed + nudge);
      } else {
        this.scCurrentSpeed = Math.min(this.scMaximumSpeed, this.scCurrentSpeed + this.scSpeedIncrease);
      }
    }

    const cx = (food.x + 0.5) * this.cellSize;
    const cy = (food.y + 0.5) * this.cellSize;
    this.particles.addSparks(cx, cy, food.color, food.type === 'bonus' ? 20 : 12);
    this.particles.addShockwave(cx, cy, food.color, food.type === 'bonus' ? 80 : 50);
    this.particles.addFloatingText(
      cx,
      cy - 8,
      `+${addedScore}${this.combo > 1 ? ` (x${this.combo})` : ''}`,
      food.color,
      16 + this.combo
    );

    if (food.type === 'golden') {
      soundEngine.playEatGolden();
    } else if (food.type === 'bonus') {
      soundEngine.playEatBonus();
    } else {
      soundEngine.playEatNormal();
    }

    if (this.combo > 1) {
      soundEngine.playCombo(this.combo);
    }

    if (this.score > this.highScore) {
      if (!this.isNewHighScore && this.highScore > 0) {
        soundEngine.playNewHighScore();
      }
      this.highScore = this.score;
      this.isNewHighScore = true;
    }

    const currentCfg = this.levelManager.getLevelConfig();
    if (this.levelFoodEaten >= currentCfg.targetFood) {
      this.advanceLevel();
    }
  }

  private advanceLevel() {
    // Level completion coin reward (+10 coins) — Snake Challenge only
    if (this.gameMode === 'normal') {
      StorageManager.addCoins(10);
      this.coins = StorageManager.getCoins();
    }

    if (this.levelManager.currentLevel >= 10) {
      this.handleVictory();
      return;
    }

    const nextLevel = this.levelManager.currentLevel + 1;

    this.stopLoop();
    this.state = 'LEVEL_TRANSITION';

    const cfg = this.levelManager.getLevelConfig();
    this.particles.triggerShake(8);
    this.particles.addShockwave(
      (this.gridCols / 2) * this.cellSize,
      (this.gridRows / 2) * this.cellSize,
      cfg.colorScheme.primary,
      150
    );

    this.render();
    this.onLevelTransition?.(nextLevel);
    this.onStateChange?.('LEVEL_TRANSITION');
  }

  private handleGameOver() {
    this.stopLoop();
    this.state = 'GAMEOVER';
    soundEngine.stopMusic();
    soundEngine.playCrash();
    this.particles.triggerShake(16);

    const head = this.snake.getInterpolatedHead();
    this.particles.addSparks(
      (head.x + 0.5) * this.cellSize,
      (head.y + 0.5) * this.cellSize,
      '#ef4444',
      30
    );

    if (this.gameMode === 'speed_challenge') {
      const res = StorageManager.updateSpeedChallengeHighScore(this.score, this.levelManager.currentLevel);
      this.isNewHighScore = res.isNewHighScore;
      this.highScore = res.highScore;
    } else {
      const res = StorageManager.updateHighScore(this.score, this.levelManager.currentLevel);
      this.isNewHighScore = res.isNewHighScore;
      this.highScore = res.highScore;
    }
    StorageManager.recordGameEnd(this.foodCollected, this.gameDuration, {
      powerUps: this.powerUpsCollectedTotal,
      golden: this.goldenEatenRun,
      maxCombo: this.combo,
    });

    this.emitStats();
    this.render();
    this.onStateChange?.('GAMEOVER');
  }

  private handleVictory() {
    // Victory completion reward (+25 coins) — Snake Challenge only
    if (this.gameMode === 'normal') {
      StorageManager.addCoins(25);
      this.coins = StorageManager.getCoins();
    }

    this.stopLoop();
    this.state = 'VICTORY';
    soundEngine.stopMusic();
    soundEngine.playVictory();
    this.particles.triggerShake(12);

    this.achievementManager.check(
      { level: 10, speed: this.getCurrentSpeed(), combo: this.combo, isVictory: true },
      (toast) => {
        soundEngine.playAchievement();
        this.onAchievementToast?.(toast);
      }
    );

    if (this.gameMode === 'speed_challenge') {
      const res = StorageManager.updateSpeedChallengeHighScore(this.score, 10);
      this.isNewHighScore = res.isNewHighScore;
      this.highScore = res.highScore;
    } else {
      const res = StorageManager.updateHighScore(this.score, 10);
      this.isNewHighScore = res.isNewHighScore;
      this.highScore = res.highScore;
    }
    StorageManager.recordGameEnd(this.foodCollected, this.gameDuration, {
      powerUps: this.powerUpsCollectedTotal,
      golden: this.goldenEatenRun,
      maxCombo: this.combo,
    });

    this.emitStats();
    this.render();
    this.onStateChange?.('VICTORY');
  }

  public emitStats() {
    const cfg = this.levelManager.getLevelConfig();
    this.onStatsChange?.({
      score: this.score,
      highScore: this.highScore,
      level: this.levelManager.currentLevel,
      speed: this.getCurrentSpeed(),
      foodCollected: this.foodCollected,
      levelFoodProgress: this.levelFoodEaten,
      levelFoodTarget: cfg.targetFood,
      combo: this.combo,
      comboTimeLeft: Math.max(0, this.comboTimer),
      isNewHighScore: this.isNewHighScore,
      gameDuration: this.gameDuration,
      gameMode: this.gameMode,
      scSpeedType: this.scSpeedType,
      activePowerUps: this.powerUpManager.getActiveEffectsList(),
      hasShield: this.powerUpManager.hasShield,
      theme: this.levelManager.activeTheme,
      coins: this.coins,
      isAutoPlayEnabled: this.isAutoPlayEnabled,
      isAutomationUnlocked: StorageManager.isAutomationUnlocked(),
    });
  }

  // --- RENDERING ---

  public render() {
    const ctx = this.ctx;
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);
    const cfg = this.levelManager.getLevelConfig();

    ctx.save();

    ctx.translate(this.particles.shakeOffsetX, this.particles.shakeOffsetY);

    // 1. Dark Obsidian Arena Background
    ctx.fillStyle = cfg.colorScheme.ambientBg;
    ctx.fillRect(-20, -20, width + 40, height + 40);

    // 2. Subtle Ambient Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
    ctx.lineWidth = 1;

    for (let x = 0; x <= this.gridCols; x++) {
      ctx.beginPath();
      ctx.moveTo(x * this.cellSize, 0);
      ctx.lineTo(x * this.cellSize, height);
      ctx.stroke();
    }

    for (let y = 0; y <= this.gridRows; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * this.cellSize);
      ctx.lineTo(width, y * this.cellSize);
      ctx.stroke();
    }

    // 3. Subtle Perimeter Edge Glow
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0.5, 0.5, width - 1, height - 1);

    // 4. Render Hazards
    this.levelManager.render(ctx, this.cellSize);

    // 5. Render Food
    this.foodManager.render(ctx, this.cellSize);

    // 6. Render Active Power-Up Items on Grid
    this.powerUpManager.render(ctx, this.cellSize);

    // 7. Render Snake
    this.snake.render(ctx, this.cellSize);

    // Shield / Phase Head Aura
    if (this.powerUpManager.hasShield || this.powerUpManager.isEffectActive('phase')) {
      const head = this.snake.getInterpolatedHead();
      const cx = (head.x + 0.5) * this.cellSize;
      const cy = (head.y + 0.5) * this.cellSize;
      const auraColor = this.powerUpManager.hasShield ? '#06b6d4' : '#ec4899';
      ctx.save();
      ctx.strokeStyle = auraColor;
      ctx.shadowColor = auraColor;
      ctx.shadowBlur = 14;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, this.cellSize * 0.65, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 8. Render Particles
    this.particles.render(ctx);

    ctx.restore();
  }
}

