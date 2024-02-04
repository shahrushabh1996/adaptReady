const { ValidationError } = require('sequelize');
const auth = require('./auth.repository');
const Auth = require("../utils/auth");
const Cache = require("../utils/cache");
const Sequelize = require('../utils/sequelize');
const {
  AUTH_USER_CREATED,
  AUTH_USER_NOT_FOUND,
  AUTH_INVALID_CREDENTIALS,
  AUTH_LOGGED_IN,
  AUTH_LOGGED_OUT,
  AUTH_FAILED_USER_CREATEION,
  AUTH_FAILED_LOGOUT,
  EMAIL_REGISTERED
} = require('./message.json');

const authUtil = new Auth();
const cache = new Cache();
const sequelize = new Sequelize();

// Asynchronously handles user registration.
async function register(data) {
  try {
    // Destructure the password from the provided data.
    const { password } = data || {};

    // Use auth.createUser to create a new user with the hashed password.
    const user = await auth.createUser({ ...data, password: await authUtil.hash(password) });

    // If the user creation fails, throw an error.
    if (!user) throw new Error(AUTH_FAILED_USER_CREATEION);

    // Return a success response with the created user data.
    return {
      code: 201,
      message: AUTH_USER_CREATED,
      data: user
    }
  } catch (err) {
    // Handle validation errors.
    if (err instanceof ValidationError) {
      // Check if the error is due to a unique constraint violation on the email field.
      const isEmailUniqueError = sequelize.isUniqueKeyViolation(err, 'email');

      // If the email is already registered, return a conflict response.
      if (isEmailUniqueError) return {
        code: 409,
        message: EMAIL_REGISTERED
      }
    }

    // Log and re-throw other errors to propagate them to the caller.
    console.error('Error Registering User:', err);
    throw new Error(err);
  }
}

// Asynchronously handles user login/authentication.
async function login(email, password) {
  try {
    // Retrieve the user by email.
    const user = await auth.getUser({ email: email });

    // If the user is not found, return a 404 Not Found response.
    if (!user) return {
      code: 404,
      message: AUTH_USER_NOT_FOUND
    }

    // Destructure the stored password and other user data.
    const { password: storedPassword, ...restUserData } = user;

    // Compare the provided password with the stored password.
    const isValidPassword = await authUtil.compare(password, storedPassword);

    // If the password is not valid, return a 401 Unauthorized response.
    if (!isValidPassword) return {
      code: 401,
      message: AUTH_INVALID_CREDENTIALS
    }

    // If authentication is successful, generate a token and return a 200 OK response.
    return {
      code: 200,
      message: AUTH_LOGGED_IN,
      data: {
        token: authUtil.generateToken(restUserData)
      }
    }
  } catch (err) {
    // Handle errors that may occur during the login process.
    console.error('Error Logging User:', err);

    // Re-throw the error to propagate it to the caller.
    throw new Error(err);
  }
}

// Asynchronously handles user logout.
async function logout(token) {
  try {
    // Verify the provided token.
    const tokenData = authUtil.verifyToken(token);

    // If token verification fails, throw an error.
    if (!tokenData) throw new Error(AUTH_FAILED_LOGOUT);

    // Extract the expiration time from the token data.
    const { exp } = tokenData || {};

    // Set a cache entry with the token for the specified duration.
    if (cache.set(token.replace(/^Bearer\s+/, ''), 1, exp)) {
      // If the cache entry is set successfully, return a 200 OK response.
      return {
        code: 200,
        message: AUTH_LOGGED_OUT
      }
    }

    // If cache entry setting fails, throw an error.
    throw new Error(AUTH_FAILED_LOGOUT);
  } catch (err) {
    // Handle errors that may occur during the logout process.
    console.error('Error Logging Out User:', err);

    // Re-throw the error to propagate it to the caller.
    throw new Error(err);
  }
}

module.exports = {
  register,
  login,
  logout
};