import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AppwriteAuthContext';
import { databases, appwriteConfig } from '@/lib/appwrite';
import { Query, ID } from 'appwrite';

interface FavoritesContextType {
  favorites: string[];
  addFavorite: (productId: string) => Promise<void>;
  removeFavorite: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load favorites from localStorage or Appwrite
  useEffect(() => {
    loadFavorites();
  }, [user]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      
      if (user) {
        // Load from Appwrite
        try {
          const response = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.collections.favorites,
            [
              Query.equal('userId', user.$id),
              Query.limit(100)
            ]
          );
          
          const favoriteIds = response.documents.map((doc: any) => doc.productId);
          setFavorites(favoriteIds);
        } catch (error) {
          console.error('Error loading favorites from Appwrite:', error);
          // Fallback to localStorage
          const stored = localStorage.getItem('favorites');
          if (stored) {
            setFavorites(JSON.parse(stored));
          }
        }
      } else {
        // Load from localStorage for guests
        const stored = localStorage.getItem('favorites');
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (productId: string) => {
    console.log('🔵 addFavorite called for:', productId, 'User:', user?.$id);
    try {
      if (user) {
        // Save to Appwrite
        try {
          await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.collections.favorites,
            ID.unique(),
            {
              userId: user.$id,
              productId,
              createdAt: new Date().toISOString()
            }
          );
        } catch (error) {
          console.error('Error saving to Appwrite:', error);
        }
      }
      
      // Update local state
      const newFavorites = [...favorites, productId];
      setFavorites(newFavorites);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      console.log('✅ Favorite added successfully. New favorites:', newFavorites);
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  };

  const removeFavorite = async (productId: string) => {
    console.log('🔴 removeFavorite called for:', productId);
    try {
      if (user) {
        // Remove from Appwrite
        try {
          const response = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.collections.favorites,
            [
              Query.equal('userId', user.$id),
              Query.equal('productId', productId)
            ]
          );
          
          if (response.documents.length > 0) {
            await databases.deleteDocument(
              appwriteConfig.databaseId,
              appwriteConfig.collections.favorites,
              response.documents[0].$id
            );
          }
        } catch (error) {
          console.error('Error removing from Appwrite:', error);
        }
      }
      
      // Update local state
      const newFavorites = favorites.filter(id => id !== productId);
      setFavorites(newFavorites);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      console.log('✅ Favorite removed successfully. New favorites:', newFavorites);
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.includes(productId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        loading
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
