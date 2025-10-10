/**
 * 📍 Sitemap Generator for SEO
 */

import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  images?: Array<{
    loc: string;
    title?: string;
    caption?: string;
  }>;
  alternates?: Array<{
    hreflang: string;
    href: string;
  }>;
}

class SitemapGenerator {
  private baseUrl: string;
  public urls: SitemapUrl[] = [];

  constructor(baseUrl: string = 'https://egygo.me') {
    this.baseUrl = baseUrl;
  }

  /**
   * Add static pages
   */
  addStaticPages() {
    const staticPages = [
      { path: '/', changefreq: 'daily' as const, priority: 1.0 },
      { path: '/products', changefreq: 'daily' as const, priority: 0.9 },
      { path: '/categories', changefreq: 'weekly' as const, priority: 0.8 },
      { path: '/offers', changefreq: 'daily' as const, priority: 0.9 },
      { path: '/about', changefreq: 'monthly' as const, priority: 0.5 },
      { path: '/contact', changefreq: 'monthly' as const, priority: 0.5 },
      { path: '/privacy', changefreq: 'yearly' as const, priority: 0.3 },
      { path: '/terms', changefreq: 'yearly' as const, priority: 0.3 },
      { path: '/faq', changefreq: 'monthly' as const, priority: 0.6 },
      { path: '/affiliate', changefreq: 'weekly' as const, priority: 0.7 },
      { path: '/merchant', changefreq: 'weekly' as const, priority: 0.7 },
      { path: '/blog', changefreq: 'daily' as const, priority: 0.8 },
    ];

    staticPages.forEach(page => {
      this.urls.push({
        loc: `${this.baseUrl}${page.path}`,
        lastmod: format(new Date(), 'yyyy-MM-dd'),
        changefreq: page.changefreq,
        priority: page.priority,
        alternates: [
          { hreflang: 'ar', href: `${this.baseUrl}${page.path}` },
          { hreflang: 'en', href: `${this.baseUrl}/en${page.path}` }
        ]
      });
    });
  }

  /**
   * Add dynamic pages (products, categories, etc.)
   */
  async addDynamicPages() {
    // In a real scenario, fetch from database
    // For now, we'll add sample data
    
    // Categories
    const categories = [
      'electronics', 'fashion', 'home', 'sports', 'books', 
      'toys', 'beauty', 'food', 'automotive', 'garden'
    ];
    
    categories.forEach(category => {
      this.urls.push({
        loc: `${this.baseUrl}/category/${category}`,
        lastmod: format(new Date(), 'yyyy-MM-dd'),
        changefreq: 'weekly',
        priority: 0.7
      });
    });

    // Sample products
    for (let i = 1; i <= 100; i++) {
      this.urls.push({
        loc: `${this.baseUrl}/product/product-${i}`,
        lastmod: format(new Date(), 'yyyy-MM-dd'),
        changefreq: 'weekly',
        priority: 0.6,
        images: [{
          loc: `${this.baseUrl}/images/products/product-${i}.jpg`,
          title: `Product ${i}`,
          caption: `High quality product image ${i}`
        }]
      });
    }

    // Blog posts
    for (let i = 1; i <= 20; i++) {
      this.urls.push({
        loc: `${this.baseUrl}/blog/post-${i}`,
        lastmod: format(new Date(), 'yyyy-MM-dd'),
        changefreq: 'monthly',
        priority: 0.5
      });
    }
  }

  /**
   * Generate XML sitemap
   */
  generateXML(): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n';
    xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

    this.urls.forEach(url => {
      xml += '  <url>\n';
      xml += `    <loc>${this.escapeXml(url.loc)}</loc>\n`;
      
      if (url.lastmod) {
        xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
      }
      
      if (url.changefreq) {
        xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
      }
      
      if (url.priority !== undefined) {
        xml += `    <priority>${url.priority}</priority>\n`;
      }
      
      // Add alternate language versions
      if (url.alternates) {
        url.alternates.forEach(alt => {
          xml += `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${this.escapeXml(alt.href)}"/>\n`;
        });
      }
      
      // Add images
      if (url.images) {
        url.images.forEach(image => {
          xml += '    <image:image>\n';
          xml += `      <image:loc>${this.escapeXml(image.loc)}</image:loc>\n`;
          if (image.title) {
            xml += `      <image:title>${this.escapeXml(image.title)}</image:title>\n`;
          }
          if (image.caption) {
            xml += `      <image:caption>${this.escapeXml(image.caption)}</image:caption>\n`;
          }
          xml += '    </image:image>\n';
        });
      }
      
      xml += '  </url>\n';
    });

    xml += '</urlset>';
    return xml;
  }

  /**
   * Generate sitemap index for multiple sitemaps
   */
  generateSitemapIndex(sitemaps: string[]): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    sitemaps.forEach(sitemap => {
      xml += '  <sitemap>\n';
      xml += `    <loc>${this.baseUrl}/${sitemap}</loc>\n`;
      xml += `    <lastmod>${format(new Date(), 'yyyy-MM-dd')}</lastmod>\n`;
      xml += '  </sitemap>\n';
    });
    
    xml += '</sitemapindex>';
    return xml;
  }

  /**
   * Escape XML special characters
   */
  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * Save sitemap to file
   */
  saveSitemap(filename: string = 'sitemap.xml') {
    const xml = this.generateXML();
    const outputPath = path.join(process.cwd(), 'public', filename);
    
    // Ensure public directory exists
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, xml, 'utf-8');
    console.log(`✅ Sitemap generated: ${outputPath}`);
    console.log(`📊 Total URLs: ${this.urls.length}`);
  }

  /**
   * Generate robots.txt
   */
  generateRobotsTxt(): string {
    const robots = `# Robots.txt for EgyGo
# Generated: ${new Date().toISOString()}

# Allow all crawlers
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /checkout/
Disallow: /account/
Disallow: /cart
Disallow: /search?
Disallow: /*.json$
Disallow: /*?sort=
Disallow: /*?filter=
Disallow: /*?page=
Allow: /api/products
Allow: /api/categories

# Specific crawler rules
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 1

User-agent: DuckDuckBot
Allow: /
Crawl-delay: 1

# Block bad bots
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: DotBot
Disallow: /

User-agent: MJ12bot
Disallow: /

# Sitemap location
Sitemap: ${this.baseUrl}/sitemap.xml
Sitemap: ${this.baseUrl}/sitemap-products.xml
Sitemap: ${this.baseUrl}/sitemap-categories.xml
Sitemap: ${this.baseUrl}/sitemap-blog.xml

# Cache control
Cache-Control: max-age=7200`;

    return robots;
  }

  /**
   * Save robots.txt
   */
  saveRobotsTxt() {
    const robots = this.generateRobotsTxt();
    const outputPath = path.join(process.cwd(), 'public', 'robots.txt');
    fs.writeFileSync(outputPath, robots, 'utf-8');
    console.log(`✅ Robots.txt generated: ${outputPath}`);
  }
}

// Generate sitemaps
async function generateSitemaps() {
  console.log('🚀 Starting sitemap generation...');
  
  // Main sitemap
  const mainGenerator = new SitemapGenerator();
  mainGenerator.addStaticPages();
  await mainGenerator.addDynamicPages();
  mainGenerator.saveSitemap('sitemap.xml');
  
  // Generate robots.txt
  mainGenerator.saveRobotsTxt();
  
  // Product sitemap (for large sites)
  const productGenerator = new SitemapGenerator();
  // Add only products
  for (let i = 1; i <= 1000; i++) {
    productGenerator.urls.push({
      loc: `https://egygo.me/product/product-${i}`,
      lastmod: format(new Date(), 'yyyy-MM-dd'),
      changefreq: 'weekly',
      priority: 0.6
    });
  }
  productGenerator.saveSitemap('sitemap-products.xml');
  
  // Category sitemap
  const categoryGenerator = new SitemapGenerator();
  const categories = [
    'electronics', 'fashion', 'home', 'sports', 'books',
    'toys', 'beauty', 'food', 'automotive', 'garden'
  ];
  categories.forEach(category => {
    categoryGenerator.urls.push({
      loc: `https://egygo.me/category/${category}`,
      lastmod: format(new Date(), 'yyyy-MM-dd'),
      changefreq: 'weekly',
      priority: 0.7
    });
  });
  categoryGenerator.saveSitemap('sitemap-categories.xml');
  
  // Blog sitemap
  const blogGenerator = new SitemapGenerator();
  for (let i = 1; i <= 50; i++) {
    blogGenerator.urls.push({
      loc: `https://egygo.me/blog/post-${i}`,
      lastmod: format(new Date(), 'yyyy-MM-dd'),
      changefreq: 'monthly',
      priority: 0.5
    });
  }
  blogGenerator.saveSitemap('sitemap-blog.xml');
  
  // Generate sitemap index
  const indexGenerator = new SitemapGenerator();
  const sitemapIndex = indexGenerator.generateSitemapIndex([
    'sitemap.xml',
    'sitemap-products.xml',
    'sitemap-categories.xml',
    'sitemap-blog.xml'
  ]);
  
  const indexPath = path.join(process.cwd(), 'public', 'sitemap-index.xml');
  fs.writeFileSync(indexPath, sitemapIndex, 'utf-8');
  console.log(`✅ Sitemap index generated: ${indexPath}`);
  
  console.log('✨ All sitemaps generated successfully!');
}

// Run if called directly
if (require.main === module) {
  generateSitemaps().catch(console.error);
}

export { SitemapGenerator, generateSitemaps };
