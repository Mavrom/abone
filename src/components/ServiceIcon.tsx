import type { CSSProperties } from 'react'
import { SERVICE_BY_ID } from '../data/catalog'

interface Props {
  serviceId: string | null
  name: string
  color: string
  size?: number
}

function initials(name: string): string {
  const words = name.trim().split(/\s+/)
  const letters = words.length > 1 ? words[0][0] + words[1][0] : name.slice(0, 2)
  return letters.toLocaleUpperCase('tr-TR')
}

export function ServiceIcon({ serviceId, name, color, size = 40 }: Props) {
  const service = serviceId ? SERVICE_BY_ID.get(serviceId) : undefined
  const monogram = service?.monogram ?? initials(name || '?')

  return (
    <span
      className="service-icon"
      style={{ '--tile': color, width: size, height: size } as CSSProperties}
      aria-hidden="true"
    >
      {service?.iconPath ? (
        <svg viewBox="0 0 24 24" width={size * 0.5} height={size * 0.5}>
          <path d={service.iconPath} fill="currentColor" />
        </svg>
      ) : (
        <span className="service-icon__mono" style={{ fontSize: size * 0.36 }}>
          {monogram}
        </span>
      )}
    </span>
  )
}
