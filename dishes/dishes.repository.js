const Dishes = require('./schema/dishes.schema');
const Sequelize = require('../utils/sequelize');

const sequelize = new Sequelize();

// Asynchronously creates a new dish record in the database using the provided 'data'.
async function createDish(data) {
  try {
    // Create a new dish record in the 'Dishes' table using Sequelize.
    const newDish = await Dishes.create(data);

    // Convert the Sequelize model instance to plain data values.
    return sequelize.plainRow(newDish);
  } catch (err) {
    // Handle errors that may occur during the dish creation process.
    console.error('Error creating dish:', err);

    // Re-throw the error to propagate it to the caller.
    throw new Error(err);
  }
}

// Asynchronously edits an existing dish record in the database based on the provided 'where' condition and 'data'.
async function editDish(where, data) {
  try {
    // Use Sequelize's 'update' method to update the dish record.
    const [rowsAffected, [updatedDish]] = await Dishes.update(data, {
      where: where,
      returning: true // To get the updated record as a result
    });

    // Return the number of rows affected and the updated dish data as plain values.
    return {
      rowsAffected,
      updatedDish: sequelize.plainRow(updatedDish)
    };
  } catch (err) {
    // Handle errors that may occur during the dish editing process.
    console.error('Error editing dish:', err);

    // Re-throw the error to propagate it to the caller.
    throw new Error(err);
  }
}

// Asynchronously retrieves dish records from the database based on the provided 'query', 'limit', and 'skip'.
async function getDishes(query, { limit, skip }) {
  try {
    // Log the query for debugging purposes.
    console.log("Query :: ", query);

    // Use Sequelize's 'findAll' method to retrieve dish records.
    const dishes = await Dishes.findAll({ where: query, limit, offset: skip });

    // Convert the Sequelize model instances to an array of plain data values.
    return sequelize.plainRows(dishes);
  } catch (err) {
    // Handle errors that may occur during the process of fetching dishes.
    console.error('Error getting dishes:', err);

    // Re-throw the error to propagate it to the caller.
    throw new Error(err);
  }
}

// Asynchronously counts the number of dish records in the database based on the provided 'query'.
async function countDishes(query) {
  try {
    // Use Sequelize's 'count' method to retrieve the count of dish records.
    const count = await Dishes.count({ where: query });

    // Return the count of dish records.
    return count;
  } catch(err) {
    // Handle errors that may occur during the process of counting dishes.
    console.error('Error counting dishes:', err);

    // Re-throw the error to propagate it to the caller.
    throw new Error(err);
  }
}

// Asynchronously deletes a dish record from the database based on the provided 'id'.
async function deleteDish(id) {
  try {
    // Use Sequelize's 'destroy' method to delete the dish record.
    const deleteddDish = await Dishes.destroy({
      where: { id },
      returning: true
    });

    // Return the deleted dish record or null if not found.
    return deleteddDish;
  } catch (err) {
    // Handle errors that may occur during the dish deletion process.
    console.error('Error deleting dish:', err);

    // Re-throw the error to propagate it to the caller.
    throw new Error(err);
  }
}

module.exports = {
  createDish,
  countDishes,
  editDish,
  getDishes,
  deleteDish
};