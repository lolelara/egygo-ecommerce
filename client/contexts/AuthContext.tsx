// This project now uses Appwrite-based auth context everywhere.
// To maintain backward compatibility with existing imports from '@/contexts/AuthContext',
// we re-export the AppwriteAuthContext implementation here.
export { useAuth, AuthProvider } from "./AppwriteAuthContext";

