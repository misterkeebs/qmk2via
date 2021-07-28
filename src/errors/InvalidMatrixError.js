class InvalidMatrixError extends Error {
  constructor(layoutName, key) {
    super(`The matrix for layout LAYOUT${layoutName} has a missing definition for key ${key}.`);
    this.layoutName = layoutName;
    this.key = key;
  }
}

module.exports = InvalidMatrixError;
