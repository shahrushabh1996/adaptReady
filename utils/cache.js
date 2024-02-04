const NodeCache = require('node-cache');
const myCache = new NodeCache({ stdTTL: 0 });

class Cache {
  constructor() {}

  // Sets a key-value pair in the cache with an optional expiry time.
  set(key, value, expiry) {
    // If no expiry is provided, set the value without expiration
    if (!expiry) return myCache.set(key, value);
  
    // If the expiry is provided in seconds, convert it to milliseconds before setting the value
    if (this.#isSecTimestamp(expiry)) return myCache.set(key, value, this.#convertSecTimestamptoMs(expiry));
    
    // If the expiry is provided directly in milliseconds, set the value with the given expiry
    return myCache.set(key, value, expiry);
  }

  get(key) {
    // Retrieves the value associated with the provided 'key' from the cache.
    return myCache.get(key);
  }

  // Calculates the Time To Live (TTL) in seconds based on the provided 'futureTimestamp' and 'currentTimestamp'.
  getTTL(futureTimestamp, currentTimestamp) {
    // If the future timestamp is equal to or earlier than the current timestamp, return 0 indicating no TTL.
    if (futureTimestamp <= currentTimestamp) return 0;
  
    // Calculate the TTL by finding the difference between the future and current timestamps.
    return Math.floor(futureTimestamp - currentTimestamp);
  }

  // Private method that checks if the provided 'timestamp' is in seconds or milliseconds.
  #isSecTimestamp(timestamp) {
    const length = String(timestamp).length;

    // If the length is 10, it is considered a timestamp in seconds.
    if (length === 10) return true; 

    // If the length is 13, it is considered a timestamp in milliseconds.
    else if (length === 13) return false;

    // If the length is neither 10 nor 13, return null.
    return null;
  }

  // Private method that converts a timestamp in seconds to milliseconds.
  #convertSecTimestamptoMs(timestamp) {
    return timestamp * 1000;
  }
}

module.exports = Cache;
