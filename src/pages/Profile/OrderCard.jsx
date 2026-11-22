import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiCheck, FiCopy } from 'react-icons/fi'
import { formatDate, formatPrice, getLanguage, getLocalizedText } from '../Tickets/ticketsUtils'
import { isOrderPast, statusTone } from './ordersUtils'

export default function OrderCard({ order }) {
  const { t, i18n } = useTranslation()
  const language = getLanguage(i18n)
  const [copied, setCopied] = useState(false)

  const status = String(order.status || '').toUpperCase()
  const tone = statusTone(order)
  const past = isOrderPast(order)
  const statusLabel = past && status === 'CONFIRMED'
    ? t('profile.orders.status.EXPIRED')
    : t(`profile.orders.status.${status}`, { defaultValue: status })
  const title = getLocalizedText(order.ticket?.title, language) || t('profile.orders.defaultTitle')
  const persons = order.totalPersons ?? order.quantity
  const total = order.totalPrice != null ? `${formatPrice(order.totalPrice)} ${t('tickets.currency')}` : ''

  const fields = [
    { label: t('profile.orders.visitDate'), value: formatDate(order.visitDate, language) },
    { label: t('profile.orders.persons'), value: persons },
    { label: t('profile.orders.validUntil'), value: formatDate(order.validUntil, language) },
    { label: t('profile.orders.total'), value: total },
    { label: t('profile.orders.buyer'), value: order.customerName },
    { label: t('profile.orders.phone'), value: order.customerPhone },
  ].filter((field) => field.value !== undefined && field.value !== null && field.value !== '')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(String(order.ticketNumber))
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <article className={`pf-order pf-order--${tone}`}>
      <div className="pf-order__stub">
        <span>{order.ticketNumber}</span>
      </div>

      <div className="pf-order__body">
        <header className="pf-order__head">
          <h3>{title}</h3>
          <span className={`pf-status pf-status--${tone}`}>{statusLabel}</span>
        </header>

        <dl className="pf-order__grid">
          {fields.map((field) => (
            <div key={field.label}>
              <dt>{field.label}</dt>
              <dd>{field.value}</dd>
            </div>
          ))}
        </dl>

        <footer className="pf-order__foot">
          {order.id && <code>ID: {order.id}</code>}
          {order.ticketNumber && (
            <button type="button" className="pf-copy" onClick={handleCopy}>
              {copied ? <FiCheck /> : <FiCopy />}
              {copied ? t('profile.orders.copied') : t('profile.orders.copy')}
            </button>
          )}
        </footer>
      </div>
    </article>
  )
}