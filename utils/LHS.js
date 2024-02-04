const { Op: { 
  eq, 
  ne, 
  gt, 
  gte, 
  lt, 
  lte, 
  in: inArray, 
  notIn: notInArray, 
  all, 
  any,
  between,
  notBetween,
  like,
  notLike,
  startsWith,
  endsWith,
  contains,
  contained,
  overlap
} } = require('sequelize');

class LHS {
  // Constructor for creating an instance with an optional 'schema'.
  constructor(schema) {
    // Set the 'schema' property to the provided value or an empty object if none is provided.
    this.schema = schema || {};
  }

  // Builds a collection of queries using the provided 'queries' object.
  builder(queries) {
    const queriesBuilt = {};
    
    for (let key in queries) {
      // Build the query for the current key-value pair.
      const query = this.queryBuilder(key, queries[key]);

      // Check conditions:
      // 1. If 'query' is falsy (undefined, null, false, 0, '', etc.)
      // 2. If there is no corresponding schema for the given 'key' in 'this.schema'
      // 3. If 'query' is an empty object (no properties) and has no symbols
      if (!query || !this.schema[key] || (Object.keys(query).length === 0 && Object.getOwnPropertySymbols(query).length === 0)) continue;

      // Add the built query to the result object.
      queriesBuilt[key] = query;
    }

    // Return the collection of built queries.
    return queriesBuilt;
  }

  // Builds a query for a given 'key' and 'value' based on the schema's supported operators.
  queryBuilder(key, value) {
    // Initialize an empty builder object for the current query.
    this.builder = {};

    // If 'value' is not an object, return it directly.
    if (typeof value !== "object") return value;

    // Retrieve the supported operators & preHook for the current 'key' from the schema.
    const { operators: supportedOperators = [], preHook } = this.schema[key] || {};

    // If no supported operators are defined, return undefined.
    if (!supportedOperators) return false;

    // Set the supported operators for the current query.
    this.supportedOperators = supportedOperators;

    // Iterate through each key-value pair in the 'value' object.
    for (let key in value) {
      // If the current operator is not supported, skip to the next one.
      if (!this.#isOperatorSupported(key)) continue;

      // Apply the preHook function to the value associated with the key.
      if (preHook) value[key] = preHook(value[key]);

      // Call the corresponding operator function to build the query.
      this.#callOperator(key, value[key]);
    }

    // Return the built query or an empty object if no valid operators were found.
    return this.builder || {};
  }

  // Private method that checks if the provided 'operator' is supported for the current query.
  #isOperatorSupported(operator = '') {
    // Check if the 'operator' is included in the list of supported operators.
    return this.supportedOperators.includes(operator);
  }

  // Private method that calls the corresponding operator function based on the provided 'operator' and 'value'.
  #callOperator(operator, value) {
    // If 'value' is falsy, return immediately.
    if (!value) return;

    // Switch statement to call the appropriate operator function based on the provided 'operator'.
    switch(operator) {
      case "eq":
        return this.#equal(value);
      break;
      case "ne":
        return this.#notEqual(value);
      break;
      case "gt":
        return this.#greaterThan(value);
      break;
      case "gte":
        return this.#greaterThanEqual(value);
      break;
      case "lt":
        return this.#lessThan(value);
      break;
      case "lte":
        return this.#lessThanEqual(value);
      break;
      case "bw":
        return this.#valueBetween(value);
      break;
      case "nbw":
        return this.#valueNotBetween(value);
      break;
      case "in":
        return this.#valueInArray(value);
      break;
      case "nin":
        return this.#valueNotInArray(value);
      break;
      case "all":
        return this.#allInArray(value);
      break;
      case "any":
        return this.#anyInArray(value);
      break;
      case "contain":
        return this.#containInArray(value);
      break;
      case "contained":
        return this.#containedInArray(value);
      break;
      case "overlap":
        return this.#overlapInArray(value);
      break;
      case "like":
        return this.#valueLike(value);
      break;
      case "nlike":
        return this.#valueNotLike(value);
      break;
      case "sw":
        return this.#valueStartsWith(value);
      break;
      case "ew":
        return this.#valueEndsWith(value);
      break;
    }
  }

  // Private method that sets the 'eq' (equal) operator for the current query based on the provided 'value'.
  #equal(value) {
    // If the type of 'value' is not 'string' or 'number', return undefined.
    if (!["string", "number"].includes(typeof value)) return;

    // Set the 'eq' operator for the current query, converting 'value' to a number if it is numeric.
    this.builder[eq] = isNaN(value) ? value : Number(value);
  }

  // Private method that sets the 'ne' (not equal) operator for the current query based on the provided 'value'.
  #notEqual(value) {
    // If the type of 'value' is not 'string' or 'number', return undefined.
    if (!["string", "number"].includes(typeof value)) return;

    // Set the 'ne' operator for the current query, converting 'value' to a number if it is numeric.
    this.builder[ne] = isNaN(value) ? value : Number(value);
  }

  // Private method that sets the 'gt' (greater than) operator for the current query based on the provided 'value'.
  #greaterThan(value) {
    // If 'value' is not numeric, return undefined.
    if (isNaN(value)) return;

    // Set the 'gt' operator for the current query, converting 'value' to a number.
    this.builder[gt] = Number(value);
  }

  // Private method that sets the 'gte' (greater than or equal) operator for the current query based on the provided 'value'.
  #greaterThanEqual(value) {
    // If 'value' is not numeric, return undefined.
    if (isNaN(value)) return;

    // Set the 'gte' operator for the current query, converting 'value' to a number.
    this.builder[gte] = Number(value);
  }

  // Private method that sets the 'lt' (less than) operator for the current query based on the provided 'value'.
  #lessThan(value) {
    // If 'value' is not numeric, return undefined.
    if (isNaN(value)) return;

    // Set the 'lt' operator for the current query, converting 'value' to a number.
    this.builder[lt] = Number(value);
  }

  // Private method that sets the 'lte' (less than or equal) operator for the current query based on the provided 'value'.
  #lessThanEqual(value) {
    // If 'value' is not numeric, return undefined.
    if (isNaN(value)) return;

    // Set the 'lte' operator for the current query, converting 'value' to a number.
    this.builder[lte] = Number(value);
  }

  // Private method that sets the 'between' operator for the current query based on the provided 'value'.
  #valueBetween(value) {
    // Retrieve the array of values for the 'between' operator.
    const betweenValue = this.#getInBetweenValues(value);

    // If 'betweenValue' is falsy, return undefined.
    if (!betweenValue) return;

    // Set the 'between' operator for the current query.
    this.builder[between] = betweenValue;
  }

  // Private method that sets the 'notBetween' operator for the current query based on the provided 'value'.
  #valueNotBetween(value) {
    // Retrieve the array of values for the 'between' operator.
    const betweenValue = this.#getInBetweenValues(value);

    // If 'betweenValue' is falsy, return undefined.
    if (!betweenValue) return;

    // Set the 'notBetween' operator for the current query.
    this.builder[notBetween] = betweenValue;
  }

  // Private method that retrieves an array of values for the 'between' and 'notBetween' operators based on the provided 'value'.
  #getInBetweenValues(value) {
    // Initialize an empty array for storing between values.
    let betweenValues = [];

    // Check if 'value' is an array and assign it to 'betweenValues'.
    if (typeof value === "object" && Array.isArray(value)) betweenValues = value;

    // If 'value' is a string, split it by ',' and assign the resulting array to 'betweenValues'.
    if (typeof value === "string") {
      const arr = value.split(",");

      if (arr.length === 2) betweenValues = arr;
    }

    // If the length of 'betweenValues' is not 2, return undefined.
    if (betweenValues.length !== 2) return;

    // Destructure 'betweenValues' into first and second values.
    const [firstValue, secondValue] = betweenValues;

    // If both values are numeric, return 'betweenValues'; otherwise, return undefined.
    if (!isNaN(firstValue) && !isNaN(secondValue)) return betweenValues;

    return;
  }

  // Private method that sets the 'in' operator for the current query based on the provided 'value'.
  #valueInArray(value) {
    // Retrieve the array of values for the 'in' operator.
    const arrayValue = this.#getArrayValue(value);

    // If 'arrayValue' is falsy, return undefined.
    if (!arrayValue) return;

    // Set the 'in' operator for the current query.
    this.builder[inArray] = arrayValue;
  }

  // Private method that sets the 'notIn' operator for the current query based on the provided 'value'.
  #valueNotInArray(value) {
    // Retrieve the array of values for the 'notIn' operator.
    const arrayValue = this.#getArrayValue(value);

    // If 'arrayValue' is falsy, return undefined.
    if (!arrayValue) return;

    // Set the 'notIn' operator for the current query.
    this.builder[notInArray] = arrayValue;
  }

  // Private method that sets the 'all' operator for the current query based on the provided 'value'.
  #allInArray(value) {
    // Retrieve the array of values for the 'all' operator.
    const arrayValue = this.#getArrayValue(value);

    // If 'arrayValue' is falsy, return undefined.
    if (!arrayValue) return;

    // Set the 'all' operator for the current query.
    this.builder[all] = arrayValue;
  }

  // Private method that sets the 'any' operator for the current query based on the provided 'value'.
  #anyInArray(value) {
    // Retrieve the array of values for the 'any' operator.
    const arrayValue = this.#getArrayValue(value);

    // If 'arrayValue' is falsy, return undefined.
    if (!arrayValue) return;

    // Set the 'any' operator for the current query.
    this.builder[any] = arrayValue;
  }

  // Private method that sets the 'contains' operator for the current query based on the provided 'value'.
  #containInArray(value) {
    // Retrieve the array of values for the 'contain' operator.
    const arrayValue = this.#getArrayValue(value);

    // If 'arrayValue' is falsy, return undefined.
    if (!arrayValue) return;

    // Set the 'contains' operator for the current query.
    this.builder[contains] = arrayValue;
  }

  // Private method that sets the 'contained' operator for the current query based on the provided 'value'.
  #containedInArray(value) {
    // Retrieve the array of values for the 'contained' operator.
    const arrayValue = this.#getArrayValue(value);

    // If 'arrayValue' is falsy, return undefined.
    if (!arrayValue) return;

    // Set the 'contained' operator for the current query.
    this.builder[contained] = arrayValue;
  }

  // Private method that sets the 'overlap' operator for the current query based on the provided 'value'.
  #overlapInArray(value) {
    // Retrieve the array of values for the 'overlap' operator.
    const arrayValue = this.#getArrayValue(value);

    // If 'arrayValue' is falsy, return undefined.
    if (!arrayValue) return;

    // Set the 'overlap' operator for the current query.
    this.builder[overlap] = arrayValue;
  }

  // Private method that retrieves an array of values based on the provided 'value'.
  #getArrayValue(value) {
    // If 'value' is an array, return it directly.
    if (typeof value === "object" && Array.isArray(value)) return value;

    // If 'value' is a string, split it by ',' and return the resulting array.
    if (typeof value === "string") return value.includes(",") ? value.split(",") : [value];

    // If 'value' is an number, wrap it around array and return it.
    if (!isNaN(value)) return [value];

    // If 'value' is neither an array, string nor a number, return undefined.
    return;
  }

  // Private method that sets the 'like' operator for the current query based on the provided 'value'.
  #valueLike(value) {
    // If the type of 'value' is not 'string', return undefined.
    if (!["string"].includes(typeof value)) return;

    // Set the 'like' operator for the current query.
    this.builder[like] = value;
  }

  // Private method that sets the 'notLike' operator for the current query based on the provided 'value'.
  #valueNotLike(value) {
    // If the type of 'value' is not 'string', return undefined.
    if (!["string"].includes(typeof value)) return;

    // Set the 'notLike' operator for the current query.
    this.builder[notLike] = value;
  }

  // Private method that sets the 'startsWith' operator for the current query based on the provided 'value'.
  #valueStartsWith(value) {
    // If the type of 'value' is not 'string', return undefined.
    if (!["string"].includes(typeof value)) return;

    // Set the 'startsWith' operator for the current query.
    this.builder[startsWith] = value;
  }

  // Private method that sets the 'endsWith' operator for the current query based on the provided 'value'.
  #valueEndsWith(value) {
    // If the type of 'value' is not 'string', return undefined.
    if (!["string"].includes(typeof value)) return;

    // Set the 'endsWith' operator for the current query.
    this.builder[endsWith] = value;
  }
}

module.exports = LHS;