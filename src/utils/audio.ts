import bgmUrl from '../assets/Music/museum of rust.mp3';
import portfolioBgmUrl from '../assets/Music/Aquamarine Balance.mp3';
import crtTvUrl from '../assets/sound/A_broken_CRT_televis.mp3';
import ui1Url from '../assets/sound/UI_1.mp3';
import ui2Url from '../assets/sound/UI_2.mp3';
import bicycleUrl from '../assets/sound/bicycle.mp3';
import bicycle3Url from '../assets/sound/bicycle3.mp3';
import scaleMovementUrl from '../assets/sound/scalemovement.mp3';
import pearlFallUrl from '../assets/sound/pearlfall.mp3';
import glassMarbleUrl from '../assets/sound/glassmarble.mp3';
import paperUrl from '../assets/sound/papersound.mp3';
import crack1Url from '../assets/sound/crack1.mp3';
import crack2Url from '../assets/sound/crack2.mp3';
import magicalUrl from '../assets/sound/magical.mp3';

let audioCtx: AudioContext | null = null;
let isMutedGlobal = false;
let activeBgmTrack: 'default' | 'portfolio' = 'portfolio';
let bgmAudio: HTMLAudioElement | null = null;
let portfolioBgmAudio: HTMLAudioElement | null = null;
let crtTvAudio: HTMLAudioElement | null = null;
let bicycleAudio: HTMLAudioElement | null = null;
let bicycle3Audio: HTMLAudioElement | null = null;

function getBgm() {
  if (typeof window === 'undefined') return null;
  if (!bgmAudio) {
    bgmAudio = new Audio(bgmUrl);
    bgmAudio.loop = true;
    bgmAudio.volume = 0.35; // Standard ambient volume
  }
  return bgmAudio;
}

function getPortfolioBgm() {
  if (typeof window === 'undefined') return null;
  if (!portfolioBgmAudio) {
    portfolioBgmAudio = new Audio(portfolioBgmUrl);
    portfolioBgmAudio.loop = true;
    portfolioBgmAudio.volume = 0.35; // Standard ambient volume
  }
  return portfolioBgmAudio;
}

function getActiveBgmAudio() {
  return activeBgmTrack === 'portfolio' ? getPortfolioBgm() : getBgm();
}

function getCrtTvAudio() {
  if (typeof window === 'undefined') return null;
  if (!crtTvAudio) {
    crtTvAudio = new Audio(crtTvUrl);
    crtTvAudio.loop = true;
    crtTvAudio.volume = 0.25;
  }
  return crtTvAudio;
}

function getBicycleAudio() {
  if (typeof window === 'undefined') return null;
  if (!bicycleAudio) {
    bicycleAudio = new Audio(bicycleUrl);
    bicycleAudio.loop = true;
    bicycleAudio.volume = 0.3;
  }
  return bicycleAudio;
}

function getBicycle3Audio() {
  if (typeof window === 'undefined') return null;
  if (!bicycle3Audio) {
    bicycle3Audio = new Audio(bicycle3Url);
    bicycle3Audio.loop = true;
    bicycle3Audio.volume = 0.3;
  }
  return bicycle3Audio;
}

if (typeof window !== 'undefined') {
  const startBgmOnInteraction = () => {
    if (!isMutedGlobal) {
      const activeAudio = getActiveBgmAudio();
      if (activeAudio && activeAudio.paused) {
        activeAudio.play().catch(() => {});
      }
    }
    window.removeEventListener('click', startBgmOnInteraction);
    window.removeEventListener('pointerdown', startBgmOnInteraction);
    window.removeEventListener('keydown', startBgmOnInteraction);
  };
  window.addEventListener('click', startBgmOnInteraction);
  window.addEventListener('pointerdown', startBgmOnInteraction);
  window.addEventListener('keydown', startBgmOnInteraction);
}

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const audioManager = {
  toggleMute() {
    isMutedGlobal = !isMutedGlobal;
    if (isMutedGlobal) {
      if (bgmAudio) bgmAudio.pause();
      if (portfolioBgmAudio) portfolioBgmAudio.pause();
      if (crtTvAudio) crtTvAudio.pause();
      if (bicycleAudio) bicycleAudio.pause();
      if (bicycle3Audio) bicycle3Audio.pause();
    } else {
      const activeAudio = getActiveBgmAudio();
      if (activeAudio && activeAudio.paused) {
        activeAudio.play().catch(() => {});
      }
    }
    return isMutedGlobal;
  },

  isMuted() {
    return isMutedGlobal;
  },

  playBgm() {
    if (isMutedGlobal) return;
    const activeAudio = getActiveBgmAudio();
    if (activeAudio && activeAudio.paused) {
      activeAudio.play().catch(() => {});
    }
  },

  stopBgm() {
    if (bgmAudio) {
      bgmAudio.pause();
    }
    if (portfolioBgmAudio) {
      portfolioBgmAudio.pause();
    }
  },

  switchBgmTrack(track: 'default' | 'portfolio') {
    if (activeBgmTrack === track) return;

    // Pause current active audio
    if (bgmAudio) bgmAudio.pause();
    if (portfolioBgmAudio) portfolioBgmAudio.pause();

    activeBgmTrack = track;

    if (!isMutedGlobal) {
      const activeAudio = getActiveBgmAudio();
      if (activeAudio) {
        activeAudio.currentTime = 0;
        activeAudio.play().catch(() => {});
      }
    }
  },

  playUI1() {
    this.playBgm();
    if (isMutedGlobal) return;
    const sound = new Audio(ui1Url);
    sound.volume = 0.5;
    sound.play().catch(() => {});
  },

  playUI2() {
    this.playBgm();
    if (isMutedGlobal) return;
    const sound = new Audio(ui2Url);
    sound.volume = 0.5;
    sound.play().catch(() => {});
  },

  startCrtTvLoop() {
    this.playBgm();
    if (isMutedGlobal) return;
    const audio = getCrtTvAudio();
    if (audio && audio.paused) {
      audio.play().catch(() => {});
    }
  },

  stopCrtTvLoop() {
    if (crtTvAudio) {
      crtTvAudio.pause();
      crtTvAudio.currentTime = 0;
    }
  },

  startBicycleLoop() {
    this.playBgm();
    if (isMutedGlobal) return;
    const audio = getBicycleAudio();
    if (audio && audio.paused) {
      audio.play().catch(() => {});
    }
  },

  stopBicycleLoop() {
    if (bicycleAudio) {
      bicycleAudio.pause();
      bicycleAudio.currentTime = 0;
    }
  },

  startBicycle3Loop() {
    this.playBgm();
    if (isMutedGlobal) return;
    const audio = getBicycle3Audio();
    if (audio && audio.paused) {
      audio.play().catch(() => {});
    }
  },

  stopBicycle3Loop() {
    if (bicycle3Audio) {
      bicycle3Audio.pause();
      bicycle3Audio.currentTime = 0;
    }
  },

  playScaleMovement() {
    this.playBgm();
    if (isMutedGlobal) return;
    const sound = new Audio(scaleMovementUrl);
    sound.volume = 0.45;
    sound.play().catch(() => {});
  },

  playPearlFall() {
    this.playBgm();
    if (isMutedGlobal) return;
    const sound = new Audio(pearlFallUrl);
    sound.volume = 0.55;
    sound.play().catch(() => {});
  },

  playGlassMarble() {
    this.playBgm();
    if (isMutedGlobal) return;
    const sound = new Audio(glassMarbleUrl);
    sound.volume = 0.5;
    sound.play().catch(() => {});
  },

  playPaperSound() {
    this.playBgm();
    if (isMutedGlobal) return;
    const sound = new Audio(paperUrl);
    sound.volume = 0.5;
    sound.play().catch(() => {});
  },

  playCrackSequential() {
    this.playBgm();
    if (isMutedGlobal) return;
    const crack1 = new Audio(crack1Url);
    crack1.volume = 0.55;
    crack1.play().then(() => {
      crack1.onended = () => {
        if (!isMutedGlobal) {
          const crack2 = new Audio(crack2Url);
          crack2.volume = 0.55;
          crack2.play().catch(() => {});
        }
      };
    }).catch(() => {
      const crack2 = new Audio(crack2Url);
      crack2.volume = 0.55;
      crack2.play().catch(() => {});
    });
  },

  playMagical() {
    this.playBgm();
    if (isMutedGlobal) return;
    const sound = new Audio(magicalUrl);
    sound.volume = 0.55;
    sound.play().catch(() => {});
  },

  playTone(freq: number, type: OscillatorType = 'sine', duration = 0.5, vol = 0.1) {
    if (isMutedGlobal) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gainNode.gain.setValueAtTime(vol, ctx.currentTime);
      // Soft release envelope
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio Context is not initialized yet or not supported.', e);
    }
  },

  playClick() {
    this.playBgm();
    // Low woody percussion click
    this.playTone(400, 'sine', 0.15, 0.08);
  },

  playChime() {
    this.playBgm();
    // Elegant crystal vibe
    const baseFreq = 523.25; // C5
    this.playTone(baseFreq, 'sine', 0.8, 0.1);
    setTimeout(() => this.playTone(baseFreq * 1.5, 'sine', 1.0, 0.05), 100); // G5 overlay
    setTimeout(() => this.playTone(baseFreq * 2, 'sine', 1.2, 0.03), 200);   // C6 overlay
  },

  playDeepChime() {
    this.playBgm();
    // Deep drone chime
    const baseFreq = 130.81; // C3
    this.playTone(baseFreq, 'sine', 2.0, 0.15);
    setTimeout(() => this.playTone(baseFreq * 1.5, 'sine', 1.8, 0.08), 150); // G3
    setTimeout(() => this.playTone(baseFreq * 2.0, 'sine', 1.5, 0.05), 300); // C4
  },

  playWaterDrop() {
    this.playBgm();
    // Bubble sound
    if (isMutedGlobal) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.12);

      gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    } catch (e) {
      // ignore
    }
  },

  playUncomfortableRustle() {
    this.playBgm();
    // Metallic scraping bell representing anxiety
    if (isMutedGlobal) return;
    try {
      const ctx = getAudioContext();
      // Combine low dissonant frequencies
      const freqs = [184, 191, 233];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        // vibrate frequency slightly
        osc.frequency.linearRampToValueAtTime(freq + (idx % 2 === 0 ? 5 : -5), ctx.currentTime + 0.5);

        gainNode.gain.setValueAtTime(0.03, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      });
    } catch (e) {
      // ignore
    }
  },

  playFeatherBreeze() {
    this.playBgm();
    // Soft high-frequency whisper noise
    if (isMutedGlobal) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      // Soft vibrato
      osc.frequency.linearRampToValueAtTime(920, ctx.currentTime + 0.6);

      gainNode.gain.setValueAtTime(0.04, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {
      // ignore
    }
  }
};
