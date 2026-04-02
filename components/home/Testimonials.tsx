'use client';

import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';

const testimonials = [
  {
    name: 'Айгерим К.',
    role: 'Ученица 10 класса, НИШ Астана',
    text: 'Благодаря Тамшы мой проект по очистке дождевой воды увидели тысячи людей. Я даже не думала, что школьница может повлиять на водную политику!',
    region: 'Астана',
    avatar: '#1D9E75',
    initial: 'А',
  },
  {
    name: 'Дамир С.',
    role: 'Ученик 9 класса, школа №12 Актау',
    text: 'Наша команда сняла документальный фильм о проблемах Каспия. Получили 200+ голосов и приглашение на конференцию по экологии.',
    region: 'Актау',
    avatar: '#2BBFA0',
    initial: 'Д',
  },
  {
    name: 'Мадина Т.',
    role: 'Учитель биологии, школа №5 Кызылорда',
    text: 'Тамшы вдохновил моих учеников. Трое из них создали макет системы капельного полива для школьного сада. Проект работает!',
    region: 'Кызылорда',
    avatar: '#F5A623',
    initial: 'М',
  },
  {
    name: 'Арман Б.',
    role: 'Ученик 11 класса, лицей Алматы',
    text: 'Я разработал приложение для мониторинга расхода воды в школе. Стал победителем конкурса и получил грант на развитие проекта.',
    region: 'Алматы',
    avatar: '#0F6E56',
    initial: 'А',
  },
];

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
          <span className="text-caption text-[#1D9E75] tracking-widest">ОТЗЫВЫ УЧАСТНИКОВ</span>
          <h2 className="text-[28px] sm:text-[32px] font-bold text-[#111B17] mt-3">
            Что говорят наши участники
          </h2>
          <p className="text-[15px] text-[#5A7A6E] mt-2 max-w-lg mx-auto">
            Реальные истории школьников и учителей из разных регионов
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card hover padding="none" className="h-full">
                <div className="p-6">
                  {/* Quote */}
                  <div className="relative">
                    <svg className="absolute -top-1 -left-1 opacity-10" width="32" height="32" viewBox="0 0 24 24" fill="#1D9E75">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <p className="text-[15px] text-[#111B17] leading-relaxed pl-4 italic">
                      &ldquo;{t.text}&rdquo;
                    </p>
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3 mt-5 pt-5 border-t border-[#E2EDE9]">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[14px] font-bold"
                      style={{ backgroundColor: t.avatar }}
                    >
                      {t.initial}
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold text-[#111B17]">{t.name}</div>
                      <div className="text-[12px] text-[#5A7A6E]">{t.role}</div>
                    </div>
                    <div className="ml-auto">
                      <span className="text-[11px] bg-[#E1F5EE] text-[#1D9E75] px-2.5 py-1 rounded-full font-medium">
                        {t.region}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
