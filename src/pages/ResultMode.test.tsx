import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { axe } from 'vitest-axe'
import { beforeEach, describe, expect, it } from 'vitest'
import { __resetStoreCache } from '../lib/storage'
import ResultMode from './ResultMode'

beforeEach(() => {
  sessionStorage.clear()
  __resetStoreCache()
})

function renderResultMode() {
  return render(
    <MemoryRouter>
      <ResultMode />
    </MemoryRouter>,
  )
}

describe('ResultMode', () => {
  it('renders the reassuring before-reveal message by default', () => {
    renderResultMode()
    expect(screen.getByRole('heading', { level: 1, name: 'Result Mode' })).toBeTruthy()
    expect(
      screen.getByText('Today might be big. You don’t have to face it alone.'),
    ).toBeTruthy()
  })

  it('reveals the support state with at least one helpline when ready', async () => {
    const user = userEvent.setup()
    renderResultMode()

    await user.click(screen.getByRole('button', { name: 'Ready to look?' }))

    expect(screen.getByText('However it landed — be gentle with yourself.')).toBeTruthy()
    expect(screen.getByText(/Tele-MANAS/)).toBeTruthy()
    const callLink = screen.getByRole('link', { name: /14416/ })
    expect(callLink.getAttribute('href')).toBe('tel:14416')
  })

  it('has no accessibility violations', async () => {
    const { container } = renderResultMode()
    expect(await axe(container)).toHaveNoViolations()
  })
})
