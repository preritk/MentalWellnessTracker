import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { axe } from 'vitest-axe'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { __resetStoreCache, loadStore } from '../lib/storage'
import Onboarding from './Onboarding'

vi.mock('react-router-dom', async (orig) => ({
  ...(await orig<typeof import('react-router-dom')>()),
  useNavigate: () => vi.fn(),
}))

beforeEach(() => {
  sessionStorage.clear()
  __resetStoreCache()
})

function renderOnboarding() {
  return render(
    <MemoryRouter>
      <Onboarding />
    </MemoryRouter>,
  )
}

describe('Onboarding', () => {
  it('renders the welcome heading and name field', () => {
    renderOnboarding()
    expect(screen.getByRole('heading', { level: 1 })).toBeTruthy()
    expect(screen.getByLabelText('What should we call you?')).toBeTruthy()
  })

  it('saves the profile and marks onboarded when finishing', async () => {
    const user = userEvent.setup()
    renderOnboarding()

    await user.type(screen.getByLabelText('What should we call you?'), 'Aanya')
    await user.click(screen.getByRole('button', { name: 'Enter MindMitra' }))

    const store = loadStore()
    expect(store.profile.onboarded).toBe(true)
    expect(store.profile.name).toBe('Aanya')
  })

  it('has no accessibility violations', async () => {
    const { container } = renderOnboarding()
    expect(await axe(container)).toHaveNoViolations()
  })
})
