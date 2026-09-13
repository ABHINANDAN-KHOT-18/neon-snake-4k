/**
 * Storage.ts - Persistent LocalStorage Manager for High Scores, Settings, & Stats
 */

export interface GameSettings {
  sfxEnabled: boolean;
  musicEnabled: boolean;
  sfxVolume: number;
  musicVolume: number;
  crtFilter: boolean;
  glowQuality: 'high' | 'medium' | 'low';
}

export interface PlayerStats {
  highScore: number;
  highestLevel: number;
  totalFoodEaten: number;
  gamesPlayed: number;
  totalTimePlayed: number; // in seconds
}

const SETTINGS_KEY = 'neon_snake_4k_settings';
const STATS_KEY = 'neon_snake_4k_stats';

const DEFAULT_SETTINGS: GameSettings = {
  sfxEnabled: true,
  musicEnabled: true,
  sfxVolume: 0.8,
  musicVolume: 0.5,
  crtFilter: true,
  glowQuality: 'high',
};

const DEFAULT_STATS: PlayerStats = {
  highScore: 0,
  highestLevel: 1,
  totalFoodEaten: 0,
  gamesPlayed: 0,
  totalTimePlayed: 0,
};

export class StorageManager {
  public static getSettings(): GameSettings {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('LocalStorage unavailable for settings', e);
    }
    return DEFAULT_SETTINGS;
  }

  public static saveSettings(settings: GameSettings) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings to LocalStorage', e);
    }
  }

  public static getStats(): PlayerStats {
    try {
      const stored = localStorage.getItem(STATS_KEY);
      if (stored) {
        return { ...DEFAULT_STATS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('LocalStorage unavailable for stats', e);
    }
    return DEFAULT_STATS;
  }

  public static updateHighScore(score: number, level: number): { isNewHighScore: boolean; highScore: number } {
    const stats = this.getStats();
    let isNewHighScore = false;

    if (score > stats.highScore) {
      stats.highScore = score;
      isNewHighScore = true;
    }

    if (level > stats.highestLevel) {
      stats.highestLevel = level;
    }

    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch (e) {
      console.warn('Failed to save stats to LocalStorage', e);
    }

    return { isNewHighScore, highScore: stats.highScore };
  }

  public static recordGameEnd(foodCount: number, timePlayedSec: number) {
    const stats = this.getStats();
    stats.gamesPlayed += 1;
    stats.totalFoodEaten += foodCount;
    stats.totalTimePlayed += Math.floor(timePlayedSec);

    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch (e) {
      console.warn('Failed to record game end to LocalStorage', e);
    }
  }
}
