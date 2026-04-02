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
          <p className="text-[15px] text-[#64748B] mt-2 max-w-lg mx-auto">
            Государственные и международные организации
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {partners.map((partner, i) => (
            <motion.div
              key={partner.short}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="group"
            >
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 h-full flex flex-col items-center text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-[#0284C7]/30">
                <div className="w-12 h-12 rounded-xl bg-[#E0F2FE] flex items-center justify-center mb-3 transition-colors group-hover:bg-[#0284C7]/15">
                  <HugeiconsIcon icon={partner.icon} size={24} className="text-[#0284C7]" />
                </div>
                <p className="text-[13px] font-semibold text-[#0F172A] leading-tight">
                  {partner.short}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
