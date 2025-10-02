import type { Handler } from "@netlify/functions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const handler: Handler = async (event, context) => {
  // Handle CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { email, password } = JSON.parse(event.body || "{}");

    if (!email || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "البريد الإلكتروني وكلمة المرور مطلوبان",
        }),
      };
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { affiliate: true },
    });

    if (!user) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          error: "البريد الإلكتروني أو كلمة المرور غير صحيح",
        }),
      };
    }

    if (!user.isActive) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: "الحساب معطل" }),
      };
    }

    // For demo purposes, simple password check
    const validPasswords: { [key: string]: string } = {
      "admin@example.com": "admin123",
      "superadmin@example.com": "superadmin123",
      "user@example.com": "user123",
    };

    if (password !== validPasswords[email]) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          error: "البريد الإلكتروني أو كلمة المرور غير صحيح",
        }),
      };
    }

    // Create simple session token
    const token = `${user.id}-${Date.now()}`;

    const response = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      token,
      affiliate: user.affiliate
        ? {
            id: user.affiliate.id,
            email: user.email,
            name: user.name || "",
            affiliateCode: user.affiliate.affiliateCode,
            commissionRate: user.affiliate.commissionRate,
            totalEarnings: user.affiliate.totalEarnings,
            pendingEarnings: user.affiliate.pendingEarnings,
            referralCount: user.affiliate.referralCount,
            joinedAt: user.affiliate.createdAt.toISOString(),
          }
        : null,
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "خطأ في ��سجيل الدخول" }),
    };
  } finally {
    await prisma.$disconnect();
  }
};
