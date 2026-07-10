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
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label htmlFor={id} className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">
          {label}
        </label>
      )}
      
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 text-slate-500 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          id={id}
          type={inputType}
          className={`w-full bg-white border-2 text-xs text-slate-900 placeholder:text-slate-400 rounded-lg py-2.5 transition-all duration-150 outline-none
            ${leftIcon ? 'pl-9' : 'pl-3.5'}
            ${isPassword ? 'pr-9' : 'pr-3.5'}
            ${error 
              ? 'border-rose-600 focus:shadow-[2px_2px_0px_0px_rgba(153,27,27,1)]' 
              : 'border-slate-900 focus:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
            }
            ${className}
          `}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-slate-400 hover:text-slate-700 flex items-center"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {error && (
        <p className="text-[10px] text-rose-700 mt-0.5 font-bold tracking-wide">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
