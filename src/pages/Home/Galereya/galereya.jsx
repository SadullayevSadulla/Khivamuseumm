import React, { useEffect, useState } from 'react'
import "./galereya.css"
import { Icons } from "../../../icons/icons";
import api from '../../../api';

const Galereya = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get("/gallery")
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

    const renderImage = (item) => item && (
        <div className="gallery-image" key={item.id}>
            <img src={item.url} alt={`gallery-${item.id}`} loading="lazy" />
        </div>
    )

    return (
        <div className='container'>
            <div className="galereya">
                <div className="img_top flex justify-between items-center">
                    <h1>Galereya</h1>
                    <div className="btnn">
                        <button className='btn flex items-center gap-1'>Batafsil<Icons.rightIcon height="1em" /></button>
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