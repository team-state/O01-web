import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var, vars-on-top
  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ||
  new PrismaClient(
    process.env.NODE_ENV === 'development' ? { log: ['query'] } : undefined,
  );

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;
