'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

const REQUEST_TYPES = [
  { value: 'access', label: 'Доступ к данным' },
  { value: 'correction', label: 'Исправление данных' },
  { value: 'deletion', label: 'Удаление данных' },
  { value: 'revoke', label: 'Отзыв согласия' },
  { value: 'restriction', label: 'Ограничение обработки' },
];

const RIGHTS = [
  {
    icon: '👁️',
    title: 'Право на доступ',
    description:
      'Вы вправе получить подтверждение факта обработки ваших персональных данных, а также перечень обрабатываемых данных, цели их обработки и сведения о третьих лицах, которым они были переданы.',
    deadline: '5 рабочих дней',
    deadlineColor: 'green',
    type: 'access',
  },
  {
    icon: '✏️',
    title: 'Право на исправление',
    description:
      'Если ваши персональные данные являются неточными, неполными или устаревшими, вы вправе потребовать их исправления или дополнения.',
    deadline: '5 рабочих дней',
    deadlineColor: 'green',
    type: 'correction',
  },
  {
    icon: '🗑️',
    title: 'Право на удаление',
    description:
      'Вы вправе потребовать удаления ваших персональных данных в случаях, предусмотренных законодательством: если цель обработки достигнута, согласие отозвано или данные обрабатываются незаконно.',
    deadline: '15 рабочих дней',
    deadlineColor: 'amber',
    type: 'deletion',
  },
  {
    icon: '🚫',
    title: 'Право на ограничение обработки',
    description:
      'Вы вправе потребовать приостановления обработки ваших данных на период рассмотрения ваших возражений или жалобы. Данные не будут удалены, но их использование будет ограничено.',
    deadline: '5 рабочих дней',
    deadlineColor: 'green',
    type: 'restriction',
  },
  {
    icon: '↩️',
    title: 'Право на отзыв согласия',
    description:
      'Вы вправе в любой момент отозвать ранее данное согласие на обработку персональных данных. Отзыв согласия не влияет на законность обработки, осуществлявшейся на основании согласия до его отзыва.',
    deadline: '5 рабочих дней',
    deadlineColor: 'green',
    type: 'revoke',
  },
  {
    icon: '⚖️',
    title: 'Право на обжалование',
    description:
      'Если вы считаете, что ваши права в области защиты персональных данных нарушены, вы вправе обратиться с жалобой в Министерство цифрового развития, инноваций и аэрокосмической промышленности Республики Казахстан.',
    deadline: 'По законодательству РК',
    deadlineColor: 'gray',
    type: null,
  },
];

const deadlineColors: Record<string, string> = {
  green: 'bg-green-100 text-green-800',
  amber: 'bg-amber-100 text-amber-800',
  gray: 'bg-gray-100 text-gray-700',
};

export default function DataRightsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    requestType: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canSubmit =
    formData.name.trim() &&
    formData.email.trim() &&
    formData.requestType &&
    formData.message.trim().length >= 20;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          topic: 'data-rights-request',
          message: `[Тип запроса: ${formData.requestType}] ${formData.phone ? `[Телефон: ${formData.phone}] ` : ''}${formData.message}`,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Ошибка отправки');
      }

      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка при отправке запроса');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0F172A] to-[#1E3A5F] text-white py-16 px-4">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-1.5 mb-6">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="text-[13px] text-blue-300 font-medium">Права субъектов ПД</span>
          </div>
          <h1 className="text-[36px] sm:text-[44px] font-bold mb-4 leading-tight">
            Ваши права на защиту персональных данных
          </h1>
          <p className="text-[16px] text-white/60 max-w-2xl">
            В соответствии с Законом РК «О персональных данных и их защите» № 94-V вы имеете
            ряд прав в отношении ваших данных, обрабатываемых на платформе Tamshy.kz.
          </p>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">

        {/* Rights cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h2 className="text-[22px] font-bold text-[#0F172A] mb-6">
            Ваши права по Закону о ПД РК
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {RIGHTS.map((right, i) => (
              <motion.div
                key={right.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="bg-white border border-[#E2E8F0] rounded-2xl p-5 hover:border-[#BFDBFE] hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{right.icon}</span>
                    <h3 className="text-[15px] font-semibold text-[#0F172A]">{right.title}</h3>
                  </div>
                  <span className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full ${deadlineColors[right.deadlineColor]}`}>
                    {right.deadline}
                  </span>
                </div>
                <p className="text-[13px] text-[#64748B] leading-relaxed">{right.description}</p>
                {right.type && (
                  <button
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, requestType: right.type! }));
                      document.getElementById('request-form')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="mt-3 text-[12px] text-[#2563EB] hover:underline font-medium"
                  >
                    Подать запрос &rarr;
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Deadlines info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="bg-[#F0F9FF] border border-blue-200 rounded-2xl p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#0F172A] mb-3">Сроки ответа на запросы</h3>
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="bg-white rounded-xl p-4 border border-blue-100">
                  <p className="text-[24px] font-bold text-green-600">5</p>
                  <p className="text-[12px] text-[#64748B] mt-0.5">рабочих дней</p>
                  <p className="text-[11px] text-[#94A3B8] mt-1">Доступ к данным, исправление, ограничение, отзыв согласия</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-blue-100">
                  <p className="text-[24px] font-bold text-amber-600">15</p>
                  <p className="text-[12px] text-[#64748B] mt-0.5">рабочих дней</p>
                  <p className="text-[11px] text-[#94A3B8] mt-1">Удаление персональных данных</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-blue-100">
                  <p className="text-[24px] font-bold text-blue-600">30</p>
                  <p className="text-[12px] text-[#64748B] mt-0.5">календарных дней</p>
                  <p className="text-[11px] text-[#94A3B8] mt-1">Максимальный срок для сложных запросов с уведомлением о продлении</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Request form */}
        <motion.div
          id="request-form"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-sm"
        >
          <h2 className="text-[22px] font-bold text-[#0F172A] mb-2">
            Форма подачи запроса
          </h2>
          <p className="text-[14px] text-[#64748B] mb-8">
            Заполните форму ниже, чтобы подать запрос на реализацию ваших прав. Наш
            специалист по защите данных рассмотрит его в установленные сроки и свяжется
            с вами по указанным контактным данным.
          </p>

          {submitted ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="text-[20px] font-bold text-[#0F172A] mb-2">Запрос отправлен</h3>
              <p className="text-[14px] text-[#64748B] max-w-md mx-auto">
                Ваш запрос принят и будет рассмотрен специалистом по защите персональных данных
                в установленные законодательством сроки. Ответ будет направлен на указанный email.
              </p>
              <p className="mt-4 text-[13px] text-[#94A3B8]">
                По вопросам: <a href="mailto:privacy@tamshy.kz" className="text-[#2563EB] hover:underline">privacy@tamshy.kz</a>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <Input
                  label="Ваше ФИО *"
                  placeholder="Иванов Иван Иванович"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  label="Email *"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <Input
                  label="Номер телефона"
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  hint="Необязательно — для оперативной связи"
                />
                <Select
                  label="Тип запроса *"
                  value={formData.requestType}
                  onChange={(e) => setFormData((prev) => ({ ...prev, requestType: e.target.value }))}
                  options={REQUEST_TYPES}
                  placeholder="Выберите тип запроса"
                />
              </div>

              <Textarea
                label="Описание запроса *"
                placeholder="Опишите ваш запрос подробно: какие именно данные затронуты, какое действие вы хотите, чтобы мы предприняли..."
                value={formData.message}
                onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                showCount
                maxLength={2000}
                hint="Минимум 20 символов"
              />

              <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                <p className="text-[12px] text-[#64748B]">
                  Отправляя данную форму, вы подтверждаете, что являетесь субъектом
                  персональных данных или его законным представителем. Ваш запрос будет
                  обработан в соответствии с Законом РК № 94-V «О персональных данных и
                  их защите».{' '}
                  <Link href="/privacy" className="text-[#2563EB] hover:underline">
                    Политика конфиденциальности
                  </Link>
                </p>
              </div>

              {error && (
                <p className="text-[13px] text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>
              )}

              <Button
                type="submit"
                loading={loading}
                disabled={!canSubmit}
                className="w-full"
              >
                Отправить запрос
              </Button>
            </form>
          )}
        </motion.div>

        {/* DPO contact */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="bg-white border border-[#E2E8F0] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5"
        >
          <div className="w-12 h-12 rounded-xl bg-[#DBEAFE] flex items-center justify-center shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-[16px] font-bold text-[#0F172A]">
              Ответственный за защиту персональных данных (DPO)
            </h3>
            <p className="text-[13px] text-[#64748B] mt-1">
              НАО «Информационно-аналитический центр водных ресурсов», г. Астана, ул. Достык 13/3
            </p>
          </div>
          <div className="flex flex-col sm:items-end gap-2 shrink-0">
            <a
              href="mailto:privacy@tamshy.kz"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#DBEAFE] text-[#1D4ED8] text-[13px] font-semibold rounded-xl hover:bg-blue-200 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              privacy@tamshy.kz
            </a>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
