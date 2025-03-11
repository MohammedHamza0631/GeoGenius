"use client";

import Link from "next/link";
import { ModeToggle } from "./mode-toggle";

export function Header() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">GeoGenius</span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link 
            href="/leaderboard" 
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Leaderboard
          </Link>
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
} 