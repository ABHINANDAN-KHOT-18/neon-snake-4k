/**
 * AutoPlayAI.ts - Local Cybernetic Autonomous Navigation & Hazard Avoidance AI
 */

import { Snake, Direction } from './Snake';
import { FoodManager } from './FoodManager';
import { LevelManager } from './LevelManager';
import { PowerUpManager } from './PowerUpManager';

export class AutoPlayAI {
  public static getNextDirection(
    snake: Snake,
    foodManager: FoodManager,
    levelManager: LevelManager,
    powerUpManager: PowerUpManager,
    gridCols: number = 28,
    gridRows: number = 28
  ): Direction {
    const head = snake.getHead();
    if (!head) return snake.currentDir;

    const currentDir = snake.currentDir;
    const isPhase = powerUpManager.isEffectActive('phase');
    const hasShield = powerUpManager.hasShield;

    const oppositeDirs: Record<Direction, Direction> = {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT',
    };

    const candidateDirs: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];

    // Select primary target
    let target: { x: number; y: number } | null = foodManager.bonusFood || foodManager.currentFood;
    if (powerUpManager.activeItem && Math.random() < 0.3) {
      target = powerUpManager.activeItem;
    }

    const targetX = target ? target.x : Math.floor(gridCols / 2);
    const targetY = target ? target.y : Math.floor(gridRows / 2);

    let bestDir = currentDir;
    let maxScore = -Infinity;

    for (const dir of candidateDirs) {
      // Exclude 180° instant reverse
      if (snake.body.length > 1 && dir === oppositeDirs[currentDir]) {
        continue;
      }

      let nx = head.x;
      let ny = head.y;
      if (dir === 'UP') ny -= 1;
      else if (dir === 'DOWN') ny += 1;
      else if (dir === 'LEFT') nx -= 1;
      else if (dir === 'RIGHT') nx += 1;

      // Wrap check for phase shift
      if (isPhase) {
        if (nx < 0) nx = gridCols - 1;
        else if (nx >= gridCols) nx = 0;
        if (ny < 0) ny = gridRows - 1;
        else if (ny >= gridRows) ny = 0;
      }

      // Check strict wall bounds
      if (!isPhase && (nx < 0 || nx >= gridCols || ny < 0 || ny >= gridRows)) {
        if (!hasShield) continue;
      }

      // Check snake body collision
      let hitsBody = false;
      if (!isPhase) {
        const bodyLimit = snake.growthPending > 0 ? snake.body.length : snake.body.length - 1;
        for (let i = 0; i < bodyLimit; i++) {
          if (snake.body[i].x === nx && snake.body[i].y === ny) {
            hitsBody = true;
            break;
          }
        }
      }
      if (hitsBody && !hasShield) continue;

      // Check discrete obstacle collision
      let hitsObstacle = false;
      if (!isPhase && levelManager.checkDiscreteGridCollision(nx, ny)) {
        hitsObstacle = true;
      }
      if (hitsObstacle && !hasShield) continue;

      // Check continuous moving drone & laser hazards
      let hitsHazard = false;
      if (!isPhase && levelManager.checkContinuousCollision(nx, ny)) {
        hitsHazard = true;
      }
      if (hitsHazard && !hasShield) continue;

      // Perform Flood-Fill reachability test to avoid self-trapping in dead-ends
      const spaceAvailable = this.floodFillSpace(nx, ny, snake.body, levelManager, gridCols, gridRows, isPhase);

      // Penalize dead-end traps smaller than snake body length
      if (spaceAvailable < Math.min(15, snake.body.length) && !isPhase) {
        continue;
      }

      // Distance to target
      const distToTarget = Math.abs(nx - targetX) + Math.abs(ny - targetY);

      // Score calculation: High reachability + target proximity
      let score = spaceAvailable * 10 - distToTarget * 3;

      // Direct alignment bonus
      if (dir === currentDir) score += 2; // Momentum stability

      if (score > maxScore) {
        maxScore = score;
        bestDir = dir;
      }
    }

    return bestDir;
  }

  private static floodFillSpace(
    startX: number,
    startY: number,
    snakeBody: { x: number; y: number }[],
    levelManager: LevelManager,
    cols: number,
    rows: number,
    isPhase: boolean
  ): number {
    const visited = new Set<string>();
    const queue: { x: number; y: number }[] = [{ x: startX, y: startY }];
    visited.add(`${startX},${startY}`);

    const bodySet = new Set<string>();
    snakeBody.forEach((seg) => bodySet.add(`${seg.x},${seg.y}`));

    let count = 0;
    const maxDepth = 40; // Quick 40-cell lookahead

    while (queue.length > 0 && count < maxDepth) {
      const { x, y } = queue.shift()!;
      count++;

      const neighbors = [
        { x: x + 1, y },
        { x: x - 1, y },
        { x, y: y + 1 },
        { x, y: y - 1 },
      ];

      for (const n of neighbors) {
        let nx = n.x;
        let ny = n.y;

        if (isPhase) {
          if (nx < 0) nx = cols - 1;
          else if (nx >= cols) nx = 0;
          if (ny < 0) ny = rows - 1;
          else if (ny >= rows) ny = 0;
        } else {
          if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
        }

        const key = `${nx},${ny}`;
        if (visited.has(key)) continue;
        if (!isPhase && bodySet.has(key)) continue;
        if (!isPhase && levelManager.checkDiscreteGridCollision(nx, ny)) continue;

        visited.add(key);
        queue.push({ x: nx, y: ny });
      }
    }

    return count;
  }
}
