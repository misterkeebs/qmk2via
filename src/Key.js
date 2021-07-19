const WFACT = 8;
const HFACT = 4;

class Key {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.w = 1;
    this.h = 1;
  }

  toString() {
    const res = [];
    const width = (this.w * WFACT) - 2;
    const height = (this.h * HFACT) - 2;
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
