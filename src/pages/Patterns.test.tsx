import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { axe } from 'vitest-axe'
import { beforeEach, describe, expect, it } from 'vitest'
import { STORAGE_KEY, __resetStoreCache, defaultStore, type CheckIn } from '../lib/storage'
import Patterns from './Patterns'

beforeEach(() => {
  sessionStorage.clear()
  __resetStoreCache()
})

function seed(checkIns: CheckIn[]) {
  const s = defaultStore()
  s.checkIns = checkIns
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(s))
  __resetStoreCache()
}

const DAY = 86_400_000

function sampleCheckIns(): CheckIn[] {
  const now = Date.now()
  return [
    { id: 'a', ts: now - 1 * DAY, mood: 'Bright', triggers: ['sleep'], intensity: 3, note: '' },
    {
      id: 'b',
      ts: now - 2 * DAY,
      mood: 'Okay',
      triggers: ['mock', 'sleep'],
      intensity: 5,
      note: '',
    },
    { id: 'c', ts: now - 3 * DAY, mood: 'Low', triggers: ['family'], intensity: 7, note: '' },
    {
      id: 'd',
      ts: now - 4 * DAY,
      mood: 'Drained',
      triggers: ['sleep', 'self'],
      intensity: 8,
      note: '',
    },
  ]
}

function renderPatterns() {
  return render(
    <MemoryRouter>
      <Patterns />
    </MemoryRouter>,
  )
}

describe('Patterns', () => {
  it('renders the title and at least one seeded trigger label', () => {
    seed(sampleCheckIns())
    renderPatterns()
    expect(screen.getByRole('heading', { level: 1, name: 'Patterns' })).toBeTruthy()
    // 'sleep' appears in 3 check-ins — its label should surface in the trigger map.
    expect(screen.getByText('Sleep')).toBeTruthy()
  })

  it('shows the empty state when there are no check-ins', () => {
    seed([])
    renderPatterns()
    expect(screen.getByText('A few check-ins and your patterns will appear here.')).toBeTruthy()
  })

  it('has no accessibility violations', async () => {
    seed(sampleCheckIns())
    const { container } = renderPatterns()
    expect(await axe(container)).toHaveNoViolations()
  })
})
