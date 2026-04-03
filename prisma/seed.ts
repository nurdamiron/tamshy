import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const regions = [
  'ASTANA', 'ALMATY', 'SHYMKENT', 'AKTOBE', 'KARAGANDA',
  'MANGYSTAU', 'TURKESTAN', 'ZHAMBYL', 'ALMATY_REGION',
  'ATYRAU', 'AKTAU', 'PAVLODAR', 'SEMEY', 'TALDYKORGAN',
  'KYZYLORDA', 'TARAZ', 'PETROPAVLOVSK', 'ORAL', 'KOSTANAY',
] as const;

const schools = [
  'НИШ', 'Школа No1', 'Школа No12', 'Школа No45', 'Гимназия No125',
  'Лицей No2', 'Школа No78', 'Школа No34', 'Гимназия No56', 'НИШ ФМН',
  'Школа-гимназия №3', 'Специализированная школа-лицей', 'Школа №109',
  'Школа-интернат', 'Билим-Инновация Лицей'
];

const teachers = [
  'Айгуль Сериковна', 'Бакытжан Серикович', 'Марат Нурланович',
  'Дина Ермековна', 'Ерлан Канатович', 'Асия Бауржановна',
  'Нурлан Маратович', 'Гульнара Оразовна', 'Тимур Аскарович',
  'Зарина Адилхановна', 'Рустам Махмудович', 'Алибек Саматович'
];

const projectData = [
  { title: 'Система сбора дождевой воды для школы', desc: 'Проект по установке системы сбора и фильтрации дождевой воды на территории школы. Система включает водостоки, фильтры и накопительный резервуар на 500 литров. Собранная вода используется для полива школьного сада и мытья полов. За 3 месяца тестирования экономия составила 30% от общего потребления воды школой.', type: 'INVENTION' as const },
  { title: 'Документальный фильм "Голос Или"', desc: 'Короткометражный документальный фильм о состоянии реки Или и её значении для экосистемы Алматинской области.', type: 'VIDEO' as const },
  { title: 'Исследование качества воды Каспийского моря', desc: 'Комплексное исследование pH, солёности и загрязнённости воды в прибрежной зоне Актау.', type: 'RESEARCH' as const },
  { title: 'Плакатная серия "Каждая капля на счету"', desc: 'Серия из 10 информационных плакатов о водосбережении для школ Казахстана.', type: 'ART' as const },
  { title: 'Приложение WaterTracker KZ', desc: 'Мобильное приложение для мониторинга и учёта расхода воды в школе.', type: 'APP' as const },
  { title: 'Макет системы капельного орошения', desc: 'Работающий макет системы капельного орошения для школьного огорода.', type: 'INVENTION' as const },
  { title: 'Сравнение методов фильтрации', desc: 'Исследовательский проект, в котором мы сравнили эффективность угольного фильтра, песка и керамических фильтров для очистки речной воды.', type: 'RESEARCH' as const },
  { title: 'Анимационный ролик об очистке озер', desc: 'Двухминутная анимация, объясняющая младшим школьникам важность сохранения чистоты пресноводных водоемов.', type: 'VIDEO' as const },
  { title: 'Рисунок "Живая капля"', desc: 'Художественная работа, отражающая важность каждой капли воды в пустынных регионах.', type: 'ART' as const },
  { title: 'Чат-бот EcoWater', desc: 'Бот в Telegram, который дает советы по экономии воды в быту на каждый день.', type: 'APP' as const },
  { title: 'Умная остановка подачи воды', desc: 'Прототип устройства на базе Arduino, которое автоматически перекрывает кран, если не обнаруживает движения рук в раковине более 2 секунд.', type: 'INVENTION' as const },
  { title: 'Анализ уровня загрязнения реки Сырдарья', desc: 'Сбор проб воды в 5 различных точках реки и анализ на наличие тяжелых металлов и нитратов.', type: 'RESEARCH' as const },
  { title: 'Короткометражка "Однажды без воды"', desc: 'Фильм о том, как мог бы выглядеть день из жизни семьи, если бы в городе отключили воду на 24 часа. Снято на смартфон.', type: 'VIDEO' as const },
  { title: 'Графический дизайн: "Водный баланс"', desc: 'Серия инфографики для социальных сетей, рассказывающая о скрытом "водном следе" при производстве одежды и еды.', type: 'ART' as const },
  { title: 'Приложение-игра "Спаси озеро"', desc: 'Мобильная игра для школьников, где игроку предстоит очищать виртуальное озеро от мусора и улучшать экологию.', type: 'APP' as const },
];

const names = [
  'Алмас К.', 'Дана М.', 'Арман Т.', 'Айгерим С.', 'Дамир Б.', 'Мадина Н.',
  'Ерлан У.', 'Гульмира Д.', 'Самат Ж.', 'Зарина К.', 'Азамат Е.', 'Асель И.'
];

const DUMMY_PDF = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
const DUMMY_VIDEO = 'https://www.w3schools.com/html/mov_bbb.mp4';
const DUMMY_IMG_NEWS = (i: number) => `https://picsum.photos/seed/news${i}/800/400`;
const DUMMY_IMG_PROJECT = (i: number) => `https://picsum.photos/seed/proj${i}/800/600`;

async function main() {
  console.log('🌱 Seeding database...');

  // ── Users ──
  const users = [];
  for (let i = 0; i < names.length; i++) {
    const user = await prisma.user.upsert({
      where: { phone: `+7700${String(i).padStart(7, '0')}` },
      update: { name: names[i] },
      create: { phone: `+7700${String(i).padStart(7, '0')}`, name: names[i], role: 'STUDENT' },
    });
    users.push(user);
  }
  await prisma.user.upsert({
    where: { phone: '+77001111111' },
    update: { name: 'Эксперт ИАЦ', role: 'JURY' },
    create: { phone: '+77001111111', name: 'Эксперт ИАЦ', role: 'JURY' },
  });
  await prisma.user.upsert({
    where: { phone: '+77009999999' },
    update: { name: 'Администратор', role: 'ADMIN' },
    create: { phone: '+77009999999', name: 'Администратор', role: 'ADMIN' },
  });
  console.log(`  ✓ ${users.length} students + jury + admin`);

  // ── Projects + Votes ──
  // First clear old projects to avoid duplicates if re-seeding without recreation
  await prisma.vote.deleteMany({});
  await prisma.project.deleteMany({});

  const projects = [];
  for (let i = 0; i < projectData.length; i++) {
    const pd = projectData[i];
    const project = await prisma.project.create({
      data: {
        title: pd.title, 
        description: pd.desc, 
        type: pd.type,
        status: i < 3 ? 'WINNER' : (i < 8 ? 'APPROVED' : 'PENDING'),
        fileUrl: pd.type !== 'VIDEO' && pd.type !== 'APP' ? DUMMY_PDF : null,
        videoUrl: pd.type === 'VIDEO' ? DUMMY_VIDEO : null,
        thumbnailUrl: DUMMY_IMG_PROJECT(i),
        authorId: users[i % users.length].id,
        schoolName: schools[i % schools.length],
        region: regions[i % regions.length],
        teacherName: teachers[i % teachers.length],
        grade: 7 + (i % 5),
        juryScore: i < 3 ? 9 + (i % 2) : (i < 8 ? 7 + (i % 3) : null),
        juryComment: i < 3 ? 'Отличный проект! Очень актуально.' : (i < 8 ? 'Хорошая работа, но требует доработки.' : null),
      },
    });
    projects.push(project);
  }
  for (const project of projects) {
    if (project.status === 'PENDING') continue;
    const voters = users.filter(u => u.id !== project.authorId).slice(0, 3 + Math.floor(Math.random() * 5));
    for (const voter of voters) {
      try { await prisma.vote.create({ data: { projectId: project.id, userId: voter.id } }); } catch { /* skip */ }
    }
  }
  console.log(`  ✓ ${projects.length} projects + media & votes`);

  // ── Contests ──
  await prisma.contestDocument.deleteMany({});
  await prisma.contestSubmission.deleteMany({});
  await prisma.contest.deleteMany({});

  await prisma.contest.create({
    data: {
      title: 'Конкурс видеороликов «Вода - это жизнь»',
      type: 'ВИДЕОКОНКУРС',
      description: 'Приглашаем учащихся 5-9 классов принять участие в конкурсе видеороликов. Ваша задача — снять короткое видео (до 3 минут), которое расскажет о важности бережного отношения к воде в вашем регионе.',
      rules: 'Видео до 3 минут. Форматы: MP4, AVI, MOV. Макс. размер: 50 МБ.',
      status: 'ACTIVE', deadline: new Date('2026-05-15'),
      documents: { create: [
        { title: 'Положение о конкурсе', fileUrl: DUMMY_PDF, fileSize: '1.2 MB', fileType: 'PDF' },
        { title: 'Шаблон согласия родителей', fileUrl: DUMMY_PDF, fileSize: '45 KB', fileType: 'DOCX' },
      ]},
    },
  });
  await prisma.contest.create({
    data: {
      title: 'Эссе «Мой вклад в спасение Арала»',
      type: 'ЭССЕ',
      description: 'Конкурс творческих работ для студентов колледжей и вузов. Напишите эссе о том, как вы лично можете внести вклад в решение проблемы Аральского моря.',
      rules: 'Объём: 500-1500 слов. Язык: русский или казахский. Формат: PDF или DOCX.',
      status: 'ACTIVE', deadline: new Date('2026-05-20'),
      documents: { create: [
        { title: 'Положение о конкурсе', fileUrl: DUMMY_PDF, fileSize: '980 KB', fileType: 'PDF' },
      ]},
    },
  });
  await prisma.contest.create({
    data: {
      title: 'Фотоконкурс «Живая вода»',
      type: 'ФОТОКОНКУРС',
      description: 'Лучшие фотографии природы родного края, связанные с водными ресурсами.',
      status: 'COMPLETED', deadline: new Date('2026-03-10'),
    },
  });
  console.log('  ✓ 3 contests with documents');

  // ── Materials ──
  await prisma.material.deleteMany({});
  const materials = [
    { title: 'Сборник сценариев экологических уроков для 5-9 классов', description: 'Готовые планы уроков, викторины и практические задания.', format: 'PDF', fileUrl: DUMMY_PDF, fileSize: '2.4 MB', type: 'METHODICAL' as const, audience: 'TEACHER' as const, year: 2024, downloads: 128 },
    { title: 'Презентация «Аральское море: вчера, сегодня, завтра»', description: 'Наглядные материалы для проведения лекций с графиками и картами.', format: 'PPTX', fileUrl: DUMMY_PDF, fileSize: '15.1 MB', type: 'PRESENTATION' as const, audience: 'TEACHER' as const, year: 2024, downloads: 85 },
    { title: 'Брошюра «Как экономить воду дома»', description: 'Текст и структура для печати информационных листовок.', format: 'DOCX', fileUrl: DUMMY_PDF, fileSize: '450 KB', type: 'BOOKLET' as const, audience: 'SCHOOL' as const, year: 2024, downloads: 210 },
    { title: 'Анимационный ролик «Капелька путешествует»', description: 'Обучающий мультфильм для младших классов.', format: 'MP4', fileUrl: DUMMY_VIDEO, fileSize: '45 MB', type: 'VIDEO' as const, audience: 'SCHOOL' as const, year: 2024, views: 540 },
    { title: 'Инфографика «Водный баланс Казахстана»', description: 'Плакат высокого разрешения для школьных стендов.', format: 'PDF', fileUrl: DUMMY_PDF, fileSize: '1.8 MB', type: 'BOOKLET' as const, audience: 'SCHOOL' as const, year: 2024, downloads: 92 },
    { title: 'Таблица учёта водопотребления', description: 'Шаблон для практического задания по замеру расхода воды дома.', format: 'XLSX', fileUrl: DUMMY_PDF, fileSize: '45 KB', type: 'METHODICAL' as const, audience: 'SCHOOL' as const, year: 2024, downloads: 64 },
    { title: 'Методическое пособие «Водный след»', description: 'Полное руководство для учителей по проведению интерактивных уроков об экологическом следе и сохранении воды.', format: 'PDF', fileUrl: DUMMY_PDF, fileSize: '3.2 MB', type: 'METHODICAL' as const, audience: 'TEACHER' as const, year: 2024, downloads: 310, featured: true },
    { title: 'Видеоурок «Круговорот воды в природе»', description: 'Образовательное видео для учеников 3-5 классов.', format: 'MP4', fileUrl: DUMMY_VIDEO, fileSize: '120 MB', type: 'VIDEO' as const, audience: 'SCHOOL' as const, year: 2023, views: 820 },
    { title: 'Буклет «10 фактов о воде в Казахстане»', description: 'Компактный буклет для информационных стендов.', format: 'PDF', fileUrl: DUMMY_PDF, fileSize: '650 KB', type: 'BOOKLET' as const, audience: 'STUDENT' as const, year: 2023, downloads: 145 },
    { title: 'Презентация «Экология водоёмов»', description: 'Материалы для лекций в колледжах и вузах.', format: 'PPTX', fileUrl: DUMMY_PDF, fileSize: '8.5 MB', type: 'PRESENTATION' as const, audience: 'STUDENT' as const, year: 2023, downloads: 67 },
    { title: 'Рабочая тетрадь «Юный эколог»', description: 'Задания и активности по теме водосбережения для 1-4 классов.', format: 'PDF', fileUrl: DUMMY_PDF, fileSize: '5.4 MB', type: 'METHODICAL' as const, audience: 'SCHOOL' as const, year: 2024, downloads: 195 },
    { title: 'Гид для студентов «Водные ресурсы ЦА»', description: 'Обзор водных ресурсов стран Центральной Азии.', format: 'PDF', fileUrl: DUMMY_PDF, fileSize: '4.1 MB', type: 'METHODICAL' as const, audience: 'STUDENT' as const, year: 2023, downloads: 88 },
  ];
  for (const m of materials) { await prisma.material.create({ data: m }); }
  console.log(`  ✓ ${materials.length} materials with media`);

  // ── News ──
  await prisma.news.deleteMany({});
  const news = [
    { title: 'Завершен первый этап внедрения систем капельного орошения в пилотных школах', content: 'В рамках проекта 15 школ Кызылординской области получили оборудование для учебных пришкольных участков.', category: 'NEWS' as const, viewCount: 234, createdAt: new Date('2026-04-28'), imageUrl: DUMMY_IMG_NEWS(1) },
    { title: 'Отчёт по мониторингу потребления воды', content: 'Результаты замеров за 1 квартал 2026 года в 15 пилотных школах Кызылординской области.', category: 'REPORT' as const, fileUrl: DUMMY_PDF, imageUrl: DUMMY_IMG_NEWS(2), viewCount: 89, createdAt: new Date('2026-04-15') },
    { title: 'Вебинар: «Водные ресурсы будущего»', content: 'Запись вебинара с участием экспертов ИАЦ водных ресурсов и представителей ЮНИСЕФ.', category: 'VIDEO' as const, imageUrl: DUMMY_IMG_NEWS(3), viewCount: 412, createdAt: new Date('2026-04-12') },
    { title: 'Фотоотчет: Эко-субботник', content: 'Очистка береговой линии реки Сырдарья. Участвовали более 200 школьников.', category: 'PHOTO' as const, photoCount: 12, imageUrl: DUMMY_IMG_NEWS(4), viewCount: 156, createdAt: new Date('2026-04-10') },
    { title: 'Запуск конкурса экологических плакатов', content: 'Приглашаем всех желающих принять участие в творческом конкурсе.', category: 'NEWS' as const, imageUrl: DUMMY_IMG_NEWS(5), viewCount: 142, createdAt: new Date('2026-04-10') },
    { title: 'Создание приложения WaterTracker KZ', content: 'Ученики Назарбаев Интеллектуальной школы разработали новое приложение для отслеживания расхода воды.', category: 'NEWS' as const, imageUrl: DUMMY_IMG_NEWS(6), viewCount: 450, createdAt: new Date('2026-05-01') },
  ];
  for (const n of news) { await prisma.news.create({ data: n }); }
  console.log(`  ✓ ${news.length} news items with images`);

  console.log('✅ Seed complete!');
  console.log('  Admin:   +77009999999 (OTP: 000000 in dev)');
  console.log('  Jury:    +77001111111');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
