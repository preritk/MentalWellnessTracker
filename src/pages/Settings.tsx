import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  useStore,
  clearStore,
  defaultStore,
  type Language,
} from '../lib/storage'
import { applySeed, clearSeed } from '../lib/seed'
import { useT } from '../lib/i18n'
import { Card, SectionTitle, Button, cx, stagger } from '../components/ui'

// ---------------------------------------------------------------------------
// Switch — a real, keyboard-operable toggle with role="switch" + aria-checked.
// ---------------------------------------------------------------------------

interface SwitchRowProps {
  label: string
  hint?: ReactNode
  checked: boolean
  onChange: () => void
}

function SwitchRow({ label, hint, checked, onChange }: SwitchRowProps) {
  const labelId = `switch-label-${label.replace(/\s+/g, '-').toLowerCase()}`
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <div className="min-w-0">
        <span id={labelId} className="text-sm font-medium text-[var(--ink)]">
          {label}
        </span>
        {hint && <p className="mt-1 text-xs text-[var(--ink-soft)]">{hint}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        onClick={onChange}
        className={cx(
          'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full',
          'transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2',
          'focus-visible:outline-[var(--color-brand-500)]',
          checked ? 'bg-[var(--color-brand-500)]' : 'bg-[var(--hairline)]',
        )}
      >
        <span
          aria-hidden
          className={cx(
            'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200',
            checked ? 'translate-x-5' : 'translate-x-0.5',
          )}
        />
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Settings — "You & Privacy". Privacy is the hero.
// ---------------------------------------------------------------------------

export default function Settings() {
  const [store, update] = useStore()
  const { t } = useT()
  const navigate = useNavigate()
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const setLanguage = (language: Language) =>
    update((s) => ({ ...s, profile: { ...s.profile, language } }))

  const toggleDarkMode = () =>
    update((s) => ({ ...s, settings: { ...s.settings, darkMode: !s.settings.darkMode } }))

  const toggleReducedMotion = () =>
    update((s) => ({
      ...s,
      settings: { ...s.settings, reducedMotion: !s.settings.reducedMotion },
    }))

  const toggleSharing = () =>
    update((s) => ({ ...s, settings: { ...s.settings, sharing: !s.settings.sharing } }))

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(store, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mindmitra-data.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDelete = () => {
    clearStore()
    update(() => ({ ...defaultStore() }))
    navigate('/onboarding')
  }

  const lang = store.profile.language

  return (
    <motion.div
      className="mx-auto flex w-full max-w-2xl flex-col gap-5"
      variants={stagger.container}
      initial="initial"
      animate="animate"
    >
      {/* Header + privacy hero */}
      <motion.div variants={stagger.item}>
        <SectionTitle as="h1">{t('settings.title')}</SectionTitle>
        <Card glass className="border border-[var(--color-brand-300)]/30">
          <div className="flex items-start gap-3">
            <span className="text-2xl" aria-hidden>
              🔒
            </span>
            <p className="text-sm leading-relaxed text-[var(--ink)]">
              {t('settings.privacyNote')}
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Preferences */}
      <motion.div variants={stagger.item}>
        <Card glass>
          <SectionTitle as="h2">{t('settings.language')}</SectionTitle>
          <div
            role="group"
            aria-label={t('settings.language')}
            className="inline-flex rounded-2xl border border-[var(--hairline)] p-1"
          >
            <button
              type="button"
              aria-pressed={lang === 'en'}
              onClick={() => setLanguage('en')}
              className={cx(
                'rounded-xl px-4 py-1.5 text-sm font-medium transition-colors duration-150',
                lang === 'en'
                  ? 'bg-[var(--color-brand-500)] text-white'
                  : 'text-[var(--ink)] hover:bg-[var(--hairline)]',
              )}
            >
              English
            </button>
            <button
              type="button"
              aria-pressed={lang === 'hi'}
              onClick={() => setLanguage('hi')}
              className={cx(
                'rounded-xl px-4 py-1.5 text-sm font-medium transition-colors duration-150',
                lang === 'hi'
                  ? 'bg-[var(--color-brand-500)] text-white'
                  : 'text-[var(--ink)] hover:bg-[var(--hairline)]',
              )}
            >
              हिन्दी
            </button>
          </div>

          <div className="mt-4 divide-y divide-[var(--hairline)]">
            <SwitchRow
              label={t('settings.darkMode')}
              checked={store.settings.darkMode}
              onChange={toggleDarkMode}
            />
            <SwitchRow
              label={t('settings.reducedMotion')}
              checked={store.settings.reducedMotion}
              onChange={toggleReducedMotion}
            />
          </div>
        </Card>
      </motion.div>

      {/* Sharing */}
      <motion.div variants={stagger.item}>
        <Card glass>
          <SwitchRow
            label={t('settings.sharing')}
            hint={t('settings.sharingHint')}
            checked={store.settings.sharing}
            onChange={toggleSharing}
          />
        </Card>
      </motion.div>

      {/* Demo data */}
      <motion.div variants={stagger.item}>
        <Card glass>
          {store.settings.seeded ? (
            <Button variant="soft" onClick={() => update((s) => clearSeed(s))}>
              {t('settings.seedClear')}
            </Button>
          ) : (
            <Button variant="soft" onClick={() => update((s) => applySeed(s, Date.now()))}>
              {t('settings.seed')}
            </Button>
          )}
        </Card>
      </motion.div>

      {/* Your data */}
      <motion.div variants={stagger.item}>
        <Card glass>
          <div className="flex flex-col gap-3">
            <Button variant="ghost" onClick={handleExport} className="self-start">
              {t('settings.export')}
            </Button>

            {confirmingDelete ? (
              <div
                role="group"
                aria-label={t('settings.delete')}
                className="rounded-2xl border border-red-500/30 bg-red-500/5 p-4"
              >
                <p className="text-sm text-[var(--ink)]">{t('settings.deleteConfirm')}</p>
                <div className="mt-3 flex gap-2">
                  <Button variant="danger" onClick={handleDelete}>
                    {t('common.done')}
                  </Button>
                  <Button variant="ghost" onClick={() => setConfirmingDelete(false)}>
                    {t('common.cancel')}
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="danger"
                onClick={() => setConfirmingDelete(true)}
                className="self-start"
              >
                {t('settings.delete')}
              </Button>
            )}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}
