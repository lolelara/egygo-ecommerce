#!/usr/bin/env node

import { execSync } from 'child_process';
import * as dotenv from 'dotenv';

// تحميل متغيرات البيئة
dotenv.config();

const projectId = process.env.VITE_APPWRITE_PROJECT_ID;
const endpoint = process.env.VITE_APPWRITE_ENDPOINT;
const databaseId = process.env.VITE_APPWRITE_DATABASE_ID;

console.log('🚀 إنشاء Collections باستخدام سكريپت مبسط...\n');

// التحقق من البيانات
if (!projectId || !endpoint || !databaseId) {
  console.error('❌ خطأ: متغيرات البيئة مفقودة في ملف .env');
  process.exit(1);
}

console.log(`📡 Endpoint: ${endpoint}`);
console.log(`🆔 Project ID: ${projectId}`);
console.log(`💾 Database ID: ${databaseId}\n`);

// تعريف Collections مع بيانات JSON مبسطة
const collections = [
  {
    id: 'users',
    name: 'Users',
    documentSecurity: true,
    attributes: {
      'name': 'string:255:required',
      'email': 'string:255:required',
      'phone': 'string:20',
      'address': 'string:500',
      'isAffiliate': 'boolean:false',
      'affiliateCode': 'string:10',
      'commissionRate': 'float:0.15'
    }
  },
  {
    id: 'categories',
    name: 'Categories',
    documentSecurity: false,
    attributes: {
      'name': 'string:255:required',
      'description': 'string:1000',
      'image': 'string:255',
      'isActive': 'boolean:true'
    }
  },
  {
    id: 'products',
    name: 'Products',
    documentSecurity: false,
    attributes: {
      'name': 'string:255:required',
      'description': 'string:2000:required',
      'price': 'float:required',
      'comparePrice': 'float',
      'stock': 'integer:0:required',
      'images': 'string:2000:array',
      'categoryId': 'string:36:required',
      'tags': 'string:50:array',
      'isActive': 'boolean:true',
      'isFeatured': 'boolean:false',
      'rating': 'float:0',
      'reviewCount': 'integer:0'
    }
  },
  {
    id: 'orders',
    name: 'Orders',
    documentSecurity: true,
    attributes: {
      'userId': 'string:36:required',
      'total': 'float:required',
      'status': 'string:20:required:pending',
      'customerName': 'string:255:required',
      'customerEmail': 'string:255:required',
      'customerPhone': 'string:20:required',
      'shippingAddress': 'string:1000:required',
      'paymentMethod': 'string:50:required',
      'affiliateCode': 'string:10',
      'affiliateCommission': 'float:0'
    }
  },
  {
    id: 'order_items',
    name: 'Order Items',
    documentSecurity: true,
    attributes: {
      'orderId': 'string:36:required',
      'productId': 'string:36:required',
      'productName': 'string:255:required',
      'productImage': 'string:255',
      'price': 'float:required',
      'quantity': 'integer:required',
      'total': 'float:required'
    }
  },
  {
    id: 'reviews',
    name: 'Reviews',
    documentSecurity: true,
    attributes: {
      'productId': 'string:36:required',
      'userId': 'string:36:required',
      'userName': 'string:255:required',
      'rating': 'integer:required',
      'comment': 'string:1000',
      'isApproved': 'boolean:false'
    }
  },
  {
    id: 'affiliates',
    name: 'Affiliates',
    documentSecurity: true,
    attributes: {
      'userId': 'string:36:required',
      'code': 'string:10:required',
      'commissionRate': 'float:0.15',
      'totalEarnings': 'float:0',
      'totalSales': 'integer:0',
      'isActive': 'boolean:true'
    }
  }
];

function runCommand(command) {
  try {
    console.log(`⚡ تنفيذ: ${command}`);
    const result = execSync(command, { encoding: 'utf8' });
    return result;
  } catch (error) {
    console.error(`❌ خطأ في تنفيذ الأمر: ${error.message}`);
    return null;
  }
}

// إنشاء Collections
collections.forEach((collection, index) => {
  console.log(`\n${index + 1}️⃣ إنشاء Collection: ${collection.name}`);
  
  // تحويل attributes إلى شكل مفهوم
  const attrList = Object.entries(collection.attributes).map(([key, value]) => {
    const parts = value.split(':');
    const type = parts[0];
    const sizeOrDefault = parts[1] || '';
    const flags = parts.slice(2) || [];
    
    return `${key} (${type}${sizeOrDefault ? ':' + sizeOrDefault : ''})${flags.includes('required') ? ' - Required' : ''}${flags.includes('array') ? ' - Array' : ''}`;
  }).join('\n  ');

  console.log(`📝 Attributes:\n  ${attrList}`);
  console.log(`🔒 Document Security: ${collection.documentSecurity ? 'Enabled' : 'Disabled'}`);
  console.log('✅ Collection محدد للإنشاء');
});

console.log('\n' + '='.repeat(60));
console.log('📋 ملخص العمليات:');
console.log(`✅ ${collections.length} Collections جاهزة للإنشاء`);
console.log('✅ تعريف الـ Attributes مكتمل');
console.log('✅ إعدادات الأمان محددة');

console.log('\n🔧 لإنشاء Collections يدوياً:');
console.log('1. اذهب إلى Appwrite Console');
console.log('2. افتح Database > egygo');
console.log('3. اتبع التفاصيل المذكورة أعلاه لكل Collection');

console.log('\n📱 أو استخدم الدليل المفصل في:');
console.log('COLLECTIONS_MANUAL_GUIDE.md');

console.log('\n🚀 بعد إنشاء Collections، شغّل:');
console.log('npm run dev');
console.log('واذهب إلى: http://localhost:8080');