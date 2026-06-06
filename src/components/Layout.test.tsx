import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { axe } from 'vitest-axe'
import { __resetStoreCache } from '../lib/storage'
import { Layout } from './Layout'

function renderLayout() {
  return render(
    <MemoryRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route
            index
            element={
              <div>
                <h1>Test</h1>
              </div>
            }
          />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  sessionStorage.clear()
  __resetStoreCache()
  document.documentElement.classList.remove('dark')
  document.documentElement.lang = ''
})

describe('Layout', () => {
  it('renders the five primary nav links', () => {
    renderLayout()
    expect(screen.getAllByRole('link', { name: /Today/i }).length).toBeGreaterThan(0)
    expect(screen.getByRole('link', { name: /Quiet Page/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Patterns/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Toolkit/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /You & Privacy/i })).toBeInTheDocument()
  })

  it('toggling dark mode adds the dark class to <html>', async () => {
    const user = userEvent.setup()
    renderLayout()
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    // There are two toggles (mobile + desktop); the first is fine.
    const toggles = screen.getAllByRole('button', { name: /Dark mode/i })
    await user.click(toggles[0])
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('toggling language flips the document language and label', async () => {
    const user = userEvent.setup()
    renderLayout()
    expect(document.documentElement.lang).toBe('en')
    const langToggles = screen.getAllByRole('button', { name: /Language/i })
    // English shows "अ / A"; after toggling to Hindi it shows "A / अ".
    expect(langToggles[0]).toHaveTextContent('अ / A')
    await user.click(langToggles[0])
    expect(document.documentElement.lang).toBe('hi')
  })

  it('opens the crisis dialog from "I need help now"', async () => {
    const user = userEvent.setup()
    renderLayout()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    const helpButtons = screen.getAllByRole('button', { name: /I need help now/i })
    await user.click(helpButtons[0])
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
  })

  it('has no accessibility violations', async () => {
    const { container } = renderLayout()
    expect(await axe(container)).toHaveNoViolations()
  })
})
