const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  JWT: {
    secretKey,
    validity
  }
} = require('../config')

const {
    bcrypt: {
      saltRound
    }
} = require('../config');
const Cache = require('./cache');

const cache = new Cache();

class Auth {
  constructor() {}

  async hash(value) {
    // Asynchronously generates a hash using the bcrypt library for the given 'value' with the specified 'saltRound'.
    return bcrypt.hash(value, saltRound);
  }

  async compare(plainValue, hashedValue) {
    // Asynchronously compares a plain text 'plainValue' with a hashed value 'hashedValue' using the bcrypt library.
    return bcrypt.compare(plainValue, hashedValue);
  }

  generateToken(payload) {
    // Generates a JSON Web Token (JWT) by signing the provided 'payload' with the specified 'secretKey' and setting an optional expiration time defined by 'validity'.
    return jwt.sign(payload, secretKey, { expiresIn: validity });
  }

  // Verifies the authenticity of a token by removing the 'Bearer ' prefix, decoding the token, and validating its integrity using the provided 'secretKey'.
  verifyToken(token) {
    token = this.#removeBearer(token);
  
    try {
      // If token is missing or revoked, return false
      if (cache.get(token)) return false;
      
      // Decodes the token using the 'secretKey'
      const data = jwt.verify(token, secretKey);
  
      const { exp: expiryTime } = data || {};
    
      // Checks if the token has expired
      if (this.#isTokenExpired(expiryTime)) return false;
    
      // Returns the decoded token data
      return data;
    } catch (err) {
      // If an error occurs during verification, return false
      return false;
    }
  }

  #isTokenExpired(expiryTime) {
    // Private method that checks if the provided 'expiryTime' (in seconds) is earlier than the current time, indicating that the token has expired.
    return expiryTime < (Date.now() / 1000);
  }

  #removeBearer(token) {
    const bearerPrefix = 'Bearer ';
  
    // Check if the token starts with 'Bearer ' (case-insensitive)
    if (token && token.startsWith(bearerPrefix)) {
      // Remove the 'Bearer ' prefix and return the token without the prefix
      return token.slice(bearerPrefix.length);
    }
  
    // If the token doesn't start with 'Bearer ', return it as is
    return token;
  }
}

module.exports = Auth;
