import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HELPLINES } from '../components/CrisisModal'
import { Button, Card, SectionTitle, riseIn } from '../components/ui'
import { useT } from '../lib/i18n'
import { useStore } from '../lib/storage'

/**
 * Result Mode — the most carefully designed, protective surface.
 * Before reveal: reassurance, the sealed letter, a regardless-truth reflection.
 * After reveal: gentle support, the next 24 hours, and always-visible human help.
 */
export default function ResultMode() {
  const { t } = useT()
  const [store] = useStore()
  const [revealed, setRevealed] = useState(false)
  const [letterOpen, setLetterOpen] = useState(false)

  const letter = store.selfLetter

  return (
    <div className="ambient-bg min-h-screen w-full">
      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-10 sm:px-6 sm:py-14">
        <SectionTitle as="h1">{t('result.title')}</SectionTitle>

        <AnimatePresence initial={false}>
          {!revealed ? (
            <motion.div
              key="before"
              className="flex flex-col gap-5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={riseIn.transition}
            >
              <Card className="text-center">
                <p className="text-lg leading-relaxed text-[var(--ink)] sm:text-xl">
                  {t('result.before')}
                </p>
              </Card>

              {letter && (
                <Card>
                  {!letterOpen ? (
                    <Button variant="soft" onClick={() => setLetterOpen(true)}>
                      {t('result.letter')}
                    </Button>
                  ) : (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--ink)]"
                    >
                      {letter.text}
                    </motion.p>
                  )}
                </Card>
              )}

              <Card>
                <p className="text-sm font-semibold text-[var(--ink)]">{t('result.truth')}</p>
              </Card>

              <Button onClick={() => setRevealed(true)}>{t('result.reveal')}</Button>
            </motion.div>
          ) : (
            <motion.div
              key="support"
              className="flex flex-col gap-5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={riseIn.transition}
            >
              <Card className="text-center">
                <p className="text-lg leading-relaxed text-[var(--ink)] sm:text-xl">
                  {t('result.celebrate')}
                </p>
              </Card>

              <Card>
                <p className="text-sm font-semibold text-[var(--ink)]">{t('result.next24')}</p>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-[var(--ink-soft)]">
                  <li>{t('exam.tonight')}</li>
                  <li>{t('toolkit.breathe')}</li>
                  <li>{t('result.truth')}</li>
                </ul>
              </Card>

              <Card>
                <p className="text-sm font-semibold text-[var(--ink)]">{t('crisis.title')}</p>
                <p className="mt-1 text-sm text-[var(--ink-soft)]">{t('crisis.body')}</p>
                <ul className="mt-4 space-y-2">
                  {HELPLINES.map((h) => (
                    <li
                      key={h.number}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--hairline)] p-3"
                    >
                      <div>
                        <p className="font-semibold text-[var(--ink)]">{h.name}</p>
                        <p className="text-xs text-[var(--ink-soft)]">{h.note}</p>
                      </div>
                      <a
                        href={`tel:${h.number}`}
                        aria-label={`Call ${h.name} at ${h.number}`}
                        className="shrink-0 rounded-2xl bg-[var(--color-brand-600)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-brand-500)]"
                      >
                        {t('crisis.call')} {h.number}
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-[var(--ink-soft)]">{t('crisis.disclaimer')}</p>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-auto pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold text-[var(--ink)] transition-colors duration-150 hover:bg-[var(--hairline)]"
          >
            <span aria-hidden>←</span> {t('common.back')}
          </Link>
        </div>
      </div>
    </div>
  )
}
