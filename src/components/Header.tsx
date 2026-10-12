import type { Currency } from '../lib/types'

const CURRENCIES: { code: Currency; label: string }[] = [
  { code: 'TRY', label: 'TL' },
  { code: 'USD', label: 'USD' },
  { code: 'EUR', label: 'EUR' },
]

interface Props {
  currency: Currency
  onCurrency: (c: Currency) => void
  onAdd: () => void
}

export function Header({ currency, onCurrency, onAdd }: Props) {
  return (
    <header className="topbar">
      <div className="topbar__inner page">
        <a className="brand" href="/">
          abone
        </a>
        <div className="topbar__actions">
          <div className="segmented" role="group" aria-label="Para birimi">
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                className={currency === c.code ? 'is-active' : ''}
                aria-pressed={currency === c.code}
                onClick={() => onCurrency(c.code)}
              >
                {c.label}
              </button>
            ))}
          </div>
          <button className="btn btn--primary" onClick={onAdd}>
            Ekle
          </button>
        </div>
      </div>
    </header>
  )
}
