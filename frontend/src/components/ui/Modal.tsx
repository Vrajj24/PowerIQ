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
        className={`w-full ${maxWidth} bg-surface border border-line rounded-sm shadow-sm flex flex-col`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <h2 className="text-base font-semibold text-ink tracking-wide">{title}</h2>
          <button 
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-sm text-muted hover:text-ink hover:bg-surface-muted transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="p-5 overflow-y-auto max-h-[70vh] text-ink text-xs">
          {children}
        </div>

        {footer && (
          <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-line bg-paper rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
