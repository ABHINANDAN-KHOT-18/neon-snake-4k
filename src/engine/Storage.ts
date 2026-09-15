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

export interface SpeedChallengeSettings {
  speedType: 'automatic' | 'custom';
  startingSpeed: number; // 1.0 – 5.0
  maximumSpeed: number;  // 1.0 – 10.0
  speedIncrease: number; // 0.1 – 1.0
}

const SETTINGS_KEY = 'neon_snake_4k_settings';
const STATS_KEY = 'neon_snake_4k_stats';
const SPEED_CHALLENGE_HS_KEY = 'speedChallengeHighScore';
const SPEED_CHALLENGE_SETTINGS_KEY = 'speedChallengeSettings';

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

const DEFAULT_SC_SETTINGS: SpeedChallengeSettings = {
  speedType: 'automatic',
  startingSpeed: 2.0,
  maximumSpeed: 6.0,
  speedIncrease: 0.5,
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

  // --- Speed Challenge High Score ---

  public static getSpeedChallengeHighScore(): number {
    try {
      const stored = localStorage.getItem(SPEED_CHALLENGE_HS_KEY);
      if (stored) return Math.max(0, parseInt(stored, 10) || 0);
    } catch (e) {
      console.warn('LocalStorage unavailable for SC high score', e);
    }
    return 0;
  }

  public static updateSpeedChallengeHighScore(score: number, _level: number): { isNewHighScore: boolean; highScore: number } {
    const current = this.getSpeedChallengeHighScore();
    let isNewHighScore = false;
    let highScore = current;

    if (score > current) {
      highScore = score;
      isNewHighScore = true;
      try {
        localStorage.setItem(SPEED_CHALLENGE_HS_KEY, String(highScore));
      } catch (e) {
        console.warn('Failed to save SC high score', e);
      }
    }

    return { isNewHighScore, highScore };
  }

  // --- Speed Challenge Settings ---

  public static getSpeedChallengeSettings(): SpeedChallengeSettings {
    try {
      const stored = localStorage.getItem(SPEED_CHALLENGE_SETTINGS_KEY);
      if (stored) {
        return { ...DEFAULT_SC_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('LocalStorage unavailable for SC settings', e);
    }
    return { ...DEFAULT_SC_SETTINGS };
  }

  public static saveSpeedChallengeSettings(settings: SpeedChallengeSettings) {
    try {
      localStorage.setItem(SPEED_CHALLENGE_SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save SC settings', e);
    }
  }
}
