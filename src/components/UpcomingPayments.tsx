import type { UpcomingPayment } from '../lib/calc'
import { daysLeftLabel, formatDate, formatMoney } from '../lib/format'

interface Props {
  items: UpcomingPayment[]
}

export function UpcomingPayments({ items }: Props) {
  return (
    <section className="panel">
      <header className="panel__head">
        <h2 className="panel__title">Yaklaşan ödemeler</h2>
      </header>
      <ul className="upcoming">
        {items.map(({ sub, date, daysLeft }) => (
          <li key={sub.id} className="upcoming__row">
            <span className="upcoming__date">{formatDate(date)}</span>
            <span className="upcoming__name">{sub.name}</span>
            <span className="upcoming__amount">{formatMoney(sub.price, sub.currency)}</span>
            <span className={`upcoming__left ${daysLeft <= 3 ? 'is-soon' : ''}`}>{daysLeftLabel(daysLeft)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
