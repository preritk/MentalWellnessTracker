import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { axe } from 'vitest-axe'
import { beforeEach, describe, expect, it } from 'vitest'
import { __resetStoreCache, loadStore } from '../lib/storage'
import Journal from './Journal'

beforeEach(() => {
  sessionStorage.clear()
  __resetStoreCache()
})

function renderJournal() {
  return render(
    <MemoryRouter>
      <Journal />
    </MemoryRouter>,
  )
}

describe('Journal — The Quiet Page', () => {
  it('renders the title and the editor', () => {
    renderJournal()
    expect(screen.getByRole('heading', { level: 1, name: 'The Quiet Page' })).toBeTruthy()
    expect(screen.getByPlaceholderText('Let it out…')).toBeTruthy()
  })

  it('saves an entry with the typed text when "Keep this" is clicked', async () => {
    const user = userEvent.setup()
    renderJournal()

    const editor = screen.getByPlaceholderText('Let it out…')
    await user.type(editor, 'today felt a little lighter')
    await user.click(screen.getByRole('button', { name: 'Keep this' }))

    const store = loadStore()
    expect(store.journal.length).toBe(1)
    expect(store.journal[0].text).toBe('today felt a little lighter')
    expect(screen.getByText('Saved to your private page.')).toBeTruthy()
  })

  it('saves NOTHING when "Let it go" is clicked, and confirms it was let go', async () => {
    const user = userEvent.setup()
    renderJournal()

    const editor = screen.getByPlaceholderText('Let it out…')
    await user.type(editor, 'venting some frustration')
    await user.click(screen.getByRole('button', { name: 'Let it go' }))

    const store = loadStore()
    expect(store.journal.length).toBe(0)
    expect(screen.getByText('Let go. Nothing was saved.')).toBeTruthy()
  })

  it('has no accessibility violations', async () => {
    const { container } = renderJournal()
    expect(await axe(container)).toHaveNoViolations()
  })
})
