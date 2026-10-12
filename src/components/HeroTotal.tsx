import { useState, type CSSProperties } from 'react'
import type { Totals } from '../lib/calc'
import { formatMoney } from '../lib/format'
import type { Currency } from '../lib/types'
import { AnimatedAmount } from './AnimatedAmount'

type Period = keyof Totals

const PERIODS: { key: Period; label: string; caption: string }[] = [
  { key: 'monthly', label: 'Aylık', caption: 'her ay hesabından çıkan' },
  { key: 'yearly', label: 'Yıllık', caption: 'bir yılda aboneliklere giden' },
  { key: 'weekly', label: 'Haftalık', caption: 'her hafta ödediğin' },
  { key: 'daily', label: 'Günlük', caption: 'her gün, sen uyurken bile' },
]

interface Props {
  totals: Totals
  currency: Currency
  count: number
  priciest: { name: string; monthly: number } | null
}

export function HeroTotal({ totals, currency, count, priciest }: Props) {
  const [period, setPeriod] = useState<Period>('monthly')
  const active = PERIODS.find((p) => p.key === period)!
  const activeIndex = PERIODS.indexOf(active)

  return (
    <section className="card hero">
      <div className="tabs" role="tablist" aria-label="Dönem" style={{ '--i': activeIndex } as CSSProperties}>
        <span className="tabs__pill" aria-hidden="true" />
        {PERIODS.map((p) => (
          <button
            key={p.key}
            role="tab"
            aria-selected={p.key === period}
            className="tabs__tab"
            onClick={() => setPeriod(p.key)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <p className="hero__caption">{active.caption}</p>
      <AnimatedAmount key={currency} value={totals[period]} currency={currency} className="hero__amount" />

      <dl className="hero__stats">
        <div>
          <dt>Abonelik</dt>
          <dd>{count}</dd>
        </div>
        <div>
          <dt>Ortalama</dt>
          <dd>{count ? formatMoney(totals.monthly / count, currency) : '—'}<small>/ay</small></dd>
        </div>
        <div>
          <dt>En pahalısı</dt>
          <dd>{priciest ? priciest.name : '—'}</dd>
        </div>
        <div>
          <dt>5 yılda</dt>
          <dd>{formatMoney(totals.yearly * 5, currency, 0)}</dd>
        </div>
      </dl>
    </section>
  )
}
