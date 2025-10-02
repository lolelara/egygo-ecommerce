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
    const { email, name, password, wantAffiliate } = JSON.parse(
      event.body || "{}",
    );

    if (!email || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "البريد الإلكتروني وكلمة المرور مطلوبان",
        }),
      };
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "المستخدم موجود بالفعل" }),
      };
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        role: "USER",
        isActive: true,
      },
    });

    // Create affiliate if requested
    let affiliate = null;
    if (wantAffiliate) {
      affiliate = await prisma.affiliateUser.create({
        data: {
          userId: user.id,
          affiliateCode: `REF${user.id.slice(-8).toUpperCase()}`,
          commissionRate: 8,
          totalEarnings: 0,
          pendingEarnings: 0,
          referralCount: 0,
          status: "ACTIVE",
        },
      });
    }

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
      affiliate: affiliate
        ? {
            id: affiliate.id,
            email: user.email,
            name: user.name || "",
            affiliateCode: affiliate.affiliateCode,
            commissionRate: affiliate.commissionRate,
            totalEarnings: affiliate.totalEarnings,
            pendingEarnings: affiliate.pendingEarnings,
            referralCount: affiliate.referralCount,
            joinedAt: affiliate.createdAt.toISOString(),
          }
        : null,
    };

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "خطأ في إنشاء الحساب" }),
    };
  } finally {
    await prisma.$disconnect();
  }
};
