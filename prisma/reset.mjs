import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
await prisma.$executeRawUnsafe('DROP SCHEMA public CASCADE');
await prisma.$executeRawUnsafe('CREATE SCHEMA public');
await prisma.$disconnect();
console.log('Database schema reset complete');
