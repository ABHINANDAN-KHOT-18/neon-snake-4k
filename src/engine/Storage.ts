/**
 * Storage.ts - Persistent LocalStorage Manager for High Scores, Settings, & Stats
 */

export type ThemeId = 'cyber_cyan' | 'vaporwave' | 'quantum_emerald' | 'solar_flare' | 'nebula';

export interface GameSettings {
  sfxEnabled: boolean;
  musicEnabled: boolean;
  sfxVolume: number;
  musicVolume: number;
  crtFilter: boolean;
  glowQuality: 'high' | 'medium' | 'low';
  theme: ThemeId;
}

export interface PlayerStats {
  highScore: number;
  highestLevel: number;
  totalFoodEaten: number;
  gamesPlayed: number;
  totalTimePlayed: number; // in seconds
  powerUpsCollected: number;
  goldenApplesEaten: number;
  maxComboAchieved: number;
}

export interface SpeedChallengeSettings {
  speedType: 'automatic' | 'custom';
  startingSpeed: number; // 1.0 – 5.0
  maximumSpeed: number;  // 1.0 – 10.0
  speedIncrease: number; // 0.1 – 1.0
}

export interface LeaderboardEntry {
  id: string;
  score: number;
  level: number;
  date: string;
  mode: 'normal' | 'speed_challenge';
}

const SETTINGS_KEY = 'neon_snake_4k_settings';
const STATS_KEY = 'neon_snake_4k_stats';
const SPEED_CHALLENGE_HS_KEY = 'speedChallengeHighScore';
const SPEED_CHALLENGE_SETTINGS_KEY = 'speedChallengeSettings';
const ACHIEVEMENTS_KEY = 'neon_snake_4k_achievements';
const LEADERBOARD_KEY = 'neon_snake_4k_leaderboard';
const COINS_KEY = 'neon_snake_4k_coins';
const AUTOMATION_KEY = 'neon_snake_4k_automation_unlocked';

const DEFAULT_SETTINGS: GameSettings = {
  sfxEnabled: true,
  musicEnabled: true,
  sfxVolume: 0.8,
  musicVolume: 0.5,
  crtFilter: true,
  glowQuality: 'high',
  theme: 'cyber_cyan',
};

const DEFAULT_STATS: PlayerStats = {
  highScore: 0,
  highestLevel: 1,
  totalFoodEaten: 0,
  gamesPlayed: 0,
  totalTimePlayed: 0,
  powerUpsCollected: 0,
  goldenApplesEaten: 0,
  maxComboAchieved: 0,
};

const DEFAULT_SC_SETTINGS: SpeedChallengeSettings = {
  speedType: 'automatic',
  startingSpeed: 2.0,
  maximumSpeed: 6.0,
  speedIncrease: 0.5,
};

export class StorageManager {
  // --- Coins System ---
  public static getCoins(): number {
    try {
      const stored = localStorage.getItem(COINS_KEY);
      if (stored !== null) {
        return Math.max(0, parseInt(stored, 10) || 0);
      }
    } catch (e) {
      console.warn('LocalStorage unavailable for coins', e);
    }
    return 0;
  }

  public static addCoins(amount: number): number {
    if (amount <= 0) return this.getCoins();
    const current = this.getCoins();
    const updated = current + amount;
    try {
      localStorage.setItem(COINS_KEY, String(updated));
    } catch (e) {
      console.warn('Failed to save coins to LocalStorage', e);
    }
    return updated;
  }

  public static deductCoins(amount: number): boolean {
    const current = this.getCoins();
    if (current < amount) return false;
    const updated = current - amount;
    try {
      localStorage.setItem(COINS_KEY, String(updated));
    } catch (e) {
      console.warn('Failed to deduct coins in LocalStorage', e);
    }
    return true;
  }

  // --- Automation Unlock ---
  public static isAutomationUnlocked(): boolean {
    try {
      const stored = localStorage.getItem(AUTOMATION_KEY);
      if (stored === 'true') return true;
    } catch (e) {
      console.warn('LocalStorage unavailable for automation status', e);
    }
    return false;
  }

  public static unlockAutomation(): boolean {
    if (this.isAutomationUnlocked()) return true;
    if (this.deductCoins(111)) {
      try {
        localStorage.setItem(AUTOMATION_KEY, 'true');
      } catch (e) {
        console.warn('Failed to save automation unlock status', e);
      }
      return true;
    }
    return false;
  }

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

    this.addLeaderboardEntry(score, level, 'normal');

    return { isNewHighScore, highScore: stats.highScore };
  }

  public static recordGameEnd(foodCount: number, timePlayedSec: number, extra?: { powerUps?: number; golden?: number; maxCombo?: number }) {
    const stats = this.getStats();
    stats.gamesPlayed += 1;
    stats.totalFoodEaten += foodCount;
    stats.totalTimePlayed += Math.floor(timePlayedSec);
    if (extra?.powerUps) stats.powerUpsCollected += extra.powerUps;
    if (extra?.golden) stats.goldenApplesEaten += extra.golden;
    if (extra?.maxCombo && extra.maxCombo > stats.maxComboAchieved) stats.maxComboAchieved = extra.maxCombo;

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

  public static updateSpeedChallengeHighScore(score: number, level: number): { isNewHighScore: boolean; highScore: number } {
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

    this.addLeaderboardEntry(score, level, 'speed_challenge');

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

  // --- Achievements ---

  public static getUnlockedAchievements(): string[] {
    try {
      const stored = localStorage.getItem(ACHIEVEMENTS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('LocalStorage unavailable for achievements', e);
    }
    return [];
  }

  public static unlockAchievement(id: string): boolean {
    const list = this.getUnlockedAchievements();
    if (!list.includes(id)) {
      list.push(id);
      try {
        localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(list));
      } catch (e) {
        console.warn('Failed to save achievement', e);
      }
      return true; // Newly unlocked
    }
    return false;
  }

  // --- Leaderboard ---

  public static getLeaderboard(): LeaderboardEntry[] {
    try {
      const stored = localStorage.getItem(LEADERBOARD_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('LocalStorage unavailable for leaderboard', e);
    }
    return [];
  }

  public static addLeaderboardEntry(score: number, level: number, mode: 'normal' | 'speed_challenge') {
    if (score <= 0) return;
    const entries = this.getLeaderboard();
    const newEntry: LeaderboardEntry = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      score,
      level,
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      mode,
    };
    entries.push(newEntry);
    entries.sort((a, b) => b.score - a.score);
    const trimmed = entries.slice(0, 10);
    try {
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(trimmed));
    } catch (e) {
      console.warn('Failed to save leaderboard entry', e);
    }
  }
}

