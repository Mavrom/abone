import type { Currency, Cycle } from './types'

export const CURRENCY_SYMBOL: Record<Currency, string> = { TRY: '₺', USD: '$', EUR: '€' }

export const CYCLE_LABEL: Record<Cycle, string> = {
  weekly: 'Haftalık',
  monthly: 'Aylık',
  quarterly: '3 Aylık',
  yearly: 'Yıllık',
}

export const CYCLE_SUFFIX: Record<Cycle, string> = {
  weekly: '/hf',
  monthly: '/ay',
  quarterly: '/3ay',
  yearly: '/yıl',
}

const moneyFormatters = new Map<string, Intl.NumberFormat>()

export function formatMoney(value: number, currency: Currency, decimals = 2): string {
  const key = `${currency}:${decimals}`
  let f = moneyFormatters.get(key)
  if (!f) {
    f = new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
    moneyFormatters.set(key, f)
  }
  return f.format(value)
}

/** Splits a number into "1.234" and "56" using Turkish separators. */
export function splitAmount(value: number): { whole: string; fraction: string } {
  const [whole, fraction] = new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(value)
    .split(',')
  return { whole, fraction }
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('tr-TR').format(value)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short' }).format(date)
}

export function formatWeekday(date: Date): string {
  return new Intl.DateTimeFormat('tr-TR', { weekday: 'long' }).format(date)
}

export function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function daysLeftLabel(days: number): string {
  if (days === 0) return 'Bugün'
  if (days === 1) return 'Yarın'
  return `${days} gün`
}

/** Accepts both "1499.99" and Turkish "1.499,99". */
export function parsePrice(value: string): number {
  const v = value.replace(/[\s₺$€]/g, '')
  return Number(v.includes(',') ? v.replace(/\./g, '').replace(',', '.') : v)
}
