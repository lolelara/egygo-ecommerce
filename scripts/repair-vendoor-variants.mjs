import { Client, Databases, Query } from 'node-appwrite';

// Appwrite config (align with other scripts)
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('68d8b9db00134c41e7c8')
  .setKey('standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5');

const databases = new Databases(client);
const DATABASE_ID = '68de037e003bd03c4d45';
const COLLECTION_ID = 'products';

function normalizeArabic(s = '') {
  return String(s)
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/[ًٌٍَُِّْ]/g, '')
    .trim();
}

function normalizeSize(s = '') {
  const str = String(s).trim();
  const m = str.match(/\d+(?:\.\d+)?/);
  return m ? m[0] : str; // keep S/M/L etc.
}

// Extract inventory lines like: "اسود - مقاس 41: 10 قطعة"
function extractInventoryFromText(text) {
  const inv = [];
  if (!text) return inv;
  const pattern = /([\u0600-\u06FFa-zA-Z]+)\s*[-–]\s*مقاس\s*([\dA-Za-z\.]+)\s*[:：]\s*(\d+)\s*قطعة/gu;
  let m;
  while ((m = pattern.exec(text)) !== null) {
    const color = normalizeArabic(m[1]);
    const size = normalizeSize(m[2]);
    const qty = parseInt(m[3], 10) || 0;
    inv.push({ color, size, quantity: qty });
  }
  return inv;
}

function removeInventoryLines(text) {
  if (!text) return text;
  // Remove bullets like "• color - مقاس size: qty قطعة" or lines with that pattern
  return text
    .replace(/\u2022?\s*[\u0600-\u06FFa-zA-Z]+\s*[-–]\s*مقاس\s*[\dA-Za-z\.]+\s*[:：]\s*\d+\s*قطعة[\s\S]*?(?=\n|$)/gu, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function fixImages(images = []) {
  const list = Array.isArray(images) ? images : [];
  return list.filter((u) => u && !/logo2?\.png|favicon/i.test(String(u)));
}

function rebuildFromSizesFallback(sizes = []) {
  // If sizes contain entries like "اسود 41" without inventory, try to split color+size
  const inv = [];
  const colors = new Set();
  const cleanSizes = new Set();
  for (const s of sizes || []) {
    const str = String(s).trim();
    const m = str.match(/^([\u0600-\u06FFa-zA-Z]+)\s+(\d+(?:\.\d+)?)$/);
    if (m) {
      const color = normalizeArabic(m[1]);
      const size = normalizeSize(m[2]);
      colors.add(color);
      cleanSizes.add(size);
      // quantity unknown => 0 (better than nothing)
      inv.push({ color, size, quantity: 0 });
    } else {
      // try numeric only
      if (/\d/.test(str)) cleanSizes.add(normalizeSize(str));
    }
  }
  return {
    colors: Array.from(colors),
    sizes: Array.from(cleanSizes),
    inventory: inv,
  };
}

async function repair() {
  console.log('🛠️ Repairing Vendoor products...');
  const pageLimit = 100;
  let offset = 0;
  let fixed = 0;
  let scanned = 0;

  while (true) {
    const res = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [
        Query.equal('source', 'vendoor'),
        Query.limit(pageLimit),
        Query.offset(offset),
      ]
    );

    if (!res.documents.length) break;

    for (const p of res.documents) {
      scanned++;
      const originalDesc = p.description || '';
      const invFromDesc = extractInventoryFromText(originalDesc);

      let inventory = [];
      let colors = Array.isArray(p.colors) ? p.colors : [];
      let sizes = Array.isArray(p.sizes) ? p.sizes : [];

      if (p.colorSizeInventory) {
        try {
          const parsed = JSON.parse(p.colorSizeInventory);
          if (Array.isArray(parsed) && parsed.length) {
            inventory = parsed.map(v => ({
              color: normalizeArabic(v.color),
              size: normalizeSize(v.size),
              quantity: parseInt(v.quantity, 10) || 0,
            }));
          }
        } catch (e) {
          // ignore parse error
        }
      }

      // Merge with desc inventory if present (desc is source of truth for older data)
      if (invFromDesc.length) {
        inventory = invFromDesc;
      }

      // If still empty, try fallback from sizes like "اسود 41"
      if (!inventory.length && sizes && sizes.length) {
        const fb = rebuildFromSizesFallback(sizes);
        if (fb.inventory.length) {
          inventory = fb.inventory;
          colors = fb.colors;
          sizes = fb.sizes;
        }
      }

      // Normalize colors/sizes
      const colorsSet = new Set(colors.map(normalizeArabic));
      const sizesSet = new Set(sizes.map(normalizeSize));

      for (const item of inventory) {
        if (item.color) colorsSet.add(normalizeArabic(item.color));
        if (item.size) sizesSet.add(normalizeSize(item.size));
      }

      const cleanDesc = removeInventoryLines(originalDesc);
      const filteredImages = fixImages(p.images);
      const stockSum = inventory.reduce((sum, it) => sum + (parseInt(it.quantity, 10) || 0), 0);

      const needsUpdate = (
        cleanDesc !== originalDesc ||
        filteredImages.length !== (p.images || []).length ||
        JSON.stringify(Array.from(colorsSet)) !== JSON.stringify(p.colors || []) ||
        JSON.stringify(Array.from(sizesSet)) !== JSON.stringify(p.sizes || []) ||
        (!!stockSum && stockSum !== (p.stock || 0)) ||
        (!!inventory.length && JSON.stringify(inventory) !== p.colorSizeInventory)
      );

      if (!needsUpdate) continue;

      try {
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTION_ID,
          p.$id,
          {
            description: cleanDesc.substring(0, 1500),
            images: filteredImages.length ? filteredImages : p.images,
            colors: Array.from(colorsSet),
            sizes: Array.from(sizesSet),
            colorSizeInventory: inventory.length ? JSON.stringify(inventory) : p.colorSizeInventory,
            stock: stockSum || p.stock || 0,
            totalStock: stockSum || p.totalStock || 0,
            isActive: true,
            status: 'approved',
            lastSyncedAt: new Date().toISOString(),
          }
        );
        fixed++;
        console.log(`✅ Fixed: ${p.$id} | stock=${stockSum} | colors=${colorsSet.size} | sizes=${sizesSet.size}`);
      } catch (e) {
        console.log(`❌ Update failed: ${p.$id} → ${e.message}`);
      }
    }

    offset += pageLimit;
    if (offset >= res.total) break;
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Scanned: ${scanned}`);
  console.log(`Fixed:   ${fixed}`);
  console.log('Done.');
}

repair().catch((e) => console.error('Fatal:', e.message));
