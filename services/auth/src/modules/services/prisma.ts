import { PrismaClient, Prisma } from '@prisma/client';

const prismaClientOptions: Prisma.PrismaClientOptions = {
  log: ['error', 'warn'],
  errorFormat: 'pretty' as const
};

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient(prismaClientOptions);
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient(prismaClientOptions);
  }
  prisma = (global as any).prisma;
}

// Improved error handling for connection issues
prisma.$on('error' as never, async (e: Error) => {
  console.error('Prisma Client error:', e);
  try {
    await prisma.$disconnect();
    await prisma.$connect();
  } catch (reconnectError) {
    console.error('Failed to reconnect:', reconnectError);
  }
});

prisma.$on('warn' as never, (e: Error) => {
  console.warn('Prisma Client warning:', e);
});

// Ensure connections are properly handled
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;