import { describe, expect, it } from 'vitest'
import { commitmentLabel, parsePrice } from './format'

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

describe('commitmentLabel', () => {
  it('describes ended, ending and running commitments', () => {
    expect(commitmentLabel(-3)).toBe('Taahhüt bitti')
    expect(commitmentLabel(0)).toBe('Taahhüt bugün bitiyor')
    expect(commitmentLabel(12)).toBe('Taahhüt 12 gün sonra bitiyor')
    expect(commitmentLabel(45)).toBe('Taahhüt: 1 ay kaldı')
    expect(commitmentLabel(365)).toBe('Taahhüt: 12 ay kaldı')
    expect(commitmentLabel(400)).toBe('Taahhüt: 13 ay kaldı')
  })
})
