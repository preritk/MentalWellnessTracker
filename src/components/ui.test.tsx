import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { Button, Chip, EmptyState } from './ui'

describe('Button', () => {
  it('renders its children and fires onClick', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Press me</Button>)
    const btn = screen.getByRole('button', { name: /Press me/i })
    expect(btn).toBeInTheDocument()
    await user.click(btn)
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

describe('Chip', () => {
  it('sets aria-pressed when active and used as a toggle (no role)', () => {
    render(<Chip active>Tag</Chip>)
    const chip = screen.getByRole('button', { name: /Tag/i })
    expect(chip).toHaveAttribute('aria-pressed', 'true')
  })

  it('omits aria-pressed when given a radio role and reflects aria-checked', () => {
    render(
      <Chip active role="radio" aria-checked>
        Option
      </Chip>,
    )
    const chip = screen.getByRole('radio', { name: /Option/i })
    expect(chip).not.toHaveAttribute('aria-pressed')
    expect(chip).toHaveAttribute('aria-checked', 'true')
  })
})

describe('EmptyState', () => {
  it('renders its text', () => {
    render(<EmptyState emoji="🌱">Nothing here yet</EmptyState>)
    expect(screen.getByText(/Nothing here yet/i)).toBeInTheDocument()
  })
})

describe('ui accessibility', () => {
  it('has no violations on a small composition', async () => {
    const { container } = render(
      <main>
        <Button>Save</Button>
        <Chip active>Active tag</Chip>
        <EmptyState emoji="🌱">A calm empty state</EmptyState>
      </main>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
