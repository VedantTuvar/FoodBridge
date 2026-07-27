import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info, XCircle, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastContextType {
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  addToast: () => {},
  removeToast: () => {},
});

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getIcon = (type: ToastMessage['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-soft" />;
      case 'amber':
        return <AlertTriangle className="w-5 h-5 text-amber" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-soft" />;
      default:
        return <Info className="w-5 h-5 text-teal" />;
    }
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto flex items-start gap-3 p-4 bg-white dark:bg-night-soft border border-line rounded shadow-floating"
            >
              {getIcon(toast.type)}
              <div className="flex-1">
                <h4 className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-paper">
                  {toast.title}
                </h4>
                {toast.message && (
                  <p className="text-xs text-ink-soft dark:text-paper-alt mt-1">
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-ink-soft hover:text-ink transition-colors p-1"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
