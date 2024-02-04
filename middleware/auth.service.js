const Auth = require('../utils/auth');

const auth = new Auth();

// Function to verify an authentication token
function verifyAuthToken(token = '') {
  try {
    // If the token is empty, return false.
    if (token === '') return false;
    
    // Use the auth.verifyToken function to decode and verify the token.
    const userData = auth.verifyToken(token);

    // If the token is invalid or verification fails, return false.
    if(!userData) return false;

    // Return the decoded user data if the token is valid.
    return userData;
  } catch (err) {
    // Handle errors that may occur during the token verification process.
    console.error('Error Verifying Auth Token:', err);

    // Re-throw the error to propagate it to the caller.
    throw new Error(err);
  }
}

module.exports = {
  verifyAuthToken
}