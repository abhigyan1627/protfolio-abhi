import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import Navbar from './Navbar'

function renderNavbar(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Navbar />
    </MemoryRouter>,
  )
}

describe('Navbar', () => {
  it('marks the current page in the primary navigation', () => {
    renderNavbar('/pricing')
    const primary = screen.getByRole('navigation', { name: 'Primary' })
    expect(within(primary).getByRole('link', { name: 'Pricing' })).toHaveAttribute('aria-current', 'page')
    expect(within(primary).getByRole('link', { name: 'Services' })).not.toHaveAttribute('aria-current')
  })

  it('opens and closes the mobile menu from the toggle and the Escape key', () => {
    renderNavbar()
    const toggle = screen.getByRole('button', { name: 'Open menu' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(toggle)
    const openToggle = screen.getByRole('button', { name: 'Close menu' })
    expect(openToggle).toHaveAttribute('aria-expanded', 'true')

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes the mobile menu from its own close button', () => {
    renderNavbar()
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    fireEvent.click(screen.getByRole('button', { name: 'Close menu' }))
    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument()
  })
})
