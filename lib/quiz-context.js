"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { getQuizQuestions, generateOptions, quizSettings } from './quiz-data';
import { saveScore, checkDbConnection } from '@/app/actions';
import { clearAllVerifications } from "@/lib/cleanup-utils";

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
  
  // Add state to track used questions
  const [usedQuestionIds, setUsedQuestionIds] = useState(new Set());
  
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
    // Get questions for each difficulty level - use 'all' to get all available questions
    const easyQuestions = getQuizQuestions('easy', 'all').map(item => ({
      ...item,
      id: `${item.country}-${item.capital}`, // Add unique ID
      options: generateOptions(item.capital),
    }));
    
    const mediumQuestions = getQuizQuestions('medium', 'all').map(item => ({
      ...item,
      id: `${item.country}-${item.capital}`, // Add unique ID
      options: generateOptions(item.capital),
    }));
    
    const hardQuestions = getQuizQuestions('hard', 'all').map(item => ({
      ...item,
      id: `${item.country}-${item.capital}`, // Add unique ID
      options: generateOptions(item.capital),
    }));
    
    console.log(`Loaded ${easyQuestions.length} easy, ${mediumQuestions.length} medium, and ${hardQuestions.length} hard questions.`);
    
    setAvailableQuestions({
      easy: easyQuestions,
      medium: mediumQuestions,
      hard: hardQuestions
    });
    
    // Reset used questions
    setUsedQuestionIds(new Set());
    
    // Start with easy questions (get 10 unique ones)
    const initialQuestions = getUniqueQuestions(easyQuestions, 10, new Set());
    setQuestions(initialQuestions);
    setCurrentDifficulty('easy');
  };
  
  // Helper function to get unique questions
  const getUniqueQuestions = (questionPool, count, usedIds) => {
    const uniqueQuestions = [];
    const newUsedIds = new Set(usedIds);
    
    // Create a copy of the question pool to shuffle
    const shuffledPool = [...questionPool].sort(() => 0.5 - Math.random());
    
    // First try to get questions that haven't been used yet
    for (const question of shuffledPool) {
      if (uniqueQuestions.length >= count) break;
      
      if (!newUsedIds.has(question.id)) {
        uniqueQuestions.push(question);
        newUsedIds.add(question.id);
      }
    }
    
    // If we couldn't get enough unique questions, log a message
    if (uniqueQuestions.length < count) {
      console.log(`Could only find ${uniqueQuestions.length} unique questions out of ${count} requested.`);
    }
    
    // Update the used questions set
    setUsedQuestionIds(newUsedIds);
    
    return uniqueQuestions;
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
  
  // Get next batch of questions based on progress
  const getNextQuestions = () => {
    // First 10 questions are easy
    if (questionsAnswered < 10) {
      const uniqueEasyQuestions = getUniqueQuestions(availableQuestions.easy, 10, usedQuestionIds);
      return {
        questions: uniqueEasyQuestions,
        difficulty: 'easy'
      };
    }
    // After 10 questions, mix easy and medium
    else if (questionsAnswered < 20) {
      // Get unused easy and medium questions
      const unusedEasy = availableQuestions.easy.filter(q => !usedQuestionIds.has(q.id));
      const unusedMedium = availableQuestions.medium.filter(q => !usedQuestionIds.has(q.id));
      
      // Create a mixed pool with 50% easy, 50% medium if possible
      const easyToUse = Math.min(5, unusedEasy.length);
      const mediumToUse = Math.min(10 - easyToUse, unusedMedium.length);
      
      const easyQuestions = getUniqueQuestions(unusedEasy, easyToUse, usedQuestionIds);
      const mediumQuestions = getUniqueQuestions(unusedMedium, mediumToUse, usedQuestionIds);
      
      // Combine and shuffle
      const mixed = [...easyQuestions, ...mediumQuestions].sort(() => 0.5 - Math.random());
      
      return {
        questions: mixed,
        difficulty: 'medium'
      };
    }
    // After 20 questions, mix medium and hard
    else if (questionsAnswered < 30) {
      // Get unused medium and hard questions
      const unusedMedium = availableQuestions.medium.filter(q => !usedQuestionIds.has(q.id));
      const unusedHard = availableQuestions.hard.filter(q => !usedQuestionIds.has(q.id));
      
      // Create a mixed pool with 50% medium, 50% hard if possible
      const mediumToUse = Math.min(5, unusedMedium.length);
      const hardToUse = Math.min(10 - mediumToUse, unusedHard.length);
      
      const mediumQuestions = getUniqueQuestions(unusedMedium, mediumToUse, usedQuestionIds);
      const hardQuestions = getUniqueQuestions(unusedHard, hardToUse, usedQuestionIds);
      
      // Combine and shuffle
      const mixed = [...mediumQuestions, ...hardQuestions].sort(() => 0.5 - Math.random());
      
      return {
        questions: mixed,
        difficulty: 'hard'
      };
    }
    // After 30 questions, use hard only
    else {
      // Get unused hard questions
      const unusedHard = availableQuestions.hard.filter(q => !usedQuestionIds.has(q.id));
      const hardQuestions = getUniqueQuestions(unusedHard, 10, usedQuestionIds);
      
      return {
        questions: hardQuestions,
        difficulty: 'hard'
      };
    }
  };
  
  // Progress to next batch of questions
  const progressQuestions = () => {
    const { questions: nextQuestions, difficulty: nextDifficulty } = getNextQuestions();
    
    // Check if we have enough questions to continue
    if (nextQuestions.length > 0) {
      setQuestions(nextQuestions);
      setCurrentDifficulty(nextDifficulty);
      setCurrentQuestionIndex(0);
      return quizSettings[nextDifficulty].timePerQuestion;
    } else {
      // If we've used all questions, finish the quiz with a special message
      console.log("Congratulations! You've answered all available questions!");
      finishQuiz();
      return 0;
    }
  };
  
  // Answer a question
  const answerQuestion = (answer, timeRemaining) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.capital;
    
    // Track this question as used
    setUsedQuestionIds(prev => {
      const updated = new Set(prev);
      updated.add(currentQuestion.id);
      return updated;
    });
    
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
      
      // Move to next question or change batch
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTimeLeft(quizSettings[currentDifficulty].timePerQuestion);
        setSelectedAnswer(null);
      } else {
        // No more questions in current batch, get next batch
        const newTimeLeft = progressQuestions();
        setTimeLeft(newTimeLeft);
        setSelectedAnswer(null);
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
    setUsedQuestionIds(new Set());
    
    // We no longer clear verifications here
    // This allows users to stay verified across multiple quiz attempts
    // clearAllVerifications(); - removed
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