import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, EmptyState, SectionTitle, cx, riseIn, stagger } from '../components/ui'
import { useT } from '../lib/i18n'
import {
  moodSeries,
  triggerStats,
  weeklyDigest,
  type TriggerStat,
  type WeeklyDigest,
} from '../lib/insights'
import { useStore } from '../lib/storage'
import { triggerEmoji, triggerLabel } from '../lib/triggers'

const RIVER_DAYS = 21

/** Map a recorded trend to its gentle, coping-focused sentence key. */
const TREND_KEY: Record<WeeklyDigest['trend'], string> = {
  up: 'patterns.trend.up',
  down: 'patterns.trend.down',
  flat: 'patterns.trend.flat',
  new: 'patterns.trend.new',
}

/** Patterns page — visualises mood over time, common triggers, and a weekly digest. */
export default function Patterns() {
  const [store] = useStore()
  const { t, lang } = useT()
  const checkIns = store.checkIns

  const now = Date.now()
  const series = useMemo(() => moodSeries(checkIns, now, RIVER_DAYS), [checkIns, now])
  const triggers = useMemo(() => triggerStats(checkIns, 30, now), [checkIns, now])
  const digest = useMemo(() => weeklyDigest(checkIns, now), [checkIns, now])

  if (checkIns.length === 0) {
    return (
      <div className="mx-auto max-w-3xl">
        <SectionTitle as="h1" sub={t('patterns.subtitle')}>
          {t('patterns.title')}
        </SectionTitle>
        <Card {...riseIn}>
          <EmptyState emoji="🌱">{t('patterns.empty')}</EmptyState>
        </Card>
      </div>
    )
  }

  // A one-line, non-colour caption so the river's meaning is also in words.
  const riverCaption = t(TREND_KEY[digest.trend])

  return (
    <div className="mx-auto max-w-5xl">
      <SectionTitle as="h1" sub={t('patterns.subtitle')}>
        {t('patterns.title')}
      </SectionTitle>

      <motion.div
        className="grid grid-cols-1 gap-5 lg:grid-cols-2"
        variants={stagger.container}
        initial="initial"
        animate="animate"
      >
        {/* Mood river — full width on top */}
        <motion.div variants={stagger.item} className="lg:col-span-2">
          <Card>
            <SectionTitle>{t('patterns.river')}</SectionTitle>
            <div
              role="img"
              aria-label={`${t('patterns.river')} — ${t('patterns.subtitle')} (${RIVER_DAYS} days). ${riverCaption}`}
              className="w-full"
            >
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={series} margin={{ top: 10, right: 12, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="moodRiver" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="var(--color-brand-400, #2dd4bf)"
                        stopOpacity={0.55}
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--color-lilac-400, #c4b5fd)"
                        stopOpacity={0.08}
                      />
                    </linearGradient>
                    <linearGradient id="moodStroke" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="var(--color-brand-500, #14b8a6)" />
                      <stop offset="100%" stopColor="var(--color-lilac-500, #a78bfa)" />
                    </linearGradient>
                  </defs>
                  <YAxis domain={[1, 5]} hide />
                  <XAxis
                    dataKey="label"
                    interval="preserveStartEnd"
                    minTickGap={48}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: 'var(--ink-soft, #6b7280)' }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 16,
                      border: 'none',
                      background: 'var(--surface, #fff)',
                      boxShadow: 'var(--shadow-card)',
                      fontSize: 12,
                    }}
                    labelStyle={{ color: 'var(--ink, #111)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    connectNulls
                    stroke="url(#moodStroke)"
                    strokeWidth={3}
                    strokeLinecap="round"
                    fill="url(#moodRiver)"
                    isAnimationActive
                    animationDuration={900}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">{riverCaption}</p>
          </Card>
        </motion.div>

        {/* Trigger map */}
        <motion.div variants={stagger.item}>
          <Card className="h-full">
            <SectionTitle>{t('patterns.triggers')}</SectionTitle>
            <TriggerMap triggers={triggers} lang={lang} caption={t('patterns.empty')} />
          </Card>
        </motion.div>

        {/* Weekly digest */}
        <motion.div variants={stagger.item}>
          <Card className="h-full">
            <SectionTitle>{t('patterns.digest')}</SectionTitle>
            <Digest digest={digest} t={t} />
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

/** Frequency-scaled tag cloud of recent triggers. */
function TriggerMap({
  triggers,
  lang,
  caption,
}: {
  triggers: TriggerStat[]
  lang: 'en' | 'hi'
  caption: string
}) {
  if (triggers.length === 0) {
    return <p className="py-4 text-sm text-[var(--ink-soft)]">{caption}</p>
  }
  const max = Math.max(...triggers.map((s) => s.count))

  return (
    <motion.ul
      className="flex flex-wrap items-center gap-2.5"
      variants={stagger.container}
      initial="initial"
      animate="animate"
    >
      {triggers.map((s) => {
        // Scale 0..1 by relative frequency; nudge so even rare triggers read clearly.
        const f = max > 0 ? s.count / max : 0
        const pad = 0.5 + f * 0.6 // rem
        const fontPx = 13 + f * 5
        return (
          <motion.li key={s.id} variants={stagger.item}>
            <span
              className={cx(
                'inline-flex items-center gap-1.5 rounded-full',
                'border border-[var(--hairline)] bg-[var(--color-brand-300)]/15',
                'font-medium text-[var(--ink)]',
              )}
              style={{
                padding: `${pad * 0.55}rem ${pad}rem`,
                fontSize: `${fontPx}px`,
              }}
            >
              <span aria-hidden>{triggerEmoji(s.id)}</span>
              <span>{triggerLabel(s.id, lang)}</span>
              <span className="text-[var(--ink-soft)]">{s.count}</span>
            </span>
          </motion.li>
        )
      })}
    </motion.ul>
  )
}

/** Compact weekly summary: check-in days, trend sentence, and bounce-back days. */
function Digest({
  digest,
  t,
}: {
  digest: WeeklyDigest
  t: (key: string, params?: Record<string, string>) => string
}) {
  return (
    <div className="space-y-3 text-[var(--ink)]">
      <p className="text-base">
        <span className="text-2xl font-semibold">{digest.checkInDays}</span>{' '}
        <span className="text-[var(--ink-soft)]">{t('patterns.checkInDays')}</span>
      </p>
      <p className="text-sm text-[var(--ink-soft)]">{t(TREND_KEY[digest.trend])}</p>
      {digest.bounceBackDays != null && (
        <p className="text-base">
          <span className="text-2xl font-semibold">{digest.bounceBackDays}</span>{' '}
          <span className="text-[var(--ink-soft)]">{t('patterns.bounceBack')}</span>
        </p>
      )}
    </div>
  )
}
