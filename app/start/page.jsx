"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { QuizSetupForm } from "@/components/quiz-setup-form";

export default function StartPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Start Your Quiz
          </h1>
          <p className="mt-4 text-muted-foreground">
            Enter your details below to begin the Capital Cities Quiz
          </p>
        </div>
        
        <QuizSetupForm />
      </main>
      
      <Footer />
    </div>
  );
} 