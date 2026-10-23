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
    const { i18n } = useTranslation()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get("/collection")
                setData(res.data.data)
                console.log(res.data.data)
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message)
                } else {
                    setError("Xatolik")
                }
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])
    if (loading) return <p>Yuklanmoqda...</p>
    if (error) return <p>{error}</p>

    const language = (i18n.resolvedLanguage || i18n.language || 'uz').split('-')[0]

    return (
        <div className='container'>
            <section className='section flex flex-col gap-5 mt-30'>
                <div className="section_top flex-col gap-2">
                    <h1>Xorazm madaniy merosi kolleksiyasi</h1>
                    <p>Xiva davlat muzey qo'riqxonasining boy to'plamida asrlar davomida saqlanib kelgan noyob eksponatlar namoyish etilmoqda. An'anaviy keramika, milliy kiyimlar va qadimiy qurol-yarog'lar orqali Xorazm xalqining tarixini va madaniyatini kashf eting.</p>
                </div>
                <div className="section_bot">
                    {data.slice(0, 4).map((item, index) => (
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
                                        Batafsil <Icons.rightIcon height="1em" />
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
