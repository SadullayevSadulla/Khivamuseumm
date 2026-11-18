import React from 'react'
import "./main.css"
import { Link } from 'react-router-dom'
import { Icons } from "../../../icons/icons";
import { useTranslation } from 'react-i18next';

export const Main = () => {
    const { t } = useTranslation();
    return (
        <div className='container'>
            <section className='main_section kh-section'>
                <div className="section_left kh-rise">
                    <div className="kh-head kh-head--left">
                        <p className="kh-eyebrow">{t('home.eyebrow.about')}</p>
                        <h1 className="kh-title main_title">{t('home.introTitle')}</h1>
                        <div className="kh-ornament" aria-hidden="true"><i /></div>
                    </div>
                    <p className='main_text'>{t('home.introDescription')}</p>
                    <div className="left_buttons">
                        <Link to="/" className="kh-btn kh-btn--solid">
                            <span>{t('home.getTickets')}</span>
                            <Icons.ticketIcon />
                        </Link>
                        <Link to="/" className="kh-btn">
                            <span>{t('home.more')}</span>
                            <Icons.rightIcon height="1em" />
                        </Link>
                    </div>
                </div>
                <div className="section_right kh-rise">
                    <div className="main_frame">
                        <img src="/khiva1.jpg" alt="" loading="lazy" />
                    </div>
                </div>
            </section>
        </div>
    )
}