import { CATEGORY_META } from '../data/catalog'
import type { CategoryShare } from '../lib/calc'
import { formatMoney } from '../lib/format'
import type { Currency } from '../lib/types'
import { Card } from './Card'

interface Props {
  shares: CategoryShare[]
  currency: Currency
}

export function CategoryBreakdown({ shares, currency }: Props) {
  return (
    <Card index="03" title="Kategoriler" className="categories">
      {shares.length === 0 ? (
        <p className="muted">Abonelik ekledikçe paranın nereye gittiği burada görünecek.</p>
      ) : (
        <>
          <div className="stack-bar" role="img" aria-label="Kategori dağılımı">
            {shares.map((s) => (
              <span
                key={s.category}
                className="stack-bar__seg"
                style={{ flexGrow: s.share, background: CATEGORY_META[s.category].color }}
              />
            ))}
          </div>
          <ul className="legend">
            {shares.map((s) => (
              <li key={s.category} className="legend__row">
                <span className="legend__dot" style={{ background: CATEGORY_META[s.category].color }} />
                <span className="legend__name">{CATEGORY_META[s.category].label}</span>
                <span className="legend__pct">%{Math.round(s.share * 100)}</span>
                <span className="legend__amt">{formatMoney(s.monthly, currency, 0)}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  )
}
