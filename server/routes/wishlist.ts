import { RequestHandler } from "express";
import { databases } from "../appwrite-server";
import { Query } from "node-appwrite";

const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || "68de037e003bd03c4d45";
const WISHLIST_COLLECTION_ID = "wishlist";
const PRODUCTS_COLLECTION_ID = "products";

// Get user wishlist
export const getUserWishlist: RequestHandler = async (req, res) => {
  try {
    const userId = req.query.userId as string;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const response = await databases.listDocuments(
      DATABASE_ID,
      WISHLIST_COLLECTION_ID,
      [Query.equal("userId", userId), Query.orderDesc("$createdAt")]
    );

    const wishlistItems = await Promise.all(
      response.documents.map(async (item) => {
        try {
          const product = await databases.getDocument(
            DATABASE_ID,
            PRODUCTS_COLLECTION_ID,
            item.productId
          );

          return {
            id: item.$id,
            productId: item.productId,
            addedAt: item.$createdAt,
            product: {
              id: product.$id,
              name: product.name,
              description: product.description,
              price: product.price,
              originalPrice: product.originalPrice,
              inStock: product.inStock,
              stockQuantity: product.stockQuantity,
              rating: product.rating || 0,
              reviewCount: product.reviewCount || 0,
              images: product.images || [],
              category: product.category,
            },
          };
        } catch (error) {
          console.error(`Product ${item.productId} not found:`, error);
          return null;
        }
      })
    );

    // Filter out null items (products that couldn't be found)
    const validItems = wishlistItems.filter((item) => item !== null);

    res.json(validItems);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
};

// Add to wishlist
export const addToWishlist: RequestHandler = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res
        .status(400)
        .json({ error: "User ID and Product ID are required" });
    }

    // Check if product exists
    try {
      await databases.getDocument(DATABASE_ID, PRODUCTS_COLLECTION_ID, productId);
    } catch (error) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if already in wishlist
    const existingItems = await databases.listDocuments(
      DATABASE_ID,
      WISHLIST_COLLECTION_ID,
      [Query.equal("userId", userId), Query.equal("productId", productId)]
    );

    if (existingItems.documents.length > 0) {
      return res.status(400).json({ error: "Product already in wishlist" });
    }

    // Add to wishlist
    const wishlistItem = await databases.createDocument(
      DATABASE_ID,
      WISHLIST_COLLECTION_ID,
      "unique()",
      {
        userId,
        productId,
      }
    );

    res.status(201).json({
      id: wishlistItem.$id,
      productId: wishlistItem.productId,
      addedAt: wishlistItem.$createdAt,
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ error: "Failed to add to wishlist" });
  }
};

// Remove from wishlist
export const removeFromWishlist: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId as string;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Check if item exists and belongs to user
    try {
      const item = await databases.getDocument(
        DATABASE_ID,
        WISHLIST_COLLECTION_ID,
        id
      );

      if (item.userId !== userId) {
        return res
          .status(403)
          .json({ error: "You can only remove your own wishlist items" });
      }

      // Remove from wishlist
      await databases.deleteDocument(DATABASE_ID, WISHLIST_COLLECTION_ID, id);

      res.json({ message: "Removed from wishlist successfully" });
    } catch (error) {
      return res.status(404).json({ error: "Wishlist item not found" });
    }
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ error: "Failed to remove from wishlist" });
  }
};

// Check if product is in wishlist
export const isInWishlist: RequestHandler = async (req, res) => {
  try {
    const { userId, productId } = req.query;

    if (!userId || !productId) {
      return res
        .status(400)
        .json({ error: "User ID and Product ID are required" });
    }

    const response = await databases.listDocuments(
      DATABASE_ID,
      WISHLIST_COLLECTION_ID,
      [
        Query.equal("userId", userId as string),
        Query.equal("productId", productId as string),
      ]
    );

    const inWishlist = response.documents.length > 0;
    const wishlistItemId = inWishlist ? response.documents[0].$id : null;

    res.json({ inWishlist, wishlistItemId });
  } catch (error) {
    console.error("Error checking wishlist:", error);
    res.status(500).json({ error: "Failed to check wishlist" });
  }
};
