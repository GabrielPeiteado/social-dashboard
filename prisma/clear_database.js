const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function clearDatabase() {
  console.log("🚨 Clearing database...");

  try {
    // Eliminar todos los registros de socialData primero (porque depende de user)
    await prisma.socialData.deleteMany();
    console.log("✅ Deleted all social data");

    // Luego eliminar todos los usuarios
    await prisma.user.deleteMany();
    console.log("✅ Deleted all users");

    console.log("🗑️ Database cleared successfully!");
  } catch (error) {
    console.error("❌ Error clearing the database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la función
clearDatabase();
