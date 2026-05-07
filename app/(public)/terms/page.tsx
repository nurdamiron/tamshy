'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const sections = [
  { id: 'parties', title: '1. Тараптар мен келісім нысаны' },
  { id: 'registration', title: '2. Тіркелу және есептік жазбалар' },
  { id: 'participation', title: '3. Конкурсқа қатысу шарттары' },
  { id: 'copyright', title: '4. Авторлық құқық және лицензия' },
  { id: 'prohibited', title: '5. Тыйым салынған мазмұн' },
  { id: 'liability', title: '6. Тараптардың жауапкершілігі' },
  { id: 'minors', title: '7. Кәмелетке толмаған қатысушылар' },
  { id: 'law', title: '8. Қолданылатын құқық' },
  { id: 'amendments', title: '9. Келісімге өзгерістер енгізу' },
  { id: 'contacts', title: '10. Байланыс' },
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
            <span className="text-[13px] text-blue-300 font-medium">Құқықтық құжат</span>
          </div>
          <h1 className="text-[36px] sm:text-[44px] font-bold mb-4 leading-tight">
            Пайдаланушы келісімі
          </h1>
          <p className="text-[16px] text-white/60 max-w-2xl">
            Осы келісім Tamshy.kz платформасын пайдалану тәртібін және «Су ресурстарының
            ақпараттық-талдау орталығы» АҚ өткізетін конкурстарға қатысу шарттарын реттейді.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-[13px] text-white/40">
            <span>Күшіне ену күні: <strong className="text-white/70">2026 жылғы 1 қаңтар</strong></span>
            <span>Нұсқа: <strong className="text-white/70">1.0</strong></span>
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
                <section id="parties">
                  <SectionTitle num="1" title="Тараптар мен келісім нысаны" />
                  <div className="prose-legal space-y-4 text-[14px] text-[#475569] leading-relaxed">
                    <p>
                      Осы Пайдаланушы келісімі (бұдан әрі — «Келісім») мынадай тараптар арасында
                      жасалады:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                        <p className="text-[13px] font-semibold text-[#0F172A] mb-1">Платформа операторы</p>
                        <p className="text-[13px] text-[#475569]">
                          «Су ресурстарының ақпараттық-талдау орталығы» коммерциялық емес акционерлік
                          қоғамы (НАО «ИАЦ водных ресурсов»), БСН: 160240017492,
                          Астана қ., Достық к-сі 13/3 (бұдан әрі — «Оператор»).
                        </p>
                      </div>
                      <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                        <p className="text-[13px] font-semibold text-[#0F172A] mb-1">Пайдаланушы</p>
                        <p className="text-[13px] text-[#475569]">
                          Tamshy.kz платформасында тіркелген және осы Келісімнің шарттарын қабылдаған
                          жеке тұлға (мұғалім, тәлімгер немесе заңды өкіл) (бұдан әрі — «Пайдаланушы»).
                        </p>
                      </div>
                    </div>
                    <p>
                      <strong>Келісімнің нысаны</strong> — Пайдаланушыға <strong>Tamshy.kz</strong>{' '}
                      білім беру платформасының функционалдық мүмкіндіктеріне қол жеткізуді қамтамасыз
                      ету, соның ішінде Қазақстан Республикасы Су ресурстары және ирригация
                      министрлігінің мемлекеттік бағдарламасы аясында өткізілетін экология мен
                      суды үнемдеу саласындағы балалар-жасөспірімдер жобалар конкурстарына қатысу.
                    </p>
                    <p>
                      Осы Келісім жария оферта болып табылады. Платформада тіркелу Қазақстан
                      Республикасы Азаматтық кодексінің 395-бабына сәйкес осы Келісімнің барлық
                      шарттарын толық және сөзсіз қабылдауды білдіреді.
                    </p>
                  </div>
                </section>

                <Divider />

                {/* 2 */}
                <section id="registration">
                  <SectionTitle num="2" title="Тіркелу және есептік жазбалар" />
                  <div className="prose-legal space-y-4 text-[14px] text-[#475569] leading-relaxed">
                    <p>
                      Платформа конкурстарына қатысу үшін тіркелу қажет. Аутентификация
                      Пайдаланушының мобильді телефон нөміріне SMS-хабарлама арқылы жіберілетін
                      бір реттік құпия сөз (OTP) арқылы жүзеге асырылады.
                    </p>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>
                        Пайдаланушы заңды негізде өзіне тиесілі шынайы мобильді телефон нөмірін
                        көрсетуге міндетті.
                      </li>
                      <li>
                        Әрбір телефон нөмірі тек бір есептік жазбамен байланыстырылуы мүмкін.
                        Артықшылық алу мақсатында бірнеше есептік жазба тіркеуге тыйым салынады.
                      </li>
                      <li>
                        Пайдаланушы өзінің есептік жазбасын пайдалана отырып жасалған кез келген
                        әрекеттер үшін толық жауапкершілік көтереді.
                      </li>
                      <li>
                        Есептік жазбаны рұқсатсыз пайдалану жағдайында Пайдаланушы{' '}
                        <a href="mailto:info@tamshy.kz" className="text-[#2563EB] hover:underline">
                          info@tamshy.kz
                        </a>{' '}
                        мекенжайы бойынша Операторды дереу хабардар етуге міндетті.
                      </li>
                      <li>
                        Оператор осы Келісімнің бұзылғанын анықтаған жағдайда алдын ала хабарлаусыз
                        Пайдаланушының есептік жазбасын бұғаттауға құқылы.
                      </li>
                    </ol>
                  </div>
                </section>

                <Divider />

                {/* 3 */}
                <section id="participation">
                  <SectionTitle num="3" title="Конкурсқа қатысу шарттары" />
                  <div className="prose-legal space-y-4 text-[14px] text-[#475569] leading-relaxed">
                    <p>
                      Платформа конкурстарына Қазақстан Республикасының жалпы білім беретін
                      мекемелерінің оқушылары қатыса алады. Өтінімдер мұғалімдер немесе оқушылардың
                      заңды өкілдері арқылы беріледі.
                    </p>
                    <div className="space-y-3">
                      {[
                        { title: 'Қатысушыларға қойылатын талаптар', items: ['ҚР жалпы білім беретін мектептерінің 1–11 сынып оқушылары', 'Бір қатысушы бір конкурс аясында 3-тен аспайтын жұмыс бере алады', 'Жұмыс тек бір санатта ұсынылуы мүмкін'] },
                        { title: 'Жобаларға қойылатын талаптар', items: ['Жұмыс тақырыбы экология, суды үнемдеу немесе қоршаған ортаны қорғаумен байланысты болуы керек', 'Жұмыс түпнұсқа және бұрын жарияланбаған болуы тиіс', 'Формат: бейнеролик, зерттеу жұмысы, көркем шығарма, өнертабыс немесе қосымша', 'Жүктелетін файлдың ең үлкен өлшемі: 500 МБ'] },
                        { title: 'Өтінім беру процесі', items: ['Өтінім платформадағы нысан арқылы беріледі және растау алынған сәттен бастап берілген болып есептеледі', 'Берілген өтінімдер 5 жұмыс күні ішінде модерациядан өтеді', 'Оператор верификация үшін қосымша құжаттар сұратуға құқылы'] },
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
                  <SectionTitle num="4" title="Авторлық құқық және лицензия" />
                  <div className="prose-legal space-y-5 text-[14px] text-[#475569] leading-relaxed">
                    <div className="p-5 bg-amber-50 border-2 border-amber-300 rounded-xl">
                      <div className="flex items-start gap-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" className="shrink-0 mt-0.5">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 8v4M12 16h.01" />
                        </svg>
                        <div>
                          <p className="text-[14px] font-bold text-amber-900">Негізгі ереже</p>
                          <p className="text-[13px] text-amber-800 mt-1">
                            Жобаға (конкурстық жұмысқа) авторлық құқық авторда — оқушыда — немесе
                            оның заңды өкілінде қалады. Tamshy.kz платформасы жүктелген жұмыстарға
                            меншік құқығын талап етпейді.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="font-semibold text-[#0F172A] mb-3">4.1. Лицензия беру</p>
                      <p>
                        Жобаны платформаға жүктей отырып, автор (немесе оның заңды өкілі) «Су
                        ресурстарының ақпараттық-талдау орталығы» АҚ-на жобамен мынадай әрекеттерді
                        жүзеге асыруға{' '}
                        <strong>Қазақстан Республикасының аумағында және шетелде қолданылатын
                        айрықша емес, өтеусіз</strong> лицензия береді:
                      </p>
                      <div className="mt-3 space-y-2">
                        {[
                          { icon: '🌐', title: 'Платформада жариялау', desc: 'Жобаны Tamshy.kz сайтында ашық немесе шектеулі қолжетімділікте орналастыру.' },
                          { icon: '📚', title: 'Білім беру мақсатында пайдалану', desc: 'Жобаны коммерциялық емес білім беру бағдарламаларында, семинарларда, көрмелер мен конференцияларда пайдалану.' },
                          { icon: '🗄️', title: 'Мұрағаттау', desc: 'Конкурс нәтижелерін құжаттау үшін жобаны конкурстық жұмыстар мұрағатында сақтау.' },
                          { icon: '📰', title: 'БАҚ-та атау', desc: 'Конкурсты жариялау аясында бұқаралық ақпарат құралдарында жоба мен оның авторы туралы ақпаратты жариялау.' },
                          { icon: '🏆', title: 'Нәтижелерді көрсету', desc: 'ҚР Су ресурстары министрлігіне және конкурс серіктестеріне арналған ресми есептер мен презентацияларда пайдалану.' },
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
                      <p className="font-semibold text-[#0F172A] mb-2">4.2. Лицензия мерзімі</p>
                      <p>
                        Лицензия конкурс өткізілген кезең мен оның аяқталуынан кейінгі{' '}
                        <strong>5 (бес) жыл</strong> мерзімге беріледі. Лицензия мерзімі өткеннен
                        кейін жоба автордың өтініші бойынша жойылуы мүмкін.
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold text-[#0F172A] mb-2">4.3. Лицензияның шектеулері</p>
                      <p>
                        Лицензия мынадай құқықтарды <strong>қамтымайды</strong>:
                      </p>
                      <ul className="mt-2 list-disc pl-5 space-y-1">
                        <li>Жобаны немесе оның бөліктерін коммерциялық мақсатта пайдалану</li>
                        <li>Автордың келісімінсіз пайдалану құқықтарын үшінші тұлғаларға беру</li>
                        <li>Автордың келісімінсіз жобаны өңдеу (туынды шығармалар жасау)</li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-semibold text-[#0F172A] mb-2">4.4. Автордың кепілдіктері</p>
                      <p>
                        Жобаны жүктей отырып, автор (немесе оның заңды өкілі) мыналарға кепілдік береді:
                      </p>
                      <ul className="mt-2 list-disc pl-5 space-y-1">
                        <li>Жоба автордың түпнұсқа шығармасы болып табылады</li>
                        <li>Жоба үшінші тұлғалардың авторлық, сабақтас және тауар белгілеріне қатысты құқықтарын бұзбайды</li>
                        <li>Автор осы лицензияны беру үшін қажетті барлық құқықтарға ие</li>
                        <li>Жоба пайдалану үшін қосымша рұқсаттар талап ететін материалдарды қамтымайды</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                      <p className="text-[13px] text-green-800">
                        <strong>Авторлықты тану:</strong> Оператор жобаны жариялаған кезде автор
                        өзгеше талап етпесе, әрқашан автордың атын және мектептің атауын көрсетуге
                        міндеттенеді.
                      </p>
                    </div>
                  </div>
                </section>

                <Divider />

                {/* 5 */}
                <section id="prohibited">
                  <SectionTitle num="5" title="Тыйым салынған мазмұн" />
                  <div className="prose-legal space-y-4 text-[14px] text-[#475569] leading-relaxed">
                    <p>
                      Платформаны пайдалану кезінде мынадай мазмұнды орналастыруға, беруге немесе
                      өзге тәсілмен таратуға тыйым салынады:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        'Қазақстан Республикасының заңнамасын немесе халықаралық құқық нормаларын бұзатын мазмұн',
                        'Кез келген белгілер бойынша кемсітушілікке шақыратын қорлаулар, қорқытулар бар мазмұн',
                        'Плагиат немесе авторлық және сабақтас құқықтарды өзге тәсілмен бұзатын мазмұн',
                        'Олардың келісімінсіз үшінші тұлғалардың дербес деректерін қамтитын мазмұн',
                        'Әсіресе кәмелетке толмағандардың қатысуымен жасалған жыныстық сипаттағы материалдар',
                        'Зорлық-зомбылықты, экстремизмді немесе террористік қызметті насихаттайтын мазмұн',
                        'Зиянды код, вирустар, спам немесе өзге зиянды элементтер бар мазмұн',
                        'Конкурс тақырыбына (экология, суды үнемдеу) сәйкес келмейтін мазмұн',
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
                      Тыйым салынған мазмұн анықталған жағдайда Оператор хабарламасыз оны жоюға
                      және бұзушының есептік жазбасын бұғаттауға құқылы. Өрескел бұзушылықтар
                      жағдайында материалдар құқық қорғау органдарына берілуі мүмкін.
                    </p>
                  </div>
                </section>

                <Divider />

                {/* 6 */}
                <section id="liability">
                  <SectionTitle num="6" title="Тараптардың жауапкершілігі" />
                  <div className="prose-legal space-y-4 text-[14px] text-[#475569] leading-relaxed">
                    <div>
                      <p className="font-semibold text-[#0F172A] mb-2">6.1. Оператордың жауапкершілігі</p>
                      <p>
                        Оператор платформаның қолжетімділігі мен жұмысқа қабілеттілігін
                        қамтамасыз ету үшін ақылға қонымды күш-жігер жұмсайды, алайда оның
                        үздіксіз жұмысына кепілдік бермейді.
                      </p>
                      <p className="mt-2">
                        <strong>Жауапкершілікті шектеу:</strong> Оператор мыналар үшін жауапкершілік
                        көтермейді:
                      </p>
                      <ul className="mt-2 list-disc pl-5 space-y-1">
                        <li>Техникалық себептер немесе жоспарлы техникалық қызмет көрсету аясында платформаның уақытша қолжетімсіздігі</li>
                        <li>Пайдаланушылардың платформада орналастырған әрекеттері немесе мазмұны</li>
                        <li>Пайдаланушының осы Келісімді бұзуы салдарынан келтірілген залал</li>
                        <li>ҚР заңнамасымен жол берілетін шегінде жанама, кездейсоқ немесе тікелей емес шығындар</li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-semibold text-[#0F172A] mb-2">6.2. Пайдаланушының жауапкершілігі</p>
                      <p>
                        Пайдаланушы мыналар үшін толық жауапкершілік көтереді:
                      </p>
                      <ul className="mt-2 list-disc pl-5 space-y-1">
                        <li>Қатысушы мен жоба туралы берілген деректердің дұрыстығы</li>
                        <li>Өтінім берілгенге дейін барлық қажетті келісімдердің (ата-аналық, авторлық) болуы</li>
                        <li>Жүктелетін материалдардың мазмұны мен заңнама талаптарына сәйкестігі</li>
                        <li>Есептік жазбаға кіру деректемелерінің сақталуы</li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-semibold text-[#0F172A] mb-2">6.3. Форс-мажор</p>
                      <p>
                        Тараптар еңсерілмейтін күш жағдайлары (стихиялық апаттар, әскери іс-қимылдар,
                        мемлекеттік органдардың шешімдері және т.б.) туындаған кезде міндеттемелерді
                        тиісінше орындамағаны үшін жауапкершіліктен босатылады, егер тарап екінші
                        тарапты ақылға қонымды мерзімде хабардар еткен болса.
                      </p>
                    </div>
                  </div>
                </section>

                <Divider />

                {/* 7 */}
                <section id="minors">
                  <SectionTitle num="7" title="Кәмелетке толмаған қатысушылар" />
                  <div className="prose-legal space-y-4 text-[14px] text-[#475569] leading-relaxed">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-[#EFF6FF] border border-blue-200 rounded-xl">
                        <p className="text-[13px] font-semibold text-blue-900 mb-2">14-тен 18 жасқа дейінгі қатысушылар</p>
                        <p className="text-[13px] text-blue-800">
                          Ата-аналарының немесе өзге заңды өкілдерінің алдын ала келісімімен
                          конкурсқа қатыса алады. Мұғалім өтінім берген кезде мұндай келісімнің
                          бар екенін растайды. Кәмелетке толмаған тұлға өзінің дербес деректерін
                          өңдеуге өз бетінше келісім бере алады.
                        </p>
                      </div>
                      <div className="p-4 bg-[#F0FDF4] border border-green-200 rounded-xl">
                        <p className="text-[13px] font-semibold text-green-900 mb-2">14 жасқа дейінгі қатысушылар</p>
                        <p className="text-[13px] text-green-800">
                          Қатысу тек заңды өкіл (ата-ана, қамқоршы, асырап алушы) арқылы мүмкін.
                          Заңды өкіл өтінімді береді, барлық қажетті келісімдерді ұсынады және
                          баланың конкурсқа қатысуы үшін толық жауапкершілік көтереді.
                        </p>
                      </div>
                    </div>
                    <p>
                      Оқушы атынан өтінім беретін мұғалім өтінімді берер алдында ата-аналардан
                      (заңды өкілдерден) конкурсқа қатысуға және оқушының дербес деректерін
                      өңдеуге жазбаша келісім алуға міндетті. Оператор кез келген уақытта
                      мұндай келісімнің бар екенін растауды сұратуға құқылы.
                    </p>
                  </div>
                </section>

                <Divider />

                {/* 8 */}
                <section id="law">
                  <SectionTitle num="8" title="Қолданылатын құқық және дауларды шешу тәртібі" />
                  <div className="prose-legal space-y-4 text-[14px] text-[#475569] leading-relaxed">
                    <p>
                      Осы Келісім мыналарды қоса алғандағы{' '}
                      <strong>Қазақстан Республикасының заңнамасына</strong> сәйкес реттеледі
                      және түсіндіріледі:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Қазақстан Республикасының Азаматтық кодексі</li>
                      <li>ҚР «Дербес деректер және оларды қорғау туралы» Заңы № 94-V, 21.05.2013 ж.</li>
                      <li>ҚР «Авторлық құқық және сабақтас құқықтар туралы» Заңы № 6-I, 10.06.1996 ж.</li>
                      <li>ҚР «Ақпарат, ақпараттандыру және ақпаратты қорғау туралы» Заңы</li>
                    </ul>
                    <p>
                      Осы Келісімге байланысты туындайтын барлық даулар келіссөздер жолымен
                      реттелуге жатады. Дауды сотқа дейінгі тәртіппен 30 (отыз) күнтізбелік күн
                      ішінде реттеу мүмкін болмаған жағдайда, дау Қазақстан Республикасының
                      <strong> Астана қаласының сотында</strong> қаралуға жатады.
                    </p>
                  </div>
                </section>

                <Divider />

                {/* 9 */}
                <section id="amendments">
                  <SectionTitle num="9" title="Келісімге өзгерістер енгізу" />
                  <div className="prose-legal space-y-4 text-[14px] text-[#475569] leading-relaxed">
                    <p>
                      Оператор мынадай тәртіппен осы Келісімге біржақты тәртіппен өзгерістер
                      енгізуге құқылы:
                    </p>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>
                        Пайдаланушыларды өзгерістер туралы хабарландыру өзгерістер күшіне
                        енгенге дейін кемінде{' '}
                        <strong>30 (отыз) күнтізбелік күн</strong> бұрын платформада жарияланады.
                      </li>
                      <li>
                        Хабарландыру тіркелген Пайдаланушыларға тіркелу кезінде көрсетілген
                        телефон нөміріне SMS арқылы жіберіледі.
                      </li>
                      <li>
                        Өзгерістер күшіне енгеннен кейін платформаны пайдалануды жалғастыру
                        Пайдаланушының Келісімнің жаңа редакциясымен келісетінін білдіреді.
                      </li>
                      <li>
                        Пайдаланушы өзгерістермен келіспесе, платформаны пайдалануды тоқтатып,
                        есептік жазбаны жою туралы өтінім жіберуге құқылы.
                      </li>
                    </ol>
                  </div>
                </section>

                <Divider />

                {/* 10 */}
                <section id="contacts">
                  <SectionTitle num="10" title="Байланыс" />
                  <div className="prose-legal space-y-4 text-[14px] text-[#475569] leading-relaxed">
                    <p>
                      Осы Келісімге және платформаны пайдалануға байланысты мәселелер бойынша:
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
                        label="Мекенжай"
                        value="Астана қ., Достық к-сі 13/3"
                        href="https://maps.google.com/?q=Астана,+ул.+Достык+13/3"
                      />
                    </div>
                    <p className="text-[13px] text-[#94A3B8]">
                      Дербес деректер субъектілерінің құқықтары туралы қосымша ақпаратты{' '}
                      <Link href="/data-rights" className="text-[#2563EB] hover:underline">
                        «ДД субъектілерінің құқықтары»
                      </Link>{' '}
                      бетінен немесе{' '}
                      <Link href="/privacy" className="text-[#2563EB] hover:underline">
                        Құпиялылық саясатынан
                      </Link>{' '}
                      таба аласыз.
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
