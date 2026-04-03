'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  return (
    <footer className="relative bg-[#0F172A] text-white">
      {/* Wave separator */}
      <div className="absolute -top-[1px] left-0 right-0">
        <svg viewBox="0 0 1440 48" preserveAspectRatio="none" className="w-full h-[24px] sm:h-[36px]">
          <path d="M0,48 C360,0 720,48 1080,0 C1260,24 1380,48 1440,48 L1440,48 L0,48 Z" fill="#0F172A" />
          <path d="M0,48 L1440,48 L1440,0 C1380,48 1260,24 1080,0 C720,48 360,0 0,48 Z" fill="currentColor" className="text-white" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-[#3B82F6] flex items-center justify-center">
                <svg width="16" height="22" viewBox="0 0 20 28" fill="none">
                  <path d="M10 0C10 0 0 12 0 18a10 10 0 0020 0C20 12 10 0 10 0z" fill="white" />
                </svg>
              </div>
              <span className="text-[18px] font-bold tracking-tight">
                Tamshy<span className="text-[#3B82F6]">.kz</span>
              </span>
            </div>
            <p className="text-[14px] text-white/50 leading-relaxed max-w-xs">
              {t('description')}
            </p>

            {/* Social icons */}
            <div className="flex gap-2 mt-6">
              {[
                {
                  name: 'instagram',
                  href: 'https://www.instagram.com/tamshy__kz',
                  hoverColor: '#E1306C',
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="2" width="20" height="20" rx="5" />
                      <circle cx="12" cy="12" r="5" />
                      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                    </svg>
                  ),
                },
                {
                  name: 'telegram',
                  href: '#',
                  hoverColor: '#2AABEE',
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                    </svg>
                  ),
                },
                {
                  name: 'youtube',
                  href: '#',
                  hoverColor: '#FF0000',
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23 9.71a8.5 8.5 0 00-.91-4.13 2.92 2.92 0 00-1.72-1A78.4 78.4 0 0012 4.27a78.5 78.5 0 00-8.34.3 2.87 2.87 0 00-1.46.74c-.9.83-1 2.25-1.1 3.45a48.3 48.3 0 000 6.48 9.9 9.9 0 00.54 2.59 2.71 2.71 0 001.3 1.4 6.4 6.4 0 002.73.45c2.54.06 10.43.13 14.3-.06a3 3 0 001.48-.64c.86-.78 1-2.2 1.12-3.46a42.6 42.6 0 00.03-5.81zM9.68 15.67V8.33l6.23 3.67-6.23 3.67z" />
                    </svg>
                  ),
                },
              ].map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-white/50 transition-colors"
                  whileHover={{ backgroundColor: social.hoverColor + '20', color: social.hoverColor, scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[11px] font-semibold text-white/30 uppercase tracking-widest mb-4">
              {t('navigation')}
            </h4>
            <div className="space-y-3">
              {[
                { href: '/', label: tNav('home') },
                { href: '/about', label: tNav('about') },
                { href: '/progress', label: tNav('progress') },
                { href: '/contests', label: tNav('contests') },
                { href: '/materials', label: tNav('materials') },
                { href: '/contacts', label: tNav('contacts') },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group block text-[14px] text-white/50 hover:text-white transition-colors duration-300"
                >
                  <span className="relative">
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/60 group-hover:w-full transition-all duration-300" />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Partners */}
          <div>
            <h4 className="text-[11px] font-semibold text-white/30 uppercase tracking-widest mb-4">
              {t('partners')}
            </h4>
            <div className="space-y-3 text-[14px] text-white/50">
              <p>{t('partner1')}</p>
              <p>{t('partner2')}</p>
              <p>{t('partner3')}</p>
              <p>{t('partner4')}</p>
              <p>{t('partner5')}</p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[11px] font-semibold text-white/30 uppercase tracking-widest mb-4">
              {t('contacts')}
            </h4>
            <div className="space-y-3 text-[14px] text-white/50">
              <div className="flex items-start gap-2.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>ул. Айтеке би, 12, офис 305<br />г. Кызылорда, 120000</span>
              </div>
              <div className="flex items-start gap-2.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
                <span>+7 (7242) 55-55-55<br /><span className="text-white/30">Пн-Пт, 09:00 - 18:00</span></span>
              </div>
              <div className="flex items-start gap-2.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                info@tamshy.kz
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[13px] text-white/30">
            &copy; 2026 Tamshy.kz. {t('rights')}
          </p>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[13px] text-white/30 hover:text-white/60 transition-colors">
              {t('adminLogin')}
            </Link>
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Наверх"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.5">
                <path d="M18 15l-6-6-6 6" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}
