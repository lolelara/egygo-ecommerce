"""
🕷️ Vendoor Spider using Scrapy
الأقوى والأسرع لـ web scraping
"""

import scrapy
from scrapy.http import FormRequest


class VendoorSpider(scrapy.Spider):
    name = 'vendoor'
    start_urls = ['https://ven-door.com/auth/login']
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.email = 'almlmibrahym574@gmail.com'
        self.password = 'hema2004'
        self.total_pages = 41
    
    def parse(self, response):
        """Login to Ven-door"""
        return FormRequest.from_response(
            response,
            formdata={
                'email': self.email,
                'password': self.password
            },
            callback=self.after_login
        )
    
    def after_login(self, response):
        """After successful login, scrape all pages"""
        if 'logout' in response.text.lower():
            self.logger.info('✅ Login successful')
            
            # Generate requests for all pages
            for page_num in range(1, self.total_pages + 1):
                yield scrapy.Request(
                    url=f'https://ven-door.com/products-upload?page={page_num}',
                    callback=self.parse_products_page,
                    meta={'page': page_num}
                )
        else:
            self.logger.error('❌ Login failed')
    
    def parse_products_page(self, response):
        """Extract products from page"""
        page_num = response.meta['page']
        
        # Extract products
        products = response.css('.product-card, .product-item')
        
        for product in products:
            yield {
                'title': product.css('.product-title::text, h3::text, h2::text').get(),
                'price': product.css('.product-price::text, .price::text').re_first(r'[\d,]+(?:\.\d{2})?'),
                'original_price': product.css('.original-price::text, .old-price::text').re_first(r'[\d,]+(?:\.\d{2})?'),
                'image': product.css('img::attr(src)').get(),
                'link': response.urljoin(product.css('a::attr(href)').get()),
                'sku': product.css('.sku::text').get(),
                'category': product.css('.category::text').get(),
                'in_stock': not product.css('.out-of-stock').get(),
                'page': page_num,
                'scraped_at': response.headers.get('Date').decode('utf-8')
            }
        
        self.logger.info(f'📦 Page {page_num}: Found {len(products)} products')


# Settings for Scrapy
CUSTOM_SETTINGS = {
    'CONCURRENT_REQUESTS': 16,
    'DOWNLOAD_DELAY': 0.5,
    'COOKIES_ENABLED': True,
    'USER_AGENT': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'FEEDS': {
        'vendoor-products.json': {
            'format': 'json',
            'encoding': 'utf8',
            'indent': 2
        }
    }
}
