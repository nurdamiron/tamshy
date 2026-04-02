'use client';

import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  showCount?: boolean;
  maxLength?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, showCount, maxLength, value, className = '', id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-[13px] font-medium text-[#111B17]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          value={value}
          maxLength={maxLength}
          className={`
            min-h-[120px] px-3 py-3 rounded-lg border text-[15px]
            bg-white placeholder:text-[#5A7A6E]/50 resize-y
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 focus:border-[#1D9E75]
            ${error ? 'border-red-400' : 'border-[#E2EDE9]'}
            ${className}
          `}
          {...props}
        />
        <div className="flex justify-between">
          {error && <p className="text-[12px] text-red-500">{error}</p>}
          {hint && !error && <p className="text-[12px] text-[#5A7A6E]">{hint}</p>}
          {showCount && maxLength && (
            <p className={`text-[12px] ml-auto ${currentLength >= maxLength ? 'text-red-500' : 'text-[#5A7A6E]'}`}>
              {currentLength}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
export default Textarea;
