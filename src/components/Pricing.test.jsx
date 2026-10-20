import { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import Pricing from './Pricing'

function Harness() {
  const [audience, setAudience] = useState('individuals')
  return <Pricing audience={audience} onAudienceChange={setAudience} />
}

function renderPricing() {
  return render(
    <MemoryRouter>
      <Harness />
    </MemoryRouter>,
  )
}

describe('Pricing tabs', () => {
  it('shows individual plans by default', () => {
    renderPricing()
    expect(screen.getByRole('heading', { name: 'Essential ITR' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'GST Registration' })).not.toBeInTheDocument()
  })

  it('switches to business plans without leaving the page', () => {
    renderPricing()
    fireEvent.click(screen.getByRole('tab', { name: 'Businesses' }))

    expect(screen.getByRole('tab', { name: 'Businesses' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('heading', { name: 'GST Registration' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Essential ITR' })).not.toBeInTheDocument()
  })

  it('moves between tabs with the arrow keys', () => {
    renderPricing()
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Individuals' }), { key: 'ArrowRight' })
    expect(screen.getByRole('tab', { name: 'Businesses' })).toHaveAttribute('aria-selected', 'true')

    fireEvent.keyDown(screen.getByRole('tab', { name: 'Businesses' }), { key: 'End' })
    expect(screen.getByRole('tab', { name: 'Startups' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('heading', { name: 'Business Advisory' })).toBeInTheDocument()
  })

  it('gives every visible plan both WhatsApp actions', () => {
    renderPricing()
    expect(screen.getAllByRole('button', { name: /Choose This Plan/ })).toHaveLength(3)
    expect(screen.getAllByRole('button', { name: /Ask on WhatsApp/ })).toHaveLength(3)
  })
})
