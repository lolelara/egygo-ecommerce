import { motion } from 'framer-motion';

interface SkeletonCardProps {
    className?: string;
}

interface SkeletonProductCardProps extends SkeletonCardProps { }
interface SkeletonTableProps extends SkeletonCardProps {
    rows?: number;
}

// Product Card Skeleton
export function SkeletonProductCard({ className = '' }: SkeletonProductCardProps) {
    return (
        <div className={`card-modern animate-pulse ${className}`}>
            {/* Image Skeleton */}
            <div className="aspect-square bg-gray-200 rounded-t-xl mb-4 relative overflow-hidden">
                <div className="shimmer-effect absolute inset-0" />
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                {/* Rating */}
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-4 h-4 bg-gray-200 rounded-full" />
                    ))}
                </div>

                {/* Title */}
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>

                {/* Price */}
                <div className="flex items-center gap-3">
                    <div className="h-6 bg-gray-200 rounded w-24" />
                    <div className="h-4 bg-gray-200 rounded w-16" />
                </div>

                {/* Button */}
                <div className="h-12 bg-gray-200 rounded-xl w-full" />
            </div>
        </div>
    );
}

// Product Grid Skeleton
export function SkeletonProductGrid({ count = 8, className = '' }: { count?: number; className?: string }) {
    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${className}`}>
            {[...Array(count)].map((_, i) => (
                <SkeletonProductCard key={i} />
            ))}
        </div>
    );
}

// Table Skeleton
export function SkeletonTable({ rows = 5, className = '' }: SkeletonTableProps) {
    return (
        <div className={`space-y-4 ${className}`}>
            {/* Header */}
            <div className="grid grid-cols-5 gap-4 p-4 bg-gray-100 rounded-lg">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded" />
                ))}
            </div>

            {/* Rows */}
            {[...Array(rows)].map((_, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-5 gap-4 p-4 border-b border-gray-100">
                    {[...Array(5)].map((_, colIndex) => (
                        <div
                            key={colIndex}
                            className="h-4 bg-gray-200 rounded animate-pulse"
                            style={{ animationDelay: `${(rowIndex * 5 + colIndex) * 100}ms` }}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

// Dashboard Skeleton
export function SkeletonDashboard({ className = '' }: SkeletonCardProps) {
    return (
        <div className={`space-y-6 ${className}`}>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="card-modern p-6 animate-pulse"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-full" />
                            <div className="h-4 bg-gray-200 rounded w-16" />
                        </div>
                        <div className="h-8 bg-gray-200 rounded w-24 mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-32" />
                    </motion.div>
                ))}
            </div>

            {/* Chart */}
            <div className="card-modern p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-48 mb-6" />
                <div className="h-64 bg-gray-200 rounded" />
            </div>

            {/* Table */}
            <div className="card-modern p-6">
                <div className="h-6 bg-gray-200 rounded w-40 mb-6 animate-pulse" />
                <SkeletonTable rows={5} />
            </div>
        </div>
    );
}

// Loading Spinner
export function LoadingSpinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-16 h-16',
    };

    return (
        <div className="flex items-center justify-center">
            <motion.div
                className={`${sizeClasses[size]} ${className}`}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
                <div className="w-full h-full border-4 border-purple-200 border-t-purple-600 rounded-full" />
            </motion.div>
        </div>
    );
}

// Full Page Loading
export function LoadingFullPage({ message = 'جاري التحميل...' }: { message?: string }) {
    return (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="text-center">
                <LoadingSpinner size="lg" />
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 text-gray-600 text-lg font-semibold"
                >
                    {message}
                </motion.p>
            </div>
        </div>
    );
}

// Pulse Loader (for buttons)
export function PulseLoader({ className = '' }: { className?: string }) {
    return (
        <div className={`flex items-center gap-1 ${className}`}>
            {[...Array(3)].map((_, i) => (
                <motion.div
                    key={i}
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                    }}
                />
            ))}
        </div>
    );
}

// Progress Bar
export function ProgressBar({ progress, className = '' }: { progress: number; className?: string }) {
    return (
        <div className={`progress-modern ${className}`}>
            <motion.div
                className="progress-modern-bar"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            />
        </div>
    );
}

// Skeleton Text
export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
    return (
        <div className={`space-y-2 ${className}`}>
            {[...Array(lines)].map((_, i) => (
                <div
                    key={i}
                    className="h-4 bg-gray-200 rounded animate-pulse"
                    style={{
                        width: i === lines - 1 ? '80%' : '100%',
                        animationDelay: `${i * 100}ms`,
                    }}
                />
            ))}
        </div>
    );
}
