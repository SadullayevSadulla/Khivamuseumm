import './announcements.css'
import api from '../../api'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { FiArrowUpRight, FiCalendar } from 'react-icons/fi'

const getLocalizedText = (value, language) => {
    if (typeof value === 'string') return value
    if (!value || typeof value !== 'object') return ''
    const localizedValue = value[language] || value.uz || value.en || value.ru
    return typeof localizedValue === 'string' ? localizedValue : ''
}

const formatDate = (value, language) => {
    if (!value) return ''
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    const locale = { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-US' }[language] || 'uz-UZ'
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date)
}

const Announcements = () => {
    const { i18n, t } = useTranslation()
    const language = (i18n.resolvedLanguage || i18n.language || 'uz').split('-')[0]
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        let isCurrent = true

        const fetchData = async () => {
            try {
                const res = await api.get('/announcement')
                if (isCurrent) {
                    setData(Array.isArray(res?.data?.data) ? res.data.data : [])
                }
            } catch {
                if (isCurrent) setError(t('home.error'))
            } finally {
                if (isCurrent) setLoading(false)
            }
        }

        fetchData()
        return () => {
            isCurrent = false
        }
    }, [t])

    if (loading) return <main className="announcements-page container"><p role="status">{t('home.loading')}</p></main>
    if (error) return <main className="announcements-page container"><p role="alert">{error}</p></main>

    return (
        <main className="announcements-page container">
            <header className="announcements-heading">
                <h1>{t('header.announcements')}</h1>
            </header>

            {data.length === 0 ? (
                <p className="announcements-empty">{t('comingSoon')}</p>
            ) : (
                <div className="announcements-grid">
                    {data.map((item, index) => {
                        const title = getLocalizedText(item.title, language) || t('header.announcements')
                        const image = item.images?.find((entry) => entry.mainImage)?.url || item.images?.[0]?.url
                        const detailId = item.slug || item.id

                        return (
                            <article className="announcement-card" key={item.id || detailId || index}>
                                <Link
                                    className="announcement-card__link"
                                    to={`/announcements/${encodeURIComponent(detailId)}`}
                                    aria-label={`${title} — ${t('home.more')}`}
                                >
                                    <div className="announcement-card__image-wrap">
                                        {image ? (
                                            <img src={image} alt={title} loading="lazy" />
                                        ) : (
                                            <div className="announcement-card__image-placeholder">{t('home.noImage')}</div>
                                        )}
                                    </div>
                                    <div className="announcement-card__body">
                                        <span className="announcement-card__date">
                                            <FiCalendar aria-hidden="true" />
                                            {formatDate(item.createdAt, language)}
                                        </span>
                                        <h2>{title}</h2>
                                        <span className="announcement-card__more">
                                            {t('home.more')}
                                            <FiArrowUpRight aria-hidden="true" />
                                        </span>
                                    </div>
                                </Link>
                            </article>
                        )
                    })}
                </div>
            )}
        </main>
    )
}

export default Announcements