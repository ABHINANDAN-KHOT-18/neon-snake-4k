/**
 * Snake.ts - Cybernetic Snake Entity with Smooth Gradients & Minimalist 4K Aesthetics
 */

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface GridCoord {
  x: number;
  y: number;
}

export class Snake {
  public body: GridCoord[] = [];
  public currentDir: Direction = 'RIGHT';
  public nextDirQueue: Direction[] = [];
  public growthPending: number = 0;
  
  public prevBody: GridCoord[] = [];
  public interpolationProgress: number = 0;

  private primaryColor: string = '#00f5ff';
  private secondaryColor: string = '#3b82f6';
  private glowColor: string = 'rgba(0, 245, 255, 0.4)';

  constructor(startX: number = 8, startY: number = 14, initialLength: number = 4) {
    this.reset(startX, startY, initialLength);
  }

  public reset(startX: number = 8, startY: number = 14, initialLength: number = 4) {
    this.body = [];
    for (let i = 0; i < initialLength; i++) {
      this.body.push({ x: startX - i, y: startY });
    }
    this.prevBody = this.body.map((p) => ({ ...p }));
    this.currentDir = 'RIGHT';
    this.nextDirQueue = [];
    this.growthPending = 0;
    this.interpolationProgress = 0;
  }

  public setDirection(dir: Direction) {
    const lastQueued = this.nextDirQueue.length > 0 
      ? this.nextDirQueue[this.nextDirQueue.length - 1] 
      : this.currentDir;

    if (
      (dir === 'UP' && lastQueued === 'DOWN') ||
      (dir === 'DOWN' && lastQueued === 'UP') ||
      (dir === 'LEFT' && lastQueued === 'RIGHT') ||
      (dir === 'RIGHT' && lastQueued === 'LEFT') ||
      dir === lastQueued
    ) {
      return;
    }

    if (this.nextDirQueue.length < 2) {
      this.nextDirQueue.push(dir);
    }
  }

  public getHead(): GridCoord {
    return this.body[0];
  }

  public getInterpolatedHead(): { x: number; y: number } {
    if (this.prevBody.length === 0 || this.body.length === 0) {
      return this.body[0] || { x: 0, y: 0 };
    }
    const cur = this.body[0];
    const prev = this.prevBody[0];
    const t = Math.max(0, Math.min(1, this.interpolationProgress));
    return {
      x: prev.x + (cur.x - prev.x) * t,
      y: prev.y + (cur.y - prev.y) * t,
    };
  }

  public step(gridCols: number, gridRows: number): boolean {
    this.prevBody = this.body.map((p) => ({ ...p }));
    this.interpolationProgress = 0;

    if (this.nextDirQueue.length > 0) {
      this.currentDir = this.nextDirQueue.shift()!;
    }

    const head = this.body[0];
    let newX = head.x;
    let newY = head.y;

    switch (this.currentDir) {
      case 'UP':
        newY -= 1;
        break;
      case 'DOWN':
        newY += 1;
        break;
      case 'LEFT':
        newX -= 1;
        break;
      case 'RIGHT':
        newX += 1;
        break;
    }

    if (newX < 0 || newX >= gridCols || newY < 0 || newY >= gridRows) {
      return false;
    }

    const checkLimit = this.growthPending > 0 ? this.body.length : this.body.length - 1;
    for (let i = 0; i < checkLimit; i++) {
      if (this.body[i].x === newX && this.body[i].y === newY) {
        return false;
      }
    }

    this.body.unshift({ x: newX, y: newY });

    if (this.growthPending > 0) {
      this.growthPending--;
      this.prevBody.push({ ...this.prevBody[this.prevBody.length - 1] });
    } else {
      this.body.pop();
    }

    return true;
  }

  public grow(amount: number = 1) {
    this.growthPending += amount;
  }

  public setColor(primary: string, secondary: string, glow: string) {
    this.primaryColor = primary;
    this.secondaryColor = secondary;
    this.glowColor = glow;
  }

  public render(ctx: CanvasRenderingContext2D, cellSize: number) {
    if (this.body.length === 0) return;

    ctx.save();
    const t = Math.min(1, Math.max(0, this.interpolationProgress));

    // Render body from tail to head
    for (let i = this.body.length - 1; i >= 0; i--) {
      const cur = this.body[i];
      const prev = this.prevBody[i] || cur;

      const interpX = (prev.x + (cur.x - prev.x) * t + 0.5) * cellSize;
      const interpY = (prev.y + (cur.y - prev.y) * t + 0.5) * cellSize;

      const isHead = i === 0;
      const progress = 1 - i / this.body.length;
      const radius = cellSize * (isHead ? 0.44 : 0.36 * (0.65 + 0.35 * progress));

      ctx.save();
      ctx.shadowColor = this.glowColor;
      ctx.shadowBlur = isHead ? 16 : 8 * progress;

      if (isHead) {
        // Snake Head with smooth radial gradient
        const grad = ctx.createRadialGradient(
          interpX - radius * 0.2,
          interpY - radius * 0.2,
          radius * 0.1,
          interpX,
          interpY,
          radius
        );
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.6, this.primaryColor);
        grad.addColorStop(1, this.secondaryColor);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(interpX, interpY, radius, 0, Math.PI * 2);
        ctx.fill();

        // Sleek Minimalist Eyes
        const eyeOffset = radius * 0.42;
        const eyeRadius = radius * 0.2;
        let e1X = interpX, e1Y = interpY, e2X = interpX, e2Y = interpY;

        switch (this.currentDir) {
          case 'UP':
            e1X -= eyeOffset; e1Y -= eyeOffset * 0.3;
            e2X += eyeOffset; e2Y -= eyeOffset * 0.3;
            break;
          case 'DOWN':
            e1X -= eyeOffset; e1Y += eyeOffset * 0.3;
            e2X += eyeOffset; e2Y += eyeOffset * 0.3;
            break;
          case 'LEFT':
            e1X -= eyeOffset * 0.3; e1Y -= eyeOffset;
            e2X -= eyeOffset * 0.3; e2Y += eyeOffset;
            break;
          case 'RIGHT':
            e1X += eyeOffset * 0.3; e1Y -= eyeOffset;
            e2X += eyeOffset * 0.3; e2Y += eyeOffset;
            break;
        }

        ctx.fillStyle = '#060813';
        ctx.beginPath();
        ctx.arc(e1X, e1Y, eyeRadius, 0, Math.PI * 2);
        ctx.arc(e2X, e2Y, eyeRadius, 0, Math.PI * 2);
        ctx.fill();

        // Eye pupils
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(e1X, e1Y, eyeRadius * 0.4, 0, Math.PI * 2);
        ctx.arc(e2X, e2Y, eyeRadius * 0.4, 0, Math.PI * 2);
        ctx.fill();

      } else {
        // Body Segment
        const grad = ctx.createRadialGradient(
          interpX,
          interpY,
          radius * 0.1,
          interpX,
          interpY,
          radius
        );
        grad.addColorStop(0, this.primaryColor);
        grad.addColorStop(0.8, this.secondaryColor);
        grad.addColorStop(1, 'rgba(6, 8, 19, 0.6)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(interpX, interpY, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    ctx.restore();
  }
}
