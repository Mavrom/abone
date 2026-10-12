export type Currency = 'TRY' | 'USD' | 'EUR'
export type Cycle = 'weekly' | 'monthly' | 'quarterly' | 'yearly'
export type Category =
  | 'video'
  | 'tv'
  | 'music'
  | 'internet'
  | 'mobile'
  | 'shopping'
  | 'ai'
  | 'gaming'
  | 'cloud'
  | 'productivity'
  | 'reading'
  | 'fitness'
  | 'other'

export interface Subscription {
  id: string
  serviceId: string | null
  name: string
  plan: string
  price: number
  currency: Currency
  cycle: Cycle
  /** ISO date (yyyy-mm-dd) of a known payment; future payments are derived from it. */
  billingDate: string
  category: Category
  /** ISO date (yyyy-mm-dd) when a contract (taahhüt) ends, typical for telecom plans. */
  commitmentEnd?: string
}

/** Value of one unit of each currency, expressed in TRY. */
export type Rates = Record<Currency, number>
