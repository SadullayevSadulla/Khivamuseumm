import { useEffect, useMemo, useState } from 'react'
import DOMPurify from 'dompurify'
import { FiCalendar } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import api from '../../api'
import './announcementDetails.css'

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

export default function AnnouncementDetails() {
    const { announcementDetails } = useParams()
    const { i18n, t } = useTranslation()
    const language = (i18n.resolvedLanguage || i18n.language || 'uz').split('-')[0]
    const [announcement, setAnnouncement] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let isCurrent = true

        const fetchAnnouncement = async () => {
            setLoading(true)
            setError('')
            try {
                const response = await api.get('/announcement')
                const items = Array.isArray(response?.data?.data) ? response.data.data : []
                const item = items.find(
                    (entry) => String(entry.slug || entry.id) === (announcementDetails || ''),
                )
                if (isCurrent) setAnnouncement(item || null)
            } catch {
                if (isCurrent) setError(t('home.error'))
            } finally {
                if (isCurrent) setLoading(false)
            }
        }

        fetchAnnouncement()
        return () => {
            isCurrent = false
        }
    }, [announcementDetails, t])

    const title = getLocalizedText(announcement?.title, language)
    const description = getLocalizedText(announcement?.description, language)
    const safeDescription = useMemo(() => DOMPurify.sanitize(description), [description])
    const image = announcement?.images?.find((entry) => entry.mainImage)?.url || announcement?.images?.[0]?.url

    if (loading) {
        return <main className="announcement-detail container" role="status">{t('home.loading')}</main>
    }

    if (error) {
        return <main className="announcement-detail container" role="alert">{error}</main>
    }

    if (!announcement) {
        return (
            <main className="announcement-detail container">
                <p>{t('announcement.notFound', 'E’lon topilmadi')}</p>
                <Link className="announcement-detail__back" to="/announcements">{t('header.announcements')}</Link>
            </main>
        )
    }

    return (
        <article className="announcement-detail container">
            <header className="announcement-detail__header">
                <h1>{title}</h1>
                <span className="announcement-detail__date">
                    <FiCalendar aria-hidden="true" />
                    {formatDate(announcement.createdAt, language)}
                </span>
            </header>

            {image && <img className="announcement-detail__image" src={image} alt={title} />}
            <div className="announcement-detail__description" dangerouslySetInnerHTML={{ __html: safeDescription }} />
        </article>
    )
}
