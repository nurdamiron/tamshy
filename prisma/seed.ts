import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const regions = [
  'ASTANA', 'ALMATY', 'SHYMKENT', 'AKTOBE', 'KARAGANDA',
  'MANGYSTAU', 'TURKESTAN', 'ZHAMBYL', 'ALMATY_REGION',
  'ATYRAU', 'AKTAU', 'PAVLODAR', 'SEMEY', 'TALDYKORGAN',
  'KYZYLORDA', 'TARAZ', 'PETROPAVLOVSK', 'ORAL', 'KOSTANAY',
] as const;

const schools = [
  'НИШ', 'Школа №1', 'Школа №12', 'Школа №45', 'Гимназия №125',
  'Лицей №2', 'Школа №78', 'Школа №34', 'Гимназия №56', 'НИШ ФМН',
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
  { title: 'Система сбора дождевой воды для школы', desc: 'Проект по установке системы сбора и фильтрации дождевой воды на территории школы. Система включает водостоки, фильтры и накопительный резервуар на 500 литров. Собранная вода используется для полива школьного сада.', type: 'INVENTION' as const, img: 'https://images.unsplash.com/photo-1542382257-80da9fb9f5abc?auto=format&fit=crop&q=80&w=800' },
  { title: 'Документальный фильм "Голос Или"', desc: 'Короткометражный документальный фильм о состоянии реки Или и её значении для экосистемы Алматинской области.', type: 'VIDEO' as const, img: 'https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?auto=format&fit=crop&q=80&w=800' },
  { title: 'Исследование качества воды Каспийского моря', desc: 'Комплексное исследование pH, солёности и загрязнённости воды в прибрежной зоне Актау.', type: 'RESEARCH' as const, img: 'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&q=80&w=800' },
  { title: 'Плакатная серия "Каждая капля на счету"', desc: 'Серия из 10 информационных плакатов о водосбережении для школ Казахстана.', type: 'ART' as const, img: 'https://images.unsplash.com/photo-1550505193-41b1cfac8c8a?auto=format&fit=crop&q=80&w=800' },
  { title: 'Приложение WaterTracker KZ', desc: 'Мобильное приложение для мониторинга и учёта расхода воды в школе.', type: 'APP' as const, img: 'https://images.unsplash.com/photo-1616004655123-818cbd4efaec?auto=format&fit=crop&q=80&w=800' },
  { title: 'Макет системы капельного орошения', desc: 'Работающий макет системы капельного орошения для школьного огорода.', type: 'INVENTION' as const, img: 'https://images.unsplash.com/photo-1596486047123-b67def9ebccc?auto=format&fit=crop&q=80&w=800' },
  { title: 'Сравнение методов фильтрации', desc: 'Исследовательский проект, в котором мы сравнили эффективность угольного фильтра, песка и керамических фильтров для очистки речной воды.', type: 'RESEARCH' as const, img: 'https://images.unsplash.com/photo-1582210874313-91bce9fcfec4?auto=format&fit=crop&q=80&w=800' },
  { title: 'Анимационный ролик об очистке озер', desc: 'Двухминутная анимация, объясняющая младшим школьникам важность сохранения чистоты пресноводных водоемов.', type: 'VIDEO' as const, img: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=800' },
  { title: 'Рисунок "Живая капля"', desc: 'Художественная работа, отражающая важность каждой капли воды в пустынных регионах.', type: 'ART' as const, img: 'https://images.unsplash.com/photo-1527066236128-2ff79f7b9705?auto=format&fit=crop&q=80&w=800' },
  { title: 'Чат-бот EcoWater', desc: 'Бот в Telegram, который дает советы по экономии воды в быту на каждый день.', type: 'APP' as const, img: 'https://images.unsplash.com/photo-1592656094267-764a45160876?auto=format&fit=crop&q=80&w=800' },
  { title: 'Умная остановка подачи воды', desc: 'Прототип устройства на базе Arduino, которое автоматически перекрывает кран, если не обнаруживает движения рук в раковине более 2 секунд.', type: 'INVENTION' as const, img: 'https://images.unsplash.com/photo-1525087740718-9e0f2c58c7ef?auto=format&fit=crop&q=80&w=800' },
  { title: 'Анализ уровня загрязнения реки Сырдарья', desc: 'Сбор проб воды в 5 различных точках реки и анализ на наличие тяжелых металлов и нитратов.', type: 'RESEARCH' as const, img: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&q=80&w=800' },
  { title: 'Короткометражка "Однажды без воды"', desc: 'Фильм о том, как мог бы выглядеть день из жизни семьи, если бы в городе отключили воду на 24 часа. Снято на смартфон.', type: 'VIDEO' as const, img: 'https://images.unsplash.com/photo-1538460775895-7170a7bb0de2?auto=format&fit=crop&q=80&w=800' },
  { title: 'Графический дизайн: "Водный баланс"', desc: 'Серия инфографики для социальных сетей, рассказывающая о скрытом "водном следе" при производстве одежды и еды.', type: 'ART' as const, img: 'https://images.unsplash.com/photo-1506544777-64cfbe1142df?auto=format&fit=crop&q=80&w=800' },
  { title: 'Приложение-игра "Спаси озеро"', desc: 'Мобильная игра для школьников, где игроку предстоит очищать виртуальное озеро от мусора и улучшать экологию.', type: 'APP' as const, img: 'https://images.unsplash.com/photo-1457639598858-eb5cf2d689b9?auto=format&fit=crop&q=80&w=800' },
];

const names = [
  'Алмас К.', 'Дана М.', 'Арман Т.', 'Айгерим С.', 'Дамир Б.', 'Мадина Н.',
  'Ерлан У.', 'Гульмира Д.', 'Самат Ж.', 'Зарина К.', 'Азамат Е.', 'Асель И.'
];

const DUMMY_PDF = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
const DUMMY_VIDEO = 'https://www.w3schools.com/html/mov_bbb.mp4';
const DUMMY_IMG_CONTEST_1 = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800'; // water splash
const DUMMY_IMG_CONTEST_2 = 'https://images.unsplash.com/photo-1469122312224-c5846569feb1?auto=format&fit=crop&q=80&w=800'; // aral sea vibe
const DUMMY_IMG_CONTEST_3 = 'https://images.unsplash.com/photo-1423483641154-5411ec9c0ddf?auto=format&fit=crop&q=80&w=800'; // water photography
const NEWS_IMAGES = [
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1510442650500-93217e634e4c?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1504363082875-9612defcedeb?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1457639598858-eb5cf2d689b9?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1521998522336-7ebaf6af651e?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200',
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
        thumbnailUrl: pd.img,
        authorId: users[i % users.length].id,
        schoolName: schools[i % schools.length],
        region: regions[i % regions.length],
        teacherName: teachers[i % teachers.length],
        grade: 7 + (i % 5),
        juryScore: i < 3 ? 9 + (i % 2) : (i < 8 ? 7 + (i % 3) : null),
        juryComment: i < 3 ? 'Отличный проект! Очень актуально для водного сектора.' : (i < 8 ? 'Хорошая работа, но требует доработки.' : null),
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
  console.log(`  ✓ ${projects.length} projects + water media & votes`);

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
      imageUrl: DUMMY_IMG_CONTEST_1,
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
      imageUrl: DUMMY_IMG_CONTEST_2,
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
      imageUrl: DUMMY_IMG_CONTEST_3,
    },
  });
  console.log('  ✓ 3 water contests with covers');

  // ── Materials ──
  await prisma.material.deleteMany({});
  const materialImages = [
    'https://images.unsplash.com/photo-1464638706318-c2b4fe8d3637?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1542382257-80da9fb9f5abc?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1510442650500-93217e634e4c?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?auto=format&fit=crop&q=80&w=800'
  ];

  const materials = [
    {
      title: 'Сборник сценариев экологических уроков для 5-9 классов',
      description:
        'Полный комплект из 12 уроков по темам: круговорот воды в природе, рациональное потребление, переработка и повторное использование. К каждому уроку приложены листы заданий, вопросы для обсуждения и идеи для практических работ. Материал согласован с типовыми программами и подходит для смешанного обучения.',
      format: 'PDF',
      fileUrl: DUMMY_PDF,
      fileSize: '2.4 MB',
      type: 'METHODICAL' as const,
      audience: 'TEACHER' as const,
      year: 2024,
      downloads: 128,
      imageUrl: materialImages[0],
    },
    {
      title: 'Презентация «Аральское море: вчера, сегодня, завтра»',
      description:
        'Наглядная презентация на 40 слайдов с картами, графиками динамики уровня воды и фотографиями региона. В конце — блок для дискуссии о роли молодёжи в восстановлении экосистемы. Удобно показывать на интерактивной доске или проекторе.',
      format: 'PPTX',
      fileUrl: DUMMY_PDF,
      fileSize: '15.1 MB',
      type: 'PRESENTATION' as const,
      audience: 'TEACHER' as const,
      year: 2024,
      downloads: 85,
      imageUrl: materialImages[1],
    },
    {
      title: 'Брошюра «Как экономить воду дома»',
      description:
        'Краткая брошюра для семей: душ вместо ванны, ремонт протечек, сбор дождевой воды для полива, выбор техники класса A. Простой язык, иллюстрации и чек-лист «10 шагов на неделю». Можно распечатать и раздать на родительских собраниях.',
      format: 'DOCX',
      fileUrl: DUMMY_PDF,
      fileSize: '450 KB',
      type: 'BOOKLET' as const,
      audience: 'SCHOOL' as const,
      year: 2024,
      downloads: 210,
      imageUrl: materialImages[2],
    },
    {
      title: 'Анимационный ролик «Капелька путешествует»',
      description:
        'Обучающий мультфильм для младших классов о пути капли от облака до крана. Длительность 6 минут, закадровый голос на русском и казахском. Идеально для урока окружающего мира или внеурочного мероприятия.',
      format: 'MP4',
      fileUrl: DUMMY_VIDEO,
      fileSize: '45 MB',
      type: 'VIDEO' as const,
      audience: 'SCHOOL' as const,
      year: 2024,
      views: 540,
      imageUrl: materialImages[3],
    },
    {
      title: 'Инфографика «Водный баланс Казахстана»',
      description:
        'Плакат А2 в высоком разрешении: доля поверхностных и подземных вод, секторы потребления, сравнение с соседними странами. Подходит для оформления кабинета биологии и школьных выставок.',
      format: 'PDF',
      fileUrl: DUMMY_PDF,
      fileSize: '1.8 MB',
      type: 'BOOKLET' as const,
      audience: 'SCHOOL' as const,
      year: 2024,
      downloads: 92,
      imageUrl: materialImages[0],
    },
    {
      title: 'Методическое пособие «Водный след»',
      description:
        'Руководство для педагогов: как объяснить ученикам понятие водного следа продукта, провести лабораторную на измерение расхода воды и организовать проектную неделю. Включены рубрики оценивания и примеры рубрик.',
      format: 'PDF',
      fileUrl: DUMMY_PDF,
      fileSize: '3.2 MB',
      type: 'METHODICAL' as const,
      audience: 'TEACHER' as const,
      year: 2024,
      downloads: 310,
      featured: true,
      imageUrl: materialImages[1],
    },
  ];
  for (const m of materials) { await prisma.material.create({ data: m }); }
  console.log(`  ✓ ${materials.length} specific water materials`);

  // ── News ──
  await prisma.news.deleteMany({});
  const news = [
    {
      title: 'Завершён первый этап внедрения систем капельного орошения в школах',
      content:
        'В рамках инициативы Tamshy пятнадцать школ в шести регионах получили комплекты оборудования для капельного полива школьных огородов и зелёных зон.\n\nУчителя биологии и завхозы прошли очное обучение: монтаж линий, настройка таймеров, учёт расхода воды по счётчикам. По предварительным данным, расход поливной воды снизился в среднем на 35% по сравнению с дождеванием из шланга.\n\nВо втором полугодии планируется масштабирование ещё на 20 школ — заявки уже принимаются через региональные координаторы.',
      category: 'NEWS' as const,
      viewCount: 234,
      createdAt: new Date('2026-04-28'),
      imageUrl: NEWS_IMAGES[0],
    },
    {
      title: 'Отчёт по мониторингу потребления воды в пилотных школах',
      content:
        'За первый квартал 2026 года в пятнадцати пилотных школах проводились ежемесячные замеры по счётчикам на вводе, а также выборочный аудит санузлов и пищеблоков.\n\nОтчёт включает сводные таблицы, сравнение с аналогичным периодом прошлого года и рекомендации: где чаще всего возникают «скрытые» потери (протечки арматуры, оставленный открытым кран).\n\nПриложение PDF содержит методику замеров — её можно использовать и в других учреждениях.',
      category: 'REPORT' as const,
      fileUrl: DUMMY_PDF,
      imageUrl: NEWS_IMAGES[1],
      viewCount: 89,
      createdAt: new Date('2026-04-15'),
    },
    {
      title: 'Вебинар «Водные ресурсы будущего»',
      content:
        'Запись онлайн-встречи с экспертами ИАЦ водных ресурсов и приглашённым экологом. Разобраны темы: изменение климата в Центральной Азии, роль школьных проектов в формировании привычек водосбережения, ответы на вопросы учителей из чата.\n\nДлительность записи — 1 час 12 минут. Рекомендуем использовать фрагменты на классных часах и при подготовке к конкурсам.',
      category: 'VIDEO' as const,
      imageUrl: NEWS_IMAGES[2],
      viewCount: 412,
      createdAt: new Date('2026-04-12'),
    },
    {
      title: 'Фотоотчёт: эко-субботник на берегу Сырдарьи',
      content:
        'Более двухсот школьников и волонтёров вышли на очистку прибрежной полосы в пригороде. Собраны пластик, стекло и бытовой мусор; отдельно взвешены объёмы для отчёта местным властям.\n\nПараллельно работала «экопросветительская» зона: викторина о реке, мастер-класс по сортировке отходов. Фотогалерея из двенадцати кадров — в материалах мероприятия.',
      category: 'PHOTO' as const,
      photoCount: 12,
      imageUrl: NEWS_IMAGES[3],
      viewCount: 156,
      createdAt: new Date('2026-04-10'),
    },
    {
      title: 'Запущен республиканский конкурс экологических плакатов',
      content:
        'Принимаем работы от учеников 5–11 классов в цифровом и печатном формате. Темы: рациональное использование воды, охрана рек и озёр Казахстана, личный вклад каждого.\n\nЖюри оценит оригинальность идеи, ясность посыла и качество исполнения. Победители получат дипломы и призы от партнёров проекта; лучшие работы войдут в выставку на финальном мероприятии сезона.',
      category: 'NEWS' as const,
      imageUrl: NEWS_IMAGES[4],
      viewCount: 142,
      createdAt: new Date('2026-04-10'),
    },
    {
      title: 'Школьники представили приложение WaterTracker KZ',
      content:
        'Команда учеников Назарбаев Интеллектуальной школы представила прототип мобильного приложения для учёта расхода воды в учебном корпусе: ручной ввод показаний, напоминания о проверке кранов, простая геймификация для классов.\n\nПроект прошёл предварительное ревью у методистов Tamshy. Следующий шаг — пилот на одной школе с подключением к реальным счётчикам.',
      category: 'NEWS' as const,
      imageUrl: NEWS_IMAGES[5],
      viewCount: 450,
      createdAt: new Date('2026-05-01'),
    },
    {
      title: 'Стартовала школьная неделя воды: лекции и квесты',
      content:
        'С 5 по 9 мая в партнёрских школах пройдут тематические линейки, квест «Найди утечку» по кабинетам и мини-олимпиада по фактам о воде Казахстана.\n\nМатериалы для учителей (сценарии, презентации) выложены в разделе «Медиатека». Участие добровольное; по итогам недели классы получат сертификаты.',
      category: 'NEWS' as const,
      imageUrl: NEWS_IMAGES[6],
      viewCount: 198,
      createdAt: new Date('2026-05-03'),
    },
    {
      title: 'Аналитический отчёт: вода в сельских школах',
      content:
        'Документ подготовлен по итогам анкетирования завхозов и интервью с директорами в восьми районах. Основные выводы: износ внутренних сетей, необходимость обучения персонала быстрой локализации протечек, экономия за счёт установки смесителей с аэраторами.\n\nВ приложении — таблицы по регионам и перечень типовых решений с ориентировочной стоимостью.',
      category: 'REPORT' as const,
      fileUrl: DUMMY_PDF,
      imageUrl: NEWS_IMAGES[7],
      viewCount: 76,
      createdAt: new Date('2026-04-22'),
    },
    {
      title: 'Видеоинструкция: как провести аудит воды в классе',
      content:
        'Короткий ролик для классных руководителей: чек-лист на один урок, как снять показания, как оформить результаты для школьного экологического дневника.\n\nСъёмка проходила в действующей школе-партнёре; в комментариях — тайм-коды на разделы.',
      category: 'VIDEO' as const,
      imageUrl: NEWS_IMAGES[8],
      viewCount: 301,
      createdAt: new Date('2026-04-08'),
    },
    {
      title: 'Фотодокументация: высадка деревьев у школы в Туркестане',
      content:
        'Волонтёрская акция совместно с местным акиматом: высажено более ста саженцев вдоль спортивной площадки. Полив организован из накопителя дождевой воды — установленного в рамках прошлогоднего гранта.\n\nВ альбоме 18 фотографий; отдельный блок — комментарии школьников о том, зачем важен зелёный бордер в засушливом климате.',
      category: 'PHOTO' as const,
      photoCount: 18,
      imageUrl: NEWS_IMAGES[9],
      viewCount: 223,
      createdAt: new Date('2026-04-05'),
    },
    {
      title: 'Подведены итоги зимнего онлайн-марафона «Капля знаний»',
      content:
        'За три недели участники прошли 21 короткий тест по темам гидрологии и бытового водосбережения. В лидерах — школы Караганды и Павлодара.\n\nПобедители награждены электронными сертификатами; топ-50 идей для классных часов опубликован в новостной рассылке для педагогов.',
      category: 'NEWS' as const,
      imageUrl: NEWS_IMAGES[10],
      viewCount: 512,
      createdAt: new Date('2026-03-28'),
    },
    {
      title: 'Отчёт о расходе воды на школьных кухнях (пилот)',
      content:
        'Сравнение режимов работы пищеблоков до и после внедрения графиков замачивания и посудомоечных циклов. Выявлено до 18% экономии горячей воды без ухудшения санитарных показателей.\n\nPDF содержит рекомендации для завхозов и шаблон графика для столовой на 300 порций.',
      category: 'REPORT' as const,
      fileUrl: DUMMY_PDF,
      imageUrl: NEWS_IMAGES[11],
      viewCount: 64,
      createdAt: new Date('2026-03-15'),
    },
  ];
  for (const n of news) { await prisma.news.create({ data: n }); }
  console.log(`  ✓ ${news.length} relevant real-image news items`);

  console.log('✅ Seed complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
