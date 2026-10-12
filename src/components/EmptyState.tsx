import { ServiceIcon } from './ServiceIcon'

interface Props {
  onAdd: () => void
  onDemo: () => void
}

const HINTS: [string, string][] = [
  ['netflix', 'Netflix'],
  ['spotify', 'Spotify'],
  ['youtube', 'YouTube'],
  ['claude', 'Claude'],
  ['icloud', 'iCloud+'],
  ['psplus', 'PlayStation Plus'],
]

export function EmptyState({ onAdd, onDemo }: Props) {
  return (
    <section className="empty">
      <div className="empty__icons" aria-hidden="true">
        {HINTS.map(([id, name]) => (
          <ServiceIcon key={id} serviceId={id} name={name} size={36} />
        ))}
      </div>
      <h1 className="empty__title">Aboneliklerin ayda ne kadar tutuyor?</h1>
      <p className="empty__text">
        Kullandığın servisleri ve planlarını ekle; aylık, yıllık ve günlük toplamını hesaplayalım. Dolar ve
        euro ile ödenenler güncel kurla çevrilir.
      </p>
      <div className="empty__actions">
        <button className="btn btn--primary btn--lg" onClick={onAdd}>
          Abonelik ekle
        </button>
        <button className="btn btn--lg" onClick={onDemo}>
          Örnek verilerle dene
        </button>
      </div>
      <p className="empty__fine">Hesap gerekmez. Veriler yalnızca bu tarayıcıda saklanır.</p>
    </section>
  )
}
