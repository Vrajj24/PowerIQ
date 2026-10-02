import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-medium tracking-wide transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-ink hover:bg-accent text-paper font-semibold border border-ink shadow-sm active:scale-[0.98]',
    secondary: 'bg-surface-muted hover:bg-line text-ink font-medium border border-line active:scale-[0.98]',
    outline: 'bg-transparent hover:bg-surface-muted/60 text-ink border border-line active:scale-[0.98]',
    danger: 'bg-rose-100/60 hover:bg-rose-100/80 text-rose-700 border border-rose-200/80 active:scale-[0.98]',
    ghost: 'bg-transparent hover:bg-surface-muted/40 text-ink hover:text-ink border-none',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-sm',
    md: 'px-4 py-2 text-xs rounded-sm',
    lg: 'px-5 py-2.5 text-sm rounded-sm',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Processing...
        </>
      ) : children}
    </button>
  );
};
