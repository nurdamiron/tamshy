'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('common');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-50 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <h2 className="text-[24px] font-bold text-[#0F172A] mb-2">{t('errorTitle')}</h2>
        <p className="text-[15px] text-[#64748B] mb-8">
          {t('errorDesc')}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="h-[42px] px-6 rounded-xl bg-[#3B82F6] text-white font-semibold text-[14px] hover:bg-[#2563EB] transition-colors cursor-pointer"
          >
            {t('tryAgain')}
          </button>
          <Link href="/">
            <button className="h-[42px] px-6 rounded-xl border border-[#E2E8F0] text-[#64748B] font-semibold text-[14px] hover:bg-[#F8FAFC] transition-colors cursor-pointer">
              {t('backToHome')}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
