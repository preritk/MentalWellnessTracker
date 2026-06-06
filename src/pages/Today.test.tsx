import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { axe } from 'vitest-axe'
import { __resetStoreCache, loadStore } from '../lib/storage'
import Today from './Today'

function renderToday() {
  return render(
    <MemoryRouter>
      <Today />
    </MemoryRouter>,
  )
}

beforeEach(() => {
  sessionStorage.clear()
  __resetStoreCache()
})

describe('Today', () => {
  it('renders the greeting and check-in prompt', () => {
    renderToday()
    expect(screen.getByRole('heading', { level: 1, name: /Hi there/i })).toBeInTheDocument()
    expect(screen.getByText(/Long day\? Quick check-in\./i)).toBeInTheDocument()
  })

  it('renders a Right-Now intervention title', () => {
    renderToday()
    // Default context (Okay / general / no triggers) -> 60-second grounding.
    expect(screen.getByText(/60-second grounding/i)).toBeInTheDocument()
  })

  it('saves a check-in and shows confirmation after submitting', async () => {
    const user = userEvent.setup()
    renderToday()

    await user.click(screen.getByRole('radio', { name: /Steady/i }))
    await user.click(screen.getByRole('button', { name: /Log how I feel/i }))

    expect(loadStore().checkIns).toHaveLength(1)
    expect(loadStore().checkIns[0].mood).toBe('Steady')
    expect(
      screen.getByText(/Checked in\. Thank you for showing up for yourself\./i),
    ).toBeInTheDocument()
  })

  it('has no accessibility violations', async () => {
    const { container } = renderToday()
    expect(await axe(container)).toHaveNoViolations()
  })
})
