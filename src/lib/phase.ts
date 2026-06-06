import type { Profile } from './storage'

export type Phase = 'general' | 'prep' | 'exam-week' | 'result-wait' | 'result-day'

const DAY = 24 * 60 * 60 * 1000

function parseISO(d: string | null): number | null {
  if (!d) return null
  const t = Date.parse(d)
  return Number.isNaN(t) ? null : t
}

/** Midnight-aligned day difference (target - now), in whole days. */
export function daysUntil(iso: string | null, now: number): number | null {
  const t = parseISO(iso)
  if (t === null) return null
  const a = new Date(now)
  a.setHours(0, 0, 0, 0)
  const b = new Date(t)
  b.setHours(0, 0, 0, 0)
  return Math.round((b.getTime() - a.getTime()) / DAY)
}

/**
 * Derive the journey phase from the profile dates relative to `now`.
 *  - exam-week: within 5 days before through 1 day after the exam
 *  - result-day: the result date itself (or within 1 day after)
 *  - result-wait: after the exam, before the result
 *  - prep: there is an upcoming exam date
 *  - general: no dates set
 */
export function getPhase(profile: Profile, now: number): Phase {
  const toExam = daysUntil(profile.examDate, now)
  const toResult = daysUntil(profile.resultDate, now)

  if (toResult !== null && toResult <= 0 && toResult >= -1) return 'result-day'

  if (toExam !== null && toExam <= 5 && toExam >= -1) return 'exam-week'

  // Past the exam, waiting for (or no) result.
  if (toExam !== null && toExam < -1) {
    if (toResult !== null && toResult > 1) return 'result-wait'
    if (toResult === null) return 'result-wait'
  }

  if (toExam !== null && toExam > 5) return 'prep'

  return 'general'
}

export interface PhaseMeta {
  key: Phase
  /** Short banner label key for i18n. */
  labelKey: string
}

export function phaseMeta(phase: Phase): PhaseMeta {
  return { key: phase, labelKey: `phase.${phase}` }
}
