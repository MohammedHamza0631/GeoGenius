"use client";

import { useState, useEffect } from "react";
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
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameExists, setUsernameExists] = useState(false);
  
  // Check username availability with debounce
  useEffect(() => {
    if (!username || !dbConnected) return;
    
    const checkUsername = async () => {
      setIsCheckingUsername(true);
      try {
        const response = await fetch(`/api/check-username?username=${encodeURIComponent(username)}`);
        const data = await response.json();
        
        // Only update if the database is connected
        if (data.dbConnected) {
          setUsernameExists(data.exists);
        }
      } catch (error) {
        console.error('Error checking username:', error);
      } finally {
        setIsCheckingUsername(false);
      }
    };
    
    const timeoutId = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeoutId);
  }, [username, dbConnected]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (usernameExists && saveToLeaderboard && dbConnected) {
      newErrors.username = "Username already exists. Please choose a different username.";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Start the quiz
    startQuiz();
    router.push("/quiz");
  };
  
  // Determine if the form should be disabled
  const isFormDisabled = isCheckingUsername || (usernameExists && saveToLeaderboard && dbConnected);

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
            ❌ Not connected to database (scores won&apos;t be saved)
          </div>
        )}
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
            {isCheckingUsername && (
              <p className="text-sm text-muted-foreground">Checking username availability...</p>
            )}
            {usernameExists && !isCheckingUsername && (
              <p className="text-sm text-red-500">
                Username already exists. Please choose a different username.
              </p>
            )}
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
              <li>After 10 questions, you&apos;ll progress to a mix of easy and medium questions (15 seconds per question)</li>
              <li>After 20 questions, you&apos;ll face a mix of medium and hard questions (8 seconds per question)</li>
              <li>After 30 questions, you&apos;ll tackle only hard questions (8 seconds per question)</li>
              <li>The quiz ends when you answer incorrectly or run out of time</li>
              <li>Answer quickly for bonus points!</li>
            </ul>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="leaderboard" 
              checked={saveToLeaderboard}
              onCheckedChange={setSaveToLeaderboard}
              disabled={!dbConnected}
            />
            <Label htmlFor="leaderboard" className="text-sm font-normal">
              Save my score to the leaderboard
            </Label>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isFormDisabled}
          >
            Start Quiz
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 