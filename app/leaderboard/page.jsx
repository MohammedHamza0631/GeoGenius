"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock leaderboard data (in a real app, this would come from a database)
const mockLeaderboardData = [
  { id: 1, username: "GeoMaster", score: 285, difficulty: "hard", date: "2023-06-15" },
  { id: 2, username: "CapitalExpert", score: 270, difficulty: "hard", date: "2023-06-18" },
  { id: 3, username: "WorldTraveler", score: 245, difficulty: "hard", date: "2023-06-20" },
  { id: 4, username: "GeographyNerd", score: 230, difficulty: "hard", date: "2023-06-22" },
  { id: 5, username: "MapQuizzer", score: 225, difficulty: "medium", date: "2023-06-14" },
  { id: 6, username: "AtlasReader", score: 210, difficulty: "medium", date: "2023-06-19" },
  { id: 7, username: "GlobeTrotter", score: 195, difficulty: "medium", date: "2023-06-21" },
  { id: 8, username: "EarthExplorer", score: 180, difficulty: "medium", date: "2023-06-23" },
  { id: 9, username: "ContinentHopper", score: 165, difficulty: "easy", date: "2023-06-16" },
  { id: 10, username: "CountryCounter", score: 150, difficulty: "easy", date: "2023-06-17" },
];

export default function LeaderboardPage() {
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  
  // Filter leaderboard data based on selected difficulty
  const filteredData = difficultyFilter === "all"
    ? mockLeaderboardData
    : mockLeaderboardData.filter(entry => entry.difficulty === difficultyFilter);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Leaderboard
          </h1>
          <p className="mt-4 text-muted-foreground">
            See how your score compares to other quiz takers
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Top Scores</CardTitle>
                <CardDescription>
                  The highest scores from Capital Cities Quiz players
                </CardDescription>
              </div>
              
              <div className="w-full sm:w-auto">
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Difficulties</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b bg-muted">
                <div className="col-span-1">#</div>
                <div className="col-span-4">Username</div>
                <div className="col-span-2 text-right">Score</div>
                <div className="col-span-3">Difficulty</div>
                <div className="col-span-2">Date</div>
              </div>
              
              {filteredData.map((entry, index) => (
                <div 
                  key={entry.id} 
                  className="grid grid-cols-12 gap-2 p-4 border-b last:border-0 items-center"
                >
                  <div className="col-span-1 font-medium">{index + 1}</div>
                  <div className="col-span-4 font-medium">{entry.username}</div>
                  <div className="col-span-2 text-right font-bold">{entry.score}</div>
                  <div className="col-span-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      entry.difficulty === "easy" 
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                        : entry.difficulty === "medium"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }`}>
                      {entry.difficulty.charAt(0).toUpperCase() + entry.difficulty.slice(1)}
                    </span>
                  </div>
                  <div className="col-span-2 text-muted-foreground text-sm">
                    {entry.date}
                  </div>
                </div>
              ))}
              
              {filteredData.length === 0 && (
                <div className="p-4 text-center text-muted-foreground">
                  No scores found for this difficulty level.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
} 