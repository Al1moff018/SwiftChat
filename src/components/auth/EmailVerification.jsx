import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Clock, RotateCcw } from 'lucide-react';

const EmailVerification = ({ email, onVerified }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 daqiqa
  const { apiRequest } = useAuth();

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleCodeChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Keyingi inputga o'tish
      if (value && index < 5) {
        document.getElementById(`code-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`).focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      setError('Iltimos, 6 xonali kodni kiriting');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const data = await apiRequest('/auth/verify-email', {
        method: 'POST',
        body: { email, code: verificationCode }
      });

      if (data.success) {
        onVerified();
      }
    } catch (error) {
      setError(error.message || 'Tasdiqlash xatosi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await apiRequest('/auth/resend-verification', {
        method: 'POST',
        body: { email }
      });

      if (data.success) {
        setTimeLeft(600);
        setCode(['', '', '', '', '', '']);
        document.getElementById('code-0').focus();
      }
    } catch (error) {
      setError(error.message || 'Kod yuborishda xatolik');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <div>
          <div className="mx-auto h-12 w-12 bg-primary-500 rounded-full flex items-center justify-center">
            <Mail className="text-white" size={24} />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Email Tasdiqlash
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            <strong>{email}</strong> manziliga yuborilgan 6 xonali kodni kiriting
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleVerify}>
          <div className="space-y-4">
            <div className="flex justify-center space-x-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <Clock size={16} />
                <span>Kod amal qilish muddati: {formatTime(timeLeft)}</span>
              </div>
            </div>

            {timeLeft === 0 && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isLoading}
                  className="flex items-center justify-center space-x-2 mx-auto text-primary-600 hover:text-primary-500 disabled:opacity-50"
                >
                  <RotateCcw size={16} />
                  <span>Yangi kod yuborish</span>
                </button>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || code.join('').length !== 6}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Tasdiqlanmoqda...' : 'Tasdiqlash'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailVerification;