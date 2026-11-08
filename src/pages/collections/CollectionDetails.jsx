import { useEffect, useMemo, useState } from 'react';
import DOMPurify from 'dompurify';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../api';
import Loader from '../../components/Loader/loader';

const getLocalizedText = (value, language) => {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object') return '';

  const localizedValue = value[language] || value.uz || value.en || value.ru;
  return typeof localizedValue === 'string' ? localizedValue : '';
};

export default function CollectionDetails() {
  const { collectionDetails } = useParams();
  const { i18n, t } = useTranslation();
  const language = (i18n.resolvedLanguage || i18n.language || 'uz').split('-')[0];
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isCurrent = true;

    const fetchCollection = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await api.get('/collection');
        const items = Array.isArray(res?.data?.data) ? res.data.data : [];
        const match = items.find(
          (entry) => String(entry.slug || entry.id) === (collectionDetails || '')
        );

        if (isCurrent) setItem(match || null);
      } catch (requestError) {
        if (isCurrent) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : t('home.error')
          );
        }
      } finally {
        if (isCurrent) setLoading(false);
      }
    };

    fetchCollection();

    return () => {
      isCurrent = false;
    };
  }, [collectionDetails, t]);

  const title = getLocalizedText(item?.title, language) || t('home.collectionTitle');
  const description = getLocalizedText(item?.description, language) || t('home.collectionDescription') || '';
  const safeDescription = useMemo(() => DOMPurify.sanitize(description || ''), [description]);
  const imageUrl = item?.images?.[0]?.url || item?.image || item?.img || item?.url || '';

  if (loading) {
    return (
      <div className="container mx-auto px-4">
        <Loader fullHeight={false} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 text-white" role="alert">
        <p>{error}</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container mx-auto px-4 text-white">
        <p>{t('news.notFound', 'Mahsulot topilmadi')}</p>
        <Link to="/collections" className="text-blue-400 underline">{t('home.more', 'Batafsil')}</Link>
      </div>
    );
  }

  return (
    <div className="bg-[#2a2a2a] py-10 font-sans">
      <div className="container mx-auto px-4 max-w-[1200px]">
        <article className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="flex flex-col">
            <h1 className="mb-6 text-3xl md:text-4xl lg:text-[40px] font-bold text-white leading-tight">
              {title}
            </h1>

            <div
              dangerouslySetInnerHTML={{ __html: safeDescription }}
              className="text-base md:text-lg text-gray-200 leading-relaxed"
            />
          </div>

          {imageUrl && (
            <div className="w-full">
              <img
                src={imageUrl}
                alt={title}
                className="block w-full h-auto min-h-[300px] max-h-[450px] object-cover rounded-[16px] shadow-lg bg-gray-700"
              />
            </div>
          )}
        </article>
      </div>
    </div>
  );
}