const { names, codes } = require('../config/states')

class State {
  constructor() {}

  // Retrieves the state information based on the provided 'value' and optional 'key'.
  getState(value, key = 'state') {
    // If 'value' is falsy, return undefined.
    if (!value) return;

    // If 'value' is a numeric string, convert it to a number.
    if (typeof value === 'string' && !isNaN(value)) value = Number(value);
    
    // Determine the type of 'value' and fetch the state accordingly.
    switch (typeof value) {
      case 'number':
        return this.#getNameFromCode(value);
      break;
      case 'string':
        return this.#getCodeFromName(value);
      break;
      case 'object':
        // If 'value' is an array, fetch state information using array elements.
        return Array.isArray(value) ? this.#geFromArray(value, key) : this.#getFromObject(value, key);
      break;
    }
  }

  // Private method that retrieves the name corresponding to the provided 'code' from a predefined 'names' collection.
  #getNameFromCode(code) {
    // If 'code' is not a number, return undefined.
    if (isNaN(code)) return;

    // Return the name associated with the 'code'.
    return names[code];
  }

  // Private method that retrieves the code corresponding to the provided 'name' from a predefined 'codes' collection.
  #getCodeFromName(name) {
    // If 'name' is not a string, return undefined.
    if (typeof name !== 'string') return;

    // Return the code associated with the 'name'.
    return codes[name];
  }

  // Private method that retrieves state information for each element in an array of 'states' using the provided 'key'.
  #geFromArray(states, key = 'state') {
    return states.map((state) => this.getState(state, key));
  }

  // Private method that retrieves state information from a 'stateObj' using the provided 'key'.
  #getFromObject(stateObj, key = 'state') {
    stateObj[key] = this.getState(stateObj[key], key)

    return stateObj;
  }
}

module.exports = State;