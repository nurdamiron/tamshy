'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useRef, MouseEvent } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { HugeiconsIcon } from '@hugeicons/react';
import { Video01Icon, File01Icon, Image01Icon, BulbIcon, SmartPhone01Icon } from '@hugeicons/core-free-icons';
import { CATEGORY_COVER_URLS } from '@/lib/constants';

interface CategoryItem {
  type: string;
  title: string;
  desc: string;
  count: string;
  gradient: string;
  coverUrl?: string;
  icon: typeof Video01Icon;
  span: string;
  projectsLabel: string;
  viewLabel: string;
}

function TiltCard({ category }: { category: CategoryItem }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-5, 5]);

  function handleMouseMove(e: MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xVal = (e.clientX - rect.left) / rect.width - 0.5;
    const yVal = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xVal);
    y.set(yVal);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={`${category.span}`}
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      <Link href={`/projects?type=${category.type}`}>
        <motion.div
          className="group relative overflow-hidden rounded-2xl border border-[#E2E8F0]/60 h-full cursor-pointer bg-white"
          style={{ perspective: 800, rotateX, rotateY, transformStyle: 'preserve-3d' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <div
            className={`relative p-5 pb-8 overflow-hidden min-h-[140px] ${
              category.coverUrl ? '' : `bg-gradient-to-br ${category.gradient}`
            }`}
          >
            {category.coverUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={category.coverUrl}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/30 to-black/15"
                  aria-hidden
                />
              </>
            ) : (
              <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                  backgroundSize: '16px 16px',
                }}
              />
            )}
            <motion.div
              className="relative z-10 w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3"
              whileHover={{ rotate: 8, scale: 1.1 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <HugeiconsIcon icon={category.icon} size={24} className="text-white" />
            </motion.div>
            <div className="relative z-10 text-[24px] font-bold text-white">{category.count}</div>
            <div className="relative z-10 text-[12px] text-white/80 font-medium">{category.projectsLabel}</div>
          </div>

          <div className="bg-white p-5 -mt-3 rounded-t-2xl relative">
            <h3 className="text-[16px] font-semibold text-[#0F172A] mb-1 group-hover:text-[#0284C7] transition-colors">
              {category.title}
            </h3>
            <p className="text-[13px] text-[#64748B] leading-relaxed">
              {category.desc}
            </p>
            <div className="mt-3 flex items-center text-[13px] text-[#0284C7] font-medium">
              {category.viewLabel}
              <motion.svg
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                className="ml-1"
                whileHover={{ x: 4 }}
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </motion.svg>
            </div>
          </div>

          {/* Hover gradient border overlay */}
          <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#0284C7]/20 transition-colors duration-300 pointer-events-none" />
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function ProjectCategories() {
  const t = useTranslations('categories');

  const categories: CategoryItem[] = [
    {
      type: 'VIDEO',
      title: t('video'),
      desc: t('videoDesc'),
      count: '120+',
      gradient: 'from-blue-500 to-blue-600',
      coverUrl: CATEGORY_COVER_URLS.VIDEO,
      icon: Video01Icon,
      span: 'sm:col-span-1 lg:col-span-3',
      projectsLabel: t('projects'),
      viewLabel: t('view'),
    },
    {
      type: 'RESEARCH',
      title: t('research'),
      desc: t('researchDesc'),
      count: '85+',
      gradient: 'from-purple-500 to-purple-600',
      coverUrl: CATEGORY_COVER_URLS.RESEARCH,
      icon: File01Icon,
      span: 'sm:col-span-1 lg:col-span-3',
      projectsLabel: t('projects'),
      viewLabel: t('view'),
    },
    {
      type: 'ART',
      title: t('art'),
      desc: t('artDesc'),
      count: '150+',
      gradient: 'from-amber-500 to-orange-500',
      coverUrl: CATEGORY_COVER_URLS.ART,
      icon: Image01Icon,
      span: 'sm:col-span-1 lg:col-span-2',
      projectsLabel: t('projects'),
      viewLabel: t('view'),
    },
    {
      type: 'INVENTION',
      title: t('invention'),
      desc: t('inventionDesc'),
      count: '45+',
      gradient: 'from-orange-500 to-red-500',
      coverUrl: CATEGORY_COVER_URLS.INVENTION,
      icon: BulbIcon,
      span: 'sm:col-span-1 lg:col-span-2',
      projectsLabel: t('projects'),
      viewLabel: t('view'),
    },
    {
      type: 'APP',
      title: t('app'),
      desc: t('appDesc'),
      count: '30+',
      gradient: 'from-teal-500 to-emerald-500',
      coverUrl: CATEGORY_COVER_URLS.APP,
      icon: SmartPhone01Icon,
      span: 'sm:col-span-2 lg:col-span-2',
      projectsLabel: t('projects'),
      viewLabel: t('view'),
    },
  ];

  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <span className="text-caption text-[#0284C7] tracking-widest">{t('caption')}</span>
          <h2 className="text-[28px] sm:text-[36px] font-bold text-[#0F172A] mt-3">
            {t('title')}
          </h2>
          <p className="text-[15px] text-[#64748B] mt-3 max-w-lg mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <TiltCard key={cat.type} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
