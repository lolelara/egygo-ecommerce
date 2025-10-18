/**
 * Google reCAPTCHA v3 Service
 * 
 * حماية ضد البوتات والهجمات الآلية:
 * - Login
 * - Register
 * - Contact Forms
 * - Password Reset
 * - Order Creation
 */

// reCAPTCHA Configuration
const RECAPTCHA_CONFIG = {
  siteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', // Test key
  secretKey: import.meta.env.VITE_RECAPTCHA_SECRET_KEY || '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe', // Test key
  verifyUrl: 'https://www.google.com/recaptcha/api/siteverify',
  minScore: 0.5, // 0.0 - 1.0 (0.5 recommended)
};

/**
 * Load reCAPTCHA Script
 * تحميل سكريبت reCAPTCHA في الصفحة
 */
export function loadRecaptchaScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.grecaptcha) {
      resolve();
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="recaptcha"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_CONFIG.siteKey}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log('✅ reCAPTCHA script loaded');
      resolve();
    };

    script.onerror = () => {
      console.error('❌ Failed to load reCAPTCHA script');
      reject(new Error('Failed to load reCAPTCHA'));
    };

    document.head.appendChild(script);
  });
}

/**
 * Execute reCAPTCHA
 * تنفيذ reCAPTCHA والحصول على token
 */
export async function executeRecaptcha(action: string = 'submit'): Promise<string> {
  try {
    // Ensure script is loaded
    await loadRecaptchaScript();

    // Wait for grecaptcha to be ready
    await new Promise<void>((resolve) => {
      if (window.grecaptcha && window.grecaptcha.ready) {
        window.grecaptcha.ready(() => resolve());
      } else {
        // Fallback: wait a bit
        setTimeout(() => resolve(), 1000);
      }
    });

    // Execute reCAPTCHA
    const token = await window.grecaptcha.execute(
      RECAPTCHA_CONFIG.siteKey,
      { action }
    );

    if (!token) {
      throw new Error('No reCAPTCHA token received');
    }

    console.log('✅ reCAPTCHA token generated:', action);
    return token;
  } catch (error) {
    console.error('❌ reCAPTCHA execution failed:', error);
    throw error;
  }
}

/**
 * Verify reCAPTCHA Token (Server-side)
 * التحقق من صحة token على السيرفر
 */
export async function verifyRecaptchaToken(
  token: string,
  remoteIp?: string
): Promise<{
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  error?: string;
}> {
  try {
    const response = await fetch(RECAPTCHA_CONFIG.verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: RECAPTCHA_CONFIG.secretKey,
        response: token,
        ...(remoteIp && { remoteip: remoteIp }),
      }),
    });

    const data = await response.json();

    if (!data.success) {
      console.error('❌ reCAPTCHA verification failed:', data['error-codes']);
      return {
        success: false,
        error: data['error-codes']?.join(', ') || 'Verification failed',
      };
    }

    // Check score (v3)
    if (data.score !== undefined && data.score < RECAPTCHA_CONFIG.minScore) {
      console.warn('⚠️ Low reCAPTCHA score:', data.score);
      return {
        success: false,
        score: data.score,
        error: 'Suspicious activity detected',
      };
    }

    console.log('✅ reCAPTCHA verified:', {
      score: data.score,
      action: data.action,
    });

    return {
      success: true,
      score: data.score,
      action: data.action,
      challenge_ts: data.challenge_ts,
      hostname: data.hostname,
    };
  } catch (error) {
    console.error('❌ reCAPTCHA verification error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check if reCAPTCHA is enabled
 */
export function isRecaptchaEnabled(): boolean {
  return !!RECAPTCHA_CONFIG.siteKey && RECAPTCHA_CONFIG.siteKey !== '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
}

/**
 * Actions for different forms
 */
export const RecaptchaActions = {
  LOGIN: 'login',
  REGISTER: 'register',
  FORGOT_PASSWORD: 'forgot_password',
  RESET_PASSWORD: 'reset_password',
  CONTACT: 'contact',
  ORDER: 'order',
  REVIEW: 'review',
  COMMENT: 'comment',
  NEWSLETTER: 'newsletter',
} as const;

/**
 * Hook for using reCAPTCHA in components
 */
export function useRecaptcha() {
  const execute = async (action: string) => {
    if (!isRecaptchaEnabled()) {
      console.log('⚠️ reCAPTCHA disabled (using test keys)');
      return 'test-token';
    }

    return await executeRecaptcha(action);
  };

  return { execute, isEnabled: isRecaptchaEnabled() };
}

/**
 * Validate reCAPTCHA in form submission
 */
export async function validateRecaptcha(
  action: string
): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    if (!isRecaptchaEnabled()) {
      return { success: true, token: 'test-token' };
    }

    const token = await executeRecaptcha(action);

    if (!token) {
      return { success: false, error: 'Failed to generate reCAPTCHA token' };
    }

    // Note: Server-side verification should be done on the backend
    // This is client-side only for now
    return { success: true, token };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// TypeScript declarations for grecaptcha
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      reset: (widgetId?: number) => void;
      render: (container: string | HTMLElement, parameters: any) => number;
    };
  }
}

export default {
  loadRecaptchaScript,
  executeRecaptcha,
  verifyRecaptchaToken,
  isRecaptchaEnabled,
  validateRecaptcha,
  RecaptchaActions,
  useRecaptcha,
};
