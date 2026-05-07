'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import BrandLogo from '@/components/brand/BrandLogo';

function redirectByRole(role: string, router: ReturnType<typeof useRouter>) {
  if (role === 'ADMIN') router.push('/admin');
  else if (role === 'JURY') router.push('/jury');
  else router.push('/cabinet');
}

export default function LoginPage() {
  const t = useTranslations('login');
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [consentPd, setConsentPd] = useState(false);
  const [consentEmail, setConsentEmail] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const otp = digits.join('');

  const handleDigit = useCallback((index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
  }, [digits]);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) inputRefs.current[index - 1]?.focus();
  }, [digits]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = ['', '', '', '', '', ''];
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  }, []);

  const sendOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStep('otp');
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('error'));
    }
    setLoading(false);
  };

  const verifyOtp = async () => {
    if (otp.length < 6) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp, consentPd, consentEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      // Перенаправление по роли
      redirectByRole(data.user.role, router);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('error'));
      setDigits(['', '', '', '', '', '']);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
    setLoading(false);
  };

  const goBack = () => { setStep('email'); setDigits(['', '', '', '', '', '']); setError(''); };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#F0F9FF] via-white to-[#F8FAFC]">
      <div className="w-full max-w-[420px]">

        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 rounded-2xl overflow-hidden">
            <BrandLogo size={48} className="w-full h-full" />
          </div>
        </div>

        <AnimatePresence mode="wait">

          {/* ── Step 1: Email ── */}
          {step === 'email' && (
            <motion.div key="email"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>

              <div className="text-center mb-6">
                <h1 className="text-[26px] font-bold text-[#0F172A] tracking-tight">{t('title')}</h1>
                <p className="text-[14px] text-[#64748B] mt-2">{t('subtitle')}</p>
              </div>

              {/* Кто может войти */}
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] mb-5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0284C7"
                  strokeWidth="2" strokeLinecap="round" className="shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p className="text-[12.5px] text-[#0369A1] leading-relaxed">
                  {t('whoCanLogin')}
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 space-y-5">
                <div>
                  <label className="block text-[13px] font-medium text-[#374151] mb-1.5">
                    {t('phoneLabel')}
                  </label>
                  <input type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && consentPd && email && sendOtp()}
                    placeholder="example@mail.com"
                    autoComplete="email" autoFocus
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E2E8F0] text-[15px] text-[#0F172A]
                      placeholder:text-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20
                      focus:border-[#0284C7] transition-all bg-[#FAFAFA]"
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={consentPd} onChange={(e) => setConsentPd(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded accent-[#0284C7] cursor-pointer shrink-0" />
                    <span className="text-[12.5px] text-[#475569] leading-relaxed">
                      {t.rich('consentPdText', {
                        link: (chunks) => (
                          <Link href="/privacy" target="_blank" rel="noopener noreferrer"
                            className="text-[#0284C7] hover:underline font-medium"
                            onClick={(e) => e.stopPropagation()}>{chunks}</Link>
                        ),
                      })}{' '}
                      <span className="text-red-500">{t('required')}</span>
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={consentEmail} onChange={(e) => setConsentEmail(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded accent-[#0284C7] cursor-pointer shrink-0" />
                    <span className="text-[12.5px] text-[#475569] leading-relaxed">
                      {t('consentEmailText')}
                    </span>
                  </label>
                </div>

                {error && (
                  <p className="text-[13px] text-red-500 bg-red-50 border border-red-100 px-3 py-2.5 rounded-lg">
                    {error}
                  </p>
                )}

                <button onClick={sendOtp} disabled={!consentPd || !email || loading}
                  className="w-full h-11 rounded-xl bg-[#0284C7] text-white text-[14px] font-semibold
                    hover:bg-[#0369A1] disabled:opacity-40 disabled:cursor-not-allowed transition-all
                    flex items-center justify-center gap-2">
                  {loading && (
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
                      <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                  )}
                  {t('getCode')}
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 2: OTP ── */}
          {step === 'otp' && (
            <motion.div key="otp"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>

              <div className="text-center mb-8">
                <h1 className="text-[26px] font-bold text-[#0F172A] tracking-tight">
                  {t('smsCode')}
                </h1>
                <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 bg-[#F0F9FF] border border-[#BAE6FD] rounded-full">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <span className="text-[12px] font-medium text-[#0284C7]">{email}</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 space-y-6">
                <div className="flex gap-2.5 justify-center">
                  {digits.map((digit, i) => (
                    <input key={i}
                      ref={(el) => { inputRefs.current[i] = el; }}
                      type="text" inputMode="numeric" maxLength={1} value={digit}
                      onChange={(e) => handleDigit(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      onPaste={i === 0 ? handlePaste : undefined}
                      className={`w-12 h-14 rounded-xl border-2 text-center text-[22px] font-bold
                        text-[#0F172A] transition-all outline-none
                        ${digit ? 'border-[#0284C7] bg-[#F0F9FF]' : 'border-[#E2E8F0] bg-[#FAFAFA]'}
                        focus:border-[#0284C7] focus:bg-[#F0F9FF] focus:ring-2 focus:ring-[#0284C7]/15`}
                    />
                  ))}
                </div>

                {error && (
                  <p className="text-[13px] text-red-500 bg-red-50 border border-red-100 px-3 py-2.5 rounded-lg text-center">
                    {error}
                  </p>
                )}

                <button onClick={verifyOtp} disabled={otp.length < 6 || loading}
                  className="w-full h-11 rounded-xl bg-[#0284C7] text-white text-[14px] font-semibold
                    hover:bg-[#0369A1] disabled:opacity-40 disabled:cursor-not-allowed transition-all
                    flex items-center justify-center gap-2">
                  {loading && (
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
                      <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                  )}
                  {t('login')}
                </button>

                <button onClick={goBack}
                  className="w-full text-[13px] text-[#94A3B8] hover:text-[#64748B] transition-colors">
                  {t('resendCode')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-[12px] text-[#CBD5E1] mt-6">© 2026 Тамшы</p>
      </div>
    </div>
  );
}
