import api from '../../api'
import { getToken } from '../../utils/auth'

export const fetchTickets = async () => {
  const res = await api.get('/tickets')
  return Array.isArray(res?.data?.data) ? res.data.data : []
}

const postOptionalAuth = async (url, body) => {
  const token = getToken()
  if (!token) return api.post(url, body)
  try {
    return await api.post(url, body, { headers: { Authorization: `Bearer ${token}` } })
  } catch (err) {
    if (err.response?.status === 401) return api.post(url, body)
    throw err
  }
}

export const purchaseTicket = ({ ticket, customerName, customerEmail, customerPhone, quantity, visitDate }) =>
  postOptionalAuth('/tickets/purchase', {
    ticketId: ticket.id,
    customerName,
    customerEmail,
    ...(customerPhone ? { customerPhone } : {}),
    quantity,
    visitDate,
  })

export const verifyTicket = ({ orderId, code }) =>
  postOptionalAuth('/tickets/verify', { orderId, code })

export const resendCode = ({ orderId }) =>
  postOptionalAuth('/tickets/resend-code', { orderId })

export const pickOrderId = (res) => {
  const d = res?.data?.data ?? res?.data ?? {}
  return d.orderId || d.order?.id || d.id || null
}

export const pickOrder = (res) => res?.data?.order ?? res?.data?.data?.order ?? null