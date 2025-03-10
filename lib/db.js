import { PrismaClient } from '@prisma/client';
import { neon } from '@neondatabase/serverless';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global;

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Function to test database connection
export async function testConnection() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    await sql`SELECT 1`;
    console.log('✅ Successfully connected to the database');
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to the database:', error);
    return false;
  }
}

export default prisma; 