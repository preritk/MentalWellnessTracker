import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { __resetStoreCache, STORAGE_KEY, defaultStore } from './lib/storage'
import App from './App'

beforeEach(() => {
  sessionStorage.clear()
  __resetStoreCache()
})

describe('App routing', () => {
  it('redirects to onboarding when there is no profile', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )
    const heading = await screen.findByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent(/Welcome/i)
  })

  it('shows the Today page once onboarded', async () => {
    const store = defaultStore()
    store.profile.onboarded = true
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(store))
    __resetStoreCache()

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )
    // Today greeting (no name set) -> "Hi there".
    expect(await screen.findByRole('heading', { level: 1, name: /Hi there/i })).toBeInTheDocument()
  })
})
