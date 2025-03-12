/**
 * Simple PIN hashing utility
 * 
 * Note: In a production environment, you would use a more secure hashing algorithm
 * like bcrypt, but for simplicity and to avoid adding dependencies, we're using
 * a simple hash function here.
 */

// Simple hash function for PIN
export function hashPin(pin, username) {
  // Combine the PIN with the username as a salt
  const combined = `${pin}-${username}-salt`;
  
  // Convert to a numeric hash (simple implementation)
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert to a string and ensure it's positive
  return Math.abs(hash).toString(16);
}

// Verify PIN against stored hash
export function verifyPin(pin, username, storedHash) {
  const calculatedHash = hashPin(pin, username);
  return calculatedHash === storedHash;
}

// Store username and PIN in localStorage
export function storeVerifiedUser(username, pin) {
  try {
    // Get existing verified users
    const verifiedUsers = JSON.parse(localStorage.getItem('verifiedUsers') || '{}');
    
    // Add or update this user
    verifiedUsers[username] = {
      pin,
      lastUsed: new Date().toISOString()
    };
    
    // Save back to localStorage
    localStorage.setItem('verifiedUsers', JSON.stringify(verifiedUsers));
    return true;
  } catch (error) {
    console.error('Error storing verified user:', error);
    return false;
  }
}

// This function is no longer used for PIN verification
// It's kept for reference but we always verify against the database
export function isUserVerified(username) {
  return false; // Always return false to ensure database verification
}

// Get stored PIN for a verified user
export function getStoredPin(username) {
  try {
    const verifiedUsers = JSON.parse(localStorage.getItem('verifiedUsers') || '{}');
    return verifiedUsers[username]?.pin || null;
  } catch (error) {
    console.error('Error getting stored PIN:', error);
    return null;
  }
} 