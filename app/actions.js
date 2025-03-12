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
    
    // Check if the user already has an entry with a better or equal score
    const existingBestScore = await prisma.leaderboardEntry.findFirst({
      where: { 
        username,
        isBestScore: true 
      },
    });
    
    // If this is a new best score or first attempt
    if (!existingBestScore || existingBestScore.score < score) {
      // If there's an existing best score, unmark it
      if (existingBestScore) {
        await prisma.leaderboardEntry.update({
          where: { id: existingBestScore.id },
          data: { isBestScore: false },
        });
      }
      
      // Create a new entry marked as the best score
      const newEntry = await prisma.leaderboardEntry.create({
        data: { 
          username, 
          score, 
          difficulty,
          isBestScore: true 
        },
      });
      
      return { success: true, entry: newEntry, isNewBest: true };
    } else {
      // Not a new best score, just create a regular entry
      const newEntry = await prisma.leaderboardEntry.create({
        data: { 
          username, 
          score, 
          difficulty,
          isBestScore: false 
        },
      });
      
      return { success: true, entry: newEntry, isNewBest: false };
    }
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