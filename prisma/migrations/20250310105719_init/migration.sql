-- CreateTable
CREATE TABLE "leaderboard_entries" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "difficulty" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leaderboard_entries_pkey" PRIMARY KEY ("id")
);
