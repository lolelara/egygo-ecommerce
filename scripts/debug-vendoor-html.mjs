import puppeteer from 'puppeteer';
import fs from 'fs';
import 'dotenv/config';

const EMAIL = process.env.VENDOOR_EMAIL;
const PASSWORD = process.env.VENDOOR_PASSWORD;
const LOGIN_URL = process.env.VENDOOR_LOGIN_URL || 'https://vendoor.com/login';
const PRODUCTS_URL = process.env.VENDOOR_PRODUCTS_URL || 'https://vendoor.com/products';

async function debugDescription() {
    console.log('🚀 Starting Debug Script...');

    const browser = await puppeteer.launch({
        headless: false, // Run visible to see what happens
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    try {
        // Login
        console.log('🔐 Logging in...');
        await page.goto(LOGIN_URL, { waitUntil: 'networkidle2' });

        try {
            await page.waitForSelector('input[name="name"]', { timeout: 10000 });
            await page.type('input[name="name"]', EMAIL);
        } catch (e) {
            console.error('❌ Login input not found. Taking screenshot...');
            await page.screenshot({ path: 'login-error.png' });
            const html = await page.content();
            fs.writeFileSync('login-error.html', html);
            throw e;
        }
        await page.type('input[name="password"]', PASSWORD);

        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
            page.click('button[type="submit"]')
        ]);

        console.log('✅ Logged in');

        // Go to products page to find a product link
        console.log('📂 Navigating to products...');
        await page.goto(PRODUCTS_URL, { waitUntil: 'networkidle2' });

        // Find first product link
        const productLink = await page.$eval('.card-product a', el => el.href).catch(() => null);

        if (!productLink) {
            console.error('❌ No product link found on the main page.');
            return;
        }

        console.log(`🔗 Found product: ${productLink}`);
        await page.goto(productLink, { waitUntil: 'networkidle2' });

        // Wait a bit for dynamic content
        await new Promise(r => setTimeout(r, 5000));

        // Dump HTML
        const html = await page.content();
        fs.writeFileSync('vendoor-product-debug.html', html);
        console.log('💾 HTML saved to vendoor-product-debug.html');

        // Try to extract description with current logic
        const description = await page.evaluate(() => {
            const container = document.querySelector('section.component-What');
            if (!container) return 'Container not found';

            const clone = container.cloneNode(true);

            // Remove unwanted elements
            const selectorsToRemove = [
                'h6.prodect-text', // Title
                '.card-body-2.price', // Price
                'table', // Inventory table
                'div.actions', // Action buttons
                'a.btn-save-link',
                'a.btn-success',
                'button',
                '.d-flex.justify-content-between'
            ];

            selectorsToRemove.forEach(sel => {
                clone.querySelectorAll(sel).forEach(el => el.remove());
            });

            return clone.innerHTML.trim();
        });

        console.log('\n📝 Extracted Description Preview:');
        console.log('----------------------------------------');
        console.log(description.substring(0, 500) + '...');
        console.log('----------------------------------------');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await browser.close();
    }
}

debugDescription();
