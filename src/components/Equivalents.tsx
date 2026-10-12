import { EQUIVALENT_ITEMS } from '../data/catalog'
import { equivalents } from '../lib/calc'
import { formatNumber } from '../lib/format'
import { Card } from './Card'

interface Props {
  yearlyTRY: number
}

export function Equivalents({ yearlyTRY }: Props) {
  const items = equivalents(yearlyTRY, EQUIVALENT_ITEMS)

  return (
    <Card
      index="05"
      title="Bu parayla bir yılda"
      className="equivalents"
      aside={<span className="hint">yaklaşık fiyatlarla</span>}
    >
      <ul className="equivalents__grid">
        {items.map((item) => (
          <li key={item.id} className="equivalents__item">
            <span className="equivalents__emoji" aria-hidden="true">
              {item.emoji}
            </span>
            <span className="equivalents__count">{formatNumber(item.count)}</span>
            <span className="equivalents__label">{item.label}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
