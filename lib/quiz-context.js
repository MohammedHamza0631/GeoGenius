"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { getQuizQuestions, generateOptions, quizSettings } from './quiz-data';
import { saveScore, checkDbConnection } from '@/app/actions';

// Create the context
const QuizContext = createContext(null);

// Quiz provider component
export function QuizProvider({ children }) {
  // User state
  const [username, setUsername] = useState('');
  const [saveToLeaderboard, setSaveToLeaderboard] = useState(true);
  
  // Quiz configuration
  const [currentDifficulty, setCurrentDifficulty] = useState('easy');
  const [questions, setQuestions] = useState([]);
  const [availableQuestions, setAvailableQuestions] = useState({
    easy: [],
    medium: [],
    hard: []
  });
  
  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [dbConnected, setDbConnected] = useState(false);
  
  // Check database connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      const connected = await checkDbConnection();
      setDbConnected(connected);
    };
    
    checkConnection();
  }, []);
  
  // Prepare questions for all difficulty levels
  const prepareQuestions = () => {
    // Get questions for each difficulty level
    const easyQuestions = getQuizQuestions('easy', 50).map(item => ({
      ...item,
      options: generateOptions(item.capital),
    }));
    
    const mediumQuestions = getQuizQuestions('medium', 50).map(item => ({
      ...item,
      options: generateOptions(item.capital),
    }));
    
    const hardQuestions = getQuizQuestions('hard', 100).map(item => ({
      ...item,
      options: generateOptions(item.capital),
    }));
    
    setAvailableQuestions({
      easy: easyQuestions,
      medium: mediumQuestions,
      hard: hardQuestions
    });
    
    // Start with easy questions
    setQuestions(easyQuestions);
    setCurrentDifficulty('easy');
  };
  
  // Start the quiz
  const startQuiz = () => {
    prepareQuestions();
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuestionsAnswered(0);
    setTimeLeft(quizSettings.easy.timePerQuestion);
    setQuizStarted(true);
    setQuizFinished(false);
    setAnswers([]);
  };
  
  // Progress to next difficulty level
  const progressDifficulty = () => {
    if (currentDifficulty === 'easy' && questionsAnswered >= 10) {
      setCurrentDifficulty('medium');
      setQuestions(availableQuestions.medium);
      setCurrentQuestionIndex(0);
      return quizSettings.medium.timePerQuestion;
    } else if (currentDifficulty === 'medium' && questionsAnswered >= 20) {
      setCurrentDifficulty('hard');
      setQuestions(availableQuestions.hard);
      setCurrentQuestionIndex(0);
      return quizSettings.hard.timePerQuestion;
    }
    
    return quizSettings[currentDifficulty].timePerQuestion;
  };
  
  // Answer a question
  const answerQuestion = (answer, timeRemaining) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.capital;
    
    // Calculate points
    let pointsEarned = 0;
    if (isCorrect) {
      // Base points + time bonus
      pointsEarned = quizSettings[currentDifficulty].pointsPerQuestion + 
        Math.floor(timeRemaining * quizSettings[currentDifficulty].speedBonus);
      
      // Save the answer
      setAnswers([...answers, {
        question: currentQuestion.country,
        userAnswer: answer,
        correctAnswer: currentQuestion.capital,
        isCorrect,
        pointsEarned,
        timeRemaining,
        difficulty: currentDifficulty
      }]);
      
      // Update score and questions answered
      setScore(score + pointsEarned);
      setQuestionsAnswered(questionsAnswered + 1);
      
      // Move to next question or change difficulty
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        const newTimeLeft = progressDifficulty();
        setTimeLeft(newTimeLeft);
        setSelectedAnswer(null);
      } else {
        // No more questions in current difficulty
        if (currentDifficulty === 'hard') {
          // Quiz completed successfully - user answered all questions!
          finishQuiz();
        } else {
          // Progress to next difficulty
          const newTimeLeft = progressDifficulty();
          setTimeLeft(newTimeLeft);
          setSelectedAnswer(null);
        }
      }
    } else {
      // Wrong answer - game over
      setAnswers([...answers, {
        question: currentQuestion.country,
        userAnswer: answer,
        correctAnswer: currentQuestion.capital,
        isCorrect,
        pointsEarned: 0,
        timeRemaining,
        difficulty: currentDifficulty
      }]);
      
      finishQuiz();
    }
  };
  
  // Finish the quiz
  const finishQuiz = async () => {
    setQuizFinished(true);
    setQuizStarted(false);
    
    // Save score to leaderboard if opted in
    if (saveToLeaderboard && username) {
      try {
        const result = await saveScore({
          username,
          score,
          difficulty: currentDifficulty
        });
        
        if (result.success) {
          console.log('Score saved to leaderboard');
        } else {
          console.error('Failed to save score:', result.error);
        }
      } catch (error) {
        console.error('Error saving score:', error);
      }
    }
  };
  
  // Reset the quiz
  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizFinished(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuestionsAnswered(0);
    setQuestions([]);
    setAnswers([]);
    setCurrentDifficulty('easy');
  };
  
  // Context value
  const value = {
    // User
    username,
    setUsername,
    saveToLeaderboard,
    setSaveToLeaderboard,
    
    // Quiz configuration
    currentDifficulty,
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
    questionsAnswered,
    dbConnected,
    
    // Quiz settings
    quizSettings,
    
    // Actions
    startQuiz,
    answerQuestion,
    resetQuiz,
    finishQuiz
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