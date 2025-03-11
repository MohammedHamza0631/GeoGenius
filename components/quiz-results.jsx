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
    currentDifficulty,
    saveToLeaderboard,
    questionsAnswered
  } = useQuiz();
  
  // Calculate statistics
  const totalQuestions = answers.length;
  const correctAnswers = answers.filter(answer => answer.isCorrect).length;
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  
  // Calculate average response time
  const totalResponseTime = answers.reduce((total, answer) => total + answer.timeRemaining, 0);
  const averageResponseTime = totalQuestions > 0 ? (totalResponseTime / totalQuestions).toFixed(1) : 0;
  
  // Get the last answer (the one that ended the game)
  const lastAnswer = answers.length > 0 ? answers[answers.length - 1] : null;
  const gameEndReason = lastAnswer && !lastAnswer.isCorrect 
    ? "Wrong Answer" 
    : "Time Expired";
  
  const handlePlayAgain = () => {
    resetQuiz();
    router.push("/");
  };
  
  const handleViewLeaderboard = () => {
    router.push("/leaderboard");
  };
  
  // Get achievement level based on questions answered
  const getAchievementLevel = () => {
    if (questionsAnswered >= 30) {
      return "Expert Geographer";
    } else if (questionsAnswered >= 20) {
      return "Advanced Traveler";
    } else if (questionsAnswered >= 10) {
      return "Intermediate Explorer";
    } else {
      return "Novice Adventurer";
    }
  };
  
  // Get phase description based on questions answered
  const getPhaseDescription = () => {
    if (questionsAnswered >= 30) {
      return "You reached the Expert Phase with hard questions!";
    } else if (questionsAnswered >= 20) {
      return "You reached the Advanced Phase with medium and hard questions!";
    } else if (questionsAnswered >= 10) {
      return "You reached the Intermediate Phase with easy and medium questions!";
    } else {
      return "You were in the Initial Phase with easy questions.";
    }
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
          <p className="text-lg font-medium mt-2">{getAchievementLevel()}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="text-2xl font-bold mb-1">{questionsAnswered}</h4>
            <p className="text-sm text-muted-foreground">Questions Answered</p>
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
            <div>Final Difficulty:</div>
            <div className="font-medium capitalize">{currentDifficulty}</div>
            <div>Achievement:</div>
            <div className="font-medium">{getPhaseDescription()}</div>
            <div>Game Ended By:</div>
            <div className="font-medium">{gameEndReason}</div>
            <div>Saved to Leaderboard:</div>
            <div className="font-medium">{saveToLeaderboard ? "Yes" : "No"}</div>
          </div>
        </div>
        
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-medium mb-2">Scoring Breakdown</h4>
          <div className="text-sm">
            <p>Base points per correct answer:</p>
            <ul className="list-disc pl-5 mb-2">
              <li>Easy: 10 points</li>
              <li>Medium: 15 points</li>
              <li>Hard: 20 points</li>
            </ul>
            <p>Time bonus multipliers:</p>
            <ul className="list-disc pl-5">
              <li>Easy: 0.5 points per second remaining</li>
              <li>Medium: 0.75 points per second remaining</li>
              <li>Hard: 1 point per second remaining</li>
            </ul>
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