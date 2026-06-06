import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { __resetStoreCache } from '../lib/storage'
import MoodPicker from './MoodPicker'

beforeEach(() => {
  sessionStorage.clear()
  __resetStoreCache()
})

describe('MoodPicker', () => {
  it('renders 5 mood options', () => {
    render(<MoodPicker onSubmit={() => {}} />)
    expect(screen.getAllByRole('radio')).toHaveLength(5)
  })

  it('selecting a mood and submitting calls onSubmit with that mood', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<MoodPicker onSubmit={onSubmit} />)

    await user.click(screen.getByRole('radio', { name: /Bright/i }))
    await user.click(screen.getByRole('button', { name: /Log how I feel/i }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ mood: 'Bright', triggers: [], intensity: 5, note: '' }),
    )
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<MoodPicker onSubmit={() => {}} lastMood="Okay" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
