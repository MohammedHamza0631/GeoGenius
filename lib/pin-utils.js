/**
 * Secure PIN utility functions
 * 
 * This implementation uses a more secure approach:
 * - PINs are never stored locally
 * - Only verification status is stored in sessionStorage
 * - Session verification is cleared when the browser is closed
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

/**
 * Store username verification status in sessionStorage
 * This only records that a username has been verified in the current session,
 * without storing the actual PIN
 */
export function storeVerifiedSession(username) {
  try {
    // Get existing verified usernames
    const verifiedUsernames = JSON.parse(sessionStorage.getItem('verifiedUsernames') || '[]');
    
    // Add this username if not already present
    if (!verifiedUsernames.includes(username)) {
      verifiedUsernames.push(username);
      sessionStorage.setItem('verifiedUsernames', JSON.stringify(verifiedUsernames));
    }
    
    // Also store in previousUsernames for the dropdown (in localStorage)
    storePreviousUsername(username);
    
    return true;
  } catch (error) {
    console.error('Error storing verified session:', error);
    return false;
  }
}

/**
 * Check if a username has been verified in the current session
 */
export function isVerifiedInSession(username) {
  try {
    const verifiedUsernames = JSON.parse(sessionStorage.getItem('verifiedUsernames') || '[]');
    return verifiedUsernames.includes(username);
  } catch (error) {
    console.error('Error checking verified session:', error);
    return false;
  }
}

/**
 * Clear verification status for a specific username
 */
export function clearVerification(username) {
  try {
    const verifiedUsernames = JSON.parse(sessionStorage.getItem('verifiedUsernames') || '[]');
    const updatedUsernames = verifiedUsernames.filter(name => name !== username);
    sessionStorage.setItem('verifiedUsernames', JSON.stringify(updatedUsernames));
    return true;
  } catch (error) {
    console.error('Error clearing verification:', error);
    return false;
  }
}

/**
 * Clear all verifications
 */
export function clearAllVerifications() {
  try {
    sessionStorage.removeItem('verifiedUsernames');
    return true;
  } catch (error) {
    console.error('Error clearing all verifications:', error);
    return false;
  }
}

/**
 * Store username in localStorage for the dropdown
 * This doesn't store any PIN or security information
 */
export function storePreviousUsername(username) {
  try {
    // Get existing previous usernames
    const previousUsernames = JSON.parse(localStorage.getItem('previousUsernames') || '[]');
    
    // Add this username if not already present
    if (!previousUsernames.includes(username)) {
      // Keep only the most recent 5 usernames
      const updatedUsernames = [username, ...previousUsernames].slice(0, 5);
      localStorage.setItem('previousUsernames', JSON.stringify(updatedUsernames));
    }
    
    return true;
  } catch (error) {
    console.error('Error storing previous username:', error);
    return false;
  }
}

/**
 * Get previous usernames from localStorage
 */
export function getPreviousUsernames() {
  try {
    return JSON.parse(localStorage.getItem('previousUsernames') || '[]');
  } catch (error) {
    console.error('Error getting previous usernames:', error);
    return [];
  }
}

// Legacy functions maintained for backward compatibility
// These are deprecated and should not be used in new code

export function storeVerifiedUser(username) {
  return storeVerifiedSession(username);
}

export function isUserVerified(username) {
  return isVerifiedInSession(username);
}

export function getStoredPin() {
  return null; // We no longer store PINs
} 