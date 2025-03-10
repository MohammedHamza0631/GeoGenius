"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/lib/quiz-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function QuizSetupForm() {
  const router = useRouter();
  const { 
    username, 
    setUsername, 
    saveToLeaderboard, 
    setSaveToLeaderboard,
    startQuiz,
    dbConnected
  } = useQuiz();
  
  const [errors, setErrors] = useState({});
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    if (!username.trim()) {
      newErrors.username = "Username is required";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Start the quiz
    startQuiz();
    router.push("/quiz");
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Quiz Setup</CardTitle>
        <CardDescription>
          Enter your details to start the Capital Cities Quiz
        </CardDescription>
        {dbConnected ? (
          <div className="mt-2 text-sm text-green-500">
            ✅ Connected to database
          </div>
        ) : (
          <div className="mt-2 text-sm text-red-500">
            ❌ Not connected to database (scores won't be saved)
          </div>
        )}
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter a cool username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground mb-2">
              How to play:
            </div>
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              <li>The quiz starts with easy questions (20 seconds per question)</li>
              <li>After 10 correct answers, you'll move to medium difficulty (15 seconds per question)</li>
              <li>After 20 correct answers, you'll move to hard difficulty (8 seconds per question)</li>
              <li>The quiz ends when you answer incorrectly or run out of time</li>
              <li>Answer quickly for bonus points!</li>
            </ul>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="leaderboard" 
              checked={saveToLeaderboard}
              onCheckedChange={setSaveToLeaderboard}
            />
            <Label htmlFor="leaderboard" className="text-sm font-normal">
              Save my score to the leaderboard
            </Label>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="w-full">
            Start Quiz
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 