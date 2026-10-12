import { useMemo, useState } from 'react'
import { monthlyCost, nextPaymentDate } from '../lib/calc'
import { CYCLE_LABEL, CYCLE_SUFFIX, formatMoney } from '../lib/format'
import type { Currency, Rates, Subscription } from '../lib/types'
import { Card } from './Card'
import { ServiceIcon } from './ServiceIcon'

type SortKey = 'cost' | 'date' | 'name'

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'cost', label: 'Tutar' },
  { key: 'date', label: 'Tarih' },
  { key: 'name', label: 'İsim' },
]

interface Props {
  subs: Subscription[]
  currency: Currency
  rates: Rates
  onAdd: () => void
  onEdit: (sub: Subscription) => void
  onRemove: (id: string) => void
}

export function SubscriptionList({ subs, currency, rates, onAdd, onEdit, onRemove }: Props) {
  const [sort, setSort] = useState<SortKey>('cost')
  const [confirming, setConfirming] = useState<string | null>(null)

  const rows = useMemo(() => {
    const withCost = subs.map((s) => ({
      sub: s,
      monthly: monthlyCost(s, currency, rates),
      next: nextPaymentDate(s),
    }))
    const max = Math.max(...withCost.map((r) => r.monthly), 1)
    const sorted = [...withCost].sort((a, b) => {
      if (sort === 'cost') return b.monthly - a.monthly
      if (sort === 'date') return a.next.getTime() - b.next.getTime()
      return a.sub.name.localeCompare(b.sub.name, 'tr')
    })
    return sorted.map((r) => ({ ...r, ratio: r.monthly / max }))
  }, [subs, currency, rates, sort])

  return (
    <Card
      index="06"
      title="Abonelikler"
      className="subs"
      aside={
        subs.length > 1 && (
          <div className="sort" role="group" aria-label="Sırala">
            {SORTS.map((s) => (
              <button
                key={s.key}
                className={`sort__btn ${sort === s.key ? 'is-active' : ''}`}
                onClick={() => setSort(s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>
        )
      }
    >
      <ul className="subs__list">
        {rows.map(({ sub, monthly, ratio }, i) => (
          <li
            key={sub.id}
            className="sub-row"
            style={{ animationDelay: `${i * 40}ms` }}
            onClick={() => onEdit(sub)}
            onKeyDown={(e) => e.key === 'Enter' && e.target === e.currentTarget && onEdit(sub)}
            tabIndex={0}
            aria-label={`${sub.name} düzenle`}
          >
            <ServiceIcon serviceId={sub.serviceId} name={sub.name} color={sub.color} size={44} />
            <div className="sub-row__main">
              <span className="sub-row__name">{sub.name}</span>
              <span className="sub-row__meta">
                {sub.plan && <span>{sub.plan}</span>}
                <span className="dot" />
                <span>{CYCLE_LABEL[sub.cycle]}</span>
              </span>
            </div>
            <div className="sub-row__bar" aria-hidden="true">
              <span style={{ transform: `scaleX(${ratio})`, background: sub.color }} />
            </div>
            <div className="sub-row__price">
              <span className="sub-row__monthly">
                {formatMoney(monthly, currency)}
                <small>/ay</small>
              </span>
              <span className="sub-row__orig">
                {formatMoney(sub.price, sub.currency)}
                {CYCLE_SUFFIX[sub.cycle]}
              </span>
            </div>
            <div className="sub-row__actions" onClick={(e) => e.stopPropagation()}>
              <button className="icon-btn" aria-label={`${sub.name} düzenle`} onClick={() => onEdit(sub)}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4" strokeLinejoin="round" />
                </svg>
              </button>
              {confirming === sub.id ? (
                <button
                  className="icon-btn icon-btn--danger is-confirm"
                  onClick={() => onRemove(sub.id)}
                  onBlur={() => setConfirming(null)}
                  autoFocus
                >
                  Sil?
                </button>
              ) : (
                <button
                  className="icon-btn icon-btn--danger"
                  aria-label={`${sub.name} sil`}
                  onClick={() => setConfirming(sub.id)}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 7h14M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
      <button className="add-row" onClick={onAdd}>
        <span className="add-row__plus">+</span>
        Yeni abonelik ekle
      </button>
    </Card>
  )
}
