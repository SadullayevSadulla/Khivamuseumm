import React, { useEffect, useRef, useState } from 'react'
import lightGallery from 'lightgallery'
import lgZoom from 'lightgallery/plugins/zoom'
import 'lightgallery/css/lightgallery.css'
import 'lightgallery/css/lg-zoom.css'
import "./galereya.css"
import { Icons } from "../../../icons/icons";
import api from '../../../api';
import { useTranslation } from 'react-i18next';
import Loader from '../../../components/Loader/loader';
import { Link } from 'react-router-dom';

const Galereya = () => {
    const { t } = useTranslation();
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const galleryRef = useRef(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get("/gallery")
                setData(Array.isArray(res?.data?.data) ? res.data.data : [])
            } catch {
                setError(t('home.error'))
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [t])

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

    if (loading) return <Loader fullHeight={false} />
    if (error) return <p>{error}</p>

    const renderImage = (item) => {
        if (!item) return null

        const imageUrl = item.url || item.img || item.image || item.src

        return (
            <a
                key={item.id}
                href={imageUrl}
                className="gallery-item gallery-image"
                data-lg-size="1400-900"
            >
                <img src={imageUrl} alt={`gallery-${item.id}`} loading="lazy" />
            </a>
        )
    }

    return (
        <div className='container'>
            <div className="galereya" ref={galleryRef}>
                <div className="img_top flex justify-between items-center">
                    <h1>{t('home.galleryTitle')}</h1>
                    <div className="btnn">
                        <Link to="/gallery" className='btn flex items-center gap-1'>{t('home.more')}<Icons.rightIcon height="1em" /></Link>
                    </div>
                </div>
                <div className="gallery-mosaic">
                    <div className="gallery-left">
                        {renderImage(data[0])}
                        {renderImage(data[4])}
                        {renderImage(data[5])}
                    </div>
                    <div className="gallery-right">
                        {renderImage(data[1])}
                        <div className="gallery-middle">
                            {renderImage(data[2])}
                            {renderImage(data[3])}
                        </div>
                        {renderImage(data[6])}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Galereya