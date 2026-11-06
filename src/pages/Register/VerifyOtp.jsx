import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const email = location.state?.email || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!otp.trim()) {
        throw new Error('OTP kodini kiriting');
      }

      // Backend uchun shartli placeholder: real validatsiya loginlashdan keyin amalga oshiriladi.
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err.message || 'OTP tasdiqlashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container mx-auto py-20 text-white">
      <div className="mx-auto max-w-md rounded-lg bg-[#1a1a1a] p-8 shadow-lg">
        <h1 className="mb-4 text-center text-3xl font-bold text-[#E5A93C]">Verify OTP</h1>

        {email && (
          <p className="mb-6 text-center text-sm text-gray-300">
            {email} elektron pochtasiga OTP kod yuborildi.
          </p>
        )}

        {error && <p className="mb-4 text-center text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="otp">OTP kod</label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="OTP kodni kiriting"
              className="rounded-md border border-gray-600 bg-transparent px-4 py-3 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#1752D8] py-3 font-medium text-white transition hover:bg-[#1343b3] disabled:opacity-70"
          >
            {loading ? 'Tasdiqlanmoqda...' : 'Tasdiqlash'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default VerifyOtp;
