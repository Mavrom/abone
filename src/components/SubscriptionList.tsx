import { useMemo, useState } from 'react'
import { commitmentDaysLeft, monthlyCost, nextPaymentDate } from '../lib/calc'
import { CYCLE_LABEL, CYCLE_SUFFIX, commitmentLabel, formatDate, formatMoney } from '../lib/format'
import type { Currency, Rates, Subscription } from '../lib/types'
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
}

export function SubscriptionList({ subs, currency, rates, onAdd, onEdit }: Props) {
  const [sort, setSort] = useState<SortKey>('cost')

  const rows = useMemo(() => {
    const withCost = subs.map((s) => ({
      sub: s,
      monthly: monthlyCost(s, currency, rates),
      next: nextPaymentDate(s),
      commitment: commitmentDaysLeft(s),
    }))
    return withCost.sort((a, b) => {
      if (sort === 'cost') return b.monthly - a.monthly
      if (sort === 'date') return a.next.getTime() - b.next.getTime()
      return a.sub.name.localeCompare(b.sub.name, 'tr')
    })
  }, [subs, currency, rates, sort])

  return (
    <section className="panel subs">
      <header className="panel__head">
        <h2 className="panel__title">Abonelikler</h2>
        <div className="sort" role="group" aria-label="Sırala">
          {SORTS.map((s) => (
            <button
              key={s.key}
              className={sort === s.key ? 'is-active' : ''}
              aria-pressed={sort === s.key}
              onClick={() => setSort(s.key)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </header>

      <ul className="subs__list">
        {rows.map(({ sub, monthly, next, commitment }) => (
          <li key={sub.id}>
            <button className="sub-row" onClick={() => onEdit(sub)}>
              <ServiceIcon serviceId={sub.serviceId} name={sub.name} />
              <span className="sub-row__main">
                <span className="sub-row__name">{sub.name}</span>
                <span className="sub-row__meta">
                  {sub.plan && sub.plan !== CYCLE_LABEL[sub.cycle]
                    ? `${sub.plan} · ${CYCLE_LABEL[sub.cycle]}`
                    : CYCLE_LABEL[sub.cycle]}
                  {commitment !== null && (
                    <span className={commitment <= 30 ? 'is-soon' : ''}> · {commitmentLabel(commitment)}</span>
                  )}
                </span>
              </span>
              <span className="sub-row__date">{formatDate(next)}</span>
              <span className="sub-row__price">
                <span className="sub-row__monthly">{formatMoney(monthly, currency)}</span>
                {(sub.cycle !== 'monthly' || sub.currency !== currency) && (
                  <span className="sub-row__orig">
                    {formatMoney(sub.price, sub.currency)}
                    {CYCLE_SUFFIX[sub.cycle]}
                  </span>
                )}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <button className="add-row" onClick={onAdd}>
        + Abonelik ekle
      </button>
    </section>
  )
}
