import { useEffect, useRef, useState } from 'react'
import { motion, useAnimationControls, useReducedMotion } from 'framer-motion'
import { useT } from '../lib/i18n'
import { Button, cx } from './ui'

type Pattern = '478' | 'box'

interface Phase {
  /** i18n key for the cue text. */
  key: 'toolkit.breatheIn' | 'toolkit.hold' | 'toolkit.breatheOut'
  /** Seconds this phase lasts. */
  seconds: number
  /** Orb scale target for this phase. */
  scale: number
}

/** Per-pattern phase cycles. The orb scales up on inhale, holds, scales down on exhale. */
const PATTERNS: Record<Pattern, Phase[]> = {
  '478': [
    { key: 'toolkit.breatheIn', seconds: 4, scale: 1 },
    { key: 'toolkit.hold', seconds: 7, scale: 1 },
    { key: 'toolkit.breatheOut', seconds: 8, scale: 0.55 },
  ],
  box: [
    { key: 'toolkit.breatheIn', seconds: 4, scale: 1 },
    { key: 'toolkit.hold', seconds: 4, scale: 1 },
    { key: 'toolkit.breatheOut', seconds: 4, scale: 0.55 },
    { key: 'toolkit.hold', seconds: 4, scale: 0.55 },
  ],
}

const ORB_GRADIENT =
  'radial-gradient(circle at 35% 30%, var(--color-brand-400), var(--color-lilac-400))'

export default function BreathingExercise({ pattern = '478' }: { pattern?: Pattern }) {
  const { t } = useT()
  const reduceMotion = useReducedMotion()
  const controls = useAnimationControls()

  const [running, setRunning] = useState(false)
  const [phaseIndex, setPhaseIndex] = useState(0)

  const phases = PATTERNS[pattern]
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Drive the text-cue cycle (and, when motion is allowed, the orb scaling)
  // with a chain of timeouts so each phase respects its own duration.
  useEffect(() => {
    if (!running) return

    let cancelled = false
    let index = 0
    setPhaseIndex(0)

    const runPhase = () => {
      if (cancelled) return
      const phase = phases[index]
      setPhaseIndex(index)

      if (!reduceMotion) {
        void controls.start({
          scale: phase.scale,
          transition: { duration: phase.seconds, ease: 'easeInOut' },
        })
      }

      timerRef.current = setTimeout(() => {
        index = (index + 1) % phases.length
        runPhase()
      }, phase.seconds * 1000)
    }

    runPhase()

    return () => {
      cancelled = true
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [running, phases, reduceMotion, controls])

  // Reset the orb to its resting size whenever we stop.
  useEffect(() => {
    if (!running && !reduceMotion) {
      void controls.start({ scale: 0.55, transition: { duration: 0.6, ease: 'easeInOut' } })
    }
  }, [running, reduceMotion, controls])

  const activeKey = phases[phaseIndex].key

  return (
    <div className="flex flex-col items-center gap-6 py-2">
      <div className="relative flex h-56 w-56 items-center justify-center sm:h-64 sm:w-64">
        {/* Soft halo */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-full opacity-40 blur-2xl"
          style={{ background: ORB_GRADIENT }}
        />
        <motion.div
          aria-hidden
          className="h-44 w-44 rounded-full shadow-[var(--shadow-soft)] sm:h-52 sm:w-52"
          style={{ background: ORB_GRADIENT }}
          initial={{ scale: 0.55 }}
          animate={reduceMotion ? { scale: 0.85 } : controls}
        />
        {/* Phase cue, announced politely. */}
        <p
          aria-live="polite"
          className={cx(
            'absolute text-lg font-semibold tracking-tight text-white drop-shadow',
            'select-none',
          )}
        >
          {running ? t(activeKey) : ''}
        </p>
      </div>

      <Button
        type="button"
        variant={running ? 'soft' : 'primary'}
        onClick={() => setRunning((r) => !r)}
        aria-pressed={running}
      >
        {running ? t('toolkit.stop') : t('toolkit.start')}
      </Button>
    </div>
  )
}
