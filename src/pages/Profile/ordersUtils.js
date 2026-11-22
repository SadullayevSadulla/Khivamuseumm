import { todayISO } from '../Tickets/ticketsUtils'

const INACTIVE_STATUSES = ['USED', 'CANCELLED', 'EXPIRED']

export const orderEndDate = (order) => {
  const value = order?.validUntil || order?.visitDate
  return typeof value === 'string' ? value.slice(0, 10) : ''
}

export const isOrderPast = (order) => {
  const end = orderEndDate(order)
  return Boolean(end) && end < todayISO()
}

export const isOrderActive = (order) =>
  !isOrderPast(order) && !INACTIVE_STATUSES.includes(String(order?.status || '').toUpperCase())

export const sortOrders = (orders) => {
  const dateOf = (order) => (typeof order?.visitDate === 'string' ? order.visitDate.slice(0, 10) : '')
  const active = orders.filter(isOrderActive).sort((a, b) => dateOf(a).localeCompare(dateOf(b)))
  const rest = orders.filter((order) => !isOrderActive(order)).sort((a, b) => dateOf(b).localeCompare(dateOf(a)))
  return [...active, ...rest]
}

export const nextVisitDate = (orders) => {
  const dates = orders
    .filter(isOrderActive)
    .map((order) => (typeof order.visitDate === 'string' ? order.visitDate.slice(0, 10) : ''))
    .filter(Boolean)
    .sort()
  return dates[0] || null
}

export const statusTone = (order) => {
  const status = String(order?.status || '').toUpperCase()
  if (status === 'CANCELLED') return 'danger'
  if (status === 'USED' || isOrderPast(order)) return 'muted'
  if (status === 'PENDING') return 'warn'
  return 'ok'
}