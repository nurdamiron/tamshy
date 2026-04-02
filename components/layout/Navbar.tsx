'use client';

import Link from 'next/link';
import { useState } from 'react';
import Button from '@/components/ui/Button';

const navLinks = [
  { href: '/projects', label: 'Проекты' },
  { href: '/regions', label: 'Регионы' },
  { href: '/leaderboard', label: 'Лидеры' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#E2EDE9]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1D9E75] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C12 2 5 10 5 15a7 7 0 0014 0c0-5-7-13-7-13z"
                fill="white"
              />
            </svg>
          </div>
          <span className="text-lg font-bold text-[#111B17] tracking-tight">
            Тамшы
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[14px] font-medium text-[#5A7A6E] hover:text-[#111B17] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/submit">
            <Button size="md">Отправить проект</Button>
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2 text-[#5A7A6E]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Меню"
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
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#E2EDE9] bg-white px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-[15px] font-medium text-[#5A7A6E] hover:text-[#111B17] py-2"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/submit" onClick={() => setMobileOpen(false)}>
            <Button className="w-full mt-2">Отправить проект</Button>
          </Link>
        </div>
      )}
    </header>
  );
}
