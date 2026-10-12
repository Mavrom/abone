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
  const inDays = (n: number) => toISODate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + n))
  const picks: { id: string; plan: string; offset: number; commitmentDays?: number }[] = [
    { id: 'tt-internet', plan: '100 Mbps', offset: 6, commitmentDays: 214 },
    { id: 'turkcell', plan: '20 GB', offset: 11, commitmentDays: 47 },
    { id: 'netflix', plan: 'Standart', offset: 3 },
    { id: 'spotify', plan: 'Bireysel', offset: 9 },
    { id: 'chatgpt', plan: 'Plus', offset: 1 },
    { id: 'youtube', plan: 'Bireysel', offset: 22 },
    { id: 'icloud', plan: '200 GB', offset: 5 },
    { id: 'trendyol', plan: 'Aylık', offset: 17 },
    { id: 'tod', plan: 'Süper Lig', offset: 13 },
  ]
  return picks.map(({ id, plan: planName, offset, commitmentDays }) => {
    const service = SERVICE_BY_ID.get(id)!
    const plan = service.plans.find((p) => p.name === planName)!
    return {
      id: newId(),
      serviceId: id,
      name: service.name,
      plan: plan.name,
      price: plan.price,
      currency: plan.currency,
      cycle: plan.cycle,
      billingDate: inDays(offset),
      category: service.category,
      ...(commitmentDays ? { commitmentEnd: inDays(commitmentDays) } : {}),
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
