/*
  Vendoor multi-strategy scraper (local script)
  - Strategy A: HTTP session (axios + cookie jar + cheerio)
  - Strategy B: Playwright headless browser (fallback)

  Usage examples:
    pnpm tsx scripts/vendoor-scrape.ts --method=http --maxPages=3 --email="you@example.com" --password="***"
    pnpm tsx scripts/vendoor-scrape.ts --method=playwright --browser=chromium --maxPages=2 --email %VENDOOR_EMAIL% --password %VENDOOR_PASSWORD%

  Env vars (optional): VENDOOR_EMAIL, VENDOOR_PASSWORD
*/

import axios from 'axios';
import * as cheerio from 'cheerio';

// Simple arg parser (supports --key=value and --key value)
function parseArgs(argv: string[]) {
  const args: Record<string, string | boolean> = {};
  const tokens = argv.slice(2);
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (!t.startsWith('--')) continue;
    const eqIdx = t.indexOf('=');
    if (eqIdx !== -1) {
      const k = t.slice(2, eqIdx);
      const v = t.slice(eqIdx + 1);
      args[k] = v;
    } else {
      const k = t.slice(2);
      const next = tokens[i + 1];
      if (next && !next.startsWith('--')) {
        args[k] = next;
        i++;
      } else {
        args[k] = 'true';
      }
    }
  }
  return args;
}

const args = parseArgs(process.argv);
const METHOD = String(args.method || 'http');
const EMAIL = String(args.email || process.env.VENDOOR_EMAIL || '');
const PASSWORD = String(args.password || process.env.VENDOOR_PASSWORD || '');
const MAX_PAGES = Number(args.maxPages || 2);
const BROWSER = String(args.browser || 'chromium'); // chromium default
const HEADLESS = String(args.headless || 'true') === 'true';
const OUTPUT = String(args.out || '');
const DEBUG = String(args.debug || 'false') === 'true' || String(args.debug || '0') === '1';

if (!EMAIL || !PASSWORD) {
  console.error('\n❌ Missing credentials. Provide --email and --password or set VENDOOR_EMAIL/VENDOOR_PASSWORD env vars.');
  process.exit(1);
}

const BASE = 'https://aff.ven-door.com';
const LOGIN_URL = `${BASE}/login`;
const PRODUCTS_URL = (page: number) => `${BASE}/products?page=${page}`;

type Product = {
  id: string;
  title: string;
  supplier: string;
  price: string;
  commission: string;
  stock: string;
  image: string;
};

type ScrapeResult = {
  success: boolean;
  totalPages?: number;
  totalProducts?: number;
  products?: Product[];
  error?: string;
};

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function runHttpStrategy(): Promise<ScrapeResult> {
  // Try to dynamically use axios-cookiejar-support and tough-cookie if available
  let wrapper: any;
  let CookieJar: any;
  try {
    const m = await import('axios-cookiejar-support');
    wrapper = (m as any).wrapper;
    CookieJar = (await import('tough-cookie')).CookieJar;
  } catch (e) {
    console.error('❌ HTTP login needs axios-cookiejar-support and tough-cookie.');
    console.error('   Install: pnpm add axios-cookiejar-support tough-cookie');
    return { success: false, error: 'Missing cookie jar dependencies' };
  }

  const jar = new CookieJar();
  const client = wrapper(axios.create({
    jar,
    withCredentials: true,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
    },
    timeout: 30000,
    maxRedirects: 5,
    validateStatus: (s) => s < 400,
  }));

  // 1) Load login page to get cookies + CSRF hidden fields
  const loginPage = await client.get(LOGIN_URL);
  const $login = cheerio.load(loginPage.data);
  const payload: Record<string, string> = {};
  $login('form input[type="hidden"]').each((_, el) => {
    const name = $login(el).attr('name');
    const value = $login(el).attr('value') || '';
    if (name) payload[name] = value;
  });
  // Common field names (observed on Ven-door)
  payload['name'] = EMAIL; // sometimes field name is "name" for email/username
  payload['password'] = PASSWORD;

  // 2) Submit login
  const form = new URLSearchParams(payload);
  await client.post(LOGIN_URL, form.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Origin': BASE,
      'Referer': LOGIN_URL,
    }
  });

  // quick sanity check – fetch first products page
  const first = await client.get(PRODUCTS_URL(1));
  if ((first.request as any)?.res?.responseUrl?.includes('/login') || String(first.data).toLowerCase().includes('login')) {
    return { success: false, error: 'Login failed (HTTP strategy)' };
  }

  const products: Product[] = [];

  for (let p = 1; p <= MAX_PAGES; p++) {
    console.log(`📄 [HTTP] Fetching products page ${p}`);
    const res = await client.get(PRODUCTS_URL(p));
    const $ = cheerio.load(res.data);

    const rows = $('table tbody tr');
    if (rows.length === 0) {
      if (p === 1) {
        return { success: false, error: 'No rows found. The layout may have changed.' };
      }
      console.log(`✅ No more rows at page ${p}. Stopping.`);
      break;
    }

    rows.each((_, row) => {
      try {
        const cells = $(row).find('td');
        if (cells.length < 8) return;

        const imageCell = $(cells[0]);
        const nameCell = $(cells[1]);
        const supplierCell = $(cells[2]);
        const priceCell = $(cells[3]);
        const commissionCell = $(cells[4]);
        const stockCell = $(cells[5]);
        const actionCell = $(cells[7]);

        const img = imageCell.find('img');
        const image = img.attr('src') || img.attr('data-src') || '';
        const title = (nameCell.text() || '').trim();
        const supplier = (supplierCell.text() || '').trim();
        const price = (priceCell.text() || '').trim();
        const commission = (commissionCell.text() || '').trim();
        const stock = (stockCell.text() || '').trim();

        const viewBtn = actionCell.find('a[href*="/products/"]');
        const href = viewBtn.attr('href') || '';
        const id = href.includes('/products/') ? href.split('/products/')[1].split(/[?#]/)[0] : '';

        if (id && title) {
          products.push({ id, title, supplier, price, commission, stock, image });
        }
      } catch {}
    });

    await sleep(700);
  }

  return { success: true, totalPages: MAX_PAGES, totalProducts: products.length, products };
}

async function runPlaywrightStrategy(): Promise<ScrapeResult> {
  let pw: any;
  try {
    pw = await import('playwright');
  } catch (e) {
    console.error('❌ Playwright not installed.');
    console.error('   Install: pnpm add -D playwright');
    return { success: false, error: 'Missing playwright dependency' };
  }

  const browserType = (pw as any)[BROWSER] || pw.chromium; // default chromium
  const browser = await browserType.launch({ headless: HEADLESS, args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  if (DEBUG) {
    page.on('console', (msg) => {
      try {
        console.log(`[PW Console] ${msg.type()}:`, msg.text());
      } catch {}
    });
  }

  try {
    console.log('🔐 [PW] Logging in...');
    await page.goto(LOGIN_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await sleep(2000);
    
    await page.waitForSelector('input[name="name"]', { timeout: 10000 });
    await page.type('input[name="name"]', EMAIL, { delay: 50 });
    await page.type('input[type="password"]', PASSWORD, { delay: 50 });
    
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }).catch(() => {}),
      page.click('button[type="submit"]')
    ]).catch(() => {});
    
    await sleep(5000);
    
    if (page.url().includes('login')) {
      throw new Error('فشل تسجيل الدخول');
    }
    
    console.log('✅ تم تسجيل الدخول بنجاح');

    const products: Product[] = [];

    for (let p = 1; p <= MAX_PAGES; p++) {
      const url = PRODUCTS_URL(p);
      console.log(`📄 [PW] Fetching products page ${p}`);
      await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
      // Give client-side rendering a moment and scroll to trigger lazy content
      await page.waitForTimeout(800);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);

      // Try dismissing cookie banners or popups quietly
      try { await page.locator('button:has-text("Accept")').first().click({ timeout: 1500 }); } catch {}
      try { await page.locator('button:has-text("Agree")').first().click({ timeout: 1500 }); } catch {}
      try { await page.locator('text=موافق').first().click({ timeout: 1500 }); } catch {}

      // Ensure table is rendered and rows are present (poll up to ~15s)
      await page.waitForSelector('table', { timeout: 10000 }).catch(() => {});
      try {
        await page.waitForFunction(
          () => document.querySelectorAll('table tbody tr').length > 0,
          undefined,
          { timeout: 15000 }
        );
      } catch {}

      // Wait for at least one product link to be present
      await page.waitForSelector('table tbody tr a[href*="/product/"]', { timeout: 10000 }).catch(() => {});

      const rowsCount = await page.$$eval('table tbody tr', els => els.length).catch(() => 0);
      console.log(`🧮 [PW] Rows detected on page ${p}: ${rowsCount}`);

      if (DEBUG) {
        try {
          const fs = await import('fs');
          if (!fs.existsSync('tmp')) fs.mkdirSync('tmp');
          const html = await page.content();
          await fs.promises.writeFile(`tmp/vendoor-debug-page-${p}.html`, html, 'utf8');
          await page.screenshot({ path: `tmp/vendoor-debug-page-${p}.png`, fullPage: true });
          console.log(`📝 [PW] Saved debug HTML and screenshot for page ${p}`);
          // Print first row HTML snippet to console for quick inspection
          await page.evaluate(() => {
            const firstRow = document.querySelector('table tbody tr');
            if (firstRow) {
              const snippet = (firstRow as HTMLElement).outerHTML.substring(0, 1500);
              console.log('ROW_HTML_SNIPPET:', snippet);
            }
          });
        } catch (e) {
          console.log('⚠️ [PW] Failed to save debug artifacts:', (e as Error).message);
        }
      }

      const pageProducts = await page.evaluate(`
        (function() {
          var out = [];
          var pickText = function(el) {
            if (!el) return '';
            var text = el.innerText || el.textContent || '';
            return String(text).trim();
          };
          
          var rows = document.querySelectorAll('table tbody tr');
          for (var i = 0; i < rows.length; i++) {
            try {
              var row = rows[i];
              var tds = row.querySelectorAll('td');
              if (!tds || tds.length < 3) continue;

              var imgA = tds[1] && tds[1].querySelector('a img');
              var titleA = (tds[3] && tds[3].querySelector('a')) || (tds[2] && tds[2].querySelector('a'));
              var secondaryA = tds[2] && tds[2].querySelector('a');
              var priceA = tds[4] && tds[4].querySelector('a, span, div, b, strong');
              var commissionA = tds[5] && tds[5].querySelector('a, span, div, b, strong');
              var stockSpan = tds[6] && tds[6].querySelector('span.stock-odd, span, div');

              var image = imgA ? (imgA.getAttribute('src') || imgA.getAttribute('data-src') || '') : '';
              var title = pickText(titleA) || pickText(tds[3]) || pickText(tds[2]) || pickText(row);
              var supplier = pickText(secondaryA) || pickText(tds[2]) || pickText(tds[3]);
              var price = pickText(priceA) || pickText(tds[4]);
              var commission = pickText(commissionA) || pickText(tds[5]);
              var stock = pickText(stockSpan) || pickText(tds[6]);

              var id = '';
              var linkEl = titleA || row.querySelector('a[href*="/product/"]');
              var rawHref = linkEl ? (linkEl.getAttribute('href') || linkEl.href || '').trim() : '';
              if (rawHref) {
                try {
                  var a = document.createElement('a');
                  a.href = rawHref;
                  var parts = a.pathname.split('/').filter(function(p) { return p; });
                  var idxp = -1;
                  for (var j = 0; j < parts.length; j++) {
                    if (parts[j] === 'products' || parts[j] === 'product') { idxp = j; break; }
                  }
                  if (idxp >= 0 && parts[idxp + 1]) id = parts[idxp + 1];
                  else id = parts[parts.length - 1] || '';
                } catch (e) {}
              }

              var rowObj = { 
                id: id || ('row-' + (i + 1)), 
                title: title || ('Row ' + (i + 1)), 
                supplier: supplier, 
                price: price, 
                commission: commission, 
                stock: stock, 
                image: image 
              };
              if (i < 3) {
                try { console.log('EXTRACTED_ROW', JSON.stringify(rowObj)); } catch (e) {}
              }
              out.push(rowObj);
            } catch (e) {}
          }
          return out;
        })()
      `);

      console.log(`📦 [PW] Extracted rows on page ${p}:`, pageProducts.length);

      products.push(...pageProducts);
      await sleep(400);
    }

    return { success: true, totalPages: MAX_PAGES, totalProducts: products.length, products };
  } finally {
    await page.close();
    await browser.close();
  }
}

(async () => {
  console.log(`🚀 Starting Vendoor scraper (method=${METHOD}) | pages=${MAX_PAGES}`);

  let result: ScrapeResult;
  if (METHOD === 'http') {
    result = await runHttpStrategy();
    if (!result.success) {
      console.warn('⚠️ HTTP strategy failed, trying Playwright fallback...');
      result = await runPlaywrightStrategy();
    }
  } else if (METHOD === 'playwright') {
    result = await runPlaywrightStrategy();
  } else {
    console.error(`❌ Unknown method: ${METHOD}`);
    process.exit(1);
  }

  if (!result.success) {
    console.error('❌ Scrape failed:', result.error);
    process.exit(1);
  }

  const summary = { total: result.totalProducts, pages: result.totalPages };
  console.log('✅ Done:', summary);

  if (OUTPUT) {
    const fs = await import('fs');
    await fs.promises.writeFile(String(OUTPUT), JSON.stringify(result.products || [], null, 2), 'utf8');
    console.log(`💾 Saved ${result.products?.length || 0} products to ${OUTPUT}`);
    if ((result.products?.length || 0) > 0) {
      const sample = (result.products || []).slice(0, 3);
      console.log('🧪 Sample (first 3 rows):');
      console.log(sample);
    }
  } else {
    console.log(JSON.stringify(result.products || [], null, 2));
  }
})();
