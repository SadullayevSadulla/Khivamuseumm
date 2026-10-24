import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import './mainM.css'
import api from '../../../api'
import { Icons } from "../../../icons/icons";

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
    if (loading) return <p>{t('home.loading')}</p>
    if (error) return <p>{error}</p>

    const language = (i18n.resolvedLanguage || i18n.language || 'uz').split('-')[0]

    return (
        <div className='container'>
            <section className='section flex flex-col gap-5 mt-30'>
                <div className="section_top flex-col gap-2">
                    <h1>{t('home.collectionTitle')}</h1>
                    <p>{t('home.collectionDescription')}</p>
                </div>
                <div className="section_bot">
                    {data.slice(0, 7).map((item, index) => (
                        <article className="section_bot_card" key={item.id ?? index}>
                            <img
                                className="section_bot_image"
                                src={item.images?.[0]?.url}
                                alt={getLocalizedText(item.title, language)}
                            />
                            <div className="section_bot_content">
                                <h2>{getLocalizedText(item.title, language)}</h2>
                                <p>{getLocalizedText(item.description, language)}</p>
                                <div className="section_bot_footer">
                                    <Link className="section_bot_link" to={`/collections/${item.id}`}>
                                        {t('home.more')} <Icons.rightIcon height="1em" />
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    )
}
