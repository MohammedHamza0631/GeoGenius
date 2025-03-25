import { prisma, testConnection } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyPin } from "@/lib/pin-utils";

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

    // Check if the username exists and has a PIN
    const user = await prisma.leaderboardEntry.findFirst({
      where: {
        username: trimmedUsername,
        NOT: {
          pinHash: null
        }
      },
      select: {
        pinHash: true
      }
    });

    return NextResponse.json({
      success: true,
      hasPin: !!user,
      dbConnected: true
    });
  } catch (error) {
    console.error("Error checking PIN:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      dbConnected: false
    });
  }
}

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

    // Get the user's PIN hash
    const user = await prisma.leaderboardEntry.findFirst({
      where: {
        username: trimmedUsername,
        NOT: {
          pinHash: null
        }
      },
      select: {
        pinHash: true
      }
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        error: "Username not found or has no PIN",
        dbConnected: true
      });
    }

    // Verify the PIN
    const isValid = verifyPin(pin, trimmedUsername, user.pinHash);

    return NextResponse.json({
      success: true,
      isValid,
      dbConnected: true
    });
  } catch (error) {
    console.error("Error verifying PIN:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      dbConnected: false
    });
  }
} 