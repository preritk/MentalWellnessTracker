import { describe, expect, it } from 'vitest'
import { buildSeed, applySeed, clearSeed } from './seed'
import { defaultStore } from './storage'

const NOW = Date.parse('2026-06-06T12:00:00')

describe('seed', () => {
  it('builds 21 check-ins ordered oldest -> newest', () => {
    const { checkIns } = buildSeed(NOW)
    expect(checkIns).toHaveLength(21)
    for (let i = 1; i < checkIns.length; i++) {
      expect(checkIns[i].ts).toBeGreaterThan(checkIns[i - 1].ts)
    }
  })

  it('builds at least one journal entry', () => {
    const { journal } = buildSeed(NOW)
    expect(journal.length).toBeGreaterThanOrEqual(1)
    expect(journal[0].text.length).toBeGreaterThan(0)
  })

  it('applySeed populates check-ins and marks the store seeded', () => {
    const seeded = applySeed(defaultStore(), NOW)
    expect(seeded.settings.seeded).toBe(true)
    expect(seeded.checkIns).toHaveLength(21)
    expect(seeded.journal.length).toBeGreaterThanOrEqual(1)
  })

  it('applySeed does not mutate the original store', () => {
    const original = defaultStore()
    applySeed(original, NOW)
    expect(original.checkIns).toHaveLength(0)
    expect(original.settings.seeded).toBe(false)
  })

  it('clearSeed empties logs and unsets seeded', () => {
    const seeded = applySeed(defaultStore(), NOW)
    const cleared = clearSeed(seeded)
    expect(cleared.checkIns).toHaveLength(0)
    expect(cleared.journal).toHaveLength(0)
    expect(cleared.settings.seeded).toBe(false)
  })
})
