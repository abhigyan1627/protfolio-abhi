import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import ServiceFinder from './ServiceFinder'

function renderFinder() {
  return render(
    <MemoryRouter>
      <ServiceFinder />
    </MemoryRouter>,
  )
}

describe('ServiceFinder', () => {
  it('starts with a prompt and no plans', () => {
    renderFinder()
    expect(screen.getByText(/Answer a few short questions/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Continue on WhatsApp/ })).not.toBeInTheDocument()
  })

  it('updates the services, plans and summary as each choice is made', () => {
    renderFinder()

    fireEvent.click(screen.getByRole('radio', { name: /^Startup/ }))
    expect(screen.getByRole('radio', { name: /Company Incorporation Assistance/ })).toBeInTheDocument()
    expect(screen.getByText('Startup', { selector: 'p' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('radio', { name: /Company Incorporation Assistance/ }))
    expect(screen.getByRole('button', { name: /Startup Essentials/ })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: /Continue on WhatsApp/ })).toBeInTheDocument()
  })

  it('lets the visitor select a matching plan', () => {
    renderFinder()
    fireEvent.click(screen.getByRole('radio', { name: /^Startup/ }))
    fireEvent.click(screen.getByRole('radio', { name: /Company Incorporation Assistance/ }))
    fireEvent.click(screen.getByRole('button', { name: /Startup Essentials/ }))

    expect(screen.getByRole('button', { name: /Startup Essentials/ })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Startup › Company Incorporation Assistance › Startup Essentials')).toBeInTheDocument()
  })

  it('shows an empty state when a service has no standard plan', () => {
    renderFinder()
    fireEvent.click(screen.getByRole('radio', { name: /^Individual/ }))
    fireEvent.click(screen.getByRole('radio', { name: /Tax Planning Assistance/ }))

    expect(screen.getByText('No standard plan is listed for this service yet.')).toBeInTheDocument()
  })

  it('resets to the first step', () => {
    renderFinder()
    fireEvent.click(screen.getByRole('radio', { name: /^Individual/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Start again' }))

    expect(screen.getByText(/Answer a few short questions/)).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /^Individual/ })).not.toBeChecked()
  })
})
