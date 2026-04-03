import BrandLogo from '@/components/brand/BrandLogo';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="text-center">
        <div className="w-11 h-11 mx-auto mb-4 rounded-xl overflow-hidden flex items-center justify-center animate-pulse ring-1 ring-[#E2E8F0]">
          <BrandLogo size={44} className="w-full h-full" />
        </div>
        <div className="w-48 h-2 bg-[#E2E8F0] rounded-full mx-auto">
          <div className="w-1/2 h-full bg-[#3B82F6] rounded-full animate-[pulse_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}
