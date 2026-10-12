import { describe, expect, it } from 'vitest'
import {
  byCategory,
  commitmentDaysLeft,
  convert,
  equivalents,
  monthlyCost,
  nextPaymentDate,
  totals,
  upcoming,
} from './calc'
import type { Rates, Subscription } from './types'

const rates: Rates = { TRY: 1, USD: 40, EUR: 50 }

function sub(over: Partial<Subscription> = {}): Subscription {
  return {
    id: 'x',
    serviceId: null,
    name: 'Test',
    plan: 'Plan',
    price: 100,
    currency: 'TRY',
    cycle: 'monthly',
    billingDate: '2026-01-15',
    category: 'video',
    ...over,
  }
}

describe('convert', () => {
  it('returns same amount for same currency', () => {
    expect(convert(10, 'USD', 'USD', rates)).toBe(10)
  })
  it('converts via TRY', () => {
    expect(convert(10, 'USD', 'TRY', rates)).toBe(400)
    expect(convert(400, 'TRY', 'USD', rates)).toBe(10)
    expect(convert(10, 'EUR', 'USD', rates)).toBe(12.5)
  })
})

describe('monthlyCost', () => {
  it('normalizes every cycle to a month', () => {
    expect(monthlyCost(sub({ cycle: 'monthly', price: 120 }), 'TRY', rates)).toBe(120)
    expect(monthlyCost(sub({ cycle: 'yearly', price: 120 }), 'TRY', rates)).toBe(10)
    expect(monthlyCost(sub({ cycle: 'quarterly', price: 120 }), 'TRY', rates)).toBe(40)
    expect(monthlyCost(sub({ cycle: 'weekly', price: 12 }), 'TRY', rates)).toBe(52)
  })
  it('converts to display currency', () => {
    expect(monthlyCost(sub({ price: 20, currency: 'USD' }), 'TRY', rates)).toBe(800)
  })
})

describe('totals', () => {
  it('sums monthly and derives yearly, weekly and daily', () => {
    const t = totals(
      [sub({ price: 100 }), sub({ price: 10, currency: 'USD' }), sub({ price: 1200, cycle: 'yearly' })],
      'TRY',
      rates,
    )
    expect(t.monthly).toBe(600)
    expect(t.yearly).toBe(7200)
    expect(t.daily).toBeCloseTo(7200 / 365)
    expect(t.weekly).toBeCloseTo(7200 / 52)
  })
  it('is zero for no subscriptions', () => {
    expect(totals([], 'TRY', rates)).toEqual({ monthly: 0, yearly: 0, weekly: 0, daily: 0 })
  })
})

describe('byCategory', () => {
  it('groups, sorts by cost and computes share', () => {
    const r = byCategory(
      [
        sub({ category: 'music', price: 100 }),
        sub({ category: 'video', price: 250 }),
        sub({ category: 'music', price: 50 }),
      ],
      'TRY',
      rates,
    )
    expect(r).toEqual([
      { category: 'video', monthly: 250, share: 0.625 },
      { category: 'music', monthly: 150, share: 0.375 },
    ])
  })
})

describe('nextPaymentDate', () => {
  const today = new Date(2026, 9, 12) // 12 Oct 2026

  it('keeps a future billing date as is', () => {
    expect(nextPaymentDate(sub({ billingDate: '2026-10-20' }), today)).toEqual(new Date(2026, 9, 20))
  })
  it('counts today as the next payment', () => {
    expect(nextPaymentDate(sub({ billingDate: '2026-10-12' }), today)).toEqual(new Date(2026, 9, 12))
  })
  it('rolls a past monthly date forward', () => {
    expect(nextPaymentDate(sub({ billingDate: '2026-01-05' }), today)).toEqual(new Date(2026, 10, 5))
  })
  it('clamps to the last day of short months without drifting', () => {
    const t = new Date(2026, 1, 10) // 10 Feb 2026
    expect(nextPaymentDate(sub({ billingDate: '2026-01-31' }), t)).toEqual(new Date(2026, 1, 28))
    const t2 = new Date(2026, 2, 1) // 1 Mar 2026
    expect(nextPaymentDate(sub({ billingDate: '2026-01-31' }), t2)).toEqual(new Date(2026, 2, 31))
  })
  it('handles yearly, quarterly and weekly cycles', () => {
    expect(nextPaymentDate(sub({ cycle: 'yearly', billingDate: '2024-03-01' }), today)).toEqual(
      new Date(2027, 2, 1),
    )
    expect(nextPaymentDate(sub({ cycle: 'quarterly', billingDate: '2026-01-20' }), today)).toEqual(
      new Date(2026, 9, 20),
    )
    expect(nextPaymentDate(sub({ cycle: 'weekly', billingDate: '2026-10-01' }), today)).toEqual(
      new Date(2026, 9, 15),
    )
  })
})

describe('upcoming', () => {
  it('returns the next n payments sorted by date with days left', () => {
    const today = new Date(2026, 9, 12)
    const r = upcoming(
      [
        sub({ id: 'a', billingDate: '2026-10-25' }),
        sub({ id: 'b', billingDate: '2026-10-13' }),
        sub({ id: 'c', billingDate: '2026-10-18' }),
      ],
      today,
      2,
    )
    expect(r.map((u) => u.sub.id)).toEqual(['b', 'c'])
    expect(r.map((u) => u.daysLeft)).toEqual([1, 6])
  })
})

describe('equivalents', () => {
  it('counts how many items the yearly amount buys', () => {
    const r = equivalents(1000, [
      { id: 'tea', label: 'çay', emoji: '🍵', priceTRY: 30 },
      { id: 'big', label: 'pahalı', emoji: '💎', priceTRY: 5000 },
    ])
    expect(r).toEqual([
      { id: 'tea', label: 'çay', emoji: '🍵', priceTRY: 30, count: 33 },
      { id: 'big', label: 'pahalı', emoji: '💎', priceTRY: 5000, count: 0 },
    ])
  })
})

describe('commitmentDaysLeft', () => {
  const today = new Date(2026, 9, 12)

  it('is null without a commitment', () => {
    expect(commitmentDaysLeft(sub(), today)).toBeNull()
  })
  it('counts days until the commitment ends', () => {
    expect(commitmentDaysLeft(sub({ commitmentEnd: '2026-10-22' }), today)).toBe(10)
    expect(commitmentDaysLeft(sub({ commitmentEnd: '2026-10-12' }), today)).toBe(0)
  })
  it('is negative once the commitment has ended', () => {
    expect(commitmentDaysLeft(sub({ commitmentEnd: '2026-10-01' }), today)).toBe(-11)
  })
})
