// Demo seed data: a realistic 21-day check-in/journal arc for the sample dataset.
import { type CheckIn, type JournalEntry, type Mood, type Store, makeId } from './storage'

const DAY = 24 * 60 * 60 * 1000

// A believable 21-day arc: generally Okay/Steady, with reliable dips the evening
// after a mock test (days 4, 11, 18) — so the trigger map + bounce-back look real.
const MOOD_BY_DAY: { mood: Mood; triggers: string[]; intensity: number; note: string }[] = [
  { mood: 'Steady', triggers: ['syllabus'], intensity: 4, note: 'Good revision day.' },
  { mood: 'Okay', triggers: ['sleep'], intensity: 5, note: '' },
  { mood: 'Steady', triggers: [], intensity: 3, note: '' },
  { mood: 'Okay', triggers: ['syllabus'], intensity: 5, note: 'Physics felt heavy.' },
  { mood: 'Drained', triggers: ['mock', 'ranks'], intensity: 8, note: 'Mock went badly.' },
  { mood: 'Low', triggers: ['ranks', 'self'], intensity: 7, note: 'Comparing again.' },
  { mood: 'Okay', triggers: [], intensity: 4, note: 'A bit better today.' },
  { mood: 'Steady', triggers: ['syllabus'], intensity: 3, note: '' },
  { mood: 'Steady', triggers: [], intensity: 3, note: '' },
  { mood: 'Bright', triggers: [], intensity: 2, note: 'Felt in control.' },
  { mood: 'Okay', triggers: ['family'], intensity: 5, note: 'Parents asked about ranks.' },
  { mood: 'Drained', triggers: ['mock'], intensity: 8, note: 'Second mock, same panic.' },
  { mood: 'Low', triggers: ['self', 'future'], intensity: 7, note: '' },
  { mood: 'Okay', triggers: ['sleep'], intensity: 5, note: 'Slept late, scrolled.' },
  { mood: 'Steady', triggers: [], intensity: 4, note: '' },
  { mood: 'Steady', triggers: ['syllabus'], intensity: 4, note: 'Back on track.' },
  { mood: 'Bright', triggers: [], intensity: 2, note: '' },
  { mood: 'Okay', triggers: ['phone'], intensity: 5, note: '' },
  {
    mood: 'Low',
    triggers: ['mock', 'ranks'],
    intensity: 6,
    note: 'Mock dip — but smaller this time.',
  },
  { mood: 'Okay', triggers: ['self'], intensity: 4, note: 'Bounced back next day.' },
  { mood: 'Steady', triggers: [], intensity: 3, note: 'Calmer.' },
]

const SEED_JOURNAL: { dayOffset: number; prompt: string; text: string; mood: Mood }[] = [
  {
    dayOffset: 16,
    prompt: 'If a junior got this exact score, what would you honestly tell them?',
    text: 'I’d tell them one mock doesn’t decide anything, and they have months left. Funny how I can’t say that to myself.',
    mood: 'Drained',
  },
  {
    dayOffset: 8,
    prompt: 'What went better than your anxious brain predicted?',
    text: 'I actually finished the organic chemistry set I was dreading. My brain said I’d freeze. I didn’t.',
    mood: 'Steady',
  },
  {
    dayOffset: 2,
    prompt: '',
    text: 'Smaller dip after this mock. Maybe the patterns thing is right — I do recover faster now.',
    mood: 'Okay',
  },
]

/** Build seeded check-ins + journal relative to `now`, one check-in per evening. */
export function buildSeed(now: number): { checkIns: CheckIn[]; journal: JournalEntry[] } {
  const n = MOOD_BY_DAY.length
  const checkIns: CheckIn[] = MOOD_BY_DAY.map((d, i) => {
    const dayOffset = n - 1 - i // oldest first
    const ts = atEvening(now - dayOffset * DAY)
    return {
      id: makeId(),
      ts,
      mood: d.mood,
      triggers: d.triggers,
      intensity: d.intensity,
      note: d.note,
    }
  })

  const journal: JournalEntry[] = SEED_JOURNAL.map((j) => ({
    id: makeId(),
    ts: atEvening(now - j.dayOffset * DAY) + 60 * 60 * 1000,
    prompt: j.prompt,
    text: j.text,
    mood: j.mood,
  }))

  return { checkIns, journal }
}

function atEvening(ts: number): number {
  const d = new Date(ts)
  d.setHours(20, 30, 0, 0)
  return d.getTime()
}

/** Apply seed data to a store (idempotent-ish: replaces existing logs). */
export function applySeed(store: Store, now: number): Store {
  const { checkIns, journal } = buildSeed(now)
  return {
    ...store,
    checkIns,
    journal,
    settings: { ...store.settings, seeded: true },
  }
}

/** Remove seeded data. */
export function clearSeed(store: Store): Store {
  return {
    ...store,
    checkIns: [],
    journal: [],
    settings: { ...store.settings, seeded: false },
  }
}
