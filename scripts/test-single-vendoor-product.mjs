#!/usr/bin/env node

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

puppeteer.use(StealthPlugin());

const VENDOOR_LOGIN_URL = process.env.VENDOOR_LOGIN_URL || 'https://aff.ven-door.com/login';
const VENDOOR_EMAIL = process.env.VENDOOR_EMAIL;
const VENDOOR_PASSWORD = process.env.VENDOOR_PASSWORD;

// Test product URLs
const TEST_URLS = [
  'https://aff.ven-door.com/product/3174', // حذاء سيفتي
  'https://aff.ven-door.com/product/4374'  // بوت
];

async function testProductExtraction() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  console.log('🔐 تسجيل الدخول...');
  
  // Login
  await page.goto(VENDOOR_LOGIN_URL, { waitUntil: 'networkidle2' });
  await page.type('input[name="email"], input[type="email"]', VENDOOR_EMAIL);
  await page.type('input[name="password"], input[type="password"]', VENDOOR_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  
  console.log('✅ تم تسجيل الدخول\n');
  
  // Test each product
  for (const productUrl of TEST_URLS) {
    console.log(`\n📦 اختبار المنتج: ${productUrl}`);
    console.log('═══════════════════════════════════════════\n');
    
    await page.goto(productUrl, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));
    
    // Extract data
    const data = await page.evaluate(() => {
      const result = {
        title: '',
        productDescription: '',
        mediaLinks: [],
        seller: '',
        price: ''
      };
      
      // Title
      const titleEl = document.querySelector('h6.prodect-text, h1, h2, h3, .product-title');
      if (titleEl) result.title = titleEl.textContent.trim();
      
      // Description
      const descEl = document.querySelector('p.prodcut-titles, .prodcut-titles, .product-titles');
      if (descEl) {
        // Extract media links
        descEl.querySelectorAll('a[href*="drive.google.com"]').forEach(a => {
          const href = a.href;
          if (href && !result.mediaLinks.includes(href)) result.mediaLinks.push(href);
        });
        
        // Extract description text
        let descText = '';
        
        // Method 1: From div and p elements
        const innerElements = descEl.querySelectorAll('div, p');
        if (innerElements.length > 0) {
          const texts = [];
          innerElements.forEach(elem => {
            if (elem.querySelector('a') && elem.textContent.trim().length < 50) return;
            
            const directText = Array.from(elem.childNodes)
              .filter(node => node.nodeType === 3 || node.nodeName === 'BR')
              .map(node => node.nodeType === 3 ? node.textContent.trim() : '\n')
              .join('')
              .trim();
            
            if (directText && directText.length > 2) {
              texts.push(directText);
            }
          });
          
          if (texts.length > 0) {
            descText = texts.join('\n');
          }
        }
        
        // Method 2: Full HTML extraction
        if (!descText || descText.length < 20) {
          let html = descEl.innerHTML || '';
          html = html.replace(/<script[^>]*>.*?<\/script>/gi, '');
          html = html.replace(/<style[^>]*>.*?<\/style>/gi, '');
          html = html.replace(/<br\s*\/?>/gi, '\n');
          html = html.replace(/<\/p>/gi, '\n\n');
          html = html.replace(/<\/div>/gi, '\n');
          html = html.replace(/<\/h[1-6]>/gi, '\n\n');
          html = html.replace(/<[^>]+>/g, '');
          html = html.replace(/&nbsp;/g, ' ');
          html = html.replace(/&lt;/g, '<');
          html = html.replace(/&gt;/g, '>');
          html = html.replace(/&amp;/g, '&');
          descText = html;
        }
        
        // Clean text
        if (descText) {
          const lines = descText.split('\n').map(s => s.trim()).filter(s => s.length > 0);
          descText = lines.filter(s => {
            if (/^لينك\s*الميديا/i.test(s)) return false;
            if (/^ميديا\s*إضافية/i.test(s)) return false;
            if (/^media$/i.test(s)) return false;
            if (s.length < 3) return false;
            return true;
          }).join('\n');
        }
        
        result.productDescription = descText.trim();
      }
      
      // Price
      const priceEl = document.querySelector('.card-body-2.price div');
      if (priceEl) {
        const text = priceEl.textContent || '';
        const match = text.match(/السعر\s*:\s*(\d+)/);
        if (match) result.price = match[1] + ' جنيه';
      }
      
      // Seller
      const sellerElements = Array.from(document.querySelectorAll('.card-body-2.price div'));
      for (const el of sellerElements) {
        const text = el.textContent || '';
        if (text.includes('البائع')) {
          const sellerName = text.replace(/البائع\s*[:：]?\s*/i, '').trim();
          if (sellerName && sellerName.length > 0 && sellerName.length < 100) {
            result.seller = sellerName;
            break;
          }
        }
      }
      
      return result;
    });
    
    // Display results
    console.log('📌 العنوان:', data.title);
    console.log('\n📝 الوصف المستخرج:');
    console.log('───────────────────');
    if (data.productDescription) {
      const lines = data.productDescription.split('\n');
      lines.slice(0, 10).forEach(line => {
        console.log('  ', line);
      });
      if (lines.length > 10) {
        console.log('   ... و', lines.length - 10, 'أسطر أخرى');
      }
    } else {
      console.log('   ❌ لم يتم استخراج وصف');
    }
    
    console.log('\n📂 روابط الميديا:', data.mediaLinks.length > 0 ? '' : 'لا توجد');
    data.mediaLinks.forEach((link, i) => {
      console.log(`   ${i + 1}. ${link}`);
    });
    
    console.log('\n💰 السعر:', data.price || 'غير متوفر');
    console.log('👤 البائع:', data.seller || 'غير متوفر');
  }
  
  await browser.close();
  console.log('\n\n✅ انتهى الاختبار');
}

testProductExtraction().catch(console.error);
