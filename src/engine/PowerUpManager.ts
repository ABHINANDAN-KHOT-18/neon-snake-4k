/**
 * PowerUpManager.ts - Cybernetic Active Power-Ups Engine
 */

import { LevelManager } from './LevelManager';
import { FoodItem } from './FoodManager';

export type PowerUpType = 'shield' | 'timewarp' | 'magnet' | 'phase';

export interface PowerUpItem {
  x: number;
  y: number;
  type: PowerUpType;
  color: string;
  glowColor: string;
  symbol: string;
  timer: number;
  maxTimer: number;
  pulsePhase: number;
}

export interface PowerUpActiveState {
  type: PowerUpType;
  timeLeft: number;
  maxTime: number;
}

export const POWER_UP_CONFIGS: Record<PowerUpType, { name: string; color: string; glowColor: string; symbol: string; duration: number }> = {
  shield: {
    name: 'Shield Matrix',
    color: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.6)',
    symbol: '🛡️',
    duration: 0, // Shield stays until consumed by a collision!
  },
  timewarp: {
    name: 'Time Warp',
    color: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.6)',
    symbol: '⏱️',
    duration: 6.0,
  },
  magnet: {
    name: 'Food Magnet',
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.6)',
    symbol: '🧲',
    duration: 8.0,
  },
  phase: {
    name: 'Phase Shift',
    color: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.6)',
    symbol: '👻',
    duration: 5.0,
  },
};

export class PowerUpManager {
  public activeItem: PowerUpItem | null = null;
  public activeEffects: Map<PowerUpType, { timeLeft: number; maxTime: number }> = new Map();
  public hasShield: boolean = false;

  private cols: number = 28;
  private rows: number = 28;
  private spawnCooldownTimer: number = 10.0; // Spawns every 10-15s

  constructor(cols: number = 28, rows: number = 28) {
    this.cols = cols;
    this.rows = rows;
  }

  public reset() {
    this.activeItem = null;
    this.activeEffects.clear();
    this.hasShield = false;
    this.spawnCooldownTimer = 10.0;
  }

  public spawnRandomPowerUp(
    snakeBody: { x: number; y: number }[],
    levelManager: LevelManager
  ) {
    if (this.activeItem) return;

    const types: PowerUpType[] = ['shield', 'timewarp', 'magnet', 'phase'];
    const selectedType = types[Math.floor(Math.random() * types.length)];
    const cfg = POWER_UP_CONFIGS[selectedType];

    const pos = this.findGuaranteedSafeCoord(snakeBody, levelManager);

    this.activeItem = {
      x: pos.x,
      y: pos.y,
      type: selectedType,
      color: cfg.color,
      glowColor: cfg.glowColor,
      symbol: cfg.symbol,
      timer: 10.0, // Item disappears if not collected in 10s
      maxTimer: 10.0,
      pulsePhase: 0,
    };
  }

  private findGuaranteedSafeCoord(
    snakeBody: { x: number; y: number }[],
    levelManager: LevelManager
  ): { x: number; y: number } {
    const margin = 2;
    for (let i = 0; i < 200; i++) {
      const x = Math.floor(margin + Math.random() * (this.cols - margin * 2));
      const y = Math.floor(margin + Math.random() * (this.rows - margin * 2));

      if (snakeBody.some((s) => s.x === x && s.y === y)) continue;
      if (levelManager.isCellOccupiedByObstacle(x, y)) continue;

      return { x, y };
    }
    return { x: 5, y: 5 };
  }

  public collectPowerUp(type: PowerUpType) {
    const cfg = POWER_UP_CONFIGS[type];
    if (type === 'shield') {
      this.hasShield = true;
    } else {
      this.activeEffects.set(type, {
        timeLeft: cfg.duration,
        maxTime: cfg.duration,
      });
    }
    this.activeItem = null;
  }

  public consumeShield(): boolean {
    if (this.hasShield) {
      this.hasShield = false;
      return true; // Absorbed!
    }
    return false;
  }

  public isEffectActive(type: PowerUpType): boolean {
    if (type === 'shield') return this.hasShield;
    const effect = this.activeEffects.get(type);
    return effect !== undefined && effect.timeLeft > 0;
  }

  public update(
    dt: number,
    snakeHead: { x: number; y: number },
    foodItems: (FoodItem | null)[],
    snakeBody: { x: number; y: number }[],
    levelManager: LevelManager
  ) {
    // 1. Spawning Cooldown Timer
    if (!this.activeItem) {
      this.spawnCooldownTimer -= dt;
      if (this.spawnCooldownTimer <= 0) {
        this.spawnCooldownTimer = 12.0 + Math.random() * 8.0;
        this.spawnRandomPowerUp(snakeBody, levelManager);
      }
    } else {
      this.activeItem.pulsePhase = (this.activeItem.pulsePhase + dt * 4) % (Math.PI * 2);
      this.activeItem.timer -= dt;
      if (this.activeItem.timer <= 0) {
        this.activeItem = null;
      }
    }

    // 2. Active Effect Duration Timers
    for (const [type, state] of this.activeEffects.entries()) {
      state.timeLeft -= dt;
      if (state.timeLeft <= 0) {
        this.activeEffects.delete(type);
      }
    }

    // 3. Magnetic attraction logic
    if (this.isEffectActive('magnet')) {
      foodItems.forEach((food) => {
        if (!food) return;
        const dx = snakeHead.x - food.x;
        const dy = snakeHead.y - food.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 0 && dist < 7) {
          food.x += (dx / dist) * dt * 4.0;
          food.y += (dy / dist) * dt * 4.0;
          food.x = Math.round(food.x * 100) / 100;
          food.y = Math.round(food.y * 100) / 100;
        }
      });
    }
  }

  public getActiveEffectsList(): PowerUpActiveState[] {
    const list: PowerUpActiveState[] = [];
    if (this.hasShield) {
      list.push({ type: 'shield', timeLeft: 1, maxTime: 1 });
    }
    for (const [type, state] of this.activeEffects.entries()) {
      list.push({ type, timeLeft: state.timeLeft, maxTime: state.maxTime });
    }
    return list;
  }

  public render(ctx: CanvasRenderingContext2D, cellSize: number) {
    if (!this.activeItem) return;

    const item = this.activeItem;
    const cx = (item.x + 0.5) * cellSize;
    const cy = (item.y + 0.5) * cellSize;
    const r = cellSize * 0.42;
    const pulse = Math.sin(item.pulsePhase) * 2;

    ctx.save();
    ctx.shadowColor = item.glowColor;
    ctx.shadowBlur = 15 + pulse * 2;

    // Glowing Hexagon Box
    ctx.fillStyle = 'rgba(10, 15, 30, 0.85)';
    ctx.strokeStyle = item.color;
    ctx.lineWidth = 2;

    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i + item.pulsePhase * 0.2;
      const px = cx + Math.cos(angle) * (r + pulse * 0.5);
      const py = cy + Math.sin(angle) * (r + pulse * 0.5);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Emoji / Icon
    ctx.font = `${Math.floor(cellSize * 0.5)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.symbol, cx, cy);

    // Timeout Arc
    const progress = item.timer / item.maxTimer;
    ctx.strokeStyle = item.color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.35, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress, false);
    ctx.stroke();

    ctx.restore();
  }
}
