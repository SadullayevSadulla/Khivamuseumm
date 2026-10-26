import React, { useState, useEffect } from 'react'
import "./contact.css"
import api from '../../api'

export const Contact = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    phone: '',
    email: '',
    message: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/contacts") 
        setData(res.data?.data || res.data)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError("Xatolik yuz berdi")
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post("/contact-us", formData)
      alert("Xabaringiz muvaffaqiyatli yuborildi!")
      setFormData({ name: '', lastName: '', phone: '', email: '', message: '' })
    } catch (err) {
      alert("Xabar yuborishda xatolik yuz berdi")
    }
  }

  if (loading) return <p className="loading">Yuklanmoqda...</p>

  return (
    <section className="contact-section">
      <div className="container">
        <div className="contact">
          <div className="contact-top">
            <div className="contact-form-wrapper">
              <h1 className="contact-title">
                HAVE QUESTIONS? <br /> CONTACT US!
              </h1>

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Name <span>*</span></label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter first name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Last name <span>*</span></label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone <span>*</span></label>
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
                    <label>Email <span>*</span></label>
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
                  <label>Message <span>*</span></label>
                  <textarea
                    rows="6"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your question/message"
                    required
                  ></textarea>
                </div>

                <div className="form-btn-wrapper">
                  <button type="submit" className="submit-btn">
                    Send
                  </button>
                </div>
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
              <h3>Location</h3>
              <p>{data?.location || "41 Boltaeva Street, Khiva, Khorezm region"}</p>
            </div>
            <div className="info-item">
              <h3>Phone</h3>
              <p>{data?.phone || "+998 55 604 63 43"}</p>
            </div>
            <div className="info-item">
              <h3>Email</h3>
              <p>{data?.email || "info@khivamuseum.uz"}</p>
            </div>
            <div className="info-item">
              <h3>R/S</h3>
              <p>{data?.rs || "400121860334067082200349001"}</p>
            </div>
            <div className="info-item">
              <h3>MFO</h3>
              <p>{data?.mfo || "00014"}</p>
            </div>
            <div className="info-item">
              <h3>INN</h3>
              <p>{data?.inn || "201126524"}</p>
            </div>
            <div className="info-item">
              <h3>Bank</h3>
              <p>{data?.bank || "Toshkent shahar Markaziy banki"}</p>
            </div>
            <div className="info-item">
              <h3>Tel/faks</h3>
              <p>{data?.fax || "+998 91 857 45 44"}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}