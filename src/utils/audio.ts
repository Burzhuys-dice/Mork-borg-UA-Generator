/**
 * Web Audio API procedural dark drone soundscape and dice clatter effects for MÖRK BORG.
 */

let audioCtx: AudioContext | null = null;
let droneOsc1: OscillatorNode | null = null;
let droneOsc2: OscillatorNode | null = null;
let droneGain: GainNode | null = null;
let isPlayingAmbient = false;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function toggleAmbientSound(): boolean {
  try {
    const ctx = getAudioContext();

    if (isPlayingAmbient) {
      if (droneGain) {
        droneGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.5);
        setTimeout(() => {
          droneOsc1?.stop();
          droneOsc2?.stop();
          droneOsc1?.disconnect();
          droneOsc2?.disconnect();
          droneGain?.disconnect();
          isPlayingAmbient = false;
        }, 1500);
      } else {
        isPlayingAmbient = false;
      }
      return false;
    } else {
      droneGain = ctx.createGain();
      droneGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      droneGain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 2); // Soft ambient volume

      // Low sub frequency (55Hz / A1)
      droneOsc1 = ctx.createOscillator();
      droneOsc1.type = 'sawtooth';
      droneOsc1.frequency.setValueAtTime(55, ctx.currentTime);

      // Slightly detuned second sub frequency (55.4Hz) for eerie phasing
      droneOsc2 = ctx.createOscillator();
      droneOsc2.type = 'sine';
      droneOsc2.frequency.setValueAtTime(54.2, ctx.currentTime);

      // Lowpass filter to muffle into a dark dungeon rumble
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, ctx.currentTime);

      droneOsc1.connect(filter);
      droneOsc2.connect(filter);
      filter.connect(droneGain);
      droneGain.connect(ctx.destination);

      droneOsc1.start();
      droneOsc2.start();
      isPlayingAmbient = true;
      return true;
    }
  } catch (err) {
    console.error('Audio playback error:', err);
    return false;
  }
}

export function playDiceSound(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Simulate 3-4 clatters of dice hitting a wooden/stone table
    const clatterTimes = [0, 0.06, 0.12, 0.2];

    clatterTimes.forEach((delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Short wooden/bone impact noise
      osc.type = Math.random() > 0.5 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(200 + Math.random() * 400, now + delay);
      osc.frequency.exponentialRampToValueAtTime(80, now + delay + 0.04);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(300 + Math.random() * 200, now + delay);

      gain.gain.setValueAtTime(0.12, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.05);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.06);
    });
  } catch (err) {
    // Audio context might be restricted
  }
}
