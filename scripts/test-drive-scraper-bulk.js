import puppeteer from 'puppeteer';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const VENDOOR_URL = 'https://aff.ven-door.com/home';
const LIMIT = 5;

async function getProductUrls() {
    console.log('🔍 Finding products to test...');
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();

    try {
        await page.goto(VENDOOR_URL, { waitUntil: 'networkidle2', timeout: 60000 });

        // Wait for products
        await page.waitForSelector('.card-product a', { timeout: 10000 });

        const urls = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('.card-product a'));
            return links
                .map(a => a.href)
                .filter(href => href.includes('/product/'))
                .slice(0, 10); // Get a few more just in case
        });

        await browser.close();
        return [...new Set(urls)].slice(0, LIMIT);
    } catch (error) {
        console.error('❌ Error finding products:', error);
        await browser.close();
        return [];
    }
}

async function runScraper(url) {
    console.log(`\n🕷️ Running scraper for: ${url}`);
    try {
        const { stdout, stderr } = await execAsync(`node scripts/scrape-single-vendoor.mjs "${url}"`);
        console.log(stdout);
        if (stderr) console.error('⚠️ Stderr:', stderr);
    } catch (error) {
        console.error(`❌ Failed to scrape ${url}:`, error.message);
    }
}

async function main() {
    const urls = await getProductUrls();
    console.log(`✅ Found ${urls.length} products to test.`);

    for (const url of urls) {
        await runScraper(url);
        // Wait a bit between scrapes to be nice
        await new Promise(r => setTimeout(r, 5000));
    }

    console.log('\n🏁 Bulk test complete!');
}

main();
