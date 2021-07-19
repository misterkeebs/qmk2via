const _ = require('lodash');
const _diff = require('array-diff')();

const Config = require('./Config');

const PARSER_RE = /#define LAYOUT(?<name>[^\(]*?)?\(.*?\)[\s\n\\]+\{[\s\\]+(?<matrix>.*?)\}\n/gms;
const fmti = v => _.isObject(v) ? JSON.stringify(v) : `"${v}"`;
const fmt = arr => arr.map(fmti).join(',');
const iskno = s => ['KC_NO', 'KNO', '____'].includes(s);

class Board {
  constructor(header, config, info, debug) {
    this.layouts = {};
    this.debug = debug;
    this.header = header;
    this.info = this.parseInfo(info);
    this.config = new Config(config);
    this.transform();
  }

  log(...s) {
    if (this.debug) console.log(...s);
  }

  parseInfo(infoStr) {
    const info = JSON.parse(infoStr);
    let match = PARSER_RE.exec(this.header);
    do {
      const { name, matrix } = match.groups;
      const parsedMatrix = matrix.trim().replace(/\{(.*?)\}\s*,*\s\\/gm, '$1').split('\n').map(s => s.trim().split(',').map(s => s.trim()).filter(s => !iskno(s)));
      this.layouts[(name || '_main').split('').splice(1).join('')] = {
        matrix: parsedMatrix,
      };
    } while ((match = PARSER_RE.exec(this.header)) !== null);
    this.log('Layouts', this.layouts);
    return info;
  }

  transform() {
    const { layouts } = this.info;
    _.forEach(layouts, (def, fullName) => {
      const { layout } = def;
      const name = fullName === 'LAYOUT' ? 'main' : fullName.replace(/^LAYOUT_/, '');
      this.log('Processing', name);
      const rows = [...Array(this.config.rows)].map(e => []);

      let col = 0;
      let row = 0;
      let cx = 0;
      layout.forEach(({ x, y, w, h, label }) => {
        if (row !== y) {
          row = y;
          col = 0;
          cx = 0;
        };
        const pos = this.getMatrix(name)[row][col];
        if (pos) {
          const opts = {};
          if (w) opts.w = w;
          if (x > cx) opts.x = x - cx;
          if (h) opts.h = h;

          if (Object.keys(opts).length) rows[row].push(opts);

          if (pos.length === 3) {
            rows[row].push(`${parseInt(pos.charAt(1))},${parseInt(pos.charAt(2), 16)}`);
          } else if (pos.length === 4) {
            rows[row].push(`${parseInt(pos.charAt(1), 16)},${parseInt(pos.slice(2))}`);
          } else {
            throw new Error(`Unknown position format ${pos}`);
          }
        }
        col++;
        cx += (w || 1) + x - cx;
      });
      this.layouts[name].via = rows;
    });

    this.layouts = _.pickBy(this.layouts, def => !!def.via);
  }

  getLayout(name) {
    return this.layouts[name];
  }

  getMatrix(name) {
    return this.getLayout(name).matrix;
  }

  getVia(name) {
    return this.getLayout(name).via;
  }

  diff(row1, row2) {
    return _diff(row1.map(fmti), row2.map(fmti));
  }

  findFirstDiff(row, baseLayoutName) {
    const baseRow = this.getVia(baseLayoutName)[row];
    this.log(' **** BASE', baseRow.map(fmti).join(','));
    let firstDiff = -1;
    _.forEach(this.layouts, (def, name) => {
      if (name === baseLayoutName) return;
      const thisRow = this.getVia(name)[row];
      this.log(' **** ROW', row, '::', name, '::', thisRow.map(fmti).join(','));
      const diffs = this.diff(baseRow, thisRow);
      const thisFirstDiff = diffs.findIndex(d => d[0] !== '=');
      if (thisFirstDiff === -1) return;
      this.log(' **** ROW', row, '::', name, '::', thisFirstDiff, 'diffs', diffs);
      firstDiff = firstDiff === -1 ? thisFirstDiff : Math.min(firstDiff, thisFirstDiff);
    });
    return firstDiff;
  }

  toVia(baseLayoutName = Object.keys(this.layouts)[0]) {
    const labels = [];
    const rows = [];
    const base = this.getVia(baseLayoutName);
    for (let i = 0; i < base.length; i++) {
      const options = [];
      const baseRow = fmt(base[i]);

      this.log('-------------------- row', i);
      this.log(' -> base', baseRow);

      const firstDiff = this.findFirstDiff(i, baseLayoutName);
      this.log(' -> firstDiff', firstDiff);

      // no differences
      if (firstDiff === -1) {
        rows.push(base[i]);
        continue;
      }

      // whole line is different
      if (firstDiff === 0) {
        options.push(rows.length);
        rows.push(base[i]);
        let first = true;

        const toAdd = [];
        _.forEach(this.layouts, (def, name) => {
          const { via } = def;

          if (name === baseLayoutName) return;
          if (fmt(via[i]) === baseRow) return;

          const row = via[i];
          if (!toAdd.map(fmt).includes(fmt(row))) {
            toAdd.push(row);
          }
        });

        if (toAdd.length > 0) {
          if (_.isObject(toAdd[0][0])) {
            toAdd[0][0].y = 0.25;
          } else {
            toAdd[0].unshift({ y: 0.25 });
          }
          toAdd.forEach(r => {
            options.push(rows.length);
            rows.push(r);
          });
        }

        options.forEach((i, j) => {
          rows[i] = rows[i].map(item => _.isObject(item) ? item : `${item}\n\n\n${labels.length},${j}`);
        });
        labels.push(_.flatten([`Option ${labels.length + 1}`, options.map((_, i) => `Value ${i + 1}`)]));

        continue;
      }

      // add all the items up until the first diff from the base row
      const curRow = base[i].slice(0, firstDiff);

      // add all the differences, staring from the first diff
      const toAdd = [];
      _.forEach(this.layouts, (def, name) => {
        const { via } = def;
        this.log(' ->', name, 'row', fmt(via[i]));
        const arr = [];
        for (let j = firstDiff; j < via[i].length; j++) {
          arr.push(via[i][j]);
        }
        if (!toAdd.map(fmt).includes(fmt(arr))) {
          toAdd.push(arr);
        }
      });

      toAdd.forEach((arr, i) => {
        if (i > 0) curRow.push({ x: 0.5 });
        const start = curRow.length - 1;
        arr.forEach(it => curRow.push(it));
        const end = curRow.length - 1;
        options.push([start, end]);
      });

      this.log(' *** options', options);
      options.forEach(([start, end], optionNum) => {
        for (let j = start; j <= end; j++) {
          curRow[j] = _.isObject(curRow[j]) ? curRow[j] : `${curRow[j]}\n\n\n${labels.length},${optionNum}`;
        }
      });
      labels.push(_.flatten([`Option ${labels.length + 1}`, options.map((_, i) => `Value ${i + 1}`)]));

      this.log(' -> curRow', fmt(curRow));
      rows.push(curRow);
    };
    this.log('rows', JSON.stringify(rows));
    this.log('labels', labels);
    return JSON.stringify({
      name: `${this.config.manufacturer} ${this.config.product}`,
      productId: this.config.productId,
      vendorId: this.config.vendorId,
      ligntining: 'none',
      matrix: { rows: this.config.rows, cols: this.config.cols },
      layouts: {
        labels: labels,
        keymap: rows,
      },
    }, null, 2);
  }
}

module.exports = Board;
