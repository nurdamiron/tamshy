'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const sections = [
  { id: 'general', title: '1. Жалпы ережелер' },
  { id: 'data', title: '2. Біз қандай деректер жинаймыз' },
  { id: 'purposes', title: '3. Деректерді өңдеу мақсаттары' },
  { id: 'legal-basis', title: '4. Өңдеудің құқықтық негіздері' },
  { id: 'retention', title: '5. Деректерді сақтау мерзімі' },
  { id: 'transfer', title: '6. Үшінші тұлғаларға беру' },
  { id: 'cross-border', title: '7. Шекараалды беру' },
  { id: 'minors', title: '8. Кәмелетке толмағандар' },
  { id: 'rights', title: '9. Субъектілердің құқықтары' },
  { id: 'cookies', title: '10. Cookie файлдары' },
  { id: 'security', title: '11. Деректер қауіпсіздігі' },
  { id: 'contacts', title: '12. Байланыс' },
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
            <span className="text-[13px] text-blue-300 font-medium">Құқықтық құжат</span>
          </div>
          <h1 className="text-[36px] sm:text-[44px] font-bold mb-4 leading-tight">
            Құпиялылық саясаты
          </h1>
          <p className="text-[16px] text-white/60 max-w-2xl">
            «Су ресурстарының ақпараттық-аналитикалық орталығы» АҚҚ Tamshy.kz платформасы
            тұлғасында сіздің жеке деректеріңізді Қазақстан Республикасының заңнамасына сәйкес
            қорғауға міндеттенеді.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-[13px] text-white/40">
            <span>Күшіне ену күні: <strong className="text-white/70">2026 жылғы 1 қаңтар</strong></span>
            <span>Нұсқа: <strong className="text-white/70">1.0</strong></span>
            <span>Тіл: <strong className="text-white/70">Қазақша</strong></span>
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
                Мазмұны
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
                  <SectionTitle num="1" title="Жалпы ережелер" />
                  <div className="prose-legal">
                    <p>
                      Осы Құпиялылық саясаты (бұдан әрі — «Саясат») <strong>Tamshy.kz</strong>{' '}
                      білім беру платформасы пайдаланушыларының жеке деректерін жинау, сақтау,
                      пайдалану және қорғау тәртібін айқындайды.
                    </p>
                    <p className="mt-4">
                      <strong>Жеке деректер операторы:</strong> «Су ресурстарының ақпараттық-аналитикалық
                      орталығы» коммерциялық емес акционерлік қоғамы (АҚҚ «СР ААО»), БСН:{' '}
                      <strong>160240017492</strong>, заңды мекенжайы:{' '}
                      <strong>Қазақстан Республикасы, Астана қ., Достық к-сі, 13/3</strong>.
                    </p>
                    <p className="mt-4">
                      Платформа Қазақстан Республикасының Су ресурстары және ирригация министрлігі
                      қолдауымен жұмыс істейді және экология мен суды үнемдеу саласындағы
                      балалар-жасөспірімдер жобалары конкурстарын өткізуге арналған.
                    </p>
                    <p className="mt-4">
                      Осы Саясат 2013 жылғы 21 мамырдағы № 94-V «Дербес деректер және оларды қорғау
                      туралы» Қазақстан Республикасының Заңына, ҚР Азаматтық кодексіне (22–23-б.),
                      сондай-ақ 1996 жылғы 10 маусымдағы № 6-I «Авторлық құқық және сабақтас
                      құқықтар туралы» ҚР Заңына сәйкес әзірленген.
                    </p>
                    <p className="mt-4">
                      Tamshy.kz платформасын пайдалана отырып, сіз осы Саясатпен танысқаныңызды және
                      жеке деректеріңізді баяндалған шарттарда өңдеуге келісім беретіндігіңізді
                      растайсыз.
                    </p>
                  </div>
                </section>

                <Divider />

                {/* 2 */}
                <section id="data">
                  <SectionTitle num="2" title="Біз қандай деректер жинаймыз" />
                  <div className="prose-legal space-y-6">
                    <InfoCard title="Мұғалімдер мен тәлімгерлердің деректері" icon="👤">
                      <ul className="list-disc pl-5 space-y-1 text-[14px] text-[#475569]">
                        <li>Тегі, аты, әкесінің аты (ТАӘ)</li>
                        <li>Ұялы телефон нөмірі (OTP арқылы аутентификация үшін пайдаланылады)</li>
                        <li>Мектеп / оқу мекемесінің атауы</li>
                        <li>Қазақстан Республикасының аймағы (облыс, қала)</li>
                      </ul>
                    </InfoCard>

                    <InfoCard title="Оқушылардың деректері (мұғалім енгізеді)" icon="🎓">
                      <ul className="list-disc pl-5 space-y-1 text-[14px] text-[#475569]">
                        <li>Оқушының тегі, аты, әкесінің аты</li>
                        <li>Сынып (оқу жылы)</li>
                        <li>Мектептің атауы</li>
                      </ul>
                      <p className="mt-2 text-[13px] text-[#94A3B8]">
                        Оқушы деректерін енгізетін мұғалім кәмелетке толмаған тұлғаның жеке
                        деректерін өңдеуге ата-аналардың (заңды өкілдерінің) жазбаша келісімін
                        алуға жауапты болады.
                      </p>
                    </InfoCard>

                    <InfoCard title="Техникалық деректер" icon="🔧">
                      <ul className="list-disc pl-5 space-y-1 text-[14px] text-[#475569]">
                        <li>Платформаға жүгінген кездегі құрылғының IP-мекенжайы</li>
                        <li>Браузер деректері (user-agent) және құрылғы туралы ақпарат</li>
                        <li>Сессиялық және аналитикалық cookie файлдары</li>
                        <li>Жүйеге тіркелу және кіру күні мен уақыты</li>
                        <li>API сұрауларының журналдары (қауіпсіздік мақсатында)</li>
                      </ul>
                    </InfoCard>
                  </div>
                </section>

                <Divider />

                {/* 3 */}
                <section id="purposes">
                  <SectionTitle num="3" title="Деректерді өңдеу мақсаттары" />
                  <div className="prose-legal">
                    <p>Жеке деректер тек төмендегі мақсаттарда өңделеді:</p>
                    <ol className="mt-4 space-y-3 list-decimal pl-5 text-[14px] text-[#475569]">
                      <li>
                        <strong>Конкурсты ұйымдастыру және өткізу</strong> — қатысушыларды
                        сәйкестендіру, жоба жұмыстарын қабылдау және қарау, конкурс мәселелері
                        бойынша қатысушылармен байланыс.
                      </li>
                      <li>
                        <strong>Нәтижелерді жариялау</strong> — конкурс жеңімпаздары мен жүлдегерлерін
                        платформада және ресми бұқаралық ақпарат құралдарында жариялау.
                      </li>
                      <li>
                        <strong>Статистика және аналитика</strong> — аймақтар, жас топтары және
                        тақырыптық бағыттар бойынша қатысудың жекесіздендірілген статистикасын
                        қалыптастыру.
                      </li>
                      <li>
                        <strong>Платформа қауіпсіздігін қамтамасыз ету</strong> — рұқсатсыз
                        қол жеткізуден, алаяқтықтан, DDoS шабуылдарынан қорғау.
                      </li>
                      <li>
                        <strong>SMS-хабарламалар жіберу</strong> — өтінімнің мәртебесі және
                        конкурс нәтижелері туралы хабардар ету (тек келісім болған жағдайда).
                      </li>
                    </ol>
                    <p className="mt-4 text-[13px] text-[#94A3B8]">
                      Оператор жеке деректерді коммерциялық мақсаттарда пайдаланбайды, маркетинг
                      үшін үшінші тұлғаларға бермейді және сатпайды.
                    </p>
                  </div>
                </section>

                <Divider />

                {/* 4 */}
                <section id="legal-basis">
                  <SectionTitle num="4" title="Өңдеудің құқықтық негіздері" />
                  <div className="prose-legal">
                    <p>
                      Жеке деректерді өңдеу ҚР «Дербес деректер және оларды қорғау туралы»
                      Заңына сәйкес төмендегі құқықтық негіздерде жүзеге асырылады:
                    </p>
                    <div className="mt-4 space-y-4">
                      <LegalBasis
                        article="7-б., 1-т."
                        title="Субъектінің келісімі"
                        desc="Негізгі құқықтық негіз — тіркелу кезінде тиісті белгілеу жолымен білдірілетін пайдаланушының анық еріктік келісімі."
                      />
                      <LegalBasis
                        article="7-б., 5-т."
                        title="Шартты орындау"
                        desc="Конкурсқа қатысу үшін қажетті деректерді өңдеу жария шартты (Пайдаланушы келісімін) орындау шеңберінде жүзеге асырылады."
                      />
                      <LegalBasis
                        article="7-б., 6-т."
                        title="Оператордың заңды мүддесі"
                        desc="Техникалық деректер (IP-мекенжай, сұрау журналдары) ақпараттық жүйенің қауіпсіздігін қамтамасыз ету мақсатында өңделеді."
                      />
                      <LegalBasis
                        article="7-б., 2-т."
                        title="Қоғамдық мүдде"
                        desc="Конкурс нәтижелерін және жекесіздендірілген статистиканы жариялау суды үнемдеу саласындағы мемлекеттік саясатты жүзеге асыру мақсатында орындалады."
                      />
                    </div>
                  </div>
                </section>

                <Divider />

                {/* 5 */}
                <section id="retention">
                  <SectionTitle num="5" title="Деректерді сақтау мерзімі" />
                  <div className="prose-legal">
                    <p>
                      Жеке деректер өңдеу мақсаттарына жету үшін қажет мерзімнен артық сақталмайды:
                    </p>
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full text-[13px] border-collapse">
                        <thead>
                          <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                            <th className="text-left py-3 px-4 font-semibold text-[#0F172A]">Деректер санаты</th>
                            <th className="text-left py-3 px-4 font-semibold text-[#0F172A]">Сақтау мерзімі</th>
                            <th className="text-left py-3 px-4 font-semibold text-[#0F172A]">Негіздеме</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F1F5F9]">
                          <tr>
                            <td className="py-3 px-4 text-[#475569]">Тіркелгі деректері (мұғалімдер)</td>
                            <td className="py-3 px-4 text-[#475569]">Конкурс кезеңі + 3 жыл</td>
                            <td className="py-3 px-4 text-[#94A3B8]">Мұрағаттау, шағымдар</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-[#475569]">Өтінімдердегі оқушы деректері</td>
                            <td className="py-3 px-4 text-[#475569]">Конкурс кезеңі + 3 жыл</td>
                            <td className="py-3 px-4 text-[#94A3B8]">Нәтижелерді мұрағаттау</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-[#475569]">Жүктелген жобалар (файлдар)</td>
                            <td className="py-3 px-4 text-[#475569]">Конкурс кезеңі + 5 жыл</td>
                            <td className="py-3 px-4 text-[#94A3B8]">Лицензиялық келісім</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-[#475569]">Техникалық журналдар (IP, сессиялар)</td>
                            <td className="py-3 px-4 text-[#475569]">90 күн</td>
                            <td className="py-3 px-4 text-[#94A3B8]">Қауіпсіздік</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-[#475569]">Келісім жазбалары (timestamps)</td>
                            <td className="py-3 px-4 text-[#475569]">Конкурс кезеңі + 3 жыл</td>
                            <td className="py-3 px-4 text-[#94A3B8]">Дәлелдемелік база</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-4 text-[13px] text-[#94A3B8]">
                      Сақтау мерзімі өткеннен кейін деректер 30 жұмыс күні ішінде қайтарымсыз
                      жойылады немесе жекесіздендіріледі.
                    </p>
                  </div>
                </section>

                <Divider />

                {/* 6 */}
                <section id="transfer">
                  <SectionTitle num="6" title="Деректерді үшінші тұлғаларға беру" />
                  <div className="prose-legal space-y-4">
                    <p>
                      Оператор жеке деректерді коммерциялық мақсаттарда сатпайды және үшінші
                      тұлғаларға бермейді. Деректерді шектеулі беру тек мынадай жағдайларда мүмкін:
                    </p>
                    <div className="space-y-3">
                      <TransferItem
                        to="ҚР Су ресурстары және ирригация министрлігі"
                        basis="Конкурсты жүргізуге мемлекеттік бақылау және қадағалау"
                        scope="Жекесіздендірілген статистика, жеңімпаздар тізімі"
                      />
                      <TransferItem
                        to="ЮНИСЕФ (UNICEF) Қазақстан"
                        basis="Тек субъектінің анық қосымша келісімімен"
                        scope="Жеңімпаздардың ТАӘ, мектебі, аймағы"
                      />
                      <TransferItem
                        to="AWS (Amazon Web Services)"
                        basis="Деректерді өңдеу туралы келісім (DPA), техникалық провайдер"
                        scope="Барлық деректер (шифрланған түрде)"
                      />
                    </div>
                    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <p className="text-[13px] text-amber-800">
                        <strong>Маңызды:</strong> Оператор әрбір жеке деректер өңдеушісімен
                        өңдеушіні деректерді тиналы қорғауды сақтауға міндеттейтін Деректерді
                        өңдеу туралы келісім (Data Processing Agreement) жасасады.
                      </p>
                    </div>
                  </div>
                </section>

                <Divider />

                {/* 7 */}
                <section id="cross-border">
                  <SectionTitle num="7" title="Деректерді шекараалды беру" />
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
                          <p className="text-[14px] font-semibold text-blue-900">Еуропалық Одақтағы серверлер</p>
                          <p className="text-[13px] text-blue-700 mt-1">
                            Деректер AWS серверлерінде <strong>EU-North-1</strong> аймағында (Швеция, Стокгольм қ.) сақталады.
                            Швеция ЕО мүшесі болып табылады және GDPR регламентіне (Regulation 2016/679/EU) сәйкес
                            деректерді қорғауды қамтамасыз етеді.
                          </p>
                        </div>
                      </div>
                    </div>
                    <p>
                      Жеке деректерді Швецияға шекараалды беру жеке деректер субъектісінің анық
                      келісімі негізінде жүзеге асырылады, ол тіркелу кезінде тиісті белгілеу
                      жолымен беріледі, ҚР «Дербес деректер және оларды қорғау туралы» Заңының
                      16-бабы 1-тармағына сәйкес.
                    </p>
                    <p>
                      Тіркелу кезінде келісімін беретін пайдаланушы Швецияда орналасқан серверлерге
                      деректерін беруге анық және бір мәнді түрде келіседі. Бұл келісімсіз
                      платформаға тіркелу мүмкін емес, өйткені платформаның бүкіл инфрақұрылымы
                      аталған серверлерде орналасқан.
                    </p>
                    <p>
                      Оператор деректерді AWS пен басқа мүмкін деректер өңдеушілер арасында
                      беру кезінде Еуропалық комиссия бекіткен стандартты шарттық талаптардың
                      (SCCs) орындалуын қамтамасыз етеді.
                    </p>
                  </div>
                </section>

                <Divider />

                {/* 8 */}
                <section id="minors">
                  <SectionTitle num="8" title="Кәмелетке толмағандар" />
                  <div className="prose-legal space-y-4">
                    <p>
                      Оператор конкурс қатысушылары — кәмелетке толмағандардың жеке деректерін
                      қорғауға ерекше назар аударады.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-[#F0FDF4] border border-green-200 rounded-xl">
                        <p className="text-[13px] font-semibold text-green-900 mb-2">
                          14 жасқа дейінгі қатысушылар
                        </p>
                        <p className="text-[13px] text-green-800">
                          Деректер тек ата-аналардың немесе өзге заңды өкілдердің жазбаша келісімі
                          негізінде өңделеді. Өтінім беретін мұғалім өтінімді беру сәтіне дейін
                          осындай келісімді алуға және сақтауға міндетті.
                        </p>
                      </div>
                      <div className="p-4 bg-[#EFF6FF] border border-blue-200 rounded-xl">
                        <p className="text-[13px] font-semibold text-blue-900 mb-2">
                          14-тен 18 жасқа дейінгі қатысушылар
                        </p>
                        <p className="text-[13px] text-blue-800">
                          Деректер кәмелетке толмаған тұлғаның өз келісімі негізінде өңделуі мүмкін.
                          Алайда ата-аналарды да хабардар ету ұсынылады. Мұғалім берілген деректердің
                          дұрыстығына жауапты болады.
                        </p>
                      </div>
                    </div>
                    <p className="text-[13px] text-[#94A3B8]">
                      Оператор оқушының заңды өкілінен немесе тиісті қадағалау органынан сұрау
                      түскен жағдайда мұғалімнен ата-аналық келісімнің бар екендігін құжатпен
                      растауды талап етуге құқылы.
                    </p>
                  </div>
                </section>

                <Divider />

                {/* 9 */}
                <section id="rights">
                  <SectionTitle num="9" title="Жеке деректер субъектілерінің құқықтары" />
                  <div className="prose-legal space-y-4">
                    <p>
                      ҚР «Дербес деректер және оларды қорғау туралы» Заңына сәйкес сіз өзіңіздің
                      жеке деректеріңізге қатысты мынадай құқықтарға ие боласыз:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        { title: 'Қолжетімділік құқығы', desc: 'Өңделетін деректер және олардың өңдеу мақсаттары туралы ақпарат алу. Жауап беру мерзімі: 5 жұмыс күні.', color: 'blue' },
                        { title: 'Түзету құқығы', desc: 'Дәл емес немесе толық емес деректерді түзетуді талап ету. Жауап беру мерзімі: 5 жұмыс күні.', color: 'blue' },
                        { title: 'Жою құқығы', desc: 'Заңда көзделген жағдайларда деректерді жоюды талап ету. Жауап беру мерзімі: 15 жұмыс күні.', color: 'red' },
                        { title: 'Шектеу құқығы', desc: 'Қарсылықтарыңызды қарау кезеңінде деректерді өңдеуді шектеуді талап ету.', color: 'amber' },
                        { title: 'Келісімді кері қайтару құқығы', desc: 'Кез келген уақытта келісімді кері қайтару. Кері қайтару бұрын жүргізілген өңдеудің заңдылығына әсер етпейді.', color: 'purple' },
                        { title: 'Шағым беру құқығы', desc: 'ҚР жеке деректерді қорғау жөніндегі уәкілетті органға шағыммен жүгіну.', color: 'gray' },
                      ].map((right) => (
                        <div key={right.title} className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                          <p className="text-[13px] font-semibold text-[#0F172A] mb-1">{right.title}</p>
                          <p className="text-[12px] text-[#64748B]">{right.desc}</p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-2">
                      Құқықтарыңызды жүзеге асыру үшін деректерді қорғау жөніндегі мамансына{' '}
                      <a href="mailto:privacy@tamshy.kz" className="text-[#2563EB] hover:underline">
                        privacy@tamshy.kz
                      </a>{' '}
                      мекенжайы бойынша хабарласыңыз немесе{' '}
                      <Link href="/data-rights" className="text-[#2563EB] hover:underline">
                        сұрау нысанын
                      </Link>{' '}
                      пайдаланыңыз.
                    </p>
                  </div>
                </section>

                <Divider />

                {/* 10 */}
                <section id="cookies">
                  <SectionTitle num="10" title="Cookie файлдары" />
                  <div className="prose-legal space-y-4">
                    <p>
                      Платформа cookie файлдарының мынадай санаттарын пайдаланады:
                    </p>
                    <div className="space-y-3">
                      <CookieItem
                        name="Сессиялық cookie файлдары"
                        necessity="Міндетті"
                        desc="Пайдаланушы сессиясын қолдау үшін пайдаланылады (аутентификацияның JWT-токені). Платформаның жұмысы үшін қажет болғандықтан жеке келісім талап етілмейді. Сақтау мерзімі: браузер жабылғанға дейін немесе 7 күн өткенге дейін."
                        color="green"
                      />
                      <CookieItem
                        name="Аналитикалық cookie файлдары (Google Analytics)"
                        necessity="Келісім бойынша"
                        desc="Қаралым саны, елдер, құрылғылар сияқты жекесіздендірілген қолданушылар статистикасын жинау үшін пайдаланылады. Деректер Google Analytics шарттары шеңберінде Google LLC (АҚШ) компаниясына беріледі. Сақтау мерзімі: 2 жылға дейін."
                        color="blue"
                      />
                    </div>
                    <p className="text-[13px] text-[#94A3B8]">
                      Аналитикалық cookie файлдарын браузер параметрлерінде өшіруге немесе
                      Google Analytics Opt-out кеңейтімін орнату арқылы бас тартуға болады.
                    </p>
                  </div>
                </section>

                <Divider />

                {/* 11 */}
                <section id="security">
                  <SectionTitle num="11" title="Деректер қауіпсіздігі" />
                  <div className="prose-legal space-y-4">
                    <p>
                      Оператор жеке деректерді қорғау үшін мынадай техникалық және ұйымдастырушылық
                      шараларды қолданады:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        { icon: '🔐', title: 'JWT-токендер', desc: 'Қысқа өмір сүру мерзімі бар және автоматты жаңартылатын қолтаңбалы JWT негізіндегі аутентификация.' },
                        { icon: '🔒', title: 'HTTPS / TLS 1.3', desc: 'Клиент пен сервер арасындағы барлық қосылымдар TLS 1.3 протоколымен шифрланған.' },
                        { icon: '🛡️', title: 'Құпиясөздерді шифрлау', desc: 'Құпиясөздер мен OTP-кодтар хэшталған түрде сақталады. Bcrypt, salt rounds ≥ 12.' },
                        { icon: '☁️', title: 'Файлдар үшін AWS S3', desc: 'Жүктелген жобалар жеке қол жеткізімді шифрланған AWS S3 бакеттерінде (SSE-S3) сақталады.' },
                        { icon: '🚫', title: 'Сұрауларды шектеу', desc: 'Таңдау және DDoS шабуылдарынан қорғау үшін барлық API-эндпоинттерде rate limiting қолданылады.' },
                        { icon: '📋', title: 'Қол жеткізу аудиті', desc: 'Оператор қызметкерлерінің жеке деректерге қол жеткізуінің журналы жүргізіледі.' },
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
                  <SectionTitle num="12" title="Байланыс" />
                  <div className="prose-legal">
                    <p>
                      Жеке деректерді өңдеуге байланысты барлық мәселелер бойынша жеке деректерді
                      қорғау жөніндегі маманға (DPO) хабарласыңыз:
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
                        label="Мекенжай"
                        value="Астана қ., Достық к-сі 13/3"
                        href="https://maps.google.com/?q=Астана,+ул.+Достық+13/3"
                      />
                    </div>
                    <p className="mt-6 text-[13px] text-[#94A3B8]">
                      Осы Құпиялылық саясаты{' '}
                      <strong className="text-[#475569]">2026 жылғы 1 қаңтарда</strong> күшіне енді.
                      Оператор осы беттегі жаңартылған нұсқаны жариялау арқылы пайдаланушыларды
                      хабардар ете отырып, осы Саясатқа өзгерістер енгізуге құқылы.
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
      <p className="text-[12px] text-[#64748B] mt-1"><span className="font-medium">Негіздеме:</span> {basis}</p>
      <p className="text-[12px] text-[#94A3B8] mt-0.5"><span className="font-medium">Көлемі:</span> {scope}</p>
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
