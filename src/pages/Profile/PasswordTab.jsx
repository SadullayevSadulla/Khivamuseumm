import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiLoader, FiLock } from 'react-icons/fi'
import AuthField from '../Auth/AuthField'
import Notice from './Notice'
import { changePassword } from './profileApi'

const EMPTY = { oldPassword: '', newPassword: '', confirm: '' }

export default function PasswordTab({ resolveError }) {
  const { t } = useTranslation()
  const [form, setForm] = useState(EMPTY)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState(null)

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setNotice(null)
    if (form.newPassword.length < 6) {
      setNotice({ type: 'error', text: t('profile.password.errors.short') })
      return
    }
    if (form.newPassword !== form.confirm) {
      setNotice({ type: 'error', text: t('profile.password.errors.mismatch') })
      return
    }
    if (form.newPassword === form.oldPassword) {
      setNotice({ type: 'error', text: t('profile.password.errors.same') })
      return
    }
    setBusy(true)
    try {
      await changePassword({ oldPassword: form.oldPassword, newPassword: form.newPassword })
      setForm(EMPTY)
      setNotice({ type: 'success', text: t('profile.password.saved') })
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
        <h2>{t('profile.password.title')}</h2>
        <p>{t('profile.password.description')}</p>
      </div>
      <AuthField
        id="oldPassword"
        type="password"
        label={t('profile.password.old')}
        icon={FiLock}
        value={form.oldPassword}
        onChange={handleChange}
        autoComplete="current-password"
        required
      />
      <div className="au-row">
        <AuthField
          id="newPassword"
          type="password"
          label={t('profile.password.new')}
          icon={FiLock}
          hint={t('profile.password.hint')}
          value={form.newPassword}
          onChange={handleChange}
          autoComplete="new-password"
          required
        />
        <AuthField
          id="confirm"
          type="password"
          label={t('profile.password.confirm')}
          icon={FiLock}
          value={form.confirm}
          onChange={handleChange}
          autoComplete="new-password"
          required
        />
      </div>
      <Notice notice={notice} />
      <button type="submit" className="kh-btn kh-btn--solid au-submit" disabled={busy}>
        {busy ? <FiLoader className="au-spin" /> : t('profile.password.save')}
      </button>
    </form>
  )
}