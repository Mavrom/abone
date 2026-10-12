import type { UpcomingPayment } from '../lib/calc'
import { daysLeftLabel, formatMoney } from '../lib/format'
import { Card } from './Card'
import { ServiceIcon } from './ServiceIcon'

interface Props {
  items: UpcomingPayment[]
}

export function UpcomingPayments({ items }: Props) {
  return (
    <Card index="04" title="Yaklaşan ödemeler" className="upcoming">
      {items.length === 0 ? (
        <p className="muted">Takvim boş. Şimdilik.</p>
      ) : (
        <ol className="upcoming__list">
          {items.map(({ sub, date, daysLeft }) => (
            <li key={sub.id} className="upcoming__row">
              <span className="upcoming__date">
                <span className="upcoming__day">{date.getDate()}</span>
                <span className="upcoming__month">
                  {new Intl.DateTimeFormat('tr-TR', { month: 'short' }).format(date)}
                </span>
              </span>
              <ServiceIcon serviceId={sub.serviceId} name={sub.name} color={sub.color} size={32} />
              <span className="upcoming__name">
                {sub.name}
                <small>{formatMoney(sub.price, sub.currency)}</small>
              </span>
              <span className={`chip ${daysLeft <= 3 ? 'chip--hot' : ''}`}>{daysLeftLabel(daysLeft)}</span>
            </li>
          ))}
        </ol>
      )}
    </Card>
  )
}
