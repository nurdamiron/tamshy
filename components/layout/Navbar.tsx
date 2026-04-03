'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const navKeys = [
  { href: '/', key: 'home' },
  { href: '/about', key: 'about' },
  { href: '/progress', key: 'progress' },
  { href: '/contests', key: 'contests' },
  { href: '/materials', key: 'materials' },
  { href: '/contacts', key: 'contacts' },
] as const;

export default function Navbar() {
  const t = useTranslations('nav');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Fixed navbar — floats over content */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className={`max-w-6xl mx-auto px-3 sm:px-4 transition-all duration-500 ${scrolled ? 'pt-2' : 'pt-3'}`}>
          <motion.header
            initial={false}
            animate={{ borderRadius: scrolled ? 14 : 18 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={`pointer-events-auto transition-all duration-500 ${
              scrolled
                ? 'bg-white/90 backdrop-blur-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.04)]'
                : isHome
                  ? 'bg-black/20 backdrop-blur-md border border-white/10'
                  : 'bg-white/90 backdrop-blur-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.04)]'
            }`}
          >
            <nav className="px-4 sm:px-5 h-14 flex items-center justify-between gap-2">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 group shrink-0">
                <motion.div
                  className="w-8 h-8 rounded-lg bg-[#3B82F6] flex items-center justify-center"
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <svg width="14" height="20" viewBox="0 0 20 28" fill="none">
                    <path d="M10 0C10 0 0 12 0 18a10 10 0 0020 0C20 12 10 0 10 0z" fill="white" />
                  </svg>
                </motion.div>
                <span className={`text-[17px] font-bold tracking-tight transition-colors duration-300 ${
                  scrolled || !isHome ? 'text-[#0F172A]' : 'text-white'
                }`}>
                  Tamshy<span className={`transition-colors duration-300 ${
                    scrolled || !isHome ? 'text-[#3B82F6]' : 'text-white/80'
                  }`}>.kz</span>
                </span>
              </Link>

              {/* Desktop nav */}
              <div className="hidden lg:flex items-center gap-0.5">
                {navKeys.map((link) => {
                  const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                  const solid = scrolled || !isHome;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`relative px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                        solid
                          ? isActive ? 'text-[#3B82F6] bg-[#EFF6FF]' : 'text-[#4B5563] hover:text-[#0F172A] hover:bg-[#F3F4F6]'
                          : isActive ? 'text-white bg-white/20' : 'text-white/90 hover:text-white hover:bg-white/15'
                      }`}
                    >
                      {t(link.key)}
                    </Link>
                  );
                })}
              </div>

              {/* Right: lang + CTA */}
              <div className="hidden lg:flex items-center gap-1.5 shrink-0">
                <LanguageSwitcher variant={scrolled || !isHome ? 'light' : 'dark'} />
                <Link href="/contests">
                  <Button size="sm">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    {t('submitApplication')}
                  </Button>
                </Link>
              </div>

              {/* Mobile burger */}
              <button
                className={`lg:hidden p-2 rounded-lg transition-colors ${
                  scrolled || !isHome ? 'text-[#4B5563] hover:bg-[#F3F4F6]' : 'text-white hover:bg-white/15'
                }`}
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={t('menu')}
              >
                {mobileOpen ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 12h18M3 6h18M3 18h18" />
                  </svg>
                )}
              </button>
            </nav>
          </motion.header>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-white shadow-2xl z-[70] lg:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="p-6 pt-20 space-y-1">
                {navKeys.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      className={`block px-4 py-3 rounded-xl text-[15px] font-medium transition-colors ${
                        pathname === link.href
                          ? 'text-[#3B82F6] bg-[#EFF6FF]'
                          : 'text-[#0F172A] hover:bg-[#F8FAFC]'
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {t(link.key)}
                    </Link>
                  </motion.div>
                ))}
                <hr className="border-[#E2E8F0] my-4" />
                <div className="px-4 py-2">
                  <LanguageSwitcher variant="light" />
                </div>
                <Link href="/contests" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full mt-2">{t('submitApplication')}</Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
