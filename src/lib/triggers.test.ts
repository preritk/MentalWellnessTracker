import { describe, expect, it } from 'vitest'
import { TRIGGERS, getTrigger, triggerLabel, triggerEmoji } from './triggers'

describe('triggers', () => {
  it('exposes the full curated taxonomy of 10 triggers', () => {
    expect(TRIGGERS).toHaveLength(10)
    expect(TRIGGERS.map((t) => t.id)).toContain('mock')
    expect(TRIGGERS.map((t) => t.id)).toContain('none')
  })

  it('getTrigger returns the matching entry', () => {
    const mock = getTrigger('mock')
    expect(mock).toBeDefined()
    expect(mock?.id).toBe('mock')
    expect(mock?.emoji).toBe('📝')
  })

  it('getTrigger returns undefined for an unknown id', () => {
    expect(getTrigger('does-not-exist')).toBeUndefined()
  })

  it('triggerLabel localises per language', () => {
    expect(triggerLabel('mock', 'en')).toBe('Mock test')
    expect(triggerLabel('mock', 'hi')).toBe('मॉक टेस्ट')
    expect(triggerLabel('mock', 'en')).not.toBe(triggerLabel('mock', 'hi'))
  })

  it('triggerLabel falls back to the id for an unknown trigger', () => {
    expect(triggerLabel('unknown-id', 'en')).toBe('unknown-id')
    expect(triggerLabel('unknown-id', 'hi')).toBe('unknown-id')
  })

  it('triggerEmoji falls back to a bullet for an unknown trigger', () => {
    expect(triggerEmoji('mock')).toBe('📝')
    expect(triggerEmoji('unknown-id')).toBe('•')
  })
})
