/**
 * ParticleSystem.ts - 4K High-performance Particle & Shockwave Engine
 * Handles glowing sparks, floating score text, ripple rings, and snake trail effects.
 */

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  initialSize: number;
  life: number;
  maxLife: number;
  decay: number;
  shape?: 'circle' | 'square' | 'spark';
  glow?: boolean;
}

export interface FloatingText {
  x: number;
  y: number;
  vy: number;
  text: string;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

export interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  width: number;
  life: number;
  maxLife: number;
}

export class ParticleSystem {
  private particles: Particle[] = [];
  private floatingTexts: FloatingText[] = [];
  private shockwaves: Shockwave[] = [];
  
  // Screen shake system
  public shakeIntensity: number = 0;
  public shakeDecay: number = 0.9;
  public shakeOffsetX: number = 0;
  public shakeOffsetY: number = 0;

  public triggerShake(amount: number = 10) {
    this.shakeIntensity = Math.min(this.shakeIntensity + amount, 25);
  }

  public addSparks(x: number, y: number, color: string, count: number = 16, speedMultiplier: number = 1.0) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = (2 + Math.random() * 5) * speedMultiplier;
      const life = 20 + Math.random() * 25;
      const size = 3 + Math.random() * 4;

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size,
        initialSize: size,
        life,
        maxLife: life,
        decay: 1.0,
        shape: Math.random() > 0.4 ? 'spark' : 'circle',
        glow: true,
      });
    }
  }

  public addTrailParticle(x: number, y: number, color: string) {
    this.particles.push({
      x: x + (Math.random() - 0.5) * 6,
      y: y + (Math.random() - 0.5) * 6,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      color,
      size: 4 + Math.random() * 3,
      initialSize: 4 + Math.random() * 3,
      life: 15 + Math.random() * 10,
      maxLife: 25,
      decay: 1.0,
      shape: 'circle',
      glow: true,
    });
  }

  public addShockwave(x: number, y: number, color: string, maxRadius: number = 80) {
    this.shockwaves.push({
      x,
      y,
      radius: 5,
      maxRadius,
      color,
      width: 4,
      life: 30,
      maxLife: 30,
    });
  }

  public addFloatingText(x: number, y: number, text: string, color: string, size: number = 20) {
    this.floatingTexts.push({
      x,
      y,
      vy: -1.8,
      text,
      color,
      size,
      life: 45,
      maxLife: 45,
    });
  }

  public update() {
    // Update Screen Shake
    if (this.shakeIntensity > 0.1) {
      this.shakeOffsetX = (Math.random() * 2 - 1) * this.shakeIntensity;
      this.shakeOffsetY = (Math.random() * 2 - 1) * this.shakeIntensity;
      this.shakeIntensity *= this.shakeDecay;
    } else {
      this.shakeIntensity = 0;
      this.shakeOffsetX = 0;
      this.shakeOffsetY = 0;
    }

    // Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.95;
      p.vy *= 0.95;
      p.life -= p.decay;
      p.size = p.initialSize * (p.life / p.maxLife);

      if (p.life <= 0 || p.size <= 0.2) {
        this.particles.splice(i, 1);
      }
    }

    // Update Shockwaves
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.life--;
      const progress = 1 - sw.life / sw.maxLife;
      sw.radius = sw.maxRadius * Math.sin((progress * Math.PI) / 2);
      sw.width = 4 * (1 - progress);

      if (sw.life <= 0) {
        this.shockwaves.splice(i, 1);
      }
    }

    // Update Floating Texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy;
      ft.life--;

      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    
    // Draw shockwaves
    this.shockwaves.forEach((sw) => {
      const alpha = sw.life / sw.maxLife;
      ctx.save();
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.strokeStyle = sw.color;
      ctx.globalAlpha = alpha * 0.8;
      ctx.lineWidth = sw.width;
      ctx.shadowColor = sw.color;
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.restore();
    });

    // Draw particles with additive glow
    ctx.globalCompositeOperation = 'lighter';
    this.particles.forEach((p) => {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = p.glow ? 12 : 4;

      if (p.shape === 'spark') {
        ctx.translate(p.x, p.y);
        ctx.beginPath();
        ctx.moveTo(-p.size, 0);
        ctx.lineTo(0, -p.size * 1.5);
        ctx.lineTo(p.size, 0);
        ctx.lineTo(0, p.size * 1.5);
        ctx.closePath();
        ctx.fill();
      } else if (p.shape === 'square') {
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    // Reset composite operation for crisp text
    ctx.globalCompositeOperation = 'source-over';

    // Draw floating texts
    this.floatingTexts.forEach((ft) => {
      const alpha = Math.max(0, ft.life / ft.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = `bold ${ft.size}px 'Orbitron', 'Rajdhani', sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = ft.color;
      ctx.shadowColor = ft.color;
      ctx.shadowBlur = 10;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    });

    ctx.restore();
  }

  public clear() {
    this.particles = [];
    this.floatingTexts = [];
    this.shockwaves = [];
    this.shakeIntensity = 0;
  }
}
