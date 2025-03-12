"use server";

import { prisma, testConnection } from "@/lib/prisma";

// Test database connection
export async function checkDbConnection() {
  return await testConnection();
}

// Save score to leaderboard
export async function saveScore(data) {
  try {
    const { username, score, difficulty } = data;
    
    // Always create a new entry for each attempt
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
export async function getLeaderboard(difficulty = "all") {
  try {
    // First check if database is connected
    const isConnected = await testConnection();
    if (!isConnected) {
      return { 
        success: false, 
        error: "Database not connected",
        entries: []
      };
    }
    
    // Get all entries first
    const allEntries = await prisma.leaderboardEntry.findMany({
      where: difficulty !== "all" ? { difficulty } : {},
      orderBy: {
        score: 'desc',
      },
    });
    
    // Process to get only the best score for each username
    const usernameMap = new Map();
    
    allEntries.forEach(entry => {
      if (!usernameMap.has(entry.username) || usernameMap.get(entry.username).score < entry.score) {
        usernameMap.set(entry.username, entry);
      }
    });
    
    // Convert map back to array and sort by score
    const bestScores = Array.from(usernameMap.values()).sort((a, b) => b.score - a.score);
    
    return { 
      success: true, 
      entries: bestScores
    };
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return { 
      success: false, 
      error: error.message,
      entries: []
    };
  }
} 