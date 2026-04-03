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

export const typeLabelKeys: Record<string, string> = {
  VIDEO: 'VIDEO',
  RESEARCH: 'RESEARCH',
  ART: 'ART',
  INVENTION: 'INVENTION',
  APP: 'APP',
  OTHER: 'OTHER',
};

export const statusLabelKeys: Record<string, string> = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  WINNER: 'WINNER',
};

const defaultTypeLabels: Record<string, string> = {
  VIDEO: 'VIDEO',
  RESEARCH: 'RESEARCH',
  ART: 'ART',
  INVENTION: 'INVENTION',
  APP: 'APP',
  OTHER: 'OTHER',
};

const defaultStatusLabels: Record<string, string> = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  WINNER: 'WINNER',
};

export function getTypeLabel(type: string, translations?: Record<string, string>) {
  if (translations && translations[type]) return translations[type];
  return defaultTypeLabels[type] || type;
}

export function getStatusLabel(status: string, translations?: Record<string, string>) {
  if (translations && translations[status]) return translations[status];
  return defaultStatusLabels[status] || status;
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
