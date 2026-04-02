'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { Video01Icon, File01Icon, Image01Icon, BulbIcon, SmartPhone01Icon } from '@hugeicons/core-free-icons';

const categories = [
  {
    type: 'VIDEO',
    title: 'Видео',
    desc: 'Документальные фильмы и репортажи о водных проблемах',
    count: '120+',
    gradient: 'from-blue-500 to-blue-600',
    icon: Video01Icon,
  },
  {
    type: 'RESEARCH',
    title: 'Исследования',
    desc: 'Научные работы, анализ качества воды и экологии',
    count: '85+',
    gradient: 'from-purple-500 to-purple-600',
    icon: File01Icon,
  },
  {
    type: 'ART',
    title: 'Арт / Плакаты',
    desc: 'Рисунки и визуальные материалы на тему воды',
    count: '150+',
    gradient: 'from-amber-500 to-orange-500',
    icon: Image01Icon,
  },
  {
    type: 'INVENTION',
    title: 'Изобретения',
    desc: 'Устройства и технические решения водосбережения',
    count: '45+',
    gradient: 'from-orange-500 to-red-500',
    icon: BulbIcon,
  },
  {
    type: 'APP',
    title: 'Приложения',
    desc: 'Мобильные приложения для мониторинга воды',
    count: '30+',
    gradient: 'from-teal-500 to-emerald-500',
    icon: SmartPhone01Icon,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
  },
};

export default function ProjectCategories() {
  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-caption text-[#0284C7] tracking-widest">КАТЕГОРИИ</span>
          <h2 className="text-[28px] sm:text-[32px] font-bold text-[#0F172A] mt-3">
            Виды проектов
          </h2>
          <p className="text-[15px] text-[#64748B] mt-2 max-w-lg mx-auto">
            Выбери формат, который тебе ближе
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {categories.map((cat) => (
            <motion.div key={cat.type} variants={itemVariants}>
              <Link href={`/projects?type=${cat.type}`}>
                <motion.div
                  className="group relative overflow-hidden rounded-2xl border border-[#E2E8F0] h-full cursor-pointer bg-white"
                  whileHover={{ y: -6, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}
                  transition={{ type: 'spring' as const, stiffness: 400, damping: 25 }}
                >
                  <div className={`bg-gradient-to-br ${cat.gradient} p-5 pb-8`}>
                    <motion.div
                      className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3"
                      whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <HugeiconsIcon icon={cat.icon} size={24} className="text-white" />
                    </motion.div>
                    <div className="text-[22px] font-bold text-white">{cat.count}</div>
                    <div className="text-[12px] text-white/60">проектов</div>
                  </div>

                  <div className="bg-white p-5 -mt-3 rounded-t-2xl relative">
                    <h3 className="text-[16px] font-semibold text-[#0F172A] mb-1">
                      {cat.title}
                    </h3>
                    <p className="text-[13px] text-[#64748B] leading-relaxed">
                      {cat.desc}
                    </p>
                    <div className="mt-3 flex items-center text-[13px] text-[#0284C7] font-medium">
                      Смотреть
                      <motion.svg
                        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        className="ml-1"
                        initial={{ x: 0 }}
                        whileHover={{ x: 4 }}
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </motion.svg>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
