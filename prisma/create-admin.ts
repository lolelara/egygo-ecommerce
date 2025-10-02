import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // إنشاء مستخدم admin
    const admin = await prisma.user.upsert({
      where: { email: "admin@example.com" },
      update: {},
      create: {
        email: "admin@example.com",
        name: "مدير النظام",
        role: "ADMIN",
        isActive: true,
      },
    });

    console.log("👑 تم إنشاء مستخدم الإدارة:", admin);

    // إنشاء مدير عام
    const superAdmin = await prisma.user.upsert({
      where: { email: "superadmin@example.com" },
      update: {},
      create: {
        email: "superadmin@example.com",
        name: "المدير العام",
        role: "SUPER_ADMIN",
        isActive: true,
      },
    });

    console.log("👑 تم إنشاء المدير العام:", superAdmin);
  } catch (error) {
    console.error("❌ خطأ في إنشاء مديري النظام:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
