"use client";

import { createContext, useContext, useState } from 'react';
import { getQuizQuestions, generateOptions, quizSettings } from './quiz-data';

// Create the context
const QuizContext = createContext(null);

// Quiz provider component
export function QuizProvider({ children }) {
  // User state
  const [username, setUsername] = useState('');
  const [saveToLeaderboard, setSaveToLeaderboard] = useState(true);
  
  // Quiz configuration
  const [difficulty, setDifficulty] = useState('easy');
  const [questions, setQuestions] = useState([]);
  
  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [answers, setAnswers] = useState([]);
  
  // Start the quiz
  const startQuiz = () => {
    // Get questions based on difficulty
    const quizQuestions = getQuizQuestions(difficulty, 10).map(item => ({
      ...item,
      options: generateOptions(item.capital),
    }));
    
    setQuestions(quizQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(quizSettings[difficulty].timePerQuestion);
    setQuizStarted(true);
    setQuizFinished(false);
    setAnswers([]);
  };
  
  // Answer a question
  const answerQuestion = (answer, timeRemaining) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.capital;
    
    // Calculate points
    let pointsEarned = 0;
    if (isCorrect) {
      // Base points + time bonus
      pointsEarned = quizSettings[difficulty].pointsPerQuestion + 
        Math.floor(timeRemaining * quizSettings[difficulty].speedBonus);
    }
    
    // Save the answer
    setAnswers([...answers, {
      question: currentQuestion.country,
      userAnswer: answer,
      correctAnswer: currentQuestion.capital,
      isCorrect,
      pointsEarned,
      timeRemaining,
    }]);
    
    // Update score
    setScore(score + pointsEarned);
    
    // Move to next question or finish quiz
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(quizSettings[difficulty].timePerQuestion);
      setSelectedAnswer(null);
    } else {
      // Quiz finished
      setQuizFinished(true);
      setQuizStarted(false);
    }
  };
  
  // Reset the quiz
  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizFinished(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuestions([]);
    setAnswers([]);
  };
  
  // Context value
  const value = {
    // User
    username,
    setUsername,
    saveToLeaderboard,
    setSaveToLeaderboard,
    
    // Quiz configuration
    difficulty,
    setDifficulty,
    questions,
    
    // Quiz state
    currentQuestionIndex,
    selectedAnswer,
    setSelectedAnswer,
    timeLeft,
    setTimeLeft,
    score,
    quizStarted,
    quizFinished,
    answers,
    
    // Quiz settings
    quizSettings,
    
    // Actions
    startQuiz,
    answerQuestion,
    resetQuiz,
  };
  
  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
}

// Hook to use the quiz context
export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
} 