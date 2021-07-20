class Key {
  static XFACT = 8;
  static YFACT = 4;

  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.w = 1;
    this.h = 1;
  }

  toString(format = 'render') {
    if (format === 'json') {
      return JSON.stringify(this);
    }
    const res = [];
    const width = (this.w * Key.XFACT) - 2;
    const height = (this.h * Key.YFACT) - 2;
    res.push('┌' + Array(width + 1).join('─') + '┐');
    for (let i = 0; i < height; i++) {
      res.push('│' + Array(width + 1).join(' ') + '│');
    }
    res.push('└' + Array(width + 1).join('─') + '┘');
    return res.join('\n');
  }

  set(props) {
    Object.keys(props).forEach(key => this[key] = props[key]);
  }
}

module.exports = Key;
