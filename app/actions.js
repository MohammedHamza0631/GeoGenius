"use server";

import { prisma, testConnection } from "@/lib/db";

// Test database connection
export async function checkDbConnection() {
  return await testConnection();
}

// Save score to leaderboard
export async function saveScore(data) {
  try {
    const { username, score, difficulty } = data;
    
    const entry = await prisma.leaderboardEntry.create({
      data: {
        username,
        score,
        difficulty,
      },
    });
    
    return { success: true, entry };
  } catch (error) {
    console.error("Error saving score:", error);
    return { success: false, error: error.message };
  }
}

// Get leaderboard entries
export async function getLeaderboard(difficulty = null) {
  try {
    const where = difficulty && difficulty !== 'all' ? { difficulty } : {};
    
    const entries = await prisma.leaderboardEntry.findMany({
      where,
      orderBy: {
        score: 'desc',
      },
      take: 100, // Limit to top 100 scores
    });
    
    return { success: true, entries };
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return { success: false, error: error.message, entries: [] };
  }
} 