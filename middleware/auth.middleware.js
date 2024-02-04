const { verifyAuthToken: verifyAuthTokenService } = require('./auth.service');
const { INVALID_TOKEN } = require('./message.json')

// Middleware to verify the authenticity of an authorization token.
async function verifyAuthToken(req, res, next) {
  try {
    // Extract the authorization token from request headers.
    const { authorization } = req.headers;

    // Use the verifyAuthTokenService to decode and verify the token.
    const userData = verifyAuthTokenService(authorization);

    // If the token is invalid, return a 403 Forbidden response.
    if (!userData) return res.status(403).send({ message: INVALID_TOKEN});

    // Attach the decoded user data to the request headers.
    req.headers.userData = userData;

    // Continue to the next middleware or route handler.
    next();
  } catch (err) {
    // Handle errors that may occur during the token verification process.
    console.error('Error verifying auth token:', err);

    // Send a generic internal server error response.
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  verifyAuthToken
}