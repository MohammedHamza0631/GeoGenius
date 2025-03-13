/**
 * This script cleans up duplicate entries in the database,
 * keeping only the best score for each user per difficulty.
 * Run this after updating the saveScore function to use the new approach.
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanupDuplicates() {
  console.log('Starting cleanup of duplicate entries...');
  
  try {
    // Get all entries
    const allEntries = await prisma.leaderboardEntry.findMany();
    
    console.log(`Found ${allEntries.length} total entries`);
    
    // Group entries by username and difficulty
    const entriesByUserAndDifficulty = {};
    
    allEntries.forEach(entry => {
      const key = `${entry.username}-${entry.difficulty}`;
      if (!entriesByUserAndDifficulty[key]) {
        entriesByUserAndDifficulty[key] = [];
      }
      entriesByUserAndDifficulty[key].push(entry);
    });
    
    // For each group, keep only the entry with the highest score
    let deletedCount = 0;
    let keptCount = 0;
    
    for (const [key, entries] of Object.entries(entriesByUserAndDifficulty)) {
      if (entries.length > 1) {
        // Sort entries by score (highest first)
        entries.sort((a, b) => b.score - a.score);
        
        // Keep the entry with the highest score
        const bestEntry = entries[0];
        keptCount++;
        
        // Delete the rest
        for (let i = 1; i < entries.length; i++) {
          await prisma.leaderboardEntry.delete({
            where: { id: entries[i].id }
          });
          deletedCount++;
        }
        
        console.log(`Kept best entry (score: ${bestEntry.score}) for ${bestEntry.username} on ${bestEntry.difficulty} difficulty`);
      } else {
        keptCount++;
      }
    }
    
    // Now update the isBestScore flag for each user
    const usernames = [...new Set(allEntries.map(entry => entry.username))];
    
    for (const username of usernames) {
      // Get all entries for this user
      const userEntries = await prisma.leaderboardEntry.findMany({
        where: { username },
        orderBy: { score: 'desc' }
      });
      
      // Mark the entry with the highest score as the best
      if (userEntries.length > 0) {
        const bestEntry = userEntries[0];
        
        // Reset all entries for this user to not be the best
        await prisma.leaderboardEntry.updateMany({
          where: { username },
          data: { isBestScore: false }
        });
        
        // Mark the best entry
        await prisma.leaderboardEntry.update({
          where: { id: bestEntry.id },
          data: { isBestScore: true }
        });
        
        console.log(`Marked entry with score ${bestEntry.score} as the best for ${username}`);
      }
    }
    
    console.log(`Cleanup completed. Kept ${keptCount} entries, deleted ${deletedCount} duplicates.`);
  } catch (error) {
    console.error('Error cleaning up duplicates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the cleanup
cleanupDuplicates(); 