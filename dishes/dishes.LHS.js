const State = require("../utils/state");
const DishUtil = require("./dishes.utils");
const {
  diet,
  flavorprofile,
  course,
  region,
  status
} = require("./dishes.config");

const state = new State();
const dishUtil = new DishUtil();

const dishesSchema = {
  name: {
    operators: ["eq", "ne", "like", "nlike", "sw", "ew"]
  },
  ingredients: {
    operators: ["contain", "contained", "overlap"]
  },
  diet: {
    operators: ["eq", "ne", "in", "nin"],
    preHook: (value) => {
      try {
        // Call the enumPreHook function from dishUtil with the provided arguments.
        return dishUtil.enumPreHook(value, diet);
      } catch (err) {
        // Handle any errors that occur during processing.
        console.log("Error Occured :: ", err);
        return;
      }
    }
  },
  preptime: {
    operators: ["gt", "gte", "lt", "lte", "bw", "nbw"]
  },
  cooktime: {
    operators: ["gt", "gte", "lt", "lte", "bw", "nbw"]
  },
  flavorprofile: {
    operators: ["eq", "ne", "in", "nin"],
    preHook: (value) => {
      try {
        // Call the enumPreHook function from dishUtil with the provided arguments.
        return dishUtil.enumPreHook(value, flavorprofile);
      } catch (err) {
        // Handle any errors that occur during processing.
        console.log("Error Occured :: ", err);
        return;
      }
    }
  },
  course: {
    operators: ["eq", "ne", "in", "nin"],
    preHook: (value) => {
      try {
        // Call the enumPreHook function from dishUtil with the provided arguments.
        return dishUtil.enumPreHook(value, course);
      } catch (err) {
        // Handle any errors that occur during processing.
        console.log("Error Occured :: ", err);
        return;
      }
    }
  },
  state: {
    operators: ["eq", "ne", "in", "nin"],
    preHook: (value) => {
      // Try to process and convert the value.
      try {
        // Check if the value is a number, return it as-is.
        if (!isNaN(value)) return value;

        // Check if the value is a string.
        else if (typeof value === 'string') {
          // Check if the string includes commas.
          if (value.includes(",")) {
            // If commas are present, process each part separately.
            const result = [];

            value.split(",").map((stateValue) => {
              // Check if the part is a number, push it to the result array.
              if (!isNaN(stateValue)) result.push(stateValue);

              // If it's a string, process it using the getState function and push to the result array.
              else if (typeof stateValue === "string") {
                // Get the code using the getState function.
                const code = state.getState(stateValue);

                // If a code is present, push it to the result array.
                if (code) result.push(code);
              }
            })

            // Return the processed array.
            return result;
          } else {
            // If no commas are present, process the single value using the getState function.
            return state.getState(value);
          }
        }

        // Return undefined for unsupported types.
        return;
      } catch (err) {
        // Handle any errors that occur during processing.
        console.log("Error Occured :: ", err);
        return;
      }
    }
  },
  region: {
    operators: ["eq", "ne", "in", "nin"],
    preHook: (value) => {
      try {
        // Call the enumPreHook function from dishUtil with the provided arguments.
        return dishUtil.enumPreHook(value, region);
      } catch (err) {
        // Handle any errors that occur during processing.
        console.log("Error Occured :: ", err);
        return;
      }
    }
  },
  status: {
    operators: ["eq", "ne", "in", "nin"],
    preHook: (value) => {
      try {
        // Call the enumPreHook function from dishUtil with the provided arguments.
        return dishUtil.enumPreHook(value, status);
      } catch (err) {
        // Handle any errors that occur during processing.
        console.log("Error Occured :: ", err);
        return;
      }
    }
  }
}

module.exports = {
  dishesSchema
}