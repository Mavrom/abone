import { useEffect, useRef, useState } from 'react'
import { CURRENCY_SYMBOL, splitAmount } from '../lib/format'
import type { Currency } from '../lib/types'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function useTweened(target: number, duration = 900): number {
  const [value, setValue] = useState(target)
  const fromRef = useRef(target)
  const reduced = prefersReducedMotion()

  useEffect(() => {
    if (reduced) {
      fromRef.current = target
      return
    }
    const from = fromRef.current
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(2, -10 * t) // easeOutExpo
      const current = from + (target - from) * (t === 1 ? 1 : eased)
      fromRef.current = current
      setValue(current)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration, reduced])

  return reduced ? target : value
}

interface Props {
  value: number
  currency: Currency
  className?: string
}

export function AnimatedAmount({ value, currency, className = '' }: Props) {
  const tweened = useTweened(value)
  const { whole, fraction } = splitAmount(tweened)
  return (
    <span className={`amount ${className}`}>
      <span className="amount__symbol">{CURRENCY_SYMBOL[currency]}</span>
      <span className="amount__whole">{whole}</span>
      <span className="amount__fraction">,{fraction}</span>
    </span>
  )
}
