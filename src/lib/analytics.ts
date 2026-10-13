import { track } from '@vercel/analytics'
import type { Currency, Subscription } from './types'

/**
 * Anonymous product events for Vercel Web Analytics. Only catalog ids and
 * categories are sent — never custom names, prices or dates.
 */
export const analytics = {
  subscriptionAdded(sub: Pick<Subscription, 'serviceId' | 'category' | 'plan'>) {
    track('Subscription Added', {
      service: sub.serviceId ?? 'custom',
      category: sub.category,
      plan: sub.serviceId ? sub.plan : null,
    })
  },
  subscriptionEdited(sub: Pick<Subscription, 'serviceId'>) {
    track('Subscription Edited', { service: sub.serviceId ?? 'custom' })
  },
  subscriptionRemoved(sub: Pick<Subscription, 'serviceId'>) {
    track('Subscription Removed', { service: sub.serviceId ?? 'custom' })
  },
  demoLoaded() {
    track('Demo Loaded')
  },
  currencyChanged(currency: Currency) {
    track('Currency Changed', { currency })
  },
}
