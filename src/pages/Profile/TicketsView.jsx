import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { FiLoader } from 'react-icons/fi'
import OrderCard from './OrderCard'
import { isOrderActive, sortOrders } from './ordersUtils'

const FILTERS = ['all', 'active', 'past']

export default function TicketsView({ orders, error, onRetry }) {
  const { t } = useTranslation()
  const [filter, setFilter] = useState('all')

  const sorted = useMemo(() => sortOrders(orders || []), [orders])
  const visible = useMemo(() => {
    if (filter === 'active') return sorted.filter(isOrderActive)
    if (filter === 'past') return sorted.filter((order) => !isOrderActive(order))
    return sorted
  }, [sorted, filter])

  const counts = useMemo(
    () => ({
      all: sorted.length,
      active: sorted.filter(isOrderActive).length,
      past: sorted.filter((order) => !isOrderActive(order)).length,
    }),
    [sorted]
  )

  return (
    <div className="pf-tickets">
      <div className="pf-section-head">
        <div>
          <h2>{t('profile.orders.title')}</h2>
          <p>{t('profile.orders.description')}</p>
        </div>
        {orders && orders.length > 0 && (
          <div className="pf-filters" role="tablist">
            {FILTERS.map((id) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={filter === id}
                className={`pf-filter ${filter === id ? 'is-active' : ''}`}
                onClick={() => setFilter(id)}
              >
                {t(`profile.orders.filters.${id}`)} <span>{counts[id]}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {orders === null && !error && (
        <div className="pf-empty"><FiLoader className="au-spin" /></div>
      )}

      {error && (
        <div className="pf-empty" role="alert">
          <p>{error}</p>
          <button type="button" className="kh-btn" onClick={onRetry}>{t('profile.orders.retry')}</button>
        </div>
      )}

      {orders && !error && orders.length === 0 && (
        <div className="pf-empty">
          <p>{t('profile.orders.empty')}</p>
          <Link to="/tickets" className="kh-btn kh-btn--solid">{t('profile.orders.buy')}</Link>
        </div>
      )}

      {orders && !error && orders.length > 0 && visible.length === 0 && (
        <div className="pf-empty"><p>{t('profile.orders.emptyFiltered')}</p></div>
      )}

      {visible.length > 0 && (
        <div className="pf-orders">
          {visible.map((order) => (
            <OrderCard key={order.id || order.ticketNumber} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}