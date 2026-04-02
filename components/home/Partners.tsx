'use client';

import { motion } from 'framer-motion';

const partners = [
  {
    name: 'Министерство водных ресурсов и ирригации РК',
    short: 'Минводресурсов',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="1.5">
        <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
        <path d="M9 9h1M14 9h1M9 13h1M14 13h1" />
      </svg>
    ),
  },
  {
    name: 'НАО «Информационно-аналитический центр водных ресурсов»',
    short: 'ИАЦ Водных ресурсов',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="1.5">
        <path d="M12 2C12 2 5 10 5 15a7 7 0 0014 0c0-5-7-13-7-13z" />
        <path d="M12 18v-3M9 15h6" />
      </svg>
    ),
  },
  {
    name: 'ЮНИСЕФ Казахстан',
    short: 'UNICEF',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
  },
  {
    name: 'Французское агентство развития (AFD)',
    short: 'AFD France',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="1.5">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <path d="M12 7v3l2 1" />
      </svg>
    ),
  },
  {
    name: 'Программа «Адал азамат»',
    short: '«Адал азамат»',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="1.5">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    name: 'Разработка: alashed.kz',
    short: 'alashed.kz',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="1.5">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="14" y1="4" x2="10" y2="20" />
      </svg>
    ),
  },
];

export default function Partners() {
  return (
    <section className="py-20 bg-[#F8FAF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-caption text-[#1D9E75] tracking-widest">ПАРТНЁРЫ ПРОЕКТА</span>
          <h2 className="text-[28px] sm:text-[32px] font-bold text-[#111B17] mt-3">
            При поддержке
          </h2>
          <p className="text-[15px] text-[#5A7A6E] mt-2 max-w-lg mx-auto">
            Государственные и международные организации, стоящие за проектом
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {partners.map((partner, i) => (
            <motion.div
              key={partner.short}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group"
            >
              <div className="bg-white rounded-xl border border-[#E2EDE9] p-5 h-full flex flex-col items-center text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-[#1D9E75]/30">
                <div className="w-14 h-14 rounded-xl bg-[#E1F5EE] flex items-center justify-center mb-3 transition-colors group-hover:bg-[#1D9E75]/15">
                  {partner.icon}
                </div>
                <p className="text-[13px] font-semibold text-[#111B17] leading-tight">
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
