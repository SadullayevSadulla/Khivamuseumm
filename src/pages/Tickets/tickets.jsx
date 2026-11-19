import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import DOMPurify from 'dompurify'
import { FiCalendar, FiCheck, FiChevronDown, FiClock, FiShield, FiUsers } from 'react-icons/fi'
import Loader from '../../components/Loader/loader'
import PurchaseModal from './PurchaseModal'
import { fetchTickets } from './ticketsApi'
import { formatDate, formatPrice, getLanguage, getLocalizedText, isExpired } from './ticketsUtils'
import './tickets.css'

const TicketCard = ({ ticket, language, onBuy }) => {
  const { t } = useTranslation()
  const [rulesOpen, setRulesOpen] = useState(false)

  const title = getLocalizedText(ticket.title, language)
  const rules = DOMPurify.sanitize(getLocalizedText(ticket.rules, language))
  const services = Array.isArray(ticket.includedServices) ? ticket.includedServices : []
  const expired = isExpired(ticket)
  const category = ticket.category
    ? t(`tickets.categories.${ticket.category}`, { defaultValue: String(ticket.category) })
    : ''
  const from = formatDate(ticket.validFrom, language)
  const to = formatDate(ticket.validTo, language)

  return (
    <article className={`tk-card ${expired ? 'tk-card--expired' : ''}`}>
      <header className="tk-card__top">
        {category && <span className="tk-card__badge">{category}</span>}
        <h2>{title}</h2>
        <p className="tk-card__price">
          <strong>{formatPrice(ticket.price, language)}</strong>
          <span>{t('tickets.currency')}</span>
        </p>
      </header>

      <div className="tk-card__perf" aria-hidden="true" />

      <div className="tk-card__body">
        <ul className="tk-meta">
          {ticket.personCount ? (
            <li><FiUsers /> {t('tickets.person', { count: ticket.personCount })}</li>
          ) : null}
          {ticket.validDays ? (
            <li><FiCalendar /> {t('tickets.validDays', { count: ticket.validDays })}</li>
          ) : null}
          {ticket.visitingHours ? <li><FiClock /> {ticket.visitingHours}</li> : null}
          {ticket.ageRestriction ? <li><FiShield /> {ticket.ageRestriction}</li> : null}
        </ul>

        {services.length > 0 && (
          <div className="tk-services">
            <h3>{t('tickets.includes')}</h3>
            <ul>
              {services.map((item, i) => (
                <li key={`${item}-${i}`}><FiCheck /> <span>{typeof item === 'string' ? item : getLocalizedText(item, language)}</span></li>
              ))}
            </ul>
          </div>
        )}

        {(from || to) && (
          <p className="tk-validity">
            {t('tickets.validity')}: <strong>{from}{from && to ? ' — ' : ''}{to}</strong>
          </p>
        )}

        {rules && (
          <div className="tk-rules">
            <button
              type="button"
              className="tk-rules__toggle"
              aria-expanded={rulesOpen}
              onClick={() => setRulesOpen((v) => !v)}
            >
              {t('tickets.rules')} <FiChevronDown />
            </button>
            {rulesOpen && <div className="tk-rules__content" dangerouslySetInnerHTML={{ __html: rules }} />}
          </div>
        )}

        <button type="button" className="kh-btn kh-btn--solid tk-card__buy" disabled={expired} onClick={() => onBuy(ticket)}>
          {expired ? t('tickets.expired') : t('tickets.buy')}
        </button>
      </div>
    </article>
  )
}

const Tickets = () => {
  const { t, i18n } = useTranslation()
  const language = getLanguage(i18n)
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    let current = true
    fetchTickets()
      .then((list) => current && setTickets(list.filter((item) => item.isActive !== false)))
      .catch(() => current && setError(true))
      .finally(() => current && setLoading(false))
    return () => {
      current = false
    }
  }, [])

  return (
    <div className="tickets-page">
      <div className="container kh-section">
        <div className="kh-head kh-rise">
          <p className="kh-eyebrow">{t('tickets.eyebrow')}</p>
          <h1 className="kh-title">{t('tickets.title')}</h1>
          <div className="kh-ornament" aria-hidden="true"><i /></div>
          <p className="kh-lead">{t('tickets.description')}</p>
        </div>

        {loading && <Loader fullHeight={false} />}
        {!loading && error && <p className="tk-state" role="alert">{t('tickets.loadError')}</p>}
        {!loading && !error && tickets.length === 0 && <p className="tk-state">{t('tickets.empty')}</p>}

        {!loading && !error && tickets.length > 0 && (
          <div className="tk-grid">
            {tickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} language={language} onBuy={setSelected} />
            ))}
          </div>
        )}
      </div>

      {selected && <PurchaseModal ticket={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

export default Tickets