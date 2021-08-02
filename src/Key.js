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

  get coord() {
    return `${this.row},${this.col}`;
  }

  toString(format = 'render') {
    if (format === 'json') {
      const { row, col, h, w, x, y } = this;
      return JSON.stringify({ row, col, h, w, x, y });
    }
    const res = [];
    const width = (this.w * Key.XFACT) - 2;
    const height = (this.h * Key.YFACT) - 2;

    res.push('┌' + '─'.repeat(width) + '┐');
    for (let i = 0; i < height; i++) {
      res.push('│' + ' '.repeat(width) + '│');
    }
    res.push('└' + '─'.repeat(width) + '┘');

    if (this.w == 1.25 && this.h === 2) {
      const lw = 1.5 * Key.XFACT;
      const sw = 1.25 * Key.XFACT;
      res[0] = '┌' + '─'.repeat(lw - 2) + '┐';
      let i;
      for (i = 1; i < height / 2; i++) {
        res[i] = '│' + ' '.repeat(lw - 2) + '│';
      }
      res[i] = '└' + '─' + '┐' + ' '.repeat(sw - 2) + '│';
      for (let j = i + 1; j < res.length; j++) {
        res[j] = ' '.repeat(0.25 * Key.XFACT) + res[j];
      }
    }
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

  toMatrixJSON() {
    return {
      row: this.row,
      col: this.col,
      h: this.h,
      w: this.w,
      label: this.label,
    };
  }

  hashCode() {
    // return hash(this.toMatrixJSON());
    return JSON.stringify(this.toMatrixJSON());
  }

  set(props) {
    Object.keys(props).forEach(key => this[key] = props[key]);
  }
}

module.exports = Key;
