const dishes = require('./dishes.repository');
const { dishesSchema: dishesLHSSchema } = require('./dishes.LHS');
const State = require('../utils/state');
const LHS = require('../utils/LHS');
const {
  DISH_CREATED,
  DISH_NOT_FOUND,
  DISH_UPDATED,
  DISH_DELETED,
  DISH_FETCHED,
  DISH_CREATION_FAILED,
  DISH_UPDATION_FAILED,
  DISH_DELETION_FAILED,
  DISH_FETCHING_FAILED,
  DISH_COUNTING_FAILED
} = require('./message.json');

const state = new State();

// Asynchronously creates a new dish with the provided data and user ID.
async function create({
  data,
  userId
}) {
  try {
    // Destructure data object or set default values.
    const {
      name = '',
      ingredients = [],
      diet = '',
      preptime = null,
      cooktime = null,
      flavorprofile = null,
      course = '',
      state = null,
      region = null
    } = data || {};

    // Use the dishes.createDish function to create a new dish in the database.
    const createdDish = await dishes.createDish({
      name,
      ingredients,
      diet,
      preptime,
      cooktime,
      flavorprofile,
      course,
      state,
      region,
      createdBy: userId
    })

    // If the dish creation fails, throw an error.
    if (!createdDish) throw new Error(DISH_CREATION_FAILED);

    // Return a success response with the created dish data.
    return {
      code: 201,
      message: DISH_CREATED,
      data: createdDish
    };
  } catch (err) {
    // Handle errors that may occur during the dish creation process.
    console.error('Error Creating Dish:', err);

    // Re-throw the error to propagate it to the caller.
    throw new Error(err);
  }
}

// Asynchronously edits an existing dish based on the provided 'where' condition, 'data', and 'userId'.
async function edit({
  where, 
  data,
  userId
}) {
  try {
    // Destructure data object or set default values.
    const {
      name,
      ingredients,
      diet,
      preptime,
      cooktime,
      flavorprofile,
      course,
      state,
      region
    } = data || {};

    // Use the dishes.editDish function to edit an existing dish in the database.
    const updatedDishData = await dishes.editDish(where, {
      name,
      ingredients,
      diet,
      preptime,
      cooktime,
      flavorprofile,
      course,
      state,
      region,
      lastUpdatedBy: userId
    });

    // If the dish updation fails, throw an error.
    if (!updatedDishData) throw new Error(DISH_UPDATION_FAILED);

    const { rowsAffected, updatedDish } = updatedDishData;

    // If no rows were affected, return a not found response.
    if (rowsAffected === 0) return {
      code: 404,
      message: DISH_NOT_FOUND
    }

    // Return a success response with the updated dish data.
    return {
      code: 200,
      message: DISH_UPDATED,
      data: updatedDish
    }
  } catch (err) {
    // Handle errors that may occur during the dish editing process.
    console.error('Error Editing Dish:', err);

    // Re-throw the error to propagate it to the caller.
    throw new Error(err);
  }
}

// Asynchronously deletes a dish from the database based on the provided 'id'.
async function deleteDish(id) {
  try {
    // Use the dishes.deleteDish function to delete the dish from the database.
    const deletedDish = await dishes.deleteDish(id);

    // If no rows were affected, return a not found response.
    if (deletedDish === 0) return {
      code: 404,
      message: DISH_NOT_FOUND
    }
    // If the dish deletion fails, throw an error.
    else if (!deletedDish) throw new Error(DISH_DELETION_FAILED)

    // Return a success response for a successful deletion.
    return {
      code: 204,
      message: DISH_DELETED
    }
  } catch (err) {
    // Handle errors that may occur during the dish deletion process.
    console.error('Error Deleting Dish:', err);

    // Re-throw the error to propagate it to the caller.
    throw new Error(err);
  }
}

async function getDishes(data) {
  try {
    // Destructure data object or set default values.
    const {
      limit = 10,
      skip = 0,
      ...queries
    } = data || {};

    // Create an instance of the LHS class with the provided schema.
    const lhs = new LHS(dishesLHSSchema);

    // Build a query using the LHS builder with the provided queries.
    const query = lhs.builder(queries);

    // Use the dishes.getDishes function to fetch dish data from the database.
    const dishesData = await dishes.getDishes(query, { limit, skip });

    // If dish data fetching fails, throw an error.
    if (!dishesData) throw new Error(DISH_FETCHING_FAILED);

    // Extract the 'state' from the dish data using the state.getState function.
    state.getState(dishesData, 'state');

    // Count the total number of dishes based on the provided query.
    const totalDishes = await dishes.countDishes(query);

    // If the total dish count is not a number, throw an error.
    if (isNaN(totalDishes)) throw new Error(DISH_COUNTING_FAILED);

    // Return a success response with the fetched dish data and total count.
    return {
      code: 200,
      message: DISH_FETCHED,
      data: {
        dishes: dishesData,
        total: totalDishes
      }
    }
  } catch (err) {
    // Handle errors that may occur during the process of fetching dishes.
    console.error('Error Getting Dishes:', err);

    // Re-throw the error to propagate it to the caller.
    throw new Error(err);
  }
}

module.exports = {
  create,
  edit,
  deleteDish,
  getDishes
}