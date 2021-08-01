const diff = require('array-diff')();
const _ = require('lodash');
const Kle = require('./Kle');
const RowDiffer = require('./RowDiffer');

const { getLayoutName } = require('./Utils');

class Via {
  constructor(board, mainLayout) {
    this.board = board;
    this.mainLayout = getLayoutName(mainLayout || board.info.mainLayout);
    this.layouts = board.layouts;
    this.config = board.config;
    this.keys = this.initKeys();
    this.labels = this.initLabels();
  }

  getLayoutRow(name, row) {
    const layout = this.layouts[name];
    if (layout) return layout.getRow(row);
  }

  initKeys() {
    const baseLayout = this.layouts[this.mainLayout];
    const altLayouts = Object.values(this.layouts).filter(l => l.name !== this.mainLayout);

    let lastLabelNum = -1;
    return baseLayout.map((row, i) => {
      const differ = new RowDiffer(baseLayout.getRow(i), lastLabelNum + 1);
      const rows = altLayouts.map(l => l.getRow(i));
      const keys = differ.diff(...rows);
      const max = _.max(keys.filter(k => k.viaLabel).map(k => k.viaLabel[0]));
      lastLabelNum = _.isUndefined(max) ? lastLabelNum : max;
      return keys;
    }).reduce((a, b) => a.concat(b));
  }

  getKeys() {
    return this.keys;
  }

  initLabels() {
    const keys = this.getKeys();
    const lastLabelNum = _.max(keys.filter(k => k.viaLabel).map(k => k.viaLabel[0]));

    const labels = [];
    for (let i = 0; i <= lastLabelNum; i++) {
      const labelRow = [];
      labelRow.push(`Label ${i + 1}`);
      const numVariants = _(keys)
        .filter(k => k.viaLabel && k.viaLabel[0] === i)
        .map(k => k.viaLabel[1])
        .max();
      for (let j = 0; j <= numVariants; j++) {
        labelRow.push(`Option ${j + 1}`);
      }

      labels.push(labelRow);
    }

    return labels;
  }

  getLabels() {
    return this.labels;
  }

  toString() {
    const keys = this.getKeys();
    const labels = this.getLabels();
    const keymap = new Kle(keys).asJson('matrix')
    return JSON.stringify({
      name: `${this.config.manufacturer} ${this.config.product}`,
      productId: this.config.productId,
      vendorId: this.config.vendorId,
      lighting: 'none',
      matrix: { rows: this.config.rows, cols: this.config.cols },
      layouts: { labels, keymap },
    }, null, 2);
  }

  toPermalink() {
    return new Kle(this.getKeys()).toPermalink('matrix');
  }
}

module.exports = Via;
