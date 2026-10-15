import { SpeakerIcon } from './icons'

export default function SoundToggle({ muted, onToggle }: { muted: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      className="icon-btn"
      aria-pressed={muted}
      aria-label={muted ? 'Włącz dźwięk' : 'Wyłącz dźwięk'}
      onClick={onToggle}
    >
      <SpeakerIcon muted={muted} />
    </button>
  )
}
