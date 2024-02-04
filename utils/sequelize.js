class Sequelize {
  constructor() {}
  
  plainRows(rows = []) {
    // Extracts the plain data values from an array of Sequelize model 'rows'.
    return rows.map(row => row.dataValues);
  }

  plainRow(row = {}) {
    // Extracts the plain data values from a Sequelize model 'row', or returns an empty object if 'row' is null or undefined.
    const { dataValues } = row || {};
    return dataValues;
  }

  isUniqueKeyViolation(error, key) {
    // Checks if a given Sequelize error indicates a unique key violation for the specified 'key'.
    return error.errors.find(err => err.type === 'unique violation' && err.path === key) !== undefined;
  }
}

module.exports = Sequelize;
