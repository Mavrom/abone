import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from 'react'
import { CATALOG, CATEGORY_META, CUSTOM_COLORS, SERVICE_BY_ID, type Service } from '../data/catalog'
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
    color: service.color,
  }
}

function customDraft(): Draft {
  return {
    serviceId: null,
    name: '',
    plan: '',
    price: '',
    currency: 'TRY',
    cycle: 'monthly',
    billingDate: toISODate(new Date()),
    category: 'other',
    color: CUSTOM_COLORS[0],
  }
}

const priceText = (price: number) => String(price).replace('.', ',')

function lowestPrice(service: Service, rates: Rates) {
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
  const sheetRef = useRef<HTMLDivElement>(null)

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
    sheetRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus()
  }, [picking])

  const services = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('tr-TR')
    return CATALOG.filter(
      (s) =>
        (filter === 'all' || s.category === filter) &&
        (!q || s.name.toLocaleLowerCase('tr-TR').includes(q)),
    )
  }, [query, filter])

  const service = draft?.serviceId ? SERVICE_BY_ID.get(draft.serviceId) : undefined
  const price = draft ? parsePrice(draft.price) : NaN
  const valid = !!draft && draft.name.trim() !== '' && Number.isFinite(price) && price > 0 && !!draft.billingDate
  const preview = valid
    ? monthlyCost({ ...draft, id: '', price } as Subscription, displayCurrency, rates)
    : 0

  const update = (patch: Partial<Draft>) => setDraft((d) => (d ? { ...d, ...patch } : d))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!valid || !draft) return
    onSave({ ...draft, name: draft.name.trim(), plan: draft.plan.trim(), price })
    onClose()
  }

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title" ref={sheetRef}>
        <header className="sheet__head">
          {draft && !initial ? (
            <button className="link-btn" onClick={() => setDraft(null)}>
              ← Servisler
            </button>
          ) : (
            <span className="label">{initial ? 'Düzenle' : 'Yeni abonelik'}</span>
          )}
          <button className="icon-btn" aria-label="Kapat" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        {!draft ? (
          <div className="picker">
            <h2 id="sheet-title" className="sheet__title">
              Neye <em>abonesin?</em>
            </h2>
            <input
              className="input input--search"
              placeholder="Netflix, Spotify, ChatGPT…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              data-autofocus
            />
            <div className="chips">
              <button className={`chip-btn ${filter === 'all' ? 'is-active' : ''}`} onClick={() => setFilter('all')}>
                Tümü
              </button>
              {CATEGORIES.filter((c) => c !== 'other').map((c) => (
                <button
                  key={c}
                  className={`chip-btn ${filter === c ? 'is-active' : ''}`}
                  onClick={() => setFilter(c)}
                >
                  {CATEGORY_META[c].label}
                </button>
              ))}
            </div>
            <div className="picker__grid">
              <button className="service-tile service-tile--custom" onClick={() => setDraft(customDraft())}>
                <span className="service-tile__plus">+</span>
                <span className="service-tile__name">Özel abonelik</span>
                <span className="service-tile__from">listede yoksa</span>
              </button>
              {services.map((s) => {
                const low = lowestPrice(s, rates)
                return (
                  <button
                    key={s.id}
                    className="service-tile"
                    style={{ '--brand': s.color } as CSSProperties}
                    onClick={() => setDraft(draftFromService(s))}
                  >
                    <ServiceIcon serviceId={s.id} name={s.name} color={s.color} size={40} />
                    <span className="service-tile__name">{s.name}</span>
                    <span className="service-tile__from">
                      {formatMoney(low.price, low.currency)}
                      {CYCLE_SUFFIX[low.cycle]}
                    </span>
                  </button>
                )
              })}
            </div>
            {services.length === 0 && (
              <p className="muted">
                Bulamadık. <button className="link-btn" onClick={() => setDraft({ ...customDraft(), name: query })}>“{query}” olarak ekle →</button>
              </p>
            )}
          </div>
        ) : (
          <form className="form" onSubmit={submit}>
            <div className="form__hero">
              <ServiceIcon serviceId={draft.serviceId} name={draft.name || '?'} color={draft.color} size={56} />
              {service ? (
                <h2 id="sheet-title" className="sheet__title">
                  {service.name}
                </h2>
              ) : (
                <input
                  id="sheet-title"
                  className="input input--title"
                  placeholder="Abonelik adı"
                  value={draft.name}
                  onChange={(e) => update({ name: e.target.value })}
                  data-autofocus
                  required
                />
              )}
            </div>

            <fieldset className="field">
              <legend>Plan</legend>
              {service ? (
                <div className="plans">
                  {service.plans.map((p) => (
                    <button
                      type="button"
                      key={p.name}
                      className={`plan ${draft.plan === p.name ? 'is-active' : ''}`}
                      onClick={() =>
                        update({ plan: p.name, price: priceText(p.price), currency: p.currency, cycle: p.cycle })
                      }
                    >
                      <span className="plan__name">{p.name}</span>
                      <span className="plan__price">
                        {formatMoney(p.price, p.currency)}
                        <small>{p.cycle === 'yearly' ? '/yıl' : '/ay'}</small>
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  className="input"
                  placeholder="ör. Premium, Aile…"
                  value={draft.plan}
                  onChange={(e) => update({ plan: e.target.value })}
                />
              )}
            </fieldset>

            <div className="form__row">
              <label className="field field--grow">
                <span className="field__label">Fiyat</span>
                <span className="price-input">
                  <span className="price-input__symbol">{CURRENCY_SYMBOL[draft.currency]}</span>
                  <input
                    className="input"
                    inputMode="decimal"
                    placeholder="0,00"
                    value={draft.price}
                    onChange={(e) => update({ price: e.target.value })}
                    required
                  />
                </span>
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
              <div className="segmented segmented--wide">
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

            <label className="field">
              <span className="field__label">Ödeme tarihi</span>
              <input
                type="date"
                className="input"
                value={draft.billingDate}
                onChange={(e) => update({ billingDate: e.target.value })}
                required
              />
              <span className="field__hint">Son ya da bir sonraki ödeme günü; gerisini biz hesaplarız.</span>
            </label>

            {!service && (
              <>
                <fieldset className="field">
                  <legend>Kategori</legend>
                  <div className="chips">
                    {CATEGORIES.map((c) => (
                      <button
                        type="button"
                        key={c}
                        className={`chip-btn ${draft.category === c ? 'is-active' : ''}`}
                        onClick={() => update({ category: c })}
                      >
                        {CATEGORY_META[c].label}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <fieldset className="field">
                  <legend>Renk</legend>
                  <div className="swatches">
                    {CUSTOM_COLORS.map((c) => (
                      <button
                        type="button"
                        key={c}
                        aria-label={`Renk ${c}`}
                        className={`swatch ${draft.color === c ? 'is-active' : ''}`}
                        style={{ background: c }}
                        onClick={() => update({ color: c })}
                      />
                    ))}
                  </div>
                </fieldset>
              </>
            )}

            <footer className="form__footer">
              <div className="form__preview">
                <span className="label">Aylık karşılığı</span>
                <strong>{formatMoney(preview, displayCurrency)}</strong>
                <span className="muted">yılda {formatMoney(preview * 12, displayCurrency)}</span>
              </div>
              <div className="form__actions">
                {initial && onDelete && (
                  <button
                    type="button"
                    className="link-btn link-btn--danger"
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
