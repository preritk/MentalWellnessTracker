import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore, makeId, type CheckIn, type Mood } from '../lib/storage'
import { useT } from '../lib/i18n'
import { getPhase } from '../lib/phase'
import { pickIntervention } from '../lib/interventions'
import { weeklyDigest } from '../lib/insights'
import { useCrisis } from '../components/Layout'
import MoodPicker from '../components/MoodPicker'
import { Button, Card, EmptyState, SectionTitle, stagger } from '../components/ui'

/** Today page — daily mood check-in, a "right now" intervention, and a quick insight. */
export default function Today() {
  const [store, update] = useStore()
  const { t, lang } = useT()
  const openCrisis = useCrisis()
  const [justCheckedIn, setJustCheckedIn] = useState(false)

  const now = Date.now()
  const phase = getPhase(store.profile, now)
  const checkIns = store.checkIns
  const latest = checkIns.length ? checkIns[checkIns.length - 1] : null

  const greeting = store.profile.name
    ? t('today.greeting', { name: store.profile.name })
    : t('today.greetingPlain')

  // Right-Now intervention: from the latest check-in, or sensible defaults.
  const intervention = useMemo(() => {
    const mood: Mood = latest?.mood ?? 'Okay'
    const triggers = latest?.triggers ?? []
    const intensity = latest?.intensity ?? 5
    return pickIntervention({ mood, triggers, intensity, phase, hour: new Date().getHours() })
  }, [latest, phase])

  const digest = useMemo(() => weeklyDigest(checkIns, now), [checkIns, now])

  function handleSubmit(ci: { mood: Mood; triggers: string[]; intensity: number; note: string }) {
    const checkIn: CheckIn = { id: makeId(), ts: Date.now(), ...ci }
    update((s) => ({ ...s, checkIns: [...s.checkIns, checkIn] }))
    setJustCheckedIn(true)
  }

  function rate(helpful: boolean) {
    update((s) => ({
      ...s,
      feedback: [
        ...s.feedback,
        { id: makeId(), ts: Date.now(), interventionId: intervention.id, helpful },
      ],
    }))
  }

  return (
    <motion.div variants={stagger.container} initial="initial" animate="animate">
      <motion.div variants={stagger.item}>
        <SectionTitle as="h1">{greeting}</SectionTitle>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Main column */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          {/* Check-in */}
          <motion.div variants={stagger.item}>
            <Card>
              <SectionTitle>{t('today.checkInPrompt')}</SectionTitle>
              <MoodPicker onSubmit={handleSubmit} lastMood={latest?.mood} />
              <p
                aria-live="polite"
                className="mt-3 min-h-[1.25rem] text-sm text-[var(--color-brand-600)]"
              >
                {justCheckedIn ? t('today.checkedIn') : ''}
              </p>
            </Card>
          </motion.div>

          {/* Phase shortcuts */}
          {phase === 'exam-week' && (
            <motion.div variants={stagger.item}>
              <Link to="/exam">
                <Button variant="soft">{t('today.openExamMode')}</Button>
              </Link>
            </motion.div>
          )}
          {(phase === 'result-day' || phase === 'result-wait') && (
            <motion.div variants={stagger.item}>
              <Link to="/result">
                <Button variant="soft">{t('today.openResultMode')}</Button>
              </Link>
            </motion.div>
          )}
        </div>

        {/* Right rail */}
        <div className="flex flex-col gap-4">
          {/* Right Now */}
          <motion.div variants={stagger.item}>
            <Card>
              <SectionTitle>{t('today.rightNow')}</SectionTitle>
              <div aria-live="polite">
                <div className="flex items-start gap-3">
                  <span className="text-3xl" aria-hidden>
                    {intervention.emoji}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-[var(--ink)]">
                      {intervention.title[lang]}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--ink-soft)]">{intervention.body[lang]}</p>
                    {intervention.durationMin > 0 && (
                      <p className="mt-1 text-xs text-[var(--ink-soft)]">
                        {intervention.durationMin} {t('toolkit.minutes')}
                      </p>
                    )}
                  </div>
                </div>

                {intervention.action === 'crisis' && (
                  <div className="mt-3">
                    <Button type="button" onClick={openCrisis}>
                      <span aria-hidden>🤝 </span>
                      {t('nav.help')}
                    </Button>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center gap-2 border-t border-[var(--hairline)] pt-3">
                <span className="text-sm text-[var(--ink-soft)]">{t('today.helpful')}</span>
                <Button variant="ghost" type="button" onClick={() => rate(true)}>
                  <span aria-hidden>👍 </span>
                  {t('today.yes')}
                </Button>
                <Button variant="ghost" type="button" onClick={() => rate(false)}>
                  <span aria-hidden>👎 </span>
                  {t('today.no')}
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Insight */}
          <motion.div variants={stagger.item}>
            <Card>
              <SectionTitle>{t('today.insight')}</SectionTitle>
              {checkIns.length === 0 ? (
                <EmptyState emoji="🌱">{t('patterns.empty')}</EmptyState>
              ) : (
                <div className="flex flex-col gap-2 text-sm text-[var(--ink)]">
                  <p>
                    <span className="text-lg font-semibold">{digest.checkInDays}</span>{' '}
                    <span className="text-[var(--ink-soft)]">{t('patterns.checkInDays')}</span>
                  </p>
                  <p className="text-[var(--ink-soft)]">{t(`patterns.trend.${digest.trend}`)}</p>
                  {digest.bounceBackDays !== null && (
                    <p>
                      <span className="text-lg font-semibold">{digest.bounceBackDays}</span>{' '}
                      <span className="text-[var(--ink-soft)]">{t('patterns.bounceBack')}</span>
                    </p>
                  )}
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
