import { describe, expect, it, beforeEach } from 'vitest'
import {
  __resetStoreCache,
  defaultStore,
  loadStore,
  saveStore,
  moodScore,
  type CheckIn,
} from './storage'
import { getPhase, daysUntil } from './phase'
import { pickIntervention } from './interventions'
import { moodSeries, triggerStats, bounceBack, weeklyDigest } from './insights'

const DAY = 24 * 60 * 60 * 1000
const NOW = Date.parse('2026-06-06T12:00:00')

function iso(offsetDays: number): string {
  return new Date(NOW + offsetDays * DAY).toISOString().slice(0, 10)
}

beforeEach(() => {
  sessionStorage.clear()
  __resetStoreCache()
})

describe('storage', () => {
  it('returns defaults when empty', () => {
    expect(loadStore().profile.onboarded).toBe(false)
    expect(loadStore().checkIns).toEqual([])
  })

  it('round-trips a saved store', () => {
    const s = defaultStore()
    s.profile.name = 'Aarav'
    saveStore(s)
    expect(loadStore().profile.name).toBe('Aarav')
  })

  it('discards an unknown schema version', () => {
    sessionStorage.setItem('mindmitra.v1', JSON.stringify({ version: 999, profile: { name: 'x' } }))
    expect(loadStore().profile.name).toBe('')
  })

  it('persists to sessionStorage (cleared on tab close)', () => {
    const s = defaultStore()
    s.profile.name = 'Sneha'
    saveStore(s)
    expect(sessionStorage.getItem('mindmitra.v1')).toContain('Sneha')
  })
})

describe('phase engine', () => {
  it('computes whole-day differences', () => {
    expect(daysUntil(iso(3), NOW)).toBe(3)
    expect(daysUntil(iso(-2), NOW)).toBe(-2)
    expect(daysUntil(null, NOW)).toBeNull()
  })

  it('detects exam-week within 5 days before', () => {
    const p = { ...defaultStore().profile, examDate: iso(3) }
    expect(getPhase(p, NOW)).toBe('exam-week')
  })

  it('detects prep when exam is far out', () => {
    const p = { ...defaultStore().profile, examDate: iso(40) }
    expect(getPhase(p, NOW)).toBe('prep')
  })

  it('detects result-day on the result date', () => {
    const p = { ...defaultStore().profile, examDate: iso(-30), resultDate: iso(0) }
    expect(getPhase(p, NOW)).toBe('result-day')
  })

  it('detects result-wait after exam', () => {
    const p = { ...defaultStore().profile, examDate: iso(-10), resultDate: iso(20) }
    expect(getPhase(p, NOW)).toBe('result-wait')
  })

  it('is general with no dates', () => {
    expect(getPhase(defaultStore().profile, NOW)).toBe('general')
  })
})

describe('intervention rules engine', () => {
  const base = { mood: 'Okay' as const, triggers: [] as string[], intensity: 5, phase: 'prep' as const, hour: 15 }

  it('routes severe distress to a human', () => {
    expect(pickIntervention({ ...base, mood: 'Drained', intensity: 9 }).id).toBe('human-help')
  })

  it('keeps exam-week minimal and grounding', () => {
    expect(pickIntervention({ ...base, phase: 'exam-week' }).id).toBe('exam-anchor')
  })

  it('gives rest permission when drained and late at night', () => {
    expect(pickIntervention({ ...base, mood: 'Drained', hour: 1 }).id).toBe('rest-permission')
  })

  it('reframes after a bad mock', () => {
    expect(pickIntervention({ ...base, triggers: ['mock'] }).id).toBe('reframe-mock')
  })

  it('offers self-compassion in result phases at high intensity', () => {
    expect(pickIntervention({ ...base, phase: 'result-day', intensity: 8 }).id).toBe('compassion-friend')
  })

  it('always returns a defined intervention', () => {
    expect(pickIntervention(base)).toBeDefined()
  })
})

describe('insights', () => {
  const checkIns: CheckIn[] = [
    { id: '1', ts: NOW - 5 * DAY, mood: 'Drained', triggers: ['mock', 'ranks'], intensity: 8, note: '' },
    { id: '2', ts: NOW - 4 * DAY, mood: 'Low', triggers: ['ranks'], intensity: 6, note: '' },
    { id: '3', ts: NOW - 3 * DAY, mood: 'Okay', triggers: [], intensity: 4, note: '' },
    { id: '4', ts: NOW - 1 * DAY, mood: 'Steady', triggers: ['mock'], intensity: 3, note: '' },
  ]

  it('builds a continuous series with gaps as null', () => {
    const s = moodSeries(checkIns, NOW, 7)
    expect(s).toHaveLength(7)
    expect(s.some((p) => p.score === null)).toBe(true)
    // Last point is "today" (no check-in -> null); the Steady check-in was yesterday.
    expect(s[s.length - 1].score).toBeNull()
    expect(s[s.length - 2].score).toBe(moodScore('Steady'))
  })

  it('ranks triggers by frequency and excludes "none"', () => {
    const stats = triggerStats(checkIns, 30, NOW)
    expect(stats[0].id).toBe('mock')
    expect(stats.find((s) => s.id === 'none')).toBeUndefined()
  })

  it('computes bounce-back from a dip to recovery', () => {
    expect(bounceBack(checkIns, NOW)).toBe(2) // Drained day -5 -> Okay day -3
  })

  it('summarises the week', () => {
    const d = weeklyDigest(checkIns, NOW)
    expect(d.checkInDays).toBe(4)
    expect(d.topTrigger).toBeTruthy()
  })
})
