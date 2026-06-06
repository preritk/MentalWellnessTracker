// Micro-intervention library and the transparent rules engine that selects one.
import type { Language, Mood } from './storage'
import type { Phase } from './phase'

/** Category of coping micro-intervention. */
export type InterventionKind =
  | 'breathing'
  | 'reframe'
  | 'activation'
  | 'sleep'
  | 'compassion'
  | 'grounding'
  | 'rest'
  | 'human'

/** A single suggestible coping action with localized copy. */
export interface Intervention {
  id: string
  kind: InterventionKind
  emoji: string
  durationMin: number
  title: Record<Language, string>
  body: Record<Language, string>
  /** Optional CTA route or action key (e.g. '/toolkit#breathe'). */
  action?: string
}

/** Clinician-approved-style micro-intervention library (rules pick from this). */
export const INTERVENTIONS: Intervention[] = [
  {
    id: 'breathe-478',
    kind: 'breathing',
    emoji: '🫧',
    durationMin: 2,
    title: { en: 'One slow breath cycle', hi: 'एक धीमी साँस का चक्र' },
    body: {
      en: 'Let’s do 4-7-8 breathing together for two minutes. It tells your body the danger isn’t real.',
      hi: 'दो मिनट के लिए साथ में 4-7-8 साँस लें। यह शरीर को बताता है कि ख़तरा असली नहीं है।',
    },
    action: '/toolkit',
  },
  {
    id: 'ground-54321',
    kind: 'grounding',
    emoji: '🌳',
    durationMin: 1,
    title: { en: '60-second grounding', hi: '60 सेकंड की ग्राउंडिंग' },
    body: {
      en: 'Name 5 things you can see, 4 you can touch, 3 you can hear. Come back to right now.',
      hi: '5 चीज़ें देखें, 4 छूएँ, 3 सुनें। अभी इस पल में लौट आएँ।',
    },
  },
  {
    id: 'reframe-mock',
    kind: 'reframe',
    emoji: '🔁',
    durationMin: 4,
    title: { en: 'One bad mock isn’t your rank', hi: 'एक ख़राब मॉक आपकी रैंक नहीं है' },
    body: {
      en: 'If a junior got this exact score, what would you honestly tell them? Write that to yourself.',
      hi: 'अगर किसी जूनियर के यही अंक होते, तो आप उसे क्या कहते? वही ख़ुद से कहें।',
    },
    action: '/journal',
  },
  {
    id: 'compassion-friend',
    kind: 'compassion',
    emoji: '🤍',
    durationMin: 3,
    title: { en: 'Talk to yourself like a friend', hi: 'ख़ुद से एक दोस्त की तरह बात करें' },
    body: {
      en: 'The harsh voice isn’t the truth. Put one kinder sentence in its place.',
      hi: 'कठोर आवाज़ सच नहीं है। उसकी जगह एक नरम वाक्य रखें।',
    },
    action: '/journal',
  },
  {
    id: 'activation-walk',
    kind: 'activation',
    emoji: '🚶',
    durationMin: 10,
    title: { en: 'One 10-minute reset walk', hi: '10 मिनट की रीसेट वॉक' },
    body: {
      en: 'A short walk, no phone. Movement shifts a stuck mood faster than willpower.',
      hi: 'बिना फ़ोन एक छोटी वॉक। हलचल अटके मूड को इच्छाशक्ति से जल्दी बदलती है।',
    },
  },
  {
    id: 'sleep-winddown',
    kind: 'sleep',
    emoji: '🌙',
    durationMin: 5,
    title: { en: 'Wind down for sleep', hi: 'नींद के लिए शांत हों' },
    body: {
      en: 'Your body has done the work. Dim the screen, slow the breath — tonight’s only job is rest.',
      hi: 'आपके शरीर ने काम कर लिया है। स्क्रीन मंद करें, साँस धीमी करें — आज रात का काम बस आराम है।',
    },
  },
  {
    id: 'rest-permission',
    kind: 'rest',
    emoji: '🛌',
    durationMin: 1,
    title: { en: 'This can wait till morning', hi: 'यह सुबह तक रुक सकता है' },
    body: {
      en: 'You’re running on empty. No task right now — get to bed. Tomorrow-you will thank you.',
      hi: 'आप पूरी तरह थके हैं। अभी कोई काम नहीं — सो जाइए। कल वाला आप शुक्रिया कहेगा।',
    },
  },
  {
    id: 'exam-anchor',
    kind: 'grounding',
    emoji: '⚓',
    durationMin: 1,
    title: { en: 'You’ve prepared. Just show up.', hi: 'आपने तैयारी की है। बस पहुँच जाइए।' },
    body: {
      en: 'One paper at a time. The last one is done — it’s done. This breath is the only thing to do now.',
      hi: 'एक बार में एक पेपर। पिछला हो गया — हो गया। अभी बस यह साँस लेनी है।',
    },
  },
  {
    id: 'human-help',
    kind: 'human',
    emoji: '🤝',
    durationMin: 0,
    title: { en: 'Talk to a real person', hi: 'किसी असली इंसान से बात करें' },
    body: {
      en: 'This feels heavy. You deserve support from a person, not an app. Help is one tap away.',
      hi: 'यह भारी लग रहा है। आपको ऐप नहीं, इंसान का साथ चाहिए। मदद बस एक टैप दूर है।',
    },
    action: 'crisis',
  },
]

const BY_ID = new Map(INTERVENTIONS.map((i) => [i.id, i]))
/** Look up an intervention by id, or undefined if unknown. */
export function getIntervention(id: string): Intervention | undefined {
  return BY_ID.get(id)
}

/** Inputs the rules engine weighs when choosing an intervention. */
export interface PickContext {
  mood: Mood
  triggers: string[]
  intensity: number // 1..10
  phase: Phase
  hour: number // 0..23, local
}

/**
 * Capacity-aware, phase-aware rules engine. Transparent (no ML) by design — the
 * safer, auditable choice for a wellbeing tool. Returns the single best-fit
 * micro-intervention for *right now*.
 */
export function pickIntervention(ctx: PickContext): Intervention {
  const { mood, triggers, intensity, phase, hour } = ctx
  const lateNight = hour >= 23 || hour < 5
  const drained = mood === 'Drained'
  const low = mood === 'Low'

  // 1. Severe distress signal -> route to a human, always wins.
  if (intensity >= 9 && (drained || low)) {
    return BY_ID.get('human-help')!
  }

  // 2. Exam week: keep it minimal and grounding, never analysis.
  if (phase === 'exam-week') {
    if (lateNight || triggers.includes('sleep')) return BY_ID.get('sleep-winddown')!
    return BY_ID.get('exam-anchor')!
  }

  // 3. Capacity-aware: drained + late -> permission to rest, not a 15-min task.
  if (drained && lateNight) return BY_ID.get('rest-permission')!
  if (triggers.includes('sleep') && lateNight) return BY_ID.get('sleep-winddown')!

  // 4. Result phases: protect, soften, self-compassion.
  if (phase === 'result-day' || phase === 'result-wait') {
    if (intensity >= 7) return BY_ID.get('compassion-friend')!
    return BY_ID.get('ground-54321')!
  }

  // 5. Trigger-specific reframes (prep).
  if (triggers.includes('mock') || triggers.includes('ranks')) {
    return BY_ID.get('reframe-mock')!
  }
  if (triggers.includes('self') || triggers.includes('future')) {
    return BY_ID.get('compassion-friend')!
  }

  // 6. Acute spike when otherwise okay -> breathe / ground.
  if (intensity >= 7) return BY_ID.get('breathe-478')!

  // 7. Low-energy but able -> behavioral activation.
  if (drained || low) return BY_ID.get('activation-walk')!

  // 8. Steady/Bright default -> a light grounding to bank the calm.
  return BY_ID.get('ground-54321')!
}
