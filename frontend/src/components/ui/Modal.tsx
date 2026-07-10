import React, { useEffect } from 'react';
import { X } from 'lucide-react';


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  maxWidth = 'max-w-md'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div 
        className={`w-full ${maxWidth} bg-[#faf9f5] border-2 border-slate-900 rounded-xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-4 border-b-2 border-slate-900">
          <h2 className="text-xl font-bold font-serif text-slate-900 tracking-tight">{title}</h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg border-2 border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-900 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {children}
        </div>

        {footer && (
          <div className="flex items-center justify-end gap-3 p-4 border-t-2 border-slate-900 bg-white rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
