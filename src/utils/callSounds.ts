/**
 * Call Audio Synthesizer using Web Audio API
 * Generates realistic phone ringing, incoming chime, connection chime, and end call tones
 * without external audio files or network requests.
 */

let audioCtx: AudioContext | null = null;
let activeOscillators: OscillatorNode[] = [];
let activeInterval: any = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function stopAllSounds() {
  if (activeInterval) {
    clearInterval(activeInterval);
    activeInterval = null;
  }
  activeOscillators.forEach((osc) => {
    try {
      osc.stop();
      osc.disconnect();
    } catch {
      // Ignore if already stopped
    }
  });
  activeOscillators = [];
}

/**
 * Realistic Outgoing Ringtone (Dual Frequency: 400Hz + 450Hz cadence)
 */
export function playOutgoingRing() {
  stopAllSounds();
  try {
    const ctx = getAudioContext();

    const ring = () => {
      if (!ctx || ctx.state === 'closed') return;
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(400, now);
      osc2.frequency.setValueAtTime(450, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.1);
      gain.gain.setValueAtTime(0.08, now + 1.2);
      gain.gain.linearRampToValueAtTime(0, now + 1.3);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.3);
      osc2.stop(now + 1.3);

      activeOscillators.push(osc1, osc2);
    };

    ring();
    activeInterval = setInterval(ring, 3000);
  } catch (e) {
    console.warn('AudioContext not allowed or supported yet', e);
  }
}

/**
 * Melodic Incoming Ringtone (Matrimonial Chime)
 */
export function playIncomingRing() {
  stopAllSounds();
  try {
    const ctx = getAudioContext();

    const chime = () => {
      if (!ctx || ctx.state === 'closed') return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const now = ctx.currentTime + idx * 0.18;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.5);
        activeOscillators.push(osc);
      });
    };

    chime();
    activeInterval = setInterval(chime, 2500);
  } catch (e) {
    console.warn('AudioContext not allowed yet', e);
  }
}

/**
 * Call Connected Chime
 */
export function playConnectChime() {
  stopAllSounds();
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    [440, 554.37, 659.25].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + i * 0.1;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.1, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  } catch {
    // Ignore audio errors
  }
}

/**
 * Call End Hangup Tone
 */
export function playEndCallBeep() {
  stopAllSounds();
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.linearRampToValueAtTime(280, now + 0.25);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  } catch {
    // Ignore
  }
}
