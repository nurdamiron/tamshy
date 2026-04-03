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
        opacity: [0, 0.5, 0.5, 0],
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
          fill="white"
          fillOpacity="0.12"
        />
      </svg>
    </motion.div>
  );
}

function FloatingCircle({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
      }}
      animate={{
        y: [0, -20, 10, -15, 0],
        x: [0, 10, -5, 8, 0],
        scale: [1, 1.1, 0.95, 1.05, 1],
      }}
      transition={{
        duration: 12 + delay * 2,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
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

const wordVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { delay: 0.3 + i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const trustBadgeVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.9 + i * 0.1, duration: 0.5 },
  }),
};

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden min-h-[620px] sm:min-h-[720px] flex items-center"
      style={{
        background: 'linear-gradient(135deg, #0369A1 0%, #0284C7 30%, #38BDF8 60%, #E0F2FE 100%)',
      }}
    >
      {/* Dot grid background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Floating circles */}
      <FloatingCircle delay={0} x="5%" y="20%" size={200} />
      <FloatingCircle delay={1.5} x="70%" y="10%" size={300} />
      <FloatingCircle delay={3} x="50%" y="60%" size={180} />
      <FloatingCircle delay={2} x="85%" y="45%" size={250} />
      <FloatingCircle delay={0.5} x="25%" y="70%" size={160} />

      {/* Animated falling water drops */}
      <WaterDrop delay={0} x="10%" size={16} />
      <WaterDrop delay={1.5} x="25%" size={12} />
      <WaterDrop delay={3} x="45%" size={20} />
      <WaterDrop delay={0.8} x="60%" size={14} />
      <WaterDrop delay={2.2} x="75%" size={18} />
      <WaterDrop delay={4} x="88%" size={10} />
      <WaterDrop delay={1} x="35%" size={22} />
      <WaterDrop delay={3.5} x="52%" size={11} />

      {/* Large water drop illustration - right side */}
      <motion.div
        className="absolute right-[-5%] top-[10%] hidden lg:block"
        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
      >
        <svg width="400" height="560" viewBox="0 0 200 280" fill="none" className="opacity-[0.06]">
          <path
            d="M100 0C100 0 0 120 0 180a100 100 0 00200 0C200 120 100 0 100 0z"
            fill="white"
          />
        </svg>
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full py-20 sm:py-24 lg:py-32">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Status badge */}
            <motion.div
              className="inline-flex items-center gap-2 bg-white/12 backdrop-blur-xl rounded-full px-5 py-2.5 mb-8 border border-white/15"
              initial={{ opacity: 0, x: -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 25 }}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F5A623] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F5A623]" />
              </span>
              <span className="text-[13px] font-medium text-white/90">
                Экологическая инициатива · Казахстан
              </span>
            </motion.div>

            {/* Kazakh title */}
            <motion.p
              className="text-[14px] sm:text-[16px] text-white/50 font-medium mb-3 tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Экологическая инициатива
            </motion.p>

            {/* Main heading with staggered words */}
            <h1 className="text-[40px] sm:text-[52px] lg:text-[64px] font-bold text-white leading-[1.05] tracking-tight">
              {['Экономь', 'воду', '–', 'сохраняй', 'будущее!'].map((word, i) => (
                <motion.span
                  key={word}
                  custom={i}
                  variants={wordVariants}
                  initial="hidden"
                  animate="visible"
                  className="inline-block mr-[0.3em]"
                >
                  {word === '–' ? (
                    <>{word}{' '}<br className="hidden sm:block" /></>
                  ) : word === 'воду' ? (
                    <span className="relative">
                      {word}
                      <motion.svg
                        className="absolute -bottom-2 left-0 w-full"
                        viewBox="0 0 200 12"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ delay: 1, duration: 0.8 }}
                      >
                        <motion.path
                          d="M0,8 Q50,0 100,8 Q150,16 200,8"
                          stroke="#F5A623"
                          strokeWidth="3"
                          fill="none"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ delay: 1, duration: 0.8 }}
                        />
                      </motion.svg>
                    </span>
                  ) : (
                    word
                  )}
                </motion.span>
              ))}
            </h1>

            <motion.p
              className="mt-6 text-[17px] sm:text-[19px] text-white/65 max-w-lg leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              Информационный веб-сайт проекта по формированию культуры
              рационального потребления водных ресурсов в Казахстане.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              className="mt-10 flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Link href="/about">
                <motion.button
                  className="group relative h-[54px] px-8 rounded-xl bg-white text-[#0369A1] font-bold text-[16px] transition-all shadow-lg shadow-black/10 flex items-center gap-2.5 cursor-pointer overflow-hidden"
                  whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0284C7]/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <span className="relative z-10">Узнать больше</span>
                </motion.button>
              </Link>
              <Link href="/contests">
                <motion.button
                  className="h-[54px] px-8 rounded-xl bg-white/10 text-white font-semibold text-[16px] transition-all border border-white/20 backdrop-blur-sm flex items-center gap-2.5 cursor-pointer"
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.2)', scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Принять участие
                  <motion.svg
                    width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </motion.svg>
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3">
              {[
                { label: 'Минводресурсов РК', icon: Building01Icon },
                { label: 'ЮНИСЕФ', icon: Globe02Icon },
                { label: 'Программа «Адал азамат»', icon: StarIcon },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  custom={i}
                  variants={trustBadgeVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center gap-2"
                >
                  <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center">
                    <HugeiconsIcon icon={item.icon} size={14} className="text-white/60" />
                  </div>
                  <span className="text-[13px] text-white/50 font-medium">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <WaveDecoration />
    </section>
  );
}
