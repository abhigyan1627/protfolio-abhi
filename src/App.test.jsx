import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import App from './App'

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('App routing', () => {
  it('renders the home page hero', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { level: 1, name: /Financial Clarity for Every Stage/ })).toBeInTheDocument()
  })

  it('navigates to the pricing page from the primary navigation', () => {
    renderAt('/')
    const primary = screen.getByRole('navigation', { name: 'Primary' })
    fireEvent.click(within(primary).getByRole('link', { name: 'Pricing' }))
    expect(screen.getByRole('heading', { level: 1, name: /Choose a plan/ })).toBeInTheDocument()
  })

  it('renders a service detail page for a known service', () => {
    renderAt('/services/gst-registration')
    expect(screen.getByRole('heading', { level: 1, name: 'GST Registration' })).toBeInTheDocument()
  })

  it('renders the not-found page for an unknown service', () => {
    renderAt('/services/does-not-exist')
    expect(screen.getByRole('heading', { level: 1, name: 'This page could not be found' })).toBeInTheDocument()
  })
})
