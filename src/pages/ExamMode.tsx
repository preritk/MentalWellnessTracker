import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import BreathingExercise from '../components/BreathingExercise'
import { Card, SectionTitle, riseIn } from '../components/ui'
import { useT } from '../lib/i18n'

/**
 * Exam Mode — a deliberately stripped, low-arousal surface for exam week.
 * No ranks, no analysis, no charts. Just an anchor, a breath, and rest.
 */
export default function ExamMode() {
  const { t } = useT()

  return (
    <div className="ambient-bg min-h-screen w-full">
      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-10 sm:px-6 sm:py-14">
        <SectionTitle as="h1" sub={t('exam.subtitle')}>
          {t('exam.title')}
        </SectionTitle>

        <motion.div {...riseIn}>
          <Card className="text-center">
            <p
              className="text-xl leading-relaxed text-[var(--ink)] sm:text-2xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('exam.anchor')}
            </p>
          </Card>
        </motion.div>

        <motion.div {...riseIn} transition={{ ...riseIn.transition, delay: 0.05 }}>
          <Card>
            <BreathingExercise pattern="478" />
          </Card>
        </motion.div>

        <motion.div
          {...riseIn}
          transition={{ ...riseIn.transition, delay: 0.1 }}
          className="grid gap-4 sm:grid-cols-2"
        >
          <Card className="flex items-center">
            <p className="text-sm font-semibold text-[var(--ink)]">{t('exam.between')}</p>
          </Card>
          <Card className="flex items-center">
            <p className="text-sm text-[var(--ink-soft)]">{t('exam.tonight')}</p>
          </Card>
        </motion.div>

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
