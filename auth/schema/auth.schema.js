const { DataTypes } = require('sequelize');
const sequelize = require('../../database');

const Users = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Assuming email should be unique for each user
    validate: {
      isEmail: true // Validate email format
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true, // Enable timestamps (createdAt and updatedAt)
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
});

module.exports = Users;