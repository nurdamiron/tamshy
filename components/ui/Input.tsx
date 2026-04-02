'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-[13px] font-medium text-[#111B17]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            h-[44px] px-3 rounded-lg border text-[15px]
            bg-white placeholder:text-[#5A7A6E]/50
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75]
            ${error ? 'border-red-400' : 'border-[#E2EDE9]'}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-[12px] text-red-500">{error}</p>}
        {hint && !error && <p className="text-[12px] text-[#5A7A6E]">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
