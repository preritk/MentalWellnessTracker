import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../lib/storage'
import { useT } from '../lib/i18n'
import { getPhase } from '../lib/phase'
import { CrisisModal } from './CrisisModal'

// --- Crisis context: any screen can open the helpline modal -----------------
const CrisisContext = createContext<() => void>(() => {})
export function useCrisis(): () => void {
  return useContext(CrisisContext)
}

const NAV = [
  { to: '/', key: 'nav.today', emoji: '🌿', end: true },
  { to: '/journal', key: 'nav.journal', emoji: '📖', end: false },
  { to: '/patterns', key: 'nav.patterns', emoji: '🌊', end: false },
  { to: '/toolkit', key: 'nav.toolkit', emoji: '🧰', end: false },
  { to: '/settings', key: 'nav.settings', emoji: '🔒', end: false },
]

export function Layout() {
  const [store, update] = useStore()
  const { t } = useT()
  const [crisisOpen, setCrisisOpen] = useState(false)
  const location = useLocation()

  const openCrisis = useCallback(() => setCrisisOpen(true), [])

  // Reflect theme + motion preferences onto <html>.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', store.settings.darkMode)
  }, [store.settings.darkMode])

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', store.settings.reducedMotion)
  }, [store.settings.reducedMotion])

  // Keep the document language in sync so screen readers pronounce Hindi correctly (WCAG 3.1.1).
  useEffect(() => {
    document.documentElement.lang = store.profile.language
  }, [store.profile.language])

  // On route change, move focus to the page's main heading so keyboard and
  // screen-reader users start from the top of the new content (WCAG 2.4.3).
  useEffect(() => {
    const heading = document.querySelector<HTMLElement>('#main h1')
    if (heading) {
      heading.setAttribute('tabindex', '-1')
      heading.focus({ preventScroll: false })
    }
  }, [location.pathname])

  const phase = getPhase(store.profile, Date.now())

  return (
    <CrisisContext.Provider value={openCrisis}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="ambient-bg min-h-screen">
        <div className="mx-auto flex max-w-6xl flex-col lg:flex-row">
          {/* Sidebar (desktop) / top bar (mobile) */}
          <header className="lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:py-8 lg:px-5">
            <div className="flex items-center justify-between px-4 py-4 lg:px-0 lg:py-0 lg:block">
              <div className="flex items-center gap-2">
                <span className="text-2xl" aria-hidden>
                  🌿
                </span>
                <div>
                  <p
                    className="text-lg font-bold leading-none text-[var(--ink)]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {t('app.name')}
                  </p>
                  <p className="hidden lg:block text-xs text-[var(--ink-soft)]">
                    {t('app.tagline')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 lg:hidden">
                <ThemeToggle />
                <LangToggle />
              </div>
            </div>

            <nav aria-label="Primary" className="px-2 pb-2 lg:mt-6 lg:px-0">
              <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:gap-0.5">
                {NAV.map((item) => (
                  <li key={item.to} className="shrink-0">
                    <NavLink
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        [
                          'flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap',
                          isActive
                            ? 'bg-[var(--color-brand-500)] text-white'
                            : 'text-[var(--ink)] hover:bg-[var(--hairline)]',
                        ].join(' ')
                      }
                    >
                      <span aria-hidden>{item.emoji}</span>
                      <span>{t(item.key)}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="hidden lg:flex lg:flex-col lg:gap-2 lg:mt-6 lg:px-0">
              <div className="flex gap-2">
                <ThemeToggle />
                <LangToggle />
              </div>
              <CrisisButton onClick={openCrisis} label={t('nav.help')} />
            </div>
          </header>

          {/* Main content */}
          <main id="main" className="min-w-0 flex-1 px-4 pb-28 pt-2 lg:py-8 lg:pr-6">
            {phase !== 'general' && (
              <div
                className="mb-4 rounded-2xl border border-[var(--hairline)] glass px-4 py-2.5 text-sm font-medium text-[var(--ink)]"
                role="status"
              >
                <span aria-hidden>✦ </span>
                {t(`phase.${phase}`)}
              </div>
            )}
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        {/* Persistent crisis affordance on mobile */}
        <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 lg:hidden">
          <CrisisButton onClick={openCrisis} label={t('nav.help')} />
        </div>
      </div>

      <CrisisModal open={crisisOpen} onClose={() => setCrisisOpen(false)} />
    </CrisisContext.Provider>
  )

  function ThemeToggle() {
    return (
      <button
        type="button"
        onClick={() =>
          update((s) => ({ ...s, settings: { ...s.settings, darkMode: !s.settings.darkMode } }))
        }
        aria-pressed={store.settings.darkMode}
        aria-label={t('settings.darkMode')}
        className="rounded-xl border border-[var(--hairline)] px-3 py-2 text-sm hover:bg-[var(--hairline)]"
      >
        {store.settings.darkMode ? '☀️' : '🌙'}
      </button>
    )
  }

  function LangToggle() {
    const lang = store.profile.language
    return (
      <button
        type="button"
        onClick={() =>
          update((s) => ({
            ...s,
            profile: { ...s.profile, language: s.profile.language === 'en' ? 'hi' : 'en' },
          }))
        }
        aria-label={t('settings.language')}
        className="rounded-xl border border-[var(--hairline)] px-3 py-2 text-sm font-semibold hover:bg-[var(--hairline)]"
      >
        {lang === 'en' ? 'अ / A' : 'A / अ'}
      </button>
    )
  }
}

function CrisisButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-2xl bg-[var(--color-lilac-500)] px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-soft)] hover:opacity-95"
    >
      <span aria-hidden>🤝</span>
      {label}
    </button>
  )
}
