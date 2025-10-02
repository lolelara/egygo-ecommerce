import { RequestHandler } from "express";
import { prisma } from "@shared/db";
import { CategoryListResponse } from "@shared/prisma-types";

export const getCategories: RequestHandler = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    const response: CategoryListResponse = {
      categories,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "فشل في جلب الفئات" });
  }
};

export const getCategoryBySlug: RequestHandler = async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await prisma.category.findUnique({
      where: { slug },
    });

    if (!category) {
      return res.status(404).json({ error: "الفئة غير موجودة" });
    }

    res.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "فشل في جلب الفئة" });
  }
};

export const updateCategoryProductCount: RequestHandler = async (req, res) => {
  try {
    // Update product counts for all categories
    const categories = await prisma.category.findMany();

    for (const category of categories) {
      const productCount = await prisma.product.count({
        where: { categoryId: category.id },
      });

      await prisma.category.update({
        where: { id: category.id },
        data: { productCount },
      });
    }

    res.json({ message: "تم تحديث عدد المنتجات في الفئات بنجاح" });
  } catch (error) {
    console.error("Error updating category product counts:", error);
    res.status(500).json({ error: "فشل في تحديث عدد المنتجات" });
  }
};
