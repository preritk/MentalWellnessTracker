import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { axe } from 'vitest-axe'
import { beforeEach, describe, expect, it } from 'vitest'
import { __resetStoreCache } from '../lib/storage'
import ExamMode from './ExamMode'

beforeEach(() => {
  sessionStorage.clear()
  __resetStoreCache()
})

function renderExamMode() {
  return render(
    <MemoryRouter>
      <ExamMode />
    </MemoryRouter>,
  )
}

describe('ExamMode', () => {
  it('renders the title and the calm anchor statement', () => {
    renderExamMode()
    expect(screen.getByRole('heading', { level: 1, name: 'Exam Mode' })).toBeTruthy()
    expect(screen.getByText('You’ve prepared. Now you just show up.')).toBeTruthy()
  })

  it('renders a back link to home', () => {
    renderExamMode()
    const back = screen.getByRole('link', { name: /Back/ })
    expect(back.getAttribute('href')).toBe('/')
  })

  it('has no accessibility violations', async () => {
    const { container } = renderExamMode()
    expect(await axe(container)).toHaveNoViolations()
  })
})
