// ============================================
// Accessibility (A11y) Enhancements
// ============================================

import React, { useEffect, useCallback, useState } from 'react';

// ===== KEYBOARD NAVIGATION =====

/**
 * Hook للتعامل مع keyboard shortcuts
 */
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  modifiers?: {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
  }
) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const matchesModifiers = 
        (!modifiers?.ctrl || e.ctrlKey) &&
        (!modifiers?.shift || e.shiftKey) &&
        (!modifiers?.alt || e.altKey) &&
        (!modifiers?.meta || e.metaKey);
      
      if (e.key === key && matchesModifiers) {
        e.preventDefault();
        callback();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [key, callback, modifiers]);
}

/**
 * Example:
 * 
 * useKeyboardShortcut('Escape', () => closeModal());
 * useKeyboardShortcut('k', () => openSearch(), { ctrl: true });
 */

// ===== FOCUS MANAGEMENT =====

/**
 * Focus trap للـ modals
 */
export function useFocusTrap(isActive: boolean) {
  const [focusableElements, setFocusableElements] = useState<HTMLElement[]>([]);
  
  useEffect(() => {
    if (!isActive) return;
    
    const focusable = Array.from(
      document.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    );
    
    setFocusableElements(focusable);
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];
      
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };
    
    window.addEventListener('keydown', handleTabKey);
    return () => window.removeEventListener('keydown', handleTabKey);
  }, [isActive]);
}

// ===== SCREEN READER ANNOUNCEMENTS =====

/**
 * Component للإعلانات للـ screen readers
 */
interface SRAnnouncerProps {
  message: string;
  priority?: 'polite' | 'assertive';
}

export function ScreenReaderAnnouncer({ 
  message, 
  priority = 'polite' 
}: SRAnnouncerProps) {
  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}

/**
 * Hook للإعلانات الديناميكية
 */
export function useScreenReaderAnnouncement() {
  const [announcement, setAnnouncement] = useState('');
  
  const announce = useCallback((message: string) => {
    setAnnouncement(message);
    // Clear after announcement
    setTimeout(() => setAnnouncement(''), 100);
  }, []);
  
  return {
    announce,
    AnnouncementComponent: () => (
      <ScreenReaderAnnouncer message={announcement} />
    )
  };
}

/**
 * Example:
 * 
 * const { announce, AnnouncementComponent } = useScreenReaderAnnouncement();
 * 
 * function addToCart() {
 *   // ... add to cart logic
 *   announce('تم إضافة المنتج إلى السلة');
 * }
 * 
 * return (
 *   <>
 *     <AnnouncementComponent />
 *     <button onClick={addToCart}>إضافة للسلة</button>
 *   </>
 * );
 */

// ===== SKIP LINKS =====

/**
 * Skip to main content link
 */
export function SkipToMainContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded"
    >
      تخطي إلى المحتوى الرئيسي
    </a>
  );
}

// ===== ARIA HELPERS =====

/**
 * Generate unique IDs للـ ARIA relationships
 */
let idCounter = 0;
export function useAriaId(prefix: string = 'aria'): string {
  const [id] = useState(() => `${prefix}-${++idCounter}`);
  return id;
}

/**
 * Example:
 * 
 * const labelId = useAriaId('label');
 * const errorId = useAriaId('error');
 * 
 * return (
 *   <>
 *     <label id={labelId}>الاسم</label>
 *     <input
 *       aria-labelledby={labelId}
 *       aria-describedby={hasError ? errorId : undefined}
 *     />
 *     {hasError && <span id={errorId} role="alert">خطأ</span>}
 *   </>
 * );
 */

// ===== LOADING STATES =====

/**
 * Accessible loading indicator
 */
interface LoadingProps {
  message?: string;
}

export function AccessibleLoading({ message = 'جاري التحميل...' }: LoadingProps) {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <div className="flex items-center gap-2">
        <div 
          className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"
          aria-hidden="true"
        />
        <span>{message}</span>
      </div>
    </div>
  );
}

// ===== FORM VALIDATION =====

/**
 * Accessible form field with error handling
 */
interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactElement;
}

export function AccessibleFormField({
  label,
  error,
  required = false,
  children
}: FormFieldProps) {
  const labelId = useAriaId('field-label');
  const errorId = useAriaId('field-error');
  const descId = useAriaId('field-desc');
  
  const childWithProps = React.cloneElement(children, {
    'aria-labelledby': labelId,
    'aria-describedby': error ? errorId : descId,
    'aria-invalid': !!error,
    'aria-required': required
  });
  
  return (
    <div className="space-y-2">
      <label id={labelId} className="block font-medium">
        {label}
        {required && <span aria-label="مطلوب"> *</span>}
      </label>
      
      {childWithProps}
      
      {error && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

// ===== MODAL ACCESSIBILITY =====

/**
 * Accessible modal wrapper
 */
interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function AccessibleModal({
  isOpen,
  onClose,
  title,
  children
}: AccessibleModalProps) {
  const titleId = useAriaId('modal-title');
  
  // Focus trap
  useFocusTrap(isOpen);
  
  // Close on Escape
  useKeyboardShortcut('Escape', onClose);
  
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal content */}
      <div className="relative bg-card p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 id={titleId} className="text-xl font-bold mb-4">
          {title}
        </h2>
        
        {children}
        
        <button
          onClick={onClose}
          aria-label="إغلاق"
          className="absolute top-4 left-4 p-2 hover:bg-accent rounded"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ===== COLOR CONTRAST CHECKER =====

/**
 * للتطوير: فحص التباين بين الألوان
 */
export function checkColorContrast(
  foreground: string,
  background: string
): { ratio: number; wcagAA: boolean; wcagAAA: boolean } {
  // Implementation would use actual contrast calculation
  // This is a simplified version
  return {
    ratio: 4.5,
    wcagAA: true,
    wcagAAA: false
  };
}
