export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="text-center">
        <div className="w-10 h-10 mx-auto mb-4 rounded-lg bg-[#3B82F6] flex items-center justify-center animate-pulse">
          <svg width="20" height="28" viewBox="0 0 20 28" fill="none">
            <path d="M10 0C10 0 0 12 0 18a10 10 0 0020 0C20 12 10 0 10 0z" fill="white" />
          </svg>
        </div>
        <div className="w-48 h-2 bg-[#E2E8F0] rounded-full mx-auto">
          <div className="w-1/2 h-full bg-[#3B82F6] rounded-full animate-[pulse_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}
