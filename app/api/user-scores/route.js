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

    // Fetch the user's previous scores
    const scores = await prisma.leaderboardEntry.findMany({
      where: {
        username: username,
      },
      orderBy: {
        date: 'desc',
      },
      take: 5, // Limit to the 5 most recent scores
    });

    return NextResponse.json({
      success: true,
      scores,
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