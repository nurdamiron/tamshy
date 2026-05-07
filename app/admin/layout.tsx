'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import BrandLogo from '@/components/brand/BrandLogo';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

/* ── sidebar nav config ───────────────────────────────── */

interface NavItem {
  label: string;
  href: string;
  disabled?: boolean;
  badge?: number;
  icon: ReactNode;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const sections: NavSection[] = [
  {
    items: [
      {
        label: 'Дашборд',
        href: '/admin',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        ),
      },
    ],
  },
  {
    title: 'КОНТЕНТ',
    items: [
      {
        label: 'Страницы',
        href: '/admin',
        disabled: true,
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <path d="M14 2v6h6" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <line x1="10" y1="9" x2="8" y2="9" />
          </svg>
        ),
      },
      {
        label: 'Новости',
        href: '/admin/news',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2" />
            <line x1="10" y1="6" x2="18" y2="6" />
            <line x1="10" y1="10" x2="18" y2="10" />
            <line x1="10" y1="14" x2="14" y2="14" />
          </svg>
        ),
      },
      {
        label: 'Импорт новости',
        href: '/admin/news-import',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        ),
      },
      {
        label: 'Медиатека',
        href: '/admin/materials',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
          </svg>
        ),
      },
    ],
  },
  {
    title: 'МОДУЛИ',
    items: [
      {
        label: 'Проекты',
        href: '/admin/projects',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        ),
      },
      {
        label: 'Конкурсы',
        href: '/admin/contests',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 010-5C7 4 7 7 7 7" />
            <path d="M18 9h1.5a2.5 2.5 0 000-5C17 4 17 7 17 7" />
            <path d="M4 22h16" />
            <path d="M10 22V8c0-1.1.9-2 2-2s2 .9 2 2v14" />
            <path d="M8 9h8" />
            <path d="M8 13h8" />
          </svg>
        ),
      },
      {
        label: 'Заявки',
        href: '/admin/submissions',
        badge: 0,
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            <line x1="9" y1="12" x2="15" y2="12" />
            <line x1="9" y1="16" x2="15" y2="16" />
          </svg>
        ),
      },
      {
        label: 'Сообщения',
        href: '/admin/messages',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        ),
      },
      {
        label: 'Qazsu KPI',
        href: '/admin/qazsu-stats',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        ),
      },
      {
        label: 'Водные объекты',
        href: '/admin/water-objects',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12h2a4 4 0 014-4 4 4 0 014 4 4 4 0 014-4 4 4 0 014 4h2" />
            <path d="M2 18h2a4 4 0 014-4 4 4 0 014 4 4 4 0 014-4 4 4 0 014 4h2" />
          </svg>
        ),
      },
    ],
  },
  {
    title: 'СИСТЕМА',
    items: [
      {
        label: 'Пользователи',
        href: '/admin/users',
        disabled: false,
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87" />
            <path d="M16 3.13a4 4 0 010 7.75" />
          </svg>
        ),
      },
      {
        label: 'Безопасность',
        href: '/admin',
        disabled: true,
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        ),
      },
    ],
  },
];

/* ── breadcrumb map ──────────────────────────────────── */

const breadcrumbNames: Record<string, string> = {
  admin: 'Панель управления',
  projects: 'Проекты',
  contests: 'Конкурсы',
  submissions: 'Заявки',
  materials: 'Медиатека',
  news: 'Новости',
  messages: 'Сообщения',
  'qazsu-stats': 'Qazsu KPI',
  'news-import': 'Импорт новости',
  'water-objects': 'Водные объекты',
};

/* ── layout component ────────────────────────────────── */

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const breadcrumbs = pathname
    .split('/')
    .filter(Boolean)
    .map((segment, idx, arr) => ({
      label: breadcrumbNames[segment] || segment,
      href: '/' + arr.slice(0, idx + 1).join('/'),
    }));

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      {/* ── sidebar ─────────────────────────────────── */}
      <aside
        className={`${
          sidebarCollapsed ? 'w-[68px]' : 'w-[240px]'
        } flex-shrink-0 bg-[#0F172A] text-white flex flex-col transition-all duration-300`}
      >
        {/* logo */}
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
            <BrandLogo size="sm" className="w-full h-full" />
          </div>
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold text-[15px] whitespace-nowrap"
            >
              Tamshy<span className="text-blue-400">.Admin</span>
            </motion.span>
          )}
        </div>

        {/* nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {sections.map((section, sIdx) => (
            <div key={sIdx}>
              {section.title && !sidebarCollapsed && (
                <p className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase px-2 mb-2">
                  {section.title}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  if (item.disabled) {
                    return (
                      <div
                        key={item.label}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-slate-600 cursor-not-allowed select-none ${
                          sidebarCollapsed ? 'justify-center' : ''
                        }`}
                      >
                        <span className="opacity-40">{item.icon}</span>
                        {!sidebarCollapsed && (
                          <span className="opacity-40">{item.label}</span>
                        )}
                      </div>
                    );
                  }
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                        active
                          ? 'bg-blue-600/20 text-blue-400'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      } ${sidebarCollapsed ? 'justify-center' : ''}`}
                    >
                      {item.icon}
                      {!sidebarCollapsed && (
                        <>
                          <span className="flex-1">{item.label}</span>
                          {item.badge !== undefined && item.badge > 0 && (
                            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* bottom user */}
        <div className="border-t border-white/10 px-3 py-3">
          <div
            className={`flex items-center gap-3 ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium truncate">Администратор</p>
                <button
                  onClick={() => {
                    document.cookie = 'tamshy-token=; path=/; max-age=0';
                    window.location.href = '/login';
                  }}
                  className="text-[11px] text-slate-500 hover:text-red-400 transition-colors"
                >
                  Выйти
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── main area ───────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* top bar */}
        <header className="h-14 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* collapse toggle */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            {/* breadcrumb */}
            <div className="flex items-center gap-1.5 text-[13px]">
              {breadcrumbs.map((bc, i) => (
                <span key={bc.href} className="flex items-center gap-1.5">
                  {i > 0 && <span className="text-slate-300">/</span>}
                  {i === breadcrumbs.length - 1 ? (
                    <span className="text-slate-900 font-medium">{bc.label}</span>
                  ) : (
                    <Link href={bc.href} className="text-slate-500 hover:text-blue-600 transition-colors">
                      {bc.label}
                    </Link>
                  )}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-blue-600 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Перейти на сайт
            </Link>
            <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 relative transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
            </button>
          </div>
        </header>

        {/* content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="p-6"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
