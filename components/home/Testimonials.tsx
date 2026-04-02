'use client';

import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Айгерим К.',
    role: 'Ученица 10 класса, НИШ Астана',
    text: 'Благодаря Тамшы мой проект по очистке дождевой воды увидели тысячи людей. Я даже не думала, что школьница может повлиять на водную политику!',
    region: 'Астана',
    avatarColor: '#0284C7',
    initial: 'А',
  },
  {
    name: 'Дамир С.',
    role: 'Ученик 9 класса, школа No12 Актау',
    text: 'Наша команда сняла документальный фильм о проблемах Каспия. Получили 200+ голосов и приглашение на конференцию по экологии.',
    region: 'Актау',
    avatarColor: '#38BDF8',
    initial: 'Д',
  },
  {
    name: 'Мадина Т.',
    role: 'Учитель биологии, школа No5 Кызылорда',
    text: 'Тамшы вдохновил моих учеников. Трое из них создали макет системы капельного полива для школьного сада. Проект работает!',
    region: 'Кызылорда',
    avatarColor: '#F59E0B',
    initial: 'М',
  },
  {
    name: 'Арман Б.',
    role: 'Ученик 11 класса, лицей Алматы',
    text: 'Я разработал приложение для мониторинга расхода воды в школе. Стал победителем конкурса и получил грант на развитие проекта.',
    region: 'Алматы',
    avatarColor: '#0369A1',
    initial: 'А',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
  },
};

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-caption text-[#0284C7] tracking-widest">ОТЗЫВЫ</span>
          <h2 className="text-[28px] sm:text-[32px] font-bold text-[#0F172A] mt-3">
            Что говорят участники
          </h2>
          <p className="text-[15px] text-[#64748B] mt-2 max-w-lg mx-auto">
            Реальные истории школьников и учителей
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {testimonials.map((t) => (
            <motion.div key={t.name} variants={cardVariants}>
              <motion.div
                className="bg-[#F8FAFC] rounded-2xl p-6 h-full border border-[#E2E8F0]/60"
                whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}
                transition={{ type: 'spring' as const, stiffness: 400, damping: 25 }}
              >
                <div className="relative">
                  <svg className="absolute -top-1 -left-1 opacity-[0.07]" width="32" height="32" viewBox="0 0 24 24" fill="#0284C7">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-[15px] text-[#0F172A] leading-relaxed pl-4">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-5 pt-5 border-t border-[#E2E8F0]/60">
                  <motion.div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[14px] font-bold shrink-0"
                    style={{ backgroundColor: t.avatarColor }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {t.initial}
                  </motion.div>
                  <div className="min-w-0">
                    <div className="text-[14px] font-semibold text-[#0F172A]">{t.name}</div>
                    <div className="text-[12px] text-[#64748B] truncate">{t.role}</div>
                  </div>
                  <div className="ml-auto shrink-0">
                    <span className="text-[11px] bg-[#E0F2FE] text-[#0284C7] px-2.5 py-1 rounded-full font-medium">
                      {t.region}
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
