'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { HugeiconsIcon } from '@hugeicons/react';
import { Building01Icon, DropletIcon, Globe02Icon, Location01Icon, StarIcon, CodeIcon } from '@hugeicons/core-free-icons';

const partners = [
  { short: 'Минводресурсов', icon: Building01Icon },
  { short: 'ИАЦ Водных ресурсов', icon: DropletIcon },
  { short: 'UNICEF', icon: Globe02Icon },
  { short: 'AFD France', icon: Location01Icon },
  { short: 'Адал азамат', icon: StarIcon },
  { short: 'alashed.kz', icon: CodeIcon },
];

// Duplicate for seamless loop
const marqueeItems = [...partners, ...partners];

export default function Partners() {
  const t = useTranslations('partners');
  return (
    <section className="py-24 bg-[#F8FAFC] overflow-hidden">
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
      </div>

      {/* Marquee */}
      <div className="group relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#F8FAFC] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#F8FAFC] to-transparent z-10 pointer-events-none" />

        <div className="flex group-hover:[animation-play-state:paused]">
          <div className="flex gap-6 animate-marquee group-hover:[animation-play-state:paused]">
            {marqueeItems.map((partner, i) => (
              <div
                key={`${partner.short}-${i}`}
                className="flex-shrink-0 w-[200px]"
              >
                <motion.div
                  className="bg-white rounded-2xl border border-[#E2E8F0]/60 p-6 h-full flex flex-col items-center text-center transition-all duration-300 hover:border-[#93C5FD] hover:shadow-[0_8px_24px_rgba(2,132,199,0.08)]"
                  whileHover={{ y: -4 }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#E0F2FE] flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-100 hover:!scale-110">
                    <HugeiconsIcon icon={partner.icon} size={26} className="text-[#0284C7] opacity-60 hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-[14px] font-semibold text-[#0F172A] leading-tight">
                    {partner.short}
                  </p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
