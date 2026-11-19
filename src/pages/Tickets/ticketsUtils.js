export const getLanguage = (i18n) =>
  (i18n.resolvedLanguage || i18n.language || 'uz').split('-')[0]

export const getLocalizedText = (value, language) => {
  if (typeof value === 'string') return value
  if (!value || typeof value !== 'object') return ''
  const text = value[language] || value.uz || value.en || value.ru
  return typeof text === 'string' ? text : ''
}

export const formatPrice = (value) => {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return ''
  return Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0')
}

export const formatDate = (value, language) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const locale = { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-US' }[language] || 'uz-UZ'
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric' }).format(date)
}

export const isExpired = (ticket) => {
  if (!ticket?.validTo) return false
  const end = new Date(ticket.validTo)
  if (Number.isNaN(end.getTime())) return false
  end.setHours(23, 59, 59, 999)
  return end.getTime() < Date.now()
}

export const extractError = (error, fallback) => {
  const data = error?.response?.data
  if (Array.isArray(data?.errors) && data.errors.length) {
    const messages = data.errors.map((e) => e?.message).filter((m) => typeof m === 'string' && m.trim())
    if (messages.length) return messages.join(' ')
  }
  const message = data?.message || data?.error
  if (typeof message === 'string' && message.trim()) return message
  return fallback
}

export const todayISO = () => new Date().toLocaleDateString('sv-SE')

export const visitDateRange = (ticket) => {
  const today = todayISO()
  const from = typeof ticket?.validFrom === 'string' ? ticket.validFrom.slice(0, 10) : ''
  const to = typeof ticket?.validTo === 'string' ? ticket.validTo.slice(0, 10) : ''
  const min = from && from > today ? from : today
  return { min, max: to || undefined }
}