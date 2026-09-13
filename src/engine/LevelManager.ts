/**
 * LevelManager.ts - 10-Level Progressive Stage & Obstacle Hazard Matrix
 */

export interface LevelConfig {
  level: number;
  name: string;
  subtitle: string;
  targetFood: number;
  baseSpeed: number;
  colorScheme: {
    primary: string;
    secondary: string;
    glow: string;
    ambientBg: string;
  };
  description: string;
}

export interface StaticObstacle {
  x: number;
  y: number;
  w: number;
  h: number;
  color?: string;
}

export interface MovingObstacle {
  x: number;
  y: number;
  w: number;
  h: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  vx: number;
  vy: number;
  color: string;
}

export interface RotatingObstacle {
  cx: number;
  cy: number;
  length: number;
  angle: number;
  angularVelocity: number;
  color: string;
}

export interface LaserHazard {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  period: number;
  activeRatio: number;
  timer: number;
  isActive: boolean;
  color: string;
}

export const LEVEL_CONFIGS: LevelConfig[] = [
  {
    level: 1,
    name: 'Beginner',
    subtitle: 'Enter the Grid',
    targetFood: 5,
    baseSpeed: 1.0,
    colorScheme: {
      primary: '#00f5ff',
      secondary: '#3b82f6',
      glow: 'rgba(0, 245, 255, 0.4)',
      ambientBg: '#080b18',
    },
    description: 'Open arena. Master snake agility.',
  },
  {
    level: 2,
    name: 'Vector',
    subtitle: 'Perimeter Active',
    targetFood: 5,
    baseSpeed: 1.15,
    colorScheme: {
      primary: '#10b981',
      secondary: '#06b6d4',
      glow: 'rgba(16, 185, 129, 0.4)',
      ambientBg: '#060f14',
    },
    description: 'Corner nodes appear. Golden food active.',
  },
  {
    level: 3,
    name: 'Pulse',
    subtitle: 'Speed Increasing',
    targetFood: 6,
    baseSpeed: 1.3,
    colorScheme: {
      primary: '#facc15',
      secondary: '#f97316',
      glow: 'rgba(250, 204, 21, 0.4)',
      ambientBg: '#0f0e08',
    },
    description: 'Center barrier and corner blocks.',
  },
  {
    level: 4,
    name: 'Corridor',
    subtitle: 'Narrow Passages',
    targetFood: 6,
    baseSpeed: 1.45,
    colorScheme: {
      primary: '#ec4899',
      secondary: '#8b5cf6',
      glow: 'rgba(236, 72, 153, 0.4)',
      ambientBg: '#120713',
    },
    description: 'Horizontal highway dividing barriers.',
  },
  {
    level: 5,
    name: 'Matrix',
    subtitle: 'Urban Grid',
    targetFood: 7,
    baseSpeed: 1.6,
    colorScheme: {
      primary: '#a855f7',
      secondary: '#6366f1',
      glow: 'rgba(168, 85, 247, 0.4)',
      ambientBg: '#0e0719',
    },
    description: 'A dense matrix of pillars.',
  },
  {
    level: 6,
    name: 'Kinetic',
    subtitle: 'Moving Hazards',
    targetFood: 7,
    baseSpeed: 1.75,
    colorScheme: {
      primary: '#f97316',
      secondary: '#ef4444',
      glow: 'rgba(249, 115, 22, 0.4)',
      ambientBg: '#140907',
    },
    description: 'Vertical moving drones patrol the grid.',
  },
  {
    level: 7,
    name: 'Vortex',
    subtitle: 'Rotational Energy',
    targetFood: 8,
    baseSpeed: 1.9,
    colorScheme: {
      primary: '#00f5ff',
      secondary: '#ec4899',
      glow: 'rgba(0, 245, 255, 0.4)',
      ambientBg: '#080c1a',
    },
    description: 'Rotating laser cruciforms.',
  },
  {
    level: 8,
    name: 'Eclipse',
    subtitle: 'Sweeping Beams',
    targetFood: 8,
    baseSpeed: 2.1,
    colorScheme: {
      primary: '#f43f5e',
      secondary: '#8b5cf6',
      glow: 'rgba(244, 63, 94, 0.4)',
      ambientBg: '#14060e',
    },
    description: 'Pulsing laser beams cycle active.',
  },
  {
    level: 9,
    name: 'Apex',
    subtitle: 'Convergence',
    targetFood: 9,
    baseSpeed: 2.3,
    colorScheme: {
      primary: '#ef4444',
      secondary: '#facc15',
      glow: 'rgba(239, 68, 68, 0.4)',
      ambientBg: '#140606',
    },
    description: 'Combined moving drones and lasers.',
  },
  {
    level: 10,
    name: 'Master',
    subtitle: 'Grand Finale',
    targetFood: 10,
    baseSpeed: 2.5,
    colorScheme: {
      primary: '#00f5ff',
      secondary: '#a855f7',
      glow: 'rgba(0, 245, 255, 0.5)',
      ambientBg: '#090518',
    },
    description: 'The supreme test of precision.',
  },
];

export class LevelManager {
  public currentLevel: number = 1;
  public staticObstacles: StaticObstacle[] = [];
  public movingObstacles: MovingObstacle[] = [];
  public rotatingObstacles: RotatingObstacle[] = [];
  public laserHazards: LaserHazard[] = [];
  public gridCols: number = 28;
  public gridRows: number = 28;

  constructor(cols: number = 28, rows: number = 28) {
    this.gridCols = cols;
    this.gridRows = rows;
    this.loadLevel(1);
  }

  public getLevelConfig(level: number = this.currentLevel): LevelConfig {
    const idx = Math.max(1, Math.min(level, LEVEL_CONFIGS.length)) - 1;
    return LEVEL_CONFIGS[idx];
  }

  public loadLevel(levelNumber: number) {
    this.currentLevel = Math.max(1, Math.min(levelNumber, 10));
    this.staticObstacles = [];
    this.movingObstacles = [];
    this.rotatingObstacles = [];
    this.laserHazards = [];

    const cols = this.gridCols;
    const rows = this.gridRows;
    const cfg = this.getLevelConfig(this.currentLevel);

    switch (this.currentLevel) {
      case 1:
        break;

      case 2:
        this.staticObstacles.push(
          { x: 6, y: 6, w: 2, h: 2, color: cfg.colorScheme.primary },
          { x: cols - 8, y: 6, w: 2, h: 2, color: cfg.colorScheme.primary },
          { x: 6, y: rows - 8, w: 2, h: 2, color: cfg.colorScheme.primary },
          { x: cols - 8, y: rows - 8, w: 2, h: 2, color: cfg.colorScheme.primary }
        );
        break;

      case 3:
        this.staticObstacles.push(
          { x: Math.floor(cols / 2) - 1, y: Math.floor(rows / 2) - 1, w: 2, h: 2, color: cfg.colorScheme.primary },
          { x: 4, y: 4, w: 2, h: 2, color: cfg.colorScheme.primary },
          { x: cols - 6, y: 4, w: 2, h: 2, color: cfg.colorScheme.primary },
          { x: 4, y: rows - 6, w: 2, h: 2, color: cfg.colorScheme.primary },
          { x: cols - 6, y: rows - 6, w: 2, h: 2, color: cfg.colorScheme.primary }
        );
        break;

      case 4:
        this.staticObstacles.push(
          { x: 4, y: 9, w: 8, h: 1, color: cfg.colorScheme.primary },
          { x: 16, y: 9, w: 8, h: 1, color: cfg.colorScheme.primary },
          { x: 4, y: 19, w: 8, h: 1, color: cfg.colorScheme.primary },
          { x: 16, y: 19, w: 8, h: 1, color: cfg.colorScheme.primary }
        );
        break;

      case 5:
        for (let x = 6; x < cols - 4; x += 6) {
          for (let y = 6; y < rows - 4; y += 6) {
            this.staticObstacles.push({
              x,
              y,
              w: 2,
              h: 2,
              color: cfg.colorScheme.primary,
            });
          }
        }
        break;

      case 6:
        this.staticObstacles.push(
          { x: 4, y: 13, w: 2, h: 2, color: 'rgba(255, 255, 255, 0.4)' },
          { x: cols - 6, y: 13, w: 2, h: 2, color: 'rgba(255, 255, 255, 0.4)' }
        );
        this.movingObstacles.push(
          {
            x: 10,
            y: 4,
            w: 2,
            h: 2,
            minX: 10,
            maxX: 10,
            minY: 4,
            maxY: rows - 6,
            vx: 0,
            vy: 0.08,
            color: cfg.colorScheme.primary,
          },
          {
            x: cols - 12,
            y: rows - 6,
            w: 2,
            h: 2,
            minX: cols - 12,
            maxX: cols - 12,
            minY: 4,
            maxY: rows - 6,
            vx: 0,
            vy: -0.08,
            color: cfg.colorScheme.primary,
          }
        );
        break;

      case 7:
        this.staticObstacles.push(
          { x: Math.floor(cols / 2) - 1, y: 4, w: 2, h: 2, color: 'rgba(255, 255, 255, 0.3)' },
          { x: Math.floor(cols / 2) - 1, y: rows - 6, w: 2, h: 2, color: 'rgba(255, 255, 255, 0.3)' }
        );
        this.rotatingObstacles.push(
          {
            cx: 8,
            cy: 8,
            length: 4.0,
            angle: 0,
            angularVelocity: 0.025,
            color: '#00f5ff',
          },
          {
            cx: cols - 8,
            cy: rows - 8,
            length: 4.0,
            angle: Math.PI / 4,
            angularVelocity: -0.025,
            color: '#ec4899',
          }
        );
        break;

      case 8:
        this.movingObstacles.push(
          {
            x: 4,
            y: 6,
            w: 3,
            h: 1.5,
            minX: 4,
            maxX: cols - 7,
            minY: 6,
            maxY: 6,
            vx: 0.09,
            vy: 0,
            color: '#f43f5e',
          },
          {
            x: cols - 7,
            y: rows - 7,
            w: 3,
            h: 1.5,
            minX: 4,
            maxX: cols - 7,
            minY: rows - 7,
            maxY: rows - 7,
            vx: -0.09,
            vy: 0,
            color: '#f43f5e',
          }
        );
        this.laserHazards.push(
          {
            x1: 5,
            y1: Math.floor(rows / 2),
            x2: cols - 5,
            y2: Math.floor(rows / 2),
            period: 4.0,
            activeRatio: 0.45,
            timer: 0,
            isActive: true,
            color: '#f43f5e',
          }
        );
        break;

      case 9:
        this.staticObstacles.push(
          { x: 4, y: 4, w: 2, h: 2, color: '#ef4444' },
          { x: cols - 6, y: 4, w: 2, h: 2, color: '#ef4444' },
          { x: 4, y: rows - 6, w: 2, h: 2, color: '#ef4444' },
          { x: cols - 6, y: rows - 6, w: 2, h: 2, color: '#ef4444' }
        );
        this.movingObstacles.push(
          {
            x: 8,
            y: 9,
            w: 2,
            h: 2,
            minX: 8,
            maxX: 8,
            minY: 5,
            maxY: rows - 7,
            vx: 0,
            vy: 0.09,
            color: '#facc15',
          },
          {
            x: cols - 10,
            y: rows - 9,
            w: 2,
            h: 2,
            minX: cols - 10,
            maxX: cols - 10,
            minY: 5,
            maxY: rows - 7,
            vx: 0,
            vy: -0.09,
            color: '#facc15',
          }
        );
        this.rotatingObstacles.push({
          cx: Math.floor(cols / 2),
          cy: Math.floor(rows / 2),
          length: 4.5,
          angle: 0,
          angularVelocity: 0.03,
          color: '#ef4444',
        });
        break;

      case 10:
        this.staticObstacles.push(
          { x: 3, y: 3, w: 2, h: 2, color: '#00f5ff' },
          { x: cols - 5, y: 3, w: 2, h: 2, color: '#a855f7' },
          { x: 3, y: rows - 5, w: 2, h: 2, color: '#a855f7' },
          { x: cols - 5, y: rows - 5, w: 2, h: 2, color: '#00f5ff' }
        );
        this.rotatingObstacles.push(
          {
            cx: 8,
            cy: Math.floor(rows / 2),
            length: 4.2,
            angle: 0,
            angularVelocity: 0.035,
            color: '#00f5ff',
          },
          {
            cx: cols - 8,
            cy: Math.floor(rows / 2),
            length: 4.2,
            angle: Math.PI / 2,
            angularVelocity: -0.035,
            color: '#a855f7',
          }
        );
        this.laserHazards.push(
          {
            x1: Math.floor(cols / 2),
            y1: 4,
            x2: Math.floor(cols / 2),
            y2: rows - 4,
            period: 3.5,
            activeRatio: 0.4,
            timer: 0,
            isActive: true,
            color: '#00f5ff',
          }
        );
        break;
    }
  }

  public update(dt: number = 0.016) {
    this.movingObstacles.forEach((obs) => {
      obs.x += obs.vx;
      obs.y += obs.vy;

      if (obs.x <= obs.minX || obs.x >= obs.maxX) {
        obs.vx *= -1;
        obs.x = Math.max(obs.minX, Math.min(obs.maxX, obs.x));
      }
      if (obs.y <= obs.minY || obs.y >= obs.maxY) {
        obs.vy *= -1;
        obs.y = Math.max(obs.minY, Math.min(obs.maxY, obs.y));
      }
    });

    this.rotatingObstacles.forEach((obs) => {
      obs.angle += obs.angularVelocity;
      if (obs.angle > Math.PI * 2) obs.angle -= Math.PI * 2;
    });

    this.laserHazards.forEach((laser) => {
      laser.timer = (laser.timer + dt) % laser.period;
      laser.isActive = (laser.timer / laser.period) < laser.activeRatio;
    });
  }

  public checkDiscreteGridCollision(gridX: number, gridY: number): boolean {
    for (const obs of this.staticObstacles) {
      if (
        gridX >= obs.x &&
        gridX < obs.x + obs.w &&
        gridY >= obs.y &&
        gridY < obs.y + obs.h
      ) {
        return true;
      }
    }
    return false;
  }

  public checkContinuousCollision(headX: number, headY: number): boolean {
    const headRadius = 0.35;

    for (const obs of this.movingObstacles) {
      if (
        headX + headRadius > obs.x &&
        headX - headRadius < obs.x + obs.w &&
        headY + headRadius > obs.y &&
        headY - headRadius < obs.y + obs.h
      ) {
        return true;
      }
    }

    for (const obs of this.rotatingObstacles) {
      const cos = Math.cos(obs.angle);
      const sin = Math.sin(obs.angle);
      const x1 = obs.cx - cos * obs.length;
      const y1 = obs.cy - sin * obs.length;
      const x2 = obs.cx + cos * obs.length;
      const y2 = obs.cy + sin * obs.length;

      if (this.distToSegment(headX, headY, x1, y1, x2, y2) < headRadius + 0.15) {
        return true;
      }
    }

    for (const laser of this.laserHazards) {
      if (laser.isActive) {
        if (this.distToSegment(headX, headY, laser.x1, laser.y1, laser.x2, laser.y2) < headRadius + 0.2) {
          return true;
        }
      }
    }

    return false;
  }

  private distToSegment(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
    const l2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
    if (l2 === 0) return Math.hypot(px - x1, py - y1);
    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
  }

  public isCellOccupiedByObstacle(gridX: number, gridY: number): boolean {
    for (const obs of this.staticObstacles) {
      if (gridX >= obs.x && gridX < obs.x + obs.w && gridY >= obs.y && gridY < obs.y + obs.h) {
        return true;
      }
    }
    for (const obs of this.movingObstacles) {
      if (
        gridX >= obs.minX - 1 &&
        gridX <= obs.maxX + obs.w + 1 &&
        gridY >= obs.minY - 1 &&
        gridY <= obs.maxY + obs.h + 1
      ) {
        return true;
      }
    }
    for (const obs of this.rotatingObstacles) {
      if (Math.hypot(gridX - obs.cx, gridY - obs.cy) <= obs.length + 1) {
        return true;
      }
    }
    for (const laser of this.laserHazards) {
      if (this.distToSegment(gridX, gridY, laser.x1, laser.y1, laser.x2, laser.y2) <= 1.5) {
        return true;
      }
    }
    return false;
  }

  public render(ctx: CanvasRenderingContext2D, cellSize: number) {
    const cfg = this.getLevelConfig(this.currentLevel);

    // 1. Static Obstacles (Clean Frosted Glass Blocks with Rounded Corners)
    this.staticObstacles.forEach((obs) => {
      const color = obs.color || cfg.colorScheme.primary;
      const x = obs.x * cellSize;
      const y = obs.y * cellSize;
      const w = obs.w * cellSize;
      const h = obs.h * cellSize;
      const r = 4;

      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;

      ctx.beginPath();
      ctx.roundRect(x + 1, y + 1, w - 2, h - 2, r);
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    });

    // 2. Moving Obstacles (Clean Geometric Patrol Drones)
    this.movingObstacles.forEach((obs) => {
      const x = obs.x * cellSize;
      const y = obs.y * cellSize;
      const w = obs.w * cellSize;
      const h = obs.h * cellSize;
      const r = 4;

      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.strokeStyle = obs.color;
      ctx.lineWidth = 2;
      ctx.shadowColor = obs.color;
      ctx.shadowBlur = 10;

      ctx.beginPath();
      ctx.roundRect(x + 1, y + 1, w - 2, h - 2, r);
      ctx.fill();
      ctx.stroke();

      // Center Node
      ctx.fillStyle = obs.color;
      ctx.beginPath();
      ctx.arc(x + w / 2, y + h / 2, cellSize * 0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 3. Rotating Laser Crosses
    this.rotatingObstacles.forEach((obs) => {
      ctx.save();
      ctx.translate(obs.cx * cellSize, obs.cy * cellSize);
      ctx.rotate(obs.angle);

      // Hub
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = obs.color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(0, 0, cellSize * 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Beams
      ctx.strokeStyle = obs.color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-obs.length * cellSize, 0);
      ctx.lineTo(obs.length * cellSize, 0);
      ctx.moveTo(0, -obs.length * cellSize);
      ctx.lineTo(0, obs.length * cellSize);
      ctx.stroke();

      ctx.restore();
    });

    // 4. Laser Hazards
    this.laserHazards.forEach((laser) => {
      ctx.save();
      if (laser.isActive) {
        ctx.strokeStyle = laser.color;
        ctx.lineWidth = 3;
        ctx.shadowColor = laser.color;
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.moveTo(laser.x1 * cellSize, laser.y1 * cellSize);
        ctx.lineTo(laser.x2 * cellSize, laser.y2 * cellSize);
        ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
      } else {
        ctx.setLineDash([3, 6]);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(laser.x1 * cellSize, laser.y1 * cellSize);
        ctx.lineTo(laser.x2 * cellSize, laser.y2 * cellSize);
        ctx.stroke();
      }
      ctx.restore();
    });
  }
}
