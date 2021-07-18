const _ = require('lodash');
const _diff = require('array-diff')();
const PARSER_RE = /#define LAYOUT(?<name>.*?)\(.*?\)[\s\n\\]+\{[\s\\]+(?<matrix>.*?)\}\n/gms;

const fmti = v => _.isObject(v) ? JSON.stringify(v) : `"${v}"`;
const fmt = arr => arr.map(fmti).join(',');

const iskno = s => ['KC_NO', 'KNO'].includes(s);

class Board {
  static parse(header, config, infoStr) {
    const info = JSON.parse(infoStr);
    let match = PARSER_RE.exec(header);
    const layouts = {};
    do {
      const { name, matrix } = match.groups;
      const parsedMatrix = matrix.trim().replace(/\{(.*?)\}\s*,*\s\\/gm, '$1').split('\n').map(s => s.trim().split(',').map(s => s.trim()).filter(s => !iskno(s)));
      layouts[name.split('').splice(1).join('')] = {
        matrix: parsedMatrix,
      };
    } while ((match = PARSER_RE.exec(header)) !== null);

    return new Board(layouts, config, info);
  }

  constructor(layouts, config, info) {
    this.layouts = layouts;
    this.info = info;
    this.config = this.parseConfig(config);
    this.transform();
  }

  parseConfig(config) {
    const rows = parseInt(/MATRIX_ROWS\s*(\d+)/.exec(config)[1], 10);
    const cols = parseInt(/MATRIX_COLS\s*(\d+)/.exec(config)[1], 10);
    return { rows, cols };
  }

  transform() {
    const { layouts } = this.info;
    _.forEach(layouts, (def, fullName) => {
      const { layout } = def;
      const name = fullName.replace(/^LAYOUT_/, '');
      const rows = [...Array(this.config.rows)].map(e => []);

      let col = 0;
      let row = 0;
      let cx = 0;
      layout.forEach(({ x, y, w, label }) => {
        if (row !== y) {
          row = y;
          col = 0;
          cx = 0;
        };
        const pos = this.getMatrix(name)[row][col];
        const opts = {};
        if (w) {
          opts.w = w;
        }
        if (x > cx) {
          opts.x = x - cx;
        }

        if (Object.keys(opts).length) rows[row].push(opts);

        rows[row].push(`${parseInt(pos.charAt(1), 16)},${parseInt(pos.charAt(2), 16)}`);
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
    console.log(' **** BASE', baseRow.map(fmti).join(','));
    let firstDiff = -1;
    _.forEach(this.layouts, (def, name) => {
      if (name === baseLayoutName) return;
      const thisRow = this.getVia(name)[row];
      console.log(' **** ROW', row, '::', name, '::', thisRow.map(fmti).join(','));
      const diffs = this.diff(baseRow, thisRow);
      const thisFirstDiff = diffs.findIndex(d => d[0] !== '=');
      if (thisFirstDiff === -1) return;
      console.log(' **** ROW', row, '::', name, '::', thisFirstDiff, 'diffs', diffs);
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

      console.log('-------------------- row', i);
      console.log(' -> base', baseRow);

      const firstDiff = this.findFirstDiff(i, baseLayoutName);
      console.log(' -> firstDiff', firstDiff);

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
        console.log(' ->', name, 'row', fmt(via[i]));
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

      console.log(' *** options', options);
      options.forEach(([start, end], optionNum) => {
        for (let j = start; j <= end; j++) {
          curRow[j] = _.isObject(curRow[j]) ? curRow[j] : `${curRow[j]}\n\n\n${labels.length},${optionNum}`;
        }
      });
      labels.push(_.flatten([`Option ${labels.length + 1}`, options.map((_, i) => `Value ${i + 1}`)]));

      console.log(' -> curRow', fmt(curRow));
      rows.push(curRow);
    };
    console.log('rows', JSON.stringify(rows));
    console.log('labels', labels);
  }
}

module.exports = Board;
