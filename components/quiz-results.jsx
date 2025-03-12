"use client";

import { useState, useEffect } from "react";
import { useQuiz } from "@/lib/quiz-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PinEntry } from "@/components/pin-entry";
import { storeVerifiedSession } from "@/lib/pin-utils";

export function QuizResults() {
  const { 
    username, 
    score, 
    answers, 
    currentDifficulty, 
    resetQuiz,
    saveToLeaderboard,
    dbConnected
  } = useQuiz();
  
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [pinError, setPinError] = useState(null);
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [pinSetSuccess, setPinSetSuccess] = useState(false);
  const [isNewBestScore, setIsNewBestScore] = useState(false);
  
  // Handle play again
  const handlePlayAgain = () => {
    // First reset the quiz
    resetQuiz();
    // Then redirect to /start
    window.location.href = "/start";
  };
  
  // Check if we need to prompt for PIN creation
  useEffect(() => {
    const checkPinNeeded = async () => {
      if (!username || !saveToLeaderboard || !dbConnected) return;
      
      try {
        // Check if username has a PIN
        const response = await fetch(`/api/check-pin?username=${encodeURIComponent(username)}`);
        const data = await response.json();
        
        if (data.success && !data.hasPin) {
          // Username exists but doesn't have a PIN, prompt to create one
          setShowPinPrompt(true);
        }
      } catch (error) {
        console.error('Error checking PIN status:', error);
      }
    };
    
    checkPinNeeded();
  }, [username, saveToLeaderboard, dbConnected]);
  
  // Check if this is a new best score
  useEffect(() => {
    const checkIfNewBestScore = async () => {
      if (!username || !saveToLeaderboard || !dbConnected) return;
      
      try {
        // Get the user's best score
        const response = await fetch(`/api/user-scores?username=${encodeURIComponent(username)}`);
        const data = await response.json();
        
        if (data.success) {
          // If there's no previous best score, or this score is higher
          if (!data.bestScore || score > data.bestScore.score) {
            setIsNewBestScore(true);
          }
        }
      } catch (error) {
        console.error('Error checking best score:', error);
      }
    };
    
    checkIfNewBestScore();
  }, [username, score, saveToLeaderboard, dbConnected]);
  
  // Handle PIN submission
  const handlePinSubmit = async (pin) => {
    setPinError(null);
    setIsSettingPin(true);
    
    try {
      // Set the PIN
      const response = await fetch('/api/set-pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, pin }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Mark username as verified in this session
        storeVerifiedSession(username);
        setPinSetSuccess(true);
        setShowPinPrompt(false);
      } else {
        setPinError(data.error || "Failed to set PIN. Please try again.");
      }
    } catch (error) {
      console.error('Error setting PIN:', error);
      setPinError("An error occurred. Please try again.");
    } finally {
      setIsSettingPin(false);
    }
  };
  
  // Calculate statistics
  const correctAnswers = answers.filter(a => a.isCorrect).length;
  const accuracy = answers.length > 0 ? Math.round((correctAnswers / answers.length) * 100) : 0;
  
  // Calculate average response time
  const totalResponseTime = answers.reduce((total, answer) => total + answer.responseTime, 0);
  console.log(totalResponseTime);
  const averageResponseTime = answers.length > 0 ? (totalResponseTime / answers.length / 1000).toFixed(2) : 0;
  console.log(averageResponseTime);
  
  // If showing PIN entry, render that instead of the results
  if (showPinPrompt) {
    return (
      <div className="space-y-6">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Great Job!</CardTitle>
            <CardDescription>
              You scored {score} points on {currentDifficulty} difficulty.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4">
              To protect your scores and prevent others from playing as you, please create a PIN.
            </p>
          </CardContent>
        </Card>
        
        <PinEntry
          username={username}
          isNewPin={true}
          onPinSubmit={handlePinSubmit}
          onCancel={() => setShowPinPrompt(false)}
          error={pinError}
        />
      </div>
    );
  }
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Quiz Results</CardTitle>
        <CardDescription>
          Here's how you did, {username}!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-5xl font-bold mb-2">{score}</div>
          <p className="text-muted-foreground">Total Score</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold mb-1">{correctAnswers}</div>
            <p className="text-sm text-muted-foreground">Correct Answers</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold mb-1">{accuracy}%</div>
            <p className="text-sm text-muted-foreground">Accuracy</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold mb-1">{answers.length}</div>
            <p className="text-sm text-muted-foreground">Questions Answered</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold mb-1">{averageResponseTime}s</div>
            <p className="text-sm text-muted-foreground">Avg. Response Time</p>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Badge className="text-sm" variant={
            currentDifficulty === "easy" ? "success" : 
            currentDifficulty === "medium" ? "warning" : "destructive"
          }>
            {currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1)} Difficulty
          </Badge>
        </div>
        
        {pinSetSuccess && (
          <div className="p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-md text-sm text-center">
            PIN successfully set! Your username is now protected.
          </div>
        )}
        
        {isNewBestScore && (
          <div className="p-3 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300 rounded-md text-sm text-center">
            🏆 New personal best! You've beaten your previous record!
          </div>
        )}
        
        {saveToLeaderboard && dbConnected && (
          <p className="text-center text-sm text-muted-foreground">
            Your score has been saved to the leaderboard.
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.location.href = "/leaderboard"}>
          View Leaderboard
        </Button>
        <Button onClick={handlePlayAgain}>
          Play Again
        </Button>
      </CardFooter>
    </Card>
  );
}