import api from '../../api'

/**
 * Chiptalar API.  VITE_API_URL = https://api.atr.uz/api  =>  yo'llar "/tickets..." dan boshlanadi.
 *
 * DIQQAT: purchase / verify / resend-code so'rov tanalari (body) Swagger'dagi
 * sxemaga qarab shu yerda moslashtiriladi — faqat shu fayl o'zgaradi.
 */

export const fetchTickets = async () => {
  const res = await api.get('/tickets')
  return Array.isArray(res?.data?.data) ? res.data.data : []
}

// POST /tickets/purchase  ->  201 { success, message, orderId, ticketNumber, customerEmail, totalPrice }
export const purchaseTicket = ({ ticket, customerName, customerEmail, customerPhone, quantity, visitDate }) =>
  api.post('/tickets/purchase', {
    ticketId: ticket.id,
    customerName,
    customerEmail,
    ...(customerPhone ? { customerPhone } : {}),
    quantity,
    visitDate,
  })

// POST /tickets/verify  ->  200 { success, message, order: { id, ticketNumber, status, visitDate, validUntil, ... } }
// ESLATMA: verify / resend-code so'rov tanasi Swagger'da ko'rinmagan — orderId + code deb olingan.
export const verifyTicket = ({ orderId, code }) =>
  api.post('/tickets/verify', { orderId, code })

// POST /tickets/resend-code  ->  200 { success, message }
export const resendCode = ({ orderId }) =>
  api.post('/tickets/resend-code', { orderId })

// Buyurtma identifikatorini javobdan topish (turli javob shakllari uchun)
export const pickOrderId = (res) => {
  const d = res?.data?.data ?? res?.data ?? {}
  return d.orderId || d.order?.id || d.id || null
}

// Tasdiqlangan buyurtma (verify javobidagi "order")
export const pickOrder = (res) => res?.data?.order ?? res?.data?.data?.order ?? null