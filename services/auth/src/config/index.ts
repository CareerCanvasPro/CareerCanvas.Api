import { loadConfig } from './ssm';

export const config = await loadConfig();


// PrismaClient is now imported from the services/prisma module
