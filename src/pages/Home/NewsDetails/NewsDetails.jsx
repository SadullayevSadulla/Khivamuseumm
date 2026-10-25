import { useEffect, useMemo, useState } from "react";
import DOMPurify from "dompurify";
import { FiCalendar, FiEye } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import api from "../../../api";
import "./newsDetails.css";

const getLocalizedText = (value, language) => {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";
  const localizedValue = value[language] || value.uz || value.en || value.ru;
  return typeof localizedValue === "string" ? localizedValue : "";
};

const formatDate = (value, language) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const locale = { uz: "uz-UZ", ru: "ru-RU", en: "en-US" }[language] || "uz-UZ";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

export default function NewsDetails() {
  const { newsDetails } = useParams();
  const { i18n, t } = useTranslation();
  const language = (i18n.resolvedLanguage || i18n.language || "uz").split("-")[0];
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    const fetchNews = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/news");
        const items = Array.isArray(response?.data?.data) ? response.data.data : [];
        const item = items.find(
          (entry) => String(entry.slug || entry.id) === (newsDetails || ""),
        );
        if (isCurrent) setNews(item || null);
      } catch (requestError) {
        if (isCurrent) {
          setError(requestError instanceof Error ? requestError.message : t("news.loadError", "Yangilikni yuklab bo'lmadi"));
        }
      } finally {
        if (isCurrent) setLoading(false);
      }
    };

    fetchNews();
    return () => {
      isCurrent = false;
    };
  }, [newsDetails, t]);

  const title = getLocalizedText(news?.title, language);
  const description = getLocalizedText(news?.description, language);
  const safeDescription = useMemo(() => DOMPurify.sanitize(description), [description]);
  const mainImage = news?.images?.find((image) => image.mainImage === true);
  const imageUrl = mainImage?.url || news?.images?.[0]?.url;

  if (loading) {
    return <div className="news-detail container1" role="status">{t("news.loading", "Yuklanmoqda...")}</div>;
  }

  if (error) {
    return <div className="news-detail container1" role="alert">{error}</div>;
  }

  if (!news) {
    return (
      <div className="news-detail container1">
        <p>{t("news.notFound", "Yangilik topilmadi")}</p>
        <Link to="/" className="news-detail__back">{t("header.news", "Yangiliklar")}</Link>
      </div>
    );
  }

  return (
    <article className="news-detail">
      <div className="container1">
        <header className="news-detail__header">
          <h1>{title}</h1>
          <div className="news-detail__meta">
            <span><FiCalendar aria-hidden="true" />{formatDate(news.createdAt, language)}</span>
            <span><FiEye aria-hidden="true" />{news.views ?? 0}</span>
          </div>
        </header>

        <div className="news-detail__content">
          {imageUrl && <img className="news-detail__image" src={imageUrl} alt={title} />}
          <div className="news-detail__description" dangerouslySetInnerHTML={{ __html: safeDescription }} />
        </div>
      </div>
    </article>
  );
}