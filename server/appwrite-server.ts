// Commented out for static deployment - not needed for Appwrite Static Sites
// Server-side Appwrite operations should be done through client SDK with proper permissions

// import { Client, Databases } from "appwrite";

// Initialize Appwrite client for server
// export const client = new Client()
//   .setEndpoint(process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
//   .setProject(process.env.APPWRITE_PROJECT_ID || "68d8b9db00134c41e7c8")
//   .setKey(process.env.APPWRITE_API_KEY || ""); // Server API key for admin operations

// Initialize databases service
// export const databases = new Databases(client);

// Stub exports to prevent build errors
export const client = null;
export const databases = null;
