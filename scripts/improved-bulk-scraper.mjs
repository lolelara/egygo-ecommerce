import puppeteer from 'puppeteer';
import { Client, Databases, ID, Permission, Role, Query } from 'node-appwrite';
import https from 'https';

// ==========================================
// Configuration
// ==========================================
const VENDOOR_EMAIL = 'almlmibrahym574@gmail.com';
const VENDOOR_PASSWORD = 'hema2004';
const VENDOOR_LOGIN_URL = 'https://aff.ven-door.com/login';
const VENDOOR_PRODUCTS_URL = 'https://aff.ven-door.com/products';

const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = '68d8b9db00134c41e7c8';
const APPWRITE_API_KEY = 'standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5';
const APPWRITE_DATABASE_ID = '68de037e003bd03c4d45';

// Telegram
const TELEGRAM_BOT_TOKEN = '8592879332:AAHYh6RSnKOj0eXz0p6gN1mm4xDB-z4GDvo';
const TELEGRAM_CHAT_ID = '664193835';

const PROFIT_MARGIN = 10;

// ==========================================
// Appwrite Setup
// ==========================================
const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);

// ==========================================
// Telegram Helper
// ==========================================
async function sendTelegram(message) {
    return new Promise((resolve) => {
        const data = JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        });

        const options = {
            hostname: 'api.telegram.org',
            port: 443,
            path: `/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => { body += chunk; });
            res.on('end', () => resolve(true));
        });

        req.on('error', (error) => {
            console.error('❌ Telegram Error:', error.message);
            resolve(false);
        });

        req.write(data);
        req.end();
    });
}

// ==========================================
// Core Scraping Logic (From Single Scraper)
// ==========================================

async function login(page) {
    try {
        console.log('🔐 Logging in...');
        await page.goto(VENDOOR_LOGIN_URL, { waitUntil: 'networkidle2', timeout: 60000 });
        await new Promise(r => setTimeout(r, 2000));

        const email = await page.$('input[name="name"]');
        if (!email) throw new Error('Email field not found');
        await email.type(VENDOOR_EMAIL);

        const pass = await page.$('input[name="password"]');
        if (!pass) throw new Error('Password field not found');
        await pass.type(VENDOOR_PASSWORD);

        const btn = await page.$('button[type="submit"]');
        if (btn) {
            await btn.click();
            await Promise.race([
                page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 120000 }).catch(() => null),
                page.waitForSelector('nav', { timeout: 60000 }).catch(() => null)
            ]);
        }

        console.log('✅ Logged in');
        return true;
    } catch (error) {
        console.error('❌ Login failed:', error.message);
        return false;
    }
}

async function scrapeProduct(page, url, browser) {
    try {
        // console.log('\n📦 Opening product page:', url);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        // Check for login redirect
        if (page.url().includes('login')) {
            console.error('❌ Redirected to login! Session lost.');
            return null;
        }

        await new Promise(r => setTimeout(r, 3000));

        const result = await page.evaluate(() => {
            const result = {
                title: '',
                seller: '',
                price: 0,
                description: '',
                mediaLinks: [],
                images: [],
                colors: [],
                sizes: [],
                colorSizeInventory: [],
                totalStock: 0
            };

            // Helpers
            const normalizeArabic = (s) => (s || '')
                .replace(/[أإآ]/g, 'ا')
                .replace(/ى/g, 'ي')
                .replace(/[ًٌٍَُِّْ]/g, '')
                .trim();
            const normalizeSize = (s) => {
                const str = (s || '').trim();
                const m = str.match(/\d+(?:\.\d+)?/);
                return m ? m[0] : str;
            };

            // Title
            const titleEl = document.querySelector('h6.prodect-text');
            result.title = titleEl ? titleEl.textContent.trim() : '';

            // Seller
            const sellerDiv = Array.from(document.querySelectorAll('.card-body-2.price')).find(
                div => div.textContent.includes('البائع')
            );
            if (sellerDiv) {
                const sellerSpan = sellerDiv.querySelector('span');
                result.seller = sellerSpan ? sellerSpan.textContent.trim() : '';
            }

            // Price
            const priceDiv = Array.from(document.querySelectorAll('.card-body-2.price')).find(
                div => div.textContent.includes('السعر')
            );
            if (priceDiv) {
                const text = priceDiv.textContent;
                const match = text.match(/(\d+)/);
                if (match) result.price = parseInt(match[1]);
            }

            // Description & Media Link Extraction
            const componentWhat = document.querySelector('.component-What');
            let bestDesc = '';

            if (componentWhat) {
                // 1. Extract Media Links
                const mediaAnchors = componentWhat.querySelectorAll('a[href*="drive.google.com"]');
                mediaAnchors.forEach(a => {
                    if (a.href && !result.mediaLinks.includes(a.href)) {
                        result.mediaLinks.push(a.href);
                    }
                });

                // 2. Extract Description
                const paragraphs = componentWhat.querySelectorAll('p');
                paragraphs.forEach(p => {
                    const hasMediaLink = p.querySelector('a[href*="drive.google.com"]');
                    const isTitle = p.classList.contains('prodect-text');

                    if (!hasMediaLink && !isTitle) {
                        const text = p.textContent.trim();
                        if (text.length > 0) {
                            bestDesc += text + '\n';
                        }
                    }
                });

                if (!bestDesc.trim()) {
                    const clone = componentWhat.cloneNode(true);
                    const titleToRemove = clone.querySelector('.prodect-text');
                    if (titleToRemove) titleToRemove.remove();
                    const linksToRemove = clone.querySelectorAll('a[href*="drive.google.com"]');
                    linksToRemove.forEach(l => l.remove());
                    bestDesc = clone.textContent.trim();
                }
            } else {
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
            result.description = bestDesc.trim();

            // Images
            const mainImgEl = document.querySelector('.abut-img img');
            if (mainImgEl && mainImgEl.src) {
                result.images.push(mainImgEl.src);
            } else {
                const allImgs = document.querySelectorAll('article img');
                for (const img of allImgs) {
                    if (img.src && img.width > 300 && !img.src.includes('logo') && !img.src.includes('profile')) {
                        result.images.push(img.src);
                        break;
                    }
                }
            }

            // Inventory
            const tables = Array.from(document.querySelectorAll('table.table-product, table'));
            tables.forEach(table => {
                const headers = Array.from(table.querySelectorAll('th, thead td'))
                    .map(h => h.textContent.trim().toLowerCase());

                if (headers.length === 0) return;

                const findCol = (patterns) => headers.findIndex(h => patterns.some(p => p.test(h)));

                const sizeIdx = findCol([/size/i, /مقاس/]);
                const colorIdx = findCol([/color/i, /لون/]);
                const qtyIdx = findCol([/stock/i, /كمية/, /qty/i, /quantity/i, /عدد/]);

                if (colorIdx === -1 && sizeIdx === -1 && qtyIdx === -1) return;

                const rows = Array.from(table.querySelectorAll('tbody tr, tr'));

                rows.forEach((row) => {
                    const isHeaderRow = row.querySelectorAll('th').length > 0;
                    if (isHeaderRow) return;

                    const cells = Array.from(row.querySelectorAll('td'));
                    if (cells.length === 0) return;

                    let size = sizeIdx >= 0 && cells[sizeIdx] ? cells[sizeIdx].textContent.trim() : '';
                    let color = colorIdx >= 0 && cells[colorIdx] ? cells[colorIdx].textContent.trim() : '';

                    if (size && color && size.includes(color)) {
                        const sizeOnly = size.replace(color, '').trim();
                        size = sizeOnly || size;
                    }

                    color = normalizeArabic(color);
                    size = normalizeSize(size);

                    let qtyText = qtyIdx >= 0 && cells[qtyIdx] ? cells[qtyIdx].textContent : '';
                    if (!qtyText) {
                        const numCell = cells.find(c => /\d/.test(c.textContent || ''));
                        qtyText = numCell ? numCell.textContent : '0';
                    }

                    const qty = parseInt(qtyText.replace(/\D/g, '')) || 0;

                    if (color || size || qty > 0) {
                        result.colorSizeInventory.push({
                            color: color || 'Default',
                            size: size || 'Default',
                            quantity: qty
                        });

                        if (color && !result.colors.includes(color)) result.colors.push(color);
                        if (size && !result.sizes.includes(size)) result.sizes.push(size);
                        result.totalStock += qty;
                    }
                });
            });

            result.colors = Array.from(new Set(result.colors));
            result.sizes = Array.from(new Set(result.sizes.map(s => String(s))));

            return result;
        });

        // Deep Scrape Google Drive Folders
        if (result.mediaLinks && result.mediaLinks.length > 0) {
            console.log(`   📂 Found ${result.mediaLinks.length} Drive links. Extracting images...`);

            for (const driveLink of result.mediaLinks) {
                try {
                    if (driveLink.includes('drive.google.com/drive/folders')) {
                        const drivePage = await browser.newPage();
                        await drivePage.goto(driveLink, { waitUntil: 'networkidle2', timeout: 60000 });

                        // Scroll logic
                        let previousHeight = 0;
                        let noChangeCount = 0;
                        while (noChangeCount < 3) {
                            await drivePage.evaluate(() => {
                                const scrollable = document.querySelector('div[role="main"] div[role="grid"]') || document.body;
                                if (scrollable) scrollable.scrollTop = scrollable.scrollHeight;
                                window.scrollTo(0, document.body.scrollHeight);
                            });
                            await new Promise(r => setTimeout(r, 2000));
                            const currentHeight = await drivePage.evaluate(() => {
                                const scrollable = document.querySelector('div[role="main"] div[role="grid"]') || document.body;
                                return scrollable ? scrollable.scrollHeight : document.body.scrollHeight;
                            });
                            if (currentHeight === previousHeight) noChangeCount++;
                            else { previousHeight = currentHeight; noChangeCount = 0; }
                        }

                        const fileIds = await drivePage.evaluate(() => {
                            const ids = [];
                            document.querySelectorAll('div[data-id]').forEach(el => {
                                const id = el.getAttribute('data-id');
                                if (id && id.length > 20) ids.push(id);
                            });
                            return [...new Set(ids)];
                        });

                        const folderIdMatch = driveLink.match(/folders\/([a-zA-Z0-9_-]+)/);
                        const folderId = folderIdMatch ? folderIdMatch[1] : '';
                        const newImages = fileIds.filter(id => id !== folderId).map(id => `https://lh3.googleusercontent.com/d/${id}`);
                        result.images.push(...newImages);
                        await drivePage.close();
                    }
                } catch (err) {
                    console.error(`   ❌ Failed to scrape Drive folder: ${err.message}`);
                }
            }
            result.images = [...new Set(result.images)];
        }

        return result;
    } catch (error) {
        console.error('❌ Scraping error:', error.message);
        return null;
    }
}

function generateStableSKU(link) {
    try {
        const match = link.match(/\/product\/(\d+)/);
        if (match && match[1]) return `V-${match[1]}`;
        let hash = 0;
        for (let i = 0; i < link.length; i++) {
            const char = link.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return `V-HASH-${Math.abs(hash)}`;
    } catch (e) {
        return `V-UNKNOWN-${Date.now()}`;
    }
}

async function saveToAppwrite(data, url) {
    try {
        let description = (data.description || '').trim();
        if (data.mediaLinks && data.mediaLinks.length > 0) {
            const linksText = data.mediaLinks.map((l) => `- ${l}`).join('\n');
            description = `${description}\n\n📎 روابط الميديا:\n${linksText}`.trim();
        }

        const filteredImages = (data.images || [])
            .map(u => String(u).trim())
            .filter((u) => u && u.length < 2000 && u.startsWith('http') && !/logo2?\.png|favicon/i.test(u));

        const originalPrice = data.price || 0;
        const finalPrice = originalPrice + PROFIT_MARGIN;
        const sku = generateStableSKU(url);
        description += `\n\nSKU: ${sku}`;

        const productData = {
            name: data.title || 'Unnamed Product',
            description: description || 'No description',
            price: finalPrice,
            originalPrice: originalPrice,
            images: filteredImages.length > 0 ? filteredImages : ['https://via.placeholder.com/400'],
            colors: data.colors || [],
            sizes: data.sizes || [],
            colorSizeInventory: JSON.stringify(data.colorSizeInventory || []),
            stock: data.totalStock,
            totalStock: data.totalStock,
            categoryId: 'general',
            source: 'vendoor',
            sourceUrl: url,
            sku: sku,
            status: 'approved',
        };

        const existing = await databases.listDocuments(
            APPWRITE_DATABASE_ID,
            'products',
            [Query.equal('sku', sku)]
        );

        let result;
        if (existing.documents.length > 0) {
            console.log(`   🔄 Updating existing product (${sku})...`);
            const updateData = {
                stock: data.totalStock,
                totalStock: data.totalStock,
                price: finalPrice,
                originalPrice: originalPrice,
                colors: data.colors || [],
                sizes: data.sizes || [],
                colorSizeInventory: JSON.stringify(data.colorSizeInventory || []),
                images: filteredImages,
            };
            result = await databases.updateDocument(APPWRITE_DATABASE_ID, 'products', existing.documents[0].$id, updateData);
            return { type: 'updated', id: result.$id };
        } else {
            console.log(`   🆕 Creating new product (${sku})...`);
            result = await databases.createDocument(
                APPWRITE_DATABASE_ID,
                'products',
                ID.unique(),
                productData,
                [Permission.read(Role.any()), Permission.update(Role.users()), Permission.delete(Role.users())]
            );
            return { type: 'created', id: result.$id };
        }
    } catch (error) {
        console.error('❌ Save error:', error.message);
        return null;
    }
}

async function collectLinks(page) {
    const links = [];
    let currentPage = 1;

    // Limit to 5 pages for testing
    const MAX_PAGES = 5;

    while (currentPage <= MAX_PAGES) {
        const url = currentPage === 1 ? VENDOOR_PRODUCTS_URL : `${VENDOOR_PRODUCTS_URL}?page=${currentPage}`;
        console.log(`📄 Collecting links from page ${currentPage}...`);

        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await new Promise(r => setTimeout(r, 1000));

        const pageLinks = await page.evaluate(() => {
            const rows = Array.from(document.querySelectorAll('table#example tbody tr'));
            return rows.map(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 5) {
                    const titleAnchor = cells[2].querySelector('a');
                    const priceCell = cells[4];
                    if (titleAnchor) {
                        return {
                            link: titleAnchor.href.trim(),
                            title: (titleAnchor.textContent || '').trim(),
                            priceText: priceCell ? priceCell.textContent.trim() : ''
                        };
                    }
                }
                return null;
            }).filter(l => l !== null);
        });

        links.push(...pageLinks);

        // Check if next page exists
        const hasNext = await page.evaluate(() => {
            const nextBtn = document.querySelector('li.page-item:not(.disabled) a[rel="next"]');
            return !!nextBtn;
        });

        if (!hasNext) break;
        currentPage++;
    }

    // Deduplicate
    const unique = new Map();
    links.forEach(l => unique.set(l.link, l));
    return Array.from(unique.values());
}

// ==========================================
// Main Loop
// ==========================================

async function main() {
    console.log('🚀 Starting Improved Bulk Scraper...');
    await sendTelegram('🚀 Starting Improved Bulk Scraper...');

    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized'],
        defaultViewport: null
    });

    try {
        const page = await browser.newPage();

        // 1. Login
        if (!await login(page)) {
            throw new Error('Login failed');
        }
        await sendTelegram('✅ Login successful');

        // 2. Collect Links
        const products = await collectLinks(page);
        console.log(`📊 Found ${products.length} products to process.`);
        await sendTelegram(`📊 Found ${products.length} products. Starting processing...`);

        // 3. Process Products
        let success = 0;
        let fail = 0;

        for (let i = 0; i < products.length; i++) {
            const p = products[i];
            console.log(`\n📦 [${i + 1}/${products.length}] Processing: ${p.title}`);

            // Open new page for each product (Clean State)
            const productPage = await browser.newPage();

            // Copy cookies to maintain session
            const cookies = await page.cookies();
            await productPage.setCookie(...cookies);

            const data = await scrapeProduct(productPage, p.link, browser);
            await productPage.close();

            if (data) {
                // Fallback price from list if detail extraction failed
                if (!data.price && p.priceText) {
                    const match = p.priceText.match(/(\d+)/);
                    if (match) data.price = parseInt(match[1]);
                }

                if (data.price === 0) {
                    console.log('⚠️ Price is still 0, skipping save.');
                    fail++;
                } else {
                    const saved = await saveToAppwrite(data, p.link);
                    if (saved) success++;
                    else fail++;
                }
            } else {
                fail++;
            }

            // Progress Update
            if ((i + 1) % 5 === 0) {
                await sendTelegram(`📈 Progress: ${i + 1}/${products.length}\n✅ Success: ${success}\n❌ Failed: ${fail}`);
            }

            // Delay
            await new Promise(r => setTimeout(r, 2000));
        }

        console.log('\n✅ Scraping Completed!');
        await sendTelegram(`✅ Scraping Completed!\nTotal: ${products.length}\nSuccess: ${success}\nFailed: ${fail}`);

    } catch (error) {
        console.error('❌ Fatal Error:', error);
        await sendTelegram(`❌ Fatal Error: ${error.message}`);
    } finally {
        await browser.close();
    }
}

main();
