import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { FiCheckCircle, FiMail, FiMinus, FiPlus, FiRefreshCw, FiX } from 'react-icons/fi'
import {
  pickOrder,
  pickOrderId,
  purchaseTicket,
  resendCode,
  verifyTicket,
} from './ticketsApi'
import { getStoredUser } from '../../utils/auth'
import { extractError, formatDate, formatPrice, getLanguage, getLocalizedText, visitDateRange } from './ticketsUtils'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const RESEND_SECONDS = 60
const MAX_QUANTITY = 10

export default function PurchaseModal({ ticket, onClose }) {
  const { t, i18n } = useTranslation()
  const language = getLanguage(i18n)
  const title = getLocalizedText(ticket.title, language)

  const [step, setStep] = useState('form')
  const dateRange = visitDateRange(ticket)
  const account = getStoredUser()
  const [form, setForm] = useState({
    fullName: account ? `${account.firstName || ''} ${account.lastName || ''}`.trim() : '',
    email: account?.email || '',
    phone: '',
    visitDate: dateRange.min,
  })
  const [quantity, setQuantity] = useState(1)
  const [code, setCode] = useState('')
  const [orderId, setOrderId] = useState(null)
  const [order, setOrder] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(0)
  const firstFieldRef = useRef(null)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  useEffect(() => {
    firstFieldRef.current?.focus()
  }, [step])

  useEffect(() => {
    if (timer <= 0) return undefined
    const id = setTimeout(() => setTimer((s) => s - 1), 1000)
    return () => clearTimeout(id)
  }, [timer])

  const setField = (name) => (e) => setForm((f) => ({ ...f, [name]: e.target.value }))
  const total = (Number(ticket.price) || 0) * quantity

  const handlePurchase = async (e) => {
    e.preventDefault()
    setError('')
    if (form.fullName.trim().length < 3) return setError(t('tickets.modal.errors.name'))
    if (!EMAIL_RE.test(form.email.trim())) return setError(t('tickets.modal.errors.email'))
    if (!form.visitDate || form.visitDate < dateRange.min || (dateRange.max && form.visitDate > dateRange.max)) {
      return setError(t('tickets.modal.errors.date'))
    }

    setBusy(true)
    try {
      const res = await purchaseTicket({
        ticket,
        customerName: form.fullName.trim(),
        customerEmail: form.email.trim(),
        customerPhone: form.phone.trim(),
        quantity,
        visitDate: form.visitDate,
      })
      const id = pickOrderId(res)
      if (!id) throw new Error("orderId yo'q")
      setOrderId(id)
      setTimer(RESEND_SECONDS)
      setCode('')
      setStep('code')
    } catch (err) {
      setError(err.response ? extractError(err, t('tickets.modal.errors.generic')) : t('tickets.modal.errors.network'))
    } finally {
      setBusy(false)
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')
    if (code.trim().length < 4) return setError(t('tickets.modal.errors.code'))

    setBusy(true)
    try {
      const res = await verifyTicket({ orderId, code: code.trim() })
      setOrder(pickOrder(res))
      setStep('done')
    } catch (err) {
      setError(err.response ? extractError(err, t('tickets.modal.errors.codeWrong')) : t('tickets.modal.errors.network'))
    } finally {
      setBusy(false)
    }
  }

  const handleResend = async () => {
    if (timer > 0 || busy) return
    setError('')
    setBusy(true)
    try {
      await resendCode({ orderId })
      setTimer(RESEND_SECONDS)
    } catch (err) {
      setError(err.response ? extractError(err, t('tickets.modal.errors.generic')) : t('tickets.modal.errors.network'))
    } finally {
      setBusy(false)
    }
  }

  return createPortal(
    <div className="tk-modal" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="tk-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="tk-modal-title">
        <button type="button" className="tk-modal__close" onClick={onClose} aria-label={t('tickets.modal.close')}>
          <FiX />
        </button>

        {step === 'form' && (
          <form onSubmit={handlePurchase} noValidate>
            <p className="kh-eyebrow tk-modal__eyebrow">{t('tickets.modal.title')}</p>
            <h2 id="tk-modal-title" className="tk-modal__title">{title}</h2>

            <label className="tk-field">
              <span>{t('tickets.modal.fullName')}</span>
              <input ref={firstFieldRef} value={form.fullName} onChange={setField('fullName')} autoComplete="name" required />
            </label>
            <label className="tk-field">
              <span>{t('tickets.modal.email')}</span>
              <input type="email" value={form.email} onChange={setField('email')} autoComplete="email" required />
            </label>
            <label className="tk-field">
              <span>{t('tickets.modal.phone')}</span>
              <input type="tel" value={form.phone} onChange={setField('phone')} autoComplete="tel" placeholder="+998" />
            </label>

            <label className="tk-field">
              <span>{t('tickets.modal.visitDate')}</span>
              <input
                type="date"
                value={form.visitDate}
                min={dateRange.min}
                max={dateRange.max}
                onChange={setField('visitDate')}
                required
              />
            </label>

            <div className="tk-qty">
              <span>{t('tickets.modal.quantity')}</span>
              <div className="tk-qty__control">
                <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={quantity <= 1} aria-label="−"><FiMinus /></button>
                <output aria-live="polite">{quantity}</output>
                <button type="button" onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))} disabled={quantity >= MAX_QUANTITY} aria-label="+"><FiPlus /></button>
              </div>
            </div>

            <div className="tk-total">
              <span>{t('tickets.modal.total')}</span>
              <strong>{formatPrice(total, language)} <small>{t('tickets.currency')}</small></strong>
            </div>

            {error && <p className="tk-error" role="alert">{error}</p>}
            <button type="submit" className="kh-btn kh-btn--solid tk-modal__submit" disabled={busy}>
              {busy ? t('tickets.modal.sending') : t('tickets.modal.submit')}
            </button>
          </form>
        )}

        {step === 'code' && (
          <form onSubmit={handleVerify} noValidate>
            <span className="tk-modal__icon"><FiMail /></span>
            <h2 id="tk-modal-title" className="tk-modal__title">{t('tickets.modal.codeTitle')}</h2>
            <p className="tk-modal__text">
              {t('tickets.modal.codeHint')} <strong>{form.email}</strong>
            </p>

            <label className="tk-field">
              <span>{t('tickets.modal.codeLabel')}</span>
              <input
                ref={firstFieldRef}
                className="tk-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={8}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\s/g, ''))}
                placeholder="••••••"
              />
            </label>

            {error && <p className="tk-error" role="alert">{error}</p>}
            <button type="submit" className="kh-btn kh-btn--solid tk-modal__submit" disabled={busy}>
              {busy ? t('tickets.modal.verifying') : t('tickets.modal.verify')}
            </button>

            <button type="button" className="tk-resend" onClick={handleResend} disabled={timer > 0 || busy}>
              <FiRefreshCw />
              {timer > 0 ? t('tickets.modal.resendIn', { seconds: timer }) : t('tickets.modal.resend')}
            </button>
          </form>
        )}

        {step === 'done' && (
          <div className="tk-done">
            <span className="tk-modal__icon tk-modal__icon--ok"><FiCheckCircle /></span>
            <h2 id="tk-modal-title" className="tk-modal__title">{t('tickets.modal.successTitle')}</h2>
            <p className="tk-modal__text">{t('tickets.modal.successText')} <strong>{form.email}</strong></p>
            {order?.ticketNumber && (
              <div className="tk-number">
                <span>{t('tickets.modal.ticketNumber')}</span>
                <strong>{order.ticketNumber}</strong>
                {(order.visitDate || order.validUntil) && (
                  <p>
                    {order.visitDate && <>{t('tickets.modal.visitDate')}: {formatDate(order.visitDate, language)}</>}
                    {order.visitDate && order.validUntil && ' · '}
                    {order.validUntil && <>{t('tickets.modal.validUntil')}: {formatDate(order.validUntil, language)}</>}
                  </p>
                )}
              </div>
            )}
            <button type="button" ref={firstFieldRef} className="kh-btn kh-btn--solid tk-modal__submit" onClick={onClose}>
              {t('tickets.modal.done')}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}