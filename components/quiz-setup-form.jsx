"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/lib/quiz-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PinEntry } from "@/components/pin-entry";
import { 
  isVerifiedInSession, 
  storeVerifiedSession, 
  getPreviousUsernames 
} from "@/lib/pin-utils";

export function QuizSetupForm() {
  const router = useRouter();
  const { 
    username, 
    setUsername, 
    saveToLeaderboard, 
    setSaveToLeaderboard,
    startQuiz,
    dbConnected,
    resetQuiz
  } = useQuiz();
  
  const [errors, setErrors] = useState({});
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameExists, setUsernameExists] = useState(false);
  const [previousUsernames, setPreviousUsernames] = useState([]);
  const [previousScores, setPreviousScores] = useState([]);
  const [bestScore, setBestScore] = useState(null);
  const [recentScores, setRecentScores] = useState([]);
  const [isLoadingScores, setIsLoadingScores] = useState(false);
  
  // PIN verification states
  const [showPinEntry, setShowPinEntry] = useState(false);
  const [isNewPin, setIsNewPin] = useState(false);
  const [pinError, setPinError] = useState(null);
  const [usernameHasPin, setUsernameHasPin] = useState(false);
  const [isCheckingPin, setIsCheckingPin] = useState(false);
  
  // Load previous usernames from localStorage on mount
  useEffect(() => {
    try {
      const storedUsernames = getPreviousUsernames();
      if (storedUsernames.length > 0) {
        setPreviousUsernames(storedUsernames);
      }
    } catch (error) {
      console.error('Error loading previous usernames:', error);
    }
  }, []);
  
  // Check username availability with debounce
  useEffect(() => {
    if (!username || !dbConnected) return;
    
    const checkUsername = async () => {
      setIsCheckingUsername(true);
      try {
        // Check if username exists
        const response = await fetch(`/api/check-username?username=${encodeURIComponent(username)}`);
        const data = await response.json();
        
        // Only update if the database is connected
        if (data.dbConnected) {
          setUsernameExists(data.exists);
          
          // If username exists, check if it has a PIN
          if (data.exists) {
            const pinResponse = await fetch(`/api/check-pin?username=${encodeURIComponent(username)}`);
            const pinData = await pinResponse.json();
            
            if (pinData.success) {
              setUsernameHasPin(pinData.hasPin);
            }
          } else {
            setUsernameHasPin(false);
          }
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
  
  // Fetch previous scores when a username is selected
  const fetchPreviousScores = async (username) => {
    if (!dbConnected || !username) return;
    
    setIsLoadingScores(true);
    try {
      const response = await fetch(`/api/user-scores?username=${encodeURIComponent(username)}`);
      const data = await response.json();
      
      if (data.success) {
        // The API now returns both bestScore and scores (recent attempts)
        setBestScore(data.bestScore);
        setRecentScores(data.scores);
        setPreviousScores(data.scores); // Keep this for backward compatibility
      } else {
        setBestScore(null);
        setRecentScores([]);
        setPreviousScores([]);
      }
    } catch (error) {
      console.error('Error fetching previous scores:', error);
      setBestScore(null);
      setRecentScores([]);
      setPreviousScores([]);
    } finally {
      setIsLoadingScores(false);
    }
  };
  
  // Handle username selection from dropdown
  const handleUsernameSelect = async (selectedUsername) => {
    setUsername(selectedUsername);
    setIsCheckingUsername(true);
    
    try {
      // Fetch previous scores
      fetchPreviousScores(selectedUsername);
      
      // Check if the selected username has a PIN
      if (dbConnected) {
        const pinResponse = await fetch(`/api/check-pin?username=${encodeURIComponent(selectedUsername)}`);
        const pinData = await pinResponse.json();
        
        if (pinData.success) {
          setUsernameHasPin(pinData.hasPin);
          setUsernameExists(true);
          
          // If the username has a PIN and is not verified in this session, show the PIN entry
          if (pinData.hasPin && !isVerifiedInSession(selectedUsername)) {
            setIsNewPin(false);
            setShowPinEntry(true);
          }
        }
      }
    } catch (error) {
      console.error('Error checking username details:', error);
    } finally {
      setIsCheckingUsername(false);
    }
  };
  
  // Handle PIN submission
  const handlePinSubmit = async (pin) => {
    setPinError(null);
    setIsCheckingPin(true);
    
    try {
      if (isNewPin) {
        // Set a new PIN
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
          setShowPinEntry(false);
          
          // Start the quiz
          startQuiz();
          router.push("/quiz");
        } else {
          setPinError(data.error || "Failed to set PIN. Please try again.");
        }
      } else {
        // Verify existing PIN
        const response = await fetch('/api/check-pin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, pin }),
        });
        
        const data = await response.json();
        
        if (data.success && data.isValid) {
          // Mark username as verified in this session
          storeVerifiedSession(username);
          setShowPinEntry(false);
          
          // Start the quiz
          startQuiz();
          router.push("/quiz");
        } else {
          setPinError("Incorrect PIN. Please try again.");
        }
      }
    } catch (error) {
      console.error('Error with PIN:', error);
      setPinError("An error occurred. Please try again.");
    } finally {
      setIsCheckingPin(false);
    }
  };
  
  // Handle form submission
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
    
    // Always reset the quiz before starting a new game
    // This ensures a clean state for the new quiz
    resetQuiz();
    
    // Check if PIN verification is needed
    if (usernameExists && usernameHasPin) {
      // Check if already verified in this session
      if (isVerifiedInSession(username)) {
        // Already verified, start the quiz
        startQuiz();
        router.push("/quiz");
      } else {
        // Show PIN entry
        setIsNewPin(false);
        setShowPinEntry(true);
      }
    } else if (usernameExists) {
      // Username exists but doesn't have a PIN yet
      // Start the quiz directly
      startQuiz();
      router.push("/quiz");
    } else {
      // New username, no PIN needed yet
      startQuiz();
      router.push("/quiz");
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Determine if the form should be disabled
  const isFormDisabled = isCheckingUsername || isCheckingPin;

  // If showing PIN entry, render that instead of the form
  if (showPinEntry) {
    return (
      <PinEntry
        username={username}
        isNewPin={isNewPin}
        onPinSubmit={handlePinSubmit}
        onCancel={() => setShowPinEntry(false)}
        error={pinError}
      />
    );
  }

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
            
            {previousUsernames.length > 0 && (
              <div className="mb-2">
                <Label className="text-sm text-muted-foreground mb-1">Previous usernames:</Label>
                <Select onValueChange={handleUsernameSelect}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a previous username" />
                  </SelectTrigger>
                  <SelectContent>
                    {previousUsernames.map((prevUsername) => (
                      <SelectItem key={prevUsername} value={prevUsername}>
                        {prevUsername}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Note: If you select a username with a PIN, you&apos;ll need to enter it to continue.
                </p>
              </div>
            )}
            
            <Input
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setPreviousScores([]);
              }}
            />
            {isCheckingUsername && (
              <p className="text-sm text-muted-foreground">Checking username availability...</p>
            )}
            {usernameExists && !isCheckingUsername && usernameHasPin && (
              <p className="text-sm text-amber-500">
                {isVerifiedInSession(username) 
                  ? "This username is already verified in this session."
                  : "This username is in use. Enter the PIN to use it or create a new one."}
              </p>
            )}
            {usernameExists && !isCheckingUsername && !usernameHasPin && (
              <p className="text-sm text-amber-500">
                This username has been used before. You can still use it to improve your score!
              </p>
            )}
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username}</p>
            )}
          </div>
          
          {previousScores.length > 0 && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Your Previous Scores</h3>
              
              {bestScore && (
                <div className="mb-3 p-2 bg-primary/10 rounded border border-primary/20">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Best Score:</span>
                    <span className="text-xl font-bold">{bestScore.score}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{bestScore.difficulty} difficulty</span>
                    <span>{formatDate(bestScore.date)}</span>
                  </div>
                </div>
              )}
              
              {recentScores.length > 0 && (
                <>
                  <h4 className="text-sm font-medium mb-1 mt-2">Your Scores by Difficulty:</h4>
                  <div className="space-y-2">
                    {recentScores.map((score, index) => (
                      <div key={index} className="p-2 bg-background rounded border border-border flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            score.difficulty === "easy" ? "success" : 
                            score.difficulty === "medium" ? "warning" : "destructive"
                          }>
                            {score.difficulty}
                          </Badge>
                          <span className="text-sm">{formatDate(score.date)}</span>
                        </div>
                        <span className="font-semibold">{score.score} points</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
          
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