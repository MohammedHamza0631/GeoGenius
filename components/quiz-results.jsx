"use client";

import { useRouter } from "next/navigation";
import { useQuiz } from "@/lib/quiz-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function QuizResults() {
  const router = useRouter();
  const { 
    score, 
    answers, 
    resetQuiz, 
    username, 
    difficulty,
    saveToLeaderboard
  } = useQuiz();
  
  // Calculate statistics
  const totalQuestions = answers.length;
  const correctAnswers = answers.filter(answer => answer.isCorrect).length;
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  
  // Calculate average response time
  const totalResponseTime = answers.reduce((total, answer) => total + answer.timeRemaining, 0);
  const averageResponseTime = totalQuestions > 0 ? (totalResponseTime / totalQuestions).toFixed(1) : 0;
  
  const handlePlayAgain = () => {
    resetQuiz();
    router.push("/");
  };
  
  const handleViewLeaderboard = () => {
    router.push("/leaderboard");
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Quiz Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <h3 className="text-4xl font-bold mb-2">{score}</h3>
          <p className="text-muted-foreground">Total Score</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="text-2xl font-bold mb-1">{correctAnswers}/{totalQuestions}</h4>
            <p className="text-sm text-muted-foreground">Correct Answers</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="text-2xl font-bold mb-1">{accuracy}%</h4>
            <p className="text-sm text-muted-foreground">Accuracy</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="text-2xl font-bold mb-1">{averageResponseTime}s</h4>
            <p className="text-sm text-muted-foreground">Avg. Response Time</p>
          </div>
        </div>
        
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-medium mb-2">Quiz Details</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Username:</div>
            <div className="font-medium">{username}</div>
            <div>Difficulty:</div>
            <div className="font-medium capitalize">{difficulty}</div>
            <div>Saved to Leaderboard:</div>
            <div className="font-medium">{saveToLeaderboard ? "Yes" : "No"}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-4">
        <Button onClick={handlePlayAgain} className="w-full sm:w-auto">
          Play Again
        </Button>
        <Button 
          onClick={handleViewLeaderboard} 
          variant="outline" 
          className="w-full sm:w-auto"
        >
          View Leaderboard
        </Button>
      </CardFooter>
    </Card>
  );
} 