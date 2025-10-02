#!/usr/bin/env node

/**
 * سكريبت اختبار اتصال Appwrite
 * يتحقق من صحة الإعدادات ويختبر الاتصال
 */

import { Client, Account, Databases } from 'appwrite';
import * as dotenv from 'dotenv';

// تحميل متغيرات البيئة
dotenv.config();

const projectId = process.env.VITE_APPWRITE_PROJECT_ID;
const endpoint = process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const databaseId = process.env.VITE_APPWRITE_DATABASE_ID || 'ecommerce-db';

console.log('🔍 اختبار اتصال Appwrite...\n');

if (!projectId) {
  console.error('❌ خطأ: VITE_APPWRITE_PROJECT_ID غير محدد في ملف .env');
  console.log('💡 يرجى إضافة معرف المشروع في ملف .env:\n');
  console.log('VITE_APPWRITE_PROJECT_ID=your-project-id-here\n');
  process.exit(1);
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId);

const account = new Account(client);
const databases = new Databases(client);

async function testConnection() {
  try {
    console.log(`📡 Endpoint: ${endpoint}`);
    console.log(`🆔 Project ID: ${projectId}`);
    console.log(`💾 Database ID: ${databaseId}\n`);

    // اختبار الاتصال العام
    console.log('🔄 اختبار الاتصال العام...');
    const health = await fetch(`${endpoint}/health`);
    if (health.ok) {
      console.log('✅ الخادم متاح\n');
    } else {
      throw new Error('الخادم غير متاح');
    }

    // اختبار صحة المشروع
    console.log('🔄 اختبار صحة المشروع...');
    try {
      await account.get();
      console.log('✅ المشروع صحيح (مستخدم مسجل دخول)');
    } catch (error) {
      if (error.code === 401) {
        console.log('✅ المشروع صحيح (لا يوجد مستخدم مسجل دخول)');
      } else {
        throw error;
      }
    }

    // اختبار قاعدة البيانات
    console.log('\n🔄 اختبار قاعدة البيانات...');
    try {
      const collections = await databases.list();
      console.log('✅ قاعدة البيانات متاحة');
      console.log(`📊 عدد المجموعات: ${collections.total}`);
      
      if (collections.total > 0) {
        console.log('📁 المجموعات الموجودة:');
        collections.databases.forEach((db) => {
          console.log(`   - ${db.name} (${db.$id})`);
        });
      }
    } catch (error) {
      if (error.code === 404) {
        console.log('⚠️  قاعدة البيانات غير موجودة - يجب إنشاؤها');
      } else {
        throw error;
      }
    }

    console.log('\n🎉 اختبار الاتصال مكتمل بنجاح!');
    console.log('\n📋 الخطوات التالية:');
    console.log('1. إنشاء قاعدة البيانات: ecommerce-db');
    console.log('2. إنشاء المجموعات (Collections)');
    console.log('3. إنشاء Storage Bucket: product-images');
    console.log('4. راجع ملف APPWRITE_REAL_SETUP.md للتفاصيل الكاملة');

  } catch (error) {
    console.error('\n❌ فشل في الاتصال:', error.message);
    
    if (error.code === 404) {
      console.log('\n💡 احتمال أن يكون معرف المشروع غير صحيح');
      console.log('🔧 تأكد من:');
      console.log('1. معرف المشروع صحيح في ملف .env');
      console.log('2. المشروع موجود في Appwrite Cloud');
      console.log('3. تمت إضافة localhost كمنصة ويب');
    }
    
    process.exit(1);
  }
}

testConnection();