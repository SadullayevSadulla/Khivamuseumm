import React from 'react'
import "./main.css"
import { Link } from 'react-router-dom'
import { Icons } from "../../../icons/icons";
import { useTranslation } from 'react-i18next';

export const Main = () => {
    const { t } = useTranslation();
    return (
        <div className='container2'>
            <section className='main_section flex mt-25 mb-25 justify-between'>
                <div className="section_left">
                    <div className="left_h1">
                        <h1 className='font-bold text-white max-w-3xl text-2xl md:text-3xl leading-[110%] text-black dark:text-white'>{t('home.introTitle')}</h1>
                        <p className='font-medium text-white max-w-4xl text-base md:text-lg leading-[130%] text-black dark:text-white my-8 md:my-10'>{t('home.introDescription')}</p>
                    </div>
                    <div className="left_buttons flex gap-5">
                        <Link to="/" className="ticket_btn">
                            <span>{t('home.getTickets')}</span>
                            <span className="ticket_btn-icon">
                                <Icons.ticketIcon />
                            </span>
                        </Link>
                        <div className="batafsill">
                            <Link 
                            to={"/"} 
                            className='batafsil'>
                                <span className='flex items-center gap-2'>{t('home.more')} <Icons.rightIcon height="1em" /></span>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="section_right">
                    <img src="/khiva1.jpg" alt="" />
                </div>
            </section>
        </div>
    )
}
