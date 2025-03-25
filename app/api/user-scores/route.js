import { prisma, testConnection } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { success: false, error: "Username parameter is required" },
        { status: 400 }
      );
    }

    // Trim the username to avoid issues with spaces
    const trimmedUsername = username.trim();

    // First check if database is connected
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json({
        success: false,
        error: "Database not connected",
        dbConnected: false
      });
    }

    // Fetch the user's best score
    const bestScore = await prisma.leaderboardEntry.findFirst({
      where: {
        username: trimmedUsername,
        isBestScore: true
      },
    });

    // Fetch all scores for this user
    const allScores = await prisma.leaderboardEntry.findMany({
      where: {
        username: trimmedUsername,
      },
      orderBy: [
        {
          difficulty: 'asc',
        },
        {
          score: 'desc',
        }
      ],
    });

    // Group scores by difficulty to easily find the best score for each difficulty
    const scoresByDifficulty = {};
    allScores.forEach(score => {
      if (!scoresByDifficulty[score.difficulty] || scoresByDifficulty[score.difficulty].score < score.score) {
        scoresByDifficulty[score.difficulty] = score;
      }
    });

    return NextResponse.json({
      success: true,
      bestScore: bestScore || null,
      scores: allScores,
      bestScoresByDifficulty: scoresByDifficulty,
      dbConnected: true
    });
  } catch (error) {
    console.error("Error fetching user scores:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      dbConnected: false
    });
  }
} 