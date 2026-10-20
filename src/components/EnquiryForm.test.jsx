import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import EnquiryForm from './EnquiryForm'

function renderForm() {
  return render(
    <MemoryRouter>
      <EnquiryForm />
    </MemoryRouter>,
  )
}

describe('EnquiryForm', () => {
  it('shows field errors on an empty submit and does not claim anything was sent', () => {
    renderForm()
    fireEvent.click(screen.getByRole('button', { name: 'Prepare Enquiry for WhatsApp' }))

    expect(screen.getByText('Please enter your name.')).toBeInTheDocument()
    expect(screen.getByText('Please choose the service you are interested in.')).toBeInTheDocument()
    expect(screen.getByText('Please enter your 10-digit mobile number.')).toBeInTheDocument()
    expect(screen.getByText('Please confirm that the firm may contact you about your enquiry.')).toBeInTheDocument()
    expect(screen.queryByText(/has been received/)).not.toBeInTheDocument()
  })

  it('marks invalid fields for assistive technology', () => {
    renderForm()
    fireEvent.click(screen.getByRole('button', { name: 'Prepare Enquiry for WhatsApp' }))

    const name = screen.getByLabelText('Full name')
    expect(name).toHaveAttribute('aria-invalid', 'true')
    expect(name).toHaveAccessibleDescription('Please enter your name.')
  })

  it('prepares the enquiry for WhatsApp when no delivery endpoint is configured', () => {
    renderForm()
    fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Asha Verma' } })
    fireEvent.change(screen.getByLabelText('Service of interest'), { target: { value: 'itr-filing' } })
    fireEvent.change(screen.getByLabelText('Mobile number'), { target: { value: '9876543210' } })
    fireEvent.click(screen.getByRole('checkbox'))
    fireEvent.click(screen.getByRole('button', { name: 'Prepare Enquiry for WhatsApp' }))

    expect(screen.getByText('Your enquiry is ready for WhatsApp.')).toBeInTheDocument()
    expect(screen.getByText(/nothing has been sent/)).toBeInTheDocument()
    expect(screen.queryByText(/has been received/)).not.toBeInTheDocument()
  })
})
