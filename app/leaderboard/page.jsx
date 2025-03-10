"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getLeaderboard } from "@/app/actions";

export default function LeaderboardPage() {
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch leaderboard data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getLeaderboard(difficultyFilter);
        if (result.success) {
          setLeaderboardData(result.entries);
        } else {
          setError(result.error || "Failed to fetch leaderboard data");
          setLeaderboardData([]);
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setError("An unexpected error occurred");
        setLeaderboardData([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [difficultyFilter]);
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
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
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>Loading leaderboard data...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">
                <p>{error}</p>
                <p className="text-sm mt-2">Make sure your database is properly configured</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b bg-muted">
                  <div className="col-span-1">#</div>
                  <div className="col-span-4">Username</div>
                  <div className="col-span-2 text-right">Score</div>
                  <div className="col-span-3">Difficulty</div>
                  <div className="col-span-2">Date</div>
                </div>
                
                {leaderboardData.length > 0 ? (
                  leaderboardData.map((entry, index) => (
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
                        {formatDate(entry.date)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    No scores found for this difficulty level.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
} 