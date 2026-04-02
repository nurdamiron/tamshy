import { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glass' | 'gradient-border';
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({
  children,
  hover = true,
  padding = 'md',
  variant = 'default',
  className = '',
  ...props
}: CardProps) {
  if (variant === 'gradient-border') {
    return (
      <div
        className={`rounded-2xl p-[1px] bg-gradient-to-br from-[#0284C7] via-[#38BDF8] to-[#F59E0B] opacity-60 hover:opacity-100 transition-opacity duration-300 ${className}`}
        {...props}
      >
        <div className={`bg-white rounded-[15px] ${paddingStyles[padding]} h-full`}>
          {children}
        </div>
      </div>
    );
  }

  if (variant === 'glass') {
    return (
      <div
        className={`
          bg-white/70 backdrop-blur-xl rounded-2xl
          border border-white/20
          shadow-[0_4px_24px_rgba(0,0,0,0.04)]
          ${hover ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:bg-white/80' : ''}
          ${paddingStyles[padding]}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={`
        bg-white rounded-2xl
        border border-[#E2E8F0]/60
        shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)]
        ${hover ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] hover:border-[#93C5FD]/60' : ''}
        ${paddingStyles[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
