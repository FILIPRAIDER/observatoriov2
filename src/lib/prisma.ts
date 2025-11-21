import { PrismaClient } from "@prisma/client";

// Prevenir múltiples instancias de Prisma Client en desarrollo
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Crear una única instancia de Prisma Client
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });

// En desarrollo, almacenar la instancia globalmente para reutilizarla
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
