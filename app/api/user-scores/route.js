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
        username: username,
        isBestScore: true
      },
    });

    // Fetch the user's recent attempts (limited to 3)
    const recentScores = await prisma.leaderboardEntry.findMany({
      where: {
        username: username,
      },
      orderBy: {
        date: 'desc',
      },
      take: 3, // Limit to the 3 most recent scores
    });

    return NextResponse.json({
      success: true,
      bestScore: bestScore || null,
      scores: recentScores,
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