import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Pagination } from 'swiper/modules';

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
  const pad = (n) => String(n).padStart(2, '0');

  return (
    <section className="header-info">
      <div className="header_info__slider">
        <Swiper
          modules={[EffectFade, Pagination]}
          effect="fade"
          loop={true}
          observer={true}
          observeParents={true}
          spaceBetween={0}
          slidesPerView={1}
          speed={800}
          allowTouchMove
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          pagination={{
            el: '.custom-pagination',
            clickable: true,
            type: 'bullets',
          }}
          className="hero-swiper"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div
                className="hero-slide"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(5, 11, 15, 0.35) 0%, rgba(8, 9, 12, 0.15) 40%, rgba(8, 9, 12, 0.6) 100%), url(${slide.image})`,
                }}
              >
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
          ))}
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