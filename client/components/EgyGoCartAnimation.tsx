import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

export const EgyGoCartAnimation = () => {
    return (
        <div className="w-full h-48 bg-gradient-to-r from-red-50 via-orange-50 to-red-50 dark:from-red-950/30 dark:via-orange-950/30 dark:to-red-950/30 flex items-center justify-center relative overflow-hidden border-b border-red-100 dark:border-red-900/30">

            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-gradient-to-br from-red-400/10 to-orange-400/10 rounded-full blur-xl"
                        initial={{
                            x: Math.random() * 1000,
                            y: Math.random() * 200,
                            scale: 0.5,
                            opacity: 0
                        }}
                        animate={{
                            y: [null, Math.random() * -100],
                            scale: [0.5, 1.5, 0.5],
                            opacity: [0, 0.5, 0]
                        }}
                        transition={{
                            duration: 5 + Math.random() * 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: Math.random() * 2
                        }}
                        style={{
                            width: 100 + Math.random() * 200,
                            height: 100 + Math.random() * 200,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 flex flex-col items-center gap-4">
                {/* Main Title "Go Egy" */}
                <div className="flex items-center gap-4">
                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "backOut" }}
                        className="relative"
                    >
                        <span className="text-6xl md:text-7xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500 dark:from-red-500 dark:to-red-400 drop-shadow-sm">
                            Go
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
                    >
                        <ArrowRight className="w-12 h-12 text-orange-500" />
                    </motion.div>

                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "backOut", delay: 0.2 }}
                        className="relative"
                    >
                        <span className="text-6xl md:text-7xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-500 dark:from-orange-500 dark:to-orange-400 drop-shadow-sm">
                            Egy
                        </span>
                        <motion.div
                            className="absolute -top-2 -right-6"
                            animate={{ rotate: [0, 15, -15, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        >
                            <Sparkles className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                        </motion.div>
                    </motion.div>
                </div>

                {/* Arabic Taglines */}
                <div className="flex flex-col items-center gap-2">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        className="bg-white/60 dark:bg-black/40 backdrop-blur-sm px-6 py-2 rounded-full border border-white/20 shadow-sm"
                    >
                        <span className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 font-cairo">
                            الحق عروض الاحتفال بـ أول <span className="text-red-600 dark:text-red-400">10 آلاف</span> منتج
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.6 }}
                    >
                        <span className="text-lg font-medium text-gray-600 dark:text-gray-300 font-cairo flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                            عروض الـ White Friday مستمرة
                            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                        </span>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
