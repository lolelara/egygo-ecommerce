import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

interface ToastContextType {
    showToast: (toast: Omit<Toast, 'id'>) => void;
    hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast = { ...toast, id };

        setToasts((prev) => [...prev, newToast]);

        // Auto remove after duration
        const duration = toast.duration || 5000;
        setTimeout(() => {
            hideToast(id);
        }, duration);
    }, []);

    const hideToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            <ToastContainer toasts={toasts} onClose={hideToast} />
        </ToastContext.Provider>
    );
}

function ToastContainer({ toasts, onClose }: { toasts: Toast[]; onClose: (id: string) => void }) {
    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 w-full max-w-md px-4 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onClose={onClose} />
                ))}
            </AnimatePresence>
        </div>
    );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: (id: string) => void }) {
    const [progress, setProgress] = useState(100);
    const duration = toast.duration || 5000;

    // Progress animation
    useState(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                const newProgress = prev - (100 / (duration / 50));
                return newProgress > 0 ? newProgress : 0;
            });
        }, 50);

        return () => clearInterval(interval);
    });

    const icons = {
        success: CheckCircle,
        error: XCircle,
        warning: AlertCircle,
        info: Info,
    };

    const colors = {
        success: {
            bg: 'from-green-500 to-emerald-500',
            icon: 'text-green-500',
            progress: 'bg-green-600',
        },
        error: {
            bg: 'from-red-500 to-rose-500',
            icon: 'text-red-500',
            progress: 'bg-red-600',
        },
        warning: {
            bg: 'from-orange-500 to-amber-500',
            icon: 'text-orange-500',
            progress: 'bg-orange-600',
        },
        info: {
            bg: 'from-blue-500 to-cyan-500',
            icon: 'text-blue-500',
            progress: 'bg-blue-600',
        },
    };

    const Icon = icons[toast.type];
    const color = colors[toast.type];

    return (
        <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className="pointer-events-auto"
        >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                {/* Content */}
                <div className="p-4 flex items-start gap-3">
                    {/* Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${color.bg}
                       flex items-center justify-center`}
                    >
                        <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                    </motion.div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-800 mb-0.5">
                            {toast.title}
                        </h4>
                        {toast.message && (
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {toast.message}
                            </p>
                        )}
                    </div>

                    {/* Close Button */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onClose(toast.id)}
                        className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-gray-100
                       flex items-center justify-center transition-colors"
                    >
                        <X className="w-4 h-4 text-gray-500" />
                    </motion.button>
                </div>

                {/* Progress Bar */}
                <div className="h-1 bg-gray-100">
                    <motion.div
                        className={`h-full ${color.progress}`}
                        style={{ width: `${progress}%` }}
                        transition={{ duration: 0.05, ease: 'linear' }}
                    />
                </div>
            </div>
        </motion.div>
    );
}

// Helper hook for common toasts
export function useToastHelpers() {
    const { showToast } = useToast();

    return {
        success: (title: string, message?: string) =>
            showToast({ type: 'success', title, message }),

        error: (title: string, message?: string) =>
            showToast({ type: 'error', title, message }),

        warning: (title: string, message?: string) =>
            showToast({ type: 'warning', title, message }),

        info: (title: string, message?: string) =>
            showToast({ type: 'info', title, message }),
    };
}
