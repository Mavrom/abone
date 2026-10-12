import type { CSSProperties } from 'react'
import { CATALOG } from '../data/catalog'
import { ServiceIcon } from './ServiceIcon'

interface Props {
  onAdd: () => void
  onDemo: () => void
}

const FLOATERS = ['netflix', 'spotify', 'chatgpt', 'youtube', 'claude', 'icloud', 'psplus', 'disney']

export function EmptyState({ onAdd, onDemo }: Props) {
  const services = FLOATERS.map((id) => CATALOG.find((s) => s.id === id)!)

  return (
    <section className="empty">
      <div className="empty__ring" aria-hidden="true">
        {services.map((s, i) => (
          <span
            key={s.id}
            className="empty__floater"
            style={{ '--a': `${(i / services.length) * 360}deg`, '--d': `${i * -2.5}s` } as CSSProperties}
          >
            <ServiceIcon serviceId={s.id} name={s.name} color={s.color} size={52} />
          </span>
        ))}
      </div>

      <p className="label">
        <span className="label__index">00</span>
        <span className="label__slash">/</span>
        Abonelik hesaplayıcı
      </p>
      <h1 className="empty__title">
        Küçük ödemeler,
        <br />
        <em>büyük</em> toplamlar.
      </h1>
      <p className="empty__lede">
        Netflix, Spotify, ChatGPT… Tek tek masum görünürler. Hepsini ekle, ayda ve yılda gerçekte ne
        kadar ödediğini gör.
      </p>
      <div className="empty__cta">
        <button className="btn btn--primary btn--lg" onClick={onAdd}>
          İlk aboneliğini ekle
        </button>
        <button className="btn btn--ghost btn--lg" onClick={onDemo}>
          Örnek verilerle dene
        </button>
      </div>
    </section>
  )
}
