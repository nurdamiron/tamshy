'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/projects', label: 'Проекты' },
  { href: '/regions', label: 'Регионы' },
  { href: '/leaderboard', label: 'Лидеры' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-2xl backdrop-saturate-[1.8] shadow-[0_1px_3px_rgba(0,0,0,0.04)] border-b border-[#E2E8F0]/40'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <motion.div
            className="w-9 h-9 rounded-xl bg-[#0284C7] flex items-center justify-center shadow-sm"
            whileHover={{ scale: 1.08, rotate: [0, -3, 3, 0] }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C12 2 5 10 5 15a7 7 0 0014 0c0-5-7-13-7-13z"
                fill="white"
              />
            </svg>
          </motion.div>
          <div>
            <span className={`text-[17px] font-bold tracking-tight transition-colors duration-300 ${scrolled ? 'text-[#0F172A]' : 'text-white'}`}>
              Тамшы
            </span>
            <span className={`hidden sm:block text-[10px] font-medium -mt-0.5 transition-colors duration-300 ${scrolled ? 'text-[#64748B]' : 'text-white/50'}`}>
              Водные проекты
            </span>
          </div>
        </Link>

        {/* Desktop nav with animated underline */}
        <div className="hidden md:flex items-center gap-1 relative">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-lg text-[14px] font-medium transition-all duration-300 ${
                  scrolled
                    ? isActive ? 'text-[#0284C7]' : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                    : isActive ? 'text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    className={`absolute bottom-0 left-2 right-2 h-[2px] rounded-full ${scrolled ? 'bg-[#0284C7]' : 'bg-white'}`}
                    layoutId="nav-underline"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <button className={`px-4 py-2 rounded-lg text-[14px] font-medium transition-all duration-300 cursor-pointer ${
              scrolled
                ? 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}>
              Войти
            </button>
          </Link>
          <Link href="/submit">
            <Button size="md">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Отправить проект
            </Button>
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-[#64748B] hover:bg-[#F8FAFC]' : 'text-white/80 hover:bg-white/10'}`}
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

      {/* Mobile menu - slide from right */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            {/* Sheet */}
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-white shadow-2xl z-50 md:hidden"
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
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={`block px-4 py-3 rounded-xl text-[15px] font-medium transition-colors ${
                        pathname === link.href
                          ? 'text-[#0284C7] bg-[#E0F2FE]'
                          : 'text-[#0F172A] hover:bg-[#F8FAFC]'
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <hr className="border-[#E2E8F0] my-4" />
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <div className="px-4 py-3 rounded-xl text-[15px] font-medium text-[#64748B] hover:bg-[#F8FAFC] transition-colors">
                    Войти
                  </div>
                </Link>
                <Link href="/submit" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full mt-2">Отправить проект</Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
