import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import {
  CATALOG,
  CATEGORY_META,
  COMMITMENT_CATEGORIES,
  SERVICE_BY_ID,
  matchesService,
  type Service,
} from '../data/catalog'
import { monthlyCost } from '../lib/calc'
import { CURRENCY_SYMBOL, CYCLE_LABEL, CYCLE_SUFFIX, formatMoney, parsePrice, toISODate } from '../lib/format'
import type { Category, Currency, Cycle, Rates, Subscription } from '../lib/types'
import { ServiceIcon } from './ServiceIcon'

interface Props {
  initial: Subscription | null
  displayCurrency: Currency
  rates: Rates
  onClose: () => void
  onSave: (sub: Omit<Subscription, 'id'> & { id?: string }) => void
  onDelete?: (id: string) => void
}

type Draft = Omit<Subscription, 'id' | 'price'> & { id?: string; price: string }

const CYCLES: Cycle[] = ['weekly', 'monthly', 'quarterly', 'yearly']
const CURRENCIES: Currency[] = ['TRY', 'USD', 'EUR']
const CATEGORIES = Object.keys(CATEGORY_META) as Category[]

const priceText = (price: number) => String(price).replace('.', ',')

function draftFromService(service: Service): Draft {
  const plan = service.plans[0]
  return {
    serviceId: service.id,
    name: service.name,
    plan: plan.name,
    price: priceText(plan.price),
    currency: plan.currency,
    cycle: plan.cycle,
    billingDate: toISODate(new Date()),
    category: service.category,
  }
}

function customDraft(name = ''): Draft {
  return {
    serviceId: null,
    name,
    plan: '',
    price: '',
    currency: 'TRY',
    cycle: 'monthly',
    billingDate: toISODate(new Date()),
    category: 'other',
  }
}

function cheapestPlan(service: Service, rates: Rates) {
  return service.plans.reduce((min, p) =>
    p.price * rates[p.currency] < min.price * rates[min.currency] ? p : min,
  )
}

export function SubscriptionSheet({ initial, displayCurrency, rates, onClose, onSave, onDelete }: Props) {
  const [draft, setDraft] = useState<Draft | null>(
    initial ? { ...initial, price: priceText(initial.price) } : null,
  )
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Category | 'all'>('all')
  const [hasCommitment, setHasCommitment] = useState(!!initial?.commitmentEnd)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
    }
  }, [onClose])

  const picking = draft === null
  useEffect(() => {
    dialogRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus()
  }, [picking])

  const services = useMemo(() => {
    return CATALOG.filter((s) => (filter === 'all' || s.category === filter) && matchesService(s, query))
  }, [query, filter])

  // Group by category only when browsing everything; searches and filters stay a flat list.
  const groups: [Category | null, Service[]][] =
    filter === 'all' && !query.trim()
      ? CATEGORIES.map((c) => [c, services.filter((s) => s.category === c)] as [Category, Service[]]).filter(
          ([, list]) => list.length > 0,
        )
      : [[null, services]]

  const service = draft?.serviceId ? SERVICE_BY_ID.get(draft.serviceId) : undefined
  const price = draft ? parsePrice(draft.price) : NaN
  const valid = !!draft && draft.name.trim() !== '' && Number.isFinite(price) && price > 0 && !!draft.billingDate
  const preview = valid ? monthlyCost({ ...draft, id: '', price } as Subscription, displayCurrency, rates) : 0

  const update = (patch: Partial<Draft>) => setDraft((d) => (d ? { ...d, ...patch } : d))

  const startWith = (s: Service) => {
    setDraft(draftFromService(s))
    setHasCommitment(false)
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!valid || !draft) return
    const { commitmentEnd, ...rest } = draft
    onSave({
      ...rest,
      name: draft.name.trim(),
      plan: draft.plan.trim(),
      price,
      ...(hasCommitment && commitmentEnd ? { commitmentEnd } : {}),
    })
    onClose()
  }

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" ref={dialogRef}>
        <header className="dialog__head">
          {draft && !initial ? (
            <button className="link" onClick={() => setDraft(null)}>
              ← Geri
            </button>
          ) : (
            <span />
          )}
          <button className="icon-btn" aria-label="Kapat" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        {!draft ? (
          <div className="picker">
            <h2 id="dialog-title" className="dialog__title">
              Abonelik ekle
            </h2>
            <input
              className="input"
              placeholder="Servis ara"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              data-autofocus
            />
            <div className="chips chips--scroll">
              <button className={filter === 'all' ? 'is-active' : ''} onClick={() => setFilter('all')}>
                Tümü
              </button>
              {CATEGORIES.filter((c) => c !== 'other').map((c) => (
                <button key={c} className={filter === c ? 'is-active' : ''} onClick={() => setFilter(c)}>
                  {CATEGORY_META[c].label}
                </button>
              ))}
            </div>
            <div className="picker__list">
              {groups.map(([category, list]) => (
                <section key={category ?? 'all'}>
                  {category && <h3 className="picker__group">{CATEGORY_META[category].label}</h3>}
                  <ul>
                    {list.map((s) => {
                      const low = cheapestPlan(s, rates)
                      return (
                        <li key={s.id}>
                          <button className="picker__item" onClick={() => startWith(s)}>
                            <ServiceIcon serviceId={s.id} name={s.name} />
                            <span className="picker__name">{s.name}</span>
                            <span className="picker__price">
                              {formatMoney(low.price, low.currency)}
                              {CYCLE_SUFFIX[low.cycle]}
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </section>
              ))}
              <button className="picker__item" onClick={() => setDraft(customDraft(query.trim()))}>
                <span className="service-icon service-icon--dashed">+</span>
                <span className="picker__name">
                  {query.trim() ? `“${query.trim()}” ekle` : 'Listede yok, kendim ekleyeceğim'}
                </span>
              </button>
            </div>
          </div>
        ) : (
          <form className="form" onSubmit={submit}>
            <div className="form__title">
              <ServiceIcon serviceId={draft.serviceId} name={draft.name || '?'} size={40} />
              {service ? (
                <h2 id="dialog-title" className="dialog__title">
                  {service.name}
                </h2>
              ) : (
                <input
                  id="dialog-title"
                  className="input"
                  placeholder="Abonelik adı"
                  value={draft.name}
                  onChange={(e) => update({ name: e.target.value })}
                  data-autofocus
                  required
                />
              )}
            </div>

            {service ? (
              <fieldset className="field">
                <legend>Plan</legend>
                <div className="plans">
                  {service.plans.map((p) => (
                    <label key={p.name} className={`plan ${draft.plan === p.name ? 'is-active' : ''}`}>
                      <input
                        type="radio"
                        name="plan"
                        checked={draft.plan === p.name}
                        onChange={() =>
                          update({ plan: p.name, price: priceText(p.price), currency: p.currency, cycle: p.cycle })
                        }
                      />
                      <span className="plan__name">{p.name}</span>
                      <span className="plan__price">
                        {formatMoney(p.price, p.currency)}
                        {CYCLE_SUFFIX[p.cycle]}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : (
              <label className="field">
                <span className="field__label">Plan (isteğe bağlı)</span>
                <input
                  className="input"
                  placeholder="ör. Premium"
                  value={draft.plan}
                  onChange={(e) => update({ plan: e.target.value })}
                />
              </label>
            )}

            <div className="form__row">
              <label className="field field--grow">
                <span className="field__label">Fiyat</span>
                <input
                  className="input input--num"
                  inputMode="decimal"
                  placeholder="0,00"
                  value={draft.price}
                  onChange={(e) => update({ price: e.target.value })}
                  required
                />
              </label>
              <fieldset className="field">
                <legend>Para birimi</legend>
                <div className="segmented">
                  {CURRENCIES.map((c) => (
                    <button
                      type="button"
                      key={c}
                      className={draft.currency === c ? 'is-active' : ''}
                      onClick={() => update({ currency: c })}
                    >
                      {CURRENCY_SYMBOL[c]}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>

            <fieldset className="field">
              <legend>Ödeme periyodu</legend>
              <div className="segmented segmented--full">
                {CYCLES.map((c) => (
                  <button
                    type="button"
                    key={c}
                    className={draft.cycle === c ? 'is-active' : ''}
                    onClick={() => update({ cycle: c })}
                  >
                    {CYCLE_LABEL[c]}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="form__row">
              <label className="field field--grow">
                <span className="field__label">Ödeme tarihi</span>
                <input
                  type="date"
                  className="input"
                  value={draft.billingDate}
                  onChange={(e) => update({ billingDate: e.target.value })}
                  required
                />
              </label>
              {!service && (
                <label className="field field--grow">
                  <span className="field__label">Kategori</span>
                  <select
                    className="input"
                    value={draft.category}
                    onChange={(e) => update({ category: e.target.value as Category })}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {CATEGORY_META[c].label}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </div>

            <div className="field">
              <label className="check">
                <input
                  type="checkbox"
                  checked={hasCommitment}
                  onChange={(e) => {
                    setHasCommitment(e.target.checked)
                    if (e.target.checked && !draft.commitmentEnd) {
                      const d = new Date()
                      update({ commitmentEnd: toISODate(new Date(d.getFullYear() + 1, d.getMonth(), d.getDate())) })
                    }
                  }}
                />
                <span>
                  Taahhüt var
                  {!hasCommitment && COMMITMENT_CATEGORIES.includes(draft.category) && (
                    <span className="muted"> · internet, hat ve TV paketlerinde yaygın</span>
                  )}
                </span>
              </label>
              {hasCommitment && (
                <label className="field">
                  <span className="field__label">Taahhüt bitiş tarihi</span>
                  <input
                    type="date"
                    className="input"
                    value={draft.commitmentEnd ?? ''}
                    onChange={(e) => update({ commitmentEnd: e.target.value })}
                  />
                </label>
              )}
            </div>

            <footer className="form__footer">
              <div className="form__preview">
                <span>{formatMoney(preview, displayCurrency)} / ay</span>
                <span className="muted">{formatMoney(preview * 12, displayCurrency)} / yıl</span>
              </div>
              <div className="form__actions">
                {initial && onDelete && (
                  <button
                    type="button"
                    className="link link--danger"
                    onClick={() => {
                      onDelete(initial.id)
                      onClose()
                    }}
                  >
                    Sil
                  </button>
                )}
                <button type="submit" className="btn btn--primary" disabled={!valid}>
                  {initial ? 'Kaydet' : 'Ekle'}
                </button>
              </div>
            </footer>
          </form>
        )}
      </div>
    </div>
  )
}
