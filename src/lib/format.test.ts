import { describe, expect, it } from 'vitest'
import { parsePrice } from './format'

describe('parsePrice', () => {
  it('parses dot and Turkish comma decimals', () => {
    expect(parsePrice('249.99')).toBe(249.99)
    expect(parsePrice('249,99')).toBe(249.99)
  })
  it('strips Turkish thousand separators, spaces and symbols', () => {
    expect(parsePrice('1.499,99')).toBe(1499.99)
    expect(parsePrice(' ₺ 1.499,99 ')).toBe(1499.99)
  })
  it('returns NaN for garbage', () => {
    expect(parsePrice('abc')).toBeNaN()
  })
})
