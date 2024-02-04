const { DataTypes: { INTEGER, STRING, ARRAY, NUMBER, ENUM, TEXT } } = require('sequelize');
const sequelize = require('../../database');
const { diet, flavorprofile, course, region, status } = require('../dishes.config')

const Dish = sequelize.define('Dish', {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: STRING,
    allowNull: false
  },
  ingredients: {
    type: ARRAY(TEXT),
    allowNull: false
  },
  diet: {
    type: ENUM,
    values: diet,
    allowNull: false
  },
  preptime: {
    type: NUMBER
  },
  cooktime: {
    type: NUMBER
  },
  flavorprofile: {
    type: ENUM,
    values: flavorprofile,
  },
  course: {
    type: ENUM,
    values: course,
    allowNull: false
  },
  state: {
    type: INTEGER
  },
  region: {
    type: ENUM,
    values: region,
  },
  status: {
    type: ENUM,
    values: status,
    defaultValue: 'Active',
    allowNull: false
  },
}, {
  timestamps: true, // Enable timestamps (createdAt and updatedAt)
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
});

module.exports = Dish;
