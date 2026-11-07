import { FiKey, FiLoader, FiRefreshCw } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api.js"; 

export default function VerifyOtpPage() {
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
      navigate('/register', { replace: true });
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
      const response = await api.post('/verify-otp', {
        email: email,
        otp: code.trim(),
      });
      
      const data = response.data;

      const token = data.token || data.access_token || data.data?.token;
      if (token) {
        localStorage.setItem("client_token", token);
        if (data.user || data.data?.user) {
          localStorage.setItem(
            "client_user",
            JSON.stringify(data.user || data.data.user),
          );
        }
        navigate('/', { replace: true });
      } else {
         navigate('/login', { replace: true });
      }

    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || err.response.data?.error || "Tasdiqlash kodi xato!");
      } else if (err.request) {
        setError("Server bilan ulanib bo'lmadi.");
      } else {
        setError(err.message || "Xatolik yuz berdi");
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
      // Axios yordamida qayta yuborish
      await api.post('/resend-otp', { email });
      setTimer(60);
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || "Kodni qayta yuborib bo'lmadi");
      } else {
        setError("Server xatosi");
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-md p-6 bg-[#1a1a1a] rounded-2xl">
        <div className="text-center pb-6">
          <h2 className="font-bold text-2xl text-white">
            Emailingizga kod yuborildi shuni kiriting
          </h2>
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <input
              type="text"
              maxLength={6}
              required
              placeholder="qodni kiriting"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-3 text-center text-2xl font-mono tracking-widest outline-none border border-white dark:border-gray-300 rounded-lg hover:border-white text-white dark:text-white bg-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading || code.length < 4}
            className="flex items-center justify-center w-full py-2.5 text-base font-semibold bg-link-hover rounded-lg text-white hover:bg-link-hover/90 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <FiLoader className="w-5 h-5 animate-spin" />
            ) : (
              "Tasdiqlash"
            )}
          </button>
        </form>

        <div className="text-center mt-5">
          {timer > 0 ? (
            <p className="text-sm text-black/50 dark:text-white/50">
              Kodni qayta yuborish:{" "}
              <span className="font-bold">{timer}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-xs text-link-hover font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer"
            >
              Kodni yana bir bor yubosrish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}