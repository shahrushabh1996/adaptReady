const { Sequelize } = require('sequelize');
const {
  postgres: {
    url,
    username,
    password,
    database,
    port,
    dialectOptions
  },
  sequelize: {
    dialect
  }
} = require('./config');

// Create Sequelize instance
const sequelize = new Sequelize(database, username, password, {
  logging: console.log,
  host: url,
  port,
  dialect,
  dialectOptions
});

// Export the Sequelize instance to be used in other parts of your application
module.exports = sequelize;