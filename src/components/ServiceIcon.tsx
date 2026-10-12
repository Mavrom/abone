import { SERVICE_BY_ID } from '../data/catalog'

interface Props {
  serviceId: string | null
  name: string
  size?: number
}

function initials(name: string): string {
  const words = name.trim().split(/\s+/)
  const letters = words.length > 1 ? words[0][0] + words[1][0] : name.slice(0, 2)
  return letters.toLocaleUpperCase('tr-TR')
}

export function ServiceIcon({ serviceId, name, size = 32 }: Props) {
  const service = serviceId ? SERVICE_BY_ID.get(serviceId) : undefined
  const monogram = service?.monogram ?? initials(name || '?')

  return (
    <span className="service-icon" style={{ width: size, height: size }} aria-hidden="true">
      {service?.iconPath ? (
        <svg viewBox="0 0 24 24" width={Math.round(size * 0.5)} height={Math.round(size * 0.5)}>
          <path d={service.iconPath} fill="currentColor" />
        </svg>
      ) : (
        <span className="service-icon__mono" style={{ fontSize: Math.round(size * 0.34) }}>
          {monogram}
        </span>
      )}
    </span>
  )
}
