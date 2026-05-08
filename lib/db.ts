import { PrismaClient } from "@prisma/client";

// In development, do not reuse a cached Prisma instance on globalThis: after
// `prisma generate` (e.g. new models), an old singleton would miss new delegates
// like `eventGalleryImage` until the dev server restarts.
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma =
  process.env.NODE_ENV === "production"
    ? (globalThis.prismaGlobal ??= prismaClientSingleton())
    : prismaClientSingleton();
