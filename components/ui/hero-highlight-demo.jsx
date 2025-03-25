"use client";
import { motion } from "motion/react";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroHighlightDemo() {
  return (
    <HeroHighlight containerClassName="min-h-screen">
      <motion.div
        className="text-center flex flex-col items-center space-y-8 p-6 backdrop-blur-sm bg-white/30 dark:bg-black/30 rounded-2xl max-w-3xl mx-auto"
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}>
        {/* Badge */}
        <div className="bg-primary/90 text-primary-foreground px-6 py-1.5 rounded-full text-sm font-medium">
          Capital Cities Quiz
        </div>
        
        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-800 dark:text-white max-w-4xl leading-tight">
          Master <Highlight className="text-black dark:text-white">Global Geography</Highlight>
        </h1>
        
        {/* Description */}
        <p className="text-lg md:text-xl text-neutral-700 dark:text-slate-300 max-w-2xl mx-auto font-medium">
          Challenge yourself with our interactive quiz on capital cities from around the world. Test your knowledge, beat high scores, and become a geography expert!
        </p>
        
        {/* Action buttons */}
        <div className="flex flex-wrap gap-4 justify-center mt-8">
          <Button size="lg" className="px-8 py-6 text-lg" asChild>
            <Link href="/start">Start Quiz</Link>
          </Button>
          <Button variant="outline" size="lg" className="px-8 py-6 text-lg" asChild>
            <Link href="/leaderboard">View Leaderboard</Link>
          </Button>
        </div>
      </motion.div>
    </HeroHighlight>
  );
} 