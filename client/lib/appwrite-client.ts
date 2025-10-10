import { Client, Account, Databases, Storage, Functions, Teams } from 'appwrite';

// Initialize Appwrite client
const client = new Client();

// Get environment variables with fallbacks
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || '68d8b9db00134c41e7c8';

// Configure client
client
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

// Export services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);
export const teams = new Teams(client);

// Export database and collection IDs
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || '68de037e003bd03c4d45';

// Export client for custom usage
export { client };

// Helper function to check if user is logged in
export const checkAuth = async () => {
  try {
    const user = await account.get();
    return user;
  } catch (error) {
    return null;
  }
};

// Helper function to get current session
export const getSession = async () => {
  try {
    const session = await account.getSession('current');
    return session;
  } catch (error) {
    return null;
  }
};
