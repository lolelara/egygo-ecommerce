import { useState, useEffect } from 'react';
import { databases, DATABASE_ID } from '@/lib/appwrite-client';
import { Query } from 'appwrite';

export function usePendingProductsCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          'products',
          [
            Query.equal('status', 'pending'),
            Query.limit(1)
          ]
        );
        setCount(response.total);
      } catch (error) {
        console.error('Error fetching pending products count:', error);
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
