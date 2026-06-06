import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore, type ExamType } from '../lib/storage'
import { useT } from '../lib/i18n'
import { Button, Card, Chip, SectionTitle, cx, riseIn, stagger } from '../components/ui'

const EXAMS: ExamType[] = ['NEET', 'JEE', 'CUET', 'UPSC', 'BOARDS', 'OTHER']

const TRUST_POINTS: { emoji: string; key: string }[] = [
  { emoji: '🔒', key: 'onb.isnt.private' },
  { emoji: '👀', key: 'onb.isnt.notParent' },
  { emoji: '🤝', key: 'onb.isnt.notTherapy' },
]

/** Onboarding page — collects name, exam type, and key dates, then marks the profile onboarded. */
export default function Onboarding() {
  const { t } = useT()
  const [, update] = useStore()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [exam, setExam] = useState<ExamType>('NEET')
  const [examDate, setExamDate] = useState('')
  const [resultDate, setResultDate] = useState('')

  const canFinish = name.trim().length > 0

  function finish() {
    if (!canFinish) return
    update((s) => ({
      ...s,
      profile: {
        ...s.profile,
        name: name.trim(),
        exam,
        examDate: examDate || null,
        resultDate: resultDate || null,
        onboarded: true,
      },
    }))
    navigate('/')
  }

  const inputClass =
    'w-full rounded-2xl border border-[var(--hairline)] bg-[var(--surface)] px-4 py-2.5 ' +
    'text-sm text-[var(--ink)] outline-none transition-colors ' +
    'focus:border-[var(--color-brand-500)] focus:ring-2 focus:ring-[var(--color-brand-300)]/40'

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10 sm:py-16">
      <motion.div
        className="w-full max-w-xl flex flex-col gap-5"
        variants={stagger.container}
        initial="initial"
        animate="animate"
      >
        {/* 1. Brand + welcome */}
        <motion.div variants={stagger.item} className="text-center">
          <div className="text-4xl" aria-hidden>
            🌿
          </div>
          <p
            className="mt-2 text-lg font-semibold text-[var(--color-brand-600)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('app.name')}
          </p>
          <p className="text-sm text-[var(--ink-soft)]">{t('app.tagline')}</p>
        </motion.div>

        <Card variants={stagger.item}>
          <SectionTitle as="h1" sub={t('onb.intro')}>
            {t('onb.welcome')}
          </SectionTitle>

          <div className="mt-4 flex flex-col gap-5">
            {/* 2. Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="onb-name" className="text-sm font-medium text-[var(--ink)]">
                {t('onb.name')}
              </label>
              <input
                id="onb-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('onb.namePlaceholder')}
                autoComplete="off"
                className={inputClass}
              />
            </div>

            {/* 3. Exam */}
            <div className="flex flex-col gap-2">
              <span id="onb-exam-label" className="text-sm font-medium text-[var(--ink)]">
                {t('onb.exam')}
              </span>
              <div
                role="radiogroup"
                aria-labelledby="onb-exam-label"
                className="flex flex-wrap gap-2"
              >
                {EXAMS.map((value) => {
                  const active = exam === value
                  return (
                    <Chip
                      key={value}
                      role="radio"
                      aria-checked={active}
                      active={active}
                      onClick={() => setExam(value)}
                    >
                      {value}
                    </Chip>
                  )
                })}
              </div>
            </div>

            {/* 4. Dates */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="onb-exam-date" className="text-sm font-medium text-[var(--ink)]">
                  {t('onb.examDate')}
                </label>
                <input
                  id="onb-exam-date"
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="onb-result-date" className="text-sm font-medium text-[var(--ink)]">
                  {t('onb.resultDate')}
                </label>
                <input
                  id="onb-result-date"
                  type="date"
                  value={resultDate}
                  onChange={(e) => setResultDate(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* 5. Trust card */}
        <Card variants={stagger.item}>
          <SectionTitle as="h2">{t('onb.isnt')}</SectionTitle>
          <ul className="mt-2 flex flex-col gap-3">
            {TRUST_POINTS.map(({ emoji, key }) => (
              <li key={key} className="flex items-start gap-3">
                <span className="text-lg leading-6" aria-hidden>
                  {emoji}
                </span>
                <span className="text-sm text-[var(--ink-soft)]">{t(key)}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* 6. Finish */}
        <motion.div variants={stagger.item} {...riseIn} className="flex justify-end">
          <Button
            type="button"
            variant="primary"
            disabled={!canFinish}
            onClick={finish}
            className={cx('w-full sm:w-auto')}
          >
            {t('onb.finish')}
          </Button>
        </motion.div>
      </motion.div>
    </main>
  )
}
