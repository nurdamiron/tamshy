'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle01Icon } from '@hugeicons/core-free-icons';
import BrandLogo from '@/components/brand/BrandLogo';

function FloatingParticle({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        background: 'rgba(255,255,255,0.06)',
      }}
      animate={{
        y: [0, -30, 10, -20, 0],
        x: [0, 15, -10, 8, 0],
        opacity: [0.3, 0.6, 0.4, 0.7, 0.3],
      }}
      transition={{
        duration: 10 + delay * 3,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

function FloatingShape({ delay, x, y, rotation }: { delay: number; x: string; y: string; rotation: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none rounded-xl"
      style={{
        left: x,
        top: y,
        width: 60 + delay * 20,
        height: 30 + delay * 10,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
      animate={{
        rotate: [rotation, rotation + 30, rotation],
        y: [0, -15, 0],
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

const wordVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.3 + i * 0.05, duration: 0.4 },
  }),
};

export default function CTABanner() {
  const t = useTranslations('cta');
  const headingWords = t('title').split(' ');

  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="relative overflow-hidden rounded-3xl"
          style={{
            background: 'linear-gradient(135deg, #0369A1 0%, #0284C7 35%, #38BDF8 65%, #0EA5E9 100%)',
            backgroundSize: '200% 200%',
          }}
        >
          {/* Mesh gradient overlays */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.3),transparent_70%)] -translate-y-1/3 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(3,105,161,0.4),transparent_70%)] translate-y-1/3 -translate-x-1/4" />
            <div className="absolute top-1/2 left-1/2 w-[250px] h-[250px] rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.2),transparent_70%)] -translate-x-1/2 -translate-y-1/2" />
          </div>

          {/* Floating particles */}
          <FloatingParticle delay={0} x="5%" y="20%" size={8} />
          <FloatingParticle delay={1} x="15%" y="60%" size={6} />
          <FloatingParticle delay={2} x="30%" y="15%" size={10} />
          <FloatingParticle delay={0.5} x="50%" y="70%" size={7} />
          <FloatingParticle delay={1.5} x="65%" y="25%" size={9} />
          <FloatingParticle delay={3} x="80%" y="55%" size={5} />
          <FloatingParticle delay={2.5} x="90%" y="30%" size={8} />
          <FloatingParticle delay={0.8} x="40%" y="45%" size={6} />
          <FloatingParticle delay={1.8} x="75%" y="10%" size={7} />
          <FloatingParticle delay={3.5} x="20%" y="80%" size={9} />

          {/* Floating shapes */}
          <FloatingShape delay={0} x="8%" y="15%" rotation={-15} />
          <FloatingShape delay={1.5} x="78%" y="60%" rotation={25} />
          <FloatingShape delay={2.5} x="55%" y="8%" rotation={-30} />

          {/* Decorative mascot */}
          <motion.div
            className="absolute right-[8%] top-[12%] w-24 h-24 opacity-[0.12]"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <BrandLogo size={96} className="w-full h-full" />
          </motion.div>

          <div className="relative px-8 sm:px-14 py-16 sm:py-20 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
              className="w-16 h-16 rounded-2xl bg-white/12 flex items-center justify-center mx-auto mb-8 backdrop-blur-sm border border-white/10 p-1.5"
            >
              <BrandLogo size={56} className="w-full h-full" />
            </motion.div>

            {/* Split-text heading */}
            <h2 className="text-[28px] sm:text-[40px] font-bold text-white leading-tight">
              {headingWords.map((word, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={wordVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="inline-block mr-[0.3em]"
                >
                  {word}
                </motion.span>
              ))}
            </h2>

            <motion.p
              className="text-[16px] text-white/60 mt-5 max-w-lg mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              {t('subtitle')}
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col sm:flex-row gap-3 justify-center"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <Link href="/submit">
                <motion.button
                  className="h-[54px] px-10 rounded-xl bg-white text-[#0369A1] font-bold text-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.1)] cursor-pointer"
                  whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t('submitProject')}
                </motion.button>
              </Link>
              <Link href="/projects">
                <motion.button
                  className="h-[54px] px-10 rounded-xl bg-white/10 text-white font-semibold text-[16px] border border-white/20 backdrop-blur-sm cursor-pointer"
                  whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.2)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t('viewExamples')}
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              className="mt-10 flex flex-wrap justify-center gap-6 text-[13px] text-white/40"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
            >
              {[t('free'), t('grades'), t('prizes')].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} size={14} className="text-white/50" />
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
