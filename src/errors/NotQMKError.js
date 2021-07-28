class NotQMKError extends Error {
  constructor(path) {
    super(`Directory doesn't seem to have files for a valid QMK keyboard.`);
    this.details = `Selected folder was: ${path}`;
  }
}

module.exports = NotQMKError;
