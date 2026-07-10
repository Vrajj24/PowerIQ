import React from 'react';
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: number;
  className?: string;
  colorClass?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ 
  size = 24, 
  className = '',
  colorClass = 'text-slate-900'
}) => {
  return (
    <Loader2 
      size={size} 
      className={`animate-spin ${colorClass} ${className}`} 
    />
  );
};

export const FullPageSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] h-full w-full">
      <Spinner size={48} className="mb-4" />
      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading data...</p>
    </div>
  );
};
