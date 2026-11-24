import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Icons } from '../../../icons/icons';
import { useTranslation } from 'react-i18next';
import './headerInfo.css';

const slides = [
  {
    id: 1,
    titleKey: 'home.hero.slide1',
    image:
      '/_1756448270764.jpeg',
  },
  {
    id: 2,
    titleKey: 'home.hero.slide2',
    image:
      '/xiva-3.jpg',
  },
  {
    id: 3,
    titleKey: 'home.hero.slide3',
    image:
      '/xiva-2.jpg',
  },
];

export const HeaderInfo = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [leavingIndex, setLeavingIndex] = useState(null);
  const [ready, setReady] = useState(false);
  const activeRef = useRef(0);
  const timerRef = useRef(null);
  const pad = (n) => String(n).padStart(2, '0');

  // Birinchi slaydning zoomi sahifa chizilgandan keyin boshlansin
  useEffect(() => {
    const id = setTimeout(() => setReady(true), 60);
    return () => {
      clearTimeout(id);
      clearTimeout(timerRef.current);
    };
  }, []);

  const handleSlideChange = (swiper) => {
    const next = swiper.realIndex;
    const prev = activeRef.current;
    if (next === prev) return;

    activeRef.current = next;
    setLeavingIndex(prev);
    setActiveIndex(next);

    // eski slayd to'liq yashirinib bo'lgach (fade ~0.8s) zoomi qayta tiklanadi
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setLeavingIndex(null), 1300);
  };

  return (
    <section className="header-info">
      <div className="header_info__slider">
        <Swiper
          modules={[EffectFade, Pagination, Autoplay]}
          effect="fade"
          loop={true}
          observer={true}
          observeParents={true}
          spaceBetween={0}
          slidesPerView={1}
          speed={800}
          autoplay={{ delay: 6500, disableOnInteraction: false }}
          allowTouchMove
          onSlideChange={handleSlideChange}
          pagination={{
            el: '.custom-pagination',
            clickable: true,
            type: 'bullets',
          }}
          className="hero-swiper"
        >
          {slides.map((slide, index) => {
            const dir = index % 2 === 0 ? 'zoom-in' : 'zoom-out';
            const state =
              ready && index === activeIndex
                ? 'is-active'
                : index === leavingIndex
                ? 'is-leaving'
                : '';

            return (
              <SwiperSlide key={slide.id}>
                <div className="hero-slide">
                  <div
                    className={`hero-slide__bg ${dir} ${state}`}
                    style={{ backgroundImage: `url(${slide.image})` }}
                  />
                  <div className="hero-slide__content">
                    <h1>{t(slide.titleKey)}</h1>
                    <div className="hero-slide__meta">
                      <span className="hero-slide__divider" />
                      <span className="hero-slide__icon">
                        <Icons.locationIcon />
                      </span>
                      <p>{t('home.hero.location')}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <div className="hero-progress">
          <div className="custom-pagination" aria-label={t('home.hero.pagination')} />
          <span className="hero-counter">
            {pad(activeIndex + 1)} / {pad(slides.length)}
          </span>
        </div>
      </div>
    </section>
  );
};