import type { ReactNode } from 'react'

interface Props {
  index: string
  title: string
  className?: string
  aside?: ReactNode
  children: ReactNode
}

export function Card({ index, title, className = '', aside, children }: Props) {
  return (
    <section className={`card ${className}`}>
      <header className="card__head">
        <h2 className="label">
          <span className="label__index">{index}</span>
          <span className="label__slash">/</span>
          {title}
        </h2>
        {aside}
      </header>
      {children}
    </section>
  )
}
