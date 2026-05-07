'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#FFF7ED] via-white to-[#F8FAFC]">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center mx-auto mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="1.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <h2 className="text-[22px] font-bold text-[#0F172A] mb-3">Қате орын алды</h2>
        <p className="text-[15px] text-[#64748B] mb-8 leading-relaxed">
          Беттің жүктелуінде қате кетті.<br/>
          Қайтадан байқап көріңіз немесе басты бетке оралыңыз.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl bg-[#0284C7] text-white text-[15px] font-semibold
              hover:bg-[#0369A1] transition-colors"
          >
            Қайтадан байқау
          </button>
          <a
            href="/"
            className="px-6 py-3 rounded-xl border border-[#E2E8F0] text-[#64748B] text-[15px]
              font-medium hover:bg-[#F8FAFC] transition-colors"
          >
            Басты бет
          </a>
        </div>
        {error.digest && (
          <p className="mt-6 text-[12px] text-[#CBD5E1]">Код: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
