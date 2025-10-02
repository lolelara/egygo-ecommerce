import { RequestHandler } from "express";
import { prisma } from "@shared/db";
import { User } from "@shared/api";

// Simple auth system - in production use proper JWT, bcrypt, etc.
export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "البريد الإلكتروني وكلمة المرور مطلوبان" });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { affiliate: true },
    });

    if (!user) {
      return res
        .status(401)
        .json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيح" });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: "الحساب معطل" });
    }

    // For demo purposes, we'll accept simple passwords
    // In production, use bcrypt to hash and compare passwords
    const validPasswords: { [key: string]: string } = {
      "admin@example.com": "admin123",
      "superadmin@example.com": "superadmin123",
      "user@example.com": "user123",
    };

    if (password !== validPasswords[email]) {
      return res
        .status(401)
        .json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيح" });
    }

    // Create simple session token (in production use JWT)
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
      } as User,
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

    res.json(response);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "خطأ في تسجيل الدخول" });
  }
};

export const register: RequestHandler = async (req, res) => {
  try {
    const { email, name, password, wantAffiliate } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "البريد الإلكتروني وكلمة المرور مطلوبان" });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "المستخدم موجود بالفعل" });
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
      } as User,
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

    res.status(201).json(response);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "خطأ في إنشاء الحساب" });
  }
};

export const forgotPassword: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "البريد الإلكتروني مطلوب" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if email exists or not
      return res.json({
        message:
          "إذا كان البريد الإلكتروني موجود، ستصلك رسالة إعادة تعيين كلمة المرور",
      });
    }

    // In production, send actual email with reset token
    // For demo, just return success
    res.json({ message: "تم إرسال رسالة إعادة تعيين كلمة المرور" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "خطأ في إرسال رسالة إعادة التعيين" });
  }
};

export const getCurrentUser: RequestHandler = async (req, res) => {
  try {
    // In production, verify JWT token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "غير مصرح" });
    }

    const token = authHeader.replace("Bearer ", "");
    const userId = token.split("-")[0];

    if (!userId) {
      return res.status(401).json({ error: "رمز غير صالح" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { affiliate: true },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: "مستخدم غير صالح" });
    }

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
      } as User,
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

    res.json(response);
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ error: "خطأ في جلب بيانات المستخدم" });
  }
};
