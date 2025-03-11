import { prisma, testConnection } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username parameter is required" },
        { status: 400 }
      );
    }

    // First check if database is connected
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json({
        exists: false,
        available: true,
        dbConnected: false
      });
    }

    // Check if the username exists in the database
    const existingUser = await prisma.leaderboardEntry.findFirst({
      where: {
        username: username,
      },
    });

    return NextResponse.json({
      exists: !!existingUser,
      available: !existingUser,
      dbConnected: true
    });
  } catch (error) {
    console.error("Error checking username:", error);
    return NextResponse.json({
      exists: false,
      available: true,
      dbConnected: false,
      error: error.message
    });
  }
} 