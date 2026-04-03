'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Главная' },
  { href: '/about', label: 'О проекте' },
  { href: '/progress', label: 'Ход реализации' },
  { href: '/contests', label: 'Конкурсы' },
  { href: '/materials', label: 'Материалы' },
  { href: '/contacts', label: 'Контакты' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // On non-home pages, always show solid navbar
  const showSolid = scrolled || !isHome;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        showSolid
          ? 'bg-white/80 backdrop-blur-2xl backdrop-saturate-[1.8] shadow-[0_1px_3px_rgba(0,0,0,0.04)] border-b border-[#E2E8F0]/40'
          : 'bg-gradient-to-b from-black/25 to-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo — Tamshy.kz */}
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            className="w-8 h-8 rounded-lg bg-[#3B82F6] flex items-center justify-center shadow-sm"
            whileHover={{ scale: 1.08, rotate: [0, -3, 3, 0] }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <svg width="16" height="22" viewBox="0 0 20 28" fill="none">
              <path
                d="M10 0C10 0 0 12 0 18a10 10 0 0020 0C20 12 10 0 10 0z"
                fill="white"
              />
            </svg>
          </motion.div>
          <span className={`text-[18px] font-bold tracking-tight transition-colors duration-300 ${showSolid ? 'text-[#0F172A]' : 'text-white'}`}>
            Tamshy<span className={`transition-colors duration-300 ${showSolid ? 'text-[#3B82F6]' : 'text-white/80'}`}>.kz</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-0.5 relative">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-2 rounded-lg text-[13.5px] font-medium transition-all duration-300 ${
                  showSolid
                    ? isActive ? 'text-[#3B82F6]' : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                    : isActive ? 'text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    className={`absolute bottom-0 left-2 right-2 h-[2px] rounded-full ${showSolid ? 'bg-[#3B82F6]' : 'bg-white'}`}
                    layoutId="nav-underline"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="hidden lg:flex items-center">
          <Link href="/contests">
            <Button size="md">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Подать заявку
            </Button>
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          className={`lg:hidden p-2 rounded-lg transition-colors ${showSolid ? 'text-[#64748B] hover:bg-[#F8FAFC]' : 'text-white/80 hover:bg-white/10'}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Меню"
        >
          <motion.div
            animate={mobileOpen ? { rotate: 90 } : { rotate: 0 }}
            transition={{ duration: 0.2 }}
          >
            {mobileOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </motion.div>
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-white shadow-2xl z-50 lg:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="p-6 pt-20 space-y-1">
                {navLinks.map((link, i) => (
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
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <hr className="border-[#E2E8F0] my-4" />
                <Link href="/contests" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full mt-2">Подать заявку</Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
