import { RequestHandler } from "express";
// Server-side wishlist operations disabled for static deployment
// Use client-side Appwrite SDK instead

// Stub functions to prevent build errors
export const getUserWishlist: RequestHandler = async (req, res) => {
  res.status(501).json({ error: "Use client-side Appwrite SDK for wishlist operations" });
};

export const addToWishlist: RequestHandler = async (req, res) => {
  res.status(501).json({ error: "Use client-side Appwrite SDK for wishlist operations" });
};

export const removeFromWishlist: RequestHandler = async (req, res) => {
  res.status(501).json({ error: "Use client-side Appwrite SDK for wishlist operations" });
};

export const isInWishlist: RequestHandler = async (req, res) => {
  res.status(501).json({ error: "Use client-side Appwrite SDK for wishlist operations" });
};
