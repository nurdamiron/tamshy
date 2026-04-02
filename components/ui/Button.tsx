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
  primary: 'bg-[#0284C7] text-white hover:bg-[#0369A1] active:bg-[#0A5A48]',
  secondary: 'border border-[#0284C7] text-[#0284C7] hover:bg-[#E0F2FE] active:bg-[#D0EDE3]',
  ghost: 'text-[#64748B] hover:bg-[#F8FAFC] active:bg-[#E2E8F0]',
  danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
};

const sizeStyles: Record<Size, string> = {
  sm: 'h-[34px] px-3 text-[13px]',
  md: 'h-[38px] px-4 text-[14px]',
  lg: 'h-[44px] px-6 text-[15px]',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'lg', loading, disabled, children, className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          inline-flex items-center justify-center gap-2 rounded-lg font-medium
          transition-all duration-200 cursor-pointer
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
