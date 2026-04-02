'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('+7');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOtpSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка');
    }
    setLoading(false);
  };

  const verifyOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push('/');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card hover={false} padding="lg" className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#1D9E75] flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C12 2 5 10 5 15a7 7 0 0014 0c0-5-7-13-7-13z" fill="white" />
            </svg>
          </div>
          <h1 className="text-[24px] font-bold text-[#111B17]">Вход в Тамшы</h1>
          <p className="text-[14px] text-[#5A7A6E] mt-1">
            Введите номер телефона для входа
          </p>
        </div>

        <div className="space-y-4">
          <Input
            label="Номер телефона"
            type="tel"
            placeholder="+7 (___) ___-__-__"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={otpSent}
          />

          {!otpSent ? (
            <Button onClick={sendOtp} loading={loading} className="w-full">
              Получить код
            </Button>
          ) : (
            <>
              <Input
                label="Код из SMS"
                placeholder="______"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="text-center text-[20px] tracking-[8px]"
              />
              <Button onClick={verifyOtp} loading={loading} className="w-full">
                Войти
              </Button>
              <button
                onClick={() => { setOtpSent(false); setOtp(''); }}
                className="w-full text-[13px] text-[#5A7A6E] hover:text-[#1D9E75] transition-colors"
              >
                Отправить код повторно
              </button>
            </>
          )}
        </div>

        {error && (
          <p className="mt-4 text-[13px] text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>
        )}
      </Card>
    </div>
  );
}
