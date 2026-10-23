import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Icons } from '../../../icons/icons';
import './headerInfo.css';

const slides = [
  {
    id: 1,
    title: 'ICHAN QALA',
    location: 'Khiva city, Khorezm region',
    image:
      '/_1756448270764.jpeg',
  },
  {
    id: 2,
    title: 'KALTA MINOR – THE UNFINISHED ICON OF KHIVA',
    location: 'Khiva city, Khorezm region',
    image:
      'xiva-3.jpg',
  },
  {
    id: 3,
    title: 'ARDA KHIVA – MODERN LIVING IN HISTORIC KHIVA',
    location: 'Khiva city, Khorezm region',
    image:
      'xiva-2.jpg',
  },
];

export const HeaderInfo = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [swiperInstance, setSwiperInstance] = useState(null);

  useEffect(() => {
    if (!swiperInstance || !prevRef.current || !nextRef.current) return;

    swiperInstance.params.navigation.prevEl = prevRef.current;
    swiperInstance.params.navigation.nextEl = nextRef.current;
    swiperInstance.navigation.destroy();
    swiperInstance.navigation.init();
    swiperInstance.navigation.update();
  }, [swiperInstance]);

  return (
    <section className="header-info container">
      <div className="header_info__slider">
        <Swiper
          modules={[EffectFade, Navigation, Pagination]}
          effect="fade"
          loop={true}
          observer={true}
          observeParents={true}
          spaceBetween={0}
          slidesPerView={1}
          speed={800}
          allowTouchMove
          onSwiper={setSwiperInstance}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
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
                  backgroundImage: `linear-gradient(180deg, rgba(5, 11, 15, 0.18) 0%, rgba(8, 9, 12, 0.42) 100%), url(${slide.image})`,
                }}
              >
                <div className="hero-slide__content">
                  <h1>{slide.title}</h1>
                  <div className="hero-slide__meta">
                    <span className="hero-slide__divider" />
                    <span className="hero-slide__icon">
                      <Icons.locationIcon />
                    </span>
                    <p>{slide.location}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="hero-controls">
          <button ref={prevRef} type="button" className="hero-nav hero-nav--prev" aria-label="Previous slide">
            <span>&lt;</span>
          </button>
          <div className="custom-pagination" aria-label="Slider pagination" />
          <button ref={nextRef} type="button" className="hero-nav hero-nav--next" aria-label="Next slide">
            <span>&gt;</span>
          </button>
        </div>
      </div>
    </section>
  );
};

