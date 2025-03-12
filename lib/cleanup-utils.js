/**
 * Utility functions to clean up any existing PIN data from localStorage
 * This is used to remove any sensitive data that might have been stored
 * in previous versions of the application
 */

/**
 * Remove any PIN data from localStorage
 * This should be called when the application starts
 */
export function cleanupLocalStorage() {
  try {
    // Remove the old verifiedUsers object that contained PINs
    localStorage.removeItem('verifiedUsers');
    
    // Keep only the previousUsernames array which doesn't contain sensitive data
    const previousUsernames = JSON.parse(localStorage.getItem('previousUsernames') || '[]');
    
    // Clear localStorage completely
    localStorage.clear();
    
    // Restore only the non-sensitive data
    localStorage.setItem('previousUsernames', JSON.stringify(previousUsernames));
    
    console.log('Successfully cleaned up localStorage');
    return true;
  } catch (error) {
    console.error('Error cleaning up localStorage:', error);
    return false;
  }
}

/**
 * Initialize session storage
 * This ensures that the verifiedUsernames array exists in sessionStorage
 */
export function initSessionStorage() {
  try {
    if (!sessionStorage.getItem('verifiedUsernames')) {
      sessionStorage.setItem('verifiedUsernames', JSON.stringify([]));
    }
    return true;
  } catch (error) {
    console.error('Error initializing sessionStorage:', error);
    return false;
  }
}

/**
 * Clear all verifications from sessionStorage
 * This should be called when the quiz is reset
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