// Clean Web Audio API synthesis for spatial room ambience & interaction feedback

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private ambientGain: GainNode | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (!muted) {
      this.startAmbientDrone();
    } else {
      this.stopAmbientDrone();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public startAmbientDrone() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      this.stopAmbientDrone();

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.04, this.ctx.currentTime + 3);
      gain.connect(this.ctx.destination);
      this.ambientGain = gain;

      // Low soothing warm frequency drone (110Hz - A2, and 165Hz - E3 harmonic)
      const osc1 = this.ctx.createOscillator();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(110, this.ctx.currentTime);
      osc1.connect(gain);
      osc1.start();
      this.osc1 = osc1;

      const osc2 = this.ctx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(165, this.ctx.currentTime);
      osc2.connect(gain);
      osc2.start();
      this.osc2 = osc2;
    } catch (e) {
      console.warn("Audio Context init blocked until user interaction", e);
    }
  }

  public stopAmbientDrone() {
    try {
      if (this.ambientGain && this.ctx) {
        this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1);
        setTimeout(() => {
          this.osc1?.stop();
          this.osc2?.stop();
          this.osc1?.disconnect();
          this.osc2?.disconnect();
          this.ambientGain?.disconnect();
          this.osc1 = null;
          this.osc2 = null;
          this.ambientGain = null;
        }, 1100);
      }
    } catch {
      // ignore
    }
  }

  // Play pleasant acoustic chime when user enters a room or clicks a hotspot
  public playRoomChime(category?: string) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const chimeGain = this.ctx.createGain();
      chimeGain.gain.setValueAtTime(0.05, now);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);
      chimeGain.connect(this.ctx.destination);

      let freq = 523.25; // C5 default
      if (category === "kitchen") freq = 587.33; // D5
      if (category === "pool") freq = 659.25; // E5
      if (category === "living") freq = 440.0; // A4
      if (category === "bedroom") freq = 392.0; // G4
      if (category === "games") freq = 493.88; // B4
      if (category === "bathroom") freq = 698.46; // F5
      if (category === "garden") freq = 349.23; // F4

      const osc = this.ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.4);
      osc.connect(chimeGain);
      osc.start(now);
      osc.stop(now + 1.7);
    } catch {
      // Audio autoplay policy
    }
  }
}

export const ambientAudio = new AmbientAudioEngine();
