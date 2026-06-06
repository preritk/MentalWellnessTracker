import type { Language } from './storage'

export interface Trigger {
  id: string
  emoji: string
  label: Record<Language, string>
}

/** India-exam-specific stress trigger taxonomy (curated, not free text). */
export const TRIGGERS: Trigger[] = [
  { id: 'mock', emoji: '📝', label: { en: 'Mock test', hi: 'मॉक टेस्ट' } },
  { id: 'ranks', emoji: '📊', label: { en: 'Ranks / comparison', hi: 'रैंक / तुलना' } },
  { id: 'family', emoji: '👨‍👩‍👧', label: { en: 'Family pressure', hi: 'परिवार का दबाव' } },
  { id: 'sleep', emoji: '😴', label: { en: 'Sleep', hi: 'नींद' } },
  { id: 'syllabus', emoji: '📚', label: { en: 'Syllabus / backlog', hi: 'सिलेबस / बैकलॉग' } },
  { id: 'health', emoji: '🤕', label: { en: 'Health', hi: 'सेहत' } },
  { id: 'phone', emoji: '📱', label: { en: 'Phone / social media', hi: 'फ़ोन / सोशल मीडिया' } },
  { id: 'future', emoji: '🔮', label: { en: 'Fear of future', hi: 'भविष्य का डर' } },
  { id: 'self', emoji: '🪞', label: { en: 'Self-doubt', hi: 'आत्म-संदेह' } },
  { id: 'none', emoji: '🌫️', label: { en: 'Nothing specific', hi: 'कुछ खास नहीं' } },
]

const TRIGGER_MAP = new Map(TRIGGERS.map((t) => [t.id, t]))

export function getTrigger(id: string): Trigger | undefined {
  return TRIGGER_MAP.get(id)
}

export function triggerLabel(id: string, lang: Language): string {
  return TRIGGER_MAP.get(id)?.label[lang] ?? id
}

export function triggerEmoji(id: string): string {
  return TRIGGER_MAP.get(id)?.emoji ?? '•'
}
