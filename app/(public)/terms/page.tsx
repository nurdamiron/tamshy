'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const sections = [
  { id: 'parties', title: '1. Стороны и предмет соглашения' },
  { id: 'registration', title: '2. Регистрация и учётные записи' },
  { id: 'participation', title: '3. Условия участия в конкурсе' },
  { id: 'copyright', title: '4. Авторские права и лицензия' },
  { id: 'prohibited', title: '5. Запрещённый контент' },
  { id: 'liability', title: '6. Ответственность сторон' },
  { id: 'minors', title: '7. Несовершеннолетние участники' },
  { id: 'law', title: '8. Применимое право' },
  { id: 'amendments', title: '9. Изменения в соглашении' },
  { id: 'contacts', title: '10. Контакты' },
];

function useSectionInView(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: '-20% 0px -70% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [ids]);
  return active;
}

export default function TermsPage() {
  const activeId = useSectionInView(sections.map((s) => s.id));

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
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <span className="text-[13px] text-blue-300 font-medium">Правовой документ</span>
          </div>
          <h1 className="text-[36px] sm:text-[44px] font-bold mb-4 leading-tight">
            Пользовательское соглашение
          </h1>
          <p className="text-[16px] text-white/60 max-w-2xl">
            Настоящее соглашение регулирует порядок использования платформы Tamshy.kz и условия
            участия в конкурсах, проводимых НАО «ИАЦ водных ресурсов».
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-[13px] text-white/40">
            <span>Дата вступления в силу: <strong className="text-white/70">1 января 2026 г.</strong></span>
            <span>Версия: <strong className="text-white/70">1.0</strong></span>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex gap-10 relative">
          {/* Sticky TOC */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-[0.12em] mb-4">
                Содержание
              </p>
              <nav className="space-y-1">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className={`block text-[13px] py-1.5 px-3 rounded-lg transition-all duration-200 ${
                      activeId === s.id
                        ? 'bg-[#DBEAFE] text-[#1D4ED8] font-medium'
                        : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <motion.article
            className="flex-1 min-w-0"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
              <div className="p-8 sm:p-10 space-y-12">

                {/* 1 */}
                <section id="parties">
                  <SectionTitle num="1" title="Стороны и предмет соглашения" />
                  <div className="prose-legal space-y-4 text-[14px] text-[#475569] leading-relaxed">
                    <p>
                      Настоящее Пользовательское соглашение (далее — «Соглашение») заключается
                      между:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                        <p className="text-[13px] font-semibold text-[#0F172A] mb-1">Оператор платформы</p>
                        <p className="text-[13px] text-[#475569]">
                          Некоммерческое акционерное общество «Информационно-аналитический центр
                          водных ресурсов» (НАО «ИАЦ водных ресурсов»), БИН: 160240017492,
                          г. Астана, ул. Достык 13/3 (далее — «Оператор»).
                        </p>
                      </div>
                      <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                        <p className="text-[13px] font-semibold text-[#0F172A] mb-1">Пользователь</p>
                        <p className="text-[13px] text-[#475569]">
                          Физическое лицо (учитель, наставник или законный представитель), прошедшее
                          регистрацию на платформе Tamshy.kz и принявшее условия настоящего
                          Соглашения (далее — «Пользователь»).
                        </p>
                      </div>
                    </div>
                    <p>
                      <strong>Предмет Соглашения</strong> — предоставление Пользователю доступа к
                      функциональным возможностям образовательной платформы <strong>Tamshy.kz</strong>,
                      включая участие в конкурсах детско-юношеских проектов в области экологии и
                      водосбережения, проводимых в рамках государственной программы Министерства
                      водных ресурсов и ирригации Республики Казахстан.
                    </p>
                    <p>
                      Настоящее Соглашение является публичной офертой. Регистрация на платформе
                      означает полное и безоговорочное принятие всех условий настоящего Соглашения
                      в соответствии со ст. 395 Гражданского кодекса Республики Казахстан.
                    </p>
                  </div>
                </section>

                <Divider />

                {/* 2 */}
                <section id="registration">
                  <SectionTitle num="2" title="Регистрация и учётные записи" />
                  <div className="prose-legal space-y-4 text-[14px] text-[#475569] leading-relaxed">
                    <p>
                      Для участия в конкурсах платформы необходима регистрация. Аутентификация
                      осуществляется через одноразовый пароль (OTP), направляемый на номер мобильного
                      телефона Пользователя посредством SMS-сообщения.
                    </p>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>
                        Пользователь обязан указывать достоверный номер мобильного телефона, который
                        принадлежит ему на законных основаниях.
                      </li>
                      <li>
                        Каждый номер телефона может быть связан только с одной учётной записью.
                        Регистрация нескольких учётных записей с целью получения преимуществ запрещена.
                      </li>
                      <li>
                        Пользователь несёт полную ответственность за любые действия, совершённые
                        с использованием его учётной записи.
                      </li>
                      <li>
                        В случае несанкционированного использования учётной записи Пользователь
                        обязан незамедлительно уведомить Оператора по адресу{' '}
                        <a href="mailto:info@tamshy.kz" className="text-[#2563EB] hover:underline">
                          info@tamshy.kz
                        </a>.
                      </li>
                      <li>
                        Оператор вправе заблокировать учётную запись Пользователя при обнаружении
                        нарушений настоящего Соглашения без предварительного уведомления.
                      </li>
                    </ol>
                  </div>
                </section>

                <Divider />

                {/* 3 */}
                <section id="participation">
                  <SectionTitle num="3" title="Условия участия в конкурсе" />
                  <div className="prose-legal space-y-4 text-[14px] text-[#475569] leading-relaxed">
                    <p>
                      К участию в конкурсах платформы допускаются учащиеся общеобразовательных
                      учреждений Республики Казахстан. Заявки подаются учителями или законными
                      представителями учащихся.
                    </p>
                    <div className="space-y-3">
                      {[
                        { title: 'Требования к участникам', items: ['Учащиеся 1–11 классов общеобразовательных школ РК', 'Один участник может подать не более 3 работ в рамках одного конкурса', 'Работа может быть подана только в одной категории'] },
                        { title: 'Требования к проектам', items: ['Тематика работы должна быть связана с экологией, водосбережением или охраной окружающей среды', 'Работа должна быть оригинальной и не публиковавшейся ранее', 'Формат: видеоролик, исследовательская работа, художественное произведение, изобретение или приложение', 'Максимальный размер загружаемого файла: 500 МБ'] },
                        { title: 'Процесс подачи', items: ['Заявка подаётся через форму на платформе и считается поданной с момента получения подтверждения', 'Поданные заявки проходят модерацию в течение 5 рабочих дней', 'Оператор вправе запросить дополнительные документы для верификации'] },
                      ].map((block) => (
                        <div key={block.title} className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                          <p className="text-[13px] font-semibold text-[#0F172A] mb-2">{block.title}</p>
                          <ul className="list-disc pl-5 space-y-1">
                            {block.items.map((item) => (
                              <li key={item} className="text-[13px] text-[#64748B]">{item}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <Divider />

                {/* 4 — Key section: Copyright */}
                <section id="copyright">
                  <SectionTitle num="4" title="Авторские права и лицензия" />
                  <div className="prose-legal space-y-5 text-[14px] text-[#475569] leading-relaxed">
                    <div className="p-5 bg-amber-50 border-2 border-amber-300 rounded-xl">
                      <div className="flex items-start gap-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" className="shrink-0 mt-0.5">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 8v4M12 16h.01" />
                        </svg>
                        <div>
                          <p className="text-[14px] font-bold text-amber-900">Ключевое положение</p>
                          <p className="text-[13px] text-amber-800 mt-1">
                            Авторское право на проект (конкурсную работу) остаётся за автором —
                            учеником — или его законным представителем. Платформа Tamshy.kz не
                            претендует на права собственности на загруженные работы.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="font-semibold text-[#0F172A] mb-3">4.1. Предоставление лицензии</p>
                      <p>
                        Загружая проект на платформу, автор (или его законный представитель) предоставляет
                        НАО «ИАЦ водных ресурсов» <strong>неисключительную, безвозмездную, действующую
                        на территории Республики Казахстан и за рубежом</strong> лицензию на следующие
                        действия с проектом:
                      </p>
                      <div className="mt-3 space-y-2">
                        {[
                          { icon: '🌐', title: 'Публикация на платформе', desc: 'Размещение проекта на сайте Tamshy.kz в открытом или ограниченном доступе.' },
                          { icon: '📚', title: 'Образовательное использование', desc: 'Использование проекта в некоммерческих образовательных программах, семинарах, выставках и конференциях.' },
                          { icon: '🗄️', title: 'Архивирование', desc: 'Сохранение проекта в архиве конкурсных работ для документирования результатов конкурса.' },
                          { icon: '📰', title: 'Упоминание в СМИ', desc: 'Публикация информации о проекте и его авторе в средствах массовой информации в рамках освещения конкурса.' },
                          { icon: '🏆', title: 'Демонстрация результатов', desc: 'Использование в официальных отчётах и презентациях для Министерства водных ресурсов РК и партнёров конкурса.' },
                        ].map((item) => (
                          <div key={item.title} className="flex gap-3 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                            <span className="text-lg">{item.icon}</span>
                            <div>
                              <p className="text-[13px] font-semibold text-[#0F172A]">{item.title}</p>
                              <p className="text-[12px] text-[#64748B]">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="font-semibold text-[#0F172A] mb-2">4.2. Срок лицензии</p>
                      <p>
                        Лицензия предоставляется на период проведения конкурса и <strong>5 (пять) лет</strong>{' '}
                        после его завершения. По истечении срока лицензии проект может быть удалён
                        по запросу автора.
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold text-[#0F172A] mb-2">4.3. Ограничения лицензии</p>
                      <p>
                        Лицензия <strong>не включает</strong> право на:
                      </p>
                      <ul className="mt-2 list-disc pl-5 space-y-1">
                        <li>Коммерческое использование проекта или его частей</li>
                        <li>Передачу прав на использование третьим лицам без согласия автора</li>
                        <li>Переработку проекта (создание производных произведений) без согласия автора</li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-semibold text-[#0F172A] mb-2">4.4. Гарантии автора</p>
                      <p>
                        Загружая проект, автор (или его законный представитель) гарантирует, что:
                      </p>
                      <ul className="mt-2 list-disc pl-5 space-y-1">
                        <li>Проект является оригинальным произведением автора</li>
                        <li>Проект не нарушает авторских прав, смежных прав и прав на товарные знаки третьих лиц</li>
                        <li>Автор обладает всеми необходимыми правами для предоставления настоящей лицензии</li>
                        <li>Проект не содержит материалов, использование которых требует дополнительных разрешений</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                      <p className="text-[13px] text-green-800">
                        <strong>Признание авторства:</strong> Оператор обязуется при публикации
                        проекта всегда указывать имя автора и наименование школы, если автор не
                        потребовал иного.
                      </p>
                    </div>
                  </div>
                </section>

                <Divider />

                {/* 5 */}
                <section id="prohibited">
                  <SectionTitle num="5" title="Запрещённый контент" />
                  <div className="prose-legal space-y-4 text-[14px] text-[#475569] leading-relaxed">
                    <p>
                      При использовании платформы запрещается размещать, передавать или иным образом
                      распространять контент, который:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        'Нарушает законодательство Республики Казахстан или нормы международного права',
                        'Содержит оскорбления, угрозы, призывы к дискриминации по любым признакам',
                        'Является плагиатом или иным образом нарушает авторские и смежные права',
                        'Содержит персональные данные третьих лиц без их согласия',
                        'Содержит материалы сексуального характера, особенно с участием несовершеннолетних',
                        'Пропагандирует насилие, экстремизм или террористическую деятельность',
                        'Содержит вредоносный код, вирусы, спам или иные вредоносные элементы',
                        'Не соответствует тематике конкурса (экология, водосбережение)',
                      ].map((item) => (
                        <div key={item} className="flex gap-2 p-3 bg-red-50 border border-red-100 rounded-lg">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" className="shrink-0 mt-0.5">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                          </svg>
                          <p className="text-[12px] text-[#475569]">{item}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-[13px] text-[#94A3B8]">
                      При обнаружении запрещённого контента Оператор вправе удалить его без
                      уведомления и заблокировать учётную запись нарушителя. В случае грубых
                      нарушений материалы могут быть переданы в правоохранительные органы.
                    </p>
                  </div>
                </section>

                <Divider />

                {/* 6 */}
                <section id="liability">
                  <SectionTitle num="6" title="Ответственность сторон" />
                  <div className="prose-legal space-y-4 text-[14px] text-[#475569] leading-relaxed">
                    <div>
                      <p className="font-semibold text-[#0F172A] mb-2">6.1. Ответственность Оператора</p>
                      <p>
                        Оператор прилагает разумные усилия для обеспечения доступности и
                        работоспособности платформы, однако не гарантирует её бесперебойную работу.
                      </p>
                      <p className="mt-2">
                        <strong>Ограничение ответственности:</strong> Оператор не несёт
                        ответственности за:
                      </p>
                      <ul className="mt-2 list-disc pl-5 space-y-1">
                        <li>Временную недоступность платформы по техническим причинам или в рамках планового обслуживания</li>
                        <li>Действия или контент, размещённые Пользователями на платформе</li>
                        <li>Ущерб, возникший вследствие нарушения Пользователем настоящего Соглашения</li>
                        <li>Косвенные, случайные или непрямые убытки в пределах, допустимых законодательством РК</li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-semibold text-[#0F172A] mb-2">6.2. Ответственность Пользователя</p>
                      <p>
                        Пользователь несёт полную ответственность за:
                      </p>
                      <ul className="mt-2 list-disc pl-5 space-y-1">
                        <li>Достоверность предоставленных данных об участнике и проекте</li>
                        <li>Наличие всех необходимых согласий (родительских, авторских) до подачи заявки</li>
                        <li>Содержание загружаемых материалов и соответствие их требованиям законодательства</li>
                        <li>Сохранность реквизитов доступа к учётной записи</li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-semibold text-[#0F172A] mb-2">6.3. Форс-мажор</p>
                      <p>
                        Стороны освобождаются от ответственности за ненадлежащее исполнение
                        обязательств в случае наступления обстоятельств непреодолимой силы
                        (стихийные бедствия, военные действия, решения государственных органов
                        и т.п.), если сторона уведомила другую сторону в разумный срок.
                      </p>
                    </div>
                  </div>
                </section>

                <Divider />

                {/* 7 */}
                <section id="minors">
                  <SectionTitle num="7" title="Несовершеннолетние участники" />
                  <div className="prose-legal space-y-4 text-[14px] text-[#475569] leading-relaxed">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-[#EFF6FF] border border-blue-200 rounded-xl">
                        <p className="text-[13px] font-semibold text-blue-900 mb-2">Участники от 14 до 18 лет</p>
                        <p className="text-[13px] text-blue-800">
                          Могут участвовать в конкурсе с предварительного согласия родителей или
                          иных законных представителей. Учитель при подаче заявки подтверждает
                          наличие такого согласия. Несовершеннолетний вправе самостоятельно
                          предоставить согласие на обработку своих персональных данных.
                        </p>
                      </div>
                      <div className="p-4 bg-[#F0FDF4] border border-green-200 rounded-xl">
                        <p className="text-[13px] font-semibold text-green-900 mb-2">Участники до 14 лет</p>
                        <p className="text-[13px] text-green-800">
                          Участие возможно исключительно через законного представителя (родителя,
                          опекуна, усыновителя). Законный представитель подаёт заявку, предоставляет
                          все необходимые согласия и несёт полную ответственность за участие ребёнка
                          в конкурсе.
                        </p>
                      </div>
                    </div>
                    <p>
                      Учитель, подающий заявку от имени ученика, обязан до подачи заявки получить
                      письменное согласие родителей (законных представителей) на участие в
                      конкурсе и обработку персональных данных ученика. Оператор вправе в любой
                      момент запросить подтверждение наличия такого согласия.
                    </p>
                  </div>
                </section>

                <Divider />

                {/* 8 */}
                <section id="law">
                  <SectionTitle num="8" title="Применимое право и разрешение споров" />
                  <div className="prose-legal space-y-4 text-[14px] text-[#475569] leading-relaxed">
                    <p>
                      Настоящее Соглашение регулируется и толкуется в соответствии с
                      <strong> законодательством Республики Казахстан</strong>, включая:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Гражданский кодекс Республики Казахстан</li>
                      <li>Закон РК «О персональных данных и их защите» № 94-V от 21.05.2013</li>
                      <li>Закон РК «Об авторском праве и смежных правах» № 6-I от 10.06.1996</li>
                      <li>Закон РК «Об информации, информатизации и защите информации»</li>
                    </ul>
                    <p>
                      Все споры, возникающие в связи с настоящим Соглашением, подлежат
                      урегулированию путём переговоров. В случае невозможности урегулирования спора
                      в досудебном порядке в течение 30 (тридцати) календарных дней, спор
                      подлежит рассмотрению в <strong>суде г. Астана</strong> Республики Казахстан.
                    </p>
                  </div>
                </section>

                <Divider />

                {/* 9 */}
                <section id="amendments">
                  <SectionTitle num="9" title="Изменения в соглашении" />
                  <div className="prose-legal space-y-4 text-[14px] text-[#475569] leading-relaxed">
                    <p>
                      Оператор вправе в одностороннем порядке вносить изменения в настоящее
                      Соглашение с соблюдением следующего порядка:
                    </p>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>
                        Уведомление Пользователей об изменениях публикуется на платформе не менее
                        чем за <strong>30 (тридцать) календарных дней</strong> до вступления
                        изменений в силу.
                      </li>
                      <li>
                        Уведомление направляется зарегистрированным Пользователям посредством
                        SMS на указанный при регистрации номер телефона.
                      </li>
                      <li>
                        Продолжение использования платформы после вступления изменений в силу
                        означает согласие Пользователя с новой редакцией Соглашения.
                      </li>
                      <li>
                        Если Пользователь не согласен с изменениями, он вправе прекратить
                        использование платформы и направить запрос на удаление учётной записи.
                      </li>
                    </ol>
                  </div>
                </section>

                <Divider />

                {/* 10 */}
                <section id="contacts">
                  <SectionTitle num="10" title="Контакты" />
                  <div className="prose-legal space-y-4 text-[14px] text-[#475569] leading-relaxed">
                    <p>
                      По вопросам, связанным с настоящим Соглашением и использованием платформы:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <ContactCard
                        icon={
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                          </svg>
                        }
                        label="Email"
                        value="info@tamshy.kz"
                        href="mailto:info@tamshy.kz"
                      />
                      <ContactCard
                        icon={
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                        }
                        label="Адрес"
                        value="г. Астана, ул. Достык 13/3"
                        href="https://maps.google.com/?q=Астана,+ул.+Достык+13/3"
                      />
                    </div>
                    <p className="text-[13px] text-[#94A3B8]">
                      Дополнительную информацию о правах субъектов персональных данных вы найдёте
                      на странице{' '}
                      <Link href="/data-rights" className="text-[#2563EB] hover:underline">
                        «Права субъектов ПД»
                      </Link>{' '}
                      или в{' '}
                      <Link href="/privacy" className="text-[#2563EB] hover:underline">
                        Политике конфиденциальности
                      </Link>.
                    </p>
                  </div>
                </section>

              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-8 h-8 rounded-lg bg-[#DBEAFE] flex items-center justify-center shrink-0">
        <span className="text-[13px] font-bold text-[#1D4ED8]">{num}</span>
      </div>
      <h2 className="text-[20px] font-bold text-[#0F172A]">{title}</h2>
    </div>
  );
}

function Divider() {
  return <hr className="border-[#F1F5F9]" />;
}

function ContactCard({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href: string }) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="flex items-start gap-3 p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl hover:border-[#BFDBFE] hover:bg-[#EFF6FF] transition-all group"
    >
      <div className="w-8 h-8 rounded-lg bg-[#DBEAFE] flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[11px] text-[#94A3B8] uppercase tracking-wide">{label}</p>
        <p className="text-[13px] font-medium text-[#0F172A] group-hover:text-[#2563EB] transition-colors">{value}</p>
      </div>
    </a>
  );
}
