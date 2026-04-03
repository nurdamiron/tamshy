export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-[13px] text-[#64748B]">Загрузка...</p>
      </div>
    </div>
  );
}
