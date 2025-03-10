"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { QuizQuestion } from "@/components/quiz-question";
import { QuizResults } from "@/components/quiz-results";
import { useQuiz } from "@/lib/quiz-context";

export default function QuizPage() {
  const router = useRouter();
  const { username, quizStarted, quizFinished } = useQuiz();
  
  // Redirect to start page if no username is set
  useEffect(() => {
    if (!username) {
      router.push("/start");
    }
  }, [username, router]);
  
  if (!username) {
    return null;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-12">
        {quizFinished ? (
          <QuizResults />
        ) : (
          <QuizQuestion />
        )}
      </main>
      
      <Footer />
    </div>
  );
} 