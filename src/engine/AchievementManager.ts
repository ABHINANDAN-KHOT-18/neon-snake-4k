/**
 * AchievementManager.ts - Trophies & Badges Real-Time Engine
 */

import { StorageManager } from './Storage';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface AchievementToast {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS: Omit<Achievement, 'unlocked'>[] = [
  {
    id: 'grid_runner',
    title: 'Grid Runner',
    description: 'Reach Level 3 on the grid',
    icon: '🚀',
  },
  {
    id: 'neon_master',
    title: 'Neon Master',
    description: 'Conquer all 10 cyber levels & achieve victory',
    icon: '👑',
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Push speed multiplier beyond 3.5x',
    icon: '⚡',
  },
  {
    id: 'combo_monarch',
    title: 'Combo Monarch',
    description: 'Unleash a maximum 10x combo streak',
    icon: '🔥',
  },
  {
    id: 'shield_master',
    title: 'Aegis Guardian',
    description: 'Equip 3 Shield Matrices across your games',
    icon: '🛡️',
  },
  {
    id: 'golden_collector',
    title: 'Treasure Hunter',
    description: 'Consume 5 Golden Apples in a single run',
    icon: '🌟',
  },
];

export class AchievementManager {
  private unlockedSet: Set<string>;

  constructor() {
    this.unlockedSet = new Set(StorageManager.getUnlockedAchievements());
  }

  public getAchievements(): Achievement[] {
    return ACHIEVEMENTS.map((a) => ({
      ...a,
      unlocked: this.unlockedSet.has(a.id),
    }));
  }

  public check(
    stats: {
      level: number;
      speed: number;
      combo: number;
      isVictory?: boolean;
      goldenInRun?: number;
      powerUpsCollectedTotal?: number;
    },
    onUnlockNotification?: (toast: AchievementToast) => void
  ) {
    const tryUnlock = (id: string) => {
      if (!this.unlockedSet.has(id)) {
        const newlyUnlocked = StorageManager.unlockAchievement(id);
        if (newlyUnlocked) {
          this.unlockedSet.add(id);
          const meta = ACHIEVEMENTS.find((a) => a.id === id);
          if (meta && onUnlockNotification) {
            onUnlockNotification({
              id: meta.id,
              title: meta.title,
              description: meta.description,
              icon: meta.icon,
            });
          }
        }
      }
    };

    if (stats.level >= 3) tryUnlock('grid_runner');
    if (stats.isVictory) tryUnlock('neon_master');
    if (stats.speed >= 3.5) tryUnlock('speed_demon');
    if (stats.combo >= 10) tryUnlock('combo_monarch');
    if ((stats.goldenInRun || 0) >= 5) tryUnlock('golden_collector');
    if ((stats.powerUpsCollectedTotal || 0) >= 3) tryUnlock('shield_master');
  }
}
