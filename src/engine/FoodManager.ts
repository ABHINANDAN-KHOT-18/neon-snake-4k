/**
 * FoodManager.ts - Food Spawning, Types, Timers and Guaranteed Safe Placement
 */

import { LevelManager } from './LevelManager';

export type FoodType = 'normal' | 'golden' | 'bonus';

export interface FoodItem {
  x: number;
  y: number;
  type: FoodType;
  points: number;
  color: string;
  glowColor: string;
  timer?: number;
  maxTimer?: number;
  pulsePhase: number;
}

export class FoodManager {
  public currentFood: FoodItem | null = null;
  public bonusFood: FoodItem | null = null;
  public foodEatenCount: number = 0;
  private cols: number = 28;
  private rows: number = 28;

  constructor(cols: number = 28, rows: number = 28) {
    this.cols = cols;
    this.rows = rows;
  }

  public spawnFood(
    snakeBody: { x: number; y: number }[],
    levelManager: LevelManager,
    forceGolden: boolean = false
  ): FoodItem {
    const isGolden = forceGolden || (this.foodEatenCount > 0 && this.foodEatenCount % 5 === 0);
    const type: FoodType = isGolden ? 'golden' : 'normal';
    const pos = this.findGuaranteedSafeCoord(snakeBody, levelManager);

    this.currentFood = {
      x: pos.x,
      y: pos.y,
      type,
      points: isGolden ? 50 : 10,
      color: isGolden ? '#facc15' : '#00f5ff',
      glowColor: isGolden ? 'rgba(250, 204, 21, 0.6)' : 'rgba(0, 245, 255, 0.5)',
      pulsePhase: 0,
    };

    if (levelManager.currentLevel >= 3 && !this.bonusFood && Math.random() < 0.35) {
      this.spawnBonusFood(snakeBody, levelManager);
    }

    return this.currentFood;
  }

  public spawnBonusFood(snakeBody: { x: number; y: number }[], levelManager: LevelManager) {
    const pos = this.findGuaranteedSafeCoord(snakeBody, levelManager);
    this.bonusFood = {
      x: pos.x,
      y: pos.y,
      type: 'bonus',
      points: 100,
      color: '#ec4899',
      glowColor: 'rgba(236, 72, 153, 0.6)',
      timer: 8.0,
      maxTimer: 8.0,
      pulsePhase: 0,
    };
  }

  private findGuaranteedSafeCoord(
    snakeBody: { x: number; y: number }[],
    levelManager: LevelManager
  ): { x: number; y: number } {
    const margin = 1;

    for (let attempt = 0; attempt < 250; attempt++) {
      const x = Math.floor(margin + Math.random() * (this.cols - margin * 2));
      const y = Math.floor(margin + Math.random() * (this.rows - margin * 2));

      const hitsSnake = snakeBody.some((seg) => seg.x === x && seg.y === y);
      if (hitsSnake) continue;

      if (this.currentFood && this.currentFood.x === x && this.currentFood.y === y) continue;
      if (this.bonusFood && this.bonusFood.x === x && this.bonusFood.y === y) continue;

      if (!levelManager.isValidFoodPosition(x, y)) continue;

      return { x, y };
    }

    const safeCells: { x: number; y: number }[] = [];
    for (let x = margin; x < this.cols - margin; x++) {
      for (let y = margin; y < this.rows - margin; y++) {
        const hitsSnake = snakeBody.some((seg) => seg.x === x && seg.y === y);
        if (hitsSnake) continue;
        if (this.currentFood && this.currentFood.x === x && this.currentFood.y === y) continue;
        if (this.bonusFood && this.bonusFood.x === x && this.bonusFood.y === y) continue;
        if (!levelManager.isValidFoodPosition(x, y)) continue;

        safeCells.push({ x, y });
      }
    }

    if (safeCells.length > 0) {
      return safeCells[Math.floor(Math.random() * safeCells.length)];
    }

    return { x: 2, y: 2 };
  }

  public repositionIfColliding(snakeBody: { x: number; y: number }[], levelManager: LevelManager) {
    if (this.currentFood && !levelManager.isValidFoodPosition(this.currentFood.x, this.currentFood.y)) {
      const pos = this.findGuaranteedSafeCoord(snakeBody, levelManager);
      this.currentFood.x = pos.x;
      this.currentFood.y = pos.y;
    }
    if (this.bonusFood && !levelManager.isValidFoodPosition(this.bonusFood.x, this.bonusFood.y)) {
      const pos = this.findGuaranteedSafeCoord(snakeBody, levelManager);
      this.bonusFood.x = pos.x;
      this.bonusFood.y = pos.y;
    }
  }

  public update(dt: number = 0.016) {
    if (this.currentFood) {
      this.currentFood.pulsePhase = (this.currentFood.pulsePhase + dt * 3.5) % (Math.PI * 2);
    }

    if (this.bonusFood) {
      this.bonusFood.pulsePhase = (this.bonusFood.pulsePhase + dt * 4.5) % (Math.PI * 2);
      if (this.bonusFood.timer !== undefined) {
        this.bonusFood.timer -= dt;
        if (this.bonusFood.timer <= 0) {
          this.bonusFood = null;
        }
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D, cellSize: number) {
    if (this.currentFood) {
      this.renderFoodItem(ctx, this.currentFood, cellSize);
    }

    if (this.bonusFood) {
      this.renderBonusFoodItem(ctx, this.bonusFood, cellSize);
    }
  }

  private renderFoodItem(ctx: CanvasRenderingContext2D, food: FoodItem, cellSize: number) {
    const cx = (food.x + 0.5) * cellSize;
    const cy = (food.y + 0.5) * cellSize;
    const baseRadius = cellSize * 0.38;
    const pulse = Math.sin(food.pulsePhase) * 1.5;
    const r = baseRadius + pulse;

    ctx.save();
    ctx.shadowColor = food.glowColor;
    ctx.shadowBlur = 12 + pulse * 2;

    if (food.type === 'golden') {
      // Clean Crystalline Gold Diamond
      ctx.fillStyle = food.color;
      ctx.beginPath();
      ctx.moveTo(cx, cy - r * 1.1);
      ctx.lineTo(cx + r * 1.1, cy);
      ctx.lineTo(cx, cy + r * 1.1);
      ctx.lineTo(cx - r * 1.1, cy);
      ctx.closePath();
      ctx.fill();

      // Soft Inner Spark
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.35, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Clean Glowing Cyan Orb
      const grad = ctx.createRadialGradient(cx, cy, 1, cx, cy, r);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.5, food.color);
      grad.addColorStop(1, 'rgba(0, 245, 255, 0.2)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // Subtle Outer Ring
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.3, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  private renderBonusFoodItem(ctx: CanvasRenderingContext2D, food: FoodItem, cellSize: number) {
    const cx = (food.x + 0.5) * cellSize;
    const cy = (food.y + 0.5) * cellSize;
    const r = cellSize * 0.42;

    ctx.save();
    ctx.shadowColor = food.glowColor;
    ctx.shadowBlur = 16;

    // Pink Crystalline Star
    ctx.fillStyle = food.color;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i + food.pulsePhase * 0.3;
      const radius = r * (i % 2 === 0 ? 1.0 : 0.6);
      const px = cx + Math.cos(angle) * radius;
      const py = cy + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();

    // Minimal Countdown Progress Ring
    if (food.timer !== undefined && food.maxTimer !== undefined) {
      const progress = food.timer / food.maxTimer;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.45, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress, false);
      ctx.stroke();
    }

    ctx.restore();
  }
}
