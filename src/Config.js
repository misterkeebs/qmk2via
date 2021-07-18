class Config {
  constructor(config) {
    this.rows = parseInt(/MATRIX_ROWS\s+(\d+)/.exec(config)[1], 10);
    this.cols = parseInt(/MATRIX_COLS\s+(\d+)/.exec(config)[1], 10);
    this.vendorId = /VENDOR_ID\s+([\dxa-zA-Z]+)/.exec(config)[1];
    this.productId = /PRODUCT_ID\s+([\dxa-zA-Z]+)/.exec(config)[1];
    this.manufacturer = /MANUFACTURER\s+(.*)(\/\/.*?)?/.exec(config)[1];
    this.product = /PRODUCT\s+(.*)(\/\/.*?)?/.exec(config)[1];
  }
}

module.exports = Config;
