'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle01Icon } from '@hugeicons/core-free-icons';

export default function CTABanner() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring' as const, stiffness: 200, damping: 20 }}
          className="relative overflow-hidden rounded-3xl"
          style={{
            background: 'linear-gradient(135deg, #0369A1, #0284C7 50%, #38BDF8)',
          }}
        >
          <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] rounded-full bg-white/5 translate-y-1/2 -translate-x-1/3" />

          <motion.div
            className="absolute right-[10%] top-[15%] opacity-10"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg width="80" height="112" viewBox="0 0 20 28" fill="white">
              <path d="M10 0C10 0 0 12 0 18a10 10 0 0020 0C20 12 10 0 10 0z" />
            </svg>
          </motion.div>

          <div className="relative px-8 sm:px-14 py-14 sm:py-16 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: 'spring' as const, stiffness: 300 }}
              className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C12 2 5 10 5 15a7 7 0 0014 0c0-5-7-13-7-13z" fill="white" fillOpacity="0.9" />
              </svg>
            </motion.div>

            <motion.h2
              className="text-[28px] sm:text-[36px] font-bold text-white leading-tight"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Готов показать свой проект<br className="hidden sm:block" /> всей стране?
            </motion.h2>

            <motion.p
              className="text-[16px] text-white/70 mt-4 max-w-lg mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Присоединяйся к сотням школьников, которые уже меняют будущее водных ресурсов Казахстана.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <Link href="/submit">
                <motion.button
                  className="h-[52px] px-10 rounded-xl bg-white text-[#0369A1] font-bold text-[16px] shadow-lg shadow-black/10 cursor-pointer"
                  whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.95)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  Отправить проект
                </motion.button>
              </Link>
              <Link href="/projects">
                <motion.button
                  className="h-[52px] px-10 rounded-xl bg-white/10 text-white font-semibold text-[16px] border border-white/20 cursor-pointer"
                  whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.2)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  Посмотреть примеры
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              className="mt-8 flex flex-wrap justify-center gap-6 text-[13px] text-white/40"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              {['Бесплатно', '1-11 классы', 'Призы и грамоты'].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} size={14} className="text-white/40" />
                  {item}
                </span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
