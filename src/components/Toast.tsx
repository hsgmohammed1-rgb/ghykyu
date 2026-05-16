import { useState, useCallback, useEffect, createContext, useContext, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ addToast: () => {} });
export const useToast = () => useContext(ToastContext);

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++nextId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 w-[90vw] max-w-md" dir="ltr">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-xl ${
                toast.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' :
                toast.type === 'error' ? 'bg-coral-red/20 border-coral-red/40 text-red-300' :
                toast.type === 'warning' ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300' :
                'bg-neon-purple/20 border-neon-purple/40 text-purple-300'
              }`}
            >
              <span className="flex-shrink-0">
                {toast.type === 'success' ? <CheckCircle2 size={20} /> :
                 toast.type === 'error' ? <XCircle size={20} /> :
                 toast.type === 'warning' ? <AlertTriangle size={20} /> :
                 <Info size={20} />}
              </span>
              <span className="flex-1 text-sm font-bold">{toast.message}</span>
              <button onClick={() => removeToast(toast.id)} className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity">
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
