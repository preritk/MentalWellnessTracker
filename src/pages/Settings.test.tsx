import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { axe } from 'vitest-axe'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { __resetStoreCache, loadStore } from '../lib/storage'
import Settings from './Settings'

vi.mock('react-router-dom', async (o) => ({
  ...(await (o() as Promise<typeof import('react-router-dom')>)),
  useNavigate: () => vi.fn(),
}))

beforeEach(() => {
  sessionStorage.clear()
  __resetStoreCache()
  URL.createObjectURL = vi.fn(() => 'blob:x')
  URL.revokeObjectURL = vi.fn()
})

function renderSettings() {
  return render(
    <MemoryRouter>
      <Settings />
    </MemoryRouter>,
  )
}

describe('Settings — You & Privacy', () => {
  it('renders the title and the privacy note', () => {
    renderSettings()
    expect(screen.getByRole('heading', { level: 1, name: 'You & Privacy' })).toBeTruthy()
    expect(
      screen.getByText(
        'Everything you write lives only in this tab and is wiped when you close it. We have no server and no account.',
      ),
    ).toBeTruthy()
  })

  it('toggling the Sharing switch updates the stored sharing flag to true', async () => {
    const user = userEvent.setup()
    renderSettings()

    expect(loadStore().settings.sharing).toBe(false)
    const sharingSwitch = screen.getByRole('switch', { name: 'Share encouragement signals' })
    await user.click(sharingSwitch)

    expect(loadStore().settings.sharing).toBe(true)
  })

  it('clicking "Load sample data" populates check-ins', async () => {
    const user = userEvent.setup()
    renderSettings()

    expect(loadStore().checkIns.length).toBe(0)
    await user.click(screen.getByRole('button', { name: 'Load sample data (for demo)' }))

    expect(loadStore().checkIns.length).toBeGreaterThan(0)
  })

  it('has no accessibility violations', async () => {
    const { container } = renderSettings()
    expect(await axe(container)).toHaveNoViolations()
  })
})
