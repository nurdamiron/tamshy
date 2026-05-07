'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

const languages = [
  { code: 'kk', label: 'Қаз', flag: '🇰🇿' },
  { code: 'ru', label: 'Рус', flag: '🇷🇺' },
  { code: 'en', label: 'Eng', flag: '🇬🇧' },
] as const;

export default function LanguageSwitcher({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const current = languages.find((l) => l.code === locale) || languages[0];

  const switchLocale = (code: string) => {
    document.cookie = `locale=${code};path=/;max-age=${365 * 24 * 60 * 60}`;
    setOpen(false);
    window.location.reload();
  };

  const isLight = variant === 'light';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-all cursor-pointer ${
          isLight
            ? 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
            : 'text-white/70 hover:text-white hover:bg-white/10'
        }`}
      >
        <span className="text-[15px] leading-none">{current.flag}</span>
        <span>{current.label}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-[#E2E8F0] py-1 min-w-[120px] z-50"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => switchLocale(lang.code)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-[13px] transition-colors cursor-pointer ${
                  lang.code === locale
                    ? 'text-[#3B82F6] bg-[#EFF6FF] font-semibold'
                    : 'text-[#0F172A] hover:bg-[#F8FAFC]'
                }`}
              >
                <span className="text-[15px]">{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
