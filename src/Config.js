class Config {
  constructor(config) {
    this.rows = parseInt(/^\s*#define\s+MATRIX_ROWS\s+(\d+)/gm.exec(config)[1], 10);
    this.cols = parseInt(/^\s*#define\s+MATRIX_COLS\s+(\d+)/gm.exec(config)[1], 10);
    this.vendorId = /^\s*#define\s+VENDOR_ID\s+([\dxa-zA-Z]+)/gm.exec(config)[1];
    this.productId = /^\s*#define\s+PRODUCT_ID\s+([\dxa-zA-Z]+)/gm.exec(config)[1];
    this.manufacturer = /^\s*#define\s+MANUFACTURER\s+(.*)(\/\/.*?)?/gm.exec(config)[1];
    this.product = /^\s*#define\s+PRODUCT\s+(.*)(\/\/.*?)?/gm.exec(config)[1];
  }
}

module.exports = Config;
