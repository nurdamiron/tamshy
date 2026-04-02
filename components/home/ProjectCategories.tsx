'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const categories = [
  {
    type: 'VIDEO',
    title: 'Видео',
    desc: 'Документальные фильмы, ролики и репортажи о водных проблемах',
    count: '120+',
    gradient: 'from-blue-500 to-blue-600',
    lightBg: 'bg-blue-50',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
  },
  {
    type: 'RESEARCH',
    title: 'Исследования',
    desc: 'Научные работы, анализ качества воды и экологические исследования',
    count: '85+',
    gradient: 'from-purple-500 to-purple-600',
    lightBg: 'bg-purple-50',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    type: 'ART',
    title: 'Арт / Плакаты',
    desc: 'Рисунки, плакаты и визуальные материалы на тему воды',
    count: '150+',
    gradient: 'from-amber-500 to-orange-500',
    lightBg: 'bg-amber-50',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
        <circle cx="13.5" cy="6.5" r="2.5" />
        <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    ),
  },
  {
    type: 'INVENTION',
    title: 'Изобретения',
    desc: 'Макеты, устройства и технические решения для водосбережения',
    count: '45+',
    gradient: 'from-orange-500 to-red-500',
    lightBg: 'bg-orange-50',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
        <path d="M9 18h6M10 22h4M12 2v1M4.22 4.22l.7.7M1 12h1M4.22 19.78l.7-.7M20.78 19.78l-.7-.7M23 12h-1M19.78 4.22l-.7.7" />
        <path d="M18 12a6 6 0 11-12 0 6 6 0 0112 0z" />
      </svg>
    ),
  },
  {
    type: 'APP',
    title: 'Приложения',
    desc: 'Мобильные приложения и веб-сайты для мониторинга и экономии воды',
    count: '30+',
    gradient: 'from-teal-500 to-emerald-500',
    lightBg: 'bg-teal-50',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <line x1="12" y1="18" x2="12" y2="18" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function ProjectCategories() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-caption text-[#1D9E75] tracking-widest">КАТЕГОРИИ</span>
          <h2 className="text-[28px] sm:text-[32px] font-bold text-[#111B17] mt-3">
            Виды проектов
          </h2>
          <p className="text-[15px] text-[#5A7A6E] mt-2 max-w-lg mx-auto">
            Выбери формат, который тебе ближе — от видео до изобретений
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.type}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link href={`/projects?type=${cat.type}`}>
                <div className="group relative overflow-hidden rounded-2xl border border-[#E2EDE9] h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-transparent cursor-pointer">
                  {/* Header with gradient */}
                  <div className={`bg-gradient-to-br ${cat.gradient} p-5 pb-8`}>
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
                      {cat.icon}
                    </div>
                    <div className="text-[22px] font-bold text-white">{cat.count}</div>
                    <div className="text-[12px] text-white/60">проектов</div>
                  </div>

                  {/* Content */}
                  <div className="bg-white p-5 -mt-3 rounded-t-2xl relative">
                    <h3 className="text-[16px] font-semibold text-[#111B17] mb-1">
                      {cat.title}
                    </h3>
                    <p className="text-[13px] text-[#5A7A6E] leading-relaxed">
                      {cat.desc}
                    </p>
                    <div className="mt-3 flex items-center text-[13px] text-[#1D9E75] font-medium group-hover:gap-2 transition-all">
                      Смотреть
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-1 transition-transform group-hover:translate-x-1">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
