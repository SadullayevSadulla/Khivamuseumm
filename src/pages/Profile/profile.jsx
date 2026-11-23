import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { FiCamera, FiLoader, FiLogOut, FiSettings, FiTrash2, FiUser } from 'react-icons/fi'
import { IoTicketOutline } from 'react-icons/io5'
import Loader from '../../components/Loader/loader'
import Notice from './Notice'
import SettingsView from './SettingsView'
import TicketsView from './TicketsView'
import { nextVisitDate } from './ordersUtils'
import { clearSession, deleteAvatar, fetchMyOrders, fetchProfile, getToken, uploadAvatar } from './profileApi'
import { extractError, formatDate, getLanguage } from '../Tickets/ticketsUtils'
import { saveUser } from '../../utils/auth'
import '../Auth/auth.css'
import './profile.css'

const MAX_AVATAR_SIZE = 5 * 1024 * 1024

const pickAvatar = (user) => {
  const images = Array.isArray(user?.images) ? user.images : []
  return (images.find((item) => item.mainImage) || images[0])?.url || null
}

const initialView = () => (window.location.hash === '#settings' ? 'settings' : 'tickets')

const Profile = () => {
  const { t, i18n } = useTranslation()
  const language = getLanguage(i18n)
  const navigate = useNavigate()
  const fileRef = useRef(null)

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [view, setView] = useState(initialView)
  const [orders, setOrders] = useState(null)
  const [ordersError, setOrdersError] = useState('')
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

  const loadOrders = useCallback(async () => {
    setOrdersError('')
    setOrders(null)
    try {
      setOrders(await fetchMyOrders())
    } catch (err) {
      const message = resolveError(err)
      if (message) setOrdersError(t('profile.orders.loadError'))
      setOrders([])
    }
  }, [resolveError, t])

  const changeView = (next) => {
    setView(next)
    window.history.replaceState(null, '', `#${next}`)
  }

  useEffect(() => {
    document.title = t('profile.title')
  }, [t])

  useEffect(() => {
    if (user) saveUser(user)
  }, [user])

  useEffect(() => {
    if (!getToken()) {
      navigate('/login', { replace: true })
      return undefined
    }
    let active = true
    setLoading(true)
    reload()
      .then(() => active && loadOrders())
      .catch((err) => {
        if (!active) return
        const message = resolveError(err)
        if (message) setLoadError(message)
      })
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

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
  const next = orders ? nextVisitDate(orders) : null

  return (
    <div className="pf-page">
      <div className="container">
        <section className="pf-hero kh-rise">
          <div className="pf-hero__text">
            <p className="kh-eyebrow">{t('profile.eyebrow')}</p>
            <h1>{t('profile.hero.greeting', { name: user.firstName })}</h1>
            <p>{t('profile.hero.subtitle')}</p>
          </div>
          <div className="pf-hero__stats">
            <div>
              <strong>{orders ? orders.length : '—'}</strong>
              <span>{t('profile.hero.ticketsCount')}</span>
            </div>
            <div>
              <strong>{next ? formatDate(next, language) : '—'}</strong>
              <span>{t('profile.hero.nextVisit')}</span>
            </div>
          </div>
        </section>

        <div className="pf-grid kh-rise">
          <aside className="pf-side">
            <div className="pf-avatar">
              {avatarUrl ? <img src={avatarUrl} alt="" /> : <span>{initials || <FiUser />}</span>}
              {avatarBusy && (
                <div className="pf-avatar__busy"><FiLoader className="au-spin" /></div>
              )}
              <button
                type="button"
                className={`pf-avatar__edit ${avatarUrl ? 'pf-avatar__edit--remove' : ''}`}
                onClick={avatarUrl ? handleRemoveAvatar : () => fileRef.current?.click()}
                disabled={avatarBusy}
                aria-label={avatarUrl ? t('profile.avatar.remove') : t('profile.avatar.change')}
                title={avatarUrl ? t('profile.avatar.remove') : t('profile.avatar.change')}
              >
                {avatarUrl ? <FiTrash2 /> : <FiCamera />}
              </button>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />
            </div>

            <h2 className="pf-name">{user.firstName} {user.lastName}</h2>
            <p className="pf-email">{user.email}</p>

            <Notice notice={avatarNotice} />

            <nav className="pf-nav" aria-label={t('profile.title')}>
              <button
                type="button"
                className={`pf-nav__item ${view === 'tickets' ? 'is-active' : ''}`}
                onClick={() => changeView('tickets')}
              >
                <IoTicketOutline />
                <span>{t('profile.nav.tickets')}</span>
                {orders && orders.length > 0 && <em>{orders.length}</em>}
              </button>
              <button
                type="button"
                className={`pf-nav__item ${view === 'settings' ? 'is-active' : ''}`}
                onClick={() => changeView('settings')}
              >
                <FiSettings />
                <span>{t('profile.nav.settings')}</span>
              </button>
              <button type="button" className="pf-nav__item pf-nav__item--danger" onClick={logout}>
                <FiLogOut />
                <span>{t('profile.logout')}</span>
              </button>
            </nav>

            {user.createdAt && (
              <p className="pf-since">
                {t('profile.memberSince')}: <strong>{formatDate(user.createdAt, language)}</strong>
              </p>
            )}
          </aside>

          <section className="pf-main">
            {view === 'tickets' ? (
              <TicketsView orders={orders} error={ordersError} onRetry={loadOrders} />
            ) : (
              <SettingsView user={user} onUpdated={setUser} onReload={reload} resolveError={resolveError} />
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default Profile