class Config {
  constructor(config, name) {
    this.rows = parseInt(/^\s*#define\s+MATRIX_ROWS\s+(\d+)/gm.exec(config)[1], 10);
    this.cols = parseInt(/^\s*#define\s+MATRIX_COLS\s+(\d+)/gm.exec(config)[1], 10);
    this.vendorId = /^\s*#define\s+VENDOR_ID\s+([\dxa-zA-Z]+)/gm.exec(config)[1];
    this.productId = /^\s*#define\s+PRODUCT_ID\s+([\dxa-zA-Z]+)/gm.exec(config)[1];
    this.manufacturer = /^\s*#define\s+MANUFACTURER\s+(.*)(\/\/.*?)?/gm.exec(config)[1];

    const parts = /^\s*#define\s+PRODUCT\s+(.*)(\/\/.*?)?/gm.exec(config);
    this.product = (parts && parts.length && parts.length > 1) ? parts[1] : name;
  }
}

module.exports = Config;
