// Helper for playing POS WhatsApp new message notification sound
let globalAudioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!globalAudioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      globalAudioCtx = new AudioContext();
    }
  }
  if (globalAudioCtx && globalAudioCtx.state === 'suspended') {
    globalAudioCtx.resume().catch(() => {});
  }
  return globalAudioCtx;
}

// Auto-unlock AudioContext on any user interaction in window
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  };
  ['click', 'keydown', 'touchstart', 'mousemove', 'mousedown'].forEach(evt => {
    window.addEventListener(evt, unlockAudio, { passive: true });
  });
}

// Pure JS WAV Data URI audio generator for guaranteed HTML5 Audio fallback
function createWavDataUri(f1, f2 = 0, duration = 0.6) {
  try {
    const sampleRate = 22050;
    const numSamples = Math.floor(sampleRate * duration);
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);

    const writeString = (offset, str) => {
      for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + numSamples * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, numSamples * 2, true);

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const envelope = Math.max(0, 1 - (t / duration));
      let sample = Math.sin(2 * Math.PI * f1 * t);
      if (f2 > 0 && t > 0.1) {
        sample = 0.5 * sample + 0.5 * Math.sin(2 * Math.PI * f2 * (t - 0.1));
      }
      const intVal = Math.floor(sample * envelope * 24000);
      view.setInt16(44 + i * 2, intVal, true);
    }

    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return 'data:audio/wav;base64,' + btoa(binary);
  } catch (e) {
    console.error("[POS Sound] Failed to create WAV Data URI:", e);
    return '';
  }
}

export function playNewMessageSound(soundType = 'default', customUrl = '') {
  try {
    const type = soundType || 'default';

    if (type === 'custom' && customUrl) {
      const audio = new Audio(customUrl);
      audio.play().catch(e => console.warn("Failed to play custom sound:", e));
      return;
    }

    // Try Web Audio API first if context is running
    const ctx = getAudioContext();
    if (ctx) {
      ctx.resume().catch(() => {});
      if (ctx.state === 'running') {
        const now = ctx.currentTime;
        if (type === 'bell') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, now);
          gain.gain.setValueAtTime(0.5, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 1.2);
          return;
        } else if (type === 'ping') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1046.5, now);
          gain.gain.setValueAtTime(0.5, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.4);
          return;
        } else if (type === 'pop') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(300, now);
          osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
          gain.gain.setValueAtTime(0.5, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.1);
          return;
        } else {
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();
          osc1.type = 'sine';
          osc2.type = 'sine';
          osc1.frequency.setValueAtTime(523.25, now);
          osc2.frequency.setValueAtTime(659.25, now + 0.12);
          gain.gain.setValueAtTime(0.4, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);
          osc1.start(now);
          osc2.start(now + 0.12);
          osc1.stop(now + 0.9);
          osc2.stop(now + 0.9);
          return;
        }
      }
    }

    // HTML5 Audio Data URI Fallback (Guaranteed playback)
    let dataUri = '';
    if (type === 'bell') dataUri = createWavDataUri(880, 0, 0.8);
    else if (type === 'ping') dataUri = createWavDataUri(1046.5, 0, 0.4);
    else if (type === 'pop') dataUri = createWavDataUri(400, 750, 0.2);
    else dataUri = createWavDataUri(523.25, 659.25, 0.7);

    if (dataUri) {
      const audio = new Audio(dataUri);
      audio.play().catch(e => console.warn("[POS Sound] HTML5 Audio fallback failed:", e));
    }
  } catch (e) {
    console.warn("Error playing message notification sound:", e);
  }
}

export function playConfiguredWaSound() {
  if (typeof window === 'undefined') return;
  const isEnabled = localStorage.getItem('pos_wa_sound_enabled') !== 'false';
  if (!isEnabled) return;

  const soundType = localStorage.getItem('pos_wa_message_sound_type') || 'default';
  const customUrl = localStorage.getItem('pos_wa_message_sound') || '';
  playNewMessageSound(soundType, customUrl);
}

export function getWaSoundSettings() {
  if (typeof window === 'undefined') return { enabled: true, soundType: 'default' };
  return {
    enabled: localStorage.getItem('pos_wa_sound_enabled') !== 'false',
    soundType: localStorage.getItem('pos_wa_message_sound_type') || 'default'
  };
}

export function setWaSoundSettings(enabled, soundType) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('pos_wa_sound_enabled', enabled ? 'true' : 'false');
  localStorage.setItem('pos_wa_message_sound_type', soundType);
}
