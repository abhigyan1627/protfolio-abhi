import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
import '@testing-library/jest-dom/vitest'

// Vitest globals are off, so unmount rendered trees explicitly after every test.
afterEach(() => {
  cleanup()
})

// jsdom does not implement these browser APIs. Minimal stand-ins let the components run under test.
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })
}

window.scrollTo = () => {}
Element.prototype.scrollIntoView = () => {}
