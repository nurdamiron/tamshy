'use client';

import { motion } from 'framer-motion';
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

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 20 },
  },
};

export default function Partners() {
  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-caption text-[#0284C7] tracking-widest">ПАРТНЁРЫ</span>
          <h2 className="text-[28px] sm:text-[32px] font-bold text-[#0F172A] mt-3">
            При поддержке
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {partners.map((partner) => (
            <motion.div key={partner.short} variants={itemVariants} className="group">
              <motion.div
                className="bg-white rounded-xl border border-[#E2E8F0] p-5 h-full flex flex-col items-center text-center"
                whileHover={{ y: -4, borderColor: '#93C5FD', boxShadow: '0 8px 24px rgba(2,132,199,0.08)' }}
                transition={{ type: 'spring' as const, stiffness: 400, damping: 25 }}
              >
                <motion.div
                  className="w-12 h-12 rounded-xl bg-[#E0F2FE] flex items-center justify-center mb-3"
                  whileHover={{ rotate: [0, -5, 5, 0], scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <HugeiconsIcon icon={partner.icon} size={24} className="text-[#0284C7]" />
                </motion.div>
                <p className="text-[13px] font-semibold text-[#0F172A] leading-tight">
                  {partner.short}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
