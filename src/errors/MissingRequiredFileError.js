class MissingRequiredFileError extends Error {
  constructor(file, ...searchPaths) {
    super(`Missing required file ${file}.${searchPaths && ` Expected to find it on ${searchPaths.join(', ')}.`}`);
    this.file = file;
    this.searchPaths = searchPaths;
  }
}

module.exports = MissingRequiredFileError;
