import { useCallback, useMemo, useState } from 'react'
import { CategoryBreakdown } from './components/CategoryBreakdown'
import { EmptyState } from './components/EmptyState'
import { Equivalents } from './components/Equivalents'
import { Header } from './components/Header'
import { HeroTotal } from './components/HeroTotal'
import { Orbit } from './components/Orbit'
import { SubscriptionList } from './components/SubscriptionList'
import { SubscriptionSheet } from './components/SubscriptionSheet'
import { UpcomingPayments } from './components/UpcomingPayments'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useRates } from './hooks/useRates'
import { useSubscriptions } from './hooks/useSubscriptions'
import { byCategory, monthlyCost, totals, upcoming } from './lib/calc'
import { formatDate } from './lib/format'
import type { Currency, Subscription } from './lib/types'

type SheetState = { mode: 'closed' } | { mode: 'add' } | { mode: 'edit'; sub: Subscription }

export default function App() {
  const { subs, save, remove, clear, loadDemo } = useSubscriptions()
  const { rates, date, live, status, refresh } = useRates()
  const [currency, setCurrency] = useLocalStorage<Currency>('currency.v1', 'TRY')
  const [sheet, setSheet] = useState<SheetState>({ mode: 'closed' })
  const [today] = useState(() => new Date())

  const summary = useMemo(() => {
    const items = subs.map((s) => ({
      id: s.id,
      serviceId: s.serviceId,
      name: s.name,
      color: s.color,
      monthly: monthlyCost(s, currency, rates),
    }))
    const priciest = items.reduce<(typeof items)[number] | null>(
      (top, it) => (!top || it.monthly > top.monthly ? it : top),
      null,
    )
    return {
      items,
      priciest,
      totals: totals(subs, currency, rates),
      yearlyTRY: totals(subs, 'TRY', rates).yearly,
      categories: byCategory(subs, currency, rates),
      upcoming: upcoming(subs, today, 4),
    }
  }, [subs, currency, rates, today])

  const openAdd = useCallback(() => setSheet({ mode: 'add' }), [])
  const closeSheet = useCallback(() => setSheet({ mode: 'closed' }), [])

  return (
    <>
      <div className="backdrop" aria-hidden="true" />
      <Header currency={currency} onCurrency={setCurrency} onAdd={openAdd} />

      <main className="shell">
        {subs.length === 0 ? (
          <EmptyState onAdd={openAdd} onDemo={loadDemo} />
        ) : (
          <div className="bento">
            <HeroTotal
              totals={summary.totals}
              currency={currency}
              count={subs.length}
              priciest={summary.priciest}
            />
            <Orbit items={summary.items} yearly={summary.totals.yearly} currency={currency} />
            <CategoryBreakdown shares={summary.categories} currency={currency} />
            <UpcomingPayments items={summary.upcoming} />
            <Equivalents yearlyTRY={summary.yearlyTRY} />
            <SubscriptionList
              subs={subs}
              currency={currency}
              rates={rates}
              onAdd={openAdd}
              onEdit={(sub) => setSheet({ mode: 'edit', sub })}
              onRemove={remove}
            />
          </div>
        )}
      </main>

      <footer className="footer shell">
        <span>
          Kur: 1 $ = {rates.USD.toFixed(2).replace('.', ',')} ₺ · 1 € = {rates.EUR.toFixed(2).replace('.', ',')} ₺
          {live && date ? ` · ${formatDate(new Date(date))}` : ' · tahmini'}
          <button className="link-btn" onClick={refresh} disabled={status === 'loading'}>
            {status === 'loading' ? 'güncelleniyor…' : status === 'error' ? 'tekrar dene' : 'güncelle'}
          </button>
        </span>
        <span>Veriler yalnızca bu tarayıcıda saklanır.</span>
        {subs.length > 0 && (
          <button
            className="link-btn link-btn--danger"
            onClick={() => window.confirm('Tüm abonelikler silinsin mi?') && clear()}
          >
            Her şeyi sıfırla
          </button>
        )}
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
