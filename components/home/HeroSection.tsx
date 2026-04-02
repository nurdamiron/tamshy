'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#E1F5EE] to-white">
      {/* Background decorative drops */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-[#1D9E75]/5 blur-3xl" />
        <div className="absolute bottom-10 right-[15%] w-48 h-48 rounded-full bg-[#2BBFA0]/8 blur-2xl" />
        <div className="absolute top-40 right-[30%] w-32 h-32 rounded-full bg-[#F5A623]/5 blur-2xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-32">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 border border-[#E2EDE9]">
              <div className="w-2 h-2 rounded-full bg-[#1D9E75] animate-pulse" />
              <span className="text-[13px] font-medium text-[#5A7A6E]">
                Приём проектов открыт
              </span>
            </div>

            <h1 className="text-[40px] sm:text-[52px] font-bold tracking-tight text-[#111B17] leading-[1.1]">
              Сохраняем воду{' '}
              <span className="text-[#1D9E75]">вместе</span>
            </h1>

            <p className="mt-5 text-[17px] text-[#5A7A6E] max-w-xl leading-relaxed">
              Республиканский конкурс водных проектов школьников Казахстана.
              55+ школ, 14 областей. Покажи свой проект по водосбережению!
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/submit">
                <Button size="lg">Отправить проект</Button>
              </Link>
              <Link href="/projects">
                <Button variant="secondary" size="lg">
                  Смотреть проекты
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-6 text-[13px] text-[#5A7A6E]">
              <div className="flex items-center gap-1.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Поддержка ЮНИСЕФ
              </div>
              <div className="flex items-center gap-1.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Программа &quot;Адал азамат&quot;
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
