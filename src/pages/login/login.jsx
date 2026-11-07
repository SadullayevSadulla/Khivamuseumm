import { FiEye, FiEyeOff, FiLoader, FiLock, FiMail } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api.js"; 

export default function LoginaPage() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "uz";
  
  useEffect(() => {
    document.title = t("meta.login");
  }, [t]);

  const [showPassword, setShowPassword] = useState(false);
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
      // Axios yordamida so'rov yuborish
      const response = await api.post("/api/login", {
        email: formData.email.trim(),
        password: formData.password,
      });

      const data = response.data;

      // Agar server muvaffaqiyatli javob qaytarsa, token'ni saqlab profilga yo'naltiramiz
      if (data && data.token) {
        localStorage.setItem("client_token", data.token);
        navigate(`/${currentLang}/profile`, { replace: true });
      } else {
        throw new Error("Token olinmadi yoki kutilmagan javob keldi.");
      }
    } catch (err) {
      // Axios xatoliklarini to'g'ri ushlash va foydalanuvchiga ko'rsatish
      if (err.response) {
        setError(err.response.data?.message || err.response.data?.error || "Email yoki parol noto'g'ri!");
      } else if (err.request) {
        setError("Server bilan ulanib bo'lmadi. Tarmoqni tekshiring.");
      } else {
        setError(err.message || "Xatolik yuz berdi");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center py-20 px-4 text-white">
        <div className="w-full max-w-md rounded-lg bg-[#1a1a1a] p-6 sm:p-12">
          <div>
            <h2 className="text-center text-2xl font-bold text-link-hover">
              Kirish
            </h2>
            {error && (
              <p className="mx-auto max-w-100 pb-3 pt-2 text-center text-red-500">
                {error}
              </p>
            )}
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-base font-medium leading-[130%] text-white"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute left-2 top-1/2 -translate-y-1/2 p-1">
                  <FiMail className="h-5 w-5 text-black" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Emailingizni kiriting"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-white bg-transparent px-4 py-2 pl-10 text-white outline-none placeholder:text-white focus:border-link-hover"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-white">
                Parol
              </label>
              <div className="relative">
                <div className="absolute left-2 top-1/2 -translate-y-1/2 p-1">
                  <FiLock className="h-5 w-5 text-black" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Parolni kiriting"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-white bg-transparent px-10 py-2 text-white outline-none placeholder:text-white focus:border-link-hover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPassword((prev) => !prev);
                  }}
                  aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer p-1"
                >
                  {showPassword ? (
                    <FiEye className="h-4 w-4 text-black" />
                  ) : (
                    <FiEyeOff className="h-4 w-4 text-black" />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-lg bg-link-hover py-2 text-center text-base text-white disabled:opacity-60"
            >
              {loading ? (
                <FiLoader className="h-4 w-4 animate-spin" />
              ) : (
                "Kirish"
              )}
            </button>
          </form>
          <div className="flex items-center gap-1 pt-5 text-white">
            <span>Ro'yxatdan o'tganmisiz?</span>
            <Link to="/register" className="text-link-hover">
              Ro'yxatdan o'tish
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}