import cantinaUrl from './assets/cantina.mp3'
import { loadMuted, saveMuted } from './storage'

/**
 * Proceduralny dźwięk (WebAudio), bez plików. Kontekst powstaje dopiero po geście
 * użytkownika (unlockAudio), a każda funkcja jest odporna na brak WebAudio.
 */
let ctx: AudioContext | null = null
let muted = loadMuted()
let active: { stop: () => void } | null = null

export const isMuted = () => muted

export function setMuted(value: boolean) {
  muted = value
  saveMuted(value)
  if (value) active?.stop()
}

function getCtx(): AudioContext | null {
  try {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx ??= new AC()
    if (ctx.state === 'suspended') void ctx.resume().catch(() => {})
    return ctx
  } catch {
    return null
  }
}

/** Wywołaj w handlerze kliknięcia, żeby przeglądarka pozwoliła na dźwięk. */
export const unlockAudio = () => {
  if (getCtx()) warmCantina()
}

/** Bajty pliku; adresy data: (wersja jednoplikowa) dekodujemy ręcznie, bez fetch. */
async function loadBytes(url: string): Promise<ArrayBuffer> {
  if (url.startsWith('data:')) {
    const bin = atob(url.slice(url.indexOf(',') + 1))
    const bytes = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
    return bytes.buffer
  }
  return (await fetch(url)).arrayBuffer()
}

let cantina: Promise<AudioBuffer | null> | null = null

/** Pobiera i dekoduje muzykę kantyny z wyprzedzeniem (raz). */
function warmCantina(): Promise<AudioBuffer | null> {
  cantina ??= (async () => {
    try {
      const c = getCtx()
      if (!c) return null
      const data = await loadBytes(cantinaUrl)
      // wariant z callbackami działa też w starszym Safari
      return await new Promise<AudioBuffer>((res, rej) => c.decodeAudioData(data, res, rej))
    } catch {
      cantina = null // pozwól spróbować ponownie
      return null
    }
  })()
  return cantina
}

/** Muzyka z kantyny do alternatywnego ekranu sukcesu. Zwraca uchwyt do zatrzymania. */
export function playCantina(): { stop: () => void } {
  if (muted) return { stop() {} }
  let stopped = false
  let src: AudioBufferSourceNode | null = null
  let gain: GainNode | null = null
  const handle = {
    stop() {
      stopped = true
      if (active === handle) active = null
      try {
        const c = getCtx()
        if (c && gain) {
          gain.gain.cancelScheduledValues(c.currentTime)
          gain.gain.setTargetAtTime(0, c.currentTime, 0.05)
        }
        setTimeout(() => {
          try {
            src?.stop()
          } catch {
            /* już zatrzymane */
          }
        }, 300)
      } catch {
        /* ignoruj */
      }
    },
  }
  active?.stop()
  active = handle
  void warmCantina().then((buf) => {
    const c = getCtx()
    if (stopped || !buf || !c) return
    try {
      src = c.createBufferSource()
      src.buffer = buf
      gain = c.createGain()
      const t = c.currentTime
      gain.gain.setValueAtTime(0.0001, t)
      gain.gain.exponentialRampToValueAtTime(0.8, t + 0.08)
      gain.gain.setValueAtTime(0.8, t + Math.max(0.1, buf.duration - 0.5))
      gain.gain.exponentialRampToValueAtTime(0.0001, t + buf.duration)
      src.connect(gain).connect(c.destination)
      src.start()
    } catch {
      /* dźwięk jest opcjonalny */
    }
  })
  return handle
}

let noiseBuffer: AudioBuffer | null = null
function noise(c: AudioContext) {
  if (!noiseBuffer) {
    noiseBuffer = c.createBuffer(1, c.sampleRate * 2, c.sampleRate)
    const d = noiseBuffer.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  }
  const src = c.createBufferSource()
  src.buffer = noiseBuffer
  src.loop = true
  return src
}

/** Krótki sygnał przy odhaczeniu (wyższy) i cofnięciu (niższy). */
export function playCheck(checked: boolean) {
  if (muted) return
  const c = getCtx()
  if (!c) return
  try {
    const t = c.currentTime
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = 'triangle'
    o.frequency.setValueAtTime(checked ? 760 : 420, t)
    o.frequency.exponentialRampToValueAtTime(checked ? 1280 : 300, t + 0.07)
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.06, t + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1)
    o.connect(g).connect(c.destination)
    o.start(t)
    o.stop(t + 0.12)
  } catch {
    /* dźwięk jest opcjonalny */
  }
}

const hz = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12)

/**
 * Sekwencja zakończenia misji, zsynchronizowana z animacją CSS:
 * 0 s potwierdzenie, 0.5–3 s silnik i skok, 3 s błysk i uderzenie, od 3.2 s fanfara.
 * `reduced` pomija całą część narastającą i gra tylko krótką fanfarę.
 */
export function playMission(reduced: boolean): { stop: () => void } {
  const none = { stop() {} }
  if (muted) return none
  const c = getCtx()
  if (!c) return none
  try {
    active?.stop()
    const t0 = c.currentTime + 0.05
    const master = c.createGain()
    master.gain.value = 0.55
    const comp = c.createDynamicsCompressor()
    master.connect(comp).connect(c.destination)
    const sources: AudioScheduledSourceNode[] = []
    const track = <T extends AudioScheduledSourceNode>(n: T, start: number, stop: number) => {
      n.start(t0 + start)
      n.stop(t0 + stop)
      sources.push(n)
      return n
    }

    const env = (g: GainNode, at: number, peak: number, attack: number, hold: number, release: number) => {
      g.gain.setValueAtTime(0.0001, t0 + at)
      g.gain.exponentialRampToValueAtTime(peak, t0 + at + attack)
      g.gain.setValueAtTime(peak, t0 + at + attack + hold)
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + at + attack + hold + release)
    }

    const tone = (at: number, freq: number, dur: number, peak: number, type: OscillatorType = 'sine') => {
      const o = c.createOscillator()
      const g = c.createGain()
      o.type = type
      o.frequency.value = freq
      env(g, at, peak, 0.01, dur * 0.4, dur * 0.6)
      o.connect(g).connect(master)
      track(o, at, at + dur + 0.1)
    }

    const timpani = (at: number, peak: number) => {
      const o = c.createOscillator()
      const g = c.createGain()
      o.type = 'sine'
      o.frequency.setValueAtTime(130, t0 + at)
      o.frequency.exponentialRampToValueAtTime(55, t0 + at + 0.35)
      env(g, at, peak, 0.005, 0.05, 0.6)
      o.connect(g).connect(master)
      track(o, at, at + 0.8)
    }

    const brass = (at: number, midi: number, dur: number, peak: number) => {
      const f = c.createBiquadFilter()
      f.type = 'lowpass'
      f.Q.value = 2
      f.frequency.setValueAtTime(500, t0 + at)
      f.frequency.exponentialRampToValueAtTime(2600, t0 + at + 0.09)
      f.frequency.exponentialRampToValueAtTime(1500, t0 + at + dur)
      const g = c.createGain()
      env(g, at, peak, 0.05, Math.max(0.02, dur - 0.15), 0.18)
      f.connect(g).connect(master)
      for (const detune of [-7, 7]) {
        const o = c.createOscillator()
        o.type = 'sawtooth'
        o.frequency.value = hz(midi)
        o.detune.value = detune
        o.connect(f)
        track(o, at, at + dur + 0.4)
      }
    }

    const swell = (at: number, dur: number, peak: number) => {
      const n = noise(c)
      const f = c.createBiquadFilter()
      f.type = 'highpass'
      f.frequency.value = 5000
      const g = c.createGain()
      g.gain.setValueAtTime(0.0001, t0 + at)
      g.gain.exponentialRampToValueAtTime(peak, t0 + at + dur * 0.35)
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + at + dur)
      n.connect(f).connect(g).connect(master)
      track(n, at, at + dur + 0.1)
    }

    let f0 = 0 // początek fanfary
    if (reduced) {
      f0 = 0.05
    } else {
      f0 = 3.2
      // 0 s: potwierdzenie
      tone(0, 784, 0.18, 0.1, 'triangle')
      tone(0.12, 1175, 0.3, 0.1, 'triangle')
      // 0.6–1.4 s: lampki gotowości
      for (let i = 0; i < 5; i++) tone(0.6 + i * 0.2, 1000, 0.05, 0.05, 'square')
      // 0.5–3 s: silnik narasta
      const hum = c.createOscillator()
      hum.type = 'sawtooth'
      hum.frequency.setValueAtTime(48, t0 + 0.5)
      hum.frequency.exponentialRampToValueAtTime(240, t0 + 3)
      const hf = c.createBiquadFilter()
      hf.type = 'lowpass'
      hf.frequency.setValueAtTime(150, t0 + 0.5)
      hf.frequency.exponentialRampToValueAtTime(1900, t0 + 3)
      const hg = c.createGain()
      hg.gain.setValueAtTime(0.0001, t0 + 0.5)
      hg.gain.exponentialRampToValueAtTime(0.22, t0 + 2.9)
      hg.gain.exponentialRampToValueAtTime(0.0001, t0 + 3.2)
      hum.connect(hf).connect(hg).connect(master)
      track(hum, 0.5, 3.3)
      // 1.5–3 s: świst skoku
      const wn = noise(c)
      const wf = c.createBiquadFilter()
      wf.type = 'bandpass'
      wf.Q.value = 1.2
      wf.frequency.setValueAtTime(300, t0 + 1.5)
      wf.frequency.exponentialRampToValueAtTime(4200, t0 + 3)
      const wg = c.createGain()
      wg.gain.setValueAtTime(0.0001, t0 + 1.5)
      wg.gain.exponentialRampToValueAtTime(0.3, t0 + 2.95)
      wg.gain.exponentialRampToValueAtTime(0.0001, t0 + 3.4)
      wn.connect(wf).connect(wg).connect(master)
      track(wn, 1.5, 3.5)
      // 3 s: błysk i uderzenie
      const boom = c.createOscillator()
      const bg = c.createGain()
      boom.frequency.setValueAtTime(95, t0 + 3)
      boom.frequency.exponentialRampToValueAtTime(32, t0 + 4)
      env(bg, 3, 0.5, 0.01, 0.1, 0.9)
      boom.connect(bg).connect(master)
      track(boom, 3, 4.2)
    }

    // fanfara: własna fraza w C-dur, narastające kwarty i wysoki szczyt
    const melody: [number, number, number][] = [
      [0, 55, 0.28],
      [0.3, 60, 0.28],
      [0.6, 64, 0.28],
      [0.9, 67, 0.95],
      [1.9, 72, 0.3],
      [2.25, 71, 0.18],
      [2.5, 72, 0.18],
      [2.75, 74, 0.3],
      [3.1, 76, 1.8],
    ]
    for (const [at, midi, dur] of melody) brass(f0 + at, midi, dur, 0.17)
    brass(f0 + 0.9, 55, 0.95, 0.1)
    brass(f0 + 3.1, 64, 1.8, 0.1)
    brass(f0 + 3.1, 48, 1.8, 0.12)
    brass(f0 + 3.1, 67, 1.8, 0.09)
    timpani(f0, 0.5)
    timpani(f0 + 0.9, 0.55)
    timpani(f0 + 3.1, 0.7)
    swell(f0 + 2.9, 2, 0.12)

    const handle = {
      stop() {
        if (active === handle) active = null
        try {
          const now = c.currentTime
          master.gain.cancelScheduledValues(now)
          master.gain.setTargetAtTime(0, now, 0.04)
          setTimeout(() => {
            for (const s of sources) {
              try {
                s.stop()
              } catch {
                /* już zatrzymane */
              }
            }
            master.disconnect()
          }, 300)
        } catch {
          /* ignoruj */
        }
      },
    }
    active = handle
    return handle
  } catch {
    return none
  }
}
