import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import './mainM.css'
import api from '../../../api'
import { Icons } from "../../../icons/icons";
import Loader from '../../../components/Loader/loader'

const getLocalizedText = (value, language) => {
    if (typeof value === 'string') return value
    if (!value || typeof value !== 'object') return ''

    return value[language] || value.uz || value.en || value.ru || ''
}

export const MainM = () => {
    const { i18n, t } = useTranslation()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get("/collection")
                setData(res.data.data)
            } catch {
                setError(t('home.error'))
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [t])
    if (loading) return <Loader fullHeight={false} />
    if (error) return <p>{error}</p>

    const language = (i18n.resolvedLanguage || i18n.language || 'uz').split('-')[0]

    return (
        <div className='container'>
            <section className='section kh-section'>
                <div className="kh-head section_top">
                    <p className="kh-eyebrow">{t('home.eyebrow.collection')}</p>
                    <h1 className="kh-title">{t('home.collectionTitle')}</h1>
                    <div className="kh-ornament" aria-hidden="true"><i /></div>
                    <p className="kh-lead">{t('home.collectionDescription')}</p>
                </div>
                <div className="section_bot">
                    {data.slice(0, 3).map((item, index) => {
                        const title = getLocalizedText(item.title, language) || 'Collection';
                        const description = getLocalizedText(item.description, language) || '';
                        const detailId = item.slug || item.id

                        return (
                            <article className="section_bot_card" key={item.id ?? index}>
                                <div className="section_bot_media">
                                    <img
                                        className="section_bot_image"
                                        src={item.images?.[0]?.url}
                                        alt={title}
                                        loading="lazy"
                                    />
                                </div>
                                <div className="section_bot_content">
                                    <span className="section_bot_num" aria-hidden="true">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <h2>{title}</h2>
                                    <p>{description}</p>
                                    <div className="section_bot_footer">
                                        <Link
                                            className="kh-btn section_bot_link"
                                            to={`/collections/${encodeURIComponent(detailId)}`}
                                        >
                                            {t('home.more')} <Icons.rightIcon height="1em" />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        )
                    })}
                </div>
            </section>
        </div>
    )
}