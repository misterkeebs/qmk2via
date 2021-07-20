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
    const mx = _.max(this.keys.map(k => k.x));
    const my = _.max(this.keys.map(k => k.y));
    const rows = [...Array(Key.YFACT * (my + 1))]
      .map(n => [...Array(Key.XFACT * (mx + 1))].map(m => ' '));
    this.keys.forEach(key => {
      const skey = key.toString().split('\n');
      const iy = key.y * Key.YFACT;
      const ix = key.x * Key.XFACT;
      skey.forEach((line, y) => {
        for (let x = 0; x < line.length; x++) {
          rows[iy + y][ix + x] = line.charAt(x);
        }
      });
      const ilx = ix + 2;
      const ily = iy + 1;
      key.label.split('').forEach((c, x) => {
        if (x < key.w * Key.XFACT) {
          rows[ily][ilx + x] = c;
        }
      });
    });
    return rows.map(row => row.join('')).join('\n');
  }

  oldToString() {
    const rows = [];
    let crow = [];
    let cy = 0;
    this.keys.forEach(key => {
      if (key.y > cy) {
        rows.push(_.clone(crow));
        cy = key.y;
        crow = [];
      }
      crow.push(key.toString().split('\n'));
    });
    rows.push(crow);
    const size = rows[0][0].length;
    const frows = [];
    rows.forEach(row => {
      const irow = [...Array(size)].map(_ => []);
      row.forEach(char => {
        char.forEach((line, i) => {
          irow[i].push(line);
        });
      });
      frows.push(irow);
    });
    const str = frows.map(row => row.map(line => line.join('')).join('\n')).join('\n');
    return str;
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
