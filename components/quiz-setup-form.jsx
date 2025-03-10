"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/lib/quiz-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function QuizSetupForm() {
  const router = useRouter();
  const { 
    username, 
    setUsername, 
    difficulty, 
    setDifficulty, 
    saveToLeaderboard, 
    setSaveToLeaderboard,
    startQuiz 
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
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger id="difficulty">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
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