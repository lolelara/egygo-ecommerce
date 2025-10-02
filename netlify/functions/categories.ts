import type { Handler } from "@netlify/functions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const handler: Handler = async (event, context) => {
  // Handle CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    const response = {
      categories,
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "فشل في جلب الفئا��" }),
    };
  } finally {
    await prisma.$disconnect();
  }
};
