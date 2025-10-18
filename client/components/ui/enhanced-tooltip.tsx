/**
 * Enhanced Tooltip Component
 * 
 * Features:
 * - Multiple positions
 * - Arrows
 * - Animations
 * - Rich content support
 */

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

const EnhancedTooltipProvider = TooltipPrimitive.Provider;

const EnhancedTooltipRoot = TooltipPrimitive.Root;

const EnhancedTooltipTrigger = TooltipPrimitive.Trigger;

const EnhancedTooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & {
    arrow?: boolean;
  }
>(({ className, sideOffset = 4, arrow = true, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  >
    {props.children}
    {arrow && <TooltipPrimitive.Arrow className="fill-border" />}
  </TooltipPrimitive.Content>
));
EnhancedTooltipContent.displayName = TooltipPrimitive.Content.displayName;

// Wrapper component for easy use
interface EnhancedTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  delayDuration?: number;
  arrow?: boolean;
  className?: string;
}

export function EnhancedTooltip({
  content,
  children,
  side = "top",
  delayDuration = 200,
  arrow = true,
  className,
}: EnhancedTooltipProps) {
  return (
    <EnhancedTooltipProvider delayDuration={delayDuration}>
      <EnhancedTooltipRoot>
        <EnhancedTooltipTrigger asChild>
          {children}
        </EnhancedTooltipTrigger>
        <EnhancedTooltipContent side={side} arrow={arrow} className={className}>
          {content}
        </EnhancedTooltipContent>
      </EnhancedTooltipRoot>
    </EnhancedTooltipProvider>
  );
}

export {
  EnhancedTooltipProvider,
  EnhancedTooltipRoot,
  EnhancedTooltipTrigger,
  EnhancedTooltipContent,
};
