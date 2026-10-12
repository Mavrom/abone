import { useCallback, useEffect, useState } from 'react'
import type { Rates } from '../lib/types'
import { useLocalStorage } from './useLocalStorage'

const FALLBACK: Rates = { TRY: 1, USD: 49.3, EUR: 55.1 }
const MAX_AGE_MS = 12 * 60 * 60 * 1000

interface RatesCache {
  rates: Rates
  date: string | null
  fetchedAt: number
}

export function useRates() {
  const [cache, setCache] = useLocalStorage<RatesCache>('rates.v1', {
    rates: FALLBACK,
    date: null,
    fetchedAt: 0,
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')

  const refresh = useCallback(async () => {
    setStatus('loading')
    try {
      const res = await fetch('https://api.frankfurter.dev/v1/latest?from=USD&to=TRY,EUR')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = (await res.json()) as { date: string; rates: { TRY: number; EUR: number } }
      const usd = data.rates.TRY
      setCache({
        rates: { TRY: 1, USD: usd, EUR: usd / data.rates.EUR },
        date: data.date,
        fetchedAt: Date.now(),
      })
      setStatus('idle')
    } catch {
      setStatus('error')
    }
  }, [setCache])

  useEffect(() => {
    if (Date.now() - cache.fetchedAt > MAX_AGE_MS) void refresh()
    // Only check freshness on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { rates: cache.rates, date: cache.date, live: cache.date !== null, status, refresh }
}
