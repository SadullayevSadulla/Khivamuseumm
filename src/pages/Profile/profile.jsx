import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { FiCamera, FiCheckCircle, FiLoader, FiLock, FiLogOut, FiMail, FiTrash2, FiUser } from 'react-icons/fi'
import Loader from '../../components/Loader/loader'
import EmailTab from './EmailTab'
import Notice from './Notice'
import PasswordTab from './PasswordTab'
import { clearSession, deleteAvatar, fetchProfile, getToken, uploadAvatar } from './profileApi'
import { extractError, formatDate, getLanguage } from '../Tickets/ticketsUtils'
import '../Auth/auth.css'
import './profile.css'

const MAX_AVATAR_SIZE = 5 * 1024 * 1024

const TABS = [
  { id: 'info', icon: FiUser },
  { id: 'password', icon: FiLock },
  { id: 'email', icon: FiMail },
]

const pickAvatar = (user) => {
  const images = Array.isArray(user?.images) ? user.images : []
  return (images.find((item) => item.mainImage) || images[0])?.url || null
}

const Profile = () => {
  const { t, i18n } = useTranslation()
  const language = getLanguage(i18n)
  const navigate = useNavigate()
  const fileRef = useRef(null)

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [tab, setTab] = useState('info')
  const [avatarBusy, setAvatarBusy] = useState(false)
  const [avatarNotice, setAvatarNotice] = useState(null)

  const logout = useCallback(() => {
    clearSession()
    navigate('/login', { replace: true })
  }, [navigate])

  const resolveError = useCallback(
    (err) => {
      if (err.response?.status === 401) {
        logout()
        return null
      }
      return err.response ? extractError(err, t('profile.errors.generic')) : t('profile.errors.network')
    },
    [logout, t]
  )

  const reload = useCallback(async () => {
    const fresh = await fetchProfile()
    setUser(fresh)
    return fresh
  }, [])

  useEffect(() => {
    document.title = t('profile.title')
  }, [t])

  useEffect(() => {
    if (!getToken()) {
      navigate('/login', { replace: true })
      return undefined
    }
    let active = true
    setLoading(true)
    reload()
      .catch((err) => {
        if (!active) return
        const message = resolveError(err)
        if (message) setLoadError(message)
      })
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [navigate, reload, resolveError])

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setAvatarNotice(null)
    if (!file.type.startsWith('image/')) {
      setAvatarNotice({ type: 'error', text: t('profile.avatar.invalidType') })
      return
    }
    if (file.size > MAX_AVATAR_SIZE) {
      setAvatarNotice({ type: 'error', text: t('profile.avatar.tooBig') })
      return
    }
    setAvatarBusy(true)
    try {
      const updated = await uploadAvatar(file)
      if (updated) setUser(updated)
      else await reload()
      setAvatarNotice({ type: 'success', text: t('profile.avatar.updated') })
    } catch (err) {
      const message = resolveError(err)
      if (message) setAvatarNotice({ type: 'error', text: message })
    } finally {
      setAvatarBusy(false)
    }
  }

  const handleRemoveAvatar = async () => {
    setAvatarNotice(null)
    setAvatarBusy(true)
    try {
      await deleteAvatar()
      await reload()
      setAvatarNotice({ type: 'success', text: t('profile.avatar.removed') })
    } catch (err) {
      const message = resolveError(err)
      if (message) setAvatarNotice({ type: 'error', text: message })
    } finally {
      setAvatarBusy(false)
    }
  }

  if (loading) {
    return (
      <div className="pf-page">
        <Loader fullHeight={false} />
      </div>
    )
  }

  if (loadError || !user) {
    return (
      <div className="pf-page">
        <div className="container">
          <p className="pf-state" role="alert">{loadError || t('profile.errors.generic')}</p>
        </div>
      </div>
    )
  }

  const avatarUrl = pickAvatar(user)
  const initials = `${(user.firstName || '').charAt(0)}${(user.lastName || '').charAt(0)}`.toUpperCase()
  const roleLabel = t(`profile.roles.${user.role}`, { defaultValue: user.role || '' })

  return (
    <div className="pf-page">
      <div className="container">
        <div className="pf-head kh-rise">
          <p className="kh-eyebrow">{t('profile.eyebrow')}</p>
          <h1 className="kh-title">{t('profile.title')}</h1>
          <div className="kh-ornament" aria-hidden="true"><i /></div>
        </div>

        <div className="pf-grid kh-rise">
          <aside className="pf-side">
            <div className="pf-avatar">
              {avatarUrl ? <img src={avatarUrl} alt="" /> : <span>{initials || <FiUser />}</span>}
              {avatarBusy && (
                <div className="pf-avatar__busy"><FiLoader className="au-spin" /></div>
              )}
              <button
                type="button"
                className="pf-avatar__edit"
                onClick={() => fileRef.current?.click()}
                disabled={avatarBusy}
                aria-label={t('profile.avatar.change')}
              >
                <FiCamera />
              </button>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />
            </div>

            <h2 className="pf-name">{user.firstName} {user.lastName}</h2>
            <p className="pf-email">{user.email}</p>

            <div className="pf-badges">
              {roleLabel && <span className="pf-badge">{roleLabel}</span>}
              <span className={`pf-badge ${user.emailVerified ? 'pf-badge--ok' : 'pf-badge--warn'}`}>
                {user.emailVerified && <FiCheckCircle />}
                {user.emailVerified ? t('profile.verified') : t('profile.unverified')}
              </span>
            </div>

            {user.createdAt && (
              <p className="pf-since">
                {t('profile.memberSince')}: <strong>{formatDate(user.createdAt, language)}</strong>
              </p>
            )}

            <Notice notice={avatarNotice} />

            <div className="pf-side__actions">
              {avatarUrl && (
                <button type="button" className="pf-link" onClick={handleRemoveAvatar} disabled={avatarBusy}>
                  <FiTrash2 /> {t('profile.avatar.remove')}
                </button>
              )}
              <button type="button" className="pf-link pf-link--danger" onClick={logout}>
                <FiLogOut /> {t('profile.logout')}
              </button>
            </div>
          </aside>

          <section className="pf-main">
            <div className="pf-tabs" role="tablist">
              {TABS.map(({ id, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  id={`pf-tab-${id}`}
                  aria-selected={tab === id}
                  aria-controls={`pf-panel-${id}`}
                  className={`pf-tab ${tab === id ? 'is-active' : ''}`}
                  onClick={() => setTab(id)}
                >
                  <Icon /> <span>{t(`profile.tabs.${id}`)}</span>
                </button>
              ))}
            </div>

            <div className="pf-panel" role="tabpanel" id={`pf-panel-${tab}`} aria-labelledby={`pf-tab-${tab}`}>
              {tab === 'info' && <InfoTab user={user} onUpdated={setUser} resolveError={resolveError} />}
              {tab === 'password' && <PasswordTab resolveError={resolveError} />}
              {tab === 'email' && <EmailTab user={user} onChanged={reload} resolveError={resolveError} />}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Profile