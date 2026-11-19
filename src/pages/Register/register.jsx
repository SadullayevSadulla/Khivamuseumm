import { FiLoader, FiLock, FiMail, FiUser } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api.js";
import AuthLayout from "../Auth/AuthLayout";
import AuthField from "../Auth/AuthField";

export default function RegisterPage() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t("meta.register");
  }, [t]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
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

    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const email = formData.email.trim().toLowerCase();
    const { password } = formData;

    if (password.length < 6) {
      setError(t("auth.register.passwordShort"));
      setLoading(false);
      return;
    }

    try {
      // api.js baseURL "https://api.atr.uz/api" bo'lgani uchun faqat "/register" yoziladi
      await api.post("/register", {
        firstName,
        lastName,
        email,
        password,
      });

      // Muvaffaqiyatli bo'lsa verify sahifasiga o'tish
      navigate("/verify", {
        replace: true,
        state: { email },
      });
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || err.response.data?.error || t("auth.register.failed"));
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
      eyebrow={t("auth.register.eyebrow")}
      title={t("auth.register.title")}
      subtitle={t("auth.register.subtitle")}
      footer={
        <>
          {t("auth.register.haveAccount")}
          <Link to="/login">{t("auth.register.login")}</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="au-form">
        <div className="au-row">
          <AuthField
            id="firstName"
            label={t("auth.register.firstName")}
            icon={FiUser}
            placeholder={t("auth.register.firstNamePlaceholder")}
            value={formData.firstName}
            onChange={handleChange}
            autoComplete="given-name"
            required
          />
          <AuthField
            id="lastName"
            label={t("auth.register.lastName")}
            icon={FiUser}
            placeholder={t("auth.register.lastNamePlaceholder")}
            value={formData.lastName}
            onChange={handleChange}
            autoComplete="family-name"
            required
          />
        </div>
        <AuthField
          id="email"
          type="email"
          label={t("auth.register.email")}
          icon={FiMail}
          placeholder={t("auth.register.emailPlaceholder")}
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />
        <AuthField
          id="password"
          type="password"
          label={t("auth.register.password")}
          icon={FiLock}
          placeholder={t("auth.register.passwordPlaceholder")}
          hint={t("auth.register.passwordHint")}
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
          required
        />

        {error && <p className="au-error" role="alert">{error}</p>}

        <button type="submit" disabled={loading} className="kh-btn kh-btn--solid au-submit">
          {loading ? <FiLoader className="au-spin" /> : t("auth.register.submit")}
        </button>
      </form>
    </AuthLayout>
  );
}