/* Síntesis de audio Web Audio API y lectura en voz alta en español */

interface CloudTTS {
  speak: (text: string, opts?: { language?: string }) => Promise<void>;
  stop: () => void;
}

let AC: AudioContext | null = null;
let cloudTTS: CloudTTS | null = null;

export function setCloudTTS(tts: CloudTTS | null) {
  cloudTTS = tts;
}

export function tono(
  f = 520,
  d = 0.14,
  tipo: OscillatorType = 'sine',
  vol = 0.18,
  cuando = 0
) {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctx) return;
    AC = AC || new Ctx();
    if (AC.state === 'suspended') {
      AC.resume().catch(() => {});
    }
    const t = AC.currentTime + cuando;
    const o = AC.createOscillator();
    const g = AC.createGain();
    o.type = tipo;
    o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + d);
    o.connect(g).connect(AC.destination);
    o.start(t);
    o.stop(t + d + 0.02);
  } catch {
    // Silencio seguro si el dispositivo bloquea Web Audio
  }
}

export const SON = {
  bien: () => {
    tono(660, 0.12);
    tono(880, 0.16, 'sine', 0.18, 0.1);
  },
  mal: () => tono(150, 0.28, 'square', 0.06),
  vacio: () => tono(240, 0.08, 'triangle', 0.08),
  paso: (i: number) => tono(330 + i * 45, 0.13),
  fin: () => {
    [523, 659, 784, 1046].forEach((f, i) =>
      tono(f, 0.22, 'sine', 0.16, i * 0.13)
    );
  },
  muro: () => tono(110, 0.22, 'square', 0.07),
};

export async function hablar(txt: string): Promise<void> {
  if (!txt) return;
  if (cloudTTS) {
    try {
      await cloudTTS.speak(String(txt).slice(0, 1990), { language: 'es' });
      return;
    } catch (e: unknown) {
      const err = e as { code?: string };
      if (err && err.code === 'not_granted') {
        cloudTTS = null;
      } else {
        return;
      }
    }
  }
  try {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(txt);
      u.lang = 'es-CO';
      u.rate = 0.95;
      const v = window.speechSynthesis
        .getVoices()
        .find((voice) => /^es/i.test(voice.lang));
      if (v) u.voice = v;
      window.speechSynthesis.speak(u);
    }
  } catch {
    // Fallback silencioso
  }
}

export function callar(): void {
  try {
    cloudTTS?.stop();
  } catch {
    // noop
  }
  try {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  } catch {
    // noop
  }
}

export function vozDisponible(): boolean {
  return !!cloudTTS || (typeof window !== 'undefined' && 'speechSynthesis' in window);
}
