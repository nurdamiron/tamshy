'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const faqs = [
  {
    q: 'Кто может участвовать в конкурсе?',
    a: 'Школьники 1-11 классов из любого региона Казахстана. Можно участвовать индивидуально или командой до 3 человек.',
  },
  {
    q: 'Конкурс бесплатный?',
    a: 'Да, участие полностью бесплатное. Регистрация, загрузка проекта и голосование — всё без оплаты.',
  },
  {
    q: 'Какие виды проектов принимаются?',
    a: 'Видео, исследования, арт/плакаты, изобретения и мобильные приложения. Главное — тема водосбережения.',
  },
  {
    q: 'Как происходит голосование?',
    a: 'После модерации проект становится доступен для голосования. Любой зарегистрированный пользователь может проголосовать один раз за каждый проект.',
  },
  {
    q: 'Какие призы получают победители?',
    a: 'Победители получают грамоты, ценные призы, гранты на развитие проекта, а также приглашения на экологические конференции.',
  },
  {
    q: 'Нужен ли научный руководитель?',
    a: 'Научный руководитель не обязателен, но вы можете указать учителя-наставника при загрузке проекта.',
  },
  {
    q: 'Можно ли отправить несколько проектов?',
    a: 'Да, один участник может загрузить до 3 проектов в разных категориях.',
  },
  {
    q: 'До какого числа принимаются проекты?',
    a: 'Приём проектов открыт до 30 мая 2026 года. После этой даты начнётся финальное голосование и оценка жюри.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <span className="text-caption text-[#0284C7] tracking-widest">ВОПРОСЫ</span>
          <h2 className="text-[28px] sm:text-[36px] font-bold text-[#0F172A] mt-3">
            Частые вопросы
          </h2>
          <p className="text-[15px] text-[#64748B] mt-3 max-w-lg mx-auto">
            Ответы на самые популярные вопросы о конкурсе
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <div
                  className={`rounded-2xl border transition-all duration-300 ${
                    isOpen
                      ? 'border-[#0284C7]/20 bg-[#F0F9FF] shadow-[0_4px_16px_rgba(2,132,199,0.06)]'
                      : 'border-[#E2E8F0]/60 bg-white hover:border-[#93C5FD]/40 hover:shadow-sm'
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full text-left px-6 py-5 flex items-center gap-4 cursor-pointer"
                  >
                    {/* Left accent bar */}
                    <div
                      className={`w-1 self-stretch rounded-full transition-colors duration-300 ${
                        isOpen ? 'bg-[#0284C7]' : 'bg-transparent'
                      }`}
                    />

                    <span className={`flex-1 text-[15px] font-semibold transition-colors duration-300 ${
                      isOpen ? 'text-[#0284C7]' : 'text-[#0F172A]'
                    }`}>
                      {faq.q}
                    </span>

                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="shrink-0 w-8 h-8 rounded-full bg-[#F1F5F9] flex items-center justify-center"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isOpen ? '#0284C7' : '#64748B'} strokeWidth="2">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 pl-11">
                          <p className="text-[14px] text-[#64748B] leading-relaxed">
                            {faq.a}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
