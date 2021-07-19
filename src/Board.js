const _ = require('lodash');
const _diff = require('array-diff')();

const Config = require('./Config');
const Header = require('./Header');
const Info = require('./Info');
const Layout = require('./Layout');
const { getLayoutName } = require('./Utils');

const PARSER_RE = /#define LAYOUT(?<name>[^\(]*?)?\(.*?\)[\s\n\\]+\{[\s\\]+(?<matrix>.*?)\}\n*$/gms;
const fmti = v => _.isObject(v) ? JSON.stringify(v) : `"${v}"`;
const fmt = arr => arr.map(fmti).join(',');
const iskno = s => ['KC_NO', 'KNO', '____'].includes(s);

class Board {
  constructor(header, config, info, debug) {
    this.layouts = {};
    this.debug = debug;
    this.header = new Header(header);
    this.config = new Config(config);
    this.info = new Info(info);
    this.layouts = this.makeLayouts();
  }

  log(...s) {
    if (this.debug) console.log(...s);
  }

  makeLayouts() {
    return Object.keys(this.info.layouts).reduce((obj, layoutName) => {
      const name = getLayoutName(layoutName);
      const layout = this.info.layouts[layoutName].layout;
      const { rows, cols } = this.config;
      const matrix = this.header.matrices[name];
      obj[name] = new Layout(name, rows, cols, matrix, layout);
      return obj;
    }, {});
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
