const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env')});

const dishSchema = require('../dishes/schema/dishes.schema');
const { codes } = require('../config/states');
const { schema } = require('./fiddle.schema');
const csv = require("csvtojson/v2");

// Asynchronously reads data from a CSV file, transforms, sanitizes, and inserts into a database table.
async function createDishes() {
  try {
    // Read data from the CSV file using the csv library.
    const dishes = await csv().fromFile('./indian_food.csv');

    // Initialize an array to store the transformed and sanitized data.
    const insertDishes = [];
  
    // Iterate over each dish in the CSV data.
    for (let dish of dishes) {
      const obj = {};
  
      // Iterate over each key in the dish.
      for (let key in dish) {
        // Retrieve alias and datatype information from the provided schema.
        const { alias, datatype } = schema[key] || {};
  
        // Handle special case for 'state' key using codes mapping.
        if (key === 'state') {
          obj[alias] = codes[dish[key]]
          dish[key] = obj[alias];
        };
  
        // Sanitize the value based on the datatype.
        obj[alias] = sanitize(dish[key], datatype);
      }
  
      // Set a default status of 'Active'.
      obj['status'] = 'Active';
  
      // Push the transformed and sanitized object to the array.
      insertDishes.push(obj);
    }
  
    // Use bulkCreate to insert the dishes into the database table.
    const insertedDishes = await dishSchema.bulkCreate(insertDishes)
  
    // Log the inserted dishes data.
    console.log(JSON.stringify(insertedDishes));
  } catch (err) {
    // Handle errors that may occur during the process.
    console.error(err);
  }
}

// Sanitizes a value based on the provided datatype.
const sanitize = (value = '', datatype = '') => {
  // Convert empty strings or values equal to -1 to null.
  value = !value || Number(value) === -1 ? null : value;

  // If the value is null or equal to -1, return the value as-is.
  if (!value || Number(value) === -1) return value;

  // Switch based on the provided datatype.
  switch(datatype) {
    case 'string':
      // Sanitize string by capitalizing the first letter.
      return capitilizeValue(value || '');
      break;
    case 'number':
      // Sanitize number by converting to a JavaScript number.
      return Number(value);
      break;
    case 'enum':
      // Sanitize enum by capitalizing and adjusting non-veg cases.
      return capitilizeValue(changeNonVegCase(value))
      break;
    case 'array':
      // Sanitize array by capitalizing each element.
      return capitilizeArray(value.split(', '));
      break;
  }
}

const changeNonVegCase = (value = '') => value === 'non vegetarian' ? 'Non-vegetarian' : value;

// Capitalizes each element in the provided array.
const capitilizeArray = (array = []) => {
  // Initialize an array to store the capitalized elements.
  const capitilizedArray = [];

  // Iterate over each element in the provided array.
  for (let ele of array) capitilizedArray.push(capitilizeValue(ele));

  // Return the array with capitalized elements.
  return capitilizedArray;
}

const capitilizeValue = (value = '') => value.charAt(0).toUpperCase() + value.slice(1)

createDishes();