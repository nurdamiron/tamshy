import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#E2EDE9] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#1D9E75] flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C12 2 5 10 5 15a7 7 0 0014 0c0-5-7-13-7-13z" fill="white" />
                </svg>
              </div>
              <span className="text-lg font-bold text-[#111B17]">Тамшы</span>
            </div>
            <p className="text-[14px] text-[#5A7A6E] max-w-md leading-relaxed">
              Республиканский конкурс водных проектов школьников Казахстана.
              Инициатива Министерства водных ресурсов и ирригации РК в рамках
              программы &quot;Адал азамат&quot;.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-caption text-[#5A7A6E] mb-3">Платформа</h4>
            <div className="space-y-2">
              <Link href="/projects" className="block text-[14px] text-[#111B17] hover:text-[#1D9E75] transition-colors">
                Проекты
              </Link>
              <Link href="/regions" className="block text-[14px] text-[#111B17] hover:text-[#1D9E75] transition-colors">
                Регионы
              </Link>
              <Link href="/leaderboard" className="block text-[14px] text-[#111B17] hover:text-[#1D9E75] transition-colors">
                Лидеры
              </Link>
              <Link href="/submit" className="block text-[14px] text-[#111B17] hover:text-[#1D9E75] transition-colors">
                Отправить проект
              </Link>
            </div>
          </div>

          {/* Partners */}
          <div>
            <h4 className="text-caption text-[#5A7A6E] mb-3">Партнёры</h4>
            <div className="space-y-2 text-[14px] text-[#5A7A6E]">
              <p>Министерство водных ресурсов РК</p>
              <p>НАО ИАЦ водных ресурсов</p>
              <p>ЮНИСЕФ Казахстан</p>
              <p>Французское агентство развития</p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#E2EDE9] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-[#5A7A6E]">
            &copy; 2026 Тамшы. Все права защищены.
          </p>
          <p className="text-[13px] text-[#5A7A6E]">
            Разработка:{' '}
            <a
              href="https://alashed.kz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1D9E75] hover:underline"
            >
              alashed.kz
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
