/**
 * 🔍 SEO Head Component for Meta Tags
 */

import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  category?: string;
  tags?: string[];
  price?: {
    amount: number;
    currency: string;
  };
  availability?: 'in stock' | 'out of stock' | 'preorder';
  brand?: string;
  rating?: {
    value: number;
    count: number;
  };
  locale?: string;
  alternateLocales?: string[];
  noindex?: boolean;
  canonical?: string;
  jsonLd?: any;
}

const SEOHead = ({
  title = 'إيجي جو - متجرك الإلكتروني الأول في مصر',
  description = 'اكتشف أفضل المنتجات والعروض الحصرية في إيجي جو. تسوق الإلكترونيات، الأزياء، المنتجات المنزلية وأكثر مع توصيل سريع وآمن.',
  keywords = 'تسوق اونلاين, متجر الكتروني, ايجي جو, egygo, تسوق مصر, عروض, خصومات, توصيل سريع, دفع آمن',
  image = 'https://egygo.me/og-image.jpg',
  url = 'https://egygo.me',
  type = 'website',
  author = 'EgyGo Team',
  publishedTime,
  modifiedTime,
  category,
  tags = [],
  price,
  availability = 'in stock',
  brand = 'EgyGo',
  rating,
  locale = 'ar_EG',
  alternateLocales = ['en_US'],
  noindex = false,
  canonical,
  jsonLd
}: SEOProps) => {
  const siteName = 'إيجي جو - EgyGo';
  const twitterHandle = '@egygo';
  
  // Generate structured data based on type
  const generateStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteName,
      url: url,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${url}/search?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    };

    if (type === 'product' && price) {
      return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: title,
        description: description,
        image: image,
        brand: {
          '@type': 'Brand',
          name: brand
        },
        offers: {
          '@type': 'Offer',
          url: canonical || url,
          priceCurrency: price.currency,
          price: price.amount,
          availability: `https://schema.org/${availability.replace(' ', '')}`,
          seller: {
            '@type': 'Organization',
            name: siteName
          }
        },
        ...(rating && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: rating.value,
            reviewCount: rating.count
          }
        })
      };
    }

    if (type === 'article') {
      return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description: description,
        image: image,
        author: {
          '@type': 'Person',
          name: author
        },
        publisher: {
          '@type': 'Organization',
          name: siteName,
          logo: {
            '@type': 'ImageObject',
            url: `${url}/logo.png`
          }
        },
        datePublished: publishedTime,
        dateModified: modifiedTime || publishedTime,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonical || url
        }
      };
    }

    return jsonLd || baseData;
  };

  const structuredData = generateStructuredData();

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="utf-8" />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Language Alternates */}
      <link rel="alternate" hrefLang={locale} href={url} />
      {alternateLocales.map(altLocale => (
        <link 
          key={altLocale}
          rel="alternate" 
          hrefLang={altLocale} 
          href={`${url}/${altLocale.split('_')[0]}`} 
        />
      ))}
      
      {/* Robots Meta */}
      <meta 
        name="robots" 
        content={noindex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'} 
      />
      <meta name="googlebot" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      {alternateLocales.map(altLocale => (
        <meta key={altLocale} property="og:locale:alternate" content={altLocale} />
      ))}
      
      {/* Article specific OG tags */}
      {type === 'article' && (
        <>
          <meta property="article:author" content={author} />
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {category && <meta property="article:section" content={category} />}
          {tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Product specific OG tags */}
      {type === 'product' && price && (
        <>
          <meta property="product:price:amount" content={price.amount.toString()} />
          <meta property="product:price:currency" content={price.currency} />
          <meta property="product:availability" content={availability} />
          <meta property="product:brand" content={brand} />
        </>
      )}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#8B5CF6" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="إيجي جو" />
      <meta name="application-name" content="إيجي جو" />
      <meta name="msapplication-TileColor" content="#8B5CF6" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      
      {/* Additional Structured Data for Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: siteName,
          url: 'https://egygo.me',
          logo: 'https://egygo.me/logo.png',
          sameAs: [
            'https://www.facebook.com/egygo',
            'https://twitter.com/egygo',
            'https://www.instagram.com/egygo',
            'https://www.youtube.com/egygo',
            'https://www.linkedin.com/company/egygo'
          ],
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+20-100-123-4567',
            contactType: 'customer service',
            areaServed: 'EG',
            availableLanguage: ['Arabic', 'English']
          }
        })}
      </script>
      
      {/* Breadcrumb Structured Data */}
      {type === 'product' && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'الرئيسية',
                item: 'https://egygo.me'
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: category || 'المنتجات',
                item: `https://egygo.me/category/${category}`
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: title,
                item: url
              }
            ]
          })}
        </script>
      )}
      
      {/* FAQ Structured Data (if applicable) */}
      {type === 'website' && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'ما هي طرق الدفع المتاحة؟',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'نقبل الدفع عبر البطاقات الائتمانية، فودافون كاش، والدفع عند الاستلام.'
                }
              },
              {
                '@type': 'Question',
                name: 'كم يستغرق التوصيل؟',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'التوصيل خلال 2-5 أيام عمل داخل القاهرة والجيزة، و3-7 أيام للمحافظات الأخرى.'
                }
              },
              {
                '@type': 'Question',
                name: 'هل يمكنني إرجاع المنتج؟',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'نعم، يمكنك إرجاع المنتج خلال 14 يوم من تاريخ الاستلام بشرط أن يكون في حالته الأصلية.'
                }
              }
            ]
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
