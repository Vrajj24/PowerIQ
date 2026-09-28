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
        <label htmlFor={id} className="text-xs font-medium text-slate-300 tracking-wide">
          {label}
        </label>
      )}
      
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 text-slate-400 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          id={id}
          type={inputType}
          className={`w-full bg-[#0d121d] border text-xs text-slate-100 placeholder:text-slate-500 rounded-lg py-2 transition-all duration-150 outline-none
            ${leftIcon ? 'pl-9' : 'pl-3'}
            ${isPassword ? 'pr-9' : 'pr-3'}
            ${error 
              ? 'border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' 
              : 'border-[#1e293b] focus:border-slate-400 focus:ring-1 focus:ring-slate-400'
            }
            ${className}
          `}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-slate-400 hover:text-slate-200 flex items-center"
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>

      {error && (
        <p className="text-[11px] text-rose-400 mt-0.5 font-normal">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
