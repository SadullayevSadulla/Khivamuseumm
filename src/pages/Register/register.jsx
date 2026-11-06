import React, { useState } from 'react';
import { FiEye, FiEyeOff, FiLock, FiMail, FiUser, FiLoader } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
// Axios instansini import qiling. Agar register.jsx "src/pages/Register/" ichida bo'lsa:
import api from "../../api.js"; 

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({ 
    firstName: '',
    lastName: '',
    email: '',
    password: '' 
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/api/register", {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email.trim(),
        password: formData.password,
      });

      navigate('/verify-otp', {
        replace: true,
        state: { email: formData.email.trim() },
      });
    } catch (err) {
      // Xatoliklarni to'g'ri ko'rsatish
      if (err.response) {
        setError(err.response.data?.message || err.response.data?.error || "Ro'yxatdan o'tishda xatolik yuz berdi!");
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
    <section className='container mx-auto text-white'>
      <div className="register flex items-center justify-center py-20">
        <div className="p-12 bg-[#1a1a1a] rounded-lg w-full max-w-4xl">
          <div className="register_text mb-8">
            <h1 className="text-3xl font-bold text-center text-[#E5A93C]">Register</h1>
            {error && <p className="text-red-500 pt-4 text-center">{error}</p>}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="register_input grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="flex flex-col gap-2">
                <label htmlFor="firstName">Ism</label>
                <div className="flex items-center gap-3 border p-3 rounded-md text-white">
                  <FiUser className='text-white' />
                  <input 
                    type="text" 
                    name="firstName"
                    id="firstName" 
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder='Ismingizni kiriting' 
                    className="bg-transparent outline-none w-full" 
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="lastName">Familya</label>
                <div className="flex items-center gap-3 border p-3 rounded-md text-white">
                  <FiUser className='text-white' />
                  <input 
                    type="text" 
                    name="lastName"
                    id="lastName" 
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder='Familyaingizni kiriting' 
                    className="bg-transparent outline-none w-full"
                    required 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email">Email</label>
                <div className="flex items-center gap-3 border p-3 rounded-md text-white">
                  <FiMail className='text-white' />
                  <input 
                    type="email" 
                    name="email"
                    id="email" 
                    value={formData.email}
                    onChange={handleChange}
                    placeholder='Emailni kiriting' 
                    className="bg-transparent outline-none w-full" 
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="password">Parol</label>
                <div className="relative flex items-center gap-3 border p-3 rounded-md">
                  <FiLock className="text-white" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="Parolni kiriting"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="bg-transparent outline-none w-full pr-8"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowPassword((prev) => !prev);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 cursor-pointer text-white hover:text-white"
                  >
                    {showPassword ? <FiEye /> : <FiEyeOff />}
                  </button>
                </div>
              </div>

            </div>

            <div className="mt-8 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-1/2 flex items-center justify-center py-3 text-base text-center bg-[#1752D8] hover:bg-[#1343b3] transition-colors rounded-lg text-white disabled:opacity-70"
              >
                {loading ? (
                  <FiLoader className="w-5 h-5 animate-spin" />
                ) : (
                  "Ro'yxatdan o'tish"
                )}
              </button>
            </div>
          </form>

          <div className="flex items-center justify-center gap-1 pt-6 text-white">
            <span>Aqqavuntingiz bormi?</span>
            <Link to="/login" className="text-[#E5A93C] hover:underline">
              Kirish
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Register;