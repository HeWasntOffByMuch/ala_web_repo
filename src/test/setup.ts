import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// jsdom doesn't implement scrolling.
window.scrollTo = () => {}

afterEach(() => {
  cleanup()
  localStorage.clear()
})
