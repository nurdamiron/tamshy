import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#F0F9FF] via-white to-[#F8FAFC]">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-center mx-auto mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
        </div>
        <h1 className="text-[64px] font-black text-[#0284C7] leading-none mb-2">404</h1>
        <h2 className="text-[22px] font-bold text-[#0F172A] mb-3">Бет табылмады</h2>
        <p className="text-[15px] text-[#64748B] mb-8 leading-relaxed">
          Сіз іздеген бет жоқ немесе жойылған.<br/>
          Басты бетке оралып қайта байқап көріңіз.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0284C7] text-white
            text-[15px] font-semibold hover:bg-[#0369A1] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Басты бетке оралу
        </Link>
      </div>
    </div>
  );
}
