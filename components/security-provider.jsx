"use client";

import { useEffect } from "react";
import { cleanupLocalStorage, initSessionStorage } from "@/lib/cleanup-utils";

/**
 * SecurityProvider component
 * 
 * This component handles security-related tasks:
 * 1. Cleans up any sensitive data from localStorage
 * 2. Initializes sessionStorage for verified usernames
 * 
 * It runs these tasks when the application starts and doesn't render anything.
 */
export function SecurityProvider({ children }) {
  useEffect(() => {
    // Run in a try-catch to prevent any errors from breaking the app
    try {
      // Only run in browser environment
      if (typeof window !== "undefined") {
        // Clean up any sensitive data from localStorage
        cleanupLocalStorage();
        
        // Initialize sessionStorage
        initSessionStorage();
      }
    } catch (error) {
      // Log error but don't break the app
      console.error("Error in SecurityProvider:", error);
    }
  }, []);
  
  // This component doesn't render anything itself
  return children;
} 