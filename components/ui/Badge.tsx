import { ReactNode } from 'react';

type BadgeVariant = 'video' | 'research' | 'art' | 'invention' | 'app' | 'other' | 'pending' | 'approved' | 'rejected' | 'winner';

interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  video: 'bg-blue-50 text-blue-700',
  research: 'bg-purple-50 text-purple-700',
  art: 'bg-amber-50 text-amber-700',
  invention: 'bg-orange-50 text-orange-700',
  app: 'bg-teal-50 text-teal-700',
  other: 'bg-gray-50 text-gray-700',
  pending: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  approved: 'bg-green-50 text-green-700 border border-green-200',
  rejected: 'bg-red-50 text-red-700 border border-red-200',
  winner: 'bg-amber-50 text-amber-700 border border-amber-200',
};

const typeLabels: Record<string, string> = {
  VIDEO: 'Видео',
  RESEARCH: 'Исследование',
  ART: 'Арт',
  INVENTION: 'Изобретение',
  APP: 'Приложение',
  OTHER: 'Другое',
};

const statusLabels: Record<string, string> = {
  PENDING: 'На модерации',
  APPROVED: 'Одобрен',
  REJECTED: 'Отклонён',
  WINNER: 'Победитель',
};

export function getTypeLabel(type: string) {
  return typeLabels[type] || type;
}

export function getStatusLabel(status: string) {
  return statusLabels[status] || status;
}

export default function Badge({ variant, children, className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-[20px]
        text-[12px] font-medium leading-5
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
