class Key {
  constructor(row, col) {
    this.row = row;
    this.col = col;
  }

  set(props) {
    Object.keys(props).forEach(key => this[key] = props[key]);
  }
}

module.exports = Key;
