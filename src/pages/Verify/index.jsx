import { FiKey, FiLoader, FiRefreshCw } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api.js";
import AuthLayout from "../Auth/AuthLayout";

export default function VerifyOtpPage() {
  const { t } = useTranslation();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState(null);
  const [timer, setTimer] = useState(60);

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  useEffect(() => {
    if (!email) {
      navigate("/register", { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/verify-otp", {
        email: email,
        otp: code.trim(),
      });

      const data = response.data;

      const token = data.token || data.access_token || data.data?.token;
      if (token) {
        localStorage.setItem("client_token", token);
        if (data.user || data.data?.user) {
          localStorage.setItem("client_user", JSON.stringify(data.user || data.data.user));
        }
        navigate("/profile", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || err.response.data?.error || t("auth.verify.wrong"));
      } else if (err.request) {
        setError(t("auth.networkError"));
      } else {
        setError(err.message || t("auth.genericError"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || resending) return;
    setResending(true);
    setError(null);

    try {
      await api.post("/resend-otp", { email });
      setTimer(60);
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || t("auth.verify.resendFailed"));
      } else {
        setError(t("auth.verify.serverError"));
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout
      compact
      eyebrow={t("auth.verify.eyebrow")}
      title={t("auth.verify.title")}
      subtitle={
        <>
          {t("auth.verify.subtitle")} <strong>{email}</strong>
        </>
      }
    >
      <form onSubmit={handleVerify} className="au-form">
        <div className="au-field au-code">
          <label htmlFor="otp">{t("auth.verify.codeLabel")}</label>
          <div className="au-input">
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              required
              placeholder="••••••"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {error && <p className="au-error" role="alert">{error}</p>}

        <button
          type="submit"
          disabled={loading || code.length < 4}
          className="kh-btn kh-btn--solid au-submit"
        >
          {loading ? <FiLoader className="au-spin" /> : <><FiKey /> {t("auth.verify.submit")}</>}
        </button>
      </form>

      <button
        type="button"
        className="au-resend"
        onClick={handleResend}
        disabled={timer > 0 || resending}
      >
        <FiRefreshCw />
        {timer > 0 ? t("auth.verify.resendIn", { seconds: timer }) : t("auth.verify.resend")}
      </button>
    </AuthLayout>
  );
}