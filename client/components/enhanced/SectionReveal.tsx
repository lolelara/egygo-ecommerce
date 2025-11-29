import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface SectionRevealProps {
    children: React.ReactNode;
    delay?: number;
    direction?: "up" | "left" | "right" | "none";
    className?: string;
    width?: string;
}

export function SectionReveal({
    children,
    delay = 0,
    direction = "up",
    className = "",
    width = "100%"
}: SectionRevealProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const getVariants = () => {
        switch (direction) {
            case "up":
                return {
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0 }
                };
            case "left":
                return {
                    hidden: { opacity: 0, x: -50 },
                    visible: { opacity: 1, x: 0 }
                };
            case "right":
                return {
                    hidden: { opacity: 0, x: 50 },
                    visible: { opacity: 1, x: 0 }
                };
            case "none":
                return {
                    hidden: { opacity: 0, scale: 0.95 },
                    visible: { opacity: 1, scale: 1 }
                };
            default:
                return {
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0 }
                };
        }
    };

    return (
        <motion.div
            ref={ref}
            variants={getVariants()}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{
                duration: 0.8,
                delay: delay,
                ease: [0.22, 1, 0.36, 1]
            }}
            className={className}
            style={{ width }}
        >
            {children}
        </motion.div>
    );
}
