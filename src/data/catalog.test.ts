import { describe, expect, it } from 'vitest'
import { CATALOG, CATEGORY_META, SERVICE_BY_ID, matchesService } from './catalog'

describe('catalog', () => {
  it('has unique ids', () => {
    expect(SERVICE_BY_ID.size).toBe(CATALOG.length)
  })

  it('gives every service an icon or monogram, a known category and valid plans', () => {
    for (const s of CATALOG) {
      expect(s.iconPath || s.monogram, s.id).toBeTruthy()
      expect(CATEGORY_META[s.category], s.id).toBeDefined()
      expect(s.plans.length, s.id).toBeGreaterThan(0)
      for (const p of s.plans) expect(p.price, `${s.id} ${p.name}`).toBeGreaterThan(0)
      expect(new Set(s.plans.map((p) => p.name)).size, s.id).toBe(s.plans.length)
    }
  })

  it('covers Turkish home internet and mobile operators', () => {
    const names = (cat: string) => CATALOG.filter((s) => s.category === cat).map((s) => s.id)
    expect(names('internet')).toEqual(expect.arrayContaining(['tt-internet', 'superonline', 'vodafone-net', 'turknet']))
    expect(names('mobile')).toEqual(expect.arrayContaining(['turkcell', 'vodafone', 'tt-mobil']))
  })
})

describe('matchesService', () => {
  const tt = SERVICE_BY_ID.get('tt-internet')!
  const trendyol = SERVICE_BY_ID.get('trendyol')!

  it('matches names and aliases, ignoring case with Turkish rules', () => {
    expect(matchesService(tt, 'TÜRK TELEKOM')).toBe(true)
    expect(matchesService(tt, 'ttnet')).toBe(true)
    expect(matchesService(trendyol, 'trendyol go')).toBe(true)
    expect(matchesService(trendyol, 'netflix')).toBe(false)
  })

  it('matches everything for an empty query', () => {
    expect(matchesService(tt, '  ')).toBe(true)
  })
})
