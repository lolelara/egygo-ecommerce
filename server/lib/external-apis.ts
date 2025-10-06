// ============================================
// External APIs Configuration & Helpers
// ============================================

/**
 * هذا الملف يحتوي على جميع الـ External APIs integrations:
 * - OpenAI (AI Shopping Assistant)
 * - Google Maps (GPS Tracking)
 * - Exchange Rate API (Currency Conversion)
 */

// ===== OPENAI API =====

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

/**
 * AI Shopping Assistant - Chat with GPT-4
 */
export async function aiChat(message: string, context?: any): Promise<string> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const systemPrompt = `أنت مساعد تسوق ذكي لمنصة إيجي جو.
مهمتك: مساعدة المستخدمين في اختيار المنتجات المناسبة.
الأسلوب: ودود، محترف، بالعربية.
تجنب: الإجابات الطويلة جداً.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0]?.message?.content || 'عذراً، لم أستطع فهم طلبك.';
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('فشل الاتصال بالمساعد الذكي');
  }
}

/**
 * Product recommendations based on user query
 */
export async function getProductRecommendations(
  query: string,
  products: any[]
): Promise<any[]> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      // Fallback: simple keyword matching
      return products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3);
    }

    const prompt = `بناءً على الطلب: "${query}"
المنتجات المتاحة: ${JSON.stringify(products.map(p => ({ id: p.id, name: p.name, category: p.category })))}

اختر أفضل 3 منتجات مناسبة. أرجع فقط IDs كـ JSON array: ["id1", "id2", "id3"]`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3
    });

    const content = response.choices[0]?.message?.content || '[]';
    const recommendedIds = JSON.parse(content);
    
    return products.filter(p => recommendedIds.includes(p.id));
  } catch (error) {
    console.error('Product Recommendations Error:', error);
    return products.slice(0, 3); // Fallback
  }
}

// ===== GOOGLE MAPS API =====

import { Client } from '@googlemaps/google-maps-services-js';

const mapsClient = new Client({});

/**
 * Get current location coordinates from address
 */
export async function geocodeAddress(address: string) {
  try {
    if (!process.env.GOOGLE_MAPS_API_KEY) {
      throw new Error('GOOGLE_MAPS_API_KEY is not configured');
    }

    const response = await mapsClient.geocode({
      params: {
        address,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.results.length === 0) {
      throw new Error('Address not found');
    }

    const location = response.data.results[0].geometry.location;
    return {
      lat: location.lat,
      lng: location.lng,
      formatted_address: response.data.results[0].formatted_address
    };
  } catch (error) {
    console.error('Geocoding Error:', error);
    throw new Error('فشل تحديد الموقع');
  }
}

/**
 * Calculate ETA between two points
 */
export async function calculateETA(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
) {
  try {
    if (!process.env.GOOGLE_MAPS_API_KEY) {
      // Fallback: simple distance calculation (30 minutes + 1 min per km)
      const distance = calculateDistance(origin, destination);
      const minutes = 30 + Math.floor(distance);
      return {
        duration: minutes * 60, // seconds
        duration_text: `${minutes} دقيقة`,
        distance: distance * 1000, // meters
        distance_text: `${distance.toFixed(1)} كم`
      };
    }

    const response = await mapsClient.distancematrix({
      params: {
        origins: [`${origin.lat},${origin.lng}`],
        destinations: [`${destination.lat},${destination.lng}`],
        key: process.env.GOOGLE_MAPS_API_KEY,
        mode: 'driving' as any,
        language: 'ar' as any
      }
    });

    const element = response.data.rows[0].elements[0];
    
    if (element.status !== 'OK') {
      throw new Error('Cannot calculate route');
    }

    return {
      duration: element.duration.value, // seconds
      duration_text: element.duration.text,
      distance: element.distance.value, // meters
      distance_text: element.distance.text
    };
  } catch (error) {
    console.error('ETA Calculation Error:', error);
    throw new Error('فشل حساب الوقت المتوقع');
  }
}

/**
 * Get route between two points
 */
export async function getRoute(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
) {
  try {
    if (!process.env.GOOGLE_MAPS_API_KEY) {
      throw new Error('GOOGLE_MAPS_API_KEY is not configured');
    }

    const response = await mapsClient.directions({
      params: {
        origin: `${origin.lat},${origin.lng}`,
        destination: `${destination.lat},${destination.lng}`,
        key: process.env.GOOGLE_MAPS_API_KEY,
        mode: 'driving' as any,
        language: 'ar' as any
      }
    });

    if (response.data.routes.length === 0) {
      throw new Error('No route found');
    }

    const route = response.data.routes[0];
    return {
      distance: route.legs[0].distance,
      duration: route.legs[0].duration,
      steps: route.legs[0].steps.map(step => ({
        instruction: step.html_instructions,
        distance: step.distance.text,
        duration: step.duration.text
      })),
      polyline: route.overview_polyline.points
    };
  } catch (error) {
    console.error('Route Calculation Error:', error);
    throw new Error('فشل حساب المسار');
  }
}

// Helper: Calculate distance using Haversine formula
function calculateDistance(
  point1: { lat: number; lng: number },
  point2: { lat: number; lng: number }
): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(point2.lat - point1.lat);
  const dLng = toRad(point2.lng - point1.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(point1.lat)) * Math.cos(toRad(point2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// ===== EXCHANGE RATE API =====

import axios from 'axios';

// Options: ExchangeRate-API (free), CurrencyLayer, Fixer.io
const EXCHANGE_RATE_API = 'https://api.exchangerate-api.com/v4/latest/';

/**
 * Get current exchange rates for EGP
 */
export async function getExchangeRates(baseCurrency: string = 'EGP') {
  try {
    // Option 1: Using ExchangeRate-API (no key needed)
    const response = await axios.get(`${EXCHANGE_RATE_API}${baseCurrency}`);
    
    return {
      baseCurrency,
      rates: response.data.rates,
      lastUpdated: response.data.date
    };
  } catch (error) {
    console.error('Exchange Rate API Error:', error);
    
    // Fallback: Static rates (update manually)
    return {
      baseCurrency: 'EGP',
      rates: {
        USD: 0.032,
        EUR: 0.030,
        GBP: 0.025,
        SAR: 0.12,
        AED: 0.12,
        KWD: 0.01
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    };
  }
}

/**
 * Convert currency amount
 */
export async function convertCurrency(
  amount: number,
  from: string,
  to: string
): Promise<{ result: number; rate: number }> {
  try {
    const rates = await getExchangeRates(from);
    const rate = rates.rates[to];
    
    if (!rate) {
      throw new Error(`Conversion rate not found for ${from} to ${to}`);
    }
    
    return {
      result: amount * rate,
      rate
    };
  } catch (error) {
    console.error('Currency Conversion Error:', error);
    throw new Error('فشل تحويل العملة');
  }
}

/**
 * Get multiple currency rates at once
 */
export async function getMultipleCurrencyRates(
  baseCurrency: string,
  targetCurrencies: string[]
) {
  try {
    const allRates = await getExchangeRates(baseCurrency);
    
    const rates: Record<string, number> = {};
    targetCurrencies.forEach(currency => {
      if (allRates.rates[currency]) {
        rates[currency] = allRates.rates[currency];
      }
    });
    
    return {
      baseCurrency,
      rates,
      lastUpdated: allRates.lastUpdated
    };
  } catch (error) {
    console.error('Multiple Currency Rates Error:', error);
    throw error;
  }
}

// ===== OPTIONAL: TWILIO (SMS) =====

/**
 * Send SMS notification (requires Twilio account)
 * 
 * Usage:
 * import twilio from 'twilio';
 * 
 * const client = twilio(
 *   process.env.TWILIO_ACCOUNT_SID,
 *   process.env.TWILIO_AUTH_TOKEN
 * );
 * 
 * await client.messages.create({
 *   body: 'تم شحن طلبك!',
 *   to: '+201234567890',
 *   from: process.env.TWILIO_PHONE_NUMBER
 * });
 */

// ===== OPTIONAL: WHATSAPP BUSINESS API =====

/**
 * Send WhatsApp message (requires WhatsApp Business API)
 * 
 * Documentation: https://developers.facebook.com/docs/whatsapp/
 * 
 * Example:
 * import axios from 'axios';
 * 
 * await axios.post(
 *   `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
 *   {
 *     messaging_product: 'whatsapp',
 *     to: '201234567890',
 *     type: 'template',
 *     template: {
 *       name: 'order_shipped',
 *       language: { code: 'ar' }
 *     }
 *   },
 *   {
 *     headers: {
 *       'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
 *       'Content-Type': 'application/json'
 *     }
 *   }
 * );
 */

// ===== HEALTH CHECK =====

/**
 * Check if all external APIs are configured
 */
export function checkExternalAPIsHealth() {
  return {
    openai: !!process.env.OPENAI_API_KEY,
    googleMaps: !!process.env.GOOGLE_MAPS_API_KEY,
    exchangeRate: true, // No key needed
    twilio: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
    whatsapp: !!(process.env.WHATSAPP_PHONE_ID && process.env.WHATSAPP_ACCESS_TOKEN)
  };
}

// ===== EXPORT =====

export default {
  aiChat,
  getProductRecommendations,
  geocodeAddress,
  calculateETA,
  getRoute,
  getExchangeRates,
  convertCurrency,
  getMultipleCurrencyRates,
  checkExternalAPIsHealth
};
