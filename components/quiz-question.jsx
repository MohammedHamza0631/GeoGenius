"use client";

import { useEffect, useState, useRef } from "react";
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
    currentDifficulty,
    quizSettings,
    questionsAnswered
  } = useQuiz();
  
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [progressColor, setProgressColor] = useState("bg-primary");
  const [progressValue, setProgressValue] = useState(100);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const animationFrameRef = useRef(null);
  const questionChangeRef = useRef(currentQuestionIndex);
  
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  
  // Use quizSettings from context if available, otherwise use the default from quiz-data
  const settings = quizSettings || defaultQuizSettings;
  const maxTime = settings[currentDifficulty]?.timePerQuestion || 20;
  
  // Reset progress bar when question changes
  useEffect(() => {
    if (questionChangeRef.current !== currentQuestionIndex) {
      setProgressValue(100);
      questionChangeRef.current = currentQuestionIndex;
    }
  }, [currentQuestionIndex]);
  
  // Update progress color based on time left
  useEffect(() => {
    if (timeLeft < maxTime * 0.25) {
      setProgressColor("bg-red-500");
    } else if (timeLeft < maxTime * 0.5) {
      setProgressColor("bg-yellow-500");
    } else {
      setProgressColor("bg-primary");
    }
  }, [timeLeft, maxTime]);
  
  // Smooth timer animation
  useEffect(() => {
    if (isAnswered) return;
    
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    // Set start time for this second
    startTimeRef.current = Date.now();
    
    // Function to update progress smoothly
    const updateProgress = () => {
      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      const secondProgress = 1 - (elapsed / 1000);
      const newProgressValue = ((timeLeft - 1 + secondProgress) / maxTime) * 100;
      
      setProgressValue(Math.max(0, newProgressValue));
      
      if (elapsed < 1000 && timeLeft > 0) {
        animationFrameRef.current = requestAnimationFrame(updateProgress);
      }
    };
    
    // Start smooth animation
    animationFrameRef.current = requestAnimationFrame(updateProgress);
    
    // Set timeout for the next second
    if (timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        
        // Auto-submit when time runs out
        if (timeLeft === 1) {
          handleAnswer(null);
        }
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [timeLeft, isAnswered, maxTime, setTimeLeft, currentQuestion, answerQuestion]);
  
  const handleAnswer = (option) => {
    if (isAnswered) return;
    
    // Clear timers
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    setSelectedOption(option);
    setIsAnswered(true);
    setCorrectAnswer(currentQuestion.capital);
    
    // Short delay to show the selected answer before moving to next question
    setTimeout(() => {
      answerQuestion(option, timeLeft);
      setIsAnswered(false);
      setSelectedOption(null);
      setCorrectAnswer(null);
    }, 1500); // Increased to 1.5 seconds to give users more time to see the correct answer
  };
  
  if (!currentQuestion) return null;
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">
            Questions Answered: {questionsAnswered}
          </span>
          <span className="text-sm font-medium">
            Time: {timeLeft}s
          </span>
        </div>
        <Progress 
          value={progressValue} 
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
                ? option === correctAnswer
                  ? "success"
                  : option === selectedOption && option !== correctAnswer
                  ? "destructive"
                  : "outline"
                : selectedOption === option
                ? "default"
                : "outline"
            }
            className={`h-16 text-lg font-medium ${
              isAnswered && option === correctAnswer 
                ? "bg-green-500 hover:bg-green-600 text-white" 
                : isAnswered && option === selectedOption && option !== correctAnswer
                ? "bg-red-500 hover:bg-red-600 text-white"
                : ""
            }`}
            onClick={() => handleAnswer(option)}
            disabled={isAnswered}
          >
            {option}
          </Button>
        ))}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Difficulty: {currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1)}
        </div>
      </CardFooter>
    </Card>
  );
}