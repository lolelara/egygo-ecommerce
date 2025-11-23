import puppeteer from 'puppeteer';

const DRIVE_FOLDER_URL = 'https://drive.google.com/drive/folders/1aoRxcfI9djMivCkMmhpFTZjnu9eLk17U';

async function scrapeDriveFolder() {
    console.log('🚀 Starting Drive Scraper Test...');
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    try {
        console.log(`📂 Navigating to: ${DRIVE_FOLDER_URL}`);
        await page.goto(DRIVE_FOLDER_URL, { waitUntil: 'networkidle2', timeout: 60000 });

        // Wait for some content to load (Drive is slow and dynamic)
        console.log('⏳ Waiting for content to load...');
        try {
            await page.waitForSelector('div[role="gridcell"]', { timeout: 15000 });
        } catch (e) {
            console.log('⚠️ Grid cell not found immediately, waiting more...');
            await new Promise(r => setTimeout(r, 5000));
        }

        // Extract File IDs
        // Google Drive usually puts the ID in data-id or similar, or in the link
        const fileIds = await page.evaluate(() => {
            const ids = [];
            // Look for elements that represent files
            // Strategy 1: Look for elements with data-id (common in Drive)
            const elements = document.querySelectorAll('div[data-id]');
            elements.forEach(el => {
                const id = el.getAttribute('data-id');
                // Filter out the folder ID itself or non-file IDs if possible
                // Drive IDs are usually long alphanumeric strings
                if (id && id.length > 20) {
                    // Check if it looks like an image (optional, hard to tell from ID alone)
                    // But we can try to get the mime type or icon if available
                    // For now, just grab all IDs that are NOT the folder ID
                    ids.push(id);
                }
            });
            return [...new Set(ids)];
        });

        console.log(`✅ Found ${fileIds.length} potential file IDs:`);
        console.log(fileIds);

        // Construct direct links
        const directLinks = fileIds.map(id => `https://lh3.googleusercontent.com/d/${id}`);
        console.log('\n🔗 Generated Direct Links (First 5):');
        console.log(directLinks.slice(0, 5));

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await browser.close();
    }
}

scrapeDriveFolder();
