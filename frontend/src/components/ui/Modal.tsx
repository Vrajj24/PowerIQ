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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div 
        className={`w-full ${maxWidth} bg-[#121824] border border-[#1e293b] rounded-xl shadow-xl flex flex-col`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e293b]">
          <h2 className="text-base font-semibold text-slate-100 tracking-wide">{title}</h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="p-5 overflow-y-auto max-h-[70vh] text-slate-300 text-xs">
          {children}
        </div>

        {footer && (
          <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-[#1e293b] bg-[#0d121d] rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
