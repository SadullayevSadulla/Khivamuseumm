import React, { useEffect, useRef, useState } from 'react'
import { FiEye } from 'react-icons/fi'
import lightGallery from 'lightgallery'
import lgZoom from 'lightgallery/plugins/zoom'
import 'lightgallery/css/lightgallery.css'
import 'lightgallery/css/lg-zoom.css'
import api from '../../api'
import './gallery.css'
import { useTranslation } from 'react-i18next'
import Loader from '../../components/Loader/loader'


const Gallery = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const galleryRef = useRef(null)
  const { t } = useTranslation();

  const galleryItems = data.filter((item) =>
    item && (item.img || item.url || item.image || item.src)
  )

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/gallery')
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

  useEffect(() => {
    if (!galleryRef.current || data.length === 0) return

    const gallery = lightGallery(galleryRef.current, {
      selector: '.gallery-item',
      plugins: [lgZoom],
      speed: 500,
      download: false,
      counter: false,
      hideControlOnEnd: true,
      showMaximizeIcon: false,
      actualSize: false,
    })

    return () => gallery.destroy()
  }, [data])

  if (loading) return <Loader />
  if (error) return <p>{error}</p>

  return (
    <div className="gallery-page">
      <div className="gallery-title">
        <h1>{t('gallery.gallerytitle')}</h1>
      </div>
      <div ref={galleryRef} className="gallery-grid">
        {galleryItems.length === 0 ? (
          <p>{t('noImage')}</p>
        ) : galleryItems.map((item, index) => {
          const image = item.img || item.url || item.image || item.src
          return (
            <a
              key={item.id || index}
              href={image}
              className="gallery-item"
              data-lg-size="1400-900"
            >
              <img src={image} alt={item.title || 'Gallery item'} />
              <div className="gallery-overlay">
                <span className="gallery-eye">
                  <FiEye />
                </span>
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}

export default Gallery