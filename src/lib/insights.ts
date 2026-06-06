import { type CheckIn, type Mood, moodScore } from './storage'

const DAY = 24 * 60 * 60 * 1000

function dayKey(ts: number): string {
  const d = new Date(ts)
  d.setHours(0, 0, 0, 0)
  return d.toISOString().slice(0, 10)
}

export interface MoodPoint {
  day: string // yyyy-mm-dd
  label: string // e.g. '12 Jun'
  score: number | null // 1..5, averaged per day; null = no check-in
  mood?: Mood
}

/**
 * Build a continuous daily mood series for the last `days` days (default 21),
 * filling gaps with null so the "river" chart shows honest discontinuities.
 */
export function moodSeries(checkIns: CheckIn[], now: number, days = 21): MoodPoint[] {
  const byDay = new Map<string, number[]>()
  for (const c of checkIns) {
    const k = dayKey(c.ts)
    const arr = byDay.get(k) ?? []
    arr.push(moodScore(c.mood))
    byDay.set(k, arr)
  }

  const out: MoodPoint[] = []
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)
  start.setTime(start.getTime() - (days - 1) * DAY)

  for (let i = 0; i < days; i++) {
    const d = new Date(start.getTime() + i * DAY)
    const k = d.toISOString().slice(0, 10)
    const scores = byDay.get(k)
    const score = scores && scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null
    out.push({
      day: k,
      label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      score: score === null ? null : Math.round(score * 10) / 10,
    })
  }
  return out
}

export interface TriggerStat {
  id: string
  count: number
  /** Average intensity of check-ins carrying this trigger (1..10). */
  avgIntensity: number
}

/** Frequency + intensity of each trigger across the window — feeds the trigger map. */
export function triggerStats(checkIns: CheckIn[], sinceDays = 30, now = Date.now()): TriggerStat[] {
  const cutoff = now - sinceDays * DAY
  const counts = new Map<string, { count: number; intensitySum: number }>()
  for (const c of checkIns) {
    if (c.ts < cutoff) continue
    for (const t of c.triggers) {
      if (t === 'none') continue
      const cur = counts.get(t) ?? { count: 0, intensitySum: 0 }
      cur.count += 1
      cur.intensitySum += c.intensity
      counts.set(t, cur)
    }
  }
  return [...counts.entries()]
    .map(([id, v]) => ({
      id,
      count: v.count,
      avgIntensity: Math.round((v.intensitySum / v.count) * 10) / 10,
    }))
    .sort((a, b) => b.count - a.count)
}

export interface WeeklyDigest {
  checkInDays: number
  avgScore: number | null
  topTrigger: string | null
  /** Recovery: days from a Drained/Low dip back to Okay+ (lower is more resilient). */
  bounceBackDays: number | null
  trend: 'up' | 'down' | 'flat' | 'new'
}

/** A gentle, coping-focused weekly summary (never a score to maximise). */
export function weeklyDigest(checkIns: CheckIn[], now = Date.now()): WeeklyDigest {
  const weekAgo = now - 7 * DAY
  const prevWeek = now - 14 * DAY
  const thisWeek = checkIns.filter((c) => c.ts >= weekAgo)
  const lastWeek = checkIns.filter((c) => c.ts >= prevWeek && c.ts < weekAgo)

  const distinctDays = new Set(thisWeek.map((c) => dayKey(c.ts))).size

  const avg = (arr: CheckIn[]) =>
    arr.length ? arr.reduce((s, c) => s + moodScore(c.mood), 0) / arr.length : null
  const thisAvg = avg(thisWeek)
  const lastAvg = avg(lastWeek)

  let trend: WeeklyDigest['trend'] = 'new'
  if (thisAvg !== null && lastAvg !== null) {
    const diff = thisAvg - lastAvg
    trend = diff > 0.3 ? 'up' : diff < -0.3 ? 'down' : 'flat'
  } else if (thisAvg !== null) {
    trend = 'flat'
  }

  // Top trigger this week.
  const stats = triggerStats(thisWeek, 7, now)
  const topTrigger = stats.length ? stats[0].id : null

  return {
    checkInDays: distinctDays,
    avgScore: thisAvg === null ? null : Math.round(thisAvg * 10) / 10,
    topTrigger,
    bounceBackDays: bounceBack(checkIns, now),
    trend,
  }
}

/**
 * Average days to recover from a dip (mood <= Low, score <=2) back to Okay+ (>=3),
 * over the last 30 days. Returns null if no completed dip→recovery cycle.
 */
export function bounceBack(checkIns: CheckIn[], now = Date.now()): number | null {
  const cutoff = now - 30 * DAY
  const sorted = [...checkIns].filter((c) => c.ts >= cutoff).sort((a, b) => a.ts - b.ts)
  const recoveries: number[] = []
  let dipTs: number | null = null
  for (const c of sorted) {
    const s = moodScore(c.mood)
    if (s <= 2 && dipTs === null) {
      dipTs = c.ts
    } else if (s >= 3 && dipTs !== null) {
      recoveries.push((c.ts - dipTs) / DAY)
      dipTs = null
    }
  }
  if (!recoveries.length) return null
  const avg = recoveries.reduce((a, b) => a + b, 0) / recoveries.length
  return Math.round(avg * 10) / 10
}
