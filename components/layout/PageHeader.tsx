interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-[32px] font-bold tracking-tight text-[#0F172A]">{title}</h1>
      {subtitle && (
        <p className="mt-2 text-[15px] text-[#64748B] max-w-2xl">{subtitle}</p>
      )}
    </div>
  );
}
