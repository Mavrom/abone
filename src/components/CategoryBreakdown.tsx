import { CATEGORY_META } from '../data/catalog'
import type { CategoryShare } from '../lib/calc'
import { formatMoney } from '../lib/format'
import type { Currency } from '../lib/types'

interface Props {
  shares: CategoryShare[]
  currency: Currency
}

/** Tones of the ink color, strongest for the biggest category. */
const TONES = [1, 0.62, 0.42, 0.28, 0.18, 0.12, 0.08]

export function CategoryBreakdown({ shares, currency }: Props) {
  return (
    <section className="panel">
      <header className="panel__head">
        <h2 className="panel__title">Dağılım</h2>
      </header>
      <div className="dist-bar" role="img" aria-label="Kategori dağılımı">
        {shares.map((s, i) => (
          <span key={s.category} style={{ flexGrow: s.share, opacity: TONES[i] ?? 0.08 }} />
        ))}
      </div>
      <ul className="dist">
        {shares.map((s, i) => (
          <li key={s.category} className="dist__row">
            <span className="dist__dot" style={{ opacity: TONES[i] ?? 0.08 }} />
            <span className="dist__name">{CATEGORY_META[s.category].label}</span>
            <span className="dist__pct">{Math.round(s.share * 100)}%</span>
            <span className="dist__amount">{formatMoney(s.monthly, currency, 0)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
