const _ = require('lodash');

class Kle {
  constructor(keys) {
    this.keys = _.sortBy(keys, ['y', 'x']);
  }

  asJson(label) {
    const rows = [];
    const crow = [];
    let cc = null;
    let cx = 0;
    let cy = 0;
    let opts = {};

    _.sortBy(this.keys, ['y', 'x']).forEach(key => {
      if (key.y > cy) {
        rows.push(_.clone(crow));
        crow.length = 0;
        cx = 0;
        cy += 1;
        if (key.y > cy) {
          opts.y = key.y - cy;
          cy = key.y;
        }
      }
      if (key.w > 1) opts.w = key.w;
      if (key.h > 1) opts.h = key.h;
      if (key.x !== cx) opts.x = key.x - cx;
      if (key.c !== cc) {
        opts.c = key.c;
        cc = key.c;
      }
      if (key.h === 2 && key.w === 1.25) {
        opts.w2 = 1.5;
        opts.h2 = 1;
        opts.x2 = -0.25;
      }

      if (opts.x) {
        cx += opts.x;
      }
      cx += key.w;

      if (Object.keys(opts).length) {
        crow.push(opts);
        opts = {};
      }

      let str = key.label;
      if (label === 'matrix') {
        str = `${key.row},${key.col}`;
        const parts = key.label.split('\n\n\n');
        if (parts.length > 0 && parts[1]) {
          str = `${str}\n\n\n${parts[1]}`;
        }
      }
      crow.push(str);
    });
    rows.push(crow);
    return rows;
  }

  toKle(label) {
    return JSON.stringify(this.asJson(label))
      .replace(/\],/g, '],\n')
      .replace(/^\[/g, '')
      .replace(/\]$/g, '');
  }
}

module.exports = Kle;
