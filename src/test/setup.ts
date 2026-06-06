import '@testing-library/jest-dom/vitest'
import { afterEach, expect } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as axeMatchers from 'vitest-axe/matchers'

expect.extend(axeMatchers)

// jsdom doesn't implement matchMedia; framer-motion + reduced-motion checks need it.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList
}

// jsdom doesn't implement canvas; axe-core's icon-ligature check probes getContext.
// jsdom defines getContext but throws "Not implemented"; axe-core probes it. Stub it.
HTMLCanvasElement.prototype.getContext =
  (() => null) as typeof HTMLCanvasElement.prototype.getContext

// jsdom lacks ResizeObserver, which recharts ResponsiveContainer relies on.
if (!('ResizeObserver' in window)) {
  // @ts-expect-error - minimal stub for tests
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

afterEach(() => {
  cleanup()
  sessionStorage.clear()
})
