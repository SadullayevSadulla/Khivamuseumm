import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiKey, FiLoader, FiMail } from 'react-icons/fi'
import AuthField from '../Auth/AuthField'
import Notice from './Notice'
import { confirmEmailChange, requestEmailChange } from './profileApi'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export default function EmailTab({ user, onChanged, resolveError }) {
  const { t } = useTranslation()
  const [step, setStep] = useState('request')
  const [newEmail, setNewEmail] = useState('')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState(null)

  const handleRequest = async (e) => {
    e.preventDefault()
    setNotice(null)
    const email = newEmail.trim().toLowerCase()
    if (!EMAIL_RE.test(email)) {
      setNotice({ type: 'error', text: t('profile.email.errors.invalid') })
      return
    }
    if (email === (user.email || '').toLowerCase()) {
      setNotice({ type: 'error', text: t('profile.email.errors.same') })
      return
    }
    setBusy(true)
    try {
      await requestEmailChange({ newEmail: email })
      setNewEmail(email)
      setCode('')
      setStep('confirm')
      setNotice({ type: 'success', text: t('profile.email.codeSent', { email }) })
    } catch (err) {
      const message = resolveError(err)
      if (message) setNotice({ type: 'error', text: message })
    } finally {
      setBusy(false)
    }
  }

  const handleConfirm = async (e) => {
    e.preventDefault()
    setNotice(null)
    if (code.trim().length < 4) {
      setNotice({ type: 'error', text: t('profile.email.errors.code') })
      return
    }
    setBusy(true)
    try {
      await confirmEmailChange({ newEmail, code: code.trim() })
      await onChanged()
      setStep('request')
      setNewEmail('')
      setCode('')
      setNotice({ type: 'success', text: t('profile.email.changed') })
    } catch (err) {
      const message = resolveError(err)
      if (message) setNotice({ type: 'error', text: message })
    } finally {
      setBusy(false)
    }
  }

  const handleBack = () => {
    setStep('request')
    setCode('')
    setNotice(null)
  }

  return (
    <div className="au-form">
      <div className="pf-panel__head">
        <h2>{t('profile.email.title')}</h2>
        <p>{t('profile.email.description')}</p>
      </div>

      <div className="pf-current">
        <span>{t('profile.email.current')}</span>
        <strong>{user.email}</strong>
      </div>

      {step === 'request' ? (
        <form onSubmit={handleRequest} className="au-form">
          <AuthField
            id="newEmail"
            type="email"
            label={t('profile.email.newEmail')}
            icon={FiMail}
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <Notice notice={notice} />
          <button type="submit" className="kh-btn kh-btn--solid au-submit" disabled={busy}>
            {busy ? <FiLoader className="au-spin" /> : t('profile.email.request')}
          </button>
        </form>
      ) : (
        <form onSubmit={handleConfirm} className="au-form">
          <div className="au-field au-code">
            <label htmlFor="emailCode">{t('profile.email.codeLabel')}</label>
            <div className="au-input">
              <input
                id="emailCode"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={8}
                placeholder="••••••"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\s/g, ''))}
                autoFocus
              />
            </div>
          </div>
          <Notice notice={notice} />
          <button type="submit" className="kh-btn kh-btn--solid au-submit" disabled={busy}>
            {busy ? <FiLoader className="au-spin" /> : <><FiKey /> {t('profile.email.confirm')}</>}
          </button>
          <button type="button" className="au-resend" onClick={handleBack} disabled={busy}>
            {t('profile.email.back')}
          </button>
        </form>
      )}
    </div>
  )
}