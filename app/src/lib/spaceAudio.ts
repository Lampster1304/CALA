/**
 * spaceAudio.ts — Subtle synthesized space sounds via Web Audio API.
 * All sounds are generated procedurally (no audio files).
 * SSR-safe: guarded behind `typeof window`.
 *
 * NOTE: Chrome/Safari require a real user gesture (click, touch, keydown)
 * before AudioContext can run. Scroll alone does NOT count.
 * Sounds will begin working after the user's first click/touch/keypress.
 */

let audioContext: AudioContext | null = null;
let masterGain: GainNode | null = null;
let listenersBound = false;
const lastPlayTime: Record<string, number> = {};

/* ── Helpers ─────────────────────────────────── */

function audioNow(): number {
  return audioContext?.currentTime ?? 0;
}

/** Activate (create or resume) the AudioContext. */
function activateAudio() {
  try {
    if (!audioContext) {
      audioContext = new AudioContext();
      masterGain = audioContext.createGain();
      masterGain.gain.value = 1;
      masterGain.connect(audioContext.destination);
    }
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }
  } catch {
    /* AudioContext not supported */
  }
}

/**
 * Checks cooldown (wall-clock time) and ensures the context is running.
 * Returns false if the context hasn't been activated by a user gesture yet.
 */
function canPlay(key: string, cooldownMs: number): boolean {
  if (!audioContext || !masterGain || audioContext.state !== "running") {
    return false;
  }
  const t = Date.now();
  const last = lastPlayTime[key];
  if (last !== undefined && t - last < cooldownMs) return false;
  lastPlayTime[key] = t;
  return true;
}

function scheduleCleanup(nodes: AudioNode[], durationMs: number) {
  setTimeout(() => {
    nodes.forEach((n) => {
      try {
        n.disconnect();
      } catch {
        /* already disconnected */
      }
    });
  }, durationMs + 100);
}

/* ── Init ────────────────────────────────────── */

export function initSpaceAudio(): void {
  if (typeof window === "undefined" || listenersBound) return;
  listenersBound = true;

  // Create eagerly (will be suspended until a user gesture)
  activateAudio();

  // These events ARE user-activation triggers per the HTML spec.
  // Chrome/Safari will honour resume() only when called from one of these.
  const onGesture = () => activateAudio();
  window.addEventListener("pointerdown", onGesture, { once: true });
  window.addEventListener("click", onGesture, { once: true });
  window.addEventListener("keydown", onGesture, { once: true });
}

/* ── Sounds ──────────────────────────────────── */

/**
 * Whoosh — filtered white-noise sweep.
 */
export function playWhoosh(): void {
  if (!canPlay("whoosh", 300)) return;
  const ctx = audioContext!;
  const t = audioNow();

  const bufferSize = ctx.sampleRate * 0.4;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(800, t);
  filter.frequency.linearRampToValueAtTime(200, t + 0.4);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.20, t + 0.05);
  gain.gain.linearRampToValueAtTime(0, t + 0.4);

  source.connect(filter).connect(gain).connect(masterGain!);
  source.start(t);
  source.stop(t + 0.4);

  scheduleCleanup([source, filter, gain], 500);
}

/**
 * Line draw — sine sweep 800→1200 Hz.
 */
export function playLineDraw(): void {
  if (!canPlay("lineDraw", 200)) return;
  const ctx = audioContext!;
  const t = audioNow();

  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(800, t);
  osc.frequency.linearRampToValueAtTime(1200, t + 0.3);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.15, t + 0.03);
  gain.gain.linearRampToValueAtTime(0, t + 0.3);

  osc.connect(gain).connect(masterGain!);
  osc.start(t);
  osc.stop(t + 0.3);

  scheduleCleanup([osc, gain], 400);
}

/**
 * Shimmer — two slightly detuned sine oscillators (beat frequency).
 */
export function playShimmer(): void {
  if (!canPlay("shimmer", 500)) return;
  const ctx = audioContext!;
  const t = audioNow();

  const osc1 = ctx.createOscillator();
  osc1.type = "sine";
  osc1.frequency.setValueAtTime(1200, t);

  const osc2 = ctx.createOscillator();
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(1207, t);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.12, t + 0.05);
  gain.gain.linearRampToValueAtTime(0, t + 0.6);

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(masterGain!);

  osc1.start(t);
  osc2.start(t);
  osc1.stop(t + 0.6);
  osc2.stop(t + 0.6);

  scheduleCleanup([osc1, osc2, gain], 700);
}

/**
 * Pop — quick sine drop 600→300 Hz.
 */
export function playPop(): void {
  if (!canPlay("pop", 300)) return;
  const ctx = audioContext!;
  const t = audioNow();

  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(600, t);
  osc.frequency.linearRampToValueAtTime(300, t + 0.15);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.25, t);
  gain.gain.linearRampToValueAtTime(0, t + 0.15);

  osc.connect(gain).connect(masterGain!);
  osc.start(t);
  osc.stop(t + 0.15);

  scheduleCleanup([osc, gain], 250);
}

/**
 * Soft tone — gentle 400 Hz sine.
 */
export function playSoftTone(): void {
  if (!canPlay("softTone", 150)) return;
  const ctx = audioContext!;
  const t = audioNow();

  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(400, t);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.12, t + 0.04);
  gain.gain.linearRampToValueAtTime(0, t + 0.5);

  osc.connect(gain).connect(masterGain!);
  osc.start(t);
  osc.stop(t + 0.5);

  scheduleCleanup([osc, gain], 600);
}
