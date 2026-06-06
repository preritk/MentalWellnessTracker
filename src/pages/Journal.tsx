import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useStore, makeId, type JournalEntry } from '../lib/storage'
import { useT } from '../lib/i18n'
import { getPhase, type Phase } from '../lib/phase'
import {
  Card,
  SectionTitle,
  Button,
  Chip,
  EmptyState,
  cx,
  riseIn,
  stagger,
} from '../components/ui'

type Mode = 'guided' | 'free'

/**
 * Phase-aware reflection prompts. These are long-form, contextual English
 * content (not UI chrome), so they live here rather than in i18n.
 */
const PHASE_PROMPTS: Record<Phase, string[]> = {
  general: [
    'What went better than your anxious brain predicted today?',
    'If a junior felt exactly how you feel now, what would you honestly tell them?',
    'What is one small thing that is steady in your life right now?',
  ],
  prep: [
    'What went better than your anxious brain predicted?',
    'If a junior got this exact score, what would you honestly tell them?',
    'Which one topic, however small, feels a little less scary than last week?',
  ],
  'exam-week': [
    "Name the one paper that's done. What does the next-you need tonight?",
    'What is the smallest kind thing you can do for your body before tomorrow?',
    'What are you NOT going to re-read tonight, on purpose?',
  ],
  'result-wait': [
    'What parts of your life are true regardless of this rank?',
    'Who in your corner would still be in your corner, whatever the number says?',
    'What would you like to be doing a month from now, result aside?',
  ],
  'result-day': [
    'What parts of your life are true regardless of this rank?',
    'Whatever the number is — what do you most need to hear right now?',
    'What is one gentle thing the next 24 hours can hold?',
  ],
}

/** ISO yyyy-mm-dd, defaulting ~30 days out from `from` when no date is given. */
function defaultSealDate(from: number): string {
  const d = new Date(from + 30 * 24 * 60 * 60 * 1000)
  return d.toISOString().slice(0, 10)
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatSeal(iso: string): string {
  const t = Date.parse(iso)
  if (Number.isNaN(t)) return iso
  return formatDate(t)
}

export default function Journal() {
  const { t } = useT()
  const [store, update] = useStore()

  const phase = useMemo(() => getPhase(store.profile, Date.now()), [store.profile])
  const prompts = PHASE_PROMPTS[phase]

  const [mode, setMode] = useState<Mode>('guided')
  const [prompt, setPrompt] = useState<string>('')
  const [text, setText] = useState<string>('')
  const [status, setStatus] = useState<string>('')

  const [letter, setLetter] = useState<string>('')

  const entries = useMemo(
    () => [...store.journal].sort((a, b) => b.ts - a.ts),
    [store.journal],
  )

  function selectMode(next: Mode) {
    setMode(next)
    if (next === 'free') setPrompt('')
  }

  function keep() {
    const trimmed = text.trim()
    if (!trimmed) return
    const entry: JournalEntry = {
      id: makeId(),
      ts: Date.now(),
      prompt: mode === 'guided' ? prompt : '',
      text: trimmed,
      mood: undefined,
    }
    update((s) => ({ ...s, journal: [...s.journal, entry] }))
    setText('')
    setStatus(t('journal.saved'))
  }

  function burn() {
    // The "vent and burn" path: clear the editor, write NOTHING to the store.
    setText('')
    setStatus(t('journal.burned'))
  }

  function seal() {
    const trimmed = letter.trim()
    if (!trimmed) return
    const sealedUntil = store.profile.resultDate || defaultSealDate(Date.now())
    update((s) => ({
      ...s,
      selfLetter: { text: trimmed, sealedUntil, written: Date.now() },
    }))
    setLetter('')
  }

  const sealed = store.selfLetter

  return (
    <motion.div {...riseIn} className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <header>
        <SectionTitle as="h1" sub={t('journal.subtitle')}>
          {t('journal.title')}
        </SectionTitle>
      </header>

      <Card className="flex flex-col gap-4">
        {/* Mode toggle */}
        <div
          role="group"
          aria-label={t('journal.title')}
          className="flex flex-wrap gap-2"
        >
          <Chip active={mode === 'guided'} onClick={() => selectMode('guided')}>
            {t('journal.guided')}
          </Chip>
          <Chip active={mode === 'free'} onClick={() => selectMode('free')}>
            {t('journal.free')}
          </Chip>
        </div>

        {/* Guided prompts */}
        {mode === 'guided' && (
          <fieldset className="flex flex-col gap-2 border-0 p-0">
            <legend className="mb-1 text-sm text-[var(--ink-soft)]">
              {t('journal.guided')}
            </legend>
            <div className="flex flex-col gap-2">
              {prompts.map((p) => {
                const isActive = prompt === p
                return (
                  <button
                    key={p}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setPrompt(isActive ? '' : p)}
                    className={cx(
                      'rounded-2xl border px-4 py-3 text-left text-sm transition-colors duration-150',
                      isActive
                        ? 'border-transparent bg-[var(--color-brand-300)]/30 text-[var(--ink)]'
                        : 'border-[var(--hairline)] text-[var(--ink)] hover:bg-[var(--hairline)]',
                    )}
                  >
                    {p}
                  </button>
                )
              })}
            </div>
          </fieldset>
        )}

        {/* Editor */}
        <div className="flex flex-col gap-2">
          {mode === 'guided' && prompt && (
            <p className="text-sm font-medium text-[var(--ink)]">{prompt}</p>
          )}
          <label htmlFor="journal-editor" className="text-sm text-[var(--ink-soft)]">
            {t('journal.title')}
          </label>
          <textarea
            id="journal-editor"
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              if (status) setStatus('')
            }}
            placeholder={t('journal.placeholder')}
            rows={8}
            className={cx(
              'w-full resize-y rounded-2xl border border-[var(--hairline)] bg-[var(--surface)]/60 p-4',
              'text-[var(--ink)] placeholder:text-[var(--ink-soft)]',
              'focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-400)]',
            )}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" onClick={keep} disabled={!text.trim()}>
            {t('journal.keep')}
          </Button>
          <Button variant="ghost" onClick={burn} disabled={!text.trim()}>
            {t('journal.burn')}
          </Button>
        </div>

        <p aria-live="polite" className="min-h-[1.25rem] text-sm text-[var(--ink-soft)]">
          {status}
        </p>
      </Card>

      {/* Sealed letter */}
      <Card className="flex flex-col gap-4">
        <SectionTitle sub={t('journal.letterHint')}>
          {t('journal.letterTitle')}
        </SectionTitle>

        {sealed ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-[var(--hairline)] bg-[var(--color-brand-300)]/15 py-8 text-center">
            <span className="text-3xl" aria-hidden>
              ✉️
            </span>
            <p className="text-sm text-[var(--ink-soft)]">
              {t('journal.letterSeal')} · {formatSeal(sealed.sealedUntil)}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <label htmlFor="journal-letter" className="text-sm text-[var(--ink-soft)]">
              {t('journal.letterTitle')}
            </label>
            <textarea
              id="journal-letter"
              value={letter}
              onChange={(e) => setLetter(e.target.value)}
              placeholder={t('journal.letterPlaceholder')}
              rows={5}
              className={cx(
                'w-full resize-y rounded-2xl border border-[var(--hairline)] bg-[var(--surface)]/60 p-4',
                'text-[var(--ink)] placeholder:text-[var(--ink-soft)]',
                'focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-400)]',
              )}
            />
            <div>
              <Button variant="soft" onClick={seal} disabled={!letter.trim()}>
                {t('journal.letterSeal')}
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* History */}
      <section className="flex flex-col gap-3">
        <SectionTitle>{t('journal.history')}</SectionTitle>
        {entries.length === 0 ? (
          <Card>
            <EmptyState emoji="📖">{t('journal.subtitle')}</EmptyState>
          </Card>
        ) : (
          <motion.ul
            variants={stagger.container}
            initial="initial"
            animate="animate"
            className="flex list-none flex-col gap-3 p-0"
          >
            {entries.map((entry) => (
              <motion.li key={entry.id} variants={stagger.item}>
                <Card glass={false} className="flex flex-col gap-1.5">
                  <p className="text-xs font-medium text-[var(--ink-soft)]">
                    {formatDate(entry.ts)}
                  </p>
                  {entry.prompt && (
                    <p className="text-sm font-medium text-[var(--ink)]">{entry.prompt}</p>
                  )}
                  <p className="line-clamp-3 whitespace-pre-wrap text-sm text-[var(--ink-soft)]">
                    {entry.text}
                  </p>
                </Card>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </section>
    </motion.div>
  )
}
