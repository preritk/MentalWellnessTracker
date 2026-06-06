import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useStore } from './lib/storage'
import { Layout } from './components/Layout'
import Onboarding from './pages/Onboarding'
import Today from './pages/Today'
import Journal from './pages/Journal'
import Patterns from './pages/Patterns'
import Toolkit from './pages/Toolkit'
import Settings from './pages/Settings'
import ExamMode from './pages/ExamMode'
import ResultMode from './pages/ResultMode'

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
  )
}
