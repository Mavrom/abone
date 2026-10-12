import { EQUIVALENT_ITEMS } from '../data/catalog'
import type { Totals } from '../lib/calc'
import { formatMoney, formatNumber } from '../lib/format'
import type { Currency } from '../lib/types'
import { AnimatedAmount } from './AnimatedAmount'

interface Props {
  totals: Totals
  currency: Currency
  count: number
  yearlyTRY: number
}

function equivalentNote(yearlyTRY: number): string | null {
  const item = [...EQUIVALENT_ITEMS].reverse().find((i) => yearlyTRY / i.priceTRY >= 12)
  if (!item) return null
  return `Yılda yaklaşık ${formatNumber(Math.floor(yearlyTRY / item.priceTRY))} ${item.label} eder.`
}

export function Summary({ totals, currency, count, yearlyTRY }: Props) {
  const note = equivalentNote(yearlyTRY)

  return (
    <section className="summary">
      <div className="summary__main">
        <span className="eyebrow">Aylık toplam</span>
        <AnimatedAmount key={currency} value={totals.monthly} currency={currency} className="summary__amount" />
        {note && <p className="summary__note">{note}</p>}
      </div>
      <dl className="summary__stats">
        <div>
          <dt>Yıllık</dt>
          <dd>{formatMoney(totals.yearly, currency)}</dd>
        </div>
        <div>
          <dt>Günlük</dt>
          <dd>{formatMoney(totals.daily, currency)}</dd>
        </div>
        <div>
          <dt>Ortalama</dt>
          <dd>{formatMoney(count ? totals.monthly / count : 0, currency)}</dd>
        </div>
        <div>
          <dt>Abonelik</dt>
          <dd>{count}</dd>
        </div>
      </dl>
    </section>
  )
}
