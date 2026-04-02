interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-[32px] font-bold tracking-tight text-[#111B17]">{title}</h1>
      {subtitle && (
        <p className="mt-2 text-[15px] text-[#5A7A6E] max-w-2xl">{subtitle}</p>
      )}
    </div>
  );
}
