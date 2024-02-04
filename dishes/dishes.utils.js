class Utils {
  constructor() {}

  // Method to capitalize the first letter of a string.
  capitilize(value = '') {
    // Capitalize the first letter and concatenate it with the rest of the string.
    return value.charAt(0).toUpperCase() + value.slice(1)
  }

  // Pre-hook function to process values in an enumeration.
  enumPreHook(value, array) {
    // Check if the value is not a string, if so, return undefined.
    if (typeof value !== 'string' || (typeof value === "object" && Array.isArray(value))) return;

    // If the value contains commas, split it into an array.
    value = value.includes(',') ? value.split(',') : value;

    // If the value is a string, apply the enumPreHookCheck function.
    if (typeof value === 'string') return this.enumPreHookCheck(value, array);

    // If the value is an array, apply the enumPreHookCheck function to each element.
    const result = [];

    for (let val of value) result.push(this.enumPreHookCheck(val, array));

    // Return the result array.
    return result;
  }

  enumPreHookCheck(value, array) {
    // Capitalize the value.
    const capitalizedValue = this.capitilize(value);

    // Check if the capitalized value is included in the array. // If included, return the capitalized value.
    if (array.includes(capitalizedValue)) return this.capitilize(capitalizedValue);

    // Return undefined if the value is not in the array.
    return;
  }
}

module.exports = Utils;