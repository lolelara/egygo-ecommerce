import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'product' | 'article';
  price?: number;
  currency?: string;
  availability?: 'in stock' | 'out of stock';
}

const DEFAULT_SEO = {
  title: 'إيجي جو - تسوق أونلاين في مصر | منتجات أصلية بأفضل الأسعار',
  description: 'تسوق الآن من إيجي جو واحصل على أفضل المنتجات بأسعار تنافسية. شحن سريع لجميع أنحاء مصر، دفع عند الاستلام، وضمان على جميع المنتجات. انضم لبرنامج التسويق بالعمولة واكسب حتى 25%',
  keywords: 'تسوق أونلاين, تسوق في مصر, شراء اونلاين, منتجات مصرية, التسوق الالكتروني, دفع عند الاستلام, شحن مجاني, تسويق بالعمولة, افلييت مصر, egygo, ايجي جو',
  image: 'https://egygo-ecommerce.appwrite.network/og-image.jpg',
  siteUrl: 'https://egygo-ecommerce.appwrite.network',
  siteName: 'إيجي جو',
};

export function EnhancedSEO({
  title,
  description,
  keywords,
  image,
  type = 'website',
  price,
  currency = 'EGP',
  availability,
}: SEOProps) {
  const location = useLocation();
  const currentUrl = `${DEFAULT_SEO.siteUrl}${location.pathname}`;

  const seoTitle = title 
    ? `${title} | ${DEFAULT_SEO.siteName}` 
    : DEFAULT_SEO.title;
  
  const seoDescription = description || DEFAULT_SEO.description;
  const seoKeywords = keywords || DEFAULT_SEO.keywords;
  const seoImage = image || DEFAULT_SEO.image;

  // Structured data for products
  const productSchema = type === 'product' && price ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    description: seoDescription,
    image: seoImage,
    offers: {
      '@type': 'Offer',
      price: price,
      priceCurrency: currency,
      availability: availability === 'in stock' 
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  } : null;

  // Structured data for organization
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: DEFAULT_SEO.siteName,
    url: DEFAULT_SEO.siteUrl,
    logo: `${DEFAULT_SEO.siteUrl}/logo.png`,
    description: DEFAULT_SEO.description,
    sameAs: [
      'https://www.facebook.com/egygo',
      'https://www.instagram.com/egygo',
      'https://twitter.com/egygo',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      telephone: '+20-123-456-7890',
      email: 'support@egygo.com',
      availableLanguage: ['ar', 'en'],
    },
  };

  // Website structured data
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: DEFAULT_SEO.siteName,
    url: DEFAULT_SEO.siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${DEFAULT_SEO.siteUrl}/#/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  // Breadcrumb schema
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbSchema = pathSegments.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'الرئيسية',
        item: DEFAULT_SEO.siteUrl,
      },
      ...pathSegments.map((segment, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: segment,
        item: `${DEFAULT_SEO.siteUrl}/${pathSegments.slice(0, index + 1).join('/')}`,
      })),
    ],
  } : null;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang="ar" dir="rtl" />
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:site_name" content={DEFAULT_SEO.siteName} />
      <meta property="og:locale" content="ar_EG" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      
      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="language" content="Arabic" />
      <meta name="author" content={DEFAULT_SEO.siteName} />
      <link rel="canonical" href={currentUrl} />
      
      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
      {productSchema && (
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      )}
    </Helmet>
  );
}

// Helper function to generate page-specific SEO
export const pageSEO = {
  home: () => ({
    title: 'إيجي جو - تسوق أونلاين في مصر',
    description: 'أفضل موقع تسوق أونلاين في مصر. منتجات أصلية، أسعار تنافسية، شحن سريع، دفع عند الاستلام. انضم لبرنامج التسويق بالعمولة واكسب حتى 25%',
    keywords: 'تسوق أونلاين مصر, شراء اونلاين, افضل موقع تسوق, egygo',
  }),
  
  products: (category?: string) => ({
    title: category ? `تسوق ${category}` : 'تسوق جميع المنتجات',
    description: `اكتشف مجموعة واسعة من ${category || 'المنتجات'} بأفضل الأسعار. شحن سريع لجميع أنحاء مصر ودفع عند الاستلام`,
    keywords: `${category || 'منتجات'}, تسوق ${category || 'اونلاين'}, شراء ${category || 'منتجات'} مصر`,
  }),
  
  affiliate: () => ({
    title: 'برنامج التسويق بالعمولة - اكسب حتى 25%',
    description: 'انضم لبرنامج التسويق بالعمولة من إيجي جو واكسب عمولة تصل إلى 25% على كل عملية بيع. أدوات تسويقية احترافية، دعم مستمر، وسحب أرباح سريع',
    keywords: 'تسويق بالعمولة, افلييت مصر, اكسب من الانترنت, عمولة تسويق, affiliate egypt',
  }),
  
  merchant: () => ({
    title: 'انضم كتاجر - بيع منتجاتك على إيجي جو',
    description: 'ابدأ البيع على إيجي جو واصل لآلاف العملاء في مصر. لوحة تحكم احترافية، تقارير مفصلة، ودعم تقني متواصل',
    keywords: 'بيع منتجات اونلاين, تجارة الكترونية مصر, merchant egypt, بائع اونلاين',
  }),
  
  login: () => ({
    title: 'تسجيل الدخول - إيجي جو',
    description: 'سجل دخولك لحسابك في إيجي جو وابدأ التسوق الآن',
    keywords: 'تسجيل دخول, login egygo',
  }),
  
  register: () => ({
    title: 'إنشاء حساب جديد - إيجي جو',
    description: 'أنشئ حسابك المجاني في إيجي جو وابدأ التسوق أو التسويق بالعمولة',
    keywords: 'انشاء حساب, تسجيل جديد, register egygo',
  }),
  
  cart: () => ({
    title: 'عربة التسوق',
    description: 'راجع منتجاتك وأكمل عملية الشراء بسهولة',
    keywords: 'عربة التسوق, سلة المشتريات, cart',
  }),
  
  checkout: () => ({
    title: 'إتمام الطلب',
    description: 'أكمل طلبك الآن. دفع عند الاستلام متاح لجميع أنحاء مصر',
    keywords: 'اتمام الطلب, checkout, دفع عند الاستلام',
  }),
};
