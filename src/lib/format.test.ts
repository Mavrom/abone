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
  it('treats a dot followed by groups of three digits as a thousand separator', () => {
    expect(parsePrice('1.500')).toBe(1500)
    expect(parsePrice('12.000')).toBe(12000)
    expect(parsePrice('1.250.000')).toBe(1250000)
    expect(parsePrice('19.99')).toBe(19.99)
    expect(parsePrice('1.5')).toBe(1.5)
  })
  it('returns NaN for garbage', () => {
    expect(parsePrice('abc')).toBeNaN()
  })
})
