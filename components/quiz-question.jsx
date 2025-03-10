"use client";

import { useEffect, useState } from "react";
import { useQuiz } from "@/lib/quiz-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { quizSettings as defaultQuizSettings } from "@/lib/quiz-data";

export function QuizQuestion() {
  const { 
    questions, 
    currentQuestionIndex, 
    timeLeft, 
    setTimeLeft, 
    answerQuestion,
    difficulty,
    quizSettings
  } = useQuiz();
  
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [progressColor, setProgressColor] = useState("bg-primary");
  
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  
  // Use quizSettings from context if available, otherwise use the default from quiz-data
  const settings = quizSettings || defaultQuizSettings;
  const maxTime = settings[difficulty]?.timePerQuestion || 20;
  const progressPercentage = (timeLeft / maxTime) * 100;
  
  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0 || isAnswered) return;
    
    // Update progress color based on time left
    if (timeLeft < maxTime * 0.25) {
      setProgressColor("bg-red-500");
    } else if (timeLeft < maxTime * 0.5) {
      setProgressColor("bg-yellow-500");
    } else {
      setProgressColor("bg-primary");
    }
    
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
      
      // Auto-submit when time runs out
      if (timeLeft === 1) {
        handleAnswer(null);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft, isAnswered, maxTime, setTimeLeft]);
  
  const handleAnswer = (option) => {
    if (isAnswered) return;
    
    setSelectedOption(option);
    setIsAnswered(true);
    
    // Short delay to show the selected answer before moving to next question
    setTimeout(() => {
      answerQuestion(option, timeLeft);
      setIsAnswered(false);
      setSelectedOption(null);
    }, 1000);
  };
  
  if (!currentQuestion) return null;
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <span className="text-sm font-medium">
            Time: {timeLeft}s
          </span>
        </div>
        <Progress 
          value={progressPercentage} 
          className="h-2"
          indicatorClassName={progressColor}
        />
        <CardTitle className="text-2xl mt-4">
          What is the capital of {currentQuestion.country}?
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentQuestion.options.map((option, index) => (
          <Button
            key={index}
            variant={
              isAnswered
                ? option === currentQuestion.capital
                  ? "success"
                  : option === selectedOption
                  ? "destructive"
                  : "outline"
                : selectedOption === option
                ? "default"
                : "outline"
            }
            className="h-16 text-lg font-medium"
            onClick={() => handleAnswer(option)}
            disabled={isAnswered}
          >
            {option}
          </Button>
        ))}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </div>
      </CardFooter>
    </Card>
  );
} 