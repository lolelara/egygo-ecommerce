import { useState, useEffect } from 'react';
import { databases, appwriteConfig } from '@/lib/appwrite';
import { Query } from 'appwrite';

export function usePendingAccountsCount() {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.collections.users,
          [
            Query.equal('accountStatus', 'pending'),
            Query.limit(1) // نحتاج فقط للعدد الإجمالي
          ]
        );
        setCount(response.total);
      } catch (error) {
        console.error('Error fetching pending accounts count:', error);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();

    // تحديث كل دقيقة
    const interval = setInterval(fetchCount, 60000);

    return () => clearInterval(interval);
  }, []);

  return { count, loading };
}
