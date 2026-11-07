import { FiEye, FiEyeOff, FiLoader, FiLock, FiMail, FiUser } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api.js"; // Axios instance ni chaqiramiz

// Server xatosini ushlash uchun logikani axios response obyekti bilan ishlashga moslashtiramiz
export default function RegisterPage() {
  const { t } = useTranslation();
  
  useEffect(() => {
    document.title = t("meta.register");
  }, [t]);

  const [showPassword, setShowPassword] = useState(false);
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
      setError("Parol kamida 6 ta belgidan iborat bo'lishi kerak");
      setLoading(false);
      return;
    }

    try {
      // Axios orqali to'g'ridan-to'g'ri so'rov jo'natish. 
      // E'tibor bering: api.js faylida baseURL "https://api.atr.uz/api" bo'lgani uchun
      // Bu yerda faqat "/register" yozishning o'zi yetarli bo'ladi.
      await api.post('/register', { 
        firstName, 
        lastName, 
        email, 
        password 
      });

      // Muvaffaqiyatli bo'lsa verify sahifasiga o'tish
      navigate('/verify', {
        replace: true,
        state: { email },
      });
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || err.response.data?.error || "Ro'yxatdan o'tishda xatolik!");
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
      <section className="container mx-auto text-white">
        <div className="register flex items-center justify-center py-20 px-4">
          <div className="p-6 sm:p-12 bg-[#1a1a1a] rounded-lg w-full max-w-4xl">
            <div className="register_text mb-8">
              <h1 className="text-3xl font-bold text-center text-link-hover">
                Register
              </h1>
              {error && <p className="pt-3 text-center text-red-500">{error}</p>}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="register_input grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="firstName">Ism</label>
                  <div className="flex items-center gap-3 border p-3 rounded-md text-white">
                    <FiUser className="text-white" />
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      placeholder="Ismingizni kiriting"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="bg-transparent outline-none w-full"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="lastName">Familya</label>
                  <div className="flex items-center gap-3 border p-3 rounded-md text-white">
                    <FiUser className="text-white" />
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      placeholder="Familyaingizni kiriting"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="bg-transparent outline-none w-full"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="email">Email</label>
                  <div className="flex items-center gap-3 border p-3 rounded-md text-white">
                    <FiMail className="text-white" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Emailni kiriting"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-transparent outline-none w-full"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="password">Parol</label>
                  <div className="relative flex items-center gap-3 border p-3 rounded-md">
                    <FiLock className="text-white" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      placeholder="Parolni kiriting"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="bg-transparent outline-none w-full pr-8"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 cursor-pointer text-white"
                    >
                      {showPassword ? <FiEye /> : <FiEyeOff />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center w-full py-2 mt-6 text-base text-center bg-link-hover rounded-lg text-white disabled:opacity-60"
              >
                {loading ? <FiLoader className="w-5 h-5 animate-spin" /> : "Ro'yxatdan o'tish"}
              </button>
            </form>

            <div className="flex items-center justify-center gap-1 pt-5 text-white">
              <span>Akkountingiz bormi?</span>
              <Link to="/login" className="text-link-hover">
                Kirish
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}