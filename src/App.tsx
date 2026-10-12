import { useCallback, useMemo, useState } from 'react'
import { CategoryBreakdown } from './components/CategoryBreakdown'
import { EmptyState } from './components/EmptyState'
import { Header } from './components/Header'
import { SubscriptionList } from './components/SubscriptionList'
import { SubscriptionSheet } from './components/SubscriptionSheet'
import { Summary } from './components/Summary'
import { UpcomingPayments } from './components/UpcomingPayments'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useRates } from './hooks/useRates'
import { useSubscriptions } from './hooks/useSubscriptions'
import { byCategory, totals, upcoming } from './lib/calc'
import { formatDate } from './lib/format'
import type { Currency, Subscription } from './lib/types'

type SheetState = { mode: 'closed' } | { mode: 'add' } | { mode: 'edit'; sub: Subscription }

const rateText = (n: number) => n.toFixed(2).replace('.', ',')

export default function App() {
  const { subs, save, remove, clear, loadDemo } = useSubscriptions()
  const { rates, date, live, status, refresh } = useRates()
  const [currency, setCurrency] = useLocalStorage<Currency>('currency.v1', 'TRY')
  const [sheet, setSheet] = useState<SheetState>({ mode: 'closed' })
  const [today] = useState(() => new Date())

  const summary = useMemo(
    () => ({
      totals: totals(subs, currency, rates),
      yearlyTRY: totals(subs, 'TRY', rates).yearly,
      categories: byCategory(subs, currency, rates),
      upcoming: upcoming(subs, today, 5),
    }),
    [subs, currency, rates, today],
  )

  const openAdd = useCallback(() => setSheet({ mode: 'add' }), [])
  const closeSheet = useCallback(() => setSheet({ mode: 'closed' }), [])

  return (
    <>
      <Header currency={currency} onCurrency={setCurrency} onAdd={openAdd} />

      <main className="page">
        {subs.length === 0 ? (
          <EmptyState onAdd={openAdd} onDemo={loadDemo} />
        ) : (
          <>
            <Summary totals={summary.totals} currency={currency} count={subs.length} yearlyTRY={summary.yearlyTRY} />
            <div className="layout">
              <SubscriptionList
                subs={subs}
                currency={currency}
                rates={rates}
                onAdd={openAdd}
                onEdit={(sub) => setSheet({ mode: 'edit', sub })}
              />
              <aside className="sidebar">
                <UpcomingPayments items={summary.upcoming} />
                <CategoryBreakdown shares={summary.categories} currency={currency} />
              </aside>
            </div>
          </>
        )}
      </main>

      <footer className="footer page">
        <span>
          1 USD = {rateText(rates.USD)} TL · 1 EUR = {rateText(rates.EUR)} TL
          {live && date ? ` (${formatDate(new Date(date))})` : ' (tahmini)'}
          {' · '}
          <button className="link" onClick={refresh} disabled={status === 'loading'}>
            {status === 'loading' ? 'güncelleniyor…' : status === 'error' ? 'tekrar dene' : 'güncelle'}
          </button>
        </span>
        <span>
          Fiyatlar tahminidir, düzenleyebilirsin.
          {subs.length > 0 && (
            <>
              {' · '}
              <button
                className="link link--danger"
                onClick={() => window.confirm('Tüm abonelikler silinsin mi?') && clear()}
              >
                Tümünü sil
              </button>
            </>
          )}
        </span>
      </footer>

      {sheet.mode !== 'closed' && (
        <SubscriptionSheet
          initial={sheet.mode === 'edit' ? sheet.sub : null}
          displayCurrency={currency}
          rates={rates}
          onClose={closeSheet}
          onSave={save}
          onDelete={remove}
        />
      )}
    </>
  )
}
