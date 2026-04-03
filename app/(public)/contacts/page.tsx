'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { Location01Icon, SmartPhone01Icon, File01Icon } from '@hugeicons/core-free-icons';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const topicOptions = [
  { value: 'general', label: 'Общий вопрос' },
  { value: 'cooperation', label: 'Сотрудничество' },
  { value: 'support', label: 'Техническая поддержка' },
  { value: 'suggestion', label: 'Предложение' },
];

export default function ContactsPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSubmit = name.trim() && email.trim() && message.trim() && consent;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    // Simulate submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setName('');
      setEmail('');
      setTopic('');
      setMessage('');
      setFile(null);
      setConsent(false);
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 1200);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero header */}
      <section className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-[12px] font-semibold text-[#3B82F6] tracking-widest uppercase">
              Свяжитесь с нами
            </span>
            <h1 className="text-[32px] sm:text-[40px] font-bold text-[#0F172A] mt-2">
              Контакты
            </h1>
            <p className="text-[15px] sm:text-[16px] text-[#64748B] mt-3 max-w-xl">
              Мы всегда рады помочь. Свяжитесь с нами любым удобным способом или заполните форму обратной связи.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
          {/* Left column — contact info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address */}
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex items-start gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={Location01Icon} size={20} color="#3B82F6" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#64748B] tracking-widest uppercase mb-1">
                  Адрес офиса
                </p>
                <p className="text-[15px] text-[#0F172A] leading-relaxed">
                  ул. Айтеке би, 12, офис 305,<br />
                  г. Кызылорда, Казахстан, 120000
                </p>
              </div>
            </motion.div>

            {/* Phone */}
            <motion.div
              custom={1}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex items-start gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={SmartPhone01Icon} size={20} color="#3B82F6" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#64748B] tracking-widest uppercase mb-1">
                  Телефон
                </p>
                <a
                  href="tel:+77242555555"
                  className="text-[15px] text-[#0F172A] hover:text-[#3B82F6] transition-colors"
                >
                  +7 (7242) 55-55-55
                </a>
                <p className="text-[13px] text-[#64748B] mt-0.5">Пн-Пт, 09:00 - 18:00</p>
              </div>
            </motion.div>

            {/* Email */}
            <motion.div
              custom={2}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex items-start gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center shrink-0">
                {/* Mail icon inline SVG — no HugeIcon for mail in free pack */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <polyline points="22,4 12,13 2,4" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#64748B] tracking-widest uppercase mb-1">
                  Электронная почта
                </p>
                <a
                  href="mailto:info@tamshy.kz"
                  className="text-[15px] text-[#0F172A] hover:text-[#3B82F6] transition-colors"
                >
                  info@tamshy.kz
                </a>
                <p className="text-[13px] text-[#64748B] mt-0.5">Для общих вопросов</p>
              </div>
            </motion.div>

            {/* Divider */}
            <div className="h-px bg-[#E2E8F0]" />

            {/* Social links */}
            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="text-[11px] font-semibold text-[#64748B] tracking-widest uppercase mb-3">
                Мы в социальных сетях
              </p>
              <div className="flex gap-2.5">
                {[
                  {
                    name: 'Instagram',
                    href: 'https://www.instagram.com/tamshy__kz',
                    hoverBg: '#E1306C',
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="2" width="20" height="20" rx="5" />
                        <circle cx="12" cy="12" r="5" />
                        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                      </svg>
                    ),
                  },
                  {
                    name: 'YouTube',
                    href: '#',
                    hoverBg: '#FF0000',
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23 9.71a8.5 8.5 0 00-.91-4.13 2.92 2.92 0 00-1.72-1A78.4 78.4 0 0012 4.27a78.5 78.5 0 00-8.34.3 2.87 2.87 0 00-1.46.74c-.9.83-1 2.25-1.1 3.45a48.3 48.3 0 000 6.48 9.9 9.9 0 00.54 2.59 2.71 2.71 0 001.3 1.4 6.4 6.4 0 002.73.45c2.54.06 10.43.13 14.3-.06a3 3 0 001.48-.64c.86-.78 1-2.2 1.12-3.46a42.6 42.6 0 00.03-5.81zM9.68 15.67V8.33l6.23 3.67-6.23 3.67z" />
                      </svg>
                    ),
                  },
                  {
                    name: 'Telegram',
                    href: '#',
                    hoverBg: '#2AABEE',
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                      </svg>
                    ),
                  },
                ].map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] transition-colors"
                    whileHover={{
                      backgroundColor: social.hoverBg + '15',
                      color: social.hoverBg,
                      borderColor: social.hoverBg + '40',
                      scale: 1.05,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Map placeholder */}
            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] overflow-hidden mt-2"
            >
              <div className="relative h-[220px] flex items-center justify-center">
                {/* Grid pattern background */}
                <div
                  className="absolute inset-0 opacity-[0.4]"
                  style={{
                    backgroundImage:
                      'linear-gradient(#E2E8F0 1px, transparent 1px), linear-gradient(90deg, #E2E8F0 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />
                {/* Pin marker */}
                <div className="relative flex flex-col items-center">
                  <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-[#E2E8F0] px-4 py-2.5 mb-2">
                    <p className="text-[13px] font-semibold text-[#0F172A]">Офис Tamshy.kz</p>
                    <p className="text-[11px] text-[#64748B]">г. Кызылорда</p>
                  </div>
                  {/* Pin stem + dot */}
                  <div className="flex flex-col items-center">
                    <div className="w-[2px] h-3 bg-[#3B82F6]" />
                    <div className="w-3 h-3 rounded-full bg-[#3B82F6] shadow-[0_0_0_4px_rgba(59,130,246,0.2)]" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right column — contact form */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-2xl border border-[#E2E8F0]/60 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)] p-6 sm:p-8"
            >
              <h2 className="text-[22px] sm:text-[26px] font-bold text-[#0F172A]">
                Напишите нам
              </h2>
              <p className="text-[14px] sm:text-[15px] text-[#64748B] mt-2 mb-8">
                Заполните форму ниже и мы свяжемся с вами в течение одного рабочего дня. Все поля, отмеченные звёздочкой, обязательны.
              </p>

              {/* Success message */}
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-start gap-3"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" className="shrink-0 mt-0.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <div>
                    <p className="text-[14px] font-semibold text-green-800">Сообщение отправлено!</p>
                    <p className="text-[13px] text-green-700 mt-0.5">
                      Спасибо за обращение. Мы ответим вам в ближайшее время.
                    </p>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name + Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="ВАШЕ ИМЯ *"
                    placeholder="Алмас Серикулы"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <Input
                    label="EMAIL АДРЕС *"
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Topic select */}
                <Select
                  label="ТЕМА СООБЩЕНИЯ"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  options={topicOptions}
                  placeholder="Выберите тему"
                />

                {/* Message textarea */}
                <Textarea
                  label="СООБЩЕНИЕ *"
                  placeholder="Опишите ваш вопрос или предложение..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  showCount
                  maxLength={2000}
                  required
                />

                {/* File upload */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-[#0F172A]">
                    ПРИКРЕПИТЬ ФАЙЛ
                  </label>
                  <div
                    className={`
                      h-[44px] px-3 rounded-lg border text-[15px] bg-white
                      flex items-center gap-3 cursor-pointer
                      transition-colors duration-200
                      hover:border-[#3B82F6]/40
                      ${file ? 'border-[#3B82F6] bg-[#3B82F6]/5' : 'border-[#E2E8F0]'}
                    `}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <HugeiconsIcon icon={File01Icon} size={18} color={file ? '#3B82F6' : '#64748B'} />
                    <span className={`text-[14px] truncate ${file ? 'text-[#0F172A]' : 'text-[#64748B]/50'}`}>
                      {file ? file.name : 'Выберите файл'}
                    </span>
                    {file && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="ml-auto text-[12px] text-red-500 hover:underline shrink-0"
                      >
                        Удалить
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => {
                        const selected = e.target.files?.[0];
                        if (selected) {
                          if (selected.size > 10 * 1024 * 1024) {
                            alert('Файл слишком большой. Максимальный размер — 10 МБ.');
                            return;
                          }
                          setFile(selected);
                        }
                      }}
                    />
                  </div>
                  <p className="text-[12px] text-[#64748B]">
                    Макс. 10 МБ (PDF, DOCX, JPG)
                  </p>
                </div>

                {/* Consent checkbox */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="
                      mt-0.5 w-[18px] h-[18px] rounded border-[#E2E8F0]
                      text-[#3B82F6] focus:ring-[#3B82F6]/20
                      cursor-pointer shrink-0
                    "
                  />
                  <span className="text-[13px] text-[#64748B] leading-relaxed group-hover:text-[#0F172A] transition-colors">
                    Я даю согласие на обработку персональных данных в соответствии с{' '}
                    <span className="text-[#3B82F6] hover:underline">политикой конфиденциальности</span>
                  </span>
                </label>

                {/* Submit */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    loading={loading}
                    disabled={!canSubmit}
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    Отправить сообщение
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
