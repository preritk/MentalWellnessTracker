import { motion } from 'framer-motion'
import { useT } from '../lib/i18n'
import { INTERVENTIONS } from '../lib/interventions'
import { Card, SectionTitle, stagger } from '../components/ui'
import BreathingExercise from '../components/BreathingExercise'

export default function Toolkit() {
  const { t, lang } = useT()

  return (
    <div className="flex flex-col gap-8">
      <SectionTitle as="h1" sub={t('toolkit.subtitle')}>
        {t('toolkit.title')}
      </SectionTitle>

      {/* Featured "Breathe with me" hero card. */}
      <Card className="flex flex-col items-center text-center">
        <SectionTitle as="h2" className="mb-1">
          {t('toolkit.breathe')}
        </SectionTitle>
        <BreathingExercise pattern="478" />
      </Card>

      {/* Responsive grid of micro-interventions. */}
      <motion.ul
        className="grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3"
        variants={stagger.container}
        initial="initial"
        animate="animate"
      >
        {INTERVENTIONS.map((item) => (
          <motion.li key={item.id} variants={stagger.item} className="h-full">
            <Card className="flex h-full flex-col gap-3" glass={false}>
              <span className="text-3xl" aria-hidden>
                {item.emoji}
              </span>
              <div className="flex flex-col gap-1">
                <h3
                  className="text-base font-semibold tracking-tight text-[var(--ink)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {item.title[lang]}
                </h3>
                <p className="text-sm text-[var(--ink-soft)]">{item.body[lang]}</p>
              </div>
              {item.durationMin > 0 && (
                <p className="mt-auto pt-2 text-xs font-medium text-[var(--color-brand-600)]">
                  {item.durationMin} {t('toolkit.minutes')}
                </p>
              )}
            </Card>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  )
}
