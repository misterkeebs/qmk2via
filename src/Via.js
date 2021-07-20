const diff = require('array-diff')();
const _ = require('lodash');
const Kle = require('./Kle');

const { getLayoutName } = require('./Utils');

class Via {
  constructor(board, mainLayout) {
    this.board = board;
    this.mainLayout = getLayoutName(mainLayout || board.info.mainLayout);
    this.layouts = board.layouts;
    this.config = board.config;
  }

  getLayoutRow(name, row) {
    const layout = this.layouts[name];
    if (layout) return layout.getRow(row);
  }

  diff(row1, row2) {
    const json = [row1, row2].map(r => r.map(k => k.toString('json')));
    return diff(json[0], json[1]);
  }

  toString() {
    const layoutNames = Object.keys(this.layouts);
    const baseLayout = this.layouts[this.mainLayout];
    const keys = [];
    console.log('baseLayout', this.mainLayout);
    const diffs = [];

    const pushKeys = toAdd => {
      toAdd.forEach(key => {
        const modKey = _.clone(key);
        modKey.y += cy;
        keys.push(modKey);
      });
    };

    let cy = 0;
    for (let i = 0; i < baseLayout.rows; i++) {
      const baseRow = baseLayout.getRow(i);
      const center = baseRow.length / 2;

      // calculate diffs
      const rowDiffs = _(layoutNames)
        .map(name => {
          if (name === this.mainLayout) return;
          const row = this.getLayoutRow(name, i);
          const _diff = this.diff(baseRow, row);
          const first = _diff.findIndex(d => d[0] !== '=');
          const total = _diff.filter(d => d[0] !== '=').length;
          const type = _diff.filter(d => d[0] === '=').length < 1
            ? 'total'
            : (first > center) ? 'right' : 'left';
          return {
            type,
            row,
            diff: _diff,
            first,
            total,
            summary: _diff.map(r => r[0]).join(''),
          };
        })
        .filter(r => r && r.summary.replace(/=/g, '').length > 0)
        .uniq()
        .value();

      // strategy left => add diffs first, then add base
      // strategy right => add base first, then add diffs
      // strategy total => add all rows

      const types = _(rowDiffs).map(r => r.type).uniq().value();
      const first = _.min(rowDiffs.map(r => r.first));
      if (types.includes('total')) {
        pushKeys(baseRow);
      }
      if (types.includes('right')) {
        pushKeys(baseRow.slice(0, first + 1));
      }
      if (types.includes('left')) {
        pushKeys(baseRow.slice(first + 1));
      }
      rowDiffs.forEach(diff => {
        console.log(i, types, 'baselen rowlen first total',
          baseRow.length, diff.row.length, diff.first, diff.total);
        if (types.includes('total')) {
          cy += 1;
          pushKeys(diff.row);
        }
        if (types.includes('right')) {
          //   baseRow.slice(0, diff.first).map(key => finalRow.push(key));
          //   baseRow.slice(diff.first, baseRow.length).map(key => {
          //     const modKey = _.clone(key);
          //     modKey.label = `${modKey.label}\n\nZ,Z`;
          //     finalRow.push(modKey);
          //   });
          const lastKey = baseRow[baseRow.length - 1];
          let cx = lastKey.x + lastKey.w + 0.5;
          console.log(i, 'lastKey', lastKey, cx);
          const toAdd = diff.row.slice(diff.first, diff.row.length).map(key => {
            const modKey = _.clone(key);
            modKey.y = cy;
            modKey.x = cx;
            cx += modKey.w;
            return modKey;
          });
          pushKeys(toAdd);
        }
        if (types.includes('left')) {
        }
      });
      // if (types.includes('left')) {
      //   const first = _.min(rowDiffs.map(r => r.first));
      //   pushKeys(baseRow.slice(first + 1));
      // }

      diffs.push(rowDiffs);
    }
    // console.log('keys', keys);
    // console.log('diffs', diffs);
    console.log('Kle.toKle(keys)', new Kle(keys).toKle());
  }
}

module.exports = Via;
