
import puppeteer from 'puppeteer';

const PRODUCT_URL = 'https://aff.ven-door.com/product/4428';
const EMAIL = 'almlmibrahym574@gmail.com';
const PASSWORD = 'hema2004';

async function testScraper() {
    console.log('🚀 Starting test scraper for:', PRODUCT_URL);

    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    try {
        // Login
        console.log('🔐 Logging in...');
        await page.goto('https://aff.ven-door.com/login', { waitUntil: 'networkidle2', timeout: 60000 });
        await page.type('input[name="name"]', EMAIL);
        await page.type('input[name="password"]', PASSWORD);
        await page.click('button[type="submit"]');
        await page.waitForNavigation({ timeout: 60000 });
        console.log('✅ Logged in');

        // Go to product page
        console.log('📦 Navigating to product page...');
        await page.goto(PRODUCT_URL, { waitUntil: 'networkidle2', timeout: 60000 });

        // Extract description using the new logic
        const description = await page.evaluate(() => {
            const mediaLinkH2 = document.querySelector('h2 a[href*="drive.google.com"]');
            const firstTable = document.querySelector('table');
            let bestDesc = '';

            if (mediaLinkH2 && firstTable) {
                let currentNode = mediaLinkH2.parentNode.nextSibling;
                while (currentNode && currentNode !== firstTable) {
                    if (currentNode.nodeType === Node.TEXT_NODE && currentNode.textContent.trim().length > 10) {
                        bestDesc += currentNode.textContent.trim() + '\n';
                    } else if (currentNode.nodeType === Node.ELEMENT_NODE && currentNode.tagName === 'P' && currentNode.textContent.trim().length > 10) {
                        bestDesc += currentNode.textContent.trim() + '\n';
                    }
                    currentNode = currentNode.nextSibling;
                }
            } else {
                // Fallback
                const descElements = document.querySelectorAll('.description, .product-description, p');
                for (const el of descElements) {
                    const text = el.textContent.trim();
                    if (text.length > 20 && text.length < 2000) {
                        if (el.className.includes('description') || el.className.includes('detail')) {
                            bestDesc = text;
                            break;
                        }
                        if (text.length > bestDesc.length) {
                            bestDesc = text;
                        }
                    }
                }
            }
            return bestDesc.trim();
        });

        console.log('\n📝 Extracted Description:\n');
        console.log('--------------------------------------------------');
        console.log(description);
        console.log('--------------------------------------------------');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await browser.close();
    }
}

testScraper();
