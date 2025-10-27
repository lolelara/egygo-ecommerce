/**
 * Advanced Error Tracking with Sentry
 * تتبع الأخطاء المتقدم مع Sentry
 */

import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

interface ErrorContext {
  userId?: string;
  userRole?: string;
  page?: string;
  action?: string;
  data?: Record<string, any>;
}

/**
 * تهيئة Sentry مع إعدادات متقدمة
 */
export function initAdvancedErrorTracking() {
  if (!import.meta.env.VITE_SENTRY_DSN) {
    console.warn('Sentry DSN not configured');
    return;
  }
  
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE || 'development',
    
    // Integrations
    integrations: [
      new BrowserTracing({
        // تتبع الـ Routes
        routingInstrumentation: Sentry.reactRouterV6Instrumentation(
          React.useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes
        ),
      }),
      
      // Session Replay - يسجل جلسة المستخدم
      new Sentry.Replay({
        maskAllText: false, // لا تخفي النصوص
        blockAllMedia: false, // لا تحجب الوسائط
        maskAllInputs: true, // أخفي inputs للخصوصية
      }),
      
      // Web Vitals
      new Sentry.BrowserProfilingIntegration(),
    ],
    
    // Performance Monitoring
    tracesSampleRate: import.meta.env.PROD ? 0.2 : 1.0, // 20% في production
    
    // Session Replay
    replaysSessionSampleRate: 0.1, // 10% من الجلسات العادية
    replaysOnErrorSampleRate: 1.0, // 100% عند حدوث خطأ
    
    // تصفية الأخطاء قبل الإرسال
    beforeSend(event, hint) {
      // تجاهل أخطاء معينة
      const error = hint.originalException;
      
      // تجاهل Network errors العادية
      if (error instanceof Error) {
        if (error.message?.includes('Network Error')) {
          return null;
        }
        if (error.message?.includes('Failed to fetch')) {
          return null;
        }
      }
      
      // تجاهل أخطاء الـ extensions
      if (error?.stack?.includes('chrome-extension://')) {
        return null;
      }
      
      // إضافة context إضافي
      if (event.user) {
        event.user.role = localStorage.getItem('userRole') || undefined;
      }
      
      // إضافة معلومات الصفحة
      event.contexts = event.contexts || {};
      event.contexts.page = {
        url: window.location.href,
        referrer: document.referrer,
        title: document.title
      };
      
      return event;
    },
    
    // تصفية Breadcrumbs
    beforeBreadcrumb(breadcrumb) {
      // تجاهل console.log في production
      if (import.meta.env.PROD && breadcrumb.category === 'console') {
        return null;
      }
      
      // تجاهل clicks على أزرار معينة
      if (breadcrumb.category === 'ui.click') {
        const target = breadcrumb.message;
        if (target?.includes('dismiss') || target?.includes('close')) {
          return null;
        }
      }
      
      return breadcrumb;
    },
    
    // تكوين إضافي
    maxBreadcrumbs: 50,
    attachStacktrace: true,
    autoSessionTracking: true,
    
    // Tags افتراضية
    initialScope: {
      tags: {
        environment: import.meta.env.MODE,
        version: import.meta.env.VITE_APP_VERSION || '1.0.0'
      }
    }
  });
}

/**
 * تعيين معلومات المستخدم
 */
export function setUserContext(user: {
  id: string;
  email?: string;
  name?: string;
  role?: string;
}) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.name,
    role: user.role
  });
}

/**
 * مسح معلومات المستخدم (عند Logout)
 */
export function clearUserContext() {
  Sentry.setUser(null);
}

/**
 * تتبع خطأ مخصص مع context
 */
export function trackError(
  error: Error,
  context?: ErrorContext,
  level: Sentry.SeverityLevel = 'error'
) {
  Sentry.withScope((scope) => {
    scope.setLevel(level);
    
    if (context) {
      if (context.userId) {
        scope.setUser({ id: context.userId });
      }
      if (context.page) {
        scope.setTag('page', context.page);
      }
      if (context.action) {
        scope.setTag('action', context.action);
      }
      if (context.data) {
        scope.setContext('additional', context.data);
      }
    }
    
    Sentry.captureException(error);
  });
}

/**
 * تتبع رسالة مخصصة
 */
export function trackMessage(
  message: string,
  level: Sentry.SeverityLevel = 'info',
  context?: ErrorContext
) {
  Sentry.withScope((scope) => {
    scope.setLevel(level);
    
    if (context) {
      if (context.page) scope.setTag('page', context.page);
      if (context.action) scope.setTag('action', context.action);
      if (context.data) scope.setContext('additional', context.data);
    }
    
    Sentry.captureMessage(message);
  });
}

/**
 * تتبع event مخصص
 */
export function trackEvent(
  eventName: string,
  data?: Record<string, any>
) {
  Sentry.addBreadcrumb({
    category: 'custom',
    message: eventName,
    level: 'info',
    data
  });
}

/**
 * Performance monitoring
 */
export class PerformanceMonitor {
  private static measurements = new Map<string, number>();
  
  /**
   * بدء قياس performance
   */
  static start(name: string) {
    this.measurements.set(name, performance.now());
  }
  
  /**
   * إنهاء القياس وإرسال للـ Sentry
   */
  static end(name: string, metadata?: Record<string, any>) {
    const startTime = this.measurements.get(name);
    if (!startTime) {
      console.warn(`No start time found for: ${name}`);
      return;
    }
    
    const duration = performance.now() - startTime;
    this.measurements.delete(name);
    
    // إرسال كـ measurement
    Sentry.setMeasurement(name, duration, 'millisecond');
    
    // إضافة breadcrumb
    Sentry.addBreadcrumb({
      category: 'performance',
      message: `${name}: ${duration.toFixed(2)}ms`,
      level: 'info',
      data: {
        duration,
        ...metadata
      }
    });
    
    // تحذير إذا كان بطيء
    if (duration > 1000) {
      trackMessage(
        `Slow operation: ${name} took ${duration.toFixed(2)}ms`,
        'warning',
        { data: { duration, ...metadata } }
      );
    }
    
    return duration;
  }
}

/**
 * API Call tracking
 */
export function trackAPICall(
  method: string,
  endpoint: string,
  status: number,
  duration: number,
  error?: Error
) {
  const breadcrumb: Sentry.Breadcrumb = {
    type: 'http',
    category: 'api',
    data: {
      method,
      url: endpoint,
      status_code: status,
      duration
    },
    level: error ? 'error' : 'info'
  };
  
  Sentry.addBreadcrumb(breadcrumb);
  
  // تتبع الأخطاء
  if (error) {
    trackError(error, {
      action: 'api_call',
      data: { method, endpoint, status, duration }
    });
  }
  
  // تحذير للـ slow API calls
  if (duration > 3000) {
    trackMessage(
      `Slow API call: ${method} ${endpoint} took ${duration}ms`,
      'warning'
    );
  }
}

/**
 * Feature flag tracking
 */
export function trackFeatureUsage(featureName: string, enabled: boolean) {
  Sentry.setTag(`feature_${featureName}`, enabled ? 'enabled' : 'disabled');
  
  trackEvent('feature_usage', {
    feature: featureName,
    enabled
  });
}

/**
 * User action tracking
 */
export function trackUserAction(
  action: string,
  category: string,
  data?: Record<string, any>
) {
  Sentry.addBreadcrumb({
    type: 'user',
    category,
    message: action,
    level: 'info',
    data
  });
}

/**
 * React Error Boundary مع Sentry
 */
export const SentryErrorBoundary = Sentry.ErrorBoundary;

/**
 * HOC لتتبع component errors
 */
export function withErrorTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
) {
  const WrappedComponent = (props: P) => {
    return (
      <Sentry.ErrorBoundary
        fallback={({ error, resetError }) => (
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                حدث خطأ غير متوقع
              </h2>
              <p className="text-gray-600 mb-4">
                نعتذر عن الإزعاج. تم تسجيل المشكلة وسنعمل على حلها.
              </p>
              <button
                onClick={resetError}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                المحاولة مرة أخرى
              </button>
            </div>
          </div>
        )}
        showDialog={false}
        beforeCapture={(scope) => {
          scope.setTag('component', componentName || Component.name);
        }}
      >
        <Component {...props} />
      </Sentry.ErrorBoundary>
    );
  };
  
  WrappedComponent.displayName = `withErrorTracking(${componentName || Component.name})`;
  
  return WrappedComponent;
}

// Import React types
import React from 'react';
import { useLocation, useNavigationType, createRoutesFromChildren, matchRoutes } from 'react-router-dom';
