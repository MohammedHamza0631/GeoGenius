"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ModernLanding } from "@/components/modern-landing";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header />
      
      <main className="flex-1">
        <ModernLanding 
          title="Master Global"
          subtitle="Geography"
          description="Challenge yourself with our interactive quiz on capital cities from around the world. Test your knowledge, beat high scores, and become a geography expert!"
          primaryButtonText="Start Quiz"
          primaryButtonLink="/start"
          secondaryButtonText="View Leaderboard"
          secondaryButtonLink="/leaderboard"
          rotatingWords={["educational", "challenging", "fun", "competitive", "engaging"]}
          badge="Capital Cities Quiz"
        />
      </main>
      
      <Footer />
    </div>
  );
}
