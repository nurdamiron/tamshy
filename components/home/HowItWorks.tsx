'use client';

import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { SmartPhone01Icon, Upload01Icon, HeartCheckIcon, Medal01Icon } from '@hugeicons/core-free-icons';

const steps = [
  {
    num: '01',
    title: 'Зарегистрируйся',
    desc: 'Введи номер телефона и получи код по SMS. Регистрация занимает 30 секунд.',
    icon: SmartPhone01Icon,
    color: '#0284C7',
  },
  {
    num: '02',
    title: 'Загрузи проект',
    desc: 'Расскажи о своём проекте по водосбережению: видео, исследование, арт или изобретение.',
    icon: Upload01Icon,
    color: '#3B82F6',
  },
  {
    num: '03',
    title: 'Получи голоса',
    desc: 'Другие участники и зрители голосуют за лучшие проекты. Набери больше всех!',
    icon: HeartCheckIcon,
    color: '#EC4899',
  },
  {
    num: '04',
    title: 'Стань победителем',
    desc: 'Жюри из экспертов ИАЦ водных ресурсов оценивает лучшие проекты. Призы и грамоты!',
    icon: Medal01Icon,
    color: '#F5A623',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-caption text-[#0284C7] tracking-widest">КАК ЭТО РАБОТАЕТ</span>
          <h2 className="text-[28px] sm:text-[32px] font-bold text-[#0F172A] mt-3">
            Четыре шага к победе
          </h2>
          <p className="text-[15px] text-[#64748B] mt-2 max-w-lg mx-auto">
            От идеи до награды -- простой путь для каждого школьника
          </p>
        </motion.div>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {/* Connector line -- desktop only */}
          <div className="hidden lg:block absolute top-[52px] left-[12.5%] right-[12.5%] h-[2px] bg-[#E2E8F0]" />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="relative text-center"
            >
              {/* Number circle */}
              <div className="relative z-10 mx-auto mb-5">
                <div
                  className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center mx-auto shadow-sm"
                  style={{ backgroundColor: step.color + '12' }}
                >
                  <HugeiconsIcon icon={step.icon} size={28} style={{ color: step.color }} />
                </div>
                <div
                  className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white shadow-sm border border-[#E2E8F0] flex items-center justify-center text-[11px] font-bold"
                  style={{ color: step.color }}
                >
                  {step.num}
                </div>
              </div>

              <h3 className="text-[17px] font-semibold text-[#0F172A] mb-2">
                {step.title}
              </h3>
              <p className="text-[14px] text-[#64748B] leading-relaxed max-w-[240px] mx-auto">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
