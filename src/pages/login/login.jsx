import { FiLoader, FiLock, FiMail } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api.js";
import AuthLayout from "../Auth/AuthLayout";
import AuthField from "../Auth/AuthField";

export default function LoginaPage() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "uz";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/api/login", {
        email: formData.email.trim(),
        password: formData.password,
      });

      const data = response.data;

      if (data && data.token) {
        localStorage.setItem("client_token", data.token);
        navigate(`/${currentLang}/profile`, { replace: true });
      } else {
        throw new Error(t("auth.login.noToken"));
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || err.response.data?.error || t("auth.login.invalid"));
      } else if (err.request) {
        setError(t("auth.networkError"));
      } else {
        setError(err.message || t("auth.genericError"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow={t("auth.login.eyebrow")}
      title={t("auth.login.title")}
      subtitle={t("auth.login.subtitle")}
      footer={
        <>
          {t("auth.login.noAccount")}
          <Link to="/register">{t("auth.login.register")}</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="au-form" noValidate={false}>
        <AuthField
          id="email"
          type="email"
          label={t("auth.login.email")}
          icon={FiMail}
          placeholder={t("auth.login.emailPlaceholder")}
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />
        <AuthField
          id="password"
          type="password"
          label={t("auth.login.password")}
          icon={FiLock}
          placeholder={t("auth.login.passwordPlaceholder")}
          value={formData.password}
          onChange={handleChange}
          autoComplete="current-password"
          required
        />

        {error && <p className="au-error" role="alert">{error}</p>}

        <button type="submit" disabled={loading} className="kh-btn kh-btn--solid au-submit">
          {loading ? <FiLoader className="au-spin" /> : t("auth.login.submit")}
        </button>
      </form>
    </AuthLayout>
  );
}