import type { Category, Currency, Cycle, Rates, Subscription } from './types'

const MONTHLY_FACTOR: Record<Cycle, number> = {
  weekly: 52 / 12,
  monthly: 1,
  quarterly: 1 / 3,
  yearly: 1 / 12,
}

const DAY_MS = 24 * 60 * 60 * 1000

export function convert(amount: number, from: Currency, to: Currency, rates: Rates): number {
  if (from === to) return amount
  return (amount * rates[from]) / rates[to]
}

export function monthlyCost(sub: Subscription, display: Currency, rates: Rates): number {
  return convert(sub.price * MONTHLY_FACTOR[sub.cycle], sub.currency, display, rates)
}

export interface Totals {
  monthly: number
  yearly: number
  weekly: number
  daily: number
}

export function totals(subs: Subscription[], display: Currency, rates: Rates): Totals {
  const monthly = subs.reduce((sum, s) => sum + monthlyCost(s, display, rates), 0)
  const yearly = monthly * 12
  return { monthly, yearly, weekly: yearly / 52, daily: yearly / 365 }
}

export interface CategoryShare {
  category: Category
  monthly: number
  share: number
}

export function byCategory(subs: Subscription[], display: Currency, rates: Rates): CategoryShare[] {
  const sums = new Map<Category, number>()
  for (const s of subs) {
    sums.set(s.category, (sums.get(s.category) ?? 0) + monthlyCost(s, display, rates))
  }
  const total = [...sums.values()].reduce((a, b) => a + b, 0)
  return [...sums.entries()]
    .map(([category, monthly]) => ({ category, monthly, share: total ? monthly / total : 0 }))
    .sort((a, b) => b.monthly - a.monthly)
}

function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

/** Adds months to the anchor date, clamping to the month's last day (31 Jan + 1 → 28 Feb). */
function addMonthsClamped(anchor: Date, months: number): Date {
  const target = new Date(anchor.getFullYear(), anchor.getMonth() + months, 1)
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate()
  target.setDate(Math.min(anchor.getDate(), lastDay))
  return target
}

export function nextPaymentDate(sub: Subscription, today: Date = new Date()): Date {
  const anchor = parseISODate(sub.billingDate)
  const now = startOfDay(today)
  if (anchor >= now) return anchor

  if (sub.cycle === 'weekly') {
    const weeks = Math.ceil((now.getTime() - anchor.getTime()) / (7 * DAY_MS))
    return new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate() + weeks * 7)
  }

  const step = sub.cycle === 'monthly' ? 1 : sub.cycle === 'quarterly' ? 3 : 12
  // Always step from the original anchor so clamped days (Feb 28) don't drift later months.
  let n = Math.max(
    0,
    Math.floor(((now.getFullYear() - anchor.getFullYear()) * 12 + now.getMonth() - anchor.getMonth()) / step),
  )
  let next = addMonthsClamped(anchor, n * step)
  while (next < now) next = addMonthsClamped(anchor, ++n * step)
  return next
}

export function daysBetween(from: Date, to: Date): number {
  return Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / DAY_MS)
}

export interface UpcomingPayment {
  sub: Subscription
  date: Date
  daysLeft: number
}

export function upcoming(subs: Subscription[], today: Date = new Date(), limit = 4): UpcomingPayment[] {
  return subs
    .map((sub) => {
      const date = nextPaymentDate(sub, today)
      return { sub, date, daysLeft: daysBetween(today, date) }
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, limit)
}

export interface EquivalentItem {
  id: string
  label: string
  emoji: string
  priceTRY: number
}

export function equivalents(yearlyTRY: number, items: EquivalentItem[]) {
  return items.map((item) => ({ ...item, count: Math.floor(yearlyTRY / item.priceTRY) }))
}
