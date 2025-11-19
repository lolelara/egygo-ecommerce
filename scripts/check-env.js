
import { config } from 'dotenv';
config();

console.log('Project ID:', process.env.VITE_APPWRITE_PROJECT_ID);
console.log('Database ID:', process.env.VITE_APPWRITE_DATABASE_ID);
