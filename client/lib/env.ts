/**
 * Environment variables helper
 * Centralized access to environment variables
 */

interface EnvVars {
  VITE_OPENAI_API_KEY?: string;
  VITE_APPWRITE_ENDPOINT?: string;
  VITE_APPWRITE_PROJECT_ID?: string;
  VITE_APPWRITE_DATABASE_ID?: string;
  VITE_APPWRITE_STORAGE_ID?: string;
  VITE_APPWRITE_API_KEY?: string;
  VITE_VENDOOR_FUNCTION_URL?: string;
}

function getEnvVar(key: keyof EnvVars): string {
  // Type-safe access to environment variables
  const envVars = (typeof import.meta !== 'undefined' && import.meta.env) 
    ? import.meta.env as unknown as EnvVars
    : process?.env as unknown as EnvVars;
  
  return (envVars?.[key] as string) || '';
}

export const env = {
  OPENAI_API_KEY: getEnvVar('VITE_OPENAI_API_KEY'),
  APPWRITE_ENDPOINT: getEnvVar('VITE_APPWRITE_ENDPOINT'),
  APPWRITE_PROJECT_ID: getEnvVar('VITE_APPWRITE_PROJECT_ID'),
  APPWRITE_DATABASE_ID: getEnvVar('VITE_APPWRITE_DATABASE_ID'),
  APPWRITE_STORAGE_ID: getEnvVar('VITE_APPWRITE_STORAGE_ID'),
  APPWRITE_API_KEY: getEnvVar('VITE_APPWRITE_API_KEY'),
  VENDOOR_FUNCTION_URL: getEnvVar('VITE_VENDOOR_FUNCTION_URL'),
};

export default env;
