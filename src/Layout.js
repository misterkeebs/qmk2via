const Canvas = require('canvas');
const fs = require('fs');
const _ = require('lodash');

const Key = require('./Key');
const Kle = require('./Kle');

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

  get rowCount() {
    return this.yValues.length;
  }

  getRow(n) {
    return _.sortBy(this.keys.filter(key => key.y === this.yValues[n]), 'x');
  }

  forEachRow(fn) {
    for (let i = 0; i < this.rowCount; i++) {
      fn(this.getRow(i), i);
    }
  }

  map(fn) {
    const res = [];
    this.forEachRow((row, i) => res.push(fn(row, i)));
    return res;
  }

  [Symbol.iterator]() {
    // Use a new index for each iterator. This makes multiple
    // iterations over the iterable safe for non-trivial cases,
    // such as use of break or nested looping over the same iterable.
    let index = 0;

    return {
      next: () => {
        if (index < this.rowCount) {
          return { value: this.getRow(index++), done: false }
        } else {
          return { done: true }
        }
      }
    }
  }

  toString() {
    const mx = _.max(this.keys.map(k => k.x));
    const my = _.max(this.keys.map(k => k.y));
    const rows = [...Array(Key.YFACT * (my + 1))]
      .map(n => [...Array(Key.XFACT * (mx + 1))].map(m => ' '));
    this.keys.forEach(key => {
      const skey = key.toString().split('\n');
      const dx = key.w === 1.25 && key.h === 2 ? -0.25 : 0;
      const iy = key.y * Key.YFACT;
      const ix = (key.x + dx) * Key.XFACT;
      skey.forEach((line, y) => {
        for (let x = 0; x < line.length; x++) {
          rows[iy + y][ix + x] = line.charAt(x);
        }
      });
      const ilx = ix + 2;
      const ily = iy + 1;
      key.label.split('').forEach((c, x) => {
        if (x < (key.w * Key.XFACT) - 3) {
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
    this.yValues = _(this.layout).map(l => l.y).uniq().sort().value();
    const rows = [...Array(this.yValues.length)].map(e => []);
    const layout = _.sortBy(this.layout, ['y', 'x']);

    let cy = 0;
    let crow = 0;
    let ccol = 0;
    layout.forEach((key, i) => {
      if (key.y > cy) {
        cy = key.y;
        ccol = 0;
        crow = this.yValues[cy];
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
    return new Kle(this.keys).toKle(label);
  }

  toPermalink(label) {
    return new Kle(this.keys).toPermalink();
  }

  toPNG(name, label) {
    return new Promise((resolve, reject) => {
      const canvas = this.toCanvas(label);
      const out = fs.createWriteStream(name);
      const stream = canvas.createPNGStream();

      out.on('finish', resolve);
      out.on('error', reject);

      stream.pipe(out);
    });
  }

  toCanvas(label) {
    function drawRect(ctx, x, y, w, h, radius) {
      const r = x + w;
      const b = y + h;

      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(r - radius, y);
      ctx.quadraticCurveTo(r, y, r, y + radius);
      ctx.lineTo(r, y + h - radius);
      ctx.quadraticCurveTo(r, b, r - radius, b);
      ctx.lineTo(x + radius, b);
      ctx.quadraticCurveTo(x, b, x, b - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
    }

    function strokeRoundRect(ctx, x, y, w, h, radius) {
      drawRect(ctx, x, y, w, h, radius);
      ctx.stroke();
    }

    function fillRoundRect(ctx, x, y, w, h, radius) {
      drawRect(ctx, x, y, w, h, radius);
      ctx.fill();
    }

    const KW = 50;
    const KH = 50;

    const maxx = _.max(this.keys.map(k => k.x + k.w));
    const maxy = _.max(this.keys.map(k => k.y + k.h));
    const canvas = Canvas.createCanvas(maxx * KW, maxy * KH);
    const ctx = canvas.getContext('2d');

    this.keys.forEach(key => {
      const x0 = key.x * KW + 1;
      const x1 = (key.w * KW) - 1;
      const y0 = key.y * KH + 1;
      const y1 = (key.h * KH) - 1;

      ctx.strokeStyle = '#000';
      strokeRoundRect(ctx, x0, y0, x1, y1, 3);

      ctx.fillStyle = '#ddd';
      ctx.lineWidth = 5;
      fillRoundRect(ctx, x0 + 1, y0 + 1, x1 - 2, y1 - 2, 3);

      const d = 3;
      const d2 = parseInt(d + (d / 2)) + 1;
      ctx.fillStyle = '#fff';
      fillRoundRect(ctx, x0 + d2, y0 + d2 - 1, x1 - (d2 * 2), y1 - (d * 4) + 1, 3);
      ctx.strokeStyle = '#aaa';
      ctx.lineWidth = 1;
      strokeRoundRect(ctx, x0 + d2, y0 + d2 - 1, x1 - (d2 * 2), y1 - (d * 4) + 1, 3);


      const d3 = d2 + 4;
      ctx.fillStyle = '#000';
      ctx.font = '12px "Helvetica","Arial",sans-serif';
      ctx.textAlign = 'top';
      ctx.fillText(key.label, x0 + d2 + 4, y0 + 12 + d2 + 2);
    });

    return canvas;
  }
}

module.exports = Layout;
