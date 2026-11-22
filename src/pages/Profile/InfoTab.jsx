import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiLoader, FiUser } from 'react-icons/fi'
import AuthField from '../Auth/AuthField'
import Notice from './Notice'
import { updateProfile } from './profileApi'

export default function InfoTab({ user, onUpdated, resolveError }) {
  const { t } = useTranslation()
  const [form, setForm] = useState({ firstName: user.firstName || '', lastName: user.lastName || '' })
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState(null)

  const changed = form.firstName.trim() !== (user.firstName || '') || form.lastName.trim() !== (user.lastName || '')

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setNotice(null)
    const firstName = form.firstName.trim()
    const lastName = form.lastName.trim()
    if (firstName.length < 2 || lastName.length < 2) {
      setNotice({ type: 'error', text: t('profile.info.errors.name') })
      return
    }
    setBusy(true)
    try {
      const updated = await updateProfile({ firstName, lastName })
      onUpdated(updated ? updated : { ...user, firstName, lastName })
      setNotice({ type: 'success', text: t('profile.info.saved') })
    } catch (err) {
      const message = resolveError(err)
      if (message) setNotice({ type: 'error', text: message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="au-form">
      <div className="pf-panel__head">
        <h2>{t('profile.info.title')}</h2>
        <p>{t('profile.info.description')}</p>
      </div>
      <div className="au-row">
        <AuthField
          id="firstName"
          label={t('profile.info.firstName')}
          icon={FiUser}
          value={form.firstName}
          onChange={handleChange}
          autoComplete="given-name"
          required
        />
        <AuthField
          id="lastName"
          label={t('profile.info.lastName')}
          icon={FiUser}
          value={form.lastName}
          onChange={handleChange}
          autoComplete="family-name"
          required
        />
      </div>
      <Notice notice={notice} />
      <button type="submit" className="kh-btn kh-btn--solid au-submit" disabled={busy || !changed}>
        {busy ? <FiLoader className="au-spin" /> : t('profile.info.save')}
      </button>
    </form>
  )
}