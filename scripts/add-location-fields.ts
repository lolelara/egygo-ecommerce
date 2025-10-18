/**
 * Add Location Fields to User Preferences Collection
 * إضافة حقول المحافظة والمركز
 */

import { Client, Databases } from 'node-appwrite';
import { config } from 'dotenv';

config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || '68de037e003bd03c4d45';

async function addLocationFields() {
  console.log('\n🗺️  Adding Location Fields to User Preferences...\n');

  try {
    // Add governorate field
    console.log('📍 Adding governorate field...');
    await databases.createStringAttribute(
      DATABASE_ID,
      'userPreferences',
      'governorate',
      255,
      false // Not required for existing users
    );
    console.log('✅ Governorate field added');

    // Add city field
    console.log('📍 Adding city field...');
    await databases.createStringAttribute(
      DATABASE_ID,
      'userPreferences',
      'city',
      255,
      false // Not required for existing users
    );
    console.log('✅ City field added');

    console.log('\n✅ Location fields added successfully!\n');
    console.log('📝 Note: These fields are optional for existing users.');
    console.log('📝 New users will be required to fill them during registration.\n');

  } catch (error: any) {
    if (error.code === 409) {
      console.log('⚠️  Location fields already exist');
    } else {
      console.error('❌ Error adding location fields:', error.message);
      throw error;
    }
  }
}

addLocationFields();
