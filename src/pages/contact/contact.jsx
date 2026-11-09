import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import "./contact.css"
import api from '../../api'

export const Contact = () => {
  const { t } = useTranslation()
  const [submitting, setSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    phone: '',
    email: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData((previous) => ({ ...previous, [e.target.name]: e.target.value }))
    setSubmitMessage(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitMessage(null)

    try {
      await api.post("/contact", {
        firstName: formData.name.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      })
      setSubmitMessage({ type: 'success', text: t('contact.successMsg') })
      setFormData({ name: '', lastName: '', phone: '', email: '', message: '' })
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || t('contact.errorMsg')
      setSubmitMessage({ type: 'error', text: Array.isArray(message) ? message.join(', ') : message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="contact-section">
      <div className="container">
        <div className="contact">
          <div className="contact-top">
            <div className="contact-form-wrapper">
              <h1 className="contact-title" dangerouslySetInnerHTML={{ __html: t('contact.title') }}></h1>

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>{t('contact.name')} <span>*</span></label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t('contact.placeholders.name')}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('contact.lastName')} <span>*</span></label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder={t('contact.placeholders.lastName')}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>{t('contact.phone')} <span>*</span></label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+998 99 999 99 99"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('contact.email')} <span>*</span></label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@gmail.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>{t('contact.message')} <span>*</span></label>
                  <textarea
                    rows="6"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t('contact.placeholders.message')}
                    required
                  ></textarea>
                </div>

                <div className="form-btn-wrapper">
                  <button type="submit" className="submit-btn" disabled={submitting}>
                    {submitting ? t('loading') : t('contact.sendBtn')}
                  </button>
                </div>
                {submitMessage && (
                  <p className={`contact-form-message contact-form-message--${submitMessage.type}`} role="status">
                    {submitMessage.text}
                  </p>
                )}
              </form>
            </div>

            <div className="contact-map-wrapper">
              <iframe
                title="Yandex Map"
                src="https://yandex.uz/map-widget/v1/?ll=60.3595%2C41.3783&z=17"
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen={true}
              ></iframe>
            </div>
          </div>

          <div className="contact-info-grid">
            <div className="info-item">
              <h3>{t('contact.info.location')}</h3>
              <p>41 Boltaeva Street, Khiva, Khorezm region</p>
            </div>
            <div className="info-item">
              <h3>{t('contact.info.phone')}</h3>
              <p>+998 55 604 63 43</p>
            </div>
            <div className="info-item">
              <h3>{t('contact.info.email')}</h3>
              <p>info@khivamuseum.uz</p>
            </div>
            <div className="info-item">
              <h3>R/S</h3>
              <p>400121860334067082200349001</p>
            </div>
            <div className="info-item">
              <h3>MFO</h3>
              <p>00014</p>
            </div>
            <div className="info-item">
              <h3>INN</h3>
              <p>201126524</p>
            </div>
            <div className="info-item">
              <h3>{t('contact.info.bank')}</h3>
              <p>Toshkent shahar Markaziy banki</p>
            </div>
            <div className="info-item">
              <h3>{t('contact.info.fax')}</h3>
              <p>+998 91 857 45 44</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}