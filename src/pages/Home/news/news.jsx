import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FiCalendar, FiEye } from 'react-icons/fi';
import api from '../../../api';
import { Icons } from '../../../icons/icons';
import './news.css';

const getLocalizedText = (value, language) => {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object') return '';

  const localizedValue = value[language] || value.uz || value.en || value.ru;
  return typeof localizedValue === 'string' ? localizedValue : '';
};

const formatDate = (value, language) => {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const locale =
    { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-US' }[language] || 'uz-UZ';

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

const News = () => {
  const { i18n, t } = useTranslation();
  const currentLang = (i18n.resolvedLanguage || i18n.language || 'uz').split('-')[0];
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/news');
        const items = Array.isArray(res?.data?.data) ? res.data.data : [];
        setData(items);
      } catch {
        setError(t('home.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

  if (loading) {
    return (
      <div className="container">
        <div className="news mt-25">
              <p>{t('news.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="news mt-25">
              <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="news mt-25">
        <div className="img_top flex justify-between items-center">
          <h1>{t('news.title')}</h1>
          <div className="btnn">
            <button type="button" className="btn flex items-center gap-1">
              {t('home.more')}
              <Icons.rightIcon height="1em" />
            </button>
          </div>
        </div>

        <div className="news-grid">
          {data.map((item) => {
            const mainImage = item?.images?.find((img) => img.mainImage === true);
            const imageUrl = mainImage?.url || item?.images?.[0]?.url || '';
            const title = getLocalizedText(item?.title, currentLang) || t('news.title');
            const detailId = item.slug || item.id;

            return (
              <article className="news-card" key={item.id || item.slug || item.title}>
                <Link
                  to={`/news/${encodeURIComponent(detailId)}`}
                  className="news-card__link"
                  aria-label={`${title} — ${t('home.more')}`}
                >
                  {imageUrl ? (
                    <img src={imageUrl} alt={title} loading="lazy" />
                  ) : (
                    <div className="news-card__placeholder">{t('home.noImage')}</div>
                  )}
                  <div className="news-card__body">
                    <div className="news-meta">
                      <span className="news-meta__item">
                        <FiCalendar />
                        {formatDate(item.createdAt, currentLang)}
                      </span>
                      <span className="news-meta__item">
                        <FiEye />
                        {item.views ?? 0}
                      </span>
                    </div>

                    <h3>{title}</h3>
                    <span className="news-link-btn">
                      {t('home.more')}
                    </span>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default News;