/**
 * Enhanced Input Component
 * 
 * Features:
 * - Icon support
 * - Clear button
 * - Character counter
 * - Validation states
 * - Prefix/Suffix
 */

import * as React from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EnhancedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  clearable?: boolean;
  onClear?: () => void;
  showCharCount?: boolean;
  error?: string;
  success?: boolean;
  prefix?: string;
  suffix?: string;
  containerClassName?: string;
}

const EnhancedInput = React.forwardRef<HTMLInputElement, EnhancedInputProps>(
  (
    {
      className,
      type,
      icon,
      iconPosition = "left",
      clearable = false,
      onClear,
      showCharCount = false,
      maxLength,
      value,
      error,
      success,
      prefix,
      suffix,
      containerClassName,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const inputValue = value?.toString() || "";
    const charCount = inputValue.length;

    const handleClear = () => {
      if (onClear) {
        onClear();
      }
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const inputType = type === "password" && showPassword ? "text" : type;

    return (
      <div className={cn("relative w-full", containerClassName)}>
        <div className="relative flex items-center">
          {/* Prefix */}
          {prefix && (
            <span className="absolute left-3 text-sm text-muted-foreground">
              {prefix}
            </span>
          )}

          {/* Icon Left */}
          {icon && iconPosition === "left" && (
            <div className="absolute left-3 text-muted-foreground">
              {icon}
            </div>
          )}

          {/* Input */}
          <input
            type={inputType}
            className={cn(
              "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
              {
                "pl-10": icon && iconPosition === "left",
                "pr-10": (icon && iconPosition === "right") || clearable || type === "password",
                "border-destructive focus-visible:ring-destructive": error,
                "border-green-500 focus-visible:ring-green-500": success,
                "pl-12": prefix,
                "pr-12": suffix,
              },
              className
            )}
            ref={ref}
            value={value}
            maxLength={maxLength}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />

          {/* Icon Right or Clear Button or Password Toggle */}
          <div className="absolute right-3 flex items-center gap-1">
            {type === "password" && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}

            {clearable && inputValue && !props.disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
                tabIndex={-1}
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {icon && iconPosition === "right" && !clearable && type !== "password" && (
              <div className="text-muted-foreground">{icon}</div>
            )}
          </div>

          {/* Suffix */}
          {suffix && (
            <span className="absolute right-3 text-sm text-muted-foreground">
              {suffix}
            </span>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-xs text-destructive mt-1 animate-fade-in-down">
            {error}
          </p>
        )}

        {/* Character Counter */}
        {showCharCount && maxLength && (
          <p className={cn(
            "text-xs mt-1 text-right",
            charCount >= maxLength ? "text-destructive" : "text-muted-foreground"
          )}>
            {charCount}/{maxLength}
          </p>
        )}
      </div>
    );
  }
);

EnhancedInput.displayName = "EnhancedInput";

export { EnhancedInput };
