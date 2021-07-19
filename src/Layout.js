const _ = require('lodash');
const Key = require('./Key');

class Layout {
  constructor(name, rows, cols, matrix, layout) {
    this.name = name;
    this.rows = rows;
    this.cols = cols;
    this.matrix = matrix;
    this.keys = this.matrix.map(coord => new Key(coord[0], coord[1]));
    this.layout = layout;
    this.process();
  }

  keyAt(row, col) {
    const pos = this.cols * row + col + 1;
    return this.keys[pos];
  }

  getRow(n) {
    return _.sortBy(this.keys.filter(key => key.row === n), 'x');
  }

  toString() {

  }

  process() {
    const yValues = _(this.layout).map(l => l.y).uniq().sort().value();
    const rows = [...Array(yValues.length)].map(e => []);
    const layout = _.sortBy(this.layout, ['y', 'x']);

    let cy = 0;
    let crow = 0;
    let ccol = 0;
    layout.forEach((key, i) => {
      if (key.y > cy) {
        cy = key.y;
        ccol = 0;
        crow = yValues[cy];
      }
      const matrixKey = this.keys[i];
      matrixKey.set({
        x: key.x,
        y: key.y,
        w: key.w || 1,
        h: key.h || 1,
        label: key.label || '',
      });
      ccol++;
    });
  }

  toKle(label) {
    const rows = [];
    const crow = [];
    let cx = 0;
    let cy = 0;
    let opts;

    _.sortBy(this.keys, ['y', 'x']).forEach(key => {
      opts = {};
      if (key.y > cy) {
        rows.push(_.clone(crow));
        crow.length = 0;
        cy += 1;
        if (key.y > cy) {
          opts.y = key.y - cy;
          cy = key.y;
        }
      }
      if (key.w > 1) opts.w = key.w;
      if (key.h > 1) opts.h = key.h;
      if (Object.keys(opts).length) {
        crow.push(opts);
        opts = {};
      }
      crow.push(label === 'matrix' ? `${key.row},${key.col}` : key.label);
    });
    rows.push(crow);
    return JSON.stringify(rows).replace(/^\[/g, '').replace(/\]$/g, '');
  }
}

module.exports = Layout;
