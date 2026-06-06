// App-wide data model, session-scoped persistence, and the React store hook.
import { useCallback, useEffect, useState } from 'react'

// ---------------------------------------------------------------------------
// Types — the shared data contract for the whole app
// ---------------------------------------------------------------------------

/** A self-reported mood, from worst ('Drained') to best ('Bright'). */
export type Mood = 'Drained' | 'Low' | 'Okay' | 'Steady' | 'Bright'

/** Ordered worst -> best. Used for trends and bounce-back math. */
export const MOOD_ORDER: Mood[] = ['Drained', 'Low', 'Okay', 'Steady', 'Bright']

/** Numeric value (1..5) for a mood, for charting. */
export function moodScore(m: Mood): number {
  return MOOD_ORDER.indexOf(m) + 1
}

/** Supported exam track the student is preparing for. */
export type ExamType = 'NEET' | 'JEE' | 'CUET' | 'UPSC' | 'BOARDS' | 'OTHER'
/** UI/content language: English or Hindi. */
export type Language = 'en' | 'hi'

/** A single mood check-in logged by the student. */
export interface CheckIn {
  id: string
  ts: number // epoch ms
  mood: Mood
  triggers: string[] // trigger ids from triggers.ts
  intensity: number // 1..10
  note: string
}

/** A saved journal entry (guided prompt or free-write). */
export interface JournalEntry {
  id: string
  ts: number
  prompt: string // the prompt used, or '' for free-write
  text: string
  mood?: Mood
}

/** A thumbs up/down on a suggested intervention. */
export interface Feedback {
  id: string
  ts: number
  interventionId: string
  helpful: boolean
}

/** The student's identity, exam context, and preferences. */
export interface Profile {
  name: string
  exam: ExamType
  examDate: string | null // ISO yyyy-mm-dd
  resultDate: string | null
  language: Language
  checkInTime: string // 'HH:mm'
  onboarded: boolean
}

/** A letter written to one's future self, sealed until a result date. */
export interface SelfLetter {
  text: string
  sealedUntil: string // ISO yyyy-mm-dd
  written: number // epoch ms
}

/** App-level toggles for sharing, demo data, and accessibility. */
export interface Settings {
  sharing: boolean // share encouragement signals (default off)
  seeded: boolean
  darkMode: boolean
  reducedMotion: boolean
}

/** The complete persisted application state. */
export interface Store {
  version: number
  profile: Profile
  checkIns: CheckIn[]
  journal: JournalEntry[]
  feedback: Feedback[]
  selfLetter: SelfLetter | null
  settings: Settings
}

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------

/** sessionStorage key under which the serialized store lives. */
export const STORAGE_KEY = 'mindmitra.v1'
const SCHEMA_VERSION = 1

/**
 * We use sessionStorage (not localStorage) on purpose: everything the student
 * writes is wiped the moment the tab/session closes. On a shared or family
 * computer, nothing lingers for the next person — privacy by default.
 */
const backing: Storage | undefined =
  typeof window !== 'undefined' ? window.sessionStorage : undefined

/** A fresh, empty store at the current schema version. */
export function defaultStore(): Store {
  return {
    version: SCHEMA_VERSION,
    profile: {
      name: '',
      exam: 'NEET',
      examDate: null,
      resultDate: null,
      language: 'en',
      checkInTime: '20:00',
      onboarded: false,
    },
    checkIns: [],
    journal: [],
    feedback: [],
    selfLetter: null,
    settings: { sharing: false, seeded: false, darkMode: false, reducedMotion: false },
  }
}

/** Generate an id without relying on Date.now/Math.random being banned in app runtime. */
export function makeId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.floor(Math.random() * 1e9).toString(36)}`
}

/** Load and migrate the store from sessionStorage, falling back to defaults on any error or version mismatch. */
export function loadStore(): Store {
  try {
    const raw = backing?.getItem(STORAGE_KEY) ?? null
    if (!raw) return defaultStore()
    const parsed = JSON.parse(raw) as Partial<Store>
    // Version guard: unknown/old schema -> start clean rather than crash.
    if (!parsed || parsed.version !== SCHEMA_VERSION) {
      return { ...defaultStore() }
    }
    // Merge over defaults so newly added fields are always present.
    const base = defaultStore()
    return {
      ...base,
      ...parsed,
      profile: { ...base.profile, ...parsed.profile },
      settings: { ...base.settings, ...parsed.settings },
      checkIns: parsed.checkIns ?? [],
      journal: parsed.journal ?? [],
      feedback: parsed.feedback ?? [],
      selfLetter: parsed.selfLetter ?? null,
    }
  } catch {
    return defaultStore()
  }
}

/** Persist the store to sessionStorage; fails silently if storage is unavailable. */
export function saveStore(store: Store): void {
  try {
    backing?.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    // Storage full / blocked (private mode). Fail soft — the app stays usable in-session.
  }
}

/** Remove the persisted store from sessionStorage. */
export function clearStore(): void {
  try {
    backing?.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

// ---------------------------------------------------------------------------
// React hook — single source of truth, synced to localStorage + across tabs
// ---------------------------------------------------------------------------

const listeners = new Set<(s: Store) => void>()
let current: Store | null = null

function getCurrent(): Store {
  if (current === null) current = loadStore()
  return current
}

function setStoreInternal(next: Store) {
  current = next
  saveStore(next)
  listeners.forEach((l) => l(next))
}

/**
 * useStore — read the store and get a typed updater.
 * The updater accepts a partial patch or a function of the previous store.
 */
export function useStore(): [Store, (patch: Partial<Store> | ((prev: Store) => Store)) => void] {
  const [state, setState] = useState<Store>(getCurrent)

  useEffect(() => {
    const listener = (s: Store) => setState(s)
    listeners.add(listener)
    // Sync if another hook instance changed it before we mounted.
    // (sessionStorage is per-tab, so no cross-tab 'storage' event is needed.)
    setState(getCurrent())
    return () => {
      listeners.delete(listener)
    }
  }, [])

  const update = useCallback((patch: Partial<Store> | ((prev: Store) => Store)) => {
    const prev = getCurrent()
    const next = typeof patch === 'function' ? patch(prev) : { ...prev, ...patch }
    setStoreInternal(next)
  }, [])

  return [state, update]
}

/** Reset the in-memory cache (used by tests). */
export function __resetStoreCache(): void {
  current = null
  listeners.clear()
}
