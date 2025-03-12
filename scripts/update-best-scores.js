/**
 * This script updates existing leaderboard entries to mark the best scores.
 * Run this after adding the isBestScore field to the database.
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateBestScores() {
  console.log('Starting update of best scores...');
  
  try {
    // Get all entries
    const allEntries = await prisma.leaderboardEntry.findMany({
      orderBy: {
        score: 'desc',
      },
    });
    
    console.log(`Found ${allEntries.length} total entries`);
    
    // Process to get only the best score for each username
    const usernameMap = new Map();
    
    allEntries.forEach(entry => {
      if (!usernameMap.has(entry.username) || usernameMap.get(entry.username).score < entry.score) {
        usernameMap.set(entry.username, entry);
      }
    });
    
    // Convert map to array of best score entries
    const bestScores = Array.from(usernameMap.values());
    
    console.log(`Found ${bestScores.length} best scores to update`);
    
    // Update each best score
    for (const entry of bestScores) {
      await prisma.leaderboardEntry.update({
        where: { id: entry.id },
        data: { isBestScore: true },
      });
      console.log(`Updated entry ID ${entry.id} for user ${entry.username} with score ${entry.score}`);
    }
    
    console.log('Update completed successfully!');
  } catch (error) {
    console.error('Error updating best scores:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update
updateBestScores(); 