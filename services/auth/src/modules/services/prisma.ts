import { PrismaClient, Prisma } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

let prisma: PrismaClient;

const prismaClientOptions: Prisma.PrismaClientOptions = {
  log: ['error', 'warn'],
  errorFormat: 'pretty' as const
};

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient(prismaClientOptions);
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient(prismaClientOptions);
  }
  prisma = global.prisma;
}

// Handle connection errors
prisma.$on('error', (e: Error) => {
  console.error('Prisma Client error:', e);
});

prisma.$on('warn', (e: Error) => {
  console.warn('Prisma Client warning:', e);
});

export default prisma;