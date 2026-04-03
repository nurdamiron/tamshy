'use client';

import { useEffect } from 'react';

export default function AdminError({
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
    <div className="flex items-center justify-center h-[60vh]">
      <div className="text-center max-w-md">
        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-red-50 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <h3 className="text-[18px] font-semibold text-[#0F172A] mb-1">Ошибка</h3>
        <p className="text-[14px] text-[#64748B] mb-6">{error.message || 'Произошла непредвиденная ошибка'}</p>
        <button
          onClick={reset}
          className="h-[38px] px-5 rounded-lg bg-[#3B82F6] text-white font-medium text-[14px] hover:bg-[#2563EB] transition-colors cursor-pointer"
        >
          Повторить
        </button>
      </div>
    </div>
  );
}
