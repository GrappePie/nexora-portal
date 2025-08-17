interface Subscription {
  planId: string
  status: 'active'
}

const subscriptions = new Map<number, Subscription>()

export function setSubscription(userId: number, planId: string) {
  subscriptions.set(userId, { planId, status: 'active' })
}

export function getSubscription(userId: number) {
  return subscriptions.get(userId)
}
