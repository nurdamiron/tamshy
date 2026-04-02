'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { Building01Icon, Globe02Icon, StarIcon } from '@hugeicons/core-free-icons';


function WaterDrop({ delay, x, size }: { delay: number; x: string; size: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: -20 }}
      initial={{ y: -20, opacity: 0 }}
      animate={{
        y: ['0%', '120vh'],
        opacity: [0, 0.6, 0.6, 0],
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <svg width={size} height={size * 1.4} viewBox="0 0 20 28" fill="none">
        <path
          d="M10 0C10 0 0 12 0 18a10 10 0 0020 0C20 12 10 0 10 0z"
          fill="#0284C7"
          fillOpacity="0.07"
        />
      </svg>
    </motion.div>
  );
}

function WaveDecoration() {
  return (
    <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
      <motion.svg
        viewBox="0 0 1440 120"
        className="w-full h-[60px] sm:h-[80px] lg:h-[100px]"
        preserveAspectRatio="none"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <motion.path
          d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z"
          fill="#F8FAFC"
          animate={{
            d: [
              'M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z',
              'M0,60 C240,20 480,100 720,60 C960,20 1200,100 1440,60 L1440,120 L0,120 Z',
              'M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.path
          d="M0,80 C360,110 720,50 1080,80 C1260,95 1380,70 1440,80 L1440,120 L0,120 Z"
          fill="#F8FAFC"
          fillOpacity="0.6"
          animate={{
            d: [
              'M0,80 C360,110 720,50 1080,80 C1260,95 1380,70 1440,80 L1440,120 L0,120 Z',
              'M0,80 C360,50 720,110 1080,80 C1260,65 1380,95 1440,80 L1440,120 L0,120 Z',
              'M0,80 C360,110 720,50 1080,80 C1260,95 1380,70 1440,80 L1440,120 L0,120 Z',
            ],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.svg>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[600px] sm:min-h-[700px] flex items-center"
      style={{
        background: 'linear-gradient(135deg, #0369A1 0%, #0284C7 30%, #38BDF8 60%, #E0F2FE 100%)',
      }}
    >
      {/* Animated falling water drops */}
      <WaterDrop delay={0} x="10%" size={16} />
      <WaterDrop delay={1.5} x="25%" size={12} />
      <WaterDrop delay={3} x="45%" size={20} />
      <WaterDrop delay={0.8} x="60%" size={14} />
      <WaterDrop delay={2.2} x="75%" size={18} />
      <WaterDrop delay={4} x="88%" size={10} />
      <WaterDrop delay={1} x="35%" size={22} />
      <WaterDrop delay={3.5} x="52%" size={11} />

      {/* Decorative circles */}
      <div className="absolute top-20 right-[10%] w-[300px] h-[300px] rounded-full bg-white/5 blur-xl" />
      <div className="absolute bottom-40 left-[5%] w-[200px] h-[200px] rounded-full bg-white/5 blur-xl" />

      {/* Large water drop illustration - right side */}
      <motion.div
        className="absolute right-[-5%] top-[10%] hidden lg:block"
        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
      >
        <svg width="400" height="560" viewBox="0 0 200 280" fill="none" className="opacity-[0.08]">
          <path
            d="M100 0C100 0 0 120 0 180a100 100 0 00200 0C200 120 100 0 100 0z"
            fill="white"
          />
        </svg>
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full py-20 sm:py-24 lg:py-32">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Status badge */}
            <motion.div
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-full px-4 py-2 mb-8 border border-white/20"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F5A623] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F5A623]" />
              </span>
              <span className="text-[13px] font-medium text-white/90">
                Прием проектов открыт до 30 мая 2026
              </span>
            </motion.div>

            {/* Kazakh title */}
            <motion.p
              className="text-[14px] sm:text-[16px] text-white/60 font-medium mb-2 tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Суды бірге сақтаймыз
            </motion.p>

            <h1 className="text-[44px] sm:text-[56px] lg:text-[64px] font-bold text-white leading-[1.05] tracking-tight">
              Сохраняем{' '}
              <span className="relative">
                воду
                <motion.svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                >
                  <motion.path
                    d="M0,8 Q50,0 100,8 Q150,16 200,8"
                    stroke="#F5A623"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                  />
                </motion.svg>
              </span>
              <br />
              вместе
            </h1>

            <motion.p
              className="mt-6 text-[17px] sm:text-[19px] text-white/75 max-w-lg leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Республиканский конкурс водных проектов школьников Казахстана.
              Покажи свой проект по водосбережению всей стране.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              className="mt-10 flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link href="/submit">
                <button className="h-[52px] px-8 rounded-xl bg-white text-[#0369A1] font-semibold text-[16px] hover:bg-white/90 transition-all shadow-lg shadow-black/10 flex items-center gap-2 cursor-pointer">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Отправить проект
                </button>
              </Link>
              <Link href="/projects">
                <button className="h-[52px] px-8 rounded-xl bg-white/10 text-white font-semibold text-[16px] hover:bg-white/20 transition-all border border-white/20 backdrop-blur-sm flex items-center gap-2 cursor-pointer">
                  Смотреть проекты
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {[
                { label: 'Минводресурсов РК', icon: Building01Icon },
                { label: 'ЮНИСЕФ', icon: Globe02Icon },
                { label: 'Программа «Адал азамат»', icon: StarIcon },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <HugeiconsIcon icon={item.icon} size={16} className="text-white/50" />
                  <span className="text-[13px] text-white/50 font-medium">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Floating stats - right side on desktop */}
        <motion.div
          className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <div className="space-y-4">
            {[
              { value: '55+', label: 'школ', delay: 0 },
              { value: '14', label: 'областей', delay: 0.1 },
              { value: '500+', label: 'проектов', delay: 0.2 },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-6 py-4 w-[160px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + stat.delay }}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
              >
                <div className="text-[28px] font-bold text-white">{stat.value}</div>
                <div className="text-[13px] text-white/50">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <WaveDecoration />
    </section>
  );
}
