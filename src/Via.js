const diff = require('array-diff')();
const _ = require('lodash');
const Kle = require('./Kle');
const RowDiffer = require('./RowDiffer');

const { getLayoutName } = require('./Utils');

// 1. Go through all rows
// 2. Classify them rows changes in start, end, both or total
// 3. Go through the changes in start and see what's the max X offset we need
// 4. Iterate through the rows
// 5. For each row, find the max X offset and apply it to the row
//   5.1. When diff is total
//     5.1.1. If last row, add 0.5u to current Y
//     5.1.2. Add base row
//     5.1.3. Add all the different rows
//   5.2. When diff is start
//     5.2.1. Iterate through all the different starts, adding them with a 0.25u offset between them
//   5.3. When diff is start and end
//     5.3.1. Add the base row part that's common between all different rows
//   5.3. When diff is end
//     5.3.1. Iterate through all the different ends, adding them with a 0.25u offset between them

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

  getKeys() {
    const baseLayout = this.layouts[this.mainLayout];
    const altLayouts = Object.values(this.layouts).filter(l => l.name !== this.mainLayout);

    let lastLabelNum = -1;
    return baseLayout.map((row, i) => {
      const differ = new RowDiffer(baseLayout.getRow(i), lastLabelNum + 1);
      const rows = altLayouts.map(l => l.getRow(i));
      const keys = differ.diff(...rows);
      lastLabelNum = _.max(keys.filter(k => k.viaLabel).map(k => k.viaLabel[0])) || -1;
      return keys;
    }).reduce((a, b) => a.concat(b));
  }

  toString() {
    const keys = this.getKeys();
    const lastLabelNum = _.max(keys.filter(k => k.viaLabel).map(k => k.viaLabel[0])) || -1;

    const labels = [...Array(Math.max(lastLabelNum, 1) - 1)].map((_, i) => [`Label ${i + 1}`]);

    return JSON.stringify({
      name: `${this.config.manufacturer} ${this.config.product}`,
      productId: this.config.productId,
      vendorId: this.config.vendorId,
      ligntining: 'none',
      matrix: { rows: this.config.rows, cols: this.config.cols },
      layouts: {
        labels: labels,
        keymap: new Kle(keys).asJson('matrix'),
      },
    }, null, 2);
  }

  toPermalink() {
    return new Kle(this.getKeys()).toPermalink('matrix');
  }
}

module.exports = Via;
