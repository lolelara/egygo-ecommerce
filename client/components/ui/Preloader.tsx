import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BrandLogo } from "../BrandLogo";

export function Preloader({ onComplete }: { onComplete?: () => void }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return prev + 2; // Adjust speed here
            });
        }, 30); // Adjust interval here

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (progress === 100 && onComplete) {
            // Small delay before unmounting to show 100%
            const timeout = setTimeout(onComplete, 500);
            return () => clearTimeout(timeout);
        }
    }, [progress, onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.8, ease: "easeInOut" } }}
        >
            {/* Logo Container */}
            <motion.div
                className="relative mb-12"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                {/* Pulse Effect */}
                <motion.div
                    className="absolute inset-0 bg-primary/10 rounded-full blur-2xl"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Logo Image */}
                <div className="relative z-10">
                    <BrandLogo size="xl" className="h-24 w-auto" />
                </div>
            </motion.div>

            {/* Brand Name - Removed as it's already in the logo */}
            {/* <motion.h1 ... /> */}

            {/* Progress Bar Container */}
            <div className="w-64 h-2 bg-muted rounded-full overflow-hidden relative">
                {/* Progress Bar */}
                <motion.div
                    className="h-full bg-gradient-to-r from-primary to-orange-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "linear" }}
                />
            </div>

            {/* Percentage Text */}
            <motion.div
                className="mt-4 font-mono text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                {progress}%
            </motion.div>

            {/* Loading Text */}
            <motion.p
                className="mt-2 text-sm text-muted-foreground/60 animate-pulse"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                جاري تجهيز المتجر...
            </motion.p>
        </motion.div>
    );
}
