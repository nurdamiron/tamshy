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
];

const teachers = [
  'Айгуль Сериковна', 'Бакытжан Серикович', 'Марат Нурланович',
  'Дина Ермековна', 'Ерлан Канатович', 'Асия Бауржановна',
  'Нурлан Маратович', 'Гульнара Оразовна', 'Тимур Аскарович',
];

const projectData = [
  { title: 'Система сбора дождевой воды для школы', desc: 'Проект по установке системы сбора и фильтрации дождевой воды на территории школы. Система включает водостоки, фильтры и накопительный резервуар на 500 литров. Собранная вода используется для полива школьного сада и мытья полов. За 3 месяца тестирования экономия составила 30% от общего потребления воды школой.', type: 'INVENTION' as const },
  { title: 'Документальный фильм "Голос Или"', desc: 'Короткометражный документальный фильм о состоянии реки Или и её значении для экосистемы Алматинской области.', type: 'VIDEO' as const },
  { title: 'Исследование качества воды Каспийского моря', desc: 'Комплексное исследование pH, солёности и загрязнённости воды в прибрежной зоне Актау.', type: 'RESEARCH' as const },
  { title: 'Плакатная серия "Каждая капля на счету"', desc: 'Серия из 10 информационных плакатов о водосбережении для школ Казахстана.', type: 'ART' as const },
  { title: 'Приложение WaterTracker KZ', desc: 'Мобильное приложение для мониторинга и учёта расхода воды в школе.', type: 'APP' as const },
  { title: 'Макет системы капельного орошения', desc: 'Работающий макет системы капельного орошения для школьного огорода.', type: 'INVENTION' as const },
];

const names = [
  'Алмас К.', 'Дана М.', 'Арман Т.', 'Айгерим С.', 'Дамир Б.', 'Мадина Н.',
];

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
  const projects = [];
  for (let i = 0; i < projectData.length; i++) {
    const pd = projectData[i];
    const project = await prisma.project.create({
      data: {
        title: pd.title, description: pd.desc, type: pd.type,
        status: i < 2 ? 'WINNER' : 'APPROVED',
        authorId: users[i % users.length].id,
        schoolName: schools[i % schools.length],
        region: regions[i % regions.length],
        teacherName: teachers[i % teachers.length],
        grade: 7 + (i % 5),
        juryScore: i < 2 ? 9 : null,
        juryComment: i < 2 ? 'Отличный проект!' : null,
      },
    });
    projects.push(project);
  }
  for (const project of projects) {
    const voters = users.filter(u => u.id !== project.authorId).slice(0, 3 + Math.floor(Math.random() * 5));
    for (const voter of voters) {
      try { await prisma.vote.create({ data: { projectId: project.id, userId: voter.id } }); } catch { /* skip */ }
    }
  }
  console.log(`  ✓ ${projects.length} projects + votes`);

  // ── Contests ──
  await prisma.contest.create({
    data: {
      title: 'Конкурс видеороликов «Вода - это жизнь»',
      type: 'ВИДЕОКОНКУРС',
      description: 'Приглашаем учащихся 5-9 классов принять участие в конкурсе видеороликов. Ваша задача — снять короткое видео (до 3 минут), которое расскажет о важности бережного отношения к воде в вашем регионе.',
      rules: 'Видео до 3 минут. Форматы: MP4, AVI, MOV. Макс. размер: 50 МБ.',
      status: 'ACTIVE', deadline: new Date('2026-05-15'),
      documents: { create: [
        { title: 'Положение о конкурсе', fileUrl: '#', fileSize: '1.2 MB', fileType: 'PDF' },
        { title: 'Шаблон согласия родителей', fileUrl: '#', fileSize: '45 KB', fileType: 'DOCX' },
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
        { title: 'Положение о конкурсе', fileUrl: '#', fileSize: '980 KB', fileType: 'PDF' },
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
  console.log('  ✓ 3 contests');

  // ── Materials ──
  const materials = [
    { title: 'Сборник сценариев экологических уроков для 5-9 классов', description: 'Готовые планы уроков, викторины и практические задания.', format: 'PDF', fileUrl: '#', fileSize: '2.4 MB', type: 'METHODICAL' as const, audience: 'TEACHER' as const, year: 2024, downloads: 128 },
    { title: 'Презентация «Аральское море: вчера, сегодня, завтра»', description: 'Наглядные материалы для проведения лекций с графиками и картами.', format: 'PPTX', fileUrl: '#', fileSize: '15.1 MB', type: 'PRESENTATION' as const, audience: 'TEACHER' as const, year: 2024, downloads: 85 },
    { title: 'Брошюра «Как экономить воду дома»', description: 'Текст и структура для печати информационных листовок.', format: 'DOCX', fileUrl: '#', fileSize: '450 KB', type: 'BOOKLET' as const, audience: 'SCHOOL' as const, year: 2024, downloads: 210 },
    { title: 'Анимационный ролик «Капелька путешествует»', description: 'Обучающий мультфильм для младших классов.', format: 'MP4', fileUrl: '#', fileSize: '45 MB', type: 'VIDEO' as const, audience: 'SCHOOL' as const, year: 2024, views: 540 },
    { title: 'Инфографика «Водный баланс Казахстана»', description: 'Плакат высокого разрешения для школьных стендов.', format: 'PDF', fileUrl: '#', fileSize: '1.8 MB', type: 'BOOKLET' as const, audience: 'SCHOOL' as const, year: 2024, downloads: 92 },
    { title: 'Таблица учёта водопотребления', description: 'Шаблон для практического задания по замеру расхода воды дома.', format: 'XLSX', fileUrl: '#', fileSize: '45 KB', type: 'METHODICAL' as const, audience: 'SCHOOL' as const, year: 2024, downloads: 64 },
    { title: 'Методическое пособие «Водный след»', description: 'Полное руководство для учителей по проведению интерактивных уроков об экологическом следе и сохранении воды.', format: 'PDF', fileUrl: '#', fileSize: '3.2 MB', type: 'METHODICAL' as const, audience: 'TEACHER' as const, year: 2024, downloads: 310, featured: true },
    { title: 'Видеоурок «Круговорот воды в природе»', description: 'Образовательное видео для учеников 3-5 классов.', format: 'MP4', fileUrl: '#', fileSize: '120 MB', type: 'VIDEO' as const, audience: 'SCHOOL' as const, year: 2023, views: 820 },
    { title: 'Буклет «10 фактов о воде в Казахстане»', description: 'Компактный буклет для информационных стендов.', format: 'PDF', fileUrl: '#', fileSize: '650 KB', type: 'BOOKLET' as const, audience: 'STUDENT' as const, year: 2023, downloads: 145 },
    { title: 'Презентация «Экология водоёмов»', description: 'Материалы для лекций в колледжах и вузах.', format: 'PPTX', fileUrl: '#', fileSize: '8.5 MB', type: 'PRESENTATION' as const, audience: 'STUDENT' as const, year: 2023, downloads: 67 },
    { title: 'Рабочая тетрадь «Юный эколог»', description: 'Задания и активности по теме водосбережения для 1-4 классов.', format: 'PDF', fileUrl: '#', fileSize: '5.4 MB', type: 'METHODICAL' as const, audience: 'SCHOOL' as const, year: 2024, downloads: 195 },
    { title: 'Гид для студентов «Водные ресурсы ЦА»', description: 'Обзор водных ресурсов стран Центральной Азии.', format: 'PDF', fileUrl: '#', fileSize: '4.1 MB', type: 'METHODICAL' as const, audience: 'STUDENT' as const, year: 2023, downloads: 88 },
  ];
  for (const m of materials) { await prisma.material.create({ data: m }); }
  console.log(`  ✓ ${materials.length} materials`);

  // ── News ──
  const news = [
    { title: 'Завершен первый этап внедрения систем капельного орошения в пилотных школах', content: 'В рамках проекта 15 школ Кызылординской области получили оборудование для учебных пришкольных участков.', category: 'NEWS' as const, viewCount: 234, createdAt: new Date('2026-04-28') },
    { title: 'Отчёт по мониторингу потребления воды', content: 'Результаты замеров за 1 квартал 2026 года в 15 пилотных школах Кызылординской области.', category: 'REPORT' as const, fileUrl: '#', viewCount: 89, createdAt: new Date('2026-04-15') },
    { title: 'Вебинар: «Водные ресурсы будущего»', content: 'Запись вебинара с участием экспертов ИАЦ водных ресурсов и представителей ЮНИСЕФ.', category: 'VIDEO' as const, viewCount: 412, createdAt: new Date('2026-04-12') },
    { title: 'Фотоотчет: Эко-субботник', content: 'Очистка береговой линии реки Сырдарья. Участвовали более 200 школьников.', category: 'PHOTO' as const, photoCount: 12, viewCount: 156, createdAt: new Date('2026-04-10') },
    { title: 'Запуск конкурса экологических плакатов', content: 'Приглашаем всех желающих принять участие в творческом конкурсе.', category: 'NEWS' as const, viewCount: 142, createdAt: new Date('2026-04-10') },
  ];
  for (const n of news) { await prisma.news.create({ data: n }); }
  console.log(`  ✓ ${news.length} news`);

  console.log('✅ Seed complete!');
  console.log('  Admin:   +77009999999 (OTP: 000000 in dev)');
  console.log('  Jury:    +77001111111');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
