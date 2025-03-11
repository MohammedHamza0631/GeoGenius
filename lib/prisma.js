import { PrismaClient } from "@prisma/client";
import { neon } from '@neondatabase/serverless';

const globalForPrisma = global;

// Check if prisma exists in the global object - if not, create a new instance
export const prisma = globalForPrisma.prisma || new PrismaClient();

// If we're not in production, set the global prisma to our instance
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

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