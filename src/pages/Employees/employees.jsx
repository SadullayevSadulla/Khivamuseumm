import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import "./employees.css"
import api from '../../api'
import { FiCalendar } from 'react-icons/fi'

const getSafeText = (value) => {
    if (typeof value === 'string') return value
    if (Array.isArray(value)) return value.join(', ')
    if (value && typeof value === 'object') {
        return (
            value.en ||
            value.ru ||
            value.uz ||
            value['en-US'] ||
            Object.values(value)[0] ||
            ''
        )
    }
    return ''
}

const formatDate = (dateString) => {
    if (!dateString) return ''

    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return dateString

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    return `${day}.${month}.${year}`
}

const Employees = () => {
    const { t } = useTranslation()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/employees')
                setData(Array.isArray(res?.data?.data) ? res.data.data : [])
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message)
                } else {
                    setError('Xatolik')
                }
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading) return <p>Yuklanmoqda...</p>
    if (error) return <p>{error}</p>

    return (
        <section className="hodimlar">
            <div className="hodimlar_titile">
                <h1>{t('header.employees')}</h1>
            </div>

            <div className="hodimlarr">
                {data.length === 0 ? (
                    <p className="hodim_empty">Hozircha xodimlar mavjud emas.</p>
                ) : (
                    data.map((employee, index) => {
                        const fullName = getSafeText(employee.fullName) || "Noma'lum xodim"
                        const position = getSafeText(employee.position) || 'Xodim'
                        const birthDate = formatDate(employee.birthDate || employee.birthday)
                        const image = employee.images?.[0]?.url || employee.images?.[0]?.src || employee.images?.[0]?.image || ''
                        const initials = fullName
                            .split(' ')
                            .filter(Boolean)
                            .slice(0, 1)
                            .map((part) => part[0]?.toUpperCase() || '')
                            .join('') || 'X'

                        return (
                            <article key={employee.id || `${fullName}-${index}`} className="hodim_card">
                                <div className="hodim_img_wrap">
                                    {image ? (
                                        <img src={image} alt={fullName} className="hodim_img" />
                                    ) : (
                                        <div className="hodim_initials">{initials}</div>
                                    )}
                                </div>

                                <div className="hodim_content">
                                    <h3>{fullName}</h3>
                                    <p className="hodim_position">{position}</p>

                                    <div className="hodim_footer">
                                        <div className="hodim_date">
                                            <FiCalendar />
                                            <span>{birthDate}</span>
                                        </div>
                                        <span className="hodim_check">✓</span>
                                    </div>
                                </div>
                            </article>
                        )
                    })
                )}
            </div>
        </section>
    )
}

export default Employees