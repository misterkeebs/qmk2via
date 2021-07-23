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
        opts.x += 1;
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

  toPermalink(label) {
    const kle = this.asJson(label);
    const permalink = [];
    kle.forEach(row => {
      const trRow = row.map(key => {
        if (_.isString(key)) {
          const k = key
            .replace(/\//g, '//')
            .replace(/@/g, '/@')
            .replace(/_/g, '/_')
            .replace(/=/g, '/=')
            .replace(/:/g, '/:')
            .replace(/;/g, '/;')
            .replace(/%/g, '%25')
            .replace(/"/g, '%22')
            .replace(/\^/g, '%5E')
            .replace(/\{/g, '%7B')
            .replace(/\}/g, '%7D')
            .replace(/\[/g, '%5B')
            .replace(/\]/g, '%5D')
            .replace(/\\/g, '%5C')
            .replace(/\|/g, '%7C')
            .replace(/\</g, '%3C')
            .replace(/\>/g, '%3E')
            .replace(/`/g, '%60')
            .replace(/\n/g, '%0A')
            .replace(/&/g, '/&');
          return `=${k}`;
        } if (_.isObject(key)) {
          const res = _.map(key, (v, k) => {
            if (k === 'c') {
              return `${k}=${v}`;
            } else {
              return `${k}:${v}`;
            }
          });
          res[0] = `_${res[0]}`;
          res[res.length - 1] = `${res[res.length - 1]};`;
          return res.join('&');
        }
      });
      // trRow[0] = `@${trRow[0]}`;
      permalink.push(trRow);
    });
    const uri = permalink.map(p => _.flatten(p).join('&')).join(';&@');
    return `http://www.keyboard-layout-editor.com##@@${uri}`;
  }
}

module.exports = Kle;
