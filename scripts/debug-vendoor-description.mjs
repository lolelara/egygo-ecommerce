import puppeteer from 'puppeteer';
import fs from 'fs';

const VENDOOR_EMAIL = 'almlmibrahym574@gmail.com';
const VENDOOR_PASSWORD = 'hema2004';
const VENDOOR_LOGIN_URL = 'https://aff.ven-door.com/login';
const VENDOOR_PRODUCTS_URL = 'https://aff.ven-door.com/products';

async function main() {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080'],
        defaultViewport: { width: 1920, height: 1080 }
    });

    const page = await browser.newPage();

    try {
        // Login
        console.log('Logging in...');
        await page.goto(VENDOOR_LOGIN_URL, { waitUntil: 'networkidle2' });
        await page.type('input[name="name"]', VENDOOR_EMAIL);
        await page.type('input[name="password"]', VENDOOR_PASSWORD);
        await page.click('button[type="submit"]');

        // Wait for navigation OR selector that appears after login
        try {
            await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 });
        } catch (e) {
            console.log('Navigation timeout, checking for dashboard selector...');
        }

        // Check if we are logged in by looking for a nav element or similar
        try {
            await page.waitForSelector('nav', { timeout: 10000 });
            console.log('Logged in (nav found).');
        } catch (e) {
            console.error('Login verification failed. Dumping page...');
            fs.writeFileSync('debug_login_fail.html', await page.content());
            throw new Error('Login failed');
        }

        // Go to products page
        console.log('Going to products...');
        await page.goto(VENDOOR_PRODUCTS_URL, { waitUntil: 'networkidle2' });

        // Find a vendor link
        const vendorLink = await page.evaluate(() => {
            const a = document.querySelector('a[href*="vendor_id"]');
            return a ? a.href : null;
        });

        if (!vendorLink) throw new Error('No vendor link found');
        console.log('Vendor Link:', vendorLink);

        // Go to vendor page
        await page.goto(vendorLink, { waitUntil: 'networkidle2' });

        // Find a product link
        const productLink = await page.evaluate(() => {
            const a = document.querySelector('a[href*="/product/"], a[href*="/p/"]');
            return a ? a.href : null;
        });

        if (!productLink) throw new Error('No product link found');
        console.log('Product Link:', productLink);

        // Go to product page
        await page.goto(productLink, { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 3000)); // Wait for dynamic content

        // Dump HTML
        const html = await page.content();
        fs.writeFileSync('debug_product_page.html', html);
        console.log('Saved HTML to debug_product_page.html');

        // Take screenshot
        await page.screenshot({ path: 'debug_product_page.png', fullPage: true });
        console.log('Saved screenshot to debug_product_page.png');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await browser.close();
    }
}

main();
