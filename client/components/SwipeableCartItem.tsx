import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface SwipeableCartItemProps {
  children: React.ReactNode;
  onDelete: () => void;
  threshold?: number;
}

export function SwipeableCartItem({ 
  children, 
  onDelete, 
  threshold = 100 
}: SwipeableCartItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-threshold, 0], [0, 1]);
  const scale = useTransform(x, [-threshold, 0], [0.8, 1]);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -threshold) {
      setIsDeleting(true);
      setTimeout(() => {
        onDelete();
      }, 200);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Delete Background */}
      <motion.div 
        className="absolute right-0 top-0 bottom-0 bg-destructive flex items-center justify-center px-6"
        style={{ opacity }}
      >
        <Trash2 className="h-5 w-5 text-white" />
      </motion.div>

      {/* Swipeable Item */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -threshold * 1.5, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ x, scale }}
        animate={isDeleting ? { x: -500, opacity: 0 } : {}}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-background relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
}
