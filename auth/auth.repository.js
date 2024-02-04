const { ValidationError } = require('sequelize');
const Sequelize = require('../utils/sequelize');
const auth = require('./schema/auth.schema');

const sequelize = new Sequelize();

// Asynchronously creates a new user using authentication service and returns a plain representation.
async function createUser(data) {
  try {
    // Use the auth.create function to create a new user.
    const newUser = await auth.create(data);

    // Return a plain representation of the new user.
    return sequelize.plainRow(newUser);
  } catch(err) {
    // Handle errors that may occur during the user creation process.
    console.error('Error creating user:', err);

    // If the error is a validation error, re-throw it to propagate it to the caller.
    if (err instanceof ValidationError) throw err;

    // For other errors, throw a generic error.
    throw new Error(err);
  }
}

// Asynchronously retrieves a user based on the provided conditions.
async function getUser(where) {
  try {
    // Use the auth.findOne function to find a user based on the provided conditions.
    const user = await auth.findOne({ where, raw: true, nest: true });

    // Return the retrieved user.
    return user;
  } catch(err) {
    // Handle errors that may occur during the user retrieval process.
    console.error('Error getting user:', err);

    // Re-throw the error to propagate it to the caller.
    throw new Error(err);
  }
}

module.exports = {
    createUser,
    getUser
};