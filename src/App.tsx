import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { useStore } from './lib/storage'
import { Layout } from './components/Layout'

// Route-level code splitting: each page is its own chunk so the initial load
// stays light (heavy deps like recharts only download when Patterns is opened).
const Onboarding = lazy(() => import('./pages/Onboarding'))
const Today = lazy(() => import('./pages/Today'))
const Journal = lazy(() => import('./pages/Journal'))
const Patterns = lazy(() => import('./pages/Patterns'))
const Toolkit = lazy(() => import('./pages/Toolkit'))
const Settings = lazy(() => import('./pages/Settings'))
const ExamMode = lazy(() => import('./pages/ExamMode'))
const ResultMode = lazy(() => import('./pages/ResultMode'))

/** Calm, unobtrusive fallback shown while a route chunk loads. */
function RouteFallback() {
  return (
    <div
      className="ambient-bg flex min-h-screen items-center justify-center text-[var(--ink-soft)]"
      role="status"
      aria-live="polite"
    >
      <span className="text-2xl" aria-hidden>
        🌿
      </span>
      <span className="sr-only">Loading…</span>
    </div>
  )
}

/**
 * Top-level router. Gates the app behind onboarding and honours the user's
 * reduced-motion preference for every framer-motion animation in the tree.
 */
export default function App() {
  const [store] = useStore()
  const onboarded = store.profile.onboarded
  const location = useLocation()

  // Gate everything behind onboarding (except the onboarding route itself).
  if (!onboarded && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }
  if (onboarded && location.pathname === '/onboarding') {
    return <Navigate to="/" replace />
  }

  return (
    <MotionConfig reducedMotion={store.settings.reducedMotion ? 'always' : 'never'}>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          {/* Stripped, full-screen modes */}
          <Route path="/exam" element={<ExamMode />} />
          <Route path="/result" element={<ResultMode />} />
          {/* Main app shell */}
          <Route element={<Layout />}>
            <Route index element={<Today />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/patterns" element={<Patterns />} />
            <Route path="/toolkit" element={<Toolkit />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </MotionConfig>
  )
}
