'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const sections = [
  { id: 'general', title: '1. Общие положения' },
  { id: 'data', title: '2. Какие данные мы собираем' },
  { id: 'purposes', title: '3. Цели обработки данных' },
  { id: 'legal-basis', title: '4. Правовые основания' },
  { id: 'retention', title: '5. Срок хранения данных' },
  { id: 'transfer', title: '6. Передача третьим лицам' },
  { id: 'cross-border', title: '7. Трансграничная передача' },
  { id: 'minors', title: '8. Несовершеннолетние' },
  { id: 'rights', title: '9. Права субъектов' },
  { id: 'cookies', title: '10. Файлы cookie' },
  { id: 'security', title: '11. Безопасность данных' },
  { id: 'contacts', title: '12. Контакты' },
];

function useSectionInView(ids: string[]) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: '-20% 0px -70% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [ids]);

  return active;
}

export default function PrivacyPage() {
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
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="text-[13px] text-blue-300 font-medium">Правовой документ</span>
          </div>
          <h1 className="text-[36px] sm:text-[44px] font-bold mb-4 leading-tight">
            Политика конфиденциальности
          </h1>
          <p className="text-[16px] text-white/60 max-w-2xl">
            НАО «Информационно-аналитический центр водных ресурсов» в лице платформы Tamshy.kz
            обязуется защищать ваши персональные данные в соответствии с законодательством
            Республики Казахстан.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-[13px] text-white/40">
            <span>Дата вступления в силу: <strong className="text-white/70">1 января 2026 г.</strong></span>
            <span>Версия: <strong className="text-white/70">1.0</strong></span>
            <span>Язык: <strong className="text-white/70">Русский</strong></span>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex gap-10 relative">
          {/* Sticky TOC — desktop */}
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
                <section id="general">
                  <SectionTitle num="1" title="Общие положения" />
                  <div className="prose-legal">
                    <p>
                      Настоящая Политика конфиденциальности (далее — «Политика») определяет порядок
                      сбора, хранения, использования и защиты персональных данных пользователей
                      образовательной платформы <strong>Tamshy.kz</strong>.
                    </p>
                    <p className="mt-4">
                      <strong>Оператор персональных данных:</strong> Некоммерческое акционерное
                      общество «Информационно-аналитический центр водных ресурсов» (НАО «ИАЦ водных
                      ресурсов»), БИН: <strong>160240017492</strong>, юридический адрес:{' '}
                      <strong>Республика Казахстан, г. Астана, ул. Достык, 13/3</strong>.
                    </p>
                    <p className="mt-4">
                      Платформа функционирует под эгидой Министерства водных ресурсов и ирригации
                      Республики Казахстан и предназначена для проведения конкурсов детско-юношеских
                      проектов в области экологии и водосбережения.
                    </p>
                    <p className="mt-4">
                      Настоящая Политика разработана в соответствии с Законом Республики Казахстан
                      от 21 мая 2013 года № 94-V «О персональных данных и их защите»,
                      Гражданским кодексом РК (ст. 22–23), а также Законом РК от 10 июня 1996 года
                      № 6-I «Об авторском праве и смежных правах».
                    </p>
                    <p className="mt-4">
                      Используя платформу Tamshy.kz, вы подтверждаете, что ознакомились с настоящей
                      Политикой и даёте согласие на обработку ваших персональных данных на
                      изложенных условиях.
                    </p>
                  </div>
                </section>

                <Divider />

                {/* 2 */}
                <section id="data">
                  <SectionTitle num="2" title="Какие данные мы собираем" />
                  <div className="prose-legal space-y-6">
                    <InfoCard title="Данные учителей и наставников" icon="👤">
                      <ul className="list-disc pl-5 space-y-1 text-[14px] text-[#475569]">
                        <li>Фамилия, имя, отчество (ФИО)</li>
                        <li>Номер мобильного телефона (используется для аутентификации через OTP)</li>
                        <li>Наименование школы / учебного учреждения</li>
                        <li>Регион (область, город) Республики Казахстан</li>
                      </ul>
                    </InfoCard>

                    <InfoCard title="Данные учеников (вносятся учителем)" icon="🎓">
                      <ul className="list-disc pl-5 space-y-1 text-[14px] text-[#475569]">
                        <li>Фамилия, имя, отчество ученика</li>
                        <li>Класс (год обучения)</li>
                        <li>Наименование школы</li>
                      </ul>
                      <p className="mt-2 text-[13px] text-[#94A3B8]">
                        Учитель, вносящий данные ученика, принимает на себя ответственность за
                        получение письменного согласия родителей (законных представителей) на
                        обработку персональных данных несовершеннолетнего.
                      </p>
                    </InfoCard>

                    <InfoCard title="Технические данные" icon="🔧">
                      <ul className="list-disc pl-5 space-y-1 text-[14px] text-[#475569]">
                        <li>IP-адрес устройства при обращении к платформе</li>
                        <li>Данные браузера (user-agent) и устройства</li>
                        <li>Сессионные и аналитические файлы cookie</li>
                        <li>Дата и время регистрации и входа в систему</li>
                        <li>Журналы запросов к API (в целях безопасности)</li>
                      </ul>
                    </InfoCard>
                  </div>
                </section>

                <Divider />

                {/* 3 */}
                <section id="purposes">
                  <SectionTitle num="3" title="Цели обработки данных" />
                  <div className="prose-legal">
                    <p>Персональные данные обрабатываются исключительно в следующих целях:</p>
                    <ol className="mt-4 space-y-3 list-decimal pl-5 text-[14px] text-[#475569]">
                      <li>
                        <strong>Организация и проведение конкурса</strong> — идентификация
                        участников, приём и рассмотрение проектных работ, связь с участниками
                        по вопросам конкурса.
                      </li>
                      <li>
                        <strong>Публикация результатов</strong> — публичное объявление победителей
                        и призёров конкурса на платформе и в официальных СМИ.
                      </li>
                      <li>
                        <strong>Статистика и аналитика</strong> — формирование обезличенной
                        статистики участия по регионам, возрастным группам и тематическим
                        направлениям.
                      </li>
                      <li>
                        <strong>Обеспечение безопасности платформы</strong> — защита от
                        несанкционированного доступа, мошенничества, DDoS-атак.
                      </li>
                      <li>
                        <strong>Направление SMS-уведомлений</strong> — информирование о статусе
                        заявки и результатах конкурса (только при наличии согласия).
                      </li>
                    </ol>
                    <p className="mt-4 text-[13px] text-[#94A3B8]">
                      Оператор не использует персональные данные в коммерческих целях, не передаёт
                      их третьим лицам для маркетинга и не продаёт.
                    </p>
                  </div>
                </section>

                <Divider />

                {/* 4 */}
                <section id="legal-basis">
                  <SectionTitle num="4" title="Правовые основания обработки" />
                  <div className="prose-legal">
                    <p>
                      Обработка персональных данных осуществляется на следующих правовых основаниях
                      в соответствии с Законом РК «О персональных данных и их защите»:
                    </p>
                    <div className="mt-4 space-y-4">
                      <LegalBasis
                        article="Ст. 7, п. 1"
                        title="Согласие субъекта"
                        desc="Основное правовое основание — явное добровольное согласие пользователя, выражаемое при регистрации путём отметки соответствующего чекбокса."
                      />
                      <LegalBasis
                        article="Ст. 7, п. 5"
                        title="Исполнение договора"
                        desc="Обработка данных, необходимых для участия в конкурсе, осуществляется в рамках исполнения публичного договора (Пользовательского соглашения)."
                      />
                      <LegalBasis
                        article="Ст. 7, п. 6"
                        title="Законный интерес оператора"
                        desc="Технические данные (IP-адрес, журналы запросов) обрабатываются в целях обеспечения безопасности информационной системы."
                      />
                      <LegalBasis
                        article="Ст. 7, п. 2"
                        title="Публичный интерес"
                        desc="Публикация результатов конкурса и обезличенной статистики осуществляется в целях реализации государственной политики в области водосбережения."
                      />
                    </div>
                  </div>
                </section>

                <Divider />

                {/* 5 */}
                <section id="retention">
                  <SectionTitle num="5" title="Срок хранения данных" />
                  <div className="prose-legal">
                    <p>
                      Персональные данные хранятся не дольше, чем это необходимо для достижения
                      целей их обработки:
                    </p>
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full text-[13px] border-collapse">
                        <thead>
                          <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                            <th className="text-left py-3 px-4 font-semibold text-[#0F172A]">Категория данных</th>
                            <th className="text-left py-3 px-4 font-semibold text-[#0F172A]">Срок хранения</th>
                            <th className="text-left py-3 px-4 font-semibold text-[#0F172A]">Основание</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F1F5F9]">
                          <tr>
                            <td className="py-3 px-4 text-[#475569]">Данные учётных записей (учителя)</td>
                            <td className="py-3 px-4 text-[#475569]">Период конкурса + 3 года</td>
                            <td className="py-3 px-4 text-[#94A3B8]">Архивирование, апелляции</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-[#475569]">Данные учеников в заявках</td>
                            <td className="py-3 px-4 text-[#475569]">Период конкурса + 3 года</td>
                            <td className="py-3 px-4 text-[#94A3B8]">Архивирование результатов</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-[#475569]">Загруженные проекты (файлы)</td>
                            <td className="py-3 px-4 text-[#475569]">Период конкурса + 5 лет</td>
                            <td className="py-3 px-4 text-[#94A3B8]">Лицензионное соглашение</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-[#475569]">Технические журналы (IP, сессии)</td>
                            <td className="py-3 px-4 text-[#475569]">90 дней</td>
                            <td className="py-3 px-4 text-[#94A3B8]">Безопасность</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-[#475569]">Записи о согласии (timestamps)</td>
                            <td className="py-3 px-4 text-[#475569]">Период конкурса + 3 года</td>
                            <td className="py-3 px-4 text-[#94A3B8]">Доказательная база</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-4 text-[13px] text-[#94A3B8]">
                      По истечении сроков хранения данные безвозвратно удаляются или обезличиваются
                      в течение 30 рабочих дней.
                    </p>
                  </div>
                </section>

                <Divider />

                {/* 6 */}
                <section id="transfer">
                  <SectionTitle num="6" title="Передача данных третьим лицам" />
                  <div className="prose-legal space-y-4">
                    <p>
                      Оператор не продаёт и не передаёт персональные данные третьим лицам в
                      коммерческих целях. Ограниченная передача данных возможна исключительно в
                      следующих случаях:
                    </p>
                    <div className="space-y-3">
                      <TransferItem
                        to="Министерство водных ресурсов и ирригации РК"
                        basis="Государственный контроль и надзор за проведением конкурса"
                        scope="Обезличенная статистика, списки победителей"
                      />
                      <TransferItem
                        to="ЮНИСЕФ (UNICEF) Казахстан"
                        basis="Только с явного дополнительного согласия субъекта"
                        scope="ФИО, школа, регион победителей"
                      />
                      <TransferItem
                        to="AWS (Amazon Web Services)"
                        basis="Договор обработки данных (DPA), технический провайдер"
                        scope="Все данные (в зашифрованном виде)"
                      />
                    </div>
                    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <p className="text-[13px] text-amber-800">
                        <strong>Важно:</strong> Оператор заключает с каждым обработчиком персональных
                        данных Соглашение об обработке данных (Data Processing Agreement), обязывающее
                        обработчика соблюдать надлежащий уровень защиты данных.
                      </p>
                    </div>
                  </div>
                </section>

                <Divider />

                {/* 7 */}
                <section id="cross-border">
                  <SectionTitle num="7" title="Трансграничная передача данных" />
                  <div className="prose-legal space-y-4">
                    <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="2" y1="12" x2="22" y2="12" />
                            <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-[14px] font-semibold text-blue-900">Серверы в Европейском Союзе</p>
                          <p className="text-[13px] text-blue-700 mt-1">
                            Данные хранятся на серверах AWS в регионе <strong>EU-North-1</strong> (г. Стокгольм, Швеция).
                            Швеция является членом ЕС и обеспечивает защиту данных в соответствии с
                            Регламентом GDPR (Regulation 2016/679/EU).
                          </p>
                        </div>
                      </div>
                    </div>
                    <p>
                      Трансграничная передача персональных данных в Швецию осуществляется на
                      основании явного согласия субъекта персональных данных, которое предоставляется
                      при регистрации на платформе путём отметки соответствующего чекбокса, в
                      соответствии с п. 1 ст. 16 Закона РК «О персональных данных и их защите».
                    </p>
                    <p>
                      Пользователь, предоставляя согласие при регистрации, явно и недвусмысленно
                      соглашается на передачу своих данных на серверы, расположенные в Швеции.
                      Без предоставления данного согласия регистрация на платформе невозможна,
                      поскольку вся инфраструктура платформы размещена на указанных серверах.
                    </p>
                    <p>
                      Оператор обеспечивает выполнение стандартных договорных условий (SCCs),
                      утверждённых Европейской комиссией, при передаче данных между AWS и иными
                      возможными обработчиками данных.
                    </p>
                  </div>
                </section>

                <Divider />

                {/* 8 */}
                <section id="minors">
                  <SectionTitle num="8" title="Несовершеннолетние" />
                  <div className="prose-legal space-y-4">
                    <p>
                      Оператор уделяет особое внимание защите персональных данных
                      несовершеннолетних участников конкурса.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-[#F0FDF4] border border-green-200 rounded-xl">
                        <p className="text-[13px] font-semibold text-green-900 mb-2">
                          Участники до 14 лет
                        </p>
                        <p className="text-[13px] text-green-800">
                          Данные обрабатываются исключительно на основании письменного согласия
                          родителей или иных законных представителей. Учитель, подающий заявку,
                          обязан получить и хранить такое согласие до момента подачи заявки.
                        </p>
                      </div>
                      <div className="p-4 bg-[#EFF6FF] border border-blue-200 rounded-xl">
                        <p className="text-[13px] font-semibold text-blue-900 mb-2">
                          Участники от 14 до 18 лет
                        </p>
                        <p className="text-[13px] text-blue-800">
                          Данные могут обрабатываться на основании согласия самого
                          несовершеннолетнего. Однако рекомендуется также уведомить родителей.
                          Учитель несёт ответственность за достоверность предоставленных данных.
                        </p>
                      </div>
                    </div>
                    <p className="text-[13px] text-[#94A3B8]">
                      Оператор вправе потребовать у учителя документальное подтверждение наличия
                      родительского согласия в случае поступления запроса от законного представителя
                      ученика или соответствующего надзорного органа.
                    </p>
                  </div>
                </section>

                <Divider />

                {/* 9 */}
                <section id="rights">
                  <SectionTitle num="9" title="Права субъектов персональных данных" />
                  <div className="prose-legal space-y-4">
                    <p>
                      В соответствии с Законом РК «О персональных данных и их защите» вы имеете
                      следующие права в отношении своих персональных данных:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        { title: 'Право на доступ', desc: 'Получить информацию об обрабатываемых данных и целях их обработки. Срок ответа: 5 рабочих дней.', color: 'blue' },
                        { title: 'Право на исправление', desc: 'Потребовать исправления неточных или неполных данных. Срок ответа: 5 рабочих дней.', color: 'blue' },
                        { title: 'Право на удаление', desc: 'Потребовать удаления данных в предусмотренных законом случаях. Срок ответа: 15 рабочих дней.', color: 'red' },
                        { title: 'Право на ограничение', desc: 'Потребовать ограничения обработки данных в период рассмотрения ваших возражений.', color: 'amber' },
                        { title: 'Право на отзыв согласия', desc: 'Отозвать согласие в любой момент. Отзыв не влияет на законность ранее произведённой обработки.', color: 'purple' },
                        { title: 'Право на жалобу', desc: 'Обратиться с жалобой в уполномоченный орган по защите персональных данных РК.', color: 'gray' },
                      ].map((right) => (
                        <div key={right.title} className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                          <p className="text-[13px] font-semibold text-[#0F172A] mb-1">{right.title}</p>
                          <p className="text-[12px] text-[#64748B]">{right.desc}</p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-2">
                      Для реализации своих прав обратитесь к нашему специалисту по защите данных
                      по адресу{' '}
                      <a href="mailto:privacy@tamshy.kz" className="text-[#2563EB] hover:underline">
                        privacy@tamshy.kz
                      </a>{' '}
                      или воспользуйтесь{' '}
                      <Link href="/data-rights" className="text-[#2563EB] hover:underline">
                        формой подачи запроса
                      </Link>.
                    </p>
                  </div>
                </section>

                <Divider />

                {/* 10 */}
                <section id="cookies">
                  <SectionTitle num="10" title="Файлы cookie" />
                  <div className="prose-legal space-y-4">
                    <p>
                      Платформа использует следующие категории файлов cookie:
                    </p>
                    <div className="space-y-3">
                      <CookieItem
                        name="Сессионные cookie"
                        necessity="Обязательные"
                        desc="Используются для поддержания сессии пользователя (JWT-токен аутентификации). Не требуют отдельного согласия, так как необходимы для функционирования платформы. Срок хранения: до закрытия браузера или истечения 7 дней."
                        color="green"
                      />
                      <CookieItem
                        name="Аналитические cookie (Google Analytics)"
                        necessity="По согласию"
                        desc="Используются для сбора обезличенной статистики посещаемости: количество просмотров, страны, устройства. Данные передаются в Google LLC (США) в рамках условий Google Analytics. Срок хранения: до 2 лет."
                        color="blue"
                      />
                    </div>
                    <p className="text-[13px] text-[#94A3B8]">
                      Вы можете отключить аналитические cookie в настройках вашего браузера или
                      установив расширение Google Analytics Opt-out.
                    </p>
                  </div>
                </section>

                <Divider />

                {/* 11 */}
                <section id="security">
                  <SectionTitle num="11" title="Безопасность данных" />
                  <div className="prose-legal space-y-4">
                    <p>
                      Оператор принимает следующие технические и организационные меры для защиты
                      персональных данных:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        { icon: '🔐', title: 'JWT-токены', desc: 'Аутентификация на основе подписанных JWT с коротким сроком жизни и автоматическим обновлением.' },
                        { icon: '🔒', title: 'HTTPS / TLS 1.3', desc: 'Все соединения между клиентом и сервером зашифрованы протоколом TLS 1.3.' },
                        { icon: '🛡️', title: 'Шифрование паролей', desc: 'Пароли и OTP-коды хранятся в хешированном виде. Bcrypt с salt rounds ≥ 12.' },
                        { icon: '☁️', title: 'AWS S3 для файлов', desc: 'Загруженные проекты хранятся в зашифрованных бакетах AWS S3 (SSE-S3) с приватным доступом.' },
                        { icon: '🚫', title: 'Ограничение запросов', desc: 'Rate limiting на все API-эндпоинты для защиты от перебора и DDoS-атак.' },
                        { icon: '📋', title: 'Аудит доступа', desc: 'Ведётся журнал доступа к персональным данным со стороны сотрудников оператора.' },
                      ].map((item) => (
                        <div key={item.title} className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex gap-3">
                          <span className="text-xl shrink-0">{item.icon}</span>
                          <div>
                            <p className="text-[13px] font-semibold text-[#0F172A]">{item.title}</p>
                            <p className="text-[12px] text-[#64748B] mt-0.5">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <Divider />

                {/* 12 */}
                <section id="contacts">
                  <SectionTitle num="12" title="Контакты" />
                  <div className="prose-legal">
                    <p>
                      По всем вопросам, связанным с обработкой персональных данных, обращайтесь к
                      нашему специалисту по защите персональных данных (DPO):
                    </p>
                    <div className="mt-4 grid sm:grid-cols-3 gap-4">
                      <ContactCard
                        icon={
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                          </svg>
                        }
                        label="Email (DPO)"
                        value="privacy@tamshy.kz"
                        href="mailto:privacy@tamshy.kz"
                      />
                      <ContactCard
                        icon={
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                          </svg>
                        }
                        label="Телефон"
                        value="+7 707 205 4181"
                        href="tel:+77072054181"
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
                    <p className="mt-6 text-[13px] text-[#94A3B8]">
                      Настоящая Политика конфиденциальности вступила в силу{' '}
                      <strong className="text-[#475569]">1 января 2026 года</strong>. Оператор
                      вправе вносить изменения в настоящую Политику с уведомлением пользователей
                      через публикацию обновлённой версии на данной странице.
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

/* ---------- Sub-components ---------- */

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

function InfoCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="p-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{icon}</span>
        <p className="text-[14px] font-semibold text-[#0F172A]">{title}</p>
      </div>
      {children}
    </div>
  );
}

function LegalBasis({ article, title, desc }: { article: string; title: string; desc: string }) {
  return (
    <div className="flex gap-4 p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
      <div className="shrink-0">
        <span className="inline-block px-2 py-1 bg-[#DBEAFE] text-[#1D4ED8] text-[11px] font-bold rounded-md">
          {article}
        </span>
      </div>
      <div>
        <p className="text-[14px] font-semibold text-[#0F172A]">{title}</p>
        <p className="text-[13px] text-[#64748B] mt-1">{desc}</p>
      </div>
    </div>
  );
}

function TransferItem({ to, basis, scope }: { to: string; basis: string; scope: string }) {
  return (
    <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
      <p className="text-[14px] font-semibold text-[#0F172A]">{to}</p>
      <p className="text-[12px] text-[#64748B] mt-1"><span className="font-medium">Основание:</span> {basis}</p>
      <p className="text-[12px] text-[#94A3B8] mt-0.5"><span className="font-medium">Объём:</span> {scope}</p>
    </div>
  );
}

function CookieItem({ name, necessity, desc, color }: { name: string; necessity: string; desc: string; color: 'green' | 'blue' }) {
  const colors = {
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
  };
  return (
    <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
      <div className="flex items-center gap-2 mb-2">
        <p className="text-[14px] font-semibold text-[#0F172A]">{name}</p>
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${colors[color]}`}>
          {necessity}
        </span>
      </div>
      <p className="text-[13px] text-[#64748B]">{desc}</p>
    </div>
  );
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
