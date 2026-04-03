'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { useTranslations } from 'next-intl';
import BrandLogo from '@/components/brand/BrandLogo';

export default function LoginPage() {
  const t = useTranslations('login');
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
      setError(e instanceof Error ? e.message : t('error'));
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
      setError(e instanceof Error ? e.message : t('error'));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card hover={false} padding="lg" className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center mx-auto mb-4 ring-1 ring-[#E2E8F0] shadow-sm">
            <BrandLogo size={56} className="w-full h-full" />
          </div>
          <h1 className="text-[24px] font-bold text-[#0F172A]">{t('title')}</h1>
          <p className="text-[14px] text-[#64748B] mt-1">
            {t('subtitle')}
          </p>
        </div>

        <div className="space-y-4">
          <Input
            label={t('phoneLabel')}
            type="tel"
            placeholder="+7 (___) ___-__-__"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={otpSent}
          />

          {!otpSent ? (
            <Button onClick={sendOtp} loading={loading} className="w-full">
              {t('getCode')}
            </Button>
          ) : (
            <>
              <Input
                label={t('smsCode')}
                placeholder="______"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="text-center text-[20px] tracking-[8px]"
              />
              <Button onClick={verifyOtp} loading={loading} className="w-full">
                {t('login')}
              </Button>
              <button
                onClick={() => { setOtpSent(false); setOtp(''); }}
                className="w-full text-[13px] text-[#64748B] hover:text-[#0284C7] transition-colors"
              >
                {t('resendCode')}
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
