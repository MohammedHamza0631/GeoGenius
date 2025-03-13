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
    
    // Find the existing entry for this user with the same difficulty
    const existingEntry = await prisma.leaderboardEntry.findFirst({
      where: { 
        username,
        difficulty
      },
    });
    
    // Find the current best score for this user (across all difficulties)
    const existingBestScore = await prisma.leaderboardEntry.findFirst({
      where: { 
        username,
        isBestScore: true 
      },
    });
    
    // Check if this is a new best score overall
    const isNewBestScore = !existingBestScore || score > existingBestScore.score;
    
    // If this is a new best score, update the previous best to not be the best anymore
    if (isNewBestScore && existingBestScore) {
      await prisma.leaderboardEntry.update({
        where: { id: existingBestScore.id },
        data: { isBestScore: false },
      });
    }
    
    let entry;
    
    // If an entry already exists for this user and difficulty, update it
    if (existingEntry) {
      entry = await prisma.leaderboardEntry.update({
        where: { id: existingEntry.id },
        data: { 
          score: Math.max(existingEntry.score, score), // Keep the higher score
          date: new Date(), // Update the date to the latest attempt
          isBestScore: isNewBestScore // Mark as best score if it's the new best
        },
      });
    } else {
      // Create a new entry if one doesn't exist for this user and difficulty
      entry = await prisma.leaderboardEntry.create({
        data: { 
          username, 
          score, 
          difficulty,
          isBestScore: isNewBestScore
        },
      });
    }
    
    return { 
      success: true, 
      entry, 
      isNewBest: isNewBestScore 
    };
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
    
    // Get only the best scores for each user
    const bestScores = await prisma.leaderboardEntry.findMany({
      where: {
        ...(difficulty !== "all" ? { difficulty } : {}),
        isBestScore: true
      },
      orderBy: {
        score: 'desc',
      },
    });
    
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