import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiLoader, FiUser } from 'react-icons/fi'
import AuthField from '../Auth/AuthField'
import Notice from './Notice'
import { updateProfile } from './profileApi'

export default function InfoTab({ user, onUpdated, resolveError }) {
  const { t } = useTranslation()
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
  })
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    setForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
    })
  }, [user])

  const handleChange = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
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
      if (updated) onUpdated(updated)
      else onUpdated((previous) => ({ ...previous, firstName, lastName }))
      setNotice({ type: 'success', text: t('profile.info.saved') })
    } catch (error) {
      const message = resolveError(error)
      if (message) setNotice({ type: 'error', text: message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="au-form">
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
      <button type="submit" className="kh-btn kh-btn--solid au-submit" disabled={busy}>
        {busy ? <FiLoader className="au-spin" /> : t('profile.info.save')}
      </button>
    </form>
  )
}
