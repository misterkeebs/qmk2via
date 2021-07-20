const _ = require('lodash');

class Kle {
  constructor(keys) {
    this.keys = _.sortBy(keys, ['y', 'x']);
  }

  asJson(label) {
    const rows = [];
    const crow = [];
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

      if (opts.x) {
        cx += opts.x;
      }
      cx += key.w;

      if (Object.keys(opts).length) {
        crow.push(opts);
        opts = {};
      }
      crow.push(label === 'matrix' ? `${key.row},${key.col}` : key.label);
    });
    rows.push(crow);
    return rows;
  }

  toKle(label) {
    return JSON.stringify(this.asJson(this.keys, label))
      .replace(/\],/g, '],\n')
      .replace(/^\[/g, '')
      .replace(/\]$/g, '');
  }
}

module.exports = Kle;
