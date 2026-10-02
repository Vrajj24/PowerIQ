import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  leftIcon,
  type = 'text',
  className = '',
  id,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full flex flex-col gap-1 text-left">
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-ink tracking-wide">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 text-muted flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={id}
          type={inputType}
          aria-invalid={!!error}
          aria-describedby={error && id ? `${id}-error` : undefined}
          className={`w-full bg-paper border text-xs text-ink placeholder:text-muted rounded-sm py-2 transition-all duration-150 outline-none
            ${leftIcon ? 'pl-9' : 'pl-3'}
            ${isPassword ? 'pr-9' : 'pr-3'}
            ${error
              ? 'border-rose-200/80 focus:border-rose-200 focus:ring-1 focus:ring-rose-500'
              : 'border-line focus:border-line focus:ring-1 focus:ring-accent'
            }
            ${className}
          `}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3 text-muted hover:text-ink flex items-center"
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>

      {error && (
        <p id={id ? `${id}-error` : undefined} className="text-[11px] text-rose-700 mt-0.5 font-normal">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
