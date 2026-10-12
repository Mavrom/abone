import { useState, type CSSProperties } from 'react'
import { SERVICE_BY_ID } from '../data/catalog'
import { formatMoney } from '../lib/format'
import type { Currency } from '../lib/types'
import { AnimatedAmount } from './AnimatedAmount'
import { Card } from './Card'

export interface OrbitItem {
  id: string
  serviceId: string | null
  name: string
  color: string
  monthly: number
}

interface Props {
  items: OrbitItem[]
  yearly: number
  currency: Currency
}

const C = 200
const RINGS = [96, 140, 182]
const DURATIONS = [70, 110, 160]

interface Planet extends OrbitItem {
  ring: number
  x: number
  y: number
  r: number
}

function layout(items: OrbitItem[]): Planet[] {
  const sorted = [...items].sort((a, b) => b.monthly - a.monthly)
  const max = sorted[0]?.monthly || 1
  const ringCount = Math.min(RINGS.length, Math.max(1, Math.ceil(sorted.length / 2)))
  const base = sorted.length <= 6 ? 27 : sorted.length <= 12 ? 21 : 16
  // Biggest planets go to the outer rings, where there's the most room.
  const rings: OrbitItem[][] = Array.from({ length: ringCount }, () => [])
  sorted.forEach((item, i) => rings[ringCount - 1 - (i % ringCount)].push(item))

  return rings.flatMap((ringItems, ringIdx) => {
    const ring = RINGS.length - ringCount + ringIdx
    const radius = RINGS[ring]
    const offset = ring * 0.9
    return ringItems.map((item, i) => {
      const angle = offset + (i / ringItems.length) * Math.PI * 2
      return {
        ...item,
        ring,
        x: C + Math.cos(angle) * radius,
        y: C + Math.sin(angle) * radius,
        r: base * (0.45 + 0.55 * Math.sqrt(item.monthly / max)),
      }
    })
  })
}

export function Orbit({ items, yearly, currency }: Props) {
  const [focused, setFocused] = useState<string | null>(null)
  const planets = layout(items)
  const active = planets.find((p) => p.id === focused)

  return (
    <Card index="02" title="Yörünge" className="orbit-card" aside={<span className="hint">boyut = maliyet</span>}>
      <div className="orbit">
        <svg viewBox="0 0 400 400" className="orbit__svg" role="img" aria-label="Aboneliklerin maliyete göre yörünge görünümü">
          <defs>
            <radialGradient id="sun" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#E9FFB0" />
              <stop offset="55%" stopColor="#C8F560" />
              <stop offset="100%" stopColor="#7FA82A" />
            </radialGradient>
            <radialGradient id="halo">
              <stop offset="40%" stopColor="#C8F560" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#C8F560" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle cx={C} cy={C} r={110} fill="url(#halo)" />
          {RINGS.map((r) => (
            <circle key={r} cx={C} cy={C} r={r} className="orbit__path" />
          ))}

          {RINGS.map((_, ring) => (
            <g
              key={ring}
              className="orbit__ring"
              style={{ animationDuration: `${DURATIONS[ring]}s`, animationDirection: ring % 2 ? 'reverse' : 'normal' } as CSSProperties}
            >
              {planets
                .filter((p) => p.ring === ring)
                .map((p) => {
                  const service = p.serviceId ? SERVICE_BY_ID.get(p.serviceId) : undefined
                  const iconScale = (p.r * 1.05) / 24
                  return (
                    <g key={p.id} transform={`translate(${p.x} ${p.y})`}>
                      <g
                        className={`orbit__planet ${focused === p.id ? 'is-active' : ''}`}
                        style={{
                          animationDuration: `${DURATIONS[ring]}s`,
                          animationDirection: ring % 2 ? 'normal' : 'reverse',
                        }}
                        tabIndex={0}
                        onMouseEnter={() => setFocused(p.id)}
                        onMouseLeave={() => setFocused(null)}
                        onFocus={() => setFocused(p.id)}
                        onBlur={() => setFocused(null)}
                      >
                        <title>{`${p.name} · ${formatMoney(p.monthly, currency)}/ay`}</title>
                        <circle r={p.r + 5} className="orbit__glow" style={{ fill: p.color }} />
                        <circle r={p.r} style={{ fill: p.color }} className="orbit__body" />
                        {service?.iconPath ? (
                          <path
                            d={service.iconPath}
                            fill="#fff"
                            transform={`scale(${iconScale}) translate(-12 -12)`}
                          />
                        ) : (
                          <text className="orbit__mono" fontSize={p.r * 0.8} dy="0.35em">
                            {(service?.monogram ?? p.name.slice(0, 2)).toLocaleUpperCase('tr-TR')}
                          </text>
                        )}
                      </g>
                    </g>
                  )
                })}
            </g>
          ))}

          <circle cx={C} cy={C} r={56} fill="url(#sun)" className="orbit__sun" />
        </svg>

        <div className="orbit__center" aria-live="polite">
          {active ? (
            <>
              <span className="orbit__center-label">{active.name}</span>
              <span className="orbit__center-value">{formatMoney(active.monthly, currency, 0)}</span>
              <span className="orbit__center-label">aylık</span>
            </>
          ) : (
            <>
              <span className="orbit__center-label">yıllık</span>
              <AnimatedAmount key={currency} value={yearly} currency={currency} className="orbit__center-value" />
            </>
          )}
        </div>
      </div>
      {items.length === 0 && <p className="orbit__empty">Yörüngede henüz kimse yok.</p>}
    </Card>
  )
}
