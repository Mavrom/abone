import { useCallback } from 'react'
import { SERVICE_BY_ID } from '../data/catalog'
import { toISODate } from '../lib/format'
import type { Subscription } from '../lib/types'
import { useLocalStorage } from './useLocalStorage'

function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)
}

function demoSubscriptions(): Subscription[] {
  const today = new Date()
  const picks: [string, string, number][] = [
    ['netflix', 'Standart', 3],
    ['spotify', 'Bireysel', 9],
    ['chatgpt', 'Plus', 1],
    ['claude', 'Pro', 17],
    ['youtube', 'Bireysel', 22],
    ['icloud', '200 GB', 5],
    ['gamepass', 'Ultimate', 13],
    ['exxen', 'Exxen', 27],
  ]
  return picks.map(([serviceId, planName, offset]) => {
    const service = SERVICE_BY_ID.get(serviceId)!
    const plan = service.plans.find((p) => p.name === planName)!
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset)
    return {
      id: newId(),
      serviceId,
      name: service.name,
      plan: plan.name,
      price: plan.price,
      currency: plan.currency,
      cycle: plan.cycle,
      billingDate: toISODate(date),
      category: service.category,
      color: service.color,
    }
  })
}

export function useSubscriptions() {
  const [subs, setSubs] = useLocalStorage<Subscription[]>('subs.v1', [])

  const save = useCallback(
    (input: Omit<Subscription, 'id'> & { id?: string }) => {
      setSubs((prev) => {
        if (input.id && prev.some((s) => s.id === input.id)) {
          return prev.map((s) => (s.id === input.id ? ({ ...input, id: s.id } as Subscription) : s))
        }
        return [...prev, { ...input, id: newId() }]
      })
    },
    [setSubs],
  )

  const remove = useCallback((id: string) => setSubs((prev) => prev.filter((s) => s.id !== id)), [setSubs])
  const clear = useCallback(() => setSubs([]), [setSubs])
  const loadDemo = useCallback(() => setSubs(demoSubscriptions()), [setSubs])

  return { subs, save, remove, clear, loadDemo }
}
