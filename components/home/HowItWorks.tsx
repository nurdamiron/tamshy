'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    num: '01',
    title: 'Зарегистрируйся',
    desc: 'Введите номер телефона и получите код по SMS. Регистрация занимает 30 секунд.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="1.8">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <line x1="12" y1="18" x2="12" y2="18" strokeWidth="2" strokeLinecap="round" />
        <path d="M9 6h6" />
      </svg>
    ),
    gradient: 'from-emerald-500/10 to-teal-500/10',
  },
  {
    num: '02',
    title: 'Загрузи проект',
    desc: 'Расскажи о своём проекте по водосбережению: видео, исследование, арт или изобретение.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="1.8">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
    gradient: 'from-blue-500/10 to-cyan-500/10',
  },
  {
    num: '03',
    title: 'Получи голоса',
    desc: 'Другие участники и зрители голосуют за лучшие проекты. Набери больше всех голосов!',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="1.8">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
    gradient: 'from-pink-500/10 to-rose-500/10',
  },
  {
    num: '04',
    title: 'Стань победителем',
    desc: 'Жюри из экспертов ИАЦ водных ресурсов оценивает лучшие проекты. Призы и грамоты!',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="1.8">
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ),
    gradient: 'from-amber-500/10 to-yellow-500/10',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-[#F8FAF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-caption text-[#1D9E75] tracking-widest">КАК ЭТО РАБОТАЕТ</span>
          <h2 className="text-[28px] sm:text-[32px] font-bold text-[#111B17] mt-3">
            Четыре шага к победе
          </h2>
          <p className="text-[15px] text-[#5A7A6E] mt-2 max-w-lg mx-auto">
            От идеи до награды — простой путь для каждого школьника
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
            >
              <div className="relative group">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[calc(100%+4px)] w-[calc(100%-40px)] h-[2px]">
                    <div className="w-full h-full bg-gradient-to-r from-[#E2EDE9] to-[#E2EDE9]/0" />
                  </div>
                )}

                <div className={`bg-gradient-to-br ${step.gradient} rounded-2xl p-6 h-full border border-white transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                      {step.icon}
                    </div>
                    <span className="text-[32px] font-bold text-[#E2EDE9]">{step.num}</span>
                  </div>
                  <h3 className="text-[17px] font-semibold text-[#111B17] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[14px] text-[#5A7A6E] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
