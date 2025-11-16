/**
 * Environment variables helper
 * Centralized access to environment variables
 */

interface EnvVars {
  VITE_APPWRITE_ENDPOINT?: string;
  VITE_APPWRITE_PROJECT_ID?: string;
  VITE_APPWRITE_DATABASE_ID?: string;
  VITE_APPWRITE_STORAGE_ID?: string;
  VITE_APPWRITE_API_KEY?: string;
  VITE_VENDOOR_FUNCTION_URL?: string;
  VITE_ADMIN_API_KEY?: string;
}

function getEnvVar(key: keyof EnvVars): string {
  // Type-safe access to environment variables
  try {
    // @ts-ignore - Vite specific import.meta.env
    return (import.meta.env[key] as string) || '';
  } catch (e) {
    console.error('Error accessing env var:', key, e);
    return '';
  }
}

export const env = {
  APPWRITE_ENDPOINT: getEnvVar('VITE_APPWRITE_ENDPOINT'),
  APPWRITE_PROJECT_ID: getEnvVar('VITE_APPWRITE_PROJECT_ID'),
  APPWRITE_DATABASE_ID: getEnvVar('VITE_APPWRITE_DATABASE_ID'),
  APPWRITE_STORAGE_ID: getEnvVar('VITE_APPWRITE_STORAGE_ID'),
  APPWRITE_API_KEY: getEnvVar('VITE_APPWRITE_API_KEY'),
  VENDOOR_FUNCTION_URL: getEnvVar('VITE_VENDOOR_FUNCTION_URL'),
  ADMIN_API_KEY: getEnvVar('VITE_ADMIN_API_KEY'),
};

export default env;
