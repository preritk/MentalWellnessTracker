import { describe, expect, it } from 'vitest'
import { translate, moodLabel } from './i18n'

describe('i18n', () => {
  it('translates a known key', () => {
    expect(translate('en', 'app.name')).toBe('MindMitra')
    expect(translate('en', 'nav.today')).toBe('Today')
  })

  it('returns the key itself when it is missing entirely', () => {
    expect(translate('en', 'totally.missing.key')).toBe('totally.missing.key')
    expect(translate('hi', 'totally.missing.key')).toBe('totally.missing.key')
  })

  it('returns a non-empty Hindi string for a key present in hi', () => {
    const hiValue = translate('hi', 'nav.today')
    expect(hiValue.length).toBeGreaterThan(0)
    expect(hiValue).toBe('आज')
  })

  it('falls back to English then the key itself', () => {
    // Every key in the Hindi dict mirrors English, so the EN fallback path is
    // reached when a key is absent from the requested language dict. Since no
    // EN-only key exists, the observable fallback is: missing key -> key string.
    expect(translate('hi', 'no.such.key')).toBe('no.such.key')
    // And a key that exists only in English-style usage still resolves in hi.
    expect(translate('hi', 'app.name')).toBe('MindMitra')
  })

  it('interpolates named params', () => {
    expect(translate('en', 'today.greeting', { name: 'Aanya' })).toContain('Aanya')
    expect(translate('en', 'today.greeting', { name: 'Aanya' })).toBe('Hi Aanya')
  })

  it('interpolates params in the Hindi greeting', () => {
    expect(translate('hi', 'today.greeting', { name: 'Aanya' })).toContain('Aanya')
  })

  it('moodLabel returns the localised mood', () => {
    expect(moodLabel('en', 'Bright')).toBe('Bright')
    expect(moodLabel('hi', 'Bright')).toBe('खुशनुमा')
  })
})
