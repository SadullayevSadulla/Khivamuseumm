import React from 'react'
import "./footer.css"
import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaTelegram, FaYoutube } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <div className='wrr'>
      <footer className='container'>
        <div className="footer py-10 flex justify-between items-center">
          <div className="footer_location flex flex-col gap-5">
            <div className="location_img bg-white w-25.5 rounded-2xl">
              <img src="/logo (1).png" alt="" className='w-[100px] h-[82px]' />
            </div>
            <div className="location_text flex flex-col items-start gap-2">
              <span className='w-22'>{t('footer.location')}</span>
              <div className="locatin_p flex gap-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24" className='opacity-[0.8] text-white'>
                  <path d="M0 0h24v24H0z" fill="none" />
                  <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
                    <path d="M7.25 10a4.75 4.75 0 1 1 9.5 0a4.75 4.75 0 0 1-9.5 0M12 6.75a3.25 3.25 0 1 0 0 6.5a3.25 3.25 0 0 0 0-6.5" />
                    <path d="M3.524 8.857a8.29 8.29 0 0 1 8.26-7.607h.432a8.29 8.29 0 0 1 8.26 7.607a8.94 8.94 0 0 1-1.99 6.396l-4.793 5.861a2.187 2.187 0 0 1-3.386 0l-4.793-5.861a8.94 8.94 0 0 1-1.99-6.396m8.26-6.107A6.79 6.79 0 0 0 5.02 8.98a7.44 7.44 0 0 0 1.656 5.323l4.793 5.862a.687.687 0 0 0 1.064 0l4.793-5.862A7.44 7.44 0 0 0 18.98 8.98a6.79 6.79 0 0 0-6.765-6.23z" />
                  </g>
                </svg>
                <p className='opacity-[0.8] text-white'>{t('footer.street')}</p>
              </div>
              <p className='opacity-[0.8] text-white'>{t('footer.region')}</p>
            </div>
            <div className="footer_button">
              <button>{t('footer.openMap')}</button>
            </div>
          </div>
          <div className="flex justify-between gap-50">
            <div className="menu">
              <h1>{t('footer.usefulLinks')}</h1>
              <nav>
                <Link to="/">{t('footer.home')}</Link>
                <Link to="/">{t('footer.about')}</Link>
                <Link to="/">{t('footer.news')}</Link>
              </nav>
            </div>
            <div className="menu">
              <h1>{t('footer.usefulLinks')}</h1>
              <nav>
                <Link to="/">{t('footer.collection')}</Link>
                <Link to="/">{t('footer.gallery')}</Link>
                <Link to="/">{t('footer.contact')}</Link>
                <Link to="/">Khiva 360°</Link>
              </nav>
            </div>
            <div className="menu">
              <h1>{t('footer.social')}</h1>
              <nav>
                <a href="https://www.instagram.com/khivamuseumuzb/"><FaInstagram />Instagram</a>
              </nav>
              <nav>
                <a href="https://www.youtube.com/@khivamuseum.2025"><FaFacebook />Facebook</a>
              </nav>
              <nav>
                <a href="https://t.me/sadullayev0627"><FaTelegram />Telegram</a>
              </nav>
              <nav>
                <a href="https://www.youtube.com/@khivamuseum.2025"><FaYoutube />YouTube</a>
              </nav>
            </div>
          </div>
        </div>
      </footer>
      <section className="footer_bottom_section">
        <div className="footer_bottom container">
          <p>© 2025. {t('footer.copyright')}&nbsp; {t('footer.developedBy')} <a href="https://limon.uz/">LIMON.UZ</a></p>
          <button
            className="back_to_top"
            type="button"
            aria-label={t('footer.backToTop')}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </section>
    </div>
  )
}

export default Footer