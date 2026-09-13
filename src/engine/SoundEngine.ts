/**
 * SoundEngine.ts - High-fidelity Procedural Web Audio API Sound & Music Synthesizer
 * Generates all arcade sound effects and background synthwave tracks purely algorithmically.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  
  public sfxEnabled: boolean = true;
  public musicEnabled: boolean = true;
  public sfxVolume: number = 0.8;
  public musicVolume: number = 0.5;

  private isBgmPlaying: boolean = false;
  private bgmIntervalId: number | null = null;
  private bgmStep: number = 0;
  private bpm: number = 124;

  constructor() {
    // Lazy AudioContext initialization
  }

  public init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.sfxEnabled ? this.sfxVolume : 0, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.musicEnabled ? this.musicVolume : 0, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  public setSfxEnabled(enabled: boolean) {
    this.sfxEnabled = enabled;
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(enabled ? this.sfxVolume : 0, this.ctx.currentTime);
    }
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(enabled ? this.musicVolume : 0, this.ctx.currentTime);
    }
    if (!enabled && this.isBgmPlaying) {
      this.stopMusic();
    } else if (enabled && !this.isBgmPlaying) {
      this.startMusic();
    }
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    if (this.sfxGain && this.ctx && this.sfxEnabled) {
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
    }
  }

  public setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (this.musicGain && this.ctx && this.musicEnabled) {
      this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
    }
  }

  // --- SOUND EFFECTS ---

  public playClick() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, t);
      osc.frequency.exponentialRampToValueAtTime(300, t + 0.05);

      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.05);
    } catch {
      // Audio error safety
    }
  }

  public playEatNormal() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.exponentialRampToValueAtTime(880, t + 0.08);

      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.09);
    } catch {
      // Audio error safety
    }
  }

  public playEatGolden() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        if (!this.ctx || !this.sfxGain) return;
        const t = this.ctx.currentTime + index * 0.04;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t);
        osc.stop(t + 0.12);
      });
    } catch {
      // Audio safety
    }
  }

  public playEatBonus() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const notes = [440, 554.37, 659.25, 880, 1108.73];
      notes.forEach((freq, index) => {
        if (!this.ctx || !this.sfxGain) return;
        const t = this.ctx.currentTime + index * 0.035;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2400, t);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t);
        osc.stop(t + 0.18);
      });
    } catch {
      // Audio safety
    }
  }

  public playCombo(comboCount: number) {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const t = this.ctx.currentTime;
      const baseFreq = 400 + Math.min(comboCount, 15) * 80;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, t + 0.12);

      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.14);
    } catch {
      // Audio safety
    }
  }

  public playLevelUp() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const chord = [392.00, 523.25, 659.25, 783.99, 1046.50];
      chord.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const t = this.ctx.currentTime + idx * 0.06;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t);
        osc.stop(t + 0.35);
      });
    } catch {
      // Audio safety
    }
  }

  public playCrash() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const t = this.ctx.currentTime;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, t);
      osc.frequency.exponentialRampToValueAtTime(30, t + 0.4);
      gain.gain.setValueAtTime(0.6, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.4);

      const bufferSize = Math.floor(this.ctx.sampleRate * 0.35);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, t);
      filter.frequency.exponentialRampToValueAtTime(80, t + 0.35);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.5, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.sfxGain);

      noise.start(t);
    } catch {
      // Audio safety
    }
  }

  public playCountdown(isGo: boolean = false) {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (isGo) {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, t);
        osc.frequency.exponentialRampToValueAtTime(1760, t + 0.2);
        gain.gain.setValueAtTime(0.5, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        osc.start(t);
        osc.stop(t + 0.3);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, t);
        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        osc.start(t);
        osc.stop(t + 0.15);
      }

      osc.connect(gain);
      gain.connect(this.sfxGain);
    } catch {
      // Audio safety
    }
  }

  public playNewHighScore() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const fanfare = [
        { f: 523.25, d: 0.1 },
        { f: 659.25, d: 0.1 },
        { f: 783.99, d: 0.1 },
        { f: 1046.50, d: 0.3 },
        { f: 880.00, d: 0.1 },
        { f: 1046.50, d: 0.5 }
      ];

      let timeOffset = 0;
      fanfare.forEach((note) => {
        if (!this.ctx || !this.sfxGain) return;
        const t = this.ctx.currentTime + timeOffset;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, t);

        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t);
        osc.stop(t + note.d);
        timeOffset += note.d * 0.9;
      });
    } catch {
      // Audio safety
    }
  }

  public playVictory() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const melody = [
        523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.51
      ];
      melody.forEach((f, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const t = this.ctx.currentTime + idx * 0.12;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, t);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, t);

        gain.gain.setValueAtTime(0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t);
        osc.stop(t + 0.28);
      });
    } catch {
      // Audio safety
    }
  }

  // --- PROCEDURAL SYNTHWAVE BGM ---

  public startMusic(speedMultiplier: number = 1.0) {
    if (this.isBgmPlaying) return;
    this.init();
    if (!this.ctx || !this.musicGain || !this.musicEnabled) return;

    this.isBgmPlaying = true;
    this.bpm = Math.min(160, Math.floor(124 * Math.sqrt(speedMultiplier)));
    this.bgmStep = 0;

    const stepDuration = (60 / this.bpm) / 4;
    this.bgmIntervalId = window.setInterval(() => {
      this.playBgmStep();
    }, stepDuration * 1000);
  }

  public updateMusicSpeed(speedMultiplier: number) {
    if (!this.isBgmPlaying) return;
    this.stopMusic();
    this.startMusic(speedMultiplier);
  }

  public stopMusic() {
    if (this.bgmIntervalId !== null) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
    this.isBgmPlaying = false;
  }

  private playBgmStep() {
    if (!this.ctx || !this.musicGain || !this.musicEnabled) return;

    try {
      const t = this.ctx.currentTime;
      const bassScale = [65.41, 65.41, 73.42, 87.31, 98.00, 87.31, 73.42, 65.41];
      const arpScale = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50, 783.99];

      if (this.bgmStep % 2 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        const bassNote = bassScale[Math.floor(this.bgmStep / 8) % bassScale.length];
        bassOsc.type = 'sawtooth';
        bassOsc.frequency.setValueAtTime(bassNote, t);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, t);
        filter.frequency.exponentialRampToValueAtTime(150, t + 0.1);

        bassGain.gain.setValueAtTime(0.25, t);
        bassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

        bassOsc.connect(filter);
        filter.connect(bassGain);
        bassGain.connect(this.musicGain);

        bassOsc.start(t);
        bassOsc.stop(t + 0.12);
      }

      if (this.bgmStep % 4 === 2) {
        const hhOsc = this.ctx.createOscillator();
        const hhGain = this.ctx.createGain();
        hhOsc.type = 'square';
        hhOsc.frequency.setValueAtTime(8000, t);
        hhGain.gain.setValueAtTime(0.04, t);
        hhGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
        hhOsc.connect(hhGain);
        hhGain.connect(this.musicGain);
        hhOsc.start(t);
        hhOsc.stop(t + 0.03);
      }

      if (this.bgmStep % 2 === 1) {
        const arpOsc = this.ctx.createOscillator();
        const arpGain = this.ctx.createGain();
        const arpNote = arpScale[(this.bgmStep * 3) % arpScale.length];

        arpOsc.type = 'sine';
        arpOsc.frequency.setValueAtTime(arpNote, t);

        arpGain.gain.setValueAtTime(0.08, t);
        arpGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

        arpOsc.connect(arpGain);
        arpGain.connect(this.musicGain);

        arpOsc.start(t);
        arpOsc.stop(t + 0.08);
      }

      this.bgmStep = (this.bgmStep + 1) % 64;
    } catch {
      // Audio safety
    }
  }
}

export const soundEngine = new SoundEngine();
