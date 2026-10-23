import React from 'react'
import "./main.css"
import { Link } from 'react-router-dom'
import { Icons } from "../../../icons/icons";

export const Main = () => {
    return (
        <div className='container2'>
            <section className='main_section flex mt-25 mb-25 justify-between'>
                <div className="section_left">
                    <div className="left_h1">
                        <h1 className='font-bold text-white max-w-3xl text-2xl md:text-3xl leading-[110%] text-black dark:text-white'>Xiva davlat muzey qo'riqxonasi – 1970 yildan beri tarix merosi</h1>
                        <p className='font-medium text-white max-w-4xl text-base md:text-lg leading-[130%] text-black dark:text-white my-8 md:my-10'>Xiva davlat muzey qo'riqxonasi 1970 yilda tashkil etilgan bo‘lib, Xiva va uning atrofi hududning boy tarixiy merosini saqlash va namoyish etishga bag‘ishlangan nufuzli madaniy va ta’lim muassasasidir. Ko‘p tarmoqli markaz sifatida muzey tadqiqot, konservatsiya va omma ta’limida muhim rol o‘ynaydi. U Xivaning o'tmishidagi san’at, me’morlik va kundalik hayot an’analari aks etgan keng kolleksiyaga ega. Muzey shahar madaniy merosining nafaqat qo‘riqchisi, balki mahalliy aholi va mehmonlar orasida tarixiy ongni rivojlantirish va qadrlash uchun markaz sifatida xizmat qiladi. Tashkil topganidan buyon Xiva davlat muzey qo'riqxonasi ilmiy tadqiqotlarni qo‘llab-quvvatlash va madaniy muloqotni rivojlantirishda muhim rol o‘ynab, O‘zbekiston tarixini asrashda asosiy muassasa sifatida o‘z o‘rnini mustahkamladi.</p>
                    </div>
                    <div className="left_buttons flex gap-5">
                        <Link to="/" className="ticket_btn">
                            <span>Chipta olish</span>
                            <span className="ticket_btn-icon">
                                <Icons.ticketIcon />
                            </span>
                        </Link>
                        <div className="batafsill">
                            <Link 
                            to={"/"} 
                            className='batafsil'>
                                <span className='flex items-center gap-2'>Batafsil <Icons.rightIcon height="1em" /></span>
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
