import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import Toolkit from './Toolkit'

function renderToolkit() {
  return render(
    <MemoryRouter>
      <Toolkit />
    </MemoryRouter>,
  )
}

describe('Toolkit', () => {
  it('renders the title and several intervention titles', () => {
    renderToolkit()
    expect(screen.getByRole('heading', { level: 1, name: 'Toolkit' })).toBeTruthy()
    // Several intervention titles from the library are rendered as headings.
    expect(screen.getByRole('heading', { name: /grounding/i })).toBeTruthy()
    expect(screen.getByRole('heading', { name: /one slow breath cycle/i })).toBeTruthy()
    expect(screen.getByRole('heading', { name: /reset walk/i })).toBeTruthy()
  })

  it('renders the Breathe with me card with the exercise', () => {
    renderToolkit()
    expect(screen.getByRole('heading', { name: 'Breathe with me' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Start' })).toBeTruthy()
  })

  it('has no accessibility violations', async () => {
    const { container } = renderToolkit()
    expect(await axe(container)).toHaveNoViolations()
  })
})
