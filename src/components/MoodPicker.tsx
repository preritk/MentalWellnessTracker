import { useState, type KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import { MOOD_ORDER, type Mood } from '../lib/storage'
import { useT, moodLabel } from '../lib/i18n'
import { TRIGGERS } from '../lib/triggers'
import { Button, Chip, cx } from './ui'

interface MoodPickerProps {
  onSubmit: (ci: { mood: Mood; triggers: string[]; intensity: number; note: string }) => void
  lastMood?: Mood
}

const MOOD_VAR: Record<Mood, string> = {
  Drained: 'var(--color-mood-drained)',
  Low: 'var(--color-mood-low)',
  Okay: 'var(--color-mood-okay)',
  Steady: 'var(--color-mood-steady)',
  Bright: 'var(--color-mood-bright)',
}

const MOOD_EMOJI: Record<Mood, string> = {
  Drained: '🪫',
  Low: '🌧️',
  Okay: '🌤️',
  Steady: '🌿',
  Bright: '☀️',
}

/** Clamp a mood index to a valid position in MOOD_ORDER. */
function step(from: Mood, delta: number): Mood {
  const i = MOOD_ORDER.indexOf(from)
  const next = Math.min(MOOD_ORDER.length - 1, Math.max(0, i + delta))
  return MOOD_ORDER[next]
}

/** Accessible mood check-in: a radiogroup of moods plus triggers, intensity, and a note. */
export default function MoodPicker({ onSubmit, lastMood }: MoodPickerProps) {
  const { t, lang } = useT()
  const [mood, setMood] = useState<Mood | null>(null)
  const [triggers, setTriggers] = useState<string[]>([])
  const [intensity, setIntensity] = useState(5)
  const [note, setNote] = useState('')

  function toggleTrigger(id: string) {
    setTriggers((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]))
  }

  function handleSubmit() {
    if (!mood) return
    onSubmit({ mood, triggers, intensity, note })
    // reset
    setMood(null)
    setTriggers([])
    setIntensity(5)
    setNote('')
  }

  // Roving radio keyboard support within the radiogroup.
  function onRadioKeyDown(e: KeyboardEvent<HTMLButtonElement>, current: Mood) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      setMood(step(current, 1))
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      setMood(step(current, -1))
    }
  }

  return (
    <div>
      <div
        role="radiogroup"
        aria-label={t('checkin.title')}
        className="grid grid-cols-5 gap-2 sm:gap-3"
      >
        {MOOD_ORDER.map((m) => {
          const selected = mood === m
          return (
            <motion.button
              key={m}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected || (mood === null && m === MOOD_ORDER[0]) ? 0 : -1}
              onClick={() => setMood(m)}
              onKeyDown={(e) => onRadioKeyDown(e, m)}
              animate={{ scale: selected ? 1.06 : 1 }}
              transition={{ type: 'spring', stiffness: 420, damping: 18 }}
              className={cx(
                'flex flex-col items-center gap-1.5 rounded-2xl px-1 py-3 text-center',
                'border transition-colors duration-150 focus-visible:outline-2',
                'focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-500)]',
                selected
                  ? 'border-[var(--color-brand-500)] bg-[var(--color-brand-300)]/20'
                  : 'border-[var(--hairline)] hover:bg-[var(--hairline)]',
              )}
            >
              <span className="text-2xl" aria-hidden>
                {MOOD_EMOJI[m]}
              </span>
              <span className="text-xs font-medium text-[var(--ink)]">{moodLabel(lang, m)}</span>
              <span
                aria-hidden
                className="h-1.5 w-6 rounded-full"
                style={{ backgroundColor: MOOD_VAR[m] }}
              />
            </motion.button>
          )
        })}
      </div>

      {lastMood && (
        <div className="mt-4">
          <p className="mb-2 text-sm text-[var(--ink-soft)]">{t('checkin.same')}</p>
          <div className="flex flex-wrap gap-2">
            <Chip active={mood === step(lastMood, 1)} onClick={() => setMood(step(lastMood, 1))}>
              {t('checkin.sameBetter')}
            </Chip>
            <Chip active={mood === step(lastMood, 0)} onClick={() => setMood(step(lastMood, 0))}>
              {t('checkin.sameSame')}
            </Chip>
            <Chip active={mood === step(lastMood, -1)} onClick={() => setMood(step(lastMood, -1))}>
              {t('checkin.sameWorse')}
            </Chip>
          </div>
        </div>
      )}

      {mood && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 flex flex-col gap-5"
        >
          {/* Triggers */}
          <fieldset className="border-0 p-0">
            <legend className="mb-2 text-sm font-medium text-[var(--ink)]">
              {t('checkin.about')}
            </legend>
            <div className="flex flex-wrap gap-2">
              {TRIGGERS.map((tr) => (
                <Chip
                  key={tr.id}
                  active={triggers.includes(tr.id)}
                  onClick={() => toggleTrigger(tr.id)}
                >
                  <span aria-hidden>{tr.emoji} </span>
                  {tr.label[lang]}
                </Chip>
              ))}
            </div>
          </fieldset>

          {/* Intensity */}
          <div>
            <label
              htmlFor="moodpicker-intensity"
              className="mb-2 flex items-center justify-between text-sm font-medium text-[var(--ink)]"
            >
              <span>{t('checkin.intensity')}</span>
              <span className="tabular-nums text-[var(--ink-soft)]" aria-hidden>
                {intensity}/10
              </span>
            </label>
            <input
              id="moodpicker-intensity"
              type="range"
              min={1}
              max={10}
              step={1}
              value={intensity}
              aria-valuetext={`${intensity} / 10`}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full accent-[var(--color-brand-500)]"
            />
          </div>

          {/* Note */}
          <div>
            <label
              htmlFor="moodpicker-note"
              className="mb-2 block text-sm font-medium text-[var(--ink)]"
            >
              {t('checkin.note')}
            </label>
            <textarea
              id="moodpicker-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t('checkin.notePlaceholder')}
              rows={2}
              className={cx(
                'w-full rounded-2xl border border-[var(--hairline)] bg-transparent px-3.5 py-2.5',
                'text-sm text-[var(--ink)] placeholder:text-[var(--ink-soft)]',
                'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-brand-500)]',
              )}
            />
          </div>

          <div>
            <Button type="button" onClick={handleSubmit}>
              {t('checkin.log')}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
