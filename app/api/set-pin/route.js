import { prisma, testConnection } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { hashPin } from "@/lib/pin-utils";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, pin } = body;

    if (!username || !pin) {
      return NextResponse.json(
        { success: false, error: "Username and PIN are required" },
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

    // Hash the PIN
    const pinHash = hashPin(pin, trimmedUsername);

    // Find all entries for this username and update them with the PIN hash
    const updateResult = await prisma.leaderboardEntry.updateMany({
      where: {
        username: trimmedUsername
      },
      data: {
        pinHash: pinHash
      }
    });

    return NextResponse.json({
      success: true,
      updated: updateResult.count,
      dbConnected: true
    });
  } catch (error) {
    console.error("Error setting PIN:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      dbConnected: false
    });
  }
} 