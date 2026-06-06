import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { afterEach, describe, expect, it } from 'vitest'
import BreathingExercise from './BreathingExercise'

afterEach(() => {
  // No fake timers are installed here; ensure nothing leaks between tests.
})

describe('BreathingExercise', () => {
  it('renders a Start button', () => {
    render(<BreathingExercise pattern="478" />)
    expect(screen.getByRole('button', { name: 'Start' })).toBeTruthy()
  })

  it('toggles to Stop when started', async () => {
    const user = userEvent.setup()
    render(<BreathingExercise pattern="478" />)

    await user.click(screen.getByRole('button', { name: 'Start' }))
    expect(screen.getByRole('button', { name: 'Stop' })).toBeTruthy()
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<BreathingExercise pattern="478" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
