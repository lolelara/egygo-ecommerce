import { Client, Databases } from 'node-appwrite';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '68d8b9db00134c41e7c8')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || '68de037e003bd03c4d45';

async function addReadAttribute() {
  try {
    console.log('📝 Adding read attribute to notifications collection...');
    
    await databases.createBooleanAttribute(
      DATABASE_ID,
      'notifications',
      'read',
      false, // optional
      false  // default value
    );
    
    console.log('✅ read attribute added successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 409) {
      console.log('✓ read attribute already exists');
    }
  }
}

addReadAttribute();
