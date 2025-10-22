import { useState, useEffect } from 'react';
import { adsManager } from '@/lib/ads-manager';

export function usePendingAdsCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const pendingAds = await adsManager.getPendingAds();
        setCount(pendingAds.length);
      } catch (error) {
        console.error('Error fetching pending ads count:', error);
        setCount(0);
      }
    };

    fetchCount();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return count;
}
