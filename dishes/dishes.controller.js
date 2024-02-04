const dishes = require('./dishes.service');

// Asynchronously handles the creation of a new dish based on the request and sends the response.
async function create(req, res) {
  try {
    // Destructure user ID from request headers.
    const { userData: { id: userId } } = req.headers || {};

    // Destructure dish-related data from the request body or set default values.
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
    } = req.body || {};

    // Use the dishes.create function to create a new dish.
    const { code, message, data } = await dishes.create({
      data: { 
        name,
        ingredients,
        diet,
        preptime,
        cooktime,
        flavorprofile,
        course,
        state,
        region
      },
      userId
    });

    // Send the response with the appropriate status code, message, and data.
    res.status(code).send({
      message, 
      data
    });
  } catch (err) {
    // Handle errors that may occur during the dish creation process.
    console.error('Error creating dish:', err);

    // Send a generic internal server error response.
    res.status(500).send("Internal Server Error");
  }
}

// Asynchronously handles the editing of an existing dish based on the request and sends the response.
async function edit(req, res) {
  try {
    // Destructure user ID from request headers.
    const { userData: { id: userId } } = req.headers || {};

    // Extract dish ID from request parameters.
    const { id } = req.params;

    // Destructure dish-related data from the request body or set default values.
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
    } = req.body || {};

    // Use the dishes.edit function to edit an existing dish.
    const { code, message, data } = await dishes.edit({
      where: { id },
      data: {
        name,
        ingredients,
        diet,
        preptime,
        cooktime,
        flavorprofile,
        course,
        state,
        region
      },
      userId
    });

    // Send the response with the appropriate status code, message, and data.
    res.status(code).send({
      message, 
      data
    });
  } catch (err) {
    // Handle errors that may occur during the dish editing process.
    console.error('Error editing dish:', err);

    // Send a generic internal server error response.
    res.status(500).send("Internal Server Error");
  }
}

// Asynchronously handles the deletion of a dish based on the request and sends the response.
async function deleteDish(req, res) {
  try {
    // Extract dish ID from request parameters.
    const { id = null } = req.params || {};

    // Use the dishes.deleteDish function to delete the dish from the database.
    const { code, message, data } = await dishes.deleteDish(id);

    // Send the response with the appropriate status code, message, and data.
    res.status(code).send({
      message, 
      data
    });
  } catch (err) {
    // Handle errors that may occur during the dish deletion process.
    console.error('Error deleting dish:', err);

    // Send a generic internal server error response.
    res.status(500).send("Internal Server Error");
  }
}

// Asynchronously handles the retrieval of dish data based on the request and sends the response.
async function getDishes(req, res) {
  try {
    // Destructure query parameters or set default values.
    let {
      limit = 10,
      skip = 0,
      ...queries
    } = req.query || {};

    // Check if the numeric value of 'limit' is greater than 100. // If true, set the value of 'limit' to 100.
    if (Number(limit) > 100) limit = 100;

    // Use the dishes.getDishes function to fetch dish data from the database.
    const { code, message, data } = await dishes.getDishes({
      limit,
      skip,
      ...queries
    });

    // Send the response with the appropriate status code, message, and data.
    res.status(code).send({
      message, 
      data
    });
  } catch (err) {
    // Handle errors that may occur during the process of fetching dishes.
    console.error('Error getting dishes:', err);
        
    // Send a generic internal server error response.
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  create,
  edit,
  deleteDish,
  getDishes
}