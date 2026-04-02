'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-[#0284C7] text-white hover:bg-[#0369A1] active:bg-[#075985] shadow-[0_2px_8px_rgba(2,132,199,0.3)] hover:shadow-[0_4px_16px_rgba(2,132,199,0.4)]',
  secondary: 'border border-[#0284C7] text-[#0284C7] hover:bg-[#E0F2FE] active:bg-[#BAE6FD]',
  ghost: 'text-[#64748B] hover:bg-[#F8FAFC] active:bg-[#E2E8F0]',
  danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-[0_2px_8px_rgba(239,68,68,0.3)]',
};

const sizeStyles: Record<Size, string> = {
  sm: 'h-[34px] px-3.5 text-[13px]',
  md: 'h-[40px] px-5 text-[14px]',
  lg: 'h-[46px] px-7 text-[15px]',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'lg', loading, disabled, children, className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          relative inline-flex items-center justify-center gap-2 rounded-xl font-semibold
          transition-all duration-300 cursor-pointer overflow-hidden
          active:scale-[0.98]
          disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      >
        {variant === 'primary' && !loading && (
          <span className="absolute inset-0 overflow-hidden rounded-xl">
            <span className="absolute inset-0 w-[200%] bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </span>
        )}
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
