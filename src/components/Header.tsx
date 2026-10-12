import { CURRENCY_SYMBOL } from '../lib/format'
import type { Currency } from '../lib/types'

const CURRENCIES: Currency[] = ['TRY', 'USD', 'EUR']

interface Props {
  currency: Currency
  onCurrency: (c: Currency) => void
  onAdd: () => void
}

export function Header({ currency, onCurrency, onAdd }: Props) {
  return (
    <header className="topbar shell">
      <a className="brand" href="/" aria-label="abone. ana sayfa">
        <span className="brand__mark" aria-hidden="true">
          <span className="brand__planet" />
        </span>
        <span>
          abone<span className="brand__dot">.</span>
        </span>
      </a>

      <div className="topbar__actions">
        <div className="segmented segmented--compact" role="group" aria-label="Gösterim para birimi">
          {CURRENCIES.map((c) => (
            <button
              key={c}
              className={currency === c ? 'is-active' : ''}
              aria-pressed={currency === c}
              onClick={() => onCurrency(c)}
            >
              {CURRENCY_SYMBOL[c]}
            </button>
          ))}
        </div>
        <button className="btn btn--primary" onClick={onAdd}>
          <span aria-hidden="true">+</span> Ekle
        </button>
      </div>
    </header>
  )
}
