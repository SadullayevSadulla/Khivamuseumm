import { FiEye, FiEyeOff, FiLoader, FiLock, FiMail } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api.js";

export default function Login() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "uz";
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
        // Serverdan xatolik javobi keldi (masalan, 400, 401, 500)
        setError(err.response.data?.message || err.response.data?.error || "Email yoki parol noto'g'ri!");
      } else if (err.request) {
        // So'rov yuborildi, lekin javob olinmadi (internet tarmog'i yo'q yoki server o'chgan)
        setError("Server bilan ulanib bo'lmadi. Tarmoqni tekshiring.");
      } else {
        // Boshqa xatolik (masalan, kodning o'zida)
        setError(err.message || "Xatolik yuz berdi");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center py-20">
        <div className="p-12 bg-[#1a1a1a] rounded-lg">
          <div>
            <h2 className="font-bold text-2xl text-link-hover text-center">
              Kirish
            </h2>
            <p className="text-red-500 pb-3 max-w-100 text-center">{error}</p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="font-medium text-base leading-[130%] text-white"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute left-2 top-1/2 -translate-y-1/2 p-1">
                  <FiMail className="w-5 h-5 text-white" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Emailingizni kiriting"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="min-w-full outline-none border border-black dark:border-gray-300 rounded-lg px-4 pl-10 py-2 border-white text-white dark:text-white dark:placeholder:text-gray-300 placeholder:text-white"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-white">Parol</label>
              <div className="relative">
                <div className="absolute left-2 top-1/2 -translate-y-1/2 p-1">
                  <FiLock className="w-5 h-5 text-white" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Parolni kiriting"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="min-w-full outline-none border border-black dark:border-gray-300 rounded-lg px-10 py-2 border border-white text-white dark:text-white dark:placeholder:text-gray-300 placeholder:text-white"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPassword((prev) => !prev);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 cursor-pointer"
                >
                  {showPassword ? (
                    <FiEye className="w-4 h-4 text-white" />
                  ) : (
                    <FiEyeOff className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full py-2 text-base text-center bg-[#E5A93C] hover:bg-[#c9922e] rounded-lg text-white" 
            >
              {loading ? (
                <FiLoader className="w-4 h-4 animate-spin" />
              ) : (
                "Kirish"
              )}
            </button>
          </form>
          <div className="flex items-center gap-1 pt-5 text-white">
            <span>Ro'yxatdan o'tganmisiz?</span>
            <Link to="/register" className="text-[#E5A93C] hover:underline">
              Ro'yxatdan o'tish
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}