import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { __resetStoreCache } from '../lib/storage'
import { CrisisModal } from './CrisisModal'

beforeEach(() => {
  sessionStorage.clear()
  __resetStoreCache()
})

describe('CrisisModal', () => {
  it('does not render the dialog when closed', () => {
    render(<CrisisModal open={false} onClose={() => {}} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders the dialog with all four helplines when open', () => {
    render(<CrisisModal open onClose={() => {}} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/Tele-MANAS/i)).toBeInTheDocument()
    expect(screen.getByText(/iCall/i)).toBeInTheDocument()
    expect(screen.getByText(/Vandrevala Foundation/i)).toBeInTheDocument()
    expect(screen.getByText(/KIRAN Mental Health/i)).toBeInTheDocument()
  })

  it('renders a tel: link for each helpline', () => {
    render(<CrisisModal open onClose={() => {}} />)
    const link = screen.getByRole('link', { name: /14416/ })
    expect(link).toHaveAttribute('href', 'tel:14416')
  })

  it('calls onClose when Escape is pressed', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<CrisisModal open onClose={onClose} />)
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<CrisisModal open onClose={() => {}} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
