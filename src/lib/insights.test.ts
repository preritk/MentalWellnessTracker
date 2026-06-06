import { describe, expect, it } from 'vitest'
import { moodSeries, triggerStats, bounceBack, weeklyDigest } from './insights'
import { moodScore, type CheckIn } from './storage'

const DAY = 24 * 60 * 60 * 1000
const NOW = Date.parse('2026-06-06T12:00:00')

function ci(partial: Partial<CheckIn> & { ts: number; mood: CheckIn['mood'] }): CheckIn {
  return {
    id: Math.random().toString(36).slice(2),
    triggers: [],
    intensity: 5,
    note: '',
    ...partial,
  }
}

describe('moodSeries', () => {
  it('fills gaps with null and converts mood to score', () => {
    const checkIns = [
      ci({ ts: NOW - 4 * DAY, mood: 'Steady' }),
      ci({ ts: NOW - 1 * DAY, mood: 'Bright' }),
    ]
    const series = moodSeries(checkIns, NOW, 5)
    expect(series).toHaveLength(5)
    // Today (last point) has no check-in -> null.
    expect(series[series.length - 1].score).toBeNull()
    // Yesterday had the Bright check-in.
    expect(series[series.length - 2].score).toBe(moodScore('Bright'))
    // At least one gap exists between the two recorded days.
    expect(series.some((p) => p.score === null)).toBe(true)
  })

  it('averages multiple check-ins on the same day', () => {
    const checkIns = [
      ci({ ts: NOW - 1 * DAY, mood: 'Low' }), // score 2
      ci({ ts: NOW - 1 * DAY, mood: 'Steady' }), // score 4
    ]
    const series = moodSeries(checkIns, NOW, 3)
    expect(series[series.length - 2].score).toBe(3)
  })
})

describe('triggerStats', () => {
  it('excludes "none" and sorts by count descending', () => {
    const checkIns = [
      ci({ ts: NOW - 1 * DAY, mood: 'Low', triggers: ['mock', 'ranks'], intensity: 8 }),
      ci({ ts: NOW - 2 * DAY, mood: 'Okay', triggers: ['mock'], intensity: 6 }),
      ci({ ts: NOW - 3 * DAY, mood: 'Okay', triggers: ['ranks', 'none'], intensity: 4 }),
    ]
    const stats = triggerStats(checkIns, 30, NOW)
    expect(stats.find((s) => s.id === 'none')).toBeUndefined()
    expect(stats[0].id).toBe('mock')
    expect(stats[0].count).toBe(2)
    // Sorted descending by count.
    for (let i = 1; i < stats.length; i++) {
      expect(stats[i - 1].count).toBeGreaterThanOrEqual(stats[i].count)
    }
  })
})

describe('bounceBack', () => {
  it('returns null when there is no dip -> recovery cycle', () => {
    const checkIns = [
      ci({ ts: NOW - 3 * DAY, mood: 'Okay' }),
      ci({ ts: NOW - 2 * DAY, mood: 'Steady' }),
      ci({ ts: NOW - 1 * DAY, mood: 'Bright' }),
    ]
    expect(bounceBack(checkIns, NOW)).toBeNull()
  })

  it('returns the number of days from a dip to recovery', () => {
    const checkIns = [
      ci({ ts: NOW - 5 * DAY, mood: 'Drained' }), // dip
      ci({ ts: NOW - 3 * DAY, mood: 'Okay' }), // recovery 2 days later
    ]
    expect(bounceBack(checkIns, NOW)).toBe(2)
  })
})

describe('weeklyDigest', () => {
  it('reports trend "new" with no check-ins at all', () => {
    const d = weeklyDigest([], NOW)
    expect(d.trend).toBe('new')
    expect(d.checkInDays).toBe(0)
    expect(d.avgScore).toBeNull()
  })

  it('counts distinct check-in days within the week', () => {
    const checkIns = [
      ci({ ts: NOW - 1 * DAY, mood: 'Okay' }),
      ci({ ts: NOW - 2 * DAY, mood: 'Steady' }),
      ci({ ts: NOW - 2 * DAY, mood: 'Bright' }), // same day as above
    ]
    const d = weeklyDigest(checkIns, NOW)
    expect(d.checkInDays).toBe(2)
  })

  it('reports a trend when a prior week exists', () => {
    const checkIns = [
      // last week, low
      ci({ ts: NOW - 10 * DAY, mood: 'Low' }),
      // this week, bright
      ci({ ts: NOW - 1 * DAY, mood: 'Bright' }),
    ]
    const d = weeklyDigest(checkIns, NOW)
    expect(d.trend).toBe('up')
  })
})
