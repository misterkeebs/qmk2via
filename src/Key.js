const _ = require('lodash');
const hash = require('object-hash');

class Key {
  static XFACT = 8;
  static YFACT = 4;

  static build(opts) {
    const key = new Key(opts.row, opts.col);
    _.forEach(opts, (v, k) => key[k] = v);
    return key;
  }

  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.w = 1;
    this.h = 1;
    this.c = '#cccccc';
  }

  toString(format = 'render') {
    if (format === 'json') {
      const { row, col, h, w, x, y } = this;
      return JSON.stringify({ row, col, h, w, x, y });
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

  toJSON() {
    return {
      row: this.row,
      col: this.col,
      h: this.h,
      w: this.w,
      x: this.x,
      y: this.y,
      c: this.c,
    };
  }

  hashCode() {
    const json = this.toJSON();
    delete json.c;
    return hash(json);
  }

  set(props) {
    Object.keys(props).forEach(key => this[key] = props[key]);
  }
}

module.exports = Key;
